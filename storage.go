package main

import (
		"github.com/go-redis/redis"
	"time"
	"log"
	"os"
)

var redisPassword = os.Getenv("REDISPASS")
var redisHost = os.Getenv("REDISHOST")

func getRedisClient() *redis.Client {
	return redis.NewClient(&redis.Options{
		Addr:     redisHost,
		Password: redisPassword,//"buNSG1vfIIrLyT7LyGnesywdoijtyddo",
		DB:       0,
	})
}
func saveToStorage(key string, value interface{}, duration time.Duration) error{
	client := getRedisClient()
	return client.Set(key, value, duration).Err()
	//if err != nil {
	//	log.Println(err)
	//}
}


func getFromStorage(key string) (val string) {
	client := getRedisClient()
	val, err := client.Get(key).Result()
	if err == redis.Nil {
		log.Println(key + " does not exist")
	} else if err != nil {
		log.Println(err)
	} else {
		log.Printf("Got from storage: %v", val)
	}
	return
}

func dropFromStorage (key string) {
	client := getRedisClient()
	client.Del(key).Err()

}