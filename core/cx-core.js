'use strict'

function isEmpty(object) {
    if (object == null || object === undefined) { return true; }
    if (JSON.stringify(object) === '{}') { return true; }
    return false;
}


function isLive() {
    // TODO: find better way to define if live 
    return process.env.PORT !== undefined;
}


module.exports = {

    live: isLive,
    empty: isEmpty,
}
