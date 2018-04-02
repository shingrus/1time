**Create Link**
----
  Creates new one-time link with encrypted message.

* **URL**

  /api/unsecSave

* **Method:**

  `POST`

*  **URL Params**

  None

* **Data Params**
  **Content:**
  `{
        secretMessage string,
        duration      int
   }`

duration  - Seconds to store the secret message. Default is 7 days. Maximum is 30 days(30*86400)



* **Success Response:**

  * **Code:** 200
    **Content:**
    `{
        status: "ok",
        newLink : "/v/#12345678"
    }`
To view this message online you should concatenate two strings: "https://1time.it" and value of the newLink parameter. For example: https://1time.it/v/#12345678

* **Error Response:**

  * **Code:** 200
    **Content:** `{
        status: "error",
        NewLink: ""
    }`

* **Sample Call:**

  ```shell
   curl -X POST -H 'content-type: application/json' 'https://1time.it/api/unsecSave' -d \
   '{"secretMessage":"test Message"}'
  ```