'use strict'

const _core = require('./cx-core');

const _monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//const _monthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const _weekDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


class TimeSpan {
    #ms = null;
    constructor(milliseconds) {
        this.#ms = parseInt(milliseconds);
    }

    get milliseconds() {
        if (isNaN(this.#ms)) { return 0; }
        return this.#ms;
    } set milliseconds(val) {
        this.#ms = parseInt(val);
    }

    get seconds() {
        return parseFloat(this.milliseconds) / 1000;
    } set seconds(val) {
        this.milliseconds = parseInt(value * 1000);
    }

    get minutes() {
        return parseFloat(this.seconds) / 60;
    } set minutes(val) {
        this.seconds = parseFloat(value * 60);
    }

    get hours() {
        return parseFloat(this.minutes) / 60;
    } set hours(val) {
        this.minutes = parseFloat(value * 60);
    }

    get days() {
        return parseFloat(this.hours) / 24;
    } set days(val) {
        this.hours = parseFloat(value * 24);
    }

    toString() {
        if (this.minutes < 1) {
            return this.seconds.toFixed(0) + 's';
        } else if (this.minutes < 60) {
            var m = Math.floor(this.minutes);
            var s = this.seconds - (m * 60);
            if (s >= 60) { s = 0; m += 1; }
            return m.toFixed(0) + 'm ' + s.toFixed(0) + 's';
        } else if (this.hours < 24) {
            var h = Math.floor(this.hours);
            var m = this.minutes - (h * 60);
            var s = this.seconds - (h * 60 * 60);
            if (s >= 60) { s = 0; m += 1; }
            return h.toFixed(0) + 'h ' + m.toFixed(0) + 'm ' + s.toFixed(0) + 's';
        } else if (this.days < 8) {
            var d = Math.floor(this.days);
            var h = this.hours - (d * 24);
            var m = this.minutes - (d * 24 * 60);
            var s = this.seconds - (d * 24 * 60 * 60);
            if (s >= 60) { s = 0; m += 1; }
            return d.toFixed(0) + 'd ' + h.toFixed(0) + 'h ' + m.toFixed(0) + 'm ' + s.toFixed(0) + 's';
        } else {
            return 'over ' + Math.floor(this.days).toFixed(0) + ' days';
        }
    }   


}

class CxDate {
    #o = null;
    #d = null;
    #dRaw = null;
    constructor(options) {
        if (!options) { options = { date: new Date() } }
        
        if (_core.isObj(options)) {
            this.setDates(options.date);
        } else {
            this.setDates(options);
            options = { date: options };
        }

        this.#o = options;
       
    }

    get date() {
        return this.#d
    } set date(value) {
        if (value.constructor.name !== 'Date') { throw new Error(`Invalid value passed [${value}], must be a Date object!`); }
        this.setDates(value);
    }

    get dateRaw() {
        return this.#dRaw
    } set dateRaw(value) {
        if (value.constructor.name !== 'String') { throw new Error(`Invalid value passed [${value}], must be a String object!`); }
        this.setDates(value);
    }

    get month() {
        return this.date.getMonth() + 1;
    }

    get year() {
        return this.date.getFullYear();
    }


    setDates(value) {
        if (!value) { throw new Error(`Invalid CxDate setDates value cannot be null or empty`);}
        if (value.constructor.name === 'Date') {
            this.#d = value;
            this.#dRaw = _formatEx({ date: value, showTime: this.#o.showTime });
        } else if (value.constructor.name === 'String') {
            this.#dRaw = value;
            this.#d = _parse(value);
        } else {
            throw new Error(`Invalid CxDate setDates value [${value}]`);
        }
    }
    
}



function _format(options) {
    if (options === null || options == undefined) { options = {}; }
    if (options.constructor.name === 'Date') { options.date = options; }
    if (!options.date) { options.date = new Date(); }
    options.d = options.date;
    if (options.dateSep === undefined || options.dateSep === null) { options.dateSep = '-'; }
    if (options.timeSep === undefined || options.timeSep === null) { options.timeSep = ':'; }
    if (options.dateTimeSep === undefined || options.dateTimeSep === null) { options.dateTimeSep = ' '; }
    //    
    //var d = new Date();
    var yy = options.d.getFullYear();
    var MM = options.d.getMonth() + 1;
    if (MM < 10) { MM = '0' + MM.toString(); }
    var dd = options.d.getDate();
    if (dd < 10) { dd = '0' + dd.toString(); }
    var hh = options.d.getHours();
    if (hh < 10) { hh = '0' + hh.toString(); }
    var mm = options.d.getMinutes();
    if (mm < 10) { mm = '0' + mm.toString(); }
    var ss = options.d.getSeconds();
    if (ss < 10) { ss = '0' + ss.toString(); }
    //
    var dateStr = '';
    if (options.inverted) {
        dateStr = yy + options.dateSep + MM + options.dateSep + dd;
    } else {
        dateStr = dd + options.dateSep + MM + options.dateSep + yy;
    }
    if (options.showTime) {
        dateStr += (options.dateTimeSep + hh + options.timeSep + mm + options.timeSep + ss);
    }
    return dateStr;
}

function _formatEx(options) {
    if (options === null || options == undefined) { options = {}; }
    if (options.constructor.name === 'Date') { options.date = options; }
    if (options.dateSep === undefined || options.dateSep === null) { options.dateSep = '.'; }
    if (options.timeSep === undefined || options.timeSep === null) { options.timeSep = '.'; }
    if (options.dateTimeSep === undefined || options.dateTimeSep === null) { options.dateTimeSep = '_'; }
    if (options.showTime === undefined || options.showTime === null) { options.showTime = true; }
    if (options.inverted === undefined || options.inverted === null) { options.inverted = true; }
    return _format(options);
}



function _parse(options) {
    var dateParts = options.split('-');
    return new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
}


module.exports = {
    now: function () {
        return new Date();
    },
    toNow: function (fromDate) {
        if (!fromDate) { return new TimeSpan(); }
        return new TimeSpan(this.now() - fromDate);
    },
    format: _format,
    formatEx: _formatEx,

    parseEx: _parse,

    monthName: function (month, short) {
        if (month < 0 || month > 11) { return 'Invalid Month'; }
        if (short) { return _monthNames[month].substring(0, 3); }
        return _monthNames[month];
    },

    TimeSpan: TimeSpan,
    CxDate: CxDate
}

Date.prototype.hasTime = function () {
    var t = ((this.getHours() + this.getMinutes() + this.getSeconds() + this.getMilliseconds()));
    return (t != 0 && t != 1);
}
Date.prototype.dropTime = function () {
    this.setHours(0, 0, 0, 0);
    return this;
}
Date.prototype.addMinutes = function (minsCount) {
    var value = this.getTime();
    value += (minsCount * 60000);
    return new Date(value);
}
Date.prototype.addHours = function (hoursCount) {
    var value = this.getTime();
    value += ((hoursCount * 60000) * 60);
    return new Date(value);
}
Date.prototype.addDays = function (daysCount) {
    var value = this.valueOf();
    value += 86400000 * daysCount;
    return new Date(value);
}
Date.prototype.addWeeks = function (weeksCount, excludeLastDay) {
    var value = this.valueOf();
    value += 86400000 * (weeksCount * 7);
    var addDays = (weeksCount < 0) ? addDays = 1 : addDays = -1;
    return (excludeLastDay) ? new Date(value).addDays(addDays) : new Date(value);
}

Date.prototype.addMonths = function (monthsCount, excludeLastDay) {
    var sign = (monthsCount < 0) ? -1 : 1;
    // get years to add or subtract
    var y_add = (Math.floor(Math.abs(monthsCount) / 12)) * sign;
    // get months to add or subtract
    var m_add = (Math.abs(monthsCount) - (Math.abs(y_add) * 12)) * sign;
    // calculate new month
    var m = (this.getMonth()) + m_add;
    if (m > 11) { m = m - 12; y_add += 1; }
    if (m < 0) { m = 12 + m; y_add -= 1; }
    // calculate new year
    var y = this.getFullYear() + y_add;
    // calculate new day
    var d = Math.min(this.getDate(), this.getDaysInMonth(y, m));
    // create new date
    var value = new Date(y, m, d);
    return (excludeLastDay) ? value.addDays(-sign) : value;
}

Date.prototype.isLeapYear = function (year) {
    if (!year) { year = this.getFullYear(); }
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
}
//Date.prototype.isLeapYear = function () { return Date.isLeapYear(this.getFullYear()); }

Date.prototype.getDaysInMonthDays = function (year, month) {
    return [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
}
Date.prototype.getDaysInMonth = function () {
    return this.getDaysInMonthDays(this.getFullYear(), this.getMonth());
}

Date.prototype.now = function () {
    return new Date();
}
Date.prototype.today = function () {
    var today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}
Date.prototype.getWeekNumber = function () {
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}
