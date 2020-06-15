'use strict'

const _core = require('./core/cx-core');
const _core_date = require('./core/cx-core-date');
const _core_list = require('./core/cx-core-lists');
const _core_text = require('./core/cx-core-text');

//var exportObject = {};
//Object.assign(exportObject, _core, _core_list, _core_text);
_core.text = _core_text;
_core.list = _core_list;
_core.date = _core_date;

module.exports = _core;
