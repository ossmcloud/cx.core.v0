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


function fromCamelCase(camelCasingString) {
    if (!camelCasingString) { return ''; }
    camelCasingString = camelCasingString.replaceAll('_', ' ').trim();

    
    var parsedString = camelCasingString[0].toLowerCase();
    for (var cx = 1; cx < camelCasingString.length; cx++) {
        
        if (camelCasingString[cx].toUpperCase() == camelCasingString[cx]) {
            // check if prev letter is upper case
            if (camelCasingString[cx - 1].toUpperCase() == camelCasingString[cx - 1]) {
                // do nothing
            } else {
                // if not we separate
                parsedString += ' ';
            }
        }
        parsedString += camelCasingString[cx].toLowerCase();
    }
    return parsedString;
}


module.exports = {
    trimRight: trimRight,
    bytesToString: bytesToString,

    decodeBase64String: decodeBase64String,
    encodeBase64String: encodeBase64String,

    toBase64: encodeBase64String,
    fromBase64: decodeBase64String,

    fromCamelCase: fromCamelCase,
}

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
}
String.prototype.fromCamelCase = function () {
    return fromCamelCase(this);
}