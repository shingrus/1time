package main

import (
	"github.com/go-redis/redis"
	"time"
	"log"
	"os"
	"strconv"
)

var redisPassword = os.Getenv("REDISPASS")
var redisHost = os.Getenv("REDISHOST")

const globalIncrementalKey = "nextIncrementalKey"

func getRedisClient() *redis.Client {
	return redis.NewClient(&redis.Options{
		Addr:     redisHost,
		Password: redisPassword, //"buNSG1vfIIrLyT7LyGnesywdoijtyddo",
		DB:       0,
	})
}
func saveToStorage(value interface{}, duration time.Duration) (newKey string, err error) {
	client := getRedisClient()
	val, err := client.Incr(globalIncrementalKey).Result()
	if err != nil {
		log.Println(err)
	} else {
		newKey = strconv.FormatInt(val, 16)
		log.Printf("Got new key storage: %v", newKey)
	}

	return newKey, client.Set(getStoreKey(newKey), value, duration).Err()
	//if err != nil {
	//	log.Println(err)
	//}
}

func getStoreKey(key string) (string) {
	return "messageKey" + key
}

func getMessageFromStorage(key string) (val string) {
	client := getRedisClient()
	val, err := client.Get(getStoreKey(key)).Result()
	if err == redis.Nil {
		log.Println(getStoreKey(key) + " does not exist")
	} else if err != nil {
		log.Println(err)
	} else {
		log.Printf("Got from storage: %v", val)
	}
	return
}

func dropFromStorage(key string) {
	client := getRedisClient()
	client.Del(getStoreKey(key)).Err()

}
