'use strict'

function trimRight(str, char) {
    if (!str) { return ''; }
    if (!char) { char = ' '; }
    var lastChar = str.substring(str.length - 1);
    if (lastChar != char) { return str; }
    return str.substring(0, str.length - 1);
}

function decodeBase64String(base64String) {
    if (!base64String) { return ''; }
    var buff = Buffer.from(base64String, 'base64');
    return buff.toString('ascii');
}

function encodeBase64String(str) {
    if (!str) { str = ''; }
    var buff = Buffer.from(str, 'utf8');
    return buff.toString('base64');
}

function bytesToString(bytes) {
    var buffer = Buffer.from(bytes);
    return buffer.toString('utf-8');
}



module.exports = {
    trimRight: trimRight,
    bytesToString: bytesToString,

    decodeBase64String: decodeBase64String,
    encodeBase64String: encodeBase64String,

    toBase64: encodeBase64String,
    fromBase64: decodeBase64String
}

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
}