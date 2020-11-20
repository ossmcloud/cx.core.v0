'use strict';

class CxError extends Error {
    constructor(message) {
        super(message);
    }

    get cxError() { return true; }
}

module.exports = {
    CxError: CxError
};