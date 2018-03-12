
export var Constants = {
    randomKeyLen:6,
};

const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
// create a key for symmetric encryption
// pass in the desired length of your key
export  function getRandomString(stringLen) {
    let randomstring = '';

    for (let i = 0; i < stringLen; i++) {
        let rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars[rnum];
    }
    return randomstring;
}




