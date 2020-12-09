'use strict'

function isEmpty(object) {
    if (object == null || object === undefined) { return true; }
    if (JSON.stringify(object) === '{}') { return true; }
    return false;
}

function toArray(object) {
    if (isEmpty(object)) { return []; }
    if (Array.isArray(object)) { return object; }
    return [object];
}

function findInArray(array, keyName, keyValue, throwError) {
    var item = null;
    each(array, function (a, idx) {
        if (a[keyName] == undefined) { throw new Error('Array item does not have property: ' + keyName); }
        if (a[keyName] === keyValue) {
            item = array[idx];
            return false;
        }
        return true;
    });
    if (item == null && throwError) { throw new Error('Cannot find item in iterable [key]:' + keyName + ' using [keyValue]: ' + keyValue); }
    return item;
}

function sortArray(array, fieldName, isString, descending) {
    array.sort(function (a, b) {
        var fieldValueA = a[fieldName];
        var fieldValueB = b[fieldName];
        if (isString) {
            fieldValueA = fieldValueA.toString().toLowerCase();
            fieldValueB = fieldValueB.toString().toLowerCase();
        }
        if (fieldValueA < fieldValueB)
            return (descending) ? 1 : -1;
        if (fieldValueA > fieldValueB)
            return (descending) ? -1 : 1;
        return 0;
    });
}

function each(iterable, callback, t) {
    if (!callback) { return; }
    for (var eachIdx = 0; eachIdx < iterable.length; eachIdx++) {
        var response = callback(iterable[eachIdx], eachIdx, t);
        if (response !== undefined && !response) { break; }
    }
}

function eachEx(t, iterable, callback) {
    if (!callback) { return; }
    for (var eachIdx = 0; eachIdx < iterable.length; eachIdx++) {
        var response = callback(iterable[eachIdx], eachIdx, t);
        if (response !== undefined && !response) { break; }
    }
}

function eachProp(object, callback) {
    if (!callback) { return; }
    for (const key in object) {
        if (!object.hasOwnProperty(key)) { continue; }

        var propertyType = typeof object[key];
        if (propertyType == 'function') { continue; }

        var response = callback(key, object[key]);
        if (response === false) { break; }
    }
}




module.exports = {
    each: each,
    eachEx: eachEx,
    eachProp: eachProp,

    toArray: toArray,
    findInArray: findInArray,
    sortArray: sortArray,


}
