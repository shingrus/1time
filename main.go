package main

import (
	"net/http"
	"log"
	"os"
)

const defaultDuration = 86400*7 //keep for 1 week
const randKeyLen = 6

const secretMessageFieldName = "secretMessage"
const secretKeyFieldName = "secretKey"
const secretMessageMaxLen = 64 * 1024
var _, DEBUG=os.LookupEnv("DEBUG")

func main() {
	http.HandleFunc("/", indexHandler)
	http.HandleFunc("/saveSecret", saveSecretHandler)
	http.HandleFunc("/view/", viewHandler)
	http.HandleFunc("/api/", apiHandler)


	log.Fatal(http.ListenAndServe("127.0.0.1:8080", nil))
}
