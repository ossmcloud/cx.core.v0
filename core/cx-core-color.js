'use strict'
var _chartColors = [
    '255,0,0',
    '0,255,0',
    '0,0,255',
    '255,255,0',
    '255,0,255',
    '0,255,255',
    '125,125,125',
];
var _currentChartColor = -1;


module.exports = {
    chartColors: _chartColors,
    getChartColor() {
        _currentChartColor++;
        if (_currentChartColor >= _chartColors.length) { _currentChartColor = 0; }
        return _chartColors[_currentChartColor];
    }


}