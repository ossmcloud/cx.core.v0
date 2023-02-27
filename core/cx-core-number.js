'use strict'


// NOTE: _formatNumber and _formatMoney are equivalent (2 different ways)
//       only difference is that _formatMoney has 2 decimals by default while _formatNumber has none
function formatNumber(number, decimals, dec_point, thousands_sep) {
    // Strip all characters but numerical ones.
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    var ret = s.join(dec);
    console.log(ret);
    return ret;
}
function formatMoney(number, c, d, t) {
    var n = number,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    var ret = s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    return ret;
}

module.exports = {
    formatNumber: formatNumber,
    formatMoney: formatMoney
}

Number.prototype.formatMoney = function (decimals, dec_point, thousands_sep) {
    var target = this;
    return formatMoney(this, decimals, dec_point, thousands_sep);
}

Number.prototype.formatNumber = function (decimals, dec_point, thousands_sep) {
    var target = this;
    return formatNumber(this, decimals, dec_point, thousands_sep);
}

Number.prototype.roundNumber = function (decimals) {
    if (decimals == undefined) { decimals = 2; }
    var factor = 10 ** decimals;
    return Math.round(this * factor) / factor;
}