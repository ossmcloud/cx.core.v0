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
    if (object === null || object === undefined) { return false; }
    if (object.constructor.name == 'Date') { return false; }
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

//
// @@NOTE: this function returns an array of property names from a class
//         the key here is Object.getOwnPropertyNames(Object.getPrototypeOf(class))
//         we do it recursively to handle classes as properties
// 
function getClassMethodNames(klass, methodType) {
    const isGetter = (x, name) => (Object.getOwnPropertyDescriptor(x, name) || {}).get;
    const isFunction = (x, name) => typeof x[name] === 'function';
    const deepFunctions = x =>
        x !== Object.prototype &&
        Object.getOwnPropertyNames(x)
            .filter(name => {
                if (!methodType || methodType == 'property') { return isGetter(x, name); }
                if (methodType == 'function') { return isFunction(x, name); }
                return false;
            }).concat(deepFunctions(Object.getPrototypeOf(x)) || []);
    const distinctDeepFunctions = klass => Array.from(new Set(deepFunctions(klass)));
    const allMethods = typeof klass.prototype === "undefined" ? distinctDeepFunctions(klass) : Object.getOwnPropertyNames(klass.prototype);
    return allMethods.filter(name => name !== 'constructor' && !name.startsWith('__'))
}
//
// Classes can be serialized but members that are private won't appear, and that's because members in classes are actually functions so JSON.stringify will ignore them
// This function converts a class to a Json object so it can be serialized fine
//
function classToObject(c) {
    var o = {};
    var propertyNames = getClassMethodNames(c);
    for (var px = 0; px < propertyNames.length; px++) {
        var k = propertyNames[px];
        if (k == 'cx' || k == 'db') { continue; }
        if (k == 'fields') {
            k = k;
        }

        if (isObject(c[k])) {
            if (c[k]?.constructor.name == 'Object') {
                o[k] = {}
                for (var kk in c[k]) {
                    o[k][kk] = classToObject(c[k][kk]);
                }
            } else {
                o[k] = classToObject(c[k]);
            }


        } else if (Array.isArray(c[k])) {
            o[k] = [];
            for (var x = 0; x < c[k].length; x++) {
                o[k].push(classToObject(c[k][x]));
            }
        } else {
            o[k] = c[k];
        }
    }
    return o;
}

function arrayToObject(a) {
    if (!a) { return null; }
    var res = [];
    for (var ax = 0; ax < a.length; ax++) {
        res.push(classToObject(a[ax]));
    }
    return res;
}

module.exports = {
    getAllKeys: getAllKeys,
    live: isLive,
    empty: isEmpty,
    isFunc: isFunction,
    isObj: isObject,
    bufferToString: bufferToString,
    classToObject: classToObject,
    arrayToObject: arrayToObject,
}
