'use strict';

class CxError extends Error {
    constructor(message) {
        super(message);
    }

    get cxError() { return true; }
}

class CxNullArgError extends CxError {
    #argName = null;
    constructor(argName) {
        super(`argument ${argName} cannot be null`);
    }

    get argName() {
        return this.#argName;
    }
}

module.exports = {
    CxError: CxError,
    CxNullArgError: CxNullArgError,
};