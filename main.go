package main

import (
	"net/http"
	"log"
)

const defaultDuration = 600 //seconds
const secretKeyLen = 6

const secretMessageFieldName = "secretMessage"
const secretKeyFieldName = "secretKey"
const secretMessageMaxLen = 64 * 1024

func main() {
	http.HandleFunc("/", indexHandler)
	http.HandleFunc("/saveSecret", saveSecretHandler)
	http.HandleFunc("/view/", viewHandler)
	http.HandleFunc("/api/", apiHandler)


	log.Fatal(http.ListenAndServe("127.0.0.1:8080", nil))
}
