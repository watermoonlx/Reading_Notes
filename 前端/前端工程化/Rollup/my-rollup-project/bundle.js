'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _ = _interopDefault(require('lodash'));

var result = _.add(1, 2);
var main = (function () {
    console.log(result);
});

module.exports = main;
