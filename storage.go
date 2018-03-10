package main

import (
		"github.com/go-redis/redis"
	"time"
	"log"
	"os"
)

var redisPassword = os.Getenv("REDISPASSWORD")

func getRedisClient() *redis.Client {
	return redis.NewClient(&redis.Options{
		Addr:     "redis-17267.c14.us-east-1-2.ec2.cloud.redislabs.com:17267",
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