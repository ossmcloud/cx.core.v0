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

function bytesToString(bytes) {
    var buffer = Buffer.from(bytes);
    return buffer.toString('utf-8');
}



module.exports = {

    trimRight: trimRight,

    decodeBase64String: decodeBase64String,
    bytesToString: bytesToString,

}

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
}