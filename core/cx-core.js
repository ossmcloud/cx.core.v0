'use strict'

function isLive() {
    // @REVIEW: find better way to define if live 
    return process.env.PORT !== undefined;
}

function isEmpty(object) {
    if (object == null || object === undefined) { return true; }
    if (JSON.stringify(object) === '{}') { return true; }
    return false;
}

function isFunction(object) {
    if (object === null) { return false; }
    return ((typeof object === 'function'));
}

function isObject(object) {
    if (object === null) { return false; }
    return ((typeof object === 'function') || (typeof object === 'object'));
}

function getAllKeys(obj, depth) {
    if (!depth) { depth = 0; }
    var o = obj;
    var props = [];
    if (o) {
        for (var c = 0; c <= depth; c++) {
            Object.getOwnPropertyNames(o).forEach(p => props.push(p));
            if (o.constructor === Object) { break; }
            o = Object.getPrototypeOf(o);
        }
    }
    return props;
}

function bufferToString(buf) {
    if (!buf) { return ''; }
    return `0x${buf.toString('hex')}`
}



module.exports = {
    getAllKeys: getAllKeys,
    live: isLive,
    empty: isEmpty,
    isFunc: isFunction,
    isObj: isObject,
    bufferToString: bufferToString,
}
