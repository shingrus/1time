**Create Link Plain data over internet**
----
  Creates new link with encrypted message.

* **URL**

  /api/unsecSave

* **Method:**

  `POST`

*  **URL Params**

  None

* **Data Params**
  **Content:**<br>
  `{
        secretMessage string,
        duration      int
   }`

* **Success Response:**

  * **Code:** 200
    **Content:**
    `{
        status: "ok",
        newLink : "/v/#12345678"
    }`

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