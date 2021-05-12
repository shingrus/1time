package main

import (
	"log"
	"os"
	"strconv"
	"time"

	"github.com/go-redis/redis"
)

var redisPassword = os.Getenv("REDISPASS")
var redisHost = os.Getenv("REDISHOST")

const globalIncrementalKey = "nextIncrementalKey"

func getRedisClient() *redis.Client {
	return redis.NewClient(&redis.Options{
		Addr:     redisHost,
		Password: redisPassword,
		DB:       0,
	})
}

/*
store value with global uniq key
return key string(hexademical number)
error in case of failure
*/
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
}

/*
function constucts key for messages using format like 'messageKey<XX>'
where XXXXXX is a hex-number
*/
func getStoreKey(key string) string {
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
