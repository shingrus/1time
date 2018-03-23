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
	Encrypted bool   `json:"encrypted"` //obsolete all messages are encrypted
	Message   string `json:"message"`
	HashedKey string `json:"hashedKey"`
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
	randKey := RandStringBytesMaskImprSrc(randKeyLen)

	var duration time.Duration
	if d := r.Form.Get("duration"); d != "" {
		t, _ := strconv.Atoi(d)
		duration = time.Second * time.Duration(t)
	}
	if duration <= 0 || duration > 86400 {
		duration = defaultDuration * time.Second
	}

	encryptKey := secretkey + randKey

	var newMessage StoredMessage

	//encrypt

	newkey := get32key(encryptKey)
	newMessage.Message = encrypt([]byte(newkey), encryptKey+secretMessage)
	newMessage.Encrypted = true

	value, _ := json.Marshal(newMessage)
	//store to storage

	storeKey, err := saveToStorage(value, time.Second*duration)
	if err != nil {
		showError(500, "Storage error", w)
		return
	}

	t, err := template.ParseFiles("templates/result.html")
	if err != nil {
		log.Panic(err)
	}
	linkKey := randKey + storeKey

	data := struct {
		OneTimeLink string
		SecretKey   string
	}{linkKey, secretkey}
	t.Execute(w, data)

}

func viewHandler(w http.ResponseWriter, r *http.Request) {
	key := r.URL.Path[len("/view/"):]
	if len(key) <= randKeyLen {
		log.Printf("Invalid  secretKey: %v", key)
		return
	}
	randKey := key[:randKeyLen]
	storeKey := key[randKeyLen:]
	val := getMessageFromStorage(storeKey)
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
				encryptKey := secretKey + randKey

				keylen := len(encryptKey)
				if keylen == 0 {
					http.Redirect(w, r, "/view/"+key, http.StatusSeeOther)
					return
				}

				if storedMessage.Encrypted {
					newKey := get32key(encryptKey)

					secretMessage := decrypt([]byte(newKey), storedMessage.Message)
					if len(secretMessage) > keylen && secretMessage[0:keylen] == encryptKey {
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

func apiSaveSecret(r *http.Request) (responseCode int, response []byte) {
	responseCode = 200

	jResponse := struct {
		Status string `json:"status"`
		NewId  string `json:"newId"`
	}{
		Status: "error",
		//NewId:strconv.FormatInt(32, 16)
		NewId: "0",
	}

	var payload struct {
		SecretMessage string `json:"secretMessage"`
		HashedKey     string `json:"hashedKey"`
		Duration      int    `json:"duration"`
	}
	dec := json.NewDecoder(r.Body)

	if dec.More() {
		err := dec.Decode(&payload)
		if err == nil {
			if len(payload.SecretMessage) > 0 {

				newMessage := StoredMessage{
					Encrypted: true,
					Message:   payload.SecretMessage,
					HashedKey: payload.HashedKey,
				}

				if payload.Duration <= 0 || payload.Duration > 86400*30 {
					payload.Duration = defaultDuration
				}


				log.Printf("paylaod -> storage: %v, Hashedkey: %v, Duration: %v\n", payload.SecretMessage, payload.HashedKey, payload.Duration	)
				valueToStore, _ := json.Marshal(newMessage)
				storeKey, err := saveToStorage(valueToStore, time.Duration(payload.Duration)*time.Second)
				if err == nil {
					jResponse.NewId = storeKey
					jResponse.Status = "ok"
				} else {
					log.Println(err)
				}

			}
		} else {
			log.Println(err)
		}
		//log.Printf("Got payload: %v\n", payload)
	}
	response, _ = json.Marshal(jResponse)
	return
}

func apiGetMessage(r *http.Request) (responseCode int, response []byte) {
	responseCode = 200

	jResponse := struct {
		Status         string `json:"status"`
		CryptedMessage string `json:"cryptedMessage"`
	}{
		Status: "error",
		//NewId:strconv.FormatInt(32, 16)
		CryptedMessage: "0",
	}

	var payload struct {
		Id        string `json:"id"`
		HashedKey string `json:"hashedKey"`
	}
	dec := json.NewDecoder(r.Body)

	if dec.More() {
		err := dec.Decode(&payload)
		if err == nil {
			if len(payload.Id) > 0 && len(payload.HashedKey) > 0 {
				log.Printf("payload <- storage: %v, %v\n", payload.Id, payload.HashedKey)
				val := getMessageFromStorage(payload.Id)
				if len(val) > 0 {

					var storedMessage StoredMessage
					err := json.Unmarshal([]byte(val), &storedMessage)
					if err == nil {

						if (storedMessage.HashedKey == payload.HashedKey) {
							jResponse.Status = "ok"
							jResponse.CryptedMessage = storedMessage.Message

							dropFromStorage(payload.Id)
						} else {
							jResponse.Status = "wrong key"
							log.Println("Hashes aren't equal")
						}
					}
				} else {
					jResponse.Status = "no message"
				}

			}
		}
	}
	response, _ = json.Marshal(jResponse)
	return
}

func apiHandler(w http.ResponseWriter, r *http.Request) {
	responseCode := 400
	var response []byte
	w.Header().Set("Content-Type", "application/json")

	if DEBUG {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "	content-type, accept")
	}

	apiCall := r.URL.Path[len("/api/"):]
	log.Println("Api call: " + apiCall)
	switch apiCall {
	case "saveSecret":
		responseCode, response = apiSaveSecret(r)
	case "get":
		responseCode, response = apiGetMessage(r)
	default:
		jResponse := struct {
			Code        int    `json:"code"`
			Description string `json:"description"`
		}{responseCode, "Not implemented yet"}
		response, _ = json.Marshal(jResponse)
	}
	w.WriteHeader(responseCode)
	w.Write(response)

}
