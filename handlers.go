package main

import (
	"net/http"
	"html/template"
	"encoding/json"
	"log"
	"time"
	"strconv"
)

type StoredMessage struct {
	Encrypted bool   `json:"encrypted"`
	Message   string `json:"message"`
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	//t := template.New("index")
	t, err := template.ParseFiles("templates/form.html")
	if err != nil {
		log.Panic(err)
	}
	t.Execute(w, "")

}

func saveSecretHandler(w http.ResponseWriter, r *http.Request) {

	if err := r.ParseForm(); err != nil {
		log.Println(err)
	}
	secretMessage := r.Form.Get(secretMessageFieldName)

	if secretMessage == "" {
		http.Redirect(w, r, "/?empty", http.StatusSeeOther)
		return
	}
	if len(secretMessage) > secretMessageMaxLen {
		secretMessage = secretMessage[0:secretMessageMaxLen]
	}
	secretkey := r.Form.Get(secretKeyFieldName)
	var duration time.Duration
	if d := r.Form.Get("duration"); d != "" {
		t, _ := strconv.Atoi(d)
		duration = time.Second * time.Duration(t)
	}
	if duration <= 0 || duration > 86400 {
		duration = defaultDuration * time.Second
	}

	var newMessage StoredMessage

	//encrypt
	if secretkey != "" {
		newkey := get64key(secretkey)
		newMessage.Message = encrypt([]byte(newkey), secretkey+secretMessage)
		newMessage.Encrypted = true
	} else {
		newMessage.Message = secretMessage
	}

	value, _ := json.Marshal(newMessage)
	//store to storage
	linkKey := RandStringBytesMaskImprSrc(secretKeyLen)
	err := saveToStorage(linkKey, value, time.Second*duration)
	if err != nil {
		showError(500, "Storage error", w)
		return
	}

	t, err := template.ParseFiles("templates/result.html")
	if err != nil {
		log.Panic(err)
	}

	data := struct {
		OneTimeLink string
		SecretKey   string
	}{linkKey, secretkey}
	t.Execute(w, data)

}

func viewHandler(w http.ResponseWriter, r *http.Request) {
	key := r.URL.Path[len("/view/"):]
	if len(key) == 0 || len(key) > secretKeyLen {
		log.Printf("Invalid view key: %v", key)
		return
	}

	val := getFromStorage(key)
	if len(val) > 0 {

		var storedMessage StoredMessage
		err := json.Unmarshal([]byte(val), &storedMessage)

		if err == nil {
			if (r.Method != "POST") {

				if storedMessage.Encrypted {
					if t, err := template.ParseFiles("templates/getkeyform.html"); err != nil {
						log.Panic(err)
					} else {

						data := struct {
							Key string
						}{key}
						t.Execute(w, data)
						return
					}
				} else {
					showMessage(key, storedMessage, w)
					return
				}

			} else {
				r.ParseForm()
				secretKey := r.Form.Get(secretKeyFieldName)
				//log.Printf("Geg key: %v, %v", key,r.URL.Path)

				if storedMessage.Encrypted {
					newKey := get64key(secretKey)
					keylen := len(secretKey)
					secretMessage := decrypt([]byte(newKey), storedMessage.Message)
					if len(secretMessage) > keylen && secretMessage[0:keylen] == secretKey {
						storedMessage.Message = secretMessage[keylen:]
						showMessage(key, storedMessage, w)
						return
					} else {
						http.Redirect(w, r, "/view/"+key, http.StatusSeeOther)
						return
					}
				} else {
					showMessage(secretKey, storedMessage, w)
					return
				}

			}
		} else {
			log.Println(err)
		}

	}
	http.Redirect(w, r, "/", http.StatusSeeOther)

}

func showMessage(key string, message StoredMessage, w http.ResponseWriter) {
	if t, err := template.ParseFiles("templates/view.html"); err != nil {
		log.Panic(err)
	} else {
		dropFromStorage(key)
		t.Execute(w, message)
	}
}

func showError(errorStatus int, text string, w http.ResponseWriter) {
	w.WriteHeader(errorStatus)
	w.Write([]byte(text))
}

func apiHandler(w http.ResponseWriter, r *http.Request) {
	responseCode := 501
	val := struct {
		Code        int    `json:"code"`
		Description string `json:"description"`
	}{responseCode, "Not implemented yet"}
	jval, _ := json.Marshal(val)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(responseCode)
	w.Write(jval)
}

//func icoHandler (w http.ResponseWriter, r *http.Request) {
//
//	body, _:= ioutil.ReadFile("ico/favicon-1024.png")
//	w.Write(body)
//
//
//}
