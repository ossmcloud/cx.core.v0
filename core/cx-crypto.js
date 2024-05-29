'use strict'

const _crypto = require('crypto');
const _cryptoJS = require("crypto-js");

// TRIBUTE: https://stackoverflow.com/questions/16270740/using-node-js-to-decrypt-data-encrypted-using-c-sharp
function deriveBytesFromPassword(password, salt, iterations, hashAlgorithm, keyLength) {
    if (keyLength < 1) throw new Error("keyLength must be greater than 1")
    if (iterations < 2) throw new Error("iterations must be greater than 2")

    const passwordWithSalt = Buffer.concat([Buffer.from(password, "utf-8"), salt])
    const hashMissingLastIteration = hashKeyNTimes(passwordWithSalt, iterations - 1, hashAlgorithm)
    let result = hashKeyNTimes(hashMissingLastIteration, 1, hashAlgorithm)
    result = extendResultIfNeeded(result, keyLength, hashMissingLastIteration, hashAlgorithm)

    return result.slice(0, keyLength)
}
function hashKeyNTimes(key, times, hashAlgorithm) {
    let result = key
    for (let i = 0; i < times; i++) {
        result = _crypto.createHash(hashAlgorithm).update(result).digest()
    }
    return result
}
function extendResultIfNeeded(result, keyLength, hashMissingLastIteration, hashAlgorithm) {
    let counter = 1
    while (result.length < keyLength) {
        result = Buffer.concat([result, calculateSpecialMicrosoftHash(hashMissingLastIteration, counter, hashAlgorithm)])
        counter++
    }
    return result
}
function calculateSpecialMicrosoftHash(hashMissingLastIteration, counter, hashAlgorithm) {
    // Here comes the magic: Convert an integer that increases from call to call to a string
    // and convert that string to utf-8 bytes. These bytes are than used to slightly modify a given base-hash.
    // The modified hash is than piped through the hash algorithm.
    // Note: The PasswordDeriveBytes algorithm converts each character to utf-16 and then drops the second byte.
    const prefixCalculatedByCounter = Buffer.from(counter.toString(), "utf-8")
    const inputForAdditionalHashIteration = Buffer.concat([prefixCalculatedByCounter, hashMissingLastIteration])
    return _crypto.createHash(hashAlgorithm).update(inputForAdditionalHashIteration).digest()
}

function Aes() {
    const _iv = _cryptoJS.enc.Utf8.parse('tu89geji340t89u2');

    function generateCodeChallenge(code_verifier) {
        return base64URL(_cryptoJS.SHA256(code_verifier))
    }
    function base64URL(string) {
        return string.toString(_cryptoJS.enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
    }

    function generateCodeVerifier() {
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-_~'
        // roughly between 43 and 128
        var length = Math.floor(Math.random() * 80) + 44;
        var codeVerifier = '';
        for (var l = 0; l < length; l++){
            codeVerifier += chars[Math.floor(Math.random() * chars.length)];
        }
        return codeVerifier;
    }

    return {
        generateCodeVerifier: generateCodeVerifier,
        generateCodeChallenge: generateCodeChallenge,

        SHA256: function (text) {
            return _cryptoJS.SHA256(text);
        },

        encrypt: function (text, pass, returnObject) {
            const msg = _cryptoJS.enc.Utf8.parse(text);
            var key = deriveBytesFromPassword(pass, new Uint8Array(), 100, 'sha1', 32);
            key = _cryptoJS.lib.WordArray.create(key);

            var encrypted = _cryptoJS.AES.encrypt(msg, key, {
                iv: _iv,
                mode: _cryptoJS.mode.CBC,
                padding: _cryptoJS.pad.Pkcs7,
                format: _cryptoJS.format.OpenSSL,
            }); 

            if (returnObject) { return encrypted; }

            return encrypted.toString();

        },

        decrypt: function (encryptedText, pass, returnBytes) {
            var key = deriveBytesFromPassword(pass, new Uint8Array(), 100, 'sha1', 32);
            key = _cryptoJS.lib.WordArray.create(key);
            var bytes = _cryptoJS.AES.decrypt(encryptedText, key, {
                iv: _iv,
                mode: _cryptoJS.mode.CBC,
                padding: _cryptoJS.pad.Pkcs7,
                format: _cryptoJS.format.OpenSSL,

            });
            if (returnBytes) {return bytes; }
            return bytes.toString(_cryptoJS.enc.Utf8);
        }
    }
}


module.exports = {
    Aes: new Aes()
};