'use strict'

const _core = require('./core/cx-core');
const _core_date = require('./core/cx-core-date');
const _core_list = require('./core/cx-core-lists');
const _core_text = require('./core/cx-core-text');
const _core_color = require('./core/cx-core-color');
const _core_number = require('./core/cx-core-number');
const _errors = require('./errors/cx-errors');

_core.text = _core_text;
_core.list = _core_list;
_core.date = _core_date;
_core.number = _core_number;
_core.errors = _errors;
_core.colors = _core_color;

module.exports = _core;
