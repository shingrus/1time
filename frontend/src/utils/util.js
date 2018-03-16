let arr = window.location.href.split("/");
let proto = process.env.NODE_ENV === 'development' ? "http:" : "https:";


export var Constants = {
    randomKeyLen: 12,
    defaultDuration: 7,
    proto: process.env.NODE_ENV === proto,
    apiBaseUrl: process.env.NODE_ENV === 'development' ? proto + "//localhost:8080/api/" : proto +"//"+ arr[2] + "/api/",
};

const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
// create a key for symmetric encryption
// pass in the desired length of your key
export function getRandomString(stringLen) {
    let randomstring = '';

    for (let i = 0; i < stringLen; i++) {
        let rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars[rnum];
    }
    return randomstring;
}




