var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var is = createCommonjsModule(function (module, exports) {
(function(root, factory) {    // eslint-disable-line no-extra-semi
    {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    }
}(commonjsGlobal, function() {

    // Baseline
    /* -------------------------------------------------------------------------- */

    // define 'is' object and current version
    var is = {};
    is.VERSION = '0.8.0';

    // define interfaces
    is.not = {};
    is.all = {};
    is.any = {};

    // cache some methods to call later on
    var toString = Object.prototype.toString;
    var slice = Array.prototype.slice;
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    // helper function which reverses the sense of predicate result
    function not(func) {
        return function() {
            return !func.apply(null, slice.call(arguments));
        };
    }

    // helper function which call predicate function per parameter and return true if all pass
    function all(func) {
        return function() {
            var params = getParams(arguments);
            var length = params.length;
            for (var i = 0; i < length; i++) {
                if (!func.call(null, params[i])) {
                    return false;
                }
            }
            return true;
        };
    }

    // helper function which call predicate function per parameter and return true if any pass
    function any(func) {
        return function() {
            var params = getParams(arguments);
            var length = params.length;
            for (var i = 0; i < length; i++) {
                if (func.call(null, params[i])) {
                    return true;
                }
            }
            return false;
        };
    }

    // build a 'comparator' object for various comparison checks
    var comparator = {
        '<': function(a, b) { return a < b; },
        '<=': function(a, b) { return a <= b; },
        '>': function(a, b) { return a > b; },
        '>=': function(a, b) { return a >= b; }
    };

    // helper function which compares a version to a range
    function compareVersion(version, range) {
        var string = (range + '');
        var n = +(string.match(/\d+/) || NaN);
        var op = string.match(/^[<>]=?|/)[0];
        return comparator[op] ? comparator[op](version, n) : (version == n || n !== n);
    }

    // helper function which extracts params from arguments
    function getParams(args) {
        var params = slice.call(args);
        var length = params.length;
        if (length === 1 && is.array(params[0])) {    // support array
            params = params[0];
        }
        return params;
    }

    // Type checks
    /* -------------------------------------------------------------------------- */

    // is a given value Arguments?
    is.arguments = function(value) {    // fallback check is for IE
        return toString.call(value) === '[object Arguments]' ||
            (value != null && typeof value === 'object' && 'callee' in value);
    };

    // is a given value Array?
    is.array = Array.isArray || function(value) {    // check native isArray first
        return toString.call(value) === '[object Array]';
    };

    // is a given value Boolean?
    is.boolean = function(value) {
        return value === true || value === false || toString.call(value) === '[object Boolean]';
    };

    // is a given value Char?
    is.char = function(value) {
        return is.string(value) && value.length === 1;
    };

    // is a given value Date Object?
    is.date = function(value) {
        return toString.call(value) === '[object Date]';
    };

    // is a given object a DOM node?
    is.domNode = function(object) {
        return is.object(object) && object.nodeType > 0;
    };

    // is a given value Error object?
    is.error = function(value) {
        return toString.call(value) === '[object Error]';
    };

    // is a given value function?
    is['function'] = function(value) {    // fallback check is for IE
        return toString.call(value) === '[object Function]' || typeof value === 'function';
    };

    // is given value a pure JSON object?
    is.json = function(value) {
        return toString.call(value) === '[object Object]';
    };

    // is a given value NaN?
    is.nan = function(value) {    // NaN is number :) Also it is the only value which does not equal itself
        return value !== value;
    };

    // is a given value null?
    is['null'] = function(value) {
        return value === null;
    };

    // is a given value number?
    is.number = function(value) {
        return is.not.nan(value) && toString.call(value) === '[object Number]';
    };

    // is a given value object?
    is.object = function(value) {
        return Object(value) === value;
    };

    // is a given value RegExp?
    is.regexp = function(value) {
        return toString.call(value) === '[object RegExp]';
    };

    // are given values same type?
    // prevent NaN, Number same type check
    is.sameType = function(value, other) {
        var tag = toString.call(value);
        if (tag !== toString.call(other)) {
            return false;
        }
        if (tag === '[object Number]') {
            return !is.any.nan(value, other) || is.all.nan(value, other);
        }
        return true;
    };
    // sameType method does not support 'all' and 'any' interfaces
    is.sameType.api = ['not'];

    // is a given value String?
    is.string = function(value) {
        return toString.call(value) === '[object String]';
    };

    // is a given value undefined?
    is.undefined = function(value) {
        return value === void 0;
    };

    // is a given value window?
    // setInterval method is only available for window object
    is.windowObject = function(value) {
        return value != null && typeof value === 'object' && 'setInterval' in value;
    };

    // Presence checks
    /* -------------------------------------------------------------------------- */

    //is a given value empty? Objects, arrays, strings
    is.empty = function(value) {
        if (is.object(value)) {
            var length = Object.getOwnPropertyNames(value).length;
            if (length === 0 || (length === 1 && is.array(value)) ||
                    (length === 2 && is.arguments(value))) {
                return true;
            }
            return false;
        }
        return value === '';
    };

    // is a given value existy?
    is.existy = function(value) {
        return value != null;
    };

    // is a given value falsy?
    is.falsy = function(value) {
        return !value;
    };

    // is a given value truthy?
    is.truthy = not(is.falsy);

    // Arithmetic checks
    /* -------------------------------------------------------------------------- */

    // is a given number above minimum parameter?
    is.above = function(n, min) {
        return is.all.number(n, min) && n > min;
    };
    // above method does not support 'all' and 'any' interfaces
    is.above.api = ['not'];

    // is a given number decimal?
    is.decimal = function(n) {
        return is.number(n) && n % 1 !== 0;
    };

    // are given values equal? supports numbers, strings, regexes, booleans
    // TODO: Add object and array support
    is.equal = function(value, other) {
        // check 0 and -0 equity with Infinity and -Infinity
        if (is.all.number(value, other)) {
            return value === other && 1 / value === 1 / other;
        }
        // check regexes as strings too
        if (is.all.string(value, other) || is.all.regexp(value, other)) {
            return '' + value === '' + other;
        }
        if (is.all.boolean(value, other)) {
            return value === other;
        }
        return false;
    };
    // equal method does not support 'all' and 'any' interfaces
    is.equal.api = ['not'];

    // is a given number even?
    is.even = function(n) {
        return is.number(n) && n % 2 === 0;
    };

    // is a given number finite?
    is.finite = isFinite || function(n) {
        return is.not.infinite(n) && is.not.nan(n);
    };

    // is a given number infinite?
    is.infinite = function(n) {
        return n === Infinity || n === -Infinity;
    };

    // is a given number integer?
    is.integer = function(n) {
        return is.number(n) && n % 1 === 0;
    };

    // is a given number negative?
    is.negative = function(n) {
        return is.number(n) && n < 0;
    };

    // is a given number odd?
    is.odd = function(n) {
        return is.number(n) && n % 2 === 1;
    };

    // is a given number positive?
    is.positive = function(n) {
        return is.number(n) && n > 0;
    };

    // is a given number above maximum parameter?
    is.under = function(n, max) {
        return is.all.number(n, max) && n < max;
    };
    // least method does not support 'all' and 'any' interfaces
    is.under.api = ['not'];

    // is a given number within minimum and maximum parameters?
    is.within = function(n, min, max) {
        return is.all.number(n, min, max) && n > min && n < max;
    };
    // within method does not support 'all' and 'any' interfaces
    is.within.api = ['not'];

    // Regexp checks
    /* -------------------------------------------------------------------------- */
    // Steven Levithan, Jan Goyvaerts: Regular Expressions Cookbook
    // Scott Gonzalez: Email address validation

    // dateString match m/d/yy and mm/dd/yyyy, allowing any combination of one or two digits for the day and month, and two or four digits for the year
    // eppPhone match extensible provisioning protocol format
    // nanpPhone match north american number plan format
    // time match hours, minutes, and seconds, 24-hour clock
    var regexes = {
        affirmative: /^(?:1|t(?:rue)?|y(?:es)?|ok(?:ay)?)$/,
        alphaNumeric: /^[A-Za-z0-9]+$/,
        caPostalCode: /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z]\s?[0-9][A-Z][0-9]$/,
        creditCard: /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/,
        dateString: /^(1[0-2]|0?[1-9])([\/-])(3[01]|[12][0-9]|0?[1-9])(?:\2)(?:[0-9]{2})?[0-9]{2}$/,
        email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i, // eslint-disable-line no-control-regex
        eppPhone: /^\+[0-9]{1,3}\.[0-9]{4,14}(?:x.+)?$/,
        hexadecimal: /^(?:0x)?[0-9a-fA-F]+$/,
        hexColor: /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
        ipv4: /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/,
        ipv6: /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i,
        nanpPhone: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
        socialSecurityNumber: /^(?!000|666)[0-8][0-9]{2}-?(?!00)[0-9]{2}-?(?!0000)[0-9]{4}$/,
        timeString: /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/,
        ukPostCode: /^[A-Z]{1,2}[0-9RCHNQ][0-9A-Z]?\s?[0-9][ABD-HJLNP-UW-Z]{2}$|^[A-Z]{2}-?[0-9]{4}$/,
        url: /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i,
        usZipCode: /^[0-9]{5}(?:-[0-9]{4})?$/
    };

    function regexpCheck(regexp, regexes) {
        is[regexp] = function(value) {
            return regexes[regexp].test(value);
        };
    }

    // create regexp checks methods from 'regexes' object
    for (var regexp in regexes) {
        if (regexes.hasOwnProperty(regexp)) {
            regexpCheck(regexp, regexes);
        }
    }

    // simplify IP checks by calling the regex helpers for IPv4 and IPv6
    is.ip = function(value) {
        return is.ipv4(value) || is.ipv6(value);
    };

    // String checks
    /* -------------------------------------------------------------------------- */

    // is a given string or sentence capitalized?
    is.capitalized = function(string) {
        if (is.not.string(string)) {
            return false;
        }
        var words = string.split(' ');
        for (var i = 0; i < words.length; i++) {
            var word = words[i];
            if (word.length) {
                var chr = word.charAt(0);
                if (chr !== chr.toUpperCase()) {
                    return false;
                }
            }
        }
        return true;
    };

    // is string end with a given target parameter?
    is.endWith = function(string, target) {
        if (is.not.string(string)) {
            return false;
        }
        target += '';
        var position = string.length - target.length;
        return position >= 0 && string.indexOf(target, position) === position;
    };
    // endWith method does not support 'all' and 'any' interfaces
    is.endWith.api = ['not'];

    // is a given string include parameter target?
    is.include = function(string, target) {
        return string.indexOf(target) > -1;
    };
    // include method does not support 'all' and 'any' interfaces
    is.include.api = ['not'];

    // is a given string all lowercase?
    is.lowerCase = function(string) {
        return is.string(string) && string === string.toLowerCase();
    };

    // is a given string palindrome?
    is.palindrome = function(string) {
        if (is.not.string(string)) {
            return false;
        }
        string = string.replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
        var length = string.length - 1;
        for (var i = 0, half = Math.floor(length / 2); i <= half; i++) {
            if (string.charAt(i) !== string.charAt(length - i)) {
                return false;
            }
        }
        return true;
    };

    // is a given value space?
    // horizantal tab: 9, line feed: 10, vertical tab: 11, form feed: 12, carriage return: 13, space: 32
    is.space = function(value) {
        if (is.not.char(value)) {
            return false;
        }
        var charCode = value.charCodeAt(0);
        return (charCode > 8 && charCode < 14) || charCode === 32;
    };

    // is string start with a given target parameter?
    is.startWith = function(string, target) {
        return is.string(string) && string.indexOf(target) === 0;
    };
    // startWith method does not support 'all' and 'any' interfaces
    is.startWith.api = ['not'];

    // is a given string all uppercase?
    is.upperCase = function(string) {
        return is.string(string) && string === string.toUpperCase();
    };

    // Time checks
    /* -------------------------------------------------------------------------- */

    var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    var months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

    // is a given dates day equal given day parameter?
    is.day = function(date, day) {
        return is.date(date) && day.toLowerCase() === days[date.getDay()];
    };
    // day method does not support 'all' and 'any' interfaces
    is.day.api = ['not'];

    // is a given date in daylight saving time?
    is.dayLightSavingTime = function(date) {
        var january = new Date(date.getFullYear(), 0, 1);
        var july = new Date(date.getFullYear(), 6, 1);
        var stdTimezoneOffset = Math.max(january.getTimezoneOffset(), july.getTimezoneOffset());
        return date.getTimezoneOffset() < stdTimezoneOffset;
    };

    // is a given date future?
    is.future = function(date) {
        var now = new Date();
        return is.date(date) && date.getTime() > now.getTime();
    };

    // is date within given range?
    is.inDateRange = function(date, start, end) {
        if (is.not.date(date) || is.not.date(start) || is.not.date(end)) {
            return false;
        }
        var stamp = date.getTime();
        return stamp > start.getTime() && stamp < end.getTime();
    };
    // inDateRange method does not support 'all' and 'any' interfaces
    is.inDateRange.api = ['not'];

    // is a given date in last month range?
    is.inLastMonth = function(date) {
        return is.inDateRange(date, new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date());
    };

    // is a given date in last week range?
    is.inLastWeek = function(date) {
        return is.inDateRange(date, new Date(new Date().setDate(new Date().getDate() - 7)), new Date());
    };

    // is a given date in last year range?
    is.inLastYear = function(date) {
        return is.inDateRange(date, new Date(new Date().setFullYear(new Date().getFullYear() - 1)), new Date());
    };

    // is a given date in next month range?
    is.inNextMonth = function(date) {
        return is.inDateRange(date, new Date(), new Date(new Date().setMonth(new Date().getMonth() + 1)));
    };

    // is a given date in next week range?
    is.inNextWeek = function(date) {
        return is.inDateRange(date, new Date(), new Date(new Date().setDate(new Date().getDate() + 7)));
    };

    // is a given date in next year range?
    is.inNextYear = function(date) {
        return is.inDateRange(date, new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 1)));
    };

    // is the given year a leap year?
    is.leapYear = function(year) {
        return is.number(year) && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
    };

    // is a given dates month equal given month parameter?
    is.month = function(date, month) {
        return is.date(date) && month.toLowerCase() === months[date.getMonth()];
    };
    // month method does not support 'all' and 'any' interfaces
    is.month.api = ['not'];

    // is a given date past?
    is.past = function(date) {
        var now = new Date();
        return is.date(date) && date.getTime() < now.getTime();
    };

    // is a given date in the parameter quarter?
    is.quarterOfYear = function(date, quarter) {
        return is.date(date) && is.number(quarter) && quarter === Math.floor((date.getMonth() + 3) / 3);
    };
    // quarterOfYear method does not support 'all' and 'any' interfaces
    is.quarterOfYear.api = ['not'];

    // is a given date indicate today?
    is.today = function(date) {
        var now = new Date();
        var todayString = now.toDateString();
        return is.date(date) && date.toDateString() === todayString;
    };

    // is a given date indicate tomorrow?
    is.tomorrow = function(date) {
        var now = new Date();
        var tomorrowString = new Date(now.setDate(now.getDate() + 1)).toDateString();
        return is.date(date) && date.toDateString() === tomorrowString;
    };

    // is a given date weekend?
    // 6: Saturday, 0: Sunday
    is.weekend = function(date) {
        return is.date(date) && (date.getDay() === 6 || date.getDay() === 0);
    };

    // is a given date weekday?
    is.weekday = not(is.weekend);

    // is a given dates year equal given year parameter?
    is.year = function(date, year) {
        return is.date(date) && is.number(year) && year === date.getFullYear();
    };
    // year method does not support 'all' and 'any' interfaces
    is.year.api = ['not'];

    // is a given date indicate yesterday?
    is.yesterday = function(date) {
        var now = new Date();
        var yesterdayString = new Date(now.setDate(now.getDate() - 1)).toDateString();
        return is.date(date) && date.toDateString() === yesterdayString;
    };

    // Environment checks
    /* -------------------------------------------------------------------------- */

    var freeGlobal = is.windowObject(typeof commonjsGlobal == 'object' && commonjsGlobal) && commonjsGlobal;
    var freeSelf = is.windowObject(typeof self == 'object' && self) && self;
    var thisGlobal = is.windowObject(typeof this == 'object' && this) && this;
    var root = freeGlobal || freeSelf || thisGlobal || Function('return this')();

    var document = freeSelf && freeSelf.document;
    var previousIs = root.is;

    // store navigator properties to use later
    var navigator = freeSelf && freeSelf.navigator;
    var appVersion = (navigator && navigator.appVersion || '').toLowerCase();
    var userAgent = (navigator && navigator.userAgent || '').toLowerCase();
    var vendor = (navigator && navigator.vendor || '').toLowerCase();

    // is current device android?
    is.android = function() {
        return /android/.test(userAgent);
    };
    // android method does not support 'all' and 'any' interfaces
    is.android.api = ['not'];

    // is current device android phone?
    is.androidPhone = function() {
        return /android/.test(userAgent) && /mobile/.test(userAgent);
    };
    // androidPhone method does not support 'all' and 'any' interfaces
    is.androidPhone.api = ['not'];

    // is current device android tablet?
    is.androidTablet = function() {
        return /android/.test(userAgent) && !/mobile/.test(userAgent);
    };
    // androidTablet method does not support 'all' and 'any' interfaces
    is.androidTablet.api = ['not'];

    // is current device blackberry?
    is.blackberry = function() {
        return /blackberry/.test(userAgent) || /bb10/.test(userAgent);
    };
    // blackberry method does not support 'all' and 'any' interfaces
    is.blackberry.api = ['not'];

    // is current browser chrome?
    // parameter is optional
    is.chrome = function(range) {
        var match = /google inc/.test(vendor) ? userAgent.match(/(?:chrome|crios)\/(\d+)/) : null;
        return match !== null && compareVersion(match[1], range);
    };
    // chrome method does not support 'all' and 'any' interfaces
    is.chrome.api = ['not'];

    // is current device desktop?
    is.desktop = function() {
        return is.not.mobile() && is.not.tablet();
    };
    // desktop method does not support 'all' and 'any' interfaces
    is.desktop.api = ['not'];

    // is current browser edge?
    // parameter is optional
    is.edge = function(range) {
        var match = userAgent.match(/edge\/(\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // edge method does not support 'all' and 'any' interfaces
    is.edge.api = ['not'];

    // is current browser firefox?
    // parameter is optional
    is.firefox = function(range) {
        var match = userAgent.match(/(?:firefox|fxios)\/(\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // firefox method does not support 'all' and 'any' interfaces
    is.firefox.api = ['not'];

    // is current browser internet explorer?
    // parameter is optional
    is.ie = function(range) {
        var match = userAgent.match(/(?:msie |trident.+?; rv:)(\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // ie method does not support 'all' and 'any' interfaces
    is.ie.api = ['not'];

    // is current device ios?
    is.ios = function() {
        return is.iphone() || is.ipad() || is.ipod();
    };
    // ios method does not support 'all' and 'any' interfaces
    is.ios.api = ['not'];

    // is current device ipad?
    // parameter is optional
    is.ipad = function(range) {
        var match = userAgent.match(/ipad.+?os (\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // ipad method does not support 'all' and 'any' interfaces
    is.ipad.api = ['not'];

    // is current device iphone?
    // parameter is optional
    is.iphone = function(range) {
        // original iPhone doesn't have the os portion of the UA
        var match = userAgent.match(/iphone(?:.+?os (\d+))?/);
        return match !== null && compareVersion(match[1] || 1, range);
    };
    // iphone method does not support 'all' and 'any' interfaces
    is.iphone.api = ['not'];

    // is current device ipod?
    // parameter is optional
    is.ipod = function(range) {
        var match = userAgent.match(/ipod.+?os (\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // ipod method does not support 'all' and 'any' interfaces
    is.ipod.api = ['not'];

    // is current operating system linux?
    is.linux = function() {
        return /linux/.test(appVersion);
    };
    // linux method does not support 'all' and 'any' interfaces
    is.linux.api = ['not'];

    // is current operating system mac?
    is.mac = function() {
        return /mac/.test(appVersion);
    };
    // mac method does not support 'all' and 'any' interfaces
    is.mac.api = ['not'];

    // is current device mobile?
    is.mobile = function() {
        return is.iphone() || is.ipod() || is.androidPhone() || is.blackberry() || is.windowsPhone();
    };
    // mobile method does not support 'all' and 'any' interfaces
    is.mobile.api = ['not'];

    // is current state offline?
    is.offline = not(is.online);
    // offline method does not support 'all' and 'any' interfaces
    is.offline.api = ['not'];

    // is current state online?
    is.online = function() {
        return !navigator || navigator.onLine === true;
    };
    // online method does not support 'all' and 'any' interfaces
    is.online.api = ['not'];

    // is current browser opera?
    // parameter is optional
    is.opera = function(range) {
        var match = userAgent.match(/(?:^opera.+?version|opr)\/(\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // opera method does not support 'all' and 'any' interfaces
    is.opera.api = ['not'];

    // is current browser phantomjs?
    // parameter is optional
    is.phantom = function(range) {
        var match = userAgent.match(/phantomjs\/(\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // phantom method does not support 'all' and 'any' interfaces
    is.phantom.api = ['not'];

    // is current browser safari?
    // parameter is optional
    is.safari = function(range) {
        var match = userAgent.match(/version\/(\d+).+?safari/);
        return match !== null && compareVersion(match[1], range);
    };
    // safari method does not support 'all' and 'any' interfaces
    is.safari.api = ['not'];

    // is current device tablet?
    is.tablet = function() {
        return is.ipad() || is.androidTablet() || is.windowsTablet();
    };
    // tablet method does not support 'all' and 'any' interfaces
    is.tablet.api = ['not'];

    // is current device supports touch?
    is.touchDevice = function() {
        return !!document && ('ontouchstart' in freeSelf ||
            ('DocumentTouch' in freeSelf && document instanceof DocumentTouch));
    };
    // touchDevice method does not support 'all' and 'any' interfaces
    is.touchDevice.api = ['not'];

    // is current operating system windows?
    is.windows = function() {
        return /win/.test(appVersion);
    };
    // windows method does not support 'all' and 'any' interfaces
    is.windows.api = ['not'];

    // is current device windows phone?
    is.windowsPhone = function() {
        return is.windows() && /phone/.test(userAgent);
    };
    // windowsPhone method does not support 'all' and 'any' interfaces
    is.windowsPhone.api = ['not'];

    // is current device windows tablet?
    is.windowsTablet = function() {
        return is.windows() && is.not.windowsPhone() && /touch/.test(userAgent);
    };
    // windowsTablet method does not support 'all' and 'any' interfaces
    is.windowsTablet.api = ['not'];

    // Object checks
    /* -------------------------------------------------------------------------- */

    // has a given object got parameterized count property?
    is.propertyCount = function(object, count) {
        if (is.not.object(object) || is.not.number(count)) {
            return false;
        }
        var n = 0;
        for (var property in object) {
            if (hasOwnProperty.call(object, property) && ++n > count) {
                return false;
            }
        }
        return n === count;
    };
    // propertyCount method does not support 'all' and 'any' interfaces
    is.propertyCount.api = ['not'];

    // is given object has parameterized property?
    is.propertyDefined = function(object, property) {
        return is.object(object) && is.string(property) && property in object;
    };
    // propertyDefined method does not support 'all' and 'any' interfaces
    is.propertyDefined.api = ['not'];

    // Array checks
    /* -------------------------------------------------------------------------- */

    // is a given item in an array?
    is.inArray = function(value, array) {
        if (is.not.array(array)) {
            return false;
        }
        for (var i = 0; i < array.length; i++) {
            if (array[i] === value) {
                return true;
            }
        }
        return false;
    };
    // inArray method does not support 'all' and 'any' interfaces
    is.inArray.api = ['not'];

    // is a given array sorted?
    is.sorted = function(array, sign) {
        if (is.not.array(array)) {
            return false;
        }
        var predicate = comparator[sign] || comparator['>='];
        for (var i = 1; i < array.length; i++) {
            if (!predicate(array[i], array[i - 1])) {
                return false;
            }
        }
        return true;
    };

    // API
    // Set 'not', 'all' and 'any' interfaces to methods based on their api property
    /* -------------------------------------------------------------------------- */

    function setInterfaces() {
        var options = is;
        for (var option in options) {
            if (hasOwnProperty.call(options, option) && is['function'](options[option])) {
                var interfaces = options[option].api || ['not', 'all', 'any'];
                for (var i = 0; i < interfaces.length; i++) {
                    if (interfaces[i] === 'not') {
                        is.not[option] = not(is[option]);
                    }
                    if (interfaces[i] === 'all') {
                        is.all[option] = all(is[option]);
                    }
                    if (interfaces[i] === 'any') {
                        is.any[option] = any(is[option]);
                    }
                }
            }
        }
    }
    setInterfaces();

    // Configuration methods
    // Intentionally added after setInterfaces function
    /* -------------------------------------------------------------------------- */

    // change namespace of library to prevent name collisions
    // var preferredName = is.setNamespace();
    // preferredName.odd(3);
    // => true
    is.setNamespace = function() {
        root.is = previousIs;
        return this;
    };

    // set optional regexes to methods
    is.setRegexp = function(regexp, name) {
        for (var r in regexes) {
            if (hasOwnProperty.call(regexes, r) && (name === r)) {
                regexes[r] = regexp;
            }
        }
    };

    return is;
}));
});

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Built-in value references. */
var Symbol = root.Symbol;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$1 = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag$1 && symToStringTag$1 in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/**
 * The base implementation of `_.toNumber` which doesn't ensure correct
 * conversions of binary, hexadecimal, or octal string values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 */
function baseToNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  return +value;
}

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Creates a function that performs a mathematical operation on two values.
 *
 * @private
 * @param {Function} operator The function to perform the operation.
 * @param {number} [defaultValue] The value used for `undefined` arguments.
 * @returns {Function} Returns the new mathematical operation function.
 */
function createMathOperation(operator, defaultValue) {
  return function(value, other) {
    var result;
    if (value === undefined && other === undefined) {
      return defaultValue;
    }
    if (value !== undefined) {
      result = value;
    }
    if (other !== undefined) {
      if (result === undefined) {
        return other;
      }
      if (typeof value == 'string' || typeof other == 'string') {
        value = baseToString(value);
        other = baseToString(other);
      } else {
        value = baseToNumber(value);
        other = baseToNumber(other);
      }
      result = operator(value, other);
    }
    return result;
  };
}

/**
 * Adds two numbers.
 *
 * @static
 * @memberOf _
 * @since 3.4.0
 * @category Math
 * @param {number} augend The first number in an addition.
 * @param {number} addend The second number in an addition.
 * @returns {number} Returns the total.
 * @example
 *
 * _.add(6, 4);
 * // => 10
 */
var add = createMathOperation(function(augend, addend) {
  return augend + addend;
}, 0);

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/** Used as references for various `Number` constants. */
var NAN$1 = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN$1;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN$1 : +value);
}

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY$1 || value === -INFINITY$1) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * The opposite of `_.before`; this method creates a function that invokes
 * `func` once it's called `n` or more times.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {number} n The number of calls before `func` is invoked.
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * var saves = ['profile', 'settings'];
 *
 * var done = _.after(saves.length, function() {
 *   console.log('done saving!');
 * });
 *
 * _.forEach(saves, function(type) {
 *   asyncSave({ 'type': type, 'complete': done });
 * });
 * // => Logs 'done saving!' after the two async saves have completed.
 */
function after(n, func) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  n = toInteger(n);
  return function() {
    if (--n < 1) {
      return func.apply(this, arguments);
    }
  };
}

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto$1 = Function.prototype,
    objectProto$2 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

/** Used to store function metadata. */
var metaMap = WeakMap && new WeakMap;

/**
 * The base implementation of `setData` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to associate metadata with.
 * @param {*} data The metadata.
 * @returns {Function} Returns `func`.
 */
var baseSetData = !metaMap ? identity : function(func, data) {
  metaMap.set(func, data);
  return func;
};

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

/**
 * Creates a function that produces an instance of `Ctor` regardless of
 * whether it was invoked as part of a `new` expression or by `call` or `apply`.
 *
 * @private
 * @param {Function} Ctor The constructor to wrap.
 * @returns {Function} Returns the new wrapped function.
 */
function createCtor(Ctor) {
  return function() {
    // Use a `switch` statement to work with class constructors. See
    // http://ecma-international.org/ecma-262/7.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
    // for more details.
    var args = arguments;
    switch (args.length) {
      case 0: return new Ctor;
      case 1: return new Ctor(args[0]);
      case 2: return new Ctor(args[0], args[1]);
      case 3: return new Ctor(args[0], args[1], args[2]);
      case 4: return new Ctor(args[0], args[1], args[2], args[3]);
      case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
      case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
      case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
    }
    var thisBinding = baseCreate(Ctor.prototype),
        result = Ctor.apply(thisBinding, args);

    // Mimic the constructor's `return` behavior.
    // See https://es5.github.io/#x13.2.2 for more details.
    return isObject(result) ? result : thisBinding;
  };
}

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG = 1;

/**
 * Creates a function that wraps `func` to invoke it with the optional `this`
 * binding of `thisArg`.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createBind(func, bitmask, thisArg) {
  var isBind = bitmask & WRAP_BIND_FLAG,
      Ctor = createCtor(func);

  function wrapper() {
    var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
    return fn.apply(isBind ? thisArg : this, arguments);
  }
  return wrapper;
}

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates an array that is the composition of partially applied arguments,
 * placeholders, and provided arguments into a single array of arguments.
 *
 * @private
 * @param {Array} args The provided arguments.
 * @param {Array} partials The arguments to prepend to those provided.
 * @param {Array} holders The `partials` placeholder indexes.
 * @params {boolean} [isCurried] Specify composing for a curried function.
 * @returns {Array} Returns the new array of composed arguments.
 */
function composeArgs(args, partials, holders, isCurried) {
  var argsIndex = -1,
      argsLength = args.length,
      holdersLength = holders.length,
      leftIndex = -1,
      leftLength = partials.length,
      rangeLength = nativeMax(argsLength - holdersLength, 0),
      result = Array(leftLength + rangeLength),
      isUncurried = !isCurried;

  while (++leftIndex < leftLength) {
    result[leftIndex] = partials[leftIndex];
  }
  while (++argsIndex < holdersLength) {
    if (isUncurried || argsIndex < argsLength) {
      result[holders[argsIndex]] = args[argsIndex];
    }
  }
  while (rangeLength--) {
    result[leftIndex++] = args[argsIndex++];
  }
  return result;
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax$1 = Math.max;

/**
 * This function is like `composeArgs` except that the arguments composition
 * is tailored for `_.partialRight`.
 *
 * @private
 * @param {Array} args The provided arguments.
 * @param {Array} partials The arguments to append to those provided.
 * @param {Array} holders The `partials` placeholder indexes.
 * @params {boolean} [isCurried] Specify composing for a curried function.
 * @returns {Array} Returns the new array of composed arguments.
 */
function composeArgsRight(args, partials, holders, isCurried) {
  var argsIndex = -1,
      argsLength = args.length,
      holdersIndex = -1,
      holdersLength = holders.length,
      rightIndex = -1,
      rightLength = partials.length,
      rangeLength = nativeMax$1(argsLength - holdersLength, 0),
      result = Array(rangeLength + rightLength),
      isUncurried = !isCurried;

  while (++argsIndex < rangeLength) {
    result[argsIndex] = args[argsIndex];
  }
  var offset = argsIndex;
  while (++rightIndex < rightLength) {
    result[offset + rightIndex] = partials[rightIndex];
  }
  while (++holdersIndex < holdersLength) {
    if (isUncurried || argsIndex < argsLength) {
      result[offset + holders[holdersIndex]] = args[argsIndex++];
    }
  }
  return result;
}

/**
 * Gets the number of `placeholder` occurrences in `array`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} placeholder The placeholder to search for.
 * @returns {number} Returns the placeholder count.
 */
function countHolders(array, placeholder) {
  var length = array.length,
      result = 0;

  while (length--) {
    if (array[length] === placeholder) {
      ++result;
    }
  }
  return result;
}

/**
 * The function whose prototype chain sequence wrappers inherit from.
 *
 * @private
 */
function baseLodash() {
  // No operation performed.
}

/** Used as references for the maximum length and index of an array. */
var MAX_ARRAY_LENGTH = 4294967295;

/**
 * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
 *
 * @private
 * @constructor
 * @param {*} value The value to wrap.
 */
function LazyWrapper(value) {
  this.__wrapped__ = value;
  this.__actions__ = [];
  this.__dir__ = 1;
  this.__filtered__ = false;
  this.__iteratees__ = [];
  this.__takeCount__ = MAX_ARRAY_LENGTH;
  this.__views__ = [];
}

// Ensure `LazyWrapper` is an instance of `baseLodash`.
LazyWrapper.prototype = baseCreate(baseLodash.prototype);
LazyWrapper.prototype.constructor = LazyWrapper;

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

/**
 * Gets metadata for `func`.
 *
 * @private
 * @param {Function} func The function to query.
 * @returns {*} Returns the metadata for `func`.
 */
var getData = !metaMap ? noop : function(func) {
  return metaMap.get(func);
};

/** Used to lookup unminified function names. */
var realNames = {};

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

/**
 * Gets the name of `func`.
 *
 * @private
 * @param {Function} func The function to query.
 * @returns {string} Returns the function name.
 */
function getFuncName(func) {
  var result = (func.name + ''),
      array = realNames[result],
      length = hasOwnProperty$2.call(realNames, result) ? array.length : 0;

  while (length--) {
    var data = array[length],
        otherFunc = data.func;
    if (otherFunc == null || otherFunc == func) {
      return data.name;
    }
  }
  return result;
}

/**
 * The base constructor for creating `lodash` wrapper objects.
 *
 * @private
 * @param {*} value The value to wrap.
 * @param {boolean} [chainAll] Enable explicit method chain sequences.
 */
function LodashWrapper(value, chainAll) {
  this.__wrapped__ = value;
  this.__actions__ = [];
  this.__chain__ = !!chainAll;
  this.__index__ = 0;
  this.__values__ = undefined;
}

LodashWrapper.prototype = baseCreate(baseLodash.prototype);
LodashWrapper.prototype.constructor = LodashWrapper;

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Creates a clone of `wrapper`.
 *
 * @private
 * @param {Object} wrapper The wrapper to clone.
 * @returns {Object} Returns the cloned wrapper.
 */
function wrapperClone(wrapper) {
  if (wrapper instanceof LazyWrapper) {
    return wrapper.clone();
  }
  var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
  result.__actions__ = copyArray(wrapper.__actions__);
  result.__index__  = wrapper.__index__;
  result.__values__ = wrapper.__values__;
  return result;
}

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

/**
 * Creates a `lodash` object which wraps `value` to enable implicit method
 * chain sequences. Methods that operate on and return arrays, collections,
 * and functions can be chained together. Methods that retrieve a single value
 * or may return a primitive value will automatically end the chain sequence
 * and return the unwrapped value. Otherwise, the value must be unwrapped
 * with `_#value`.
 *
 * Explicit chain sequences, which must be unwrapped with `_#value`, may be
 * enabled using `_.chain`.
 *
 * The execution of chained methods is lazy, that is, it's deferred until
 * `_#value` is implicitly or explicitly called.
 *
 * Lazy evaluation allows several methods to support shortcut fusion.
 * Shortcut fusion is an optimization to merge iteratee calls; this avoids
 * the creation of intermediate arrays and can greatly reduce the number of
 * iteratee executions. Sections of a chain sequence qualify for shortcut
 * fusion if the section is applied to an array and iteratees accept only
 * one argument. The heuristic for whether a section qualifies for shortcut
 * fusion is subject to change.
 *
 * Chaining is supported in custom builds as long as the `_#value` method is
 * directly or indirectly included in the build.
 *
 * In addition to lodash methods, wrappers have `Array` and `String` methods.
 *
 * The wrapper `Array` methods are:
 * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
 *
 * The wrapper `String` methods are:
 * `replace` and `split`
 *
 * The wrapper methods that support shortcut fusion are:
 * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
 * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
 * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
 *
 * The chainable wrapper methods are:
 * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
 * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
 * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
 * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
 * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
 * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
 * `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
 * `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
 * `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
 * `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
 * `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
 * `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
 * `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
 * `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
 * `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
 * `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
 * `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
 * `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
 * `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
 * `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
 * `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
 * `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
 * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
 * `zipObject`, `zipObjectDeep`, and `zipWith`
 *
 * The wrapper methods that are **not** chainable by default are:
 * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
 * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,
 * `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,
 * `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,
 * `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,
 * `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
 * `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
 * `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,
 * `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,
 * `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,
 * `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
 * `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
 * `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
 * `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
 * `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
 * `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
 * `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
 * `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
 * `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
 * `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
 * `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
 * `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
 * `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
 * `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
 * `upperFirst`, `value`, and `words`
 *
 * @name _
 * @constructor
 * @category Seq
 * @param {*} value The value to wrap in a `lodash` instance.
 * @returns {Object} Returns the new `lodash` wrapper instance.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * var wrapped = _([1, 2, 3]);
 *
 * // Returns an unwrapped value.
 * wrapped.reduce(_.add);
 * // => 6
 *
 * // Returns a wrapped value.
 * var squares = wrapped.map(square);
 *
 * _.isArray(squares);
 * // => false
 *
 * _.isArray(squares.value());
 * // => true
 */
function lodash(value) {
  if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
    if (value instanceof LodashWrapper) {
      return value;
    }
    if (hasOwnProperty$3.call(value, '__wrapped__')) {
      return wrapperClone(value);
    }
  }
  return new LodashWrapper(value);
}

// Ensure wrappers are instances of `baseLodash`.
lodash.prototype = baseLodash.prototype;
lodash.prototype.constructor = lodash;

/**
 * Checks if `func` has a lazy counterpart.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` has a lazy counterpart,
 *  else `false`.
 */
function isLaziable(func) {
  var funcName = getFuncName(func),
      other = lodash[funcName];

  if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
    return false;
  }
  if (func === other) {
    return true;
  }
  var data = getData(other);
  return !!data && func === data[0];
}

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

/**
 * Sets metadata for `func`.
 *
 * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
 * period of time, it will trip its breaker and transition to an identity
 * function to avoid garbage collection pauses in V8. See
 * [V8 issue 2070](https://bugs.chromium.org/p/v8/issues/detail?id=2070)
 * for more details.
 *
 * @private
 * @param {Function} func The function to associate metadata with.
 * @param {*} data The metadata.
 * @returns {Function} Returns `func`.
 */
var setData = shortOut(baseSetData);

/** Used to match wrap detail comments. */
var reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/,
    reSplitDetails = /,? & /;

/**
 * Extracts wrapper details from the `source` body comment.
 *
 * @private
 * @param {string} source The source to inspect.
 * @returns {Array} Returns the wrapper details.
 */
function getWrapDetails(source) {
  var match = source.match(reWrapDetails);
  return match ? match[1].split(reSplitDetails) : [];
}

/** Used to match wrap detail comments. */
var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/;

/**
 * Inserts wrapper `details` in a comment at the top of the `source` body.
 *
 * @private
 * @param {string} source The source to modify.
 * @returns {Array} details The details to insert.
 * @returns {string} Returns the modified source.
 */
function insertWrapDetails(source, details) {
  var length = details.length;
  if (!length) {
    return source;
  }
  var lastIndex = length - 1;
  details[lastIndex] = (length > 1 ? '& ' : '') + details[lastIndex];
  details = details.join(length > 2 ? ', ' : ' ');
  return source.replace(reWrapComment, '{\n/* [wrapped with ' + details + '] */\n');
}

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  return value === value
    ? strictIndexOf(array, value, fromIndex)
    : baseFindIndex(array, baseIsNaN, fromIndex);
}

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG$1 = 1,
    WRAP_BIND_KEY_FLAG = 2,
    WRAP_CURRY_FLAG = 8,
    WRAP_CURRY_RIGHT_FLAG = 16,
    WRAP_PARTIAL_FLAG = 32,
    WRAP_PARTIAL_RIGHT_FLAG = 64,
    WRAP_ARY_FLAG = 128,
    WRAP_REARG_FLAG = 256,
    WRAP_FLIP_FLAG = 512;

/** Used to associate wrap methods with their bit flags. */
var wrapFlags = [
  ['ary', WRAP_ARY_FLAG],
  ['bind', WRAP_BIND_FLAG$1],
  ['bindKey', WRAP_BIND_KEY_FLAG],
  ['curry', WRAP_CURRY_FLAG],
  ['curryRight', WRAP_CURRY_RIGHT_FLAG],
  ['flip', WRAP_FLIP_FLAG],
  ['partial', WRAP_PARTIAL_FLAG],
  ['partialRight', WRAP_PARTIAL_RIGHT_FLAG],
  ['rearg', WRAP_REARG_FLAG]
];

/**
 * Updates wrapper `details` based on `bitmask` flags.
 *
 * @private
 * @returns {Array} details The details to modify.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @returns {Array} Returns `details`.
 */
function updateWrapDetails(details, bitmask) {
  arrayEach(wrapFlags, function(pair) {
    var value = '_.' + pair[0];
    if ((bitmask & pair[1]) && !arrayIncludes(details, value)) {
      details.push(value);
    }
  });
  return details.sort();
}

/**
 * Sets the `toString` method of `wrapper` to mimic the source of `reference`
 * with wrapper details in a comment at the top of the source body.
 *
 * @private
 * @param {Function} wrapper The function to modify.
 * @param {Function} reference The reference function.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @returns {Function} Returns `wrapper`.
 */
function setWrapToString(wrapper, reference, bitmask) {
  var source = (reference + '');
  return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
}

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG$2 = 1,
    WRAP_BIND_KEY_FLAG$1 = 2,
    WRAP_CURRY_BOUND_FLAG = 4,
    WRAP_CURRY_FLAG$1 = 8,
    WRAP_PARTIAL_FLAG$1 = 32,
    WRAP_PARTIAL_RIGHT_FLAG$1 = 64;

/**
 * Creates a function that wraps `func` to continue currying.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {Function} wrapFunc The function to create the `func` wrapper.
 * @param {*} placeholder The placeholder value.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to prepend to those provided to
 *  the new function.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
  var isCurry = bitmask & WRAP_CURRY_FLAG$1,
      newHolders = isCurry ? holders : undefined,
      newHoldersRight = isCurry ? undefined : holders,
      newPartials = isCurry ? partials : undefined,
      newPartialsRight = isCurry ? undefined : partials;

  bitmask |= (isCurry ? WRAP_PARTIAL_FLAG$1 : WRAP_PARTIAL_RIGHT_FLAG$1);
  bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG$1 : WRAP_PARTIAL_FLAG$1);

  if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
    bitmask &= ~(WRAP_BIND_FLAG$2 | WRAP_BIND_KEY_FLAG$1);
  }
  var newData = [
    func, bitmask, thisArg, newPartials, newHolders, newPartialsRight,
    newHoldersRight, argPos, ary, arity
  ];

  var result = wrapFunc.apply(undefined, newData);
  if (isLaziable(func)) {
    setData(result, newData);
  }
  result.placeholder = placeholder;
  return setWrapToString(result, func, bitmask);
}

/**
 * Gets the argument placeholder value for `func`.
 *
 * @private
 * @param {Function} func The function to inspect.
 * @returns {*} Returns the placeholder value.
 */
function getHolder(func) {
  var object = func;
  return object.placeholder;
}

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * Reorder `array` according to the specified indexes where the element at
 * the first index is assigned as the first element, the element at
 * the second index is assigned as the second element, and so on.
 *
 * @private
 * @param {Array} array The array to reorder.
 * @param {Array} indexes The arranged array indexes.
 * @returns {Array} Returns `array`.
 */
function reorder(array, indexes) {
  var arrLength = array.length,
      length = nativeMin(indexes.length, arrLength),
      oldArray = copyArray(array);

  while (length--) {
    var index = indexes[length];
    array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
  }
  return array;
}

/** Used as the internal argument placeholder. */
var PLACEHOLDER = '__lodash_placeholder__';

/**
 * Replaces all `placeholder` elements in `array` with an internal placeholder
 * and returns an array of their indexes.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {*} placeholder The placeholder to replace.
 * @returns {Array} Returns the new array of placeholder indexes.
 */
function replaceHolders(array, placeholder) {
  var index = -1,
      length = array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (value === placeholder || value === PLACEHOLDER) {
      array[index] = PLACEHOLDER;
      result[resIndex++] = index;
    }
  }
  return result;
}

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG$3 = 1,
    WRAP_BIND_KEY_FLAG$2 = 2,
    WRAP_CURRY_FLAG$2 = 8,
    WRAP_CURRY_RIGHT_FLAG$1 = 16,
    WRAP_ARY_FLAG$1 = 128,
    WRAP_FLIP_FLAG$1 = 512;

/**
 * Creates a function that wraps `func` to invoke it with optional `this`
 * binding of `thisArg`, partial application, and currying.
 *
 * @private
 * @param {Function|string} func The function or method name to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to prepend to those provided to
 *  the new function.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [partialsRight] The arguments to append to those provided
 *  to the new function.
 * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
  var isAry = bitmask & WRAP_ARY_FLAG$1,
      isBind = bitmask & WRAP_BIND_FLAG$3,
      isBindKey = bitmask & WRAP_BIND_KEY_FLAG$2,
      isCurried = bitmask & (WRAP_CURRY_FLAG$2 | WRAP_CURRY_RIGHT_FLAG$1),
      isFlip = bitmask & WRAP_FLIP_FLAG$1,
      Ctor = isBindKey ? undefined : createCtor(func);

  function wrapper() {
    var length = arguments.length,
        args = Array(length),
        index = length;

    while (index--) {
      args[index] = arguments[index];
    }
    if (isCurried) {
      var placeholder = getHolder(wrapper),
          holdersCount = countHolders(args, placeholder);
    }
    if (partials) {
      args = composeArgs(args, partials, holders, isCurried);
    }
    if (partialsRight) {
      args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
    }
    length -= holdersCount;
    if (isCurried && length < arity) {
      var newHolders = replaceHolders(args, placeholder);
      return createRecurry(
        func, bitmask, createHybrid, wrapper.placeholder, thisArg,
        args, newHolders, argPos, ary, arity - length
      );
    }
    var thisBinding = isBind ? thisArg : this,
        fn = isBindKey ? thisBinding[func] : func;

    length = args.length;
    if (argPos) {
      args = reorder(args, argPos);
    } else if (isFlip && length > 1) {
      args.reverse();
    }
    if (isAry && ary < length) {
      args.length = ary;
    }
    if (this && this !== root && this instanceof wrapper) {
      fn = Ctor || createCtor(fn);
    }
    return fn.apply(thisBinding, args);
  }
  return wrapper;
}

/**
 * Creates a function that wraps `func` to enable currying.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {number} arity The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createCurry(func, bitmask, arity) {
  var Ctor = createCtor(func);

  function wrapper() {
    var length = arguments.length,
        args = Array(length),
        index = length,
        placeholder = getHolder(wrapper);

    while (index--) {
      args[index] = arguments[index];
    }
    var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
      ? []
      : replaceHolders(args, placeholder);

    length -= holders.length;
    if (length < arity) {
      return createRecurry(
        func, bitmask, createHybrid, wrapper.placeholder, undefined,
        args, holders, undefined, undefined, arity - length);
    }
    var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
    return apply(fn, this, args);
  }
  return wrapper;
}

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG$4 = 1;

/**
 * Creates a function that wraps `func` to invoke it with the `this` binding
 * of `thisArg` and `partials` prepended to the arguments it receives.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} partials The arguments to prepend to those provided to
 *  the new function.
 * @returns {Function} Returns the new wrapped function.
 */
function createPartial(func, bitmask, thisArg, partials) {
  var isBind = bitmask & WRAP_BIND_FLAG$4,
      Ctor = createCtor(func);

  function wrapper() {
    var argsIndex = -1,
        argsLength = arguments.length,
        leftIndex = -1,
        leftLength = partials.length,
        args = Array(leftLength + argsLength),
        fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;

    while (++leftIndex < leftLength) {
      args[leftIndex] = partials[leftIndex];
    }
    while (argsLength--) {
      args[leftIndex++] = arguments[++argsIndex];
    }
    return apply(fn, isBind ? thisArg : this, args);
  }
  return wrapper;
}

/** Used as the internal argument placeholder. */
var PLACEHOLDER$1 = '__lodash_placeholder__';

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG$5 = 1,
    WRAP_BIND_KEY_FLAG$3 = 2,
    WRAP_CURRY_BOUND_FLAG$1 = 4,
    WRAP_CURRY_FLAG$3 = 8,
    WRAP_ARY_FLAG$2 = 128,
    WRAP_REARG_FLAG$1 = 256;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin$1 = Math.min;

/**
 * Merges the function metadata of `source` into `data`.
 *
 * Merging metadata reduces the number of wrappers used to invoke a function.
 * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
 * may be applied regardless of execution order. Methods like `_.ary` and
 * `_.rearg` modify function arguments, making the order in which they are
 * executed important, preventing the merging of metadata. However, we make
 * an exception for a safe combined case where curried functions have `_.ary`
 * and or `_.rearg` applied.
 *
 * @private
 * @param {Array} data The destination metadata.
 * @param {Array} source The source metadata.
 * @returns {Array} Returns `data`.
 */
function mergeData(data, source) {
  var bitmask = data[1],
      srcBitmask = source[1],
      newBitmask = bitmask | srcBitmask,
      isCommon = newBitmask < (WRAP_BIND_FLAG$5 | WRAP_BIND_KEY_FLAG$3 | WRAP_ARY_FLAG$2);

  var isCombo =
    ((srcBitmask == WRAP_ARY_FLAG$2) && (bitmask == WRAP_CURRY_FLAG$3)) ||
    ((srcBitmask == WRAP_ARY_FLAG$2) && (bitmask == WRAP_REARG_FLAG$1) && (data[7].length <= source[8])) ||
    ((srcBitmask == (WRAP_ARY_FLAG$2 | WRAP_REARG_FLAG$1)) && (source[7].length <= source[8]) && (bitmask == WRAP_CURRY_FLAG$3));

  // Exit early if metadata can't be merged.
  if (!(isCommon || isCombo)) {
    return data;
  }
  // Use source `thisArg` if available.
  if (srcBitmask & WRAP_BIND_FLAG$5) {
    data[2] = source[2];
    // Set when currying a bound function.
    newBitmask |= bitmask & WRAP_BIND_FLAG$5 ? 0 : WRAP_CURRY_BOUND_FLAG$1;
  }
  // Compose partial arguments.
  var value = source[3];
  if (value) {
    var partials = data[3];
    data[3] = partials ? composeArgs(partials, value, source[4]) : value;
    data[4] = partials ? replaceHolders(data[3], PLACEHOLDER$1) : source[4];
  }
  // Compose partial right arguments.
  value = source[5];
  if (value) {
    partials = data[5];
    data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
    data[6] = partials ? replaceHolders(data[5], PLACEHOLDER$1) : source[6];
  }
  // Use source `argPos` if available.
  value = source[7];
  if (value) {
    data[7] = value;
  }
  // Use source `ary` if it's smaller.
  if (srcBitmask & WRAP_ARY_FLAG$2) {
    data[8] = data[8] == null ? source[8] : nativeMin$1(data[8], source[8]);
  }
  // Use source `arity` if one is not provided.
  if (data[9] == null) {
    data[9] = source[9];
  }
  // Use source `func` and merge bitmasks.
  data[0] = source[0];
  data[1] = newBitmask;

  return data;
}

/** Error message constants. */
var FUNC_ERROR_TEXT$1 = 'Expected a function';

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG$6 = 1,
    WRAP_BIND_KEY_FLAG$4 = 2,
    WRAP_CURRY_FLAG$4 = 8,
    WRAP_CURRY_RIGHT_FLAG$2 = 16,
    WRAP_PARTIAL_FLAG$2 = 32,
    WRAP_PARTIAL_RIGHT_FLAG$2 = 64;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax$2 = Math.max;

/**
 * Creates a function that either curries or invokes `func` with optional
 * `this` binding and partially applied arguments.
 *
 * @private
 * @param {Function|string} func The function or method name to wrap.
 * @param {number} bitmask The bitmask flags.
 *    1 - `_.bind`
 *    2 - `_.bindKey`
 *    4 - `_.curry` or `_.curryRight` of a bound function
 *    8 - `_.curry`
 *   16 - `_.curryRight`
 *   32 - `_.partial`
 *   64 - `_.partialRight`
 *  128 - `_.rearg`
 *  256 - `_.ary`
 *  512 - `_.flip`
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to be partially applied.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
  var isBindKey = bitmask & WRAP_BIND_KEY_FLAG$4;
  if (!isBindKey && typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  var length = partials ? partials.length : 0;
  if (!length) {
    bitmask &= ~(WRAP_PARTIAL_FLAG$2 | WRAP_PARTIAL_RIGHT_FLAG$2);
    partials = holders = undefined;
  }
  ary = ary === undefined ? ary : nativeMax$2(toInteger(ary), 0);
  arity = arity === undefined ? arity : toInteger(arity);
  length -= holders ? holders.length : 0;

  if (bitmask & WRAP_PARTIAL_RIGHT_FLAG$2) {
    var partialsRight = partials,
        holdersRight = holders;

    partials = holders = undefined;
  }
  var data = isBindKey ? undefined : getData(func);

  var newData = [
    func, bitmask, thisArg, partials, holders, partialsRight, holdersRight,
    argPos, ary, arity
  ];

  if (data) {
    mergeData(newData, data);
  }
  func = newData[0];
  bitmask = newData[1];
  thisArg = newData[2];
  partials = newData[3];
  holders = newData[4];
  arity = newData[9] = newData[9] === undefined
    ? (isBindKey ? 0 : func.length)
    : nativeMax$2(newData[9] - length, 0);

  if (!arity && bitmask & (WRAP_CURRY_FLAG$4 | WRAP_CURRY_RIGHT_FLAG$2)) {
    bitmask &= ~(WRAP_CURRY_FLAG$4 | WRAP_CURRY_RIGHT_FLAG$2);
  }
  if (!bitmask || bitmask == WRAP_BIND_FLAG$6) {
    var result = createBind(func, bitmask, thisArg);
  } else if (bitmask == WRAP_CURRY_FLAG$4 || bitmask == WRAP_CURRY_RIGHT_FLAG$2) {
    result = createCurry(func, bitmask, arity);
  } else if ((bitmask == WRAP_PARTIAL_FLAG$2 || bitmask == (WRAP_BIND_FLAG$6 | WRAP_PARTIAL_FLAG$2)) && !holders.length) {
    result = createPartial(func, bitmask, thisArg, partials);
  } else {
    result = createHybrid.apply(undefined, newData);
  }
  var setter = data ? baseSetData : setData;
  return setWrapToString(setter(result, newData), func, bitmask);
}

/** Used to compose bitmasks for function metadata. */
var WRAP_ARY_FLAG$3 = 128;

/**
 * Creates a function that invokes `func`, with up to `n` arguments,
 * ignoring any additional arguments.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Function
 * @param {Function} func The function to cap arguments for.
 * @param {number} [n=func.length] The arity cap.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Function} Returns the new capped function.
 * @example
 *
 * _.map(['6', '8', '10'], _.ary(parseInt, 1));
 * // => [6, 8, 10]
 */
function ary(func, n, guard) {
  n = guard ? undefined : n;
  n = (func && n == null) ? func.length : n;
  return createWrap(func, WRAP_ARY_FLAG$3, undefined, undefined, undefined, undefined, n);
}

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$5.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$4.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax$3 = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax$3(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax$3(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
}

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

/** Used for built-in method references. */
var objectProto$6 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$6;

  return value === proto;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

/** Used for built-in method references. */
var objectProto$7 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$7.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty$5.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag$1 = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/** Detect free variable `exports`. */
var freeExports$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$1 = freeExports$1 && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports$1 && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule$1 && freeModule$1.require && freeModule$1.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$8.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$6.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$7.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/** Used for built-in method references. */
var objectProto$a = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$a.hasOwnProperty;

/**
 * Assigns own enumerable string keyed properties of source objects to the
 * destination object. Source objects are applied from left to right.
 * Subsequent sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object` and is loosely based on
 * [`Object.assign`](https://mdn.io/Object/assign).
 *
 * @static
 * @memberOf _
 * @since 0.10.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.assignIn
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * function Bar() {
 *   this.c = 3;
 * }
 *
 * Foo.prototype.b = 2;
 * Bar.prototype.d = 4;
 *
 * _.assign({ 'a': 0 }, new Foo, new Bar);
 * // => { 'a': 1, 'c': 3 }
 */
var assign = createAssigner(function(object, source) {
  if (isPrototype(source) || isArrayLike(source)) {
    copyObject(source, keys(source), object);
    return;
  }
  for (var key in source) {
    if (hasOwnProperty$8.call(source, key)) {
      assignValue(object, key, source[key]);
    }
  }
});

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$b = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$9 = objectProto$b.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$9.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn$1(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

/**
 * This method is like `_.assign` except that it iterates over own and
 * inherited source properties.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @alias extend
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.assign
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * function Bar() {
 *   this.c = 3;
 * }
 *
 * Foo.prototype.b = 2;
 * Bar.prototype.d = 4;
 *
 * _.assignIn({ 'a': 0 }, new Foo, new Bar);
 * // => { 'a': 1, 'b': 2, 'c': 3, 'd': 4 }
 */
var assignIn = createAssigner(function(object, source) {
  copyObject(source, keysIn$1(source), object);
});

/**
 * This method is like `_.assignIn` except that it accepts `customizer`
 * which is invoked to produce the assigned values. If `customizer` returns
 * `undefined`, assignment is handled by the method instead. The `customizer`
 * is invoked with five arguments: (objValue, srcValue, key, object, source).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @alias extendWith
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @see _.assignWith
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   return _.isUndefined(objValue) ? srcValue : objValue;
 * }
 *
 * var defaults = _.partialRight(_.assignInWith, customizer);
 *
 * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
  copyObject(source, keysIn$1(source), object, customizer);
});

/**
 * This method is like `_.assign` except that it accepts `customizer`
 * which is invoked to produce the assigned values. If `customizer` returns
 * `undefined`, assignment is handled by the method instead. The `customizer`
 * is invoked with five arguments: (objValue, srcValue, key, object, source).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @see _.assignInWith
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   return _.isUndefined(objValue) ? srcValue : objValue;
 * }
 *
 * var defaults = _.partialRight(_.assignWith, customizer);
 *
 * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
  copyObject(source, keys(source), object, customizer);
});

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$c = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$a = objectProto$c.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$a.call(data, key) ? data[key] : undefined;
}

/** Used for built-in method references. */
var objectProto$d = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$b = objectProto$d.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty$b.call(data, key);
}

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/** Error message constants. */
var FUNC_ERROR_TEXT$2 = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT$2);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

/** Used as references for various `Number` constants. */
var INFINITY$2 = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$2) ? '-0' : result;
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

/**
 * The base implementation of `_.at` without support for individual paths.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {string[]} paths The property paths to pick.
 * @returns {Array} Returns the picked elements.
 */
function baseAt(object, paths) {
  var index = -1,
      length = paths.length,
      result = Array(length),
      skip = object == null;

  while (++index < length) {
    result[index] = skip ? undefined : get(object, paths[index]);
  }
  return result;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/** Built-in value references. */
var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray(value) || isArguments(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, 1) : [];
}

/**
 * A specialized version of `baseRest` which flattens the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @returns {Function} Returns the new function.
 */
function flatRest(func) {
  return setToString(overRest(func, undefined, flatten), func + '');
}

/**
 * Creates an array of values corresponding to `paths` of `object`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {...(string|string[])} [paths] The property paths to pick.
 * @returns {Array} Returns the picked values.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
 *
 * _.at(object, ['a[0].b.c', 'a[1]']);
 * // => [3, 4]
 */
var at = flatRest(baseAt);

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

/** `Object#toString` result references. */
var objectTag$1 = '[object Object]';

/** Used for built-in method references. */
var funcProto$2 = Function.prototype,
    objectProto$e = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$2 = funcProto$2.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$c = objectProto$e.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString$2.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag$1) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$c.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString$2.call(Ctor) == objectCtorString;
}

/** `Object#toString` result references. */
var domExcTag = '[object DOMException]',
    errorTag$1 = '[object Error]';

/**
 * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
 * `SyntaxError`, `TypeError`, or `URIError` object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
 * @example
 *
 * _.isError(new Error);
 * // => true
 *
 * _.isError(Error);
 * // => false
 */
function isError(value) {
  if (!isObjectLike(value)) {
    return false;
  }
  var tag = baseGetTag(value);
  return tag == errorTag$1 || tag == domExcTag ||
    (typeof value.message == 'string' && typeof value.name == 'string' && !isPlainObject(value));
}

/**
 * Attempts to invoke `func`, returning either the result or the caught error
 * object. Any additional arguments are provided to `func` when it's invoked.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Util
 * @param {Function} func The function to attempt.
 * @param {...*} [args] The arguments to invoke `func` with.
 * @returns {*} Returns the `func` result or error object.
 * @example
 *
 * // Avoid throwing errors for invalid selectors.
 * var elements = _.attempt(function(selector) {
 *   return document.querySelectorAll(selector);
 * }, '>_>');
 *
 * if (_.isError(elements)) {
 *   elements = [];
 * }
 */
var attempt = baseRest(function(func, args) {
  try {
    return apply(func, undefined, args);
  } catch (e) {
    return isError(e) ? e : new Error(e);
  }
});

/** Error message constants. */
var FUNC_ERROR_TEXT$3 = 'Expected a function';

/**
 * Creates a function that invokes `func`, with the `this` binding and arguments
 * of the created function, while it's called less than `n` times. Subsequent
 * calls to the created function return the result of the last `func` invocation.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Function
 * @param {number} n The number of calls at which `func` is no longer invoked.
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * jQuery(element).on('click', _.before(5, addContactToList));
 * // => Allows adding up to 4 contacts to the list.
 */
function before(n, func) {
  var result;
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT$3);
  }
  n = toInteger(n);
  return function() {
    if (--n > 0) {
      result = func.apply(this, arguments);
    }
    if (n <= 1) {
      func = undefined;
    }
    return result;
  };
}

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG$7 = 1,
    WRAP_PARTIAL_FLAG$3 = 32;

/**
 * Creates a function that invokes `func` with the `this` binding of `thisArg`
 * and `partials` prepended to the arguments it receives.
 *
 * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
 * may be used as a placeholder for partially applied arguments.
 *
 * **Note:** Unlike native `Function#bind`, this method doesn't set the "length"
 * property of bound functions.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to bind.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {...*} [partials] The arguments to be partially applied.
 * @returns {Function} Returns the new bound function.
 * @example
 *
 * function greet(greeting, punctuation) {
 *   return greeting + ' ' + this.user + punctuation;
 * }
 *
 * var object = { 'user': 'fred' };
 *
 * var bound = _.bind(greet, object, 'hi');
 * bound('!');
 * // => 'hi fred!'
 *
 * // Bound with placeholders.
 * var bound = _.bind(greet, object, _, '!');
 * bound('hi');
 * // => 'hi fred!'
 */
var bind = baseRest(function(func, thisArg, partials) {
  var bitmask = WRAP_BIND_FLAG$7;
  if (partials.length) {
    var holders = replaceHolders(partials, getHolder(bind));
    bitmask |= WRAP_PARTIAL_FLAG$3;
  }
  return createWrap(func, bitmask, thisArg, partials, holders);
});

// Assign default placeholders.
bind.placeholder = {};

/**
 * Binds methods of an object to the object itself, overwriting the existing
 * method.
 *
 * **Note:** This method doesn't set the "length" property of bound functions.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {Object} object The object to bind and assign the bound methods to.
 * @param {...(string|string[])} methodNames The object method names to bind.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var view = {
 *   'label': 'docs',
 *   'click': function() {
 *     console.log('clicked ' + this.label);
 *   }
 * };
 *
 * _.bindAll(view, ['click']);
 * jQuery(element).on('click', view.click);
 * // => Logs 'clicked docs' when clicked.
 */
var bindAll = flatRest(function(object, methodNames) {
  arrayEach(methodNames, function(key) {
    key = toKey(key);
    baseAssignValue(object, key, bind(object[key], object));
  });
  return object;
});

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG$8 = 1,
    WRAP_BIND_KEY_FLAG$5 = 2,
    WRAP_PARTIAL_FLAG$4 = 32;

/**
 * Creates a function that invokes the method at `object[key]` with `partials`
 * prepended to the arguments it receives.
 *
 * This method differs from `_.bind` by allowing bound functions to reference
 * methods that may be redefined or don't yet exist. See
 * [Peter Michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
 * for more details.
 *
 * The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
 * builds, may be used as a placeholder for partially applied arguments.
 *
 * @static
 * @memberOf _
 * @since 0.10.0
 * @category Function
 * @param {Object} object The object to invoke the method on.
 * @param {string} key The key of the method.
 * @param {...*} [partials] The arguments to be partially applied.
 * @returns {Function} Returns the new bound function.
 * @example
 *
 * var object = {
 *   'user': 'fred',
 *   'greet': function(greeting, punctuation) {
 *     return greeting + ' ' + this.user + punctuation;
 *   }
 * };
 *
 * var bound = _.bindKey(object, 'greet', 'hi');
 * bound('!');
 * // => 'hi fred!'
 *
 * object.greet = function(greeting, punctuation) {
 *   return greeting + 'ya ' + this.user + punctuation;
 * };
 *
 * bound('!');
 * // => 'hiya fred!'
 *
 * // Bound with placeholders.
 * var bound = _.bindKey(object, 'greet', _, '!');
 * bound('hi');
 * // => 'hiya fred!'
 */
var bindKey = baseRest(function(object, key, partials) {
  var bitmask = WRAP_BIND_FLAG$8 | WRAP_BIND_KEY_FLAG$5;
  if (partials.length) {
    var holders = replaceHolders(partials, getHolder(bindKey));
    bitmask |= WRAP_PARTIAL_FLAG$4;
  }
  return createWrap(key, bitmask, object, partials, holders);
});

// Assign default placeholders.
bindKey.placeholder = {};

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

/**
 * Casts `array` to a slice if it's needed.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {number} start The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the cast slice.
 */
function castSlice(array, start, end) {
  var length = array.length;
  end = end === undefined ? length : end;
  return (!start && end >= length) ? array : baseSlice(array, start, end);
}

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsZWJ = '\\u200d';

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */
function hasUnicode(string) {
  return reHasUnicode.test(string);
}

/**
 * Converts an ASCII `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function asciiToArray(string) {
  return string.split('');
}

/** Used to compose unicode character classes. */
var rsAstralRange$1 = '\\ud800-\\udfff',
    rsComboMarksRange$1 = '\\u0300-\\u036f',
    reComboHalfMarksRange$1 = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange$1 = '\\u20d0-\\u20ff',
    rsComboRange$1 = rsComboMarksRange$1 + reComboHalfMarksRange$1 + rsComboSymbolsRange$1,
    rsVarRange$1 = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange$1 + ']',
    rsCombo = '[' + rsComboRange$1 + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange$1 + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsZWJ$1 = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange$1 + ']?',
    rsOptJoin = '(?:' + rsZWJ$1 + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/**
 * Converts a Unicode `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function unicodeToArray(string) {
  return string.match(reUnicode) || [];
}

/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function stringToArray(string) {
  return hasUnicode(string)
    ? unicodeToArray(string)
    : asciiToArray(string);
}

/**
 * Creates a function like `_.lowerFirst`.
 *
 * @private
 * @param {string} methodName The name of the `String` case method to use.
 * @returns {Function} Returns the new case function.
 */
function createCaseFirst(methodName) {
  return function(string) {
    string = toString(string);

    var strSymbols = hasUnicode(string)
      ? stringToArray(string)
      : undefined;

    var chr = strSymbols
      ? strSymbols[0]
      : string.charAt(0);

    var trailing = strSymbols
      ? castSlice(strSymbols, 1).join('')
      : string.slice(1);

    return chr[methodName]() + trailing;
  };
}

/**
 * Converts the first character of `string` to upper case.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.upperFirst('fred');
 * // => 'Fred'
 *
 * _.upperFirst('FRED');
 * // => 'FRED'
 */
var upperFirst = createCaseFirst('toUpperCase');

/**
 * Converts the first character of `string` to upper case and the remaining
 * to lower case.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to capitalize.
 * @returns {string} Returns the capitalized string.
 * @example
 *
 * _.capitalize('FRED');
 * // => 'Fred'
 */
function capitalize(string) {
  return upperFirst(toString(string).toLowerCase());
}

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array == null ? 0 : array.length;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

/**
 * The base implementation of `_.propertyOf` without support for deep paths.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyOf(object) {
  return function(key) {
    return object == null ? undefined : object[key];
  };
}

/** Used to map Latin Unicode letters to basic Latin letters. */
var deburredLetters = {
  // Latin-1 Supplement block.
  '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
  '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
  '\xc7': 'C',  '\xe7': 'c',
  '\xd0': 'D',  '\xf0': 'd',
  '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
  '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
  '\xcc': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
  '\xec': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
  '\xd1': 'N',  '\xf1': 'n',
  '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
  '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
  '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
  '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
  '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
  '\xc6': 'Ae', '\xe6': 'ae',
  '\xde': 'Th', '\xfe': 'th',
  '\xdf': 'ss',
  // Latin Extended-A block.
  '\u0100': 'A',  '\u0102': 'A', '\u0104': 'A',
  '\u0101': 'a',  '\u0103': 'a', '\u0105': 'a',
  '\u0106': 'C',  '\u0108': 'C', '\u010a': 'C', '\u010c': 'C',
  '\u0107': 'c',  '\u0109': 'c', '\u010b': 'c', '\u010d': 'c',
  '\u010e': 'D',  '\u0110': 'D', '\u010f': 'd', '\u0111': 'd',
  '\u0112': 'E',  '\u0114': 'E', '\u0116': 'E', '\u0118': 'E', '\u011a': 'E',
  '\u0113': 'e',  '\u0115': 'e', '\u0117': 'e', '\u0119': 'e', '\u011b': 'e',
  '\u011c': 'G',  '\u011e': 'G', '\u0120': 'G', '\u0122': 'G',
  '\u011d': 'g',  '\u011f': 'g', '\u0121': 'g', '\u0123': 'g',
  '\u0124': 'H',  '\u0126': 'H', '\u0125': 'h', '\u0127': 'h',
  '\u0128': 'I',  '\u012a': 'I', '\u012c': 'I', '\u012e': 'I', '\u0130': 'I',
  '\u0129': 'i',  '\u012b': 'i', '\u012d': 'i', '\u012f': 'i', '\u0131': 'i',
  '\u0134': 'J',  '\u0135': 'j',
  '\u0136': 'K',  '\u0137': 'k', '\u0138': 'k',
  '\u0139': 'L',  '\u013b': 'L', '\u013d': 'L', '\u013f': 'L', '\u0141': 'L',
  '\u013a': 'l',  '\u013c': 'l', '\u013e': 'l', '\u0140': 'l', '\u0142': 'l',
  '\u0143': 'N',  '\u0145': 'N', '\u0147': 'N', '\u014a': 'N',
  '\u0144': 'n',  '\u0146': 'n', '\u0148': 'n', '\u014b': 'n',
  '\u014c': 'O',  '\u014e': 'O', '\u0150': 'O',
  '\u014d': 'o',  '\u014f': 'o', '\u0151': 'o',
  '\u0154': 'R',  '\u0156': 'R', '\u0158': 'R',
  '\u0155': 'r',  '\u0157': 'r', '\u0159': 'r',
  '\u015a': 'S',  '\u015c': 'S', '\u015e': 'S', '\u0160': 'S',
  '\u015b': 's',  '\u015d': 's', '\u015f': 's', '\u0161': 's',
  '\u0162': 'T',  '\u0164': 'T', '\u0166': 'T',
  '\u0163': 't',  '\u0165': 't', '\u0167': 't',
  '\u0168': 'U',  '\u016a': 'U', '\u016c': 'U', '\u016e': 'U', '\u0170': 'U', '\u0172': 'U',
  '\u0169': 'u',  '\u016b': 'u', '\u016d': 'u', '\u016f': 'u', '\u0171': 'u', '\u0173': 'u',
  '\u0174': 'W',  '\u0175': 'w',
  '\u0176': 'Y',  '\u0177': 'y', '\u0178': 'Y',
  '\u0179': 'Z',  '\u017b': 'Z', '\u017d': 'Z',
  '\u017a': 'z',  '\u017c': 'z', '\u017e': 'z',
  '\u0132': 'IJ', '\u0133': 'ij',
  '\u0152': 'Oe', '\u0153': 'oe',
  '\u0149': "'n", '\u017f': 's'
};

/**
 * Used by `_.deburr` to convert Latin-1 Supplement and Latin Extended-A
 * letters to basic Latin letters.
 *
 * @private
 * @param {string} letter The matched letter to deburr.
 * @returns {string} Returns the deburred letter.
 */
var deburrLetter = basePropertyOf(deburredLetters);

/** Used to match Latin Unicode letters (excluding mathematical operators). */
var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;

/** Used to compose unicode character classes. */
var rsComboMarksRange$2 = '\\u0300-\\u036f',
    reComboHalfMarksRange$2 = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange$2 = '\\u20d0-\\u20ff',
    rsComboRange$2 = rsComboMarksRange$2 + reComboHalfMarksRange$2 + rsComboSymbolsRange$2;

/** Used to compose unicode capture groups. */
var rsCombo$1 = '[' + rsComboRange$2 + ']';

/**
 * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
 * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
 */
var reComboMark = RegExp(rsCombo$1, 'g');

/**
 * Deburrs `string` by converting
 * [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
 * and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
 * letters to basic Latin letters and removing
 * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to deburr.
 * @returns {string} Returns the deburred string.
 * @example
 *
 * _.deburr('déjà vu');
 * // => 'deja vu'
 */
function deburr(string) {
  string = toString(string);
  return string && string.replace(reLatin, deburrLetter).replace(reComboMark, '');
}

/** Used to match words composed of alphanumeric characters. */
var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;

/**
 * Splits an ASCII `string` into an array of its words.
 *
 * @private
 * @param {string} The string to inspect.
 * @returns {Array} Returns the words of `string`.
 */
function asciiWords(string) {
  return string.match(reAsciiWord) || [];
}

/** Used to detect strings that need a more robust regexp to match words. */
var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

/**
 * Checks if `string` contains a word composed of Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a word is found, else `false`.
 */
function hasUnicodeWord(string) {
  return reHasUnicodeWord.test(string);
}

/** Used to compose unicode character classes. */
var rsAstralRange$2 = '\\ud800-\\udfff',
    rsComboMarksRange$3 = '\\u0300-\\u036f',
    reComboHalfMarksRange$3 = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange$3 = '\\u20d0-\\u20ff',
    rsComboRange$3 = rsComboMarksRange$3 + reComboHalfMarksRange$3 + rsComboSymbolsRange$3,
    rsDingbatRange = '\\u2700-\\u27bf',
    rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
    rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
    rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
    rsPunctuationRange = '\\u2000-\\u206f',
    rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
    rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
    rsVarRange$2 = '\\ufe0e\\ufe0f',
    rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;

/** Used to compose unicode capture groups. */
var rsApos = "['\u2019]",
    rsBreak = '[' + rsBreakRange + ']',
    rsCombo$2 = '[' + rsComboRange$3 + ']',
    rsDigits = '\\d+',
    rsDingbat = '[' + rsDingbatRange + ']',
    rsLower = '[' + rsLowerRange + ']',
    rsMisc = '[^' + rsAstralRange$2 + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
    rsFitz$1 = '\\ud83c[\\udffb-\\udfff]',
    rsModifier$1 = '(?:' + rsCombo$2 + '|' + rsFitz$1 + ')',
    rsNonAstral$1 = '[^' + rsAstralRange$2 + ']',
    rsRegional$1 = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair$1 = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsUpper = '[' + rsUpperRange + ']',
    rsZWJ$2 = '\\u200d';

/** Used to compose unicode regexes. */
var rsMiscLower = '(?:' + rsLower + '|' + rsMisc + ')',
    rsMiscUpper = '(?:' + rsUpper + '|' + rsMisc + ')',
    rsOptContrLower = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
    rsOptContrUpper = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
    reOptMod$1 = rsModifier$1 + '?',
    rsOptVar$1 = '[' + rsVarRange$2 + ']?',
    rsOptJoin$1 = '(?:' + rsZWJ$2 + '(?:' + [rsNonAstral$1, rsRegional$1, rsSurrPair$1].join('|') + ')' + rsOptVar$1 + reOptMod$1 + ')*',
    rsOrdLower = '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])',
    rsOrdUpper = '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])',
    rsSeq$1 = rsOptVar$1 + reOptMod$1 + rsOptJoin$1,
    rsEmoji = '(?:' + [rsDingbat, rsRegional$1, rsSurrPair$1].join('|') + ')' + rsSeq$1;

/** Used to match complex or compound words. */
var reUnicodeWord = RegExp([
  rsUpper + '?' + rsLower + '+' + rsOptContrLower + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
  rsMiscUpper + '+' + rsOptContrUpper + '(?=' + [rsBreak, rsUpper + rsMiscLower, '$'].join('|') + ')',
  rsUpper + '?' + rsMiscLower + '+' + rsOptContrLower,
  rsUpper + '+' + rsOptContrUpper,
  rsOrdUpper,
  rsOrdLower,
  rsDigits,
  rsEmoji
].join('|'), 'g');

/**
 * Splits a Unicode `string` into an array of its words.
 *
 * @private
 * @param {string} The string to inspect.
 * @returns {Array} Returns the words of `string`.
 */
function unicodeWords(string) {
  return string.match(reUnicodeWord) || [];
}

/**
 * Splits `string` into an array of its words.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to inspect.
 * @param {RegExp|string} [pattern] The pattern to match words.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the words of `string`.
 * @example
 *
 * _.words('fred, barney, & pebbles');
 * // => ['fred', 'barney', 'pebbles']
 *
 * _.words('fred, barney, & pebbles', /[^, ]+/g);
 * // => ['fred', 'barney', '&', 'pebbles']
 */
function words(string, pattern, guard) {
  string = toString(string);
  pattern = guard ? undefined : pattern;

  if (pattern === undefined) {
    return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
  }
  return string.match(pattern) || [];
}

/** Used to compose unicode capture groups. */
var rsApos$1 = "['\u2019]";

/** Used to match apostrophes. */
var reApos = RegExp(rsApos$1, 'g');

/**
 * Creates a function like `_.camelCase`.
 *
 * @private
 * @param {Function} callback The function to combine each word.
 * @returns {Function} Returns the new compounder function.
 */
function createCompounder(callback) {
  return function(string) {
    return arrayReduce(words(deburr(string).replace(reApos, '')), callback, '');
  };
}

/**
 * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the camel cased string.
 * @example
 *
 * _.camelCase('Foo Bar');
 * // => 'fooBar'
 *
 * _.camelCase('--foo-bar--');
 * // => 'fooBar'
 *
 * _.camelCase('__FOO_BAR__');
 * // => 'fooBar'
 */
var camelCase = createCompounder(function(result, word, index) {
  word = word.toLowerCase();
  return result + (index ? capitalize(word) : word);
});

/**
 * Casts `value` as an array if it's not one.
 *
 * @static
 * @memberOf _
 * @since 4.4.0
 * @category Lang
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast array.
 * @example
 *
 * _.castArray(1);
 * // => [1]
 *
 * _.castArray({ 'a': 1 });
 * // => [{ 'a': 1 }]
 *
 * _.castArray('abc');
 * // => ['abc']
 *
 * _.castArray(null);
 * // => [null]
 *
 * _.castArray(undefined);
 * // => [undefined]
 *
 * _.castArray();
 * // => []
 *
 * var array = [1, 2, 3];
 * console.log(_.castArray(array) === array);
 * // => true
 */
function castArray() {
  if (!arguments.length) {
    return [];
  }
  var value = arguments[0];
  return isArray(value) ? value : [value];
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin$2 = Math.min;

/**
 * Creates a function like `_.round`.
 *
 * @private
 * @param {string} methodName The name of the `Math` method to use when rounding.
 * @returns {Function} Returns the new round function.
 */
function createRound(methodName) {
  var func = Math[methodName];
  return function(number, precision) {
    number = toNumber(number);
    precision = precision == null ? 0 : nativeMin$2(toInteger(precision), 292);
    if (precision) {
      // Shift with exponential notation to avoid floating-point issues.
      // See [MDN](https://mdn.io/round#Examples) for more details.
      var pair = (toString(number) + 'e').split('e'),
          value = func(pair[0] + 'e' + (+pair[1] + precision));

      pair = (toString(value) + 'e').split('e');
      return +(pair[0] + 'e' + (+pair[1] - precision));
    }
    return func(number);
  };
}

/**
 * Computes `number` rounded up to `precision`.
 *
 * @static
 * @memberOf _
 * @since 3.10.0
 * @category Math
 * @param {number} number The number to round up.
 * @param {number} [precision=0] The precision to round up to.
 * @returns {number} Returns the rounded up number.
 * @example
 *
 * _.ceil(4.006);
 * // => 5
 *
 * _.ceil(6.004, 2);
 * // => 6.01
 *
 * _.ceil(6040, -2);
 * // => 6100
 */
var ceil = createRound('ceil');

/**
 * Creates a `lodash` wrapper instance that wraps `value` with explicit method
 * chain sequences enabled. The result of such sequences must be unwrapped
 * with `_#value`.
 *
 * @static
 * @memberOf _
 * @since 1.3.0
 * @category Seq
 * @param {*} value The value to wrap.
 * @returns {Object} Returns the new `lodash` wrapper instance.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36 },
 *   { 'user': 'fred',    'age': 40 },
 *   { 'user': 'pebbles', 'age': 1 }
 * ];
 *
 * var youngest = _
 *   .chain(users)
 *   .sortBy('age')
 *   .map(function(o) {
 *     return o.user + ' is ' + o.age;
 *   })
 *   .head()
 *   .value();
 * // => 'pebbles is 1'
 */
function chain(value) {
  var result = lodash(value);
  result.__chain__ = true;
  return result;
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeCeil = Math.ceil,
    nativeMax$4 = Math.max;

/**
 * Creates an array of elements split into groups the length of `size`.
 * If `array` can't be split evenly, the final chunk will be the remaining
 * elements.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to process.
 * @param {number} [size=1] The length of each chunk
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the new array of chunks.
 * @example
 *
 * _.chunk(['a', 'b', 'c', 'd'], 2);
 * // => [['a', 'b'], ['c', 'd']]
 *
 * _.chunk(['a', 'b', 'c', 'd'], 3);
 * // => [['a', 'b', 'c'], ['d']]
 */
function chunk(array, size, guard) {
  if ((guard ? isIterateeCall(array, size, guard) : size === undefined)) {
    size = 1;
  } else {
    size = nativeMax$4(toInteger(size), 0);
  }
  var length = array == null ? 0 : array.length;
  if (!length || size < 1) {
    return [];
  }
  var index = 0,
      resIndex = 0,
      result = Array(nativeCeil(length / size));

  while (index < length) {
    result[resIndex++] = baseSlice(array, index, (index += size));
  }
  return result;
}

/**
 * The base implementation of `_.clamp` which doesn't coerce arguments.
 *
 * @private
 * @param {number} number The number to clamp.
 * @param {number} [lower] The lower bound.
 * @param {number} upper The upper bound.
 * @returns {number} Returns the clamped number.
 */
function baseClamp(number, lower, upper) {
  if (number === number) {
    if (upper !== undefined) {
      number = number <= upper ? number : upper;
    }
    if (lower !== undefined) {
      number = number >= lower ? number : lower;
    }
  }
  return number;
}

/**
 * Clamps `number` within the inclusive `lower` and `upper` bounds.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Number
 * @param {number} number The number to clamp.
 * @param {number} [lower] The lower bound.
 * @param {number} upper The upper bound.
 * @returns {number} Returns the clamped number.
 * @example
 *
 * _.clamp(-10, -5, 5);
 * // => -5
 *
 * _.clamp(10, -5, 5);
 * // => 5
 */
function clamp(number, lower, upper) {
  if (upper === undefined) {
    upper = lower;
    lower = undefined;
  }
  if (upper !== undefined) {
    upper = toNumber(upper);
    upper = upper === upper ? upper : 0;
  }
  if (lower !== undefined) {
    lower = toNumber(lower);
    lower = lower === lower ? lower : 0;
  }
  return baseClamp(toNumber(number), lower, upper);
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && copyObject(source, keysIn$1(source), object);
}

/** Detect free variable `exports`. */
var freeExports$2 = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$2 = freeExports$2 && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;

/** Built-in value references. */
var Buffer$1 = moduleExports$2 ? root.Buffer : undefined,
    allocUnsafe = Buffer$1 ? Buffer$1.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/** Used for built-in method references. */
var objectProto$f = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$f.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable$1.call(object, symbol);
  });
};

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols$1 = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols$1 ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn(source), object);
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn$1, getSymbolsIn);
}

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

/* Built-in method references that are verified to be native. */
var Promise$1 = getNative(root, 'Promise');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

/** `Object#toString` result references. */
var mapTag$1 = '[object Map]',
    objectTag$2 = '[object Object]',
    promiseTag = '[object Promise]',
    setTag$1 = '[object Set]',
    weakMapTag$1 = '[object WeakMap]';

var dataViewTag$1 = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise$1),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag$1) ||
    (Map && getTag(new Map) != mapTag$1) ||
    (Promise$1 && getTag(Promise$1.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag$1) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag$1)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag$2 ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag$1;
        case mapCtorString: return mapTag$1;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag$1;
        case weakMapCtorString: return weakMapTag$1;
      }
    }
    return result;
  };
}

var getTag$1 = getTag;

/** Used for built-in method references. */
var objectProto$g = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$d = objectProto$g.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty$d.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto$1 ? symbolProto$1.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

/** `Object#toString` result references. */
var boolTag$1 = '[object Boolean]',
    dateTag$1 = '[object Date]',
    mapTag$2 = '[object Map]',
    numberTag$1 = '[object Number]',
    regexpTag$1 = '[object RegExp]',
    setTag$2 = '[object Set]',
    stringTag$1 = '[object String]',
    symbolTag$1 = '[object Symbol]';

var arrayBufferTag$1 = '[object ArrayBuffer]',
    dataViewTag$2 = '[object DataView]',
    float32Tag$1 = '[object Float32Array]',
    float64Tag$1 = '[object Float64Array]',
    int8Tag$1 = '[object Int8Array]',
    int16Tag$1 = '[object Int16Array]',
    int32Tag$1 = '[object Int32Array]',
    uint8Tag$1 = '[object Uint8Array]',
    uint8ClampedTag$1 = '[object Uint8ClampedArray]',
    uint16Tag$1 = '[object Uint16Array]',
    uint32Tag$1 = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag$1:
      return cloneArrayBuffer(object);

    case boolTag$1:
    case dateTag$1:
      return new Ctor(+object);

    case dataViewTag$2:
      return cloneDataView(object, isDeep);

    case float32Tag$1: case float64Tag$1:
    case int8Tag$1: case int16Tag$1: case int32Tag$1:
    case uint8Tag$1: case uint8ClampedTag$1: case uint16Tag$1: case uint32Tag$1:
      return cloneTypedArray(object, isDeep);

    case mapTag$2:
      return new Ctor;

    case numberTag$1:
    case stringTag$1:
      return new Ctor(object);

    case regexpTag$1:
      return cloneRegExp(object);

    case setTag$2:
      return new Ctor;

    case symbolTag$1:
      return cloneSymbol(object);
  }
}

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

/** `Object#toString` result references. */
var mapTag$3 = '[object Map]';

/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */
function baseIsMap(value) {
  return isObjectLike(value) && getTag$1(value) == mapTag$3;
}

/* Node.js helper references. */
var nodeIsMap = nodeUtil && nodeUtil.isMap;

/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */
var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

/** `Object#toString` result references. */
var setTag$3 = '[object Set]';

/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */
function baseIsSet(value) {
  return isObjectLike(value) && getTag$1(value) == setTag$3;
}

/* Node.js helper references. */
var nodeIsSet = nodeUtil && nodeUtil.isSet;

/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */
var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag$2 = '[object Arguments]',
    arrayTag$1 = '[object Array]',
    boolTag$2 = '[object Boolean]',
    dateTag$2 = '[object Date]',
    errorTag$2 = '[object Error]',
    funcTag$2 = '[object Function]',
    genTag$1 = '[object GeneratorFunction]',
    mapTag$4 = '[object Map]',
    numberTag$2 = '[object Number]',
    objectTag$3 = '[object Object]',
    regexpTag$2 = '[object RegExp]',
    setTag$4 = '[object Set]',
    stringTag$2 = '[object String]',
    symbolTag$2 = '[object Symbol]',
    weakMapTag$2 = '[object WeakMap]';

var arrayBufferTag$2 = '[object ArrayBuffer]',
    dataViewTag$3 = '[object DataView]',
    float32Tag$2 = '[object Float32Array]',
    float64Tag$2 = '[object Float64Array]',
    int8Tag$2 = '[object Int8Array]',
    int16Tag$2 = '[object Int16Array]',
    int32Tag$2 = '[object Int32Array]',
    uint8Tag$2 = '[object Uint8Array]',
    uint8ClampedTag$2 = '[object Uint8ClampedArray]',
    uint16Tag$2 = '[object Uint16Array]',
    uint32Tag$2 = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag$2] = cloneableTags[arrayTag$1] =
cloneableTags[arrayBufferTag$2] = cloneableTags[dataViewTag$3] =
cloneableTags[boolTag$2] = cloneableTags[dateTag$2] =
cloneableTags[float32Tag$2] = cloneableTags[float64Tag$2] =
cloneableTags[int8Tag$2] = cloneableTags[int16Tag$2] =
cloneableTags[int32Tag$2] = cloneableTags[mapTag$4] =
cloneableTags[numberTag$2] = cloneableTags[objectTag$3] =
cloneableTags[regexpTag$2] = cloneableTags[setTag$4] =
cloneableTags[stringTag$2] = cloneableTags[symbolTag$2] =
cloneableTags[uint8Tag$2] = cloneableTags[uint8ClampedTag$2] =
cloneableTags[uint16Tag$2] = cloneableTags[uint32Tag$2] = true;
cloneableTags[errorTag$2] = cloneableTags[funcTag$2] =
cloneableTags[weakMapTag$2] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag$1(value),
        isFunc = tag == funcTag$2 || tag == genTag$1;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag$3 || tag == argsTag$2 || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? copySymbolsIn(value, baseAssignIn(result, value))
          : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (isSet(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });

    return result;
  }

  if (isMap(value)) {
    value.forEach(function(subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });

    return result;
  }

  var keysFunc = isFull
    ? (isFlat ? getAllKeysIn : getAllKeys)
    : (isFlat ? keysIn : keys);

  var props = isArr ? undefined : keysFunc(value);
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

/** Used to compose bitmasks for cloning. */
var CLONE_SYMBOLS_FLAG$1 = 4;

/**
 * Creates a shallow clone of `value`.
 *
 * **Note:** This method is loosely based on the
 * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
 * and supports cloning arrays, array buffers, booleans, date objects, maps,
 * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
 * arrays. The own enumerable properties of `arguments` objects are cloned
 * as plain objects. An empty object is returned for uncloneable values such
 * as error objects, functions, DOM nodes, and WeakMaps.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to clone.
 * @returns {*} Returns the cloned value.
 * @see _.cloneDeep
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var shallow = _.clone(objects);
 * console.log(shallow[0] === objects[0]);
 * // => true
 */
function clone(value) {
  return baseClone(value, CLONE_SYMBOLS_FLAG$1);
}

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG$1 = 1,
    CLONE_SYMBOLS_FLAG$2 = 4;

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return baseClone(value, CLONE_DEEP_FLAG$1 | CLONE_SYMBOLS_FLAG$2);
}

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG$2 = 1,
    CLONE_SYMBOLS_FLAG$3 = 4;

/**
 * This method is like `_.cloneWith` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @param {Function} [customizer] The function to customize cloning.
 * @returns {*} Returns the deep cloned value.
 * @see _.cloneWith
 * @example
 *
 * function customizer(value) {
 *   if (_.isElement(value)) {
 *     return value.cloneNode(true);
 *   }
 * }
 *
 * var el = _.cloneDeepWith(document.body, customizer);
 *
 * console.log(el === document.body);
 * // => false
 * console.log(el.nodeName);
 * // => 'BODY'
 * console.log(el.childNodes.length);
 * // => 20
 */
function cloneDeepWith(value, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  return baseClone(value, CLONE_DEEP_FLAG$2 | CLONE_SYMBOLS_FLAG$3, customizer);
}

/** Used to compose bitmasks for cloning. */
var CLONE_SYMBOLS_FLAG$4 = 4;

/**
 * This method is like `_.clone` except that it accepts `customizer` which
 * is invoked to produce the cloned value. If `customizer` returns `undefined`,
 * cloning is handled by the method instead. The `customizer` is invoked with
 * up to four arguments; (value [, index|key, object, stack]).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to clone.
 * @param {Function} [customizer] The function to customize cloning.
 * @returns {*} Returns the cloned value.
 * @see _.cloneDeepWith
 * @example
 *
 * function customizer(value) {
 *   if (_.isElement(value)) {
 *     return value.cloneNode(false);
 *   }
 * }
 *
 * var el = _.cloneWith(document.body, customizer);
 *
 * console.log(el === document.body);
 * // => false
 * console.log(el.nodeName);
 * // => 'BODY'
 * console.log(el.childNodes.length);
 * // => 0
 */
function cloneWith(value, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  return baseClone(value, CLONE_SYMBOLS_FLAG$4, customizer);
}

/**
 * Executes the chain sequence and returns the wrapped result.
 *
 * @name commit
 * @memberOf _
 * @since 3.2.0
 * @category Seq
 * @returns {Object} Returns the new `lodash` wrapper instance.
 * @example
 *
 * var array = [1, 2];
 * var wrapped = _(array).push(3);
 *
 * console.log(array);
 * // => [1, 2]
 *
 * wrapped = wrapped.commit();
 * console.log(array);
 * // => [1, 2, 3]
 *
 * wrapped.last();
 * // => 3
 *
 * console.log(array);
 * // => [1, 2, 3]
 */
function wrapperCommit() {
  return new LodashWrapper(this.value(), this.__chain__);
}

/**
 * Creates an array with all falsey values removed. The values `false`, `null`,
 * `0`, `""`, `undefined`, and `NaN` are falsey.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to compact.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * _.compact([0, 1, false, 2, '', 3]);
 * // => [1, 2, 3]
 */
function compact(array) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (value) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/**
 * Creates a new array concatenating `array` with any additional arrays
 * and/or values.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to concatenate.
 * @param {...*} [values] The values to concatenate.
 * @returns {Array} Returns the new concatenated array.
 * @example
 *
 * var array = [1];
 * var other = _.concat(array, 2, [3], [[4]]);
 *
 * console.log(other);
 * // => [1, 2, 3, [4]]
 *
 * console.log(array);
 * // => [1]
 */
function concat() {
  var length = arguments.length;
  if (!length) {
    return [];
  }
  var args = Array(length - 1),
      array = arguments[0],
      index = length;

  while (index--) {
    args[index - 1] = arguments[index];
  }
  return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
}

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED$2);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$1 = 1,
    COMPARE_UNORDERED_FLAG$1 = 2;

/** `Object#toString` result references. */
var boolTag$3 = '[object Boolean]',
    dateTag$3 = '[object Date]',
    errorTag$3 = '[object Error]',
    mapTag$5 = '[object Map]',
    numberTag$3 = '[object Number]',
    regexpTag$3 = '[object RegExp]',
    setTag$5 = '[object Set]',
    stringTag$3 = '[object String]',
    symbolTag$3 = '[object Symbol]';

var arrayBufferTag$3 = '[object ArrayBuffer]',
    dataViewTag$4 = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto$2 = Symbol ? Symbol.prototype : undefined,
    symbolValueOf$1 = symbolProto$2 ? symbolProto$2.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag$4:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag$3:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag$3:
    case dateTag$3:
    case numberTag$3:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag$3:
      return object.name == other.name && object.message == other.message;

    case regexpTag$3:
    case stringTag$3:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag$5:
      var convert = mapToArray;

    case setTag$5:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG$1;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag$3:
      if (symbolValueOf$1) {
        return symbolValueOf$1.call(object) == symbolValueOf$1.call(other);
      }
  }
  return false;
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$2 = 1;

/** Used for built-in method references. */
var objectProto$h = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$e = objectProto$h.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty$e.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$3 = 1;

/** `Object#toString` result references. */
var argsTag$3 = '[object Arguments]',
    arrayTag$2 = '[object Array]',
    objectTag$4 = '[object Object]';

/** Used for built-in method references. */
var objectProto$i = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$f = objectProto$i.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag$2 : getTag$1(object),
      othTag = othIsArr ? arrayTag$2 : getTag$1(other);

  objTag = objTag == argsTag$3 ? objectTag$4 : objTag;
  othTag = othTag == argsTag$3 ? objectTag$4 : othTag;

  var objIsObj = objTag == objectTag$4,
      othIsObj = othTag == objectTag$4,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG$3)) {
    var objIsWrapped = objIsObj && hasOwnProperty$f.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty$f.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$4 = 1,
    COMPARE_UNORDERED_FLAG$2 = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$4 | COMPARE_UNORDERED_FLAG$2, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$5 = 1,
    COMPARE_UNORDERED_FLAG$3 = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$5 | COMPARE_UNORDERED_FLAG$3);
  };
}

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

/** Error message constants. */
var FUNC_ERROR_TEXT$4 = 'Expected a function';

/**
 * Creates a function that iterates over `pairs` and invokes the corresponding
 * function of the first predicate to return truthy. The predicate-function
 * pairs are invoked with the `this` binding and arguments of the created
 * function.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {Array} pairs The predicate-function pairs.
 * @returns {Function} Returns the new composite function.
 * @example
 *
 * var func = _.cond([
 *   [_.matches({ 'a': 1 }),           _.constant('matches A')],
 *   [_.conforms({ 'b': _.isNumber }), _.constant('matches B')],
 *   [_.stubTrue,                      _.constant('no match')]
 * ]);
 *
 * func({ 'a': 1, 'b': 2 });
 * // => 'matches A'
 *
 * func({ 'a': 0, 'b': 1 });
 * // => 'matches B'
 *
 * func({ 'a': '1', 'b': '2' });
 * // => 'no match'
 */
function cond(pairs) {
  var length = pairs == null ? 0 : pairs.length,
      toIteratee = baseIteratee;

  pairs = !length ? [] : arrayMap(pairs, function(pair) {
    if (typeof pair[1] != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT$4);
    }
    return [toIteratee(pair[0]), pair[1]];
  });

  return baseRest(function(args) {
    var index = -1;
    while (++index < length) {
      var pair = pairs[index];
      if (apply(pair[0], this, args)) {
        return apply(pair[1], this, args);
      }
    }
  });
}

/**
 * The base implementation of `_.conformsTo` which accepts `props` to check.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property predicates to conform to.
 * @returns {boolean} Returns `true` if `object` conforms, else `false`.
 */
function baseConformsTo(object, source, props) {
  var length = props.length;
  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (length--) {
    var key = props[length],
        predicate = source[key],
        value = object[key];

    if ((value === undefined && !(key in object)) || !predicate(value)) {
      return false;
    }
  }
  return true;
}

/**
 * The base implementation of `_.conforms` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property predicates to conform to.
 * @returns {Function} Returns the new spec function.
 */
function baseConforms(source) {
  var props = keys(source);
  return function(object) {
    return baseConformsTo(object, source, props);
  };
}

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG$3 = 1;

/**
 * Creates a function that invokes the predicate properties of `source` with
 * the corresponding property values of a given object, returning `true` if
 * all predicates return truthy, else `false`.
 *
 * **Note:** The created function is equivalent to `_.conformsTo` with
 * `source` partially applied.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {Object} source The object of property predicates to conform to.
 * @returns {Function} Returns the new spec function.
 * @example
 *
 * var objects = [
 *   { 'a': 2, 'b': 1 },
 *   { 'a': 1, 'b': 2 }
 * ];
 *
 * _.filter(objects, _.conforms({ 'b': function(n) { return n > 1; } }));
 * // => [{ 'a': 1, 'b': 2 }]
 */
function conforms(source) {
  return baseConforms(baseClone(source, CLONE_DEEP_FLAG$3));
}

/**
 * Checks if `object` conforms to `source` by invoking the predicate
 * properties of `source` with the corresponding property values of `object`.
 *
 * **Note:** This method is equivalent to `_.conforms` when `source` is
 * partially applied.
 *
 * @static
 * @memberOf _
 * @since 4.14.0
 * @category Lang
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property predicates to conform to.
 * @returns {boolean} Returns `true` if `object` conforms, else `false`.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 *
 * _.conformsTo(object, { 'b': function(n) { return n > 1; } });
 * // => true
 *
 * _.conformsTo(object, { 'b': function(n) { return n > 2; } });
 * // => false
 */
function conformsTo(object, source) {
  return source == null || baseConformsTo(object, source, keys(source));
}

/**
 * A specialized version of `baseAggregator` for arrays.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} setter The function to set `accumulator` values.
 * @param {Function} iteratee The iteratee to transform keys.
 * @param {Object} accumulator The initial aggregated object.
 * @returns {Function} Returns `accumulator`.
 */
function arrayAggregator(array, setter, iteratee, accumulator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    var value = array[index];
    setter(accumulator, value, iteratee(value), array);
  }
  return accumulator;
}

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

/**
 * Aggregates elements of `collection` on `accumulator` with keys transformed
 * by `iteratee` and values set by `setter`.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} setter The function to set `accumulator` values.
 * @param {Function} iteratee The iteratee to transform keys.
 * @param {Object} accumulator The initial aggregated object.
 * @returns {Function} Returns `accumulator`.
 */
function baseAggregator(collection, setter, iteratee, accumulator) {
  baseEach(collection, function(value, key, collection) {
    setter(accumulator, value, iteratee(value), collection);
  });
  return accumulator;
}

/**
 * Creates a function like `_.groupBy`.
 *
 * @private
 * @param {Function} setter The function to set accumulator values.
 * @param {Function} [initializer] The accumulator object initializer.
 * @returns {Function} Returns the new aggregator function.
 */
function createAggregator(setter, initializer) {
  return function(collection, iteratee) {
    var func = isArray(collection) ? arrayAggregator : baseAggregator,
        accumulator = initializer ? initializer() : {};

    return func(collection, setter, baseIteratee(iteratee), accumulator);
  };
}

/** Used for built-in method references. */
var objectProto$j = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$g = objectProto$j.hasOwnProperty;

/**
 * Creates an object composed of keys generated from the results of running
 * each element of `collection` thru `iteratee`. The corresponding value of
 * each key is the number of times the key was returned by `iteratee`. The
 * iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 0.5.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
 * @returns {Object} Returns the composed aggregate object.
 * @example
 *
 * _.countBy([6.1, 4.2, 6.3], Math.floor);
 * // => { '4': 1, '6': 2 }
 *
 * // The `_.property` iteratee shorthand.
 * _.countBy(['one', 'two', 'three'], 'length');
 * // => { '3': 2, '5': 1 }
 */
var countBy = createAggregator(function(result, value, key) {
  if (hasOwnProperty$g.call(result, key)) {
    ++result[key];
  } else {
    baseAssignValue(result, key, 1);
  }
});

/**
 * Creates an object that inherits from the `prototype` object. If a
 * `properties` object is given, its own enumerable string keyed properties
 * are assigned to the created object.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Object
 * @param {Object} prototype The object to inherit from.
 * @param {Object} [properties] The properties to assign to the object.
 * @returns {Object} Returns the new object.
 * @example
 *
 * function Shape() {
 *   this.x = 0;
 *   this.y = 0;
 * }
 *
 * function Circle() {
 *   Shape.call(this);
 * }
 *
 * Circle.prototype = _.create(Shape.prototype, {
 *   'constructor': Circle
 * });
 *
 * var circle = new Circle;
 * circle instanceof Circle;
 * // => true
 *
 * circle instanceof Shape;
 * // => true
 */
function create(prototype, properties) {
  var result = baseCreate(prototype);
  return properties == null ? result : baseAssign(result, properties);
}

/** Used to compose bitmasks for function metadata. */
var WRAP_CURRY_FLAG$5 = 8;

/**
 * Creates a function that accepts arguments of `func` and either invokes
 * `func` returning its result, if at least `arity` number of arguments have
 * been provided, or returns a function that accepts the remaining `func`
 * arguments, and so on. The arity of `func` may be specified if `func.length`
 * is not sufficient.
 *
 * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
 * may be used as a placeholder for provided arguments.
 *
 * **Note:** This method doesn't set the "length" property of curried functions.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Function
 * @param {Function} func The function to curry.
 * @param {number} [arity=func.length] The arity of `func`.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Function} Returns the new curried function.
 * @example
 *
 * var abc = function(a, b, c) {
 *   return [a, b, c];
 * };
 *
 * var curried = _.curry(abc);
 *
 * curried(1)(2)(3);
 * // => [1, 2, 3]
 *
 * curried(1, 2)(3);
 * // => [1, 2, 3]
 *
 * curried(1, 2, 3);
 * // => [1, 2, 3]
 *
 * // Curried with placeholders.
 * curried(1)(_, 3)(2);
 * // => [1, 2, 3]
 */
function curry(func, arity, guard) {
  arity = guard ? undefined : arity;
  var result = createWrap(func, WRAP_CURRY_FLAG$5, undefined, undefined, undefined, undefined, undefined, arity);
  result.placeholder = curry.placeholder;
  return result;
}

// Assign default placeholders.
curry.placeholder = {};

/** Used to compose bitmasks for function metadata. */
var WRAP_CURRY_RIGHT_FLAG$3 = 16;

/**
 * This method is like `_.curry` except that arguments are applied to `func`
 * in the manner of `_.partialRight` instead of `_.partial`.
 *
 * The `_.curryRight.placeholder` value, which defaults to `_` in monolithic
 * builds, may be used as a placeholder for provided arguments.
 *
 * **Note:** This method doesn't set the "length" property of curried functions.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Function
 * @param {Function} func The function to curry.
 * @param {number} [arity=func.length] The arity of `func`.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Function} Returns the new curried function.
 * @example
 *
 * var abc = function(a, b, c) {
 *   return [a, b, c];
 * };
 *
 * var curried = _.curryRight(abc);
 *
 * curried(3)(2)(1);
 * // => [1, 2, 3]
 *
 * curried(2, 3)(1);
 * // => [1, 2, 3]
 *
 * curried(1, 2, 3);
 * // => [1, 2, 3]
 *
 * // Curried with placeholders.
 * curried(3)(1, _)(2);
 * // => [1, 2, 3]
 */
function curryRight(func, arity, guard) {
  arity = guard ? undefined : arity;
  var result = createWrap(func, WRAP_CURRY_RIGHT_FLAG$3, undefined, undefined, undefined, undefined, undefined, arity);
  result.placeholder = curryRight.placeholder;
  return result;
}

// Assign default placeholders.
curryRight.placeholder = {};

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/** Error message constants. */
var FUNC_ERROR_TEXT$5 = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax$5 = Math.max,
    nativeMin$3 = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT$5);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax$5(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? nativeMin$3(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Checks `value` to determine whether a default value should be returned in
 * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
 * or `undefined`.
 *
 * @static
 * @memberOf _
 * @since 4.14.0
 * @category Util
 * @param {*} value The value to check.
 * @param {*} defaultValue The default value.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * _.defaultTo(1, 10);
 * // => 1
 *
 * _.defaultTo(undefined, 10);
 * // => 10
 */
function defaultTo(value, defaultValue) {
  return (value == null || value !== value) ? defaultValue : value;
}

/** Used for built-in method references. */
var objectProto$k = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$h = objectProto$k.hasOwnProperty;

/**
 * Assigns own and inherited enumerable string keyed properties of source
 * objects to the destination object for all destination properties that
 * resolve to `undefined`. Source objects are applied from left to right.
 * Once a property is set, additional values of the same property are ignored.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.defaultsDeep
 * @example
 *
 * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var defaults = baseRest(function(object, sources) {
  object = Object(object);

  var index = -1;
  var length = sources.length;
  var guard = length > 2 ? sources[2] : undefined;

  if (guard && isIterateeCall(sources[0], sources[1], guard)) {
    length = 1;
  }

  while (++index < length) {
    var source = sources[index];
    var props = keysIn$1(source);
    var propsIndex = -1;
    var propsLength = props.length;

    while (++propsIndex < propsLength) {
      var key = props[propsIndex];
      var value = object[key];

      if (value === undefined ||
          (eq(value, objectProto$k[key]) && !hasOwnProperty$h.call(object, key))) {
        object[key] = source[key];
      }
    }
  }

  return object;
});

/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue(object, key, value) {
  if ((value !== undefined && !eq(object[key], value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Gets the value at `key`, unless `key` is "__proto__".
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function safeGet(object, key) {
  if (key == '__proto__') {
    return;
  }

  return object[key];
}

/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject(value) {
  return copyObject(value, keysIn$1(value));
}

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = safeGet(object, key),
      srcValue = safeGet(source, key),
      stacked = stack.get(srcValue);

  if (stacked) {
    assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer
    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
    : undefined;

  var isCommon = newValue === undefined;

  if (isCommon) {
    var isArr = isArray(srcValue),
        isBuff = !isArr && isBuffer(srcValue),
        isTyped = !isArr && !isBuff && isTypedArray(srcValue);

    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray(objValue)) {
        newValue = objValue;
      }
      else if (isArrayLikeObject(objValue)) {
        newValue = copyArray(objValue);
      }
      else if (isBuff) {
        isCommon = false;
        newValue = cloneBuffer(srcValue, true);
      }
      else if (isTyped) {
        isCommon = false;
        newValue = cloneTypedArray(srcValue, true);
      }
      else {
        newValue = [];
      }
    }
    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      newValue = objValue;
      if (isArguments(objValue)) {
        newValue = toPlainObject(objValue);
      }
      else if (!isObject(objValue) || isFunction(objValue)) {
        newValue = initCloneObject(srcValue);
      }
    }
    else {
      isCommon = false;
    }
  }
  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }
  assignMergeValue(object, key, newValue);
}

/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  baseFor(source, function(srcValue, key) {
    if (isObject(srcValue)) {
      stack || (stack = new Stack);
      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    }
    else {
      var newValue = customizer
        ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)
        : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }
      assignMergeValue(object, key, newValue);
    }
  }, keysIn$1);
}

/**
 * Used by `_.defaultsDeep` to customize its `_.merge` use to merge source
 * objects into destination objects that are passed thru.
 *
 * @private
 * @param {*} objValue The destination value.
 * @param {*} srcValue The source value.
 * @param {string} key The key of the property to merge.
 * @param {Object} object The parent object of `objValue`.
 * @param {Object} source The parent object of `srcValue`.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 * @returns {*} Returns the value to assign.
 */
function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
  if (isObject(objValue) && isObject(srcValue)) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, objValue);
    baseMerge(objValue, srcValue, undefined, customDefaultsMerge, stack);
    stack['delete'](srcValue);
  }
  return objValue;
}

/**
 * This method is like `_.merge` except that it accepts `customizer` which
 * is invoked to produce the merged values of the destination and source
 * properties. If `customizer` returns `undefined`, merging is handled by the
 * method instead. The `customizer` is invoked with six arguments:
 * (objValue, srcValue, key, object, source, stack).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} customizer The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   if (_.isArray(objValue)) {
 *     return objValue.concat(srcValue);
 *   }
 * }
 *
 * var object = { 'a': [1], 'b': [2] };
 * var other = { 'a': [3], 'b': [4] };
 *
 * _.mergeWith(object, other, customizer);
 * // => { 'a': [1, 3], 'b': [2, 4] }
 */
var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
  baseMerge(object, source, srcIndex, customizer);
});

/**
 * This method is like `_.defaults` except that it recursively assigns
 * default properties.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 3.10.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.defaults
 * @example
 *
 * _.defaultsDeep({ 'a': { 'b': 2 } }, { 'a': { 'b': 1, 'c': 3 } });
 * // => { 'a': { 'b': 2, 'c': 3 } }
 */
var defaultsDeep = baseRest(function(args) {
  args.push(undefined, customDefaultsMerge);
  return apply(mergeWith, undefined, args);
});

/** Error message constants. */
var FUNC_ERROR_TEXT$6 = 'Expected a function';

/**
 * The base implementation of `_.delay` and `_.defer` which accepts `args`
 * to provide to `func`.
 *
 * @private
 * @param {Function} func The function to delay.
 * @param {number} wait The number of milliseconds to delay invocation.
 * @param {Array} args The arguments to provide to `func`.
 * @returns {number|Object} Returns the timer id or timeout object.
 */
function baseDelay(func, wait, args) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT$6);
  }
  return setTimeout(function() { func.apply(undefined, args); }, wait);
}

/**
 * Defers invoking the `func` until the current call stack has cleared. Any
 * additional arguments are provided to `func` when it's invoked.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to defer.
 * @param {...*} [args] The arguments to invoke `func` with.
 * @returns {number} Returns the timer id.
 * @example
 *
 * _.defer(function(text) {
 *   console.log(text);
 * }, 'deferred');
 * // => Logs 'deferred' after one millisecond.
 */
var defer = baseRest(function(func, args) {
  return baseDelay(func, 1, args);
});

/**
 * Invokes `func` after `wait` milliseconds. Any additional arguments are
 * provided to `func` when it's invoked.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to delay.
 * @param {number} wait The number of milliseconds to delay invocation.
 * @param {...*} [args] The arguments to invoke `func` with.
 * @returns {number} Returns the timer id.
 * @example
 *
 * _.delay(function(text) {
 *   console.log(text);
 * }, 1000, 'later');
 * // => Logs 'later' after one second.
 */
var delay = baseRest(function(func, wait, args) {
  return baseDelay(func, toNumber(wait) || 0, args);
});

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE$1 = 200;

/**
 * The base implementation of methods like `_.difference` without support
 * for excluding multiple arrays or iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Array} values The values to exclude.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 */
function baseDifference(array, values, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      isCommon = true,
      length = array.length,
      result = [],
      valuesLength = values.length;

  if (!length) {
    return result;
  }
  if (iteratee) {
    values = arrayMap(values, baseUnary(iteratee));
  }
  if (comparator) {
    includes = arrayIncludesWith;
    isCommon = false;
  }
  else if (values.length >= LARGE_ARRAY_SIZE$1) {
    includes = cacheHas;
    isCommon = false;
    values = new SetCache(values);
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee == null ? value : iteratee(value);

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var valuesIndex = valuesLength;
      while (valuesIndex--) {
        if (values[valuesIndex] === computed) {
          continue outer;
        }
      }
      result.push(value);
    }
    else if (!includes(values, computed, comparator)) {
      result.push(value);
    }
  }
  return result;
}

/**
 * Creates an array of `array` values not included in the other given arrays
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. The order and references of result values are
 * determined by the first array.
 *
 * **Note:** Unlike `_.pullAll`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...Array} [values] The values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 * @see _.without, _.xor
 * @example
 *
 * _.difference([2, 1], [2, 3]);
 * // => [1]
 */
var difference = baseRest(function(array, values) {
  return isArrayLikeObject(array)
    ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
    : [];
});

/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

/**
 * This method is like `_.difference` except that it accepts `iteratee` which
 * is invoked for each element of `array` and `values` to generate the criterion
 * by which they're compared. The order and references of result values are
 * determined by the first array. The iteratee is invoked with one argument:
 * (value).
 *
 * **Note:** Unlike `_.pullAllBy`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...Array} [values] The values to exclude.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * _.differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor);
 * // => [1.2]
 *
 * // The `_.property` iteratee shorthand.
 * _.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x');
 * // => [{ 'x': 2 }]
 */
var differenceBy = baseRest(function(array, values) {
  var iteratee = last(values);
  if (isArrayLikeObject(iteratee)) {
    iteratee = undefined;
  }
  return isArrayLikeObject(array)
    ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), baseIteratee(iteratee))
    : [];
});

/**
 * This method is like `_.difference` except that it accepts `comparator`
 * which is invoked to compare elements of `array` to `values`. The order and
 * references of result values are determined by the first array. The comparator
 * is invoked with two arguments: (arrVal, othVal).
 *
 * **Note:** Unlike `_.pullAllWith`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...Array} [values] The values to exclude.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
 *
 * _.differenceWith(objects, [{ 'x': 1, 'y': 2 }], _.isEqual);
 * // => [{ 'x': 2, 'y': 1 }]
 */
var differenceWith = baseRest(function(array, values) {
  var comparator = last(values);
  if (isArrayLikeObject(comparator)) {
    comparator = undefined;
  }
  return isArrayLikeObject(array)
    ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), undefined, comparator)
    : [];
});

/**
 * Divide two numbers.
 *
 * @static
 * @memberOf _
 * @since 4.7.0
 * @category Math
 * @param {number} dividend The first number in a division.
 * @param {number} divisor The second number in a division.
 * @returns {number} Returns the quotient.
 * @example
 *
 * _.divide(6, 4);
 * // => 1.5
 */
var divide = createMathOperation(function(dividend, divisor) {
  return dividend / divisor;
}, 1);

/**
 * Creates a slice of `array` with `n` elements dropped from the beginning.
 *
 * @static
 * @memberOf _
 * @since 0.5.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {number} [n=1] The number of elements to drop.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.drop([1, 2, 3]);
 * // => [2, 3]
 *
 * _.drop([1, 2, 3], 2);
 * // => [3]
 *
 * _.drop([1, 2, 3], 5);
 * // => []
 *
 * _.drop([1, 2, 3], 0);
 * // => [1, 2, 3]
 */
function drop(array, n, guard) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  n = (guard || n === undefined) ? 1 : toInteger(n);
  return baseSlice(array, n < 0 ? 0 : n, length);
}

/**
 * Creates a slice of `array` with `n` elements dropped from the end.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {number} [n=1] The number of elements to drop.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.dropRight([1, 2, 3]);
 * // => [1, 2]
 *
 * _.dropRight([1, 2, 3], 2);
 * // => [1]
 *
 * _.dropRight([1, 2, 3], 5);
 * // => []
 *
 * _.dropRight([1, 2, 3], 0);
 * // => [1, 2, 3]
 */
function dropRight(array, n, guard) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  n = (guard || n === undefined) ? 1 : toInteger(n);
  n = length - n;
  return baseSlice(array, 0, n < 0 ? 0 : n);
}

/**
 * The base implementation of methods like `_.dropWhile` and `_.takeWhile`
 * without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to query.
 * @param {Function} predicate The function invoked per iteration.
 * @param {boolean} [isDrop] Specify dropping elements instead of taking them.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Array} Returns the slice of `array`.
 */
function baseWhile(array, predicate, isDrop, fromRight) {
  var length = array.length,
      index = fromRight ? length : -1;

  while ((fromRight ? index-- : ++index < length) &&
    predicate(array[index], index, array)) {}

  return isDrop
    ? baseSlice(array, (fromRight ? 0 : index), (fromRight ? index + 1 : length))
    : baseSlice(array, (fromRight ? index + 1 : 0), (fromRight ? length : index));
}

/**
 * Creates a slice of `array` excluding elements dropped from the end.
 * Elements are dropped until `predicate` returns falsey. The predicate is
 * invoked with three arguments: (value, index, array).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': true },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': false }
 * ];
 *
 * _.dropRightWhile(users, function(o) { return !o.active; });
 * // => objects for ['barney']
 *
 * // The `_.matches` iteratee shorthand.
 * _.dropRightWhile(users, { 'user': 'pebbles', 'active': false });
 * // => objects for ['barney', 'fred']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.dropRightWhile(users, ['active', false]);
 * // => objects for ['barney']
 *
 * // The `_.property` iteratee shorthand.
 * _.dropRightWhile(users, 'active');
 * // => objects for ['barney', 'fred', 'pebbles']
 */
function dropRightWhile(array, predicate) {
  return (array && array.length)
    ? baseWhile(array, baseIteratee(predicate), true, true)
    : [];
}

/**
 * Creates a slice of `array` excluding elements dropped from the beginning.
 * Elements are dropped until `predicate` returns falsey. The predicate is
 * invoked with three arguments: (value, index, array).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': true }
 * ];
 *
 * _.dropWhile(users, function(o) { return !o.active; });
 * // => objects for ['pebbles']
 *
 * // The `_.matches` iteratee shorthand.
 * _.dropWhile(users, { 'user': 'barney', 'active': false });
 * // => objects for ['fred', 'pebbles']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.dropWhile(users, ['active', false]);
 * // => objects for ['pebbles']
 *
 * // The `_.property` iteratee shorthand.
 * _.dropWhile(users, 'active');
 * // => objects for ['barney', 'fred', 'pebbles']
 */
function dropWhile(array, predicate) {
  return (array && array.length)
    ? baseWhile(array, baseIteratee(predicate), true)
    : [];
}

/**
 * Casts `value` to `identity` if it's not a function.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Function} Returns cast function.
 */
function castFunction(value) {
  return typeof value == 'function' ? value : identity;
}

/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _.forEach([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = isArray(collection) ? arrayEach : baseEach;
  return func(collection, castFunction(iteratee));
}

/**
 * A specialized version of `_.forEachRight` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEachRight(array, iteratee) {
  var length = array == null ? 0 : array.length;

  while (length--) {
    if (iteratee(array[length], length, array) === false) {
      break;
    }
  }
  return array;
}

/**
 * This function is like `baseFor` except that it iterates over properties
 * in the opposite order.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseForRight = createBaseFor(true);

/**
 * The base implementation of `_.forOwnRight` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwnRight(object, iteratee) {
  return object && baseForRight(object, iteratee, keys);
}

/**
 * The base implementation of `_.forEachRight` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEachRight = createBaseEach(baseForOwnRight, true);

/**
 * This method is like `_.forEach` except that it iterates over elements of
 * `collection` from right to left.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @alias eachRight
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEach
 * @example
 *
 * _.forEachRight([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `2` then `1`.
 */
function forEachRight(collection, iteratee) {
  var func = isArray(collection) ? arrayEachRight : baseEachRight;
  return func(collection, castFunction(iteratee));
}

/**
 * Checks if `string` ends with the given target string.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to inspect.
 * @param {string} [target] The string to search for.
 * @param {number} [position=string.length] The position to search up to.
 * @returns {boolean} Returns `true` if `string` ends with `target`,
 *  else `false`.
 * @example
 *
 * _.endsWith('abc', 'c');
 * // => true
 *
 * _.endsWith('abc', 'b');
 * // => false
 *
 * _.endsWith('abc', 'b', 2);
 * // => true
 */
function endsWith(string, target, position) {
  string = toString(string);
  target = baseToString(target);

  var length = string.length;
  position = position === undefined
    ? length
    : baseClamp(toInteger(position), 0, length);

  var end = position;
  position -= target.length;
  return position >= 0 && string.slice(position, end) == target;
}

/**
 * The base implementation of `_.toPairs` and `_.toPairsIn` which creates an array
 * of key-value pairs for `object` corresponding to the property names of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the key-value pairs.
 */
function baseToPairs(object, props) {
  return arrayMap(props, function(key) {
    return [key, object[key]];
  });
}

/**
 * Converts `set` to its value-value pairs.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the value-value pairs.
 */
function setToPairs(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = [value, value];
  });
  return result;
}

/** `Object#toString` result references. */
var mapTag$6 = '[object Map]',
    setTag$6 = '[object Set]';

/**
 * Creates a `_.toPairs` or `_.toPairsIn` function.
 *
 * @private
 * @param {Function} keysFunc The function to get the keys of a given object.
 * @returns {Function} Returns the new pairs function.
 */
function createToPairs(keysFunc) {
  return function(object) {
    var tag = getTag$1(object);
    if (tag == mapTag$6) {
      return mapToArray(object);
    }
    if (tag == setTag$6) {
      return setToPairs(object);
    }
    return baseToPairs(object, keysFunc(object));
  };
}

/**
 * Creates an array of own enumerable string keyed-value pairs for `object`
 * which can be consumed by `_.fromPairs`. If `object` is a map or set, its
 * entries are returned.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @alias entries
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the key-value pairs.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.toPairs(new Foo);
 * // => [['a', 1], ['b', 2]] (iteration order is not guaranteed)
 */
var toPairs = createToPairs(keys);

/**
 * Creates an array of own and inherited enumerable string keyed-value pairs
 * for `object` which can be consumed by `_.fromPairs`. If `object` is a map
 * or set, its entries are returned.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @alias entriesIn
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the key-value pairs.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.toPairsIn(new Foo);
 * // => [['a', 1], ['b', 2], ['c', 3]] (iteration order is not guaranteed)
 */
var toPairsIn = createToPairs(keysIn$1);

/** Used to map characters to HTML entities. */
var htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

/**
 * Used by `_.escape` to convert characters to HTML entities.
 *
 * @private
 * @param {string} chr The matched character to escape.
 * @returns {string} Returns the escaped character.
 */
var escapeHtmlChar = basePropertyOf(htmlEscapes);

/** Used to match HTML entities and HTML characters. */
var reUnescapedHtml = /[&<>"']/g,
    reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

/**
 * Converts the characters "&", "<", ">", '"', and "'" in `string` to their
 * corresponding HTML entities.
 *
 * **Note:** No other characters are escaped. To escape additional
 * characters use a third-party library like [_he_](https://mths.be/he).
 *
 * Though the ">" character is escaped for symmetry, characters like
 * ">" and "/" don't need escaping in HTML and have no special meaning
 * unless they're part of a tag or unquoted attribute value. See
 * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
 * (under "semi-related fun fact") for more details.
 *
 * When working with HTML you should always
 * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
 * XSS vectors.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escape('fred, barney, & pebbles');
 * // => 'fred, barney, &amp; pebbles'
 */
function escape(string) {
  string = toString(string);
  return (string && reHasUnescapedHtml.test(string))
    ? string.replace(reUnescapedHtml, escapeHtmlChar)
    : string;
}

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar$1 = /[\\^$.*+?()[\]{}|]/g,
    reHasRegExpChar = RegExp(reRegExpChar$1.source);

/**
 * Escapes the `RegExp` special characters "^", "$", "\", ".", "*", "+",
 * "?", "(", ")", "[", "]", "{", "}", and "|" in `string`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escapeRegExp('[lodash](https://lodash.com/)');
 * // => '\[lodash\]\(https://lodash\.com/\)'
 */
function escapeRegExp(string) {
  string = toString(string);
  return (string && reHasRegExpChar.test(string))
    ? string.replace(reRegExpChar$1, '\\$&')
    : string;
}

/**
 * A specialized version of `_.every` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if all elements pass the predicate check,
 *  else `false`.
 */
function arrayEvery(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (!predicate(array[index], index, array)) {
      return false;
    }
  }
  return true;
}

/**
 * The base implementation of `_.every` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if all elements pass the predicate check,
 *  else `false`
 */
function baseEvery(collection, predicate) {
  var result = true;
  baseEach(collection, function(value, index, collection) {
    result = !!predicate(value, index, collection);
    return result;
  });
  return result;
}

/**
 * Checks if `predicate` returns truthy for **all** elements of `collection`.
 * Iteration is stopped once `predicate` returns falsey. The predicate is
 * invoked with three arguments: (value, index|key, collection).
 *
 * **Note:** This method returns `true` for
 * [empty collections](https://en.wikipedia.org/wiki/Empty_set) because
 * [everything is true](https://en.wikipedia.org/wiki/Vacuous_truth) of
 * elements of empty collections.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {boolean} Returns `true` if all elements pass the predicate check,
 *  else `false`.
 * @example
 *
 * _.every([true, 1, null, 'yes'], Boolean);
 * // => false
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': false },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * // The `_.matches` iteratee shorthand.
 * _.every(users, { 'user': 'barney', 'active': false });
 * // => false
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.every(users, ['active', false]);
 * // => true
 *
 * // The `_.property` iteratee shorthand.
 * _.every(users, 'active');
 * // => false
 */
function every(collection, predicate, guard) {
  var func = isArray(collection) ? arrayEvery : baseEvery;
  if (guard && isIterateeCall(collection, predicate, guard)) {
    predicate = undefined;
  }
  return func(collection, baseIteratee(predicate));
}

/** Used as references for the maximum length and index of an array. */
var MAX_ARRAY_LENGTH$1 = 4294967295;

/**
 * Converts `value` to an integer suitable for use as the length of an
 * array-like object.
 *
 * **Note:** This method is based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toLength(3.2);
 * // => 3
 *
 * _.toLength(Number.MIN_VALUE);
 * // => 0
 *
 * _.toLength(Infinity);
 * // => 4294967295
 *
 * _.toLength('3.2');
 * // => 3
 */
function toLength(value) {
  return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH$1) : 0;
}

/**
 * The base implementation of `_.fill` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to fill.
 * @param {*} value The value to fill `array` with.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns `array`.
 */
function baseFill(array, value, start, end) {
  var length = array.length;

  start = toInteger(start);
  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = (end === undefined || end > length) ? length : toInteger(end);
  if (end < 0) {
    end += length;
  }
  end = start > end ? 0 : toLength(end);
  while (start < end) {
    array[start++] = value;
  }
  return array;
}

/**
 * Fills elements of `array` with `value` from `start` up to, but not
 * including, `end`.
 *
 * **Note:** This method mutates `array`.
 *
 * @static
 * @memberOf _
 * @since 3.2.0
 * @category Array
 * @param {Array} array The array to fill.
 * @param {*} value The value to fill `array` with.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = [1, 2, 3];
 *
 * _.fill(array, 'a');
 * console.log(array);
 * // => ['a', 'a', 'a']
 *
 * _.fill(Array(3), 2);
 * // => [2, 2, 2]
 *
 * _.fill([4, 6, 8, 10], '*', 1, 3);
 * // => [4, '*', '*', 10]
 */
function fill(array, value, start, end) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
    start = 0;
    end = length;
  }
  return baseFill(array, value, start, end);
}

/**
 * The base implementation of `_.filter` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function baseFilter(collection, predicate) {
  var result = [];
  baseEach(collection, function(value, index, collection) {
    if (predicate(value, index, collection)) {
      result.push(value);
    }
  });
  return result;
}

/**
 * Iterates over elements of `collection`, returning an array of all elements
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * **Note:** Unlike `_.remove`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 * @see _.reject
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * _.filter(users, function(o) { return !o.active; });
 * // => objects for ['fred']
 *
 * // The `_.matches` iteratee shorthand.
 * _.filter(users, { 'age': 36, 'active': true });
 * // => objects for ['barney']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.filter(users, ['active', false]);
 * // => objects for ['fred']
 *
 * // The `_.property` iteratee shorthand.
 * _.filter(users, 'active');
 * // => objects for ['barney']
 */
function filter(collection, predicate) {
  var func = isArray(collection) ? arrayFilter : baseFilter;
  return func(collection, baseIteratee(predicate));
}

/**
 * Creates a `_.find` or `_.findLast` function.
 *
 * @private
 * @param {Function} findIndexFunc The function to find the collection index.
 * @returns {Function} Returns the new find function.
 */
function createFind(findIndexFunc) {
  return function(collection, predicate, fromIndex) {
    var iterable = Object(collection);
    if (!isArrayLike(collection)) {
      var iteratee = baseIteratee(predicate);
      collection = keys(collection);
      predicate = function(key) { return iteratee(iterable[key], key, iterable); };
    }
    var index = findIndexFunc(collection, predicate, fromIndex);
    return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
  };
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax$6 = Math.max;

/**
 * This method is like `_.find` except that it returns the index of the first
 * element `predicate` returns truthy for instead of the element itself.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': true }
 * ];
 *
 * _.findIndex(users, function(o) { return o.user == 'barney'; });
 * // => 0
 *
 * // The `_.matches` iteratee shorthand.
 * _.findIndex(users, { 'user': 'fred', 'active': false });
 * // => 1
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findIndex(users, ['active', false]);
 * // => 0
 *
 * // The `_.property` iteratee shorthand.
 * _.findIndex(users, 'active');
 * // => 2
 */
function findIndex(array, predicate, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger(fromIndex);
  if (index < 0) {
    index = nativeMax$6(length + index, 0);
  }
  return baseFindIndex(array, baseIteratee(predicate), index);
}

/**
 * Iterates over elements of `collection`, returning the first element
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': true },
 *   { 'user': 'fred',    'age': 40, 'active': false },
 *   { 'user': 'pebbles', 'age': 1,  'active': true }
 * ];
 *
 * _.find(users, function(o) { return o.age < 40; });
 * // => object for 'barney'
 *
 * // The `_.matches` iteratee shorthand.
 * _.find(users, { 'age': 1, 'active': true });
 * // => object for 'pebbles'
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.find(users, ['active', false]);
 * // => object for 'fred'
 *
 * // The `_.property` iteratee shorthand.
 * _.find(users, 'active');
 * // => object for 'barney'
 */
var find = createFind(findIndex);

/**
 * The base implementation of methods like `_.findKey` and `_.findLastKey`,
 * without support for iteratee shorthands, which iterates over `collection`
 * using `eachFunc`.
 *
 * @private
 * @param {Array|Object} collection The collection to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {Function} eachFunc The function to iterate over `collection`.
 * @returns {*} Returns the found element or its key, else `undefined`.
 */
function baseFindKey(collection, predicate, eachFunc) {
  var result;
  eachFunc(collection, function(value, key, collection) {
    if (predicate(value, key, collection)) {
      result = key;
      return false;
    }
  });
  return result;
}

/**
 * This method is like `_.find` except that it returns the key of the first
 * element `predicate` returns truthy for instead of the element itself.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category Object
 * @param {Object} object The object to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {string|undefined} Returns the key of the matched element,
 *  else `undefined`.
 * @example
 *
 * var users = {
 *   'barney':  { 'age': 36, 'active': true },
 *   'fred':    { 'age': 40, 'active': false },
 *   'pebbles': { 'age': 1,  'active': true }
 * };
 *
 * _.findKey(users, function(o) { return o.age < 40; });
 * // => 'barney' (iteration order is not guaranteed)
 *
 * // The `_.matches` iteratee shorthand.
 * _.findKey(users, { 'age': 1, 'active': true });
 * // => 'pebbles'
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findKey(users, ['active', false]);
 * // => 'fred'
 *
 * // The `_.property` iteratee shorthand.
 * _.findKey(users, 'active');
 * // => 'barney'
 */
function findKey(object, predicate) {
  return baseFindKey(object, baseIteratee(predicate), baseForOwn);
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax$7 = Math.max,
    nativeMin$4 = Math.min;

/**
 * This method is like `_.findIndex` except that it iterates over elements
 * of `collection` from right to left.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=array.length-1] The index to search from.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': true },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': false }
 * ];
 *
 * _.findLastIndex(users, function(o) { return o.user == 'pebbles'; });
 * // => 2
 *
 * // The `_.matches` iteratee shorthand.
 * _.findLastIndex(users, { 'user': 'barney', 'active': true });
 * // => 0
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findLastIndex(users, ['active', false]);
 * // => 2
 *
 * // The `_.property` iteratee shorthand.
 * _.findLastIndex(users, 'active');
 * // => 0
 */
function findLastIndex(array, predicate, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = length - 1;
  if (fromIndex !== undefined) {
    index = toInteger(fromIndex);
    index = fromIndex < 0
      ? nativeMax$7(length + index, 0)
      : nativeMin$4(index, length - 1);
  }
  return baseFindIndex(array, baseIteratee(predicate), index, true);
}

/**
 * This method is like `_.find` except that it iterates over elements of
 * `collection` from right to left.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=collection.length-1] The index to search from.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * _.findLast([1, 2, 3, 4], function(n) {
 *   return n % 2 == 1;
 * });
 * // => 3
 */
var findLast = createFind(findLastIndex);

/**
 * This method is like `_.findKey` except that it iterates over elements of
 * a collection in the opposite order.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Object
 * @param {Object} object The object to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {string|undefined} Returns the key of the matched element,
 *  else `undefined`.
 * @example
 *
 * var users = {
 *   'barney':  { 'age': 36, 'active': true },
 *   'fred':    { 'age': 40, 'active': false },
 *   'pebbles': { 'age': 1,  'active': true }
 * };
 *
 * _.findLastKey(users, function(o) { return o.age < 40; });
 * // => returns 'pebbles' assuming `_.findKey` returns 'barney'
 *
 * // The `_.matches` iteratee shorthand.
 * _.findLastKey(users, { 'age': 36, 'active': true });
 * // => 'barney'
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findLastKey(users, ['active', false]);
 * // => 'fred'
 *
 * // The `_.property` iteratee shorthand.
 * _.findLastKey(users, 'active');
 * // => 'pebbles'
 */
function findLastKey(object, predicate) {
  return baseFindKey(object, baseIteratee(predicate), baseForOwnRight);
}

/**
 * Gets the first element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias first
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the first element of `array`.
 * @example
 *
 * _.head([1, 2, 3]);
 * // => 1
 *
 * _.head([]);
 * // => undefined
 */
function head(array) {
  return (array && array.length) ? array[0] : undefined;
}

/**
 * The base implementation of `_.map` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
  var index = -1,
      result = isArrayLike(collection) ? Array(collection.length) : [];

  baseEach(collection, function(value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

/**
 * Creates an array of values by running each element in `collection` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
 *
 * The guarded methods are:
 * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
 * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
 * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
 * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * _.map([4, 8], square);
 * // => [16, 64]
 *
 * _.map({ 'a': 4, 'b': 8 }, square);
 * // => [16, 64] (iteration order is not guaranteed)
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * // The `_.property` iteratee shorthand.
 * _.map(users, 'user');
 * // => ['barney', 'fred']
 */
function map(collection, iteratee) {
  var func = isArray(collection) ? arrayMap : baseMap;
  return func(collection, baseIteratee(iteratee));
}

/**
 * Creates a flattened array of values by running each element in `collection`
 * thru `iteratee` and flattening the mapped results. The iteratee is invoked
 * with three arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * function duplicate(n) {
 *   return [n, n];
 * }
 *
 * _.flatMap([1, 2], duplicate);
 * // => [1, 1, 2, 2]
 */
function flatMap(collection, iteratee) {
  return baseFlatten(map(collection, iteratee), 1);
}

/** Used as references for various `Number` constants. */
var INFINITY$3 = 1 / 0;

/**
 * This method is like `_.flatMap` except that it recursively flattens the
 * mapped results.
 *
 * @static
 * @memberOf _
 * @since 4.7.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * function duplicate(n) {
 *   return [[[n, n]]];
 * }
 *
 * _.flatMapDeep([1, 2], duplicate);
 * // => [1, 1, 2, 2]
 */
function flatMapDeep(collection, iteratee) {
  return baseFlatten(map(collection, iteratee), INFINITY$3);
}

/**
 * This method is like `_.flatMap` except that it recursively flattens the
 * mapped results up to `depth` times.
 *
 * @static
 * @memberOf _
 * @since 4.7.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {number} [depth=1] The maximum recursion depth.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * function duplicate(n) {
 *   return [[[n, n]]];
 * }
 *
 * _.flatMapDepth([1, 2], duplicate, 2);
 * // => [[1, 1], [2, 2]]
 */
function flatMapDepth(collection, iteratee, depth) {
  depth = depth === undefined ? 1 : toInteger(depth);
  return baseFlatten(map(collection, iteratee), depth);
}

/** Used as references for various `Number` constants. */
var INFINITY$4 = 1 / 0;

/**
 * Recursively flattens `array`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flattenDeep([1, [2, [3, [4]], 5]]);
 * // => [1, 2, 3, 4, 5]
 */
function flattenDeep(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, INFINITY$4) : [];
}

/**
 * Recursively flatten `array` up to `depth` times.
 *
 * @static
 * @memberOf _
 * @since 4.4.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @param {number} [depth=1] The maximum recursion depth.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * var array = [1, [2, [3, [4]], 5]];
 *
 * _.flattenDepth(array, 1);
 * // => [1, 2, [3, [4]], 5]
 *
 * _.flattenDepth(array, 2);
 * // => [1, 2, 3, [4], 5]
 */
function flattenDepth(array, depth) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  depth = depth === undefined ? 1 : toInteger(depth);
  return baseFlatten(array, depth);
}

/** Used to compose bitmasks for function metadata. */
var WRAP_FLIP_FLAG$2 = 512;

/**
 * Creates a function that invokes `func` with arguments reversed.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Function
 * @param {Function} func The function to flip arguments for.
 * @returns {Function} Returns the new flipped function.
 * @example
 *
 * var flipped = _.flip(function() {
 *   return _.toArray(arguments);
 * });
 *
 * flipped('a', 'b', 'c', 'd');
 * // => ['d', 'c', 'b', 'a']
 */
function flip(func) {
  return createWrap(func, WRAP_FLIP_FLAG$2);
}

/**
 * Computes `number` rounded down to `precision`.
 *
 * @static
 * @memberOf _
 * @since 3.10.0
 * @category Math
 * @param {number} number The number to round down.
 * @param {number} [precision=0] The precision to round down to.
 * @returns {number} Returns the rounded down number.
 * @example
 *
 * _.floor(4.006);
 * // => 4
 *
 * _.floor(0.046, 2);
 * // => 0.04
 *
 * _.floor(4060, -2);
 * // => 4000
 */
var floor = createRound('floor');

/** Error message constants. */
var FUNC_ERROR_TEXT$7 = 'Expected a function';

/** Used to compose bitmasks for function metadata. */
var WRAP_CURRY_FLAG$6 = 8,
    WRAP_PARTIAL_FLAG$5 = 32,
    WRAP_ARY_FLAG$4 = 128,
    WRAP_REARG_FLAG$2 = 256;

/**
 * Creates a `_.flow` or `_.flowRight` function.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new flow function.
 */
function createFlow(fromRight) {
  return flatRest(function(funcs) {
    var length = funcs.length,
        index = length,
        prereq = LodashWrapper.prototype.thru;

    if (fromRight) {
      funcs.reverse();
    }
    while (index--) {
      var func = funcs[index];
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT$7);
      }
      if (prereq && !wrapper && getFuncName(func) == 'wrapper') {
        var wrapper = new LodashWrapper([], true);
      }
    }
    index = wrapper ? index : length;
    while (++index < length) {
      func = funcs[index];

      var funcName = getFuncName(func),
          data = funcName == 'wrapper' ? getData(func) : undefined;

      if (data && isLaziable(data[0]) &&
            data[1] == (WRAP_ARY_FLAG$4 | WRAP_CURRY_FLAG$6 | WRAP_PARTIAL_FLAG$5 | WRAP_REARG_FLAG$2) &&
            !data[4].length && data[9] == 1
          ) {
        wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
      } else {
        wrapper = (func.length == 1 && isLaziable(func))
          ? wrapper[funcName]()
          : wrapper.thru(func);
      }
    }
    return function() {
      var args = arguments,
          value = args[0];

      if (wrapper && args.length == 1 && isArray(value)) {
        return wrapper.plant(value).value();
      }
      var index = 0,
          result = length ? funcs[index].apply(this, args) : value;

      while (++index < length) {
        result = funcs[index].call(this, result);
      }
      return result;
    };
  });
}

/**
 * Creates a function that returns the result of invoking the given functions
 * with the `this` binding of the created function, where each successive
 * invocation is supplied the return value of the previous.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Util
 * @param {...(Function|Function[])} [funcs] The functions to invoke.
 * @returns {Function} Returns the new composite function.
 * @see _.flowRight
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * var addSquare = _.flow([_.add, square]);
 * addSquare(1, 2);
 * // => 9
 */
var flow = createFlow();

/**
 * This method is like `_.flow` except that it creates a function that
 * invokes the given functions from right to left.
 *
 * @static
 * @since 3.0.0
 * @memberOf _
 * @category Util
 * @param {...(Function|Function[])} [funcs] The functions to invoke.
 * @returns {Function} Returns the new composite function.
 * @see _.flow
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * var addSquare = _.flowRight([square, _.add]);
 * addSquare(1, 2);
 * // => 9
 */
var flowRight = createFlow(true);

/**
 * Iterates over own and inherited enumerable string keyed properties of an
 * object and invokes `iteratee` for each property. The iteratee is invoked
 * with three arguments: (value, key, object). Iteratee functions may exit
 * iteration early by explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @since 0.3.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns `object`.
 * @see _.forInRight
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.forIn(new Foo, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a', 'b', then 'c' (iteration order is not guaranteed).
 */
function forIn(object, iteratee) {
  return object == null
    ? object
    : baseFor(object, castFunction(iteratee), keysIn$1);
}

/**
 * This method is like `_.forIn` except that it iterates over properties of
 * `object` in the opposite order.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns `object`.
 * @see _.forIn
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.forInRight(new Foo, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'c', 'b', then 'a' assuming `_.forIn` logs 'a', 'b', then 'c'.
 */
function forInRight(object, iteratee) {
  return object == null
    ? object
    : baseForRight(object, castFunction(iteratee), keysIn$1);
}

/**
 * Iterates over own enumerable string keyed properties of an object and
 * invokes `iteratee` for each property. The iteratee is invoked with three
 * arguments: (value, key, object). Iteratee functions may exit iteration
 * early by explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @since 0.3.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns `object`.
 * @see _.forOwnRight
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.forOwn(new Foo, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forOwn(object, iteratee) {
  return object && baseForOwn(object, castFunction(iteratee));
}

/**
 * This method is like `_.forOwn` except that it iterates over properties of
 * `object` in the opposite order.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns `object`.
 * @see _.forOwn
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.forOwnRight(new Foo, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'b' then 'a' assuming `_.forOwn` logs 'a' then 'b'.
 */
function forOwnRight(object, iteratee) {
  return object && baseForOwnRight(object, castFunction(iteratee));
}

/**
 * The inverse of `_.toPairs`; this method returns an object composed
 * from key-value `pairs`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} pairs The key-value pairs.
 * @returns {Object} Returns the new object.
 * @example
 *
 * _.fromPairs([['a', 1], ['b', 2]]);
 * // => { 'a': 1, 'b': 2 }
 */
function fromPairs(pairs) {
  var index = -1,
      length = pairs == null ? 0 : pairs.length,
      result = {};

  while (++index < length) {
    var pair = pairs[index];
    result[pair[0]] = pair[1];
  }
  return result;
}

/**
 * The base implementation of `_.functions` which creates an array of
 * `object` function property names filtered from `props`.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Array} props The property names to filter.
 * @returns {Array} Returns the function names.
 */
function baseFunctions(object, props) {
  return arrayFilter(props, function(key) {
    return isFunction(object[key]);
  });
}

/**
 * Creates an array of function property names from own enumerable properties
 * of `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns the function names.
 * @see _.functionsIn
 * @example
 *
 * function Foo() {
 *   this.a = _.constant('a');
 *   this.b = _.constant('b');
 * }
 *
 * Foo.prototype.c = _.constant('c');
 *
 * _.functions(new Foo);
 * // => ['a', 'b']
 */
function functions(object) {
  return object == null ? [] : baseFunctions(object, keys(object));
}

/**
 * Creates an array of function property names from own and inherited
 * enumerable properties of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns the function names.
 * @see _.functions
 * @example
 *
 * function Foo() {
 *   this.a = _.constant('a');
 *   this.b = _.constant('b');
 * }
 *
 * Foo.prototype.c = _.constant('c');
 *
 * _.functionsIn(new Foo);
 * // => ['a', 'b', 'c']
 */
function functionsIn(object) {
  return object == null ? [] : baseFunctions(object, keysIn$1(object));
}

/** Used for built-in method references. */
var objectProto$l = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$i = objectProto$l.hasOwnProperty;

/**
 * Creates an object composed of keys generated from the results of running
 * each element of `collection` thru `iteratee`. The order of grouped values
 * is determined by the order they occur in `collection`. The corresponding
 * value of each key is an array of elements responsible for generating the
 * key. The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
 * @returns {Object} Returns the composed aggregate object.
 * @example
 *
 * _.groupBy([6.1, 4.2, 6.3], Math.floor);
 * // => { '4': [4.2], '6': [6.1, 6.3] }
 *
 * // The `_.property` iteratee shorthand.
 * _.groupBy(['one', 'two', 'three'], 'length');
 * // => { '3': ['one', 'two'], '5': ['three'] }
 */
var groupBy = createAggregator(function(result, value, key) {
  if (hasOwnProperty$i.call(result, key)) {
    result[key].push(value);
  } else {
    baseAssignValue(result, key, [value]);
  }
});

/**
 * The base implementation of `_.gt` which doesn't coerce arguments.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if `value` is greater than `other`,
 *  else `false`.
 */
function baseGt(value, other) {
  return value > other;
}

/**
 * Creates a function that performs a relational operation on two values.
 *
 * @private
 * @param {Function} operator The function to perform the operation.
 * @returns {Function} Returns the new relational operation function.
 */
function createRelationalOperation(operator) {
  return function(value, other) {
    if (!(typeof value == 'string' && typeof other == 'string')) {
      value = toNumber(value);
      other = toNumber(other);
    }
    return operator(value, other);
  };
}

/**
 * Checks if `value` is greater than `other`.
 *
 * @static
 * @memberOf _
 * @since 3.9.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if `value` is greater than `other`,
 *  else `false`.
 * @see _.lt
 * @example
 *
 * _.gt(3, 1);
 * // => true
 *
 * _.gt(3, 3);
 * // => false
 *
 * _.gt(1, 3);
 * // => false
 */
var gt = createRelationalOperation(baseGt);

/**
 * Checks if `value` is greater than or equal to `other`.
 *
 * @static
 * @memberOf _
 * @since 3.9.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if `value` is greater than or equal to
 *  `other`, else `false`.
 * @see _.lte
 * @example
 *
 * _.gte(3, 1);
 * // => true
 *
 * _.gte(3, 3);
 * // => true
 *
 * _.gte(1, 3);
 * // => false
 */
var gte = createRelationalOperation(function(value, other) {
  return value >= other;
});

/** Used for built-in method references. */
var objectProto$m = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$j = objectProto$m.hasOwnProperty;

/**
 * The base implementation of `_.has` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHas(object, key) {
  return object != null && hasOwnProperty$j.call(object, key);
}

/**
 * Checks if `path` is a direct property of `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = { 'a': { 'b': 2 } };
 * var other = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.has(object, 'a');
 * // => true
 *
 * _.has(object, 'a.b');
 * // => true
 *
 * _.has(object, ['a', 'b']);
 * // => true
 *
 * _.has(other, 'a');
 * // => false
 */
function has(object, path) {
  return object != null && hasPath(object, path, baseHas);
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax$8 = Math.max,
    nativeMin$5 = Math.min;

/**
 * The base implementation of `_.inRange` which doesn't coerce arguments.
 *
 * @private
 * @param {number} number The number to check.
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 */
function baseInRange(number, start, end) {
  return number >= nativeMin$5(start, end) && number < nativeMax$8(start, end);
}

/**
 * Checks if `n` is between `start` and up to, but not including, `end`. If
 * `end` is not specified, it's set to `start` with `start` then set to `0`.
 * If `start` is greater than `end` the params are swapped to support
 * negative ranges.
 *
 * @static
 * @memberOf _
 * @since 3.3.0
 * @category Number
 * @param {number} number The number to check.
 * @param {number} [start=0] The start of the range.
 * @param {number} end The end of the range.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 * @see _.range, _.rangeRight
 * @example
 *
 * _.inRange(3, 2, 4);
 * // => true
 *
 * _.inRange(4, 8);
 * // => true
 *
 * _.inRange(4, 2);
 * // => false
 *
 * _.inRange(2, 2);
 * // => false
 *
 * _.inRange(1.2, 2);
 * // => true
 *
 * _.inRange(5.2, 4);
 * // => false
 *
 * _.inRange(-3, -2, -6);
 * // => true
 */
function inRange(number, start, end) {
  start = toFinite(start);
  if (end === undefined) {
    end = start;
    start = 0;
  } else {
    end = toFinite(end);
  }
  number = toNumber(number);
  return baseInRange(number, start, end);
}

/** `Object#toString` result references. */
var stringTag$4 = '[object String]';

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' ||
    (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag$4);
}

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  return arrayMap(props, function(key) {
    return object[key];
  });
}

/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values(object) {
  return object == null ? [] : baseValues(object, keys(object));
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax$9 = Math.max;

/**
 * Checks if `value` is in `collection`. If `collection` is a string, it's
 * checked for a substring of `value`, otherwise
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * is used for equality comparisons. If `fromIndex` is negative, it's used as
 * the offset from the end of `collection`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object|string} collection The collection to inspect.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=0] The index to search from.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
 * @returns {boolean} Returns `true` if `value` is found, else `false`.
 * @example
 *
 * _.includes([1, 2, 3], 1);
 * // => true
 *
 * _.includes([1, 2, 3], 1, 2);
 * // => false
 *
 * _.includes({ 'a': 1, 'b': 2 }, 1);
 * // => true
 *
 * _.includes('abcd', 'bc');
 * // => true
 */
function includes(collection, value, fromIndex, guard) {
  collection = isArrayLike(collection) ? collection : values(collection);
  fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

  var length = collection.length;
  if (fromIndex < 0) {
    fromIndex = nativeMax$9(length + fromIndex, 0);
  }
  return isString(collection)
    ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
    : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax$a = Math.max;

/**
 * Gets the index at which the first occurrence of `value` is found in `array`
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. If `fromIndex` is negative, it's used as the
 * offset from the end of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 * @example
 *
 * _.indexOf([1, 2, 1, 2], 2);
 * // => 1
 *
 * // Search from the `fromIndex`.
 * _.indexOf([1, 2, 1, 2], 2, 2);
 * // => 3
 */
function indexOf(array, value, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger(fromIndex);
  if (index < 0) {
    index = nativeMax$a(length + index, 0);
  }
  return baseIndexOf(array, value, index);
}

/**
 * Gets all but the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.initial([1, 2, 3]);
 * // => [1, 2]
 */
function initial(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseSlice(array, 0, -1) : [];
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin$6 = Math.min;

/**
 * The base implementation of methods like `_.intersection`, without support
 * for iteratee shorthands, that accepts an array of arrays to inspect.
 *
 * @private
 * @param {Array} arrays The arrays to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of shared values.
 */
function baseIntersection(arrays, iteratee, comparator) {
  var includes = comparator ? arrayIncludesWith : arrayIncludes,
      length = arrays[0].length,
      othLength = arrays.length,
      othIndex = othLength,
      caches = Array(othLength),
      maxLength = Infinity,
      result = [];

  while (othIndex--) {
    var array = arrays[othIndex];
    if (othIndex && iteratee) {
      array = arrayMap(array, baseUnary(iteratee));
    }
    maxLength = nativeMin$6(array.length, maxLength);
    caches[othIndex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))
      ? new SetCache(othIndex && array)
      : undefined;
  }
  array = arrays[0];

  var index = -1,
      seen = caches[0];

  outer:
  while (++index < length && result.length < maxLength) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (!(seen
          ? cacheHas(seen, computed)
          : includes(result, computed, comparator)
        )) {
      othIndex = othLength;
      while (--othIndex) {
        var cache = caches[othIndex];
        if (!(cache
              ? cacheHas(cache, computed)
              : includes(arrays[othIndex], computed, comparator))
            ) {
          continue outer;
        }
      }
      if (seen) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

/**
 * Casts `value` to an empty array if it's not an array like object.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array|Object} Returns the cast array-like object.
 */
function castArrayLikeObject(value) {
  return isArrayLikeObject(value) ? value : [];
}

/**
 * Creates an array of unique values that are included in all given arrays
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. The order and references of result values are
 * determined by the first array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of intersecting values.
 * @example
 *
 * _.intersection([2, 1], [2, 3]);
 * // => [2]
 */
var intersection = baseRest(function(arrays) {
  var mapped = arrayMap(arrays, castArrayLikeObject);
  return (mapped.length && mapped[0] === arrays[0])
    ? baseIntersection(mapped)
    : [];
});

/**
 * This method is like `_.intersection` except that it accepts `iteratee`
 * which is invoked for each element of each `arrays` to generate the criterion
 * by which they're compared. The order and references of result values are
 * determined by the first array. The iteratee is invoked with one argument:
 * (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {Array} Returns the new array of intersecting values.
 * @example
 *
 * _.intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor);
 * // => [2.1]
 *
 * // The `_.property` iteratee shorthand.
 * _.intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
 * // => [{ 'x': 1 }]
 */
var intersectionBy = baseRest(function(arrays) {
  var iteratee = last(arrays),
      mapped = arrayMap(arrays, castArrayLikeObject);

  if (iteratee === last(mapped)) {
    iteratee = undefined;
  } else {
    mapped.pop();
  }
  return (mapped.length && mapped[0] === arrays[0])
    ? baseIntersection(mapped, baseIteratee(iteratee))
    : [];
});

/**
 * This method is like `_.intersection` except that it accepts `comparator`
 * which is invoked to compare elements of `arrays`. The order and references
 * of result values are determined by the first array. The comparator is
 * invoked with two arguments: (arrVal, othVal).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of intersecting values.
 * @example
 *
 * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
 * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
 *
 * _.intersectionWith(objects, others, _.isEqual);
 * // => [{ 'x': 1, 'y': 2 }]
 */
var intersectionWith = baseRest(function(arrays) {
  var comparator = last(arrays),
      mapped = arrayMap(arrays, castArrayLikeObject);

  comparator = typeof comparator == 'function' ? comparator : undefined;
  if (comparator) {
    mapped.pop();
  }
  return (mapped.length && mapped[0] === arrays[0])
    ? baseIntersection(mapped, undefined, comparator)
    : [];
});

/**
 * The base implementation of `_.invert` and `_.invertBy` which inverts
 * `object` with values transformed by `iteratee` and set by `setter`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} setter The function to set `accumulator` values.
 * @param {Function} iteratee The iteratee to transform values.
 * @param {Object} accumulator The initial inverted object.
 * @returns {Function} Returns `accumulator`.
 */
function baseInverter(object, setter, iteratee, accumulator) {
  baseForOwn(object, function(value, key, object) {
    setter(accumulator, iteratee(value), key, object);
  });
  return accumulator;
}

/**
 * Creates a function like `_.invertBy`.
 *
 * @private
 * @param {Function} setter The function to set accumulator values.
 * @param {Function} toIteratee The function to resolve iteratees.
 * @returns {Function} Returns the new inverter function.
 */
function createInverter(setter, toIteratee) {
  return function(object, iteratee) {
    return baseInverter(object, setter, toIteratee(iteratee), {});
  };
}

/** Used for built-in method references. */
var objectProto$n = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$2 = objectProto$n.toString;

/**
 * Creates an object composed of the inverted keys and values of `object`.
 * If `object` contains duplicate values, subsequent values overwrite
 * property assignments of previous values.
 *
 * @static
 * @memberOf _
 * @since 0.7.0
 * @category Object
 * @param {Object} object The object to invert.
 * @returns {Object} Returns the new inverted object.
 * @example
 *
 * var object = { 'a': 1, 'b': 2, 'c': 1 };
 *
 * _.invert(object);
 * // => { '1': 'c', '2': 'b' }
 */
var invert = createInverter(function(result, value, key) {
  if (value != null &&
      typeof value.toString != 'function') {
    value = nativeObjectToString$2.call(value);
  }

  result[value] = key;
}, constant(identity));

/** Used for built-in method references. */
var objectProto$o = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$k = objectProto$o.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$3 = objectProto$o.toString;

/**
 * This method is like `_.invert` except that the inverted object is generated
 * from the results of running each element of `object` thru `iteratee`. The
 * corresponding inverted value of each inverted key is an array of keys
 * responsible for generating the inverted value. The iteratee is invoked
 * with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.1.0
 * @category Object
 * @param {Object} object The object to invert.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {Object} Returns the new inverted object.
 * @example
 *
 * var object = { 'a': 1, 'b': 2, 'c': 1 };
 *
 * _.invertBy(object);
 * // => { '1': ['a', 'c'], '2': ['b'] }
 *
 * _.invertBy(object, function(value) {
 *   return 'group' + value;
 * });
 * // => { 'group1': ['a', 'c'], 'group2': ['b'] }
 */
var invertBy = createInverter(function(result, value, key) {
  if (value != null &&
      typeof value.toString != 'function') {
    value = nativeObjectToString$3.call(value);
  }

  if (hasOwnProperty$k.call(result, value)) {
    result[value].push(key);
  } else {
    result[value] = [key];
  }
}, baseIteratee);

/**
 * Gets the parent value at `path` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path to get the parent value of.
 * @returns {*} Returns the parent value.
 */
function parent(object, path) {
  return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
}

/**
 * The base implementation of `_.invoke` without support for individual
 * method arguments.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the method to invoke.
 * @param {Array} args The arguments to invoke the method with.
 * @returns {*} Returns the result of the invoked method.
 */
function baseInvoke(object, path, args) {
  path = castPath(path, object);
  object = parent(object, path);
  var func = object == null ? object : object[toKey(last(path))];
  return func == null ? undefined : apply(func, object, args);
}

/**
 * Invokes the method at `path` of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the method to invoke.
 * @param {...*} [args] The arguments to invoke the method with.
 * @returns {*} Returns the result of the invoked method.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': [1, 2, 3, 4] } }] };
 *
 * _.invoke(object, 'a[0].b.c.slice', 1, 3);
 * // => [2, 3]
 */
var invoke = baseRest(baseInvoke);

/**
 * Invokes the method at `path` of each element in `collection`, returning
 * an array of the results of each invoked method. Any additional arguments
 * are provided to each invoked method. If `path` is a function, it's invoked
 * for, and `this` bound to, each element in `collection`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Array|Function|string} path The path of the method to invoke or
 *  the function invoked per iteration.
 * @param {...*} [args] The arguments to invoke each method with.
 * @returns {Array} Returns the array of results.
 * @example
 *
 * _.invokeMap([[5, 1, 7], [3, 2, 1]], 'sort');
 * // => [[1, 5, 7], [1, 2, 3]]
 *
 * _.invokeMap([123, 456], String.prototype.split, '');
 * // => [['1', '2', '3'], ['4', '5', '6']]
 */
var invokeMap = baseRest(function(collection, path, args) {
  var index = -1,
      isFunc = typeof path == 'function',
      result = isArrayLike(collection) ? Array(collection.length) : [];

  baseEach(collection, function(value) {
    result[++index] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
  });
  return result;
});

var arrayBufferTag$4 = '[object ArrayBuffer]';

/**
 * The base implementation of `_.isArrayBuffer` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
 */
function baseIsArrayBuffer(value) {
  return isObjectLike(value) && baseGetTag(value) == arrayBufferTag$4;
}

/* Node.js helper references. */
var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer;

/**
 * Checks if `value` is classified as an `ArrayBuffer` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
 * @example
 *
 * _.isArrayBuffer(new ArrayBuffer(2));
 * // => true
 *
 * _.isArrayBuffer(new Array(2));
 * // => false
 */
var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;

/** `Object#toString` result references. */
var boolTag$4 = '[object Boolean]';

/**
 * Checks if `value` is classified as a boolean primitive or object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a boolean, else `false`.
 * @example
 *
 * _.isBoolean(false);
 * // => true
 *
 * _.isBoolean(null);
 * // => false
 */
function isBoolean(value) {
  return value === true || value === false ||
    (isObjectLike(value) && baseGetTag(value) == boolTag$4);
}

/** `Object#toString` result references. */
var dateTag$4 = '[object Date]';

/**
 * The base implementation of `_.isDate` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
 */
function baseIsDate(value) {
  return isObjectLike(value) && baseGetTag(value) == dateTag$4;
}

/* Node.js helper references. */
var nodeIsDate = nodeUtil && nodeUtil.isDate;

/**
 * Checks if `value` is classified as a `Date` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
 * @example
 *
 * _.isDate(new Date);
 * // => true
 *
 * _.isDate('Mon April 23 2012');
 * // => false
 */
var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;

/**
 * Checks if `value` is likely a DOM element.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
 * @example
 *
 * _.isElement(document.body);
 * // => true
 *
 * _.isElement('<body>');
 * // => false
 */
function isElement(value) {
  return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
}

/** `Object#toString` result references. */
var mapTag$7 = '[object Map]',
    setTag$7 = '[object Set]';

/** Used for built-in method references. */
var objectProto$p = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$l = objectProto$p.hasOwnProperty;

/**
 * Checks if `value` is an empty object, collection, map, or set.
 *
 * Objects are considered empty if they have no own enumerable string keyed
 * properties.
 *
 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
 * jQuery-like collections are considered empty if they have a `length` of `0`.
 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty(null);
 * // => true
 *
 * _.isEmpty(true);
 * // => true
 *
 * _.isEmpty(1);
 * // => true
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({ 'a': 1 });
 * // => false
 */
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (isArrayLike(value) &&
      (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||
        isBuffer(value) || isTypedArray(value) || isArguments(value))) {
    return !value.length;
  }
  var tag = getTag$1(value);
  if (tag == mapTag$7 || tag == setTag$7) {
    return !value.size;
  }
  if (isPrototype(value)) {
    return !baseKeys(value).length;
  }
  for (var key in value) {
    if (hasOwnProperty$l.call(value, key)) {
      return false;
    }
  }
  return true;
}

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return baseIsEqual(value, other);
}

/**
 * This method is like `_.isEqual` except that it accepts `customizer` which
 * is invoked to compare values. If `customizer` returns `undefined`, comparisons
 * are handled by the method instead. The `customizer` is invoked with up to
 * six arguments: (objValue, othValue [, index|key, object, other, stack]).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * function isGreeting(value) {
 *   return /^h(?:i|ello)$/.test(value);
 * }
 *
 * function customizer(objValue, othValue) {
 *   if (isGreeting(objValue) && isGreeting(othValue)) {
 *     return true;
 *   }
 * }
 *
 * var array = ['hello', 'goodbye'];
 * var other = ['hi', 'goodbye'];
 *
 * _.isEqualWith(array, other, customizer);
 * // => true
 */
function isEqualWith(value, other, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  var result = customizer ? customizer(value, other) : undefined;
  return result === undefined ? baseIsEqual(value, other, undefined, customizer) : !!result;
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsFinite = root.isFinite;

/**
 * Checks if `value` is a finite primitive number.
 *
 * **Note:** This method is based on
 * [`Number.isFinite`](https://mdn.io/Number/isFinite).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
 * @example
 *
 * _.isFinite(3);
 * // => true
 *
 * _.isFinite(Number.MIN_VALUE);
 * // => true
 *
 * _.isFinite(Infinity);
 * // => false
 *
 * _.isFinite('3');
 * // => false
 */
function isFinite$1(value) {
  return typeof value == 'number' && nativeIsFinite(value);
}

/**
 * Checks if `value` is an integer.
 *
 * **Note:** This method is based on
 * [`Number.isInteger`](https://mdn.io/Number/isInteger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an integer, else `false`.
 * @example
 *
 * _.isInteger(3);
 * // => true
 *
 * _.isInteger(Number.MIN_VALUE);
 * // => false
 *
 * _.isInteger(Infinity);
 * // => false
 *
 * _.isInteger('3');
 * // => false
 */
function isInteger(value) {
  return typeof value == 'number' && value == toInteger(value);
}

/**
 * Performs a partial deep comparison between `object` and `source` to
 * determine if `object` contains equivalent property values.
 *
 * **Note:** This method is equivalent to `_.matches` when `source` is
 * partially applied.
 *
 * Partial comparisons will match empty array and empty object `source`
 * values against any array or object value, respectively. See `_.isEqual`
 * for a list of supported value comparisons.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 *
 * _.isMatch(object, { 'b': 2 });
 * // => true
 *
 * _.isMatch(object, { 'b': 1 });
 * // => false
 */
function isMatch(object, source) {
  return object === source || baseIsMatch(object, source, getMatchData(source));
}

/**
 * This method is like `_.isMatch` except that it accepts `customizer` which
 * is invoked to compare values. If `customizer` returns `undefined`, comparisons
 * are handled by the method instead. The `customizer` is invoked with five
 * arguments: (objValue, srcValue, index|key, object, source).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 * @example
 *
 * function isGreeting(value) {
 *   return /^h(?:i|ello)$/.test(value);
 * }
 *
 * function customizer(objValue, srcValue) {
 *   if (isGreeting(objValue) && isGreeting(srcValue)) {
 *     return true;
 *   }
 * }
 *
 * var object = { 'greeting': 'hello' };
 * var source = { 'greeting': 'hi' };
 *
 * _.isMatchWith(object, source, customizer);
 * // => true
 */
function isMatchWith(object, source, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  return baseIsMatch(object, source, getMatchData(source), customizer);
}

/** `Object#toString` result references. */
var numberTag$4 = '[object Number]';

/**
 * Checks if `value` is classified as a `Number` primitive or object.
 *
 * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
 * classified as numbers, use the `_.isFinite` method.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a number, else `false`.
 * @example
 *
 * _.isNumber(3);
 * // => true
 *
 * _.isNumber(Number.MIN_VALUE);
 * // => true
 *
 * _.isNumber(Infinity);
 * // => true
 *
 * _.isNumber('3');
 * // => false
 */
function isNumber(value) {
  return typeof value == 'number' ||
    (isObjectLike(value) && baseGetTag(value) == numberTag$4);
}

/**
 * Checks if `value` is `NaN`.
 *
 * **Note:** This method is based on
 * [`Number.isNaN`](https://mdn.io/Number/isNaN) and is not the same as
 * global [`isNaN`](https://mdn.io/isNaN) which returns `true` for
 * `undefined` and other non-number values.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 * @example
 *
 * _.isNaN(NaN);
 * // => true
 *
 * _.isNaN(new Number(NaN));
 * // => true
 *
 * isNaN(undefined);
 * // => true
 *
 * _.isNaN(undefined);
 * // => false
 */
function isNaN$1(value) {
  // An `NaN` primitive is the only value that is not equal to itself.
  // Perform the `toStringTag` check first to avoid errors with some
  // ActiveX objects in IE.
  return isNumber(value) && value != +value;
}

/**
 * Checks if `func` is capable of being masked.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `func` is maskable, else `false`.
 */
var isMaskable = coreJsData ? isFunction : stubFalse;

/** Error message constants. */
var CORE_ERROR_TEXT = 'Unsupported core-js use. Try https://npms.io/search?q=ponyfill.';

/**
 * Checks if `value` is a pristine native function.
 *
 * **Note:** This method can't reliably detect native functions in the presence
 * of the core-js package because core-js circumvents this kind of detection.
 * Despite multiple requests, the core-js maintainer has made it clear: any
 * attempt to fix the detection will be obstructed. As a result, we're left
 * with little choice but to throw an error. Unfortunately, this also affects
 * packages, like [babel-polyfill](https://www.npmjs.com/package/babel-polyfill),
 * which rely on core-js.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (isMaskable(value)) {
    throw new Error(CORE_ERROR_TEXT);
  }
  return baseIsNative(value);
}

/**
 * Checks if `value` is `null` or `undefined`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
 * @example
 *
 * _.isNil(null);
 * // => true
 *
 * _.isNil(void 0);
 * // => true
 *
 * _.isNil(NaN);
 * // => false
 */
function isNil(value) {
  return value == null;
}

/**
 * Checks if `value` is `null`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
 * @example
 *
 * _.isNull(null);
 * // => true
 *
 * _.isNull(void 0);
 * // => false
 */
function isNull(value) {
  return value === null;
}

/** `Object#toString` result references. */
var regexpTag$4 = '[object RegExp]';

/**
 * The base implementation of `_.isRegExp` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
 */
function baseIsRegExp(value) {
  return isObjectLike(value) && baseGetTag(value) == regexpTag$4;
}

/* Node.js helper references. */
var nodeIsRegExp = nodeUtil && nodeUtil.isRegExp;

/**
 * Checks if `value` is classified as a `RegExp` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
 * @example
 *
 * _.isRegExp(/abc/);
 * // => true
 *
 * _.isRegExp('/abc/');
 * // => false
 */
var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$2 = 9007199254740991;

/**
 * Checks if `value` is a safe integer. An integer is safe if it's an IEEE-754
 * double precision number which isn't the result of a rounded unsafe integer.
 *
 * **Note:** This method is based on
 * [`Number.isSafeInteger`](https://mdn.io/Number/isSafeInteger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a safe integer, else `false`.
 * @example
 *
 * _.isSafeInteger(3);
 * // => true
 *
 * _.isSafeInteger(Number.MIN_VALUE);
 * // => false
 *
 * _.isSafeInteger(Infinity);
 * // => false
 *
 * _.isSafeInteger('3');
 * // => false
 */
function isSafeInteger(value) {
  return isInteger(value) && value >= -MAX_SAFE_INTEGER$2 && value <= MAX_SAFE_INTEGER$2;
}

/**
 * Checks if `value` is `undefined`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 * @example
 *
 * _.isUndefined(void 0);
 * // => true
 *
 * _.isUndefined(null);
 * // => false
 */
function isUndefined(value) {
  return value === undefined;
}

/** `Object#toString` result references. */
var weakMapTag$3 = '[object WeakMap]';

/**
 * Checks if `value` is classified as a `WeakMap` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a weak map, else `false`.
 * @example
 *
 * _.isWeakMap(new WeakMap);
 * // => true
 *
 * _.isWeakMap(new Map);
 * // => false
 */
function isWeakMap(value) {
  return isObjectLike(value) && getTag$1(value) == weakMapTag$3;
}

/** `Object#toString` result references. */
var weakSetTag = '[object WeakSet]';

/**
 * Checks if `value` is classified as a `WeakSet` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a weak set, else `false`.
 * @example
 *
 * _.isWeakSet(new WeakSet);
 * // => true
 *
 * _.isWeakSet(new Set);
 * // => false
 */
function isWeakSet(value) {
  return isObjectLike(value) && baseGetTag(value) == weakSetTag;
}

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG$4 = 1;

/**
 * Creates a function that invokes `func` with the arguments of the created
 * function. If `func` is a property name, the created function returns the
 * property value for a given element. If `func` is an array or object, the
 * created function returns `true` for elements that contain the equivalent
 * source properties, otherwise it returns `false`.
 *
 * @static
 * @since 4.0.0
 * @memberOf _
 * @category Util
 * @param {*} [func=_.identity] The value to convert to a callback.
 * @returns {Function} Returns the callback.
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * // The `_.matches` iteratee shorthand.
 * _.filter(users, _.iteratee({ 'user': 'barney', 'active': true }));
 * // => [{ 'user': 'barney', 'age': 36, 'active': true }]
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.filter(users, _.iteratee(['user', 'fred']));
 * // => [{ 'user': 'fred', 'age': 40 }]
 *
 * // The `_.property` iteratee shorthand.
 * _.map(users, _.iteratee('user'));
 * // => ['barney', 'fred']
 *
 * // Create custom iteratee shorthands.
 * _.iteratee = _.wrap(_.iteratee, function(iteratee, func) {
 *   return !_.isRegExp(func) ? iteratee(func) : function(string) {
 *     return func.test(string);
 *   };
 * });
 *
 * _.filter(['abc', 'def'], /ef/);
 * // => ['def']
 */
function iteratee(func) {
  return baseIteratee(typeof func == 'function' ? func : baseClone(func, CLONE_DEEP_FLAG$4));
}

/** Used for built-in method references. */
var arrayProto$1 = Array.prototype;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeJoin = arrayProto$1.join;

/**
 * Converts all elements in `array` into a string separated by `separator`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to convert.
 * @param {string} [separator=','] The element separator.
 * @returns {string} Returns the joined string.
 * @example
 *
 * _.join(['a', 'b', 'c'], '~');
 * // => 'a~b~c'
 */
function join(array, separator) {
  return array == null ? '' : nativeJoin.call(array, separator);
}

/**
 * Converts `string` to
 * [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the kebab cased string.
 * @example
 *
 * _.kebabCase('Foo Bar');
 * // => 'foo-bar'
 *
 * _.kebabCase('fooBar');
 * // => 'foo-bar'
 *
 * _.kebabCase('__FOO_BAR__');
 * // => 'foo-bar'
 */
var kebabCase = createCompounder(function(result, word, index) {
  return result + (index ? '-' : '') + word.toLowerCase();
});

/**
 * Creates an object composed of keys generated from the results of running
 * each element of `collection` thru `iteratee`. The corresponding value of
 * each key is the last element responsible for generating the key. The
 * iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
 * @returns {Object} Returns the composed aggregate object.
 * @example
 *
 * var array = [
 *   { 'dir': 'left', 'code': 97 },
 *   { 'dir': 'right', 'code': 100 }
 * ];
 *
 * _.keyBy(array, function(o) {
 *   return String.fromCharCode(o.code);
 * });
 * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
 *
 * _.keyBy(array, 'dir');
 * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
 */
var keyBy = createAggregator(function(result, value, key) {
  baseAssignValue(result, key, value);
});

/**
 * A specialized version of `_.lastIndexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictLastIndexOf(array, value, fromIndex) {
  var index = fromIndex + 1;
  while (index--) {
    if (array[index] === value) {
      return index;
    }
  }
  return index;
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax$b = Math.max,
    nativeMin$7 = Math.min;

/**
 * This method is like `_.indexOf` except that it iterates over elements of
 * `array` from right to left.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=array.length-1] The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 * @example
 *
 * _.lastIndexOf([1, 2, 1, 2], 2);
 * // => 3
 *
 * // Search from the `fromIndex`.
 * _.lastIndexOf([1, 2, 1, 2], 2, 2);
 * // => 1
 */
function lastIndexOf(array, value, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = length;
  if (fromIndex !== undefined) {
    index = toInteger(fromIndex);
    index = index < 0 ? nativeMax$b(length + index, 0) : nativeMin$7(index, length - 1);
  }
  return value === value
    ? strictLastIndexOf(array, value, index)
    : baseFindIndex(array, baseIsNaN, index, true);
}

/**
 * Converts `string`, as space separated words, to lower case.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the lower cased string.
 * @example
 *
 * _.lowerCase('--Foo-Bar--');
 * // => 'foo bar'
 *
 * _.lowerCase('fooBar');
 * // => 'foo bar'
 *
 * _.lowerCase('__FOO_BAR__');
 * // => 'foo bar'
 */
var lowerCase = createCompounder(function(result, word, index) {
  return result + (index ? ' ' : '') + word.toLowerCase();
});

/**
 * Converts the first character of `string` to lower case.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.lowerFirst('Fred');
 * // => 'fred'
 *
 * _.lowerFirst('FRED');
 * // => 'fRED'
 */
var lowerFirst = createCaseFirst('toLowerCase');

/**
 * The base implementation of `_.lt` which doesn't coerce arguments.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if `value` is less than `other`,
 *  else `false`.
 */
function baseLt(value, other) {
  return value < other;
}

/**
 * Checks if `value` is less than `other`.
 *
 * @static
 * @memberOf _
 * @since 3.9.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if `value` is less than `other`,
 *  else `false`.
 * @see _.gt
 * @example
 *
 * _.lt(1, 3);
 * // => true
 *
 * _.lt(3, 3);
 * // => false
 *
 * _.lt(3, 1);
 * // => false
 */
var lt = createRelationalOperation(baseLt);

/**
 * Checks if `value` is less than or equal to `other`.
 *
 * @static
 * @memberOf _
 * @since 3.9.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if `value` is less than or equal to
 *  `other`, else `false`.
 * @see _.gte
 * @example
 *
 * _.lte(1, 3);
 * // => true
 *
 * _.lte(3, 3);
 * // => true
 *
 * _.lte(3, 1);
 * // => false
 */
var lte = createRelationalOperation(function(value, other) {
  return value <= other;
});

/**
 * The opposite of `_.mapValues`; this method creates an object with the
 * same values as `object` and keys generated by running each own enumerable
 * string keyed property of `object` thru `iteratee`. The iteratee is invoked
 * with three arguments: (value, key, object).
 *
 * @static
 * @memberOf _
 * @since 3.8.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns the new mapped object.
 * @see _.mapValues
 * @example
 *
 * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
 *   return key + value;
 * });
 * // => { 'a1': 1, 'b2': 2 }
 */
function mapKeys(object, iteratee) {
  var result = {};
  iteratee = baseIteratee(iteratee);

  baseForOwn(object, function(value, key, object) {
    baseAssignValue(result, iteratee(value, key, object), value);
  });
  return result;
}

/**
 * Creates an object with the same keys as `object` and values generated
 * by running each own enumerable string keyed property of `object` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, key, object).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns the new mapped object.
 * @see _.mapKeys
 * @example
 *
 * var users = {
 *   'fred':    { 'user': 'fred',    'age': 40 },
 *   'pebbles': { 'user': 'pebbles', 'age': 1 }
 * };
 *
 * _.mapValues(users, function(o) { return o.age; });
 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
 *
 * // The `_.property` iteratee shorthand.
 * _.mapValues(users, 'age');
 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
 */
function mapValues(object, iteratee) {
  var result = {};
  iteratee = baseIteratee(iteratee);

  baseForOwn(object, function(value, key, object) {
    baseAssignValue(result, key, iteratee(value, key, object));
  });
  return result;
}

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG$5 = 1;

/**
 * Creates a function that performs a partial deep comparison between a given
 * object and `source`, returning `true` if the given object has equivalent
 * property values, else `false`.
 *
 * **Note:** The created function is equivalent to `_.isMatch` with `source`
 * partially applied.
 *
 * Partial comparisons will match empty array and empty object `source`
 * values against any array or object value, respectively. See `_.isEqual`
 * for a list of supported value comparisons.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Util
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 * @example
 *
 * var objects = [
 *   { 'a': 1, 'b': 2, 'c': 3 },
 *   { 'a': 4, 'b': 5, 'c': 6 }
 * ];
 *
 * _.filter(objects, _.matches({ 'a': 4, 'c': 6 }));
 * // => [{ 'a': 4, 'b': 5, 'c': 6 }]
 */
function matches(source) {
  return baseMatches(baseClone(source, CLONE_DEEP_FLAG$5));
}

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG$6 = 1;

/**
 * Creates a function that performs a partial deep comparison between the
 * value at `path` of a given object to `srcValue`, returning `true` if the
 * object value is equivalent, else `false`.
 *
 * **Note:** Partial comparisons will match empty array and empty object
 * `srcValue` values against any array or object value, respectively. See
 * `_.isEqual` for a list of supported value comparisons.
 *
 * @static
 * @memberOf _
 * @since 3.2.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 * @example
 *
 * var objects = [
 *   { 'a': 1, 'b': 2, 'c': 3 },
 *   { 'a': 4, 'b': 5, 'c': 6 }
 * ];
 *
 * _.find(objects, _.matchesProperty('a', 4));
 * // => { 'a': 4, 'b': 5, 'c': 6 }
 */
function matchesProperty(path, srcValue) {
  return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG$6));
}

/**
 * The base implementation of methods like `_.max` and `_.min` which accepts a
 * `comparator` to determine the extremum value.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The iteratee invoked per iteration.
 * @param {Function} comparator The comparator used to compare values.
 * @returns {*} Returns the extremum value.
 */
function baseExtremum(array, iteratee, comparator) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    var value = array[index],
        current = iteratee(value);

    if (current != null && (computed === undefined
          ? (current === current && !isSymbol(current))
          : comparator(current, computed)
        )) {
      var computed = current,
          result = value;
    }
  }
  return result;
}

/**
 * Computes the maximum value of `array`. If `array` is empty or falsey,
 * `undefined` is returned.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Math
 * @param {Array} array The array to iterate over.
 * @returns {*} Returns the maximum value.
 * @example
 *
 * _.max([4, 2, 8, 6]);
 * // => 8
 *
 * _.max([]);
 * // => undefined
 */
function max(array) {
  return (array && array.length)
    ? baseExtremum(array, identity, baseGt)
    : undefined;
}

/**
 * This method is like `_.max` except that it accepts `iteratee` which is
 * invoked for each element in `array` to generate the criterion by which
 * the value is ranked. The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Math
 * @param {Array} array The array to iterate over.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {*} Returns the maximum value.
 * @example
 *
 * var objects = [{ 'n': 1 }, { 'n': 2 }];
 *
 * _.maxBy(objects, function(o) { return o.n; });
 * // => { 'n': 2 }
 *
 * // The `_.property` iteratee shorthand.
 * _.maxBy(objects, 'n');
 * // => { 'n': 2 }
 */
function maxBy(array, iteratee) {
  return (array && array.length)
    ? baseExtremum(array, baseIteratee(iteratee), baseGt)
    : undefined;
}

/**
 * The base implementation of `_.sum` and `_.sumBy` without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {number} Returns the sum.
 */
function baseSum(array, iteratee) {
  var result,
      index = -1,
      length = array.length;

  while (++index < length) {
    var current = iteratee(array[index]);
    if (current !== undefined) {
      result = result === undefined ? current : (result + current);
    }
  }
  return result;
}

/** Used as references for various `Number` constants. */
var NAN$2 = 0 / 0;

/**
 * The base implementation of `_.mean` and `_.meanBy` without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {number} Returns the mean.
 */
function baseMean(array, iteratee) {
  var length = array == null ? 0 : array.length;
  return length ? (baseSum(array, iteratee) / length) : NAN$2;
}

/**
 * Computes the mean of the values in `array`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Math
 * @param {Array} array The array to iterate over.
 * @returns {number} Returns the mean.
 * @example
 *
 * _.mean([4, 2, 8, 6]);
 * // => 5
 */
function mean(array) {
  return baseMean(array, identity);
}

/**
 * This method is like `_.mean` except that it accepts `iteratee` which is
 * invoked for each element in `array` to generate the value to be averaged.
 * The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.7.0
 * @category Math
 * @param {Array} array The array to iterate over.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {number} Returns the mean.
 * @example
 *
 * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
 *
 * _.meanBy(objects, function(o) { return o.n; });
 * // => 5
 *
 * // The `_.property` iteratee shorthand.
 * _.meanBy(objects, 'n');
 * // => 5
 */
function meanBy(array, iteratee) {
  return baseMean(array, baseIteratee(iteratee));
}

/**
 * This method is like `_.assign` except that it recursively merges own and
 * inherited enumerable string keyed properties of source objects into the
 * destination object. Source properties that resolve to `undefined` are
 * skipped if a destination value exists. Array and plain object properties
 * are merged recursively. Other objects and value types are overridden by
 * assignment. Source objects are applied from left to right. Subsequent
 * sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 0.5.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = {
 *   'a': [{ 'b': 2 }, { 'd': 4 }]
 * };
 *
 * var other = {
 *   'a': [{ 'c': 3 }, { 'e': 5 }]
 * };
 *
 * _.merge(object, other);
 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
 */
var merge = createAssigner(function(object, source, srcIndex) {
  baseMerge(object, source, srcIndex);
});

/**
 * Creates a function that invokes the method at `path` of a given object.
 * Any additional arguments are provided to the invoked method.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Util
 * @param {Array|string} path The path of the method to invoke.
 * @param {...*} [args] The arguments to invoke the method with.
 * @returns {Function} Returns the new invoker function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': _.constant(2) } },
 *   { 'a': { 'b': _.constant(1) } }
 * ];
 *
 * _.map(objects, _.method('a.b'));
 * // => [2, 1]
 *
 * _.map(objects, _.method(['a', 'b']));
 * // => [2, 1]
 */
var method = baseRest(function(path, args) {
  return function(object) {
    return baseInvoke(object, path, args);
  };
});

/**
 * The opposite of `_.method`; this method creates a function that invokes
 * the method at a given path of `object`. Any additional arguments are
 * provided to the invoked method.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Util
 * @param {Object} object The object to query.
 * @param {...*} [args] The arguments to invoke the method with.
 * @returns {Function} Returns the new invoker function.
 * @example
 *
 * var array = _.times(3, _.constant),
 *     object = { 'a': array, 'b': array, 'c': array };
 *
 * _.map(['a[2]', 'c[0]'], _.methodOf(object));
 * // => [2, 0]
 *
 * _.map([['a', '2'], ['c', '0']], _.methodOf(object));
 * // => [2, 0]
 */
var methodOf = baseRest(function(object, args) {
  return function(path) {
    return baseInvoke(object, path, args);
  };
});

/**
 * Computes the minimum value of `array`. If `array` is empty or falsey,
 * `undefined` is returned.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Math
 * @param {Array} array The array to iterate over.
 * @returns {*} Returns the minimum value.
 * @example
 *
 * _.min([4, 2, 8, 6]);
 * // => 2
 *
 * _.min([]);
 * // => undefined
 */
function min(array) {
  return (array && array.length)
    ? baseExtremum(array, identity, baseLt)
    : undefined;
}

/**
 * This method is like `_.min` except that it accepts `iteratee` which is
 * invoked for each element in `array` to generate the criterion by which
 * the value is ranked. The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Math
 * @param {Array} array The array to iterate over.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {*} Returns the minimum value.
 * @example
 *
 * var objects = [{ 'n': 1 }, { 'n': 2 }];
 *
 * _.minBy(objects, function(o) { return o.n; });
 * // => { 'n': 1 }
 *
 * // The `_.property` iteratee shorthand.
 * _.minBy(objects, 'n');
 * // => { 'n': 1 }
 */
function minBy(array, iteratee) {
  return (array && array.length)
    ? baseExtremum(array, baseIteratee(iteratee), baseLt)
    : undefined;
}

/**
 * Adds all own enumerable string keyed function properties of a source
 * object to the destination object. If `object` is a function, then methods
 * are added to its prototype as well.
 *
 * **Note:** Use `_.runInContext` to create a pristine `lodash` function to
 * avoid conflicts caused by modifying the original.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {Function|Object} [object=lodash] The destination object.
 * @param {Object} source The object of functions to add.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.chain=true] Specify whether mixins are chainable.
 * @returns {Function|Object} Returns `object`.
 * @example
 *
 * function vowels(string) {
 *   return _.filter(string, function(v) {
 *     return /[aeiou]/i.test(v);
 *   });
 * }
 *
 * _.mixin({ 'vowels': vowels });
 * _.vowels('fred');
 * // => ['e']
 *
 * _('fred').vowels().value();
 * // => ['e']
 *
 * _.mixin({ 'vowels': vowels }, { 'chain': false });
 * _('fred').vowels();
 * // => ['e']
 */
function mixin(object, source, options) {
  var props = keys(source),
      methodNames = baseFunctions(source, props);

  var chain = !(isObject(options) && 'chain' in options) || !!options.chain,
      isFunc = isFunction(object);

  arrayEach(methodNames, function(methodName) {
    var func = source[methodName];
    object[methodName] = func;
    if (isFunc) {
      object.prototype[methodName] = function() {
        var chainAll = this.__chain__;
        if (chain || chainAll) {
          var result = object(this.__wrapped__),
              actions = result.__actions__ = copyArray(this.__actions__);

          actions.push({ 'func': func, 'args': arguments, 'thisArg': object });
          result.__chain__ = chainAll;
          return result;
        }
        return func.apply(object, arrayPush([this.value()], arguments));
      };
    }
  });

  return object;
}

/**
 * Multiply two numbers.
 *
 * @static
 * @memberOf _
 * @since 4.7.0
 * @category Math
 * @param {number} multiplier The first number in a multiplication.
 * @param {number} multiplicand The second number in a multiplication.
 * @returns {number} Returns the product.
 * @example
 *
 * _.multiply(6, 4);
 * // => 24
 */
var multiply = createMathOperation(function(multiplier, multiplicand) {
  return multiplier * multiplicand;
}, 1);

/** Error message constants. */
var FUNC_ERROR_TEXT$8 = 'Expected a function';

/**
 * Creates a function that negates the result of the predicate `func`. The
 * `func` predicate is invoked with the `this` binding and arguments of the
 * created function.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Function
 * @param {Function} predicate The predicate to negate.
 * @returns {Function} Returns the new negated function.
 * @example
 *
 * function isEven(n) {
 *   return n % 2 == 0;
 * }
 *
 * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
 * // => [1, 3, 5]
 */
function negate(predicate) {
  if (typeof predicate != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT$8);
  }
  return function() {
    var args = arguments;
    switch (args.length) {
      case 0: return !predicate.call(this);
      case 1: return !predicate.call(this, args[0]);
      case 2: return !predicate.call(this, args[0], args[1]);
      case 3: return !predicate.call(this, args[0], args[1], args[2]);
    }
    return !predicate.apply(this, args);
  };
}

/**
 * Converts `iterator` to an array.
 *
 * @private
 * @param {Object} iterator The iterator to convert.
 * @returns {Array} Returns the converted array.
 */
function iteratorToArray(iterator) {
  var data,
      result = [];

  while (!(data = iterator.next()).done) {
    result.push(data.value);
  }
  return result;
}

/** `Object#toString` result references. */
var mapTag$8 = '[object Map]',
    setTag$8 = '[object Set]';

/** Built-in value references. */
var symIterator = Symbol ? Symbol.iterator : undefined;

/**
 * Converts `value` to an array.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Array} Returns the converted array.
 * @example
 *
 * _.toArray({ 'a': 1, 'b': 2 });
 * // => [1, 2]
 *
 * _.toArray('abc');
 * // => ['a', 'b', 'c']
 *
 * _.toArray(1);
 * // => []
 *
 * _.toArray(null);
 * // => []
 */
function toArray(value) {
  if (!value) {
    return [];
  }
  if (isArrayLike(value)) {
    return isString(value) ? stringToArray(value) : copyArray(value);
  }
  if (symIterator && value[symIterator]) {
    return iteratorToArray(value[symIterator]());
  }
  var tag = getTag$1(value),
      func = tag == mapTag$8 ? mapToArray : (tag == setTag$8 ? setToArray : values);

  return func(value);
}

/**
 * Gets the next value on a wrapped object following the
 * [iterator protocol](https://mdn.io/iteration_protocols#iterator).
 *
 * @name next
 * @memberOf _
 * @since 4.0.0
 * @category Seq
 * @returns {Object} Returns the next iterator value.
 * @example
 *
 * var wrapped = _([1, 2]);
 *
 * wrapped.next();
 * // => { 'done': false, 'value': 1 }
 *
 * wrapped.next();
 * // => { 'done': false, 'value': 2 }
 *
 * wrapped.next();
 * // => { 'done': true, 'value': undefined }
 */
function wrapperNext() {
  if (this.__values__ === undefined) {
    this.__values__ = toArray(this.value());
  }
  var done = this.__index__ >= this.__values__.length,
      value = done ? undefined : this.__values__[this.__index__++];

  return { 'done': done, 'value': value };
}

/**
 * The base implementation of `_.nth` which doesn't coerce arguments.
 *
 * @private
 * @param {Array} array The array to query.
 * @param {number} n The index of the element to return.
 * @returns {*} Returns the nth element of `array`.
 */
function baseNth(array, n) {
  var length = array.length;
  if (!length) {
    return;
  }
  n += n < 0 ? length : 0;
  return isIndex(n, length) ? array[n] : undefined;
}

/**
 * Gets the element at index `n` of `array`. If `n` is negative, the nth
 * element from the end is returned.
 *
 * @static
 * @memberOf _
 * @since 4.11.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {number} [n=0] The index of the element to return.
 * @returns {*} Returns the nth element of `array`.
 * @example
 *
 * var array = ['a', 'b', 'c', 'd'];
 *
 * _.nth(array, 1);
 * // => 'b'
 *
 * _.nth(array, -2);
 * // => 'c';
 */
function nth(array, n) {
  return (array && array.length) ? baseNth(array, toInteger(n)) : undefined;
}

/**
 * Creates a function that gets the argument at index `n`. If `n` is negative,
 * the nth argument from the end is returned.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {number} [n=0] The index of the argument to return.
 * @returns {Function} Returns the new pass-thru function.
 * @example
 *
 * var func = _.nthArg(1);
 * func('a', 'b', 'c', 'd');
 * // => 'b'
 *
 * var func = _.nthArg(-2);
 * func('a', 'b', 'c', 'd');
 * // => 'c'
 */
function nthArg(n) {
  n = toInteger(n);
  return baseRest(function(args) {
    return baseNth(args, n);
  });
}

/**
 * The base implementation of `_.unset`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The property path to unset.
 * @returns {boolean} Returns `true` if the property is deleted, else `false`.
 */
function baseUnset(object, path) {
  path = castPath(path, object);
  object = parent(object, path);
  return object == null || delete object[toKey(last(path))];
}

/**
 * Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
 * objects.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {string} key The key of the property to inspect.
 * @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
 */
function customOmitClone(value) {
  return isPlainObject(value) ? undefined : value;
}

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG$7 = 1,
    CLONE_FLAT_FLAG$1 = 2,
    CLONE_SYMBOLS_FLAG$5 = 4;

/**
 * The opposite of `_.pick`; this method creates an object composed of the
 * own and inherited enumerable property paths of `object` that are not omitted.
 *
 * **Note:** This method is considerably slower than `_.pick`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to omit.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.omit(object, ['a', 'c']);
 * // => { 'b': '2' }
 */
var omit = flatRest(function(object, paths) {
  var result = {};
  if (object == null) {
    return result;
  }
  var isDeep = false;
  paths = arrayMap(paths, function(path) {
    path = castPath(path, object);
    isDeep || (isDeep = path.length > 1);
    return path;
  });
  copyObject(object, getAllKeysIn(object), result);
  if (isDeep) {
    result = baseClone(result, CLONE_DEEP_FLAG$7 | CLONE_FLAT_FLAG$1 | CLONE_SYMBOLS_FLAG$5, customOmitClone);
  }
  var length = paths.length;
  while (length--) {
    baseUnset(result, paths[length]);
  }
  return result;
});

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  if (!isObject(object)) {
    return object;
  }
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey(path[index]),
        newValue = value;

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject(objValue)
          ? objValue
          : (isIndex(path[index + 1]) ? [] : {});
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

/**
 * The base implementation of  `_.pickBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} paths The property paths to pick.
 * @param {Function} predicate The function invoked per property.
 * @returns {Object} Returns the new object.
 */
function basePickBy(object, paths, predicate) {
  var index = -1,
      length = paths.length,
      result = {};

  while (++index < length) {
    var path = paths[index],
        value = baseGet(object, path);

    if (predicate(value, path)) {
      baseSet(result, castPath(path, object), value);
    }
  }
  return result;
}

/**
 * Creates an object composed of the `object` properties `predicate` returns
 * truthy for. The predicate is invoked with two arguments: (value, key).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The source object.
 * @param {Function} [predicate=_.identity] The function invoked per property.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.pickBy(object, _.isNumber);
 * // => { 'a': 1, 'c': 3 }
 */
function pickBy(object, predicate) {
  if (object == null) {
    return {};
  }
  var props = arrayMap(getAllKeysIn(object), function(prop) {
    return [prop];
  });
  predicate = baseIteratee(predicate);
  return basePickBy(object, props, function(value, path) {
    return predicate(value, path[0]);
  });
}

/**
 * The opposite of `_.pickBy`; this method creates an object composed of
 * the own and inherited enumerable string keyed properties of `object` that
 * `predicate` doesn't return truthy for. The predicate is invoked with two
 * arguments: (value, key).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The source object.
 * @param {Function} [predicate=_.identity] The function invoked per property.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.omitBy(object, _.isNumber);
 * // => { 'b': '2' }
 */
function omitBy(object, predicate) {
  return pickBy(object, negate(baseIteratee(predicate)));
}

/**
 * Creates a function that is restricted to invoking `func` once. Repeat calls
 * to the function return the value of the first invocation. The `func` is
 * invoked with the `this` binding and arguments of the created function.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * var initialize = _.once(createApplication);
 * initialize();
 * initialize();
 * // => `createApplication` is invoked once
 */
function once(func) {
  return before(2, func);
}

/**
 * The base implementation of `_.sortBy` which uses `comparer` to define the
 * sort order of `array` and replaces criteria objects with their corresponding
 * values.
 *
 * @private
 * @param {Array} array The array to sort.
 * @param {Function} comparer The function to define sort order.
 * @returns {Array} Returns `array`.
 */
function baseSortBy(array, comparer) {
  var length = array.length;

  array.sort(comparer);
  while (length--) {
    array[length] = array[length].value;
  }
  return array;
}

/**
 * Compares values to sort them in ascending order.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {number} Returns the sort order indicator for `value`.
 */
function compareAscending(value, other) {
  if (value !== other) {
    var valIsDefined = value !== undefined,
        valIsNull = value === null,
        valIsReflexive = value === value,
        valIsSymbol = isSymbol(value);

    var othIsDefined = other !== undefined,
        othIsNull = other === null,
        othIsReflexive = other === other,
        othIsSymbol = isSymbol(other);

    if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
        (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
        (valIsNull && othIsDefined && othIsReflexive) ||
        (!valIsDefined && othIsReflexive) ||
        !valIsReflexive) {
      return 1;
    }
    if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
        (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
        (othIsNull && valIsDefined && valIsReflexive) ||
        (!othIsDefined && valIsReflexive) ||
        !othIsReflexive) {
      return -1;
    }
  }
  return 0;
}

/**
 * Used by `_.orderBy` to compare multiple properties of a value to another
 * and stable sort them.
 *
 * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
 * specify an order of "desc" for descending or "asc" for ascending sort order
 * of corresponding values.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {boolean[]|string[]} orders The order to sort by for each property.
 * @returns {number} Returns the sort order indicator for `object`.
 */
function compareMultiple(object, other, orders) {
  var index = -1,
      objCriteria = object.criteria,
      othCriteria = other.criteria,
      length = objCriteria.length,
      ordersLength = orders.length;

  while (++index < length) {
    var result = compareAscending(objCriteria[index], othCriteria[index]);
    if (result) {
      if (index >= ordersLength) {
        return result;
      }
      var order = orders[index];
      return result * (order == 'desc' ? -1 : 1);
    }
  }
  // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
  // that causes it, under certain circumstances, to provide the same value for
  // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
  // for more details.
  //
  // This also ensures a stable sort in V8 and other engines.
  // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
  return object.index - other.index;
}

/**
 * The base implementation of `_.orderBy` without param guards.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
 * @param {string[]} orders The sort orders of `iteratees`.
 * @returns {Array} Returns the new sorted array.
 */
function baseOrderBy(collection, iteratees, orders) {
  var index = -1;
  iteratees = arrayMap(iteratees.length ? iteratees : [identity], baseUnary(baseIteratee));

  var result = baseMap(collection, function(value, key, collection) {
    var criteria = arrayMap(iteratees, function(iteratee) {
      return iteratee(value);
    });
    return { 'criteria': criteria, 'index': ++index, 'value': value };
  });

  return baseSortBy(result, function(object, other) {
    return compareMultiple(object, other, orders);
  });
}

/**
 * This method is like `_.sortBy` except that it allows specifying the sort
 * orders of the iteratees to sort by. If `orders` is unspecified, all values
 * are sorted in ascending order. Otherwise, specify an order of "desc" for
 * descending or "asc" for ascending sort order of corresponding values.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Array[]|Function[]|Object[]|string[]} [iteratees=[_.identity]]
 *  The iteratees to sort by.
 * @param {string[]} [orders] The sort orders of `iteratees`.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
 * @returns {Array} Returns the new sorted array.
 * @example
 *
 * var users = [
 *   { 'user': 'fred',   'age': 48 },
 *   { 'user': 'barney', 'age': 34 },
 *   { 'user': 'fred',   'age': 40 },
 *   { 'user': 'barney', 'age': 36 }
 * ];
 *
 * // Sort by `user` in ascending order and by `age` in descending order.
 * _.orderBy(users, ['user', 'age'], ['asc', 'desc']);
 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
 */
function orderBy(collection, iteratees, orders, guard) {
  if (collection == null) {
    return [];
  }
  if (!isArray(iteratees)) {
    iteratees = iteratees == null ? [] : [iteratees];
  }
  orders = guard ? undefined : orders;
  if (!isArray(orders)) {
    orders = orders == null ? [] : [orders];
  }
  return baseOrderBy(collection, iteratees, orders);
}

/**
 * Creates a function like `_.over`.
 *
 * @private
 * @param {Function} arrayFunc The function to iterate over iteratees.
 * @returns {Function} Returns the new over function.
 */
function createOver(arrayFunc) {
  return flatRest(function(iteratees) {
    iteratees = arrayMap(iteratees, baseUnary(baseIteratee));
    return baseRest(function(args) {
      var thisArg = this;
      return arrayFunc(iteratees, function(iteratee) {
        return apply(iteratee, thisArg, args);
      });
    });
  });
}

/**
 * Creates a function that invokes `iteratees` with the arguments it receives
 * and returns their results.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {...(Function|Function[])} [iteratees=[_.identity]]
 *  The iteratees to invoke.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var func = _.over([Math.max, Math.min]);
 *
 * func(1, 2, 3, 4);
 * // => [4, 1]
 */
var over = createOver(arrayMap);

/**
 * A `baseRest` alias which can be replaced with `identity` by module
 * replacement plugins.
 *
 * @private
 * @type {Function}
 * @param {Function} func The function to apply a rest parameter to.
 * @returns {Function} Returns the new function.
 */
var castRest = baseRest;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin$8 = Math.min;

/**
 * Creates a function that invokes `func` with its arguments transformed.
 *
 * @static
 * @since 4.0.0
 * @memberOf _
 * @category Function
 * @param {Function} func The function to wrap.
 * @param {...(Function|Function[])} [transforms=[_.identity]]
 *  The argument transforms.
 * @returns {Function} Returns the new function.
 * @example
 *
 * function doubled(n) {
 *   return n * 2;
 * }
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * var func = _.overArgs(function(x, y) {
 *   return [x, y];
 * }, [square, doubled]);
 *
 * func(9, 3);
 * // => [81, 6]
 *
 * func(10, 5);
 * // => [100, 10]
 */
var overArgs = castRest(function(func, transforms) {
  transforms = (transforms.length == 1 && isArray(transforms[0]))
    ? arrayMap(transforms[0], baseUnary(baseIteratee))
    : arrayMap(baseFlatten(transforms, 1), baseUnary(baseIteratee));

  var funcsLength = transforms.length;
  return baseRest(function(args) {
    var index = -1,
        length = nativeMin$8(args.length, funcsLength);

    while (++index < length) {
      args[index] = transforms[index].call(this, args[index]);
    }
    return apply(func, this, args);
  });
});

/**
 * Creates a function that checks if **all** of the `predicates` return
 * truthy when invoked with the arguments it receives.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {...(Function|Function[])} [predicates=[_.identity]]
 *  The predicates to check.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var func = _.overEvery([Boolean, isFinite]);
 *
 * func('1');
 * // => true
 *
 * func(null);
 * // => false
 *
 * func(NaN);
 * // => false
 */
var overEvery = createOver(arrayEvery);

/**
 * Creates a function that checks if **any** of the `predicates` return
 * truthy when invoked with the arguments it receives.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {...(Function|Function[])} [predicates=[_.identity]]
 *  The predicates to check.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var func = _.overSome([Boolean, isFinite]);
 *
 * func('1');
 * // => true
 *
 * func(null);
 * // => true
 *
 * func(NaN);
 * // => false
 */
var overSome = createOver(arraySome);

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$3 = 9007199254740991;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeFloor = Math.floor;

/**
 * The base implementation of `_.repeat` which doesn't coerce arguments.
 *
 * @private
 * @param {string} string The string to repeat.
 * @param {number} n The number of times to repeat the string.
 * @returns {string} Returns the repeated string.
 */
function baseRepeat(string, n) {
  var result = '';
  if (!string || n < 1 || n > MAX_SAFE_INTEGER$3) {
    return result;
  }
  // Leverage the exponentiation by squaring algorithm for a faster repeat.
  // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
  do {
    if (n % 2) {
      result += string;
    }
    n = nativeFloor(n / 2);
    if (n) {
      string += string;
    }
  } while (n);

  return result;
}

/**
 * Gets the size of an ASCII `string`.
 *
 * @private
 * @param {string} string The string inspect.
 * @returns {number} Returns the string size.
 */
var asciiSize = baseProperty('length');

/** Used to compose unicode character classes. */
var rsAstralRange$3 = '\\ud800-\\udfff',
    rsComboMarksRange$4 = '\\u0300-\\u036f',
    reComboHalfMarksRange$4 = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange$4 = '\\u20d0-\\u20ff',
    rsComboRange$4 = rsComboMarksRange$4 + reComboHalfMarksRange$4 + rsComboSymbolsRange$4,
    rsVarRange$3 = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral$1 = '[' + rsAstralRange$3 + ']',
    rsCombo$3 = '[' + rsComboRange$4 + ']',
    rsFitz$2 = '\\ud83c[\\udffb-\\udfff]',
    rsModifier$2 = '(?:' + rsCombo$3 + '|' + rsFitz$2 + ')',
    rsNonAstral$2 = '[^' + rsAstralRange$3 + ']',
    rsRegional$2 = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair$2 = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsZWJ$3 = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod$2 = rsModifier$2 + '?',
    rsOptVar$2 = '[' + rsVarRange$3 + ']?',
    rsOptJoin$2 = '(?:' + rsZWJ$3 + '(?:' + [rsNonAstral$2, rsRegional$2, rsSurrPair$2].join('|') + ')' + rsOptVar$2 + reOptMod$2 + ')*',
    rsSeq$2 = rsOptVar$2 + reOptMod$2 + rsOptJoin$2,
    rsSymbol$1 = '(?:' + [rsNonAstral$2 + rsCombo$3 + '?', rsCombo$3, rsRegional$2, rsSurrPair$2, rsAstral$1].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode$1 = RegExp(rsFitz$2 + '(?=' + rsFitz$2 + ')|' + rsSymbol$1 + rsSeq$2, 'g');

/**
 * Gets the size of a Unicode `string`.
 *
 * @private
 * @param {string} string The string inspect.
 * @returns {number} Returns the string size.
 */
function unicodeSize(string) {
  var result = reUnicode$1.lastIndex = 0;
  while (reUnicode$1.test(string)) {
    ++result;
  }
  return result;
}

/**
 * Gets the number of symbols in `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the string size.
 */
function stringSize(string) {
  return hasUnicode(string)
    ? unicodeSize(string)
    : asciiSize(string);
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeCeil$1 = Math.ceil;

/**
 * Creates the padding for `string` based on `length`. The `chars` string
 * is truncated if the number of characters exceeds `length`.
 *
 * @private
 * @param {number} length The padding length.
 * @param {string} [chars=' '] The string used as padding.
 * @returns {string} Returns the padding for `string`.
 */
function createPadding(length, chars) {
  chars = chars === undefined ? ' ' : baseToString(chars);

  var charsLength = chars.length;
  if (charsLength < 2) {
    return charsLength ? baseRepeat(chars, length) : chars;
  }
  var result = baseRepeat(chars, nativeCeil$1(length / stringSize(chars)));
  return hasUnicode(chars)
    ? castSlice(stringToArray(result), 0, length).join('')
    : result.slice(0, length);
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeCeil$2 = Math.ceil,
    nativeFloor$1 = Math.floor;

/**
 * Pads `string` on the left and right sides if it's shorter than `length`.
 * Padding characters are truncated if they can't be evenly divided by `length`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to pad.
 * @param {number} [length=0] The padding length.
 * @param {string} [chars=' '] The string used as padding.
 * @returns {string} Returns the padded string.
 * @example
 *
 * _.pad('abc', 8);
 * // => '  abc   '
 *
 * _.pad('abc', 8, '_-');
 * // => '_-abc_-_'
 *
 * _.pad('abc', 3);
 * // => 'abc'
 */
function pad(string, length, chars) {
  string = toString(string);
  length = toInteger(length);

  var strLength = length ? stringSize(string) : 0;
  if (!length || strLength >= length) {
    return string;
  }
  var mid = (length - strLength) / 2;
  return (
    createPadding(nativeFloor$1(mid), chars) +
    string +
    createPadding(nativeCeil$2(mid), chars)
  );
}

/**
 * Pads `string` on the right side if it's shorter than `length`. Padding
 * characters are truncated if they exceed `length`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to pad.
 * @param {number} [length=0] The padding length.
 * @param {string} [chars=' '] The string used as padding.
 * @returns {string} Returns the padded string.
 * @example
 *
 * _.padEnd('abc', 6);
 * // => 'abc   '
 *
 * _.padEnd('abc', 6, '_-');
 * // => 'abc_-_'
 *
 * _.padEnd('abc', 3);
 * // => 'abc'
 */
function padEnd(string, length, chars) {
  string = toString(string);
  length = toInteger(length);

  var strLength = length ? stringSize(string) : 0;
  return (length && strLength < length)
    ? (string + createPadding(length - strLength, chars))
    : string;
}

/**
 * Pads `string` on the left side if it's shorter than `length`. Padding
 * characters are truncated if they exceed `length`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to pad.
 * @param {number} [length=0] The padding length.
 * @param {string} [chars=' '] The string used as padding.
 * @returns {string} Returns the padded string.
 * @example
 *
 * _.padStart('abc', 6);
 * // => '   abc'
 *
 * _.padStart('abc', 6, '_-');
 * // => '_-_abc'
 *
 * _.padStart('abc', 3);
 * // => 'abc'
 */
function padStart(string, length, chars) {
  string = toString(string);
  length = toInteger(length);

  var strLength = length ? stringSize(string) : 0;
  return (length && strLength < length)
    ? (createPadding(length - strLength, chars) + string)
    : string;
}

/** Used to match leading and trailing whitespace. */
var reTrimStart = /^\s+/;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeParseInt = root.parseInt;

/**
 * Converts `string` to an integer of the specified radix. If `radix` is
 * `undefined` or `0`, a `radix` of `10` is used unless `value` is a
 * hexadecimal, in which case a `radix` of `16` is used.
 *
 * **Note:** This method aligns with the
 * [ES5 implementation](https://es5.github.io/#x15.1.2.2) of `parseInt`.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category String
 * @param {string} string The string to convert.
 * @param {number} [radix=10] The radix to interpret `value` by.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.parseInt('08');
 * // => 8
 *
 * _.map(['6', '08', '10'], _.parseInt);
 * // => [6, 8, 10]
 */
function parseInt$1(string, radix, guard) {
  if (guard || radix == null) {
    radix = 0;
  } else if (radix) {
    radix = +radix;
  }
  return nativeParseInt(toString(string).replace(reTrimStart, ''), radix || 0);
}

/** Used to compose bitmasks for function metadata. */
var WRAP_PARTIAL_FLAG$6 = 32;

/**
 * Creates a function that invokes `func` with `partials` prepended to the
 * arguments it receives. This method is like `_.bind` except it does **not**
 * alter the `this` binding.
 *
 * The `_.partial.placeholder` value, which defaults to `_` in monolithic
 * builds, may be used as a placeholder for partially applied arguments.
 *
 * **Note:** This method doesn't set the "length" property of partially
 * applied functions.
 *
 * @static
 * @memberOf _
 * @since 0.2.0
 * @category Function
 * @param {Function} func The function to partially apply arguments to.
 * @param {...*} [partials] The arguments to be partially applied.
 * @returns {Function} Returns the new partially applied function.
 * @example
 *
 * function greet(greeting, name) {
 *   return greeting + ' ' + name;
 * }
 *
 * var sayHelloTo = _.partial(greet, 'hello');
 * sayHelloTo('fred');
 * // => 'hello fred'
 *
 * // Partially applied with placeholders.
 * var greetFred = _.partial(greet, _, 'fred');
 * greetFred('hi');
 * // => 'hi fred'
 */
var partial = baseRest(function(func, partials) {
  var holders = replaceHolders(partials, getHolder(partial));
  return createWrap(func, WRAP_PARTIAL_FLAG$6, undefined, partials, holders);
});

// Assign default placeholders.
partial.placeholder = {};

/** Used to compose bitmasks for function metadata. */
var WRAP_PARTIAL_RIGHT_FLAG$3 = 64;

/**
 * This method is like `_.partial` except that partially applied arguments
 * are appended to the arguments it receives.
 *
 * The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
 * builds, may be used as a placeholder for partially applied arguments.
 *
 * **Note:** This method doesn't set the "length" property of partially
 * applied functions.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Function
 * @param {Function} func The function to partially apply arguments to.
 * @param {...*} [partials] The arguments to be partially applied.
 * @returns {Function} Returns the new partially applied function.
 * @example
 *
 * function greet(greeting, name) {
 *   return greeting + ' ' + name;
 * }
 *
 * var greetFred = _.partialRight(greet, 'fred');
 * greetFred('hi');
 * // => 'hi fred'
 *
 * // Partially applied with placeholders.
 * var sayHelloTo = _.partialRight(greet, 'hello', _);
 * sayHelloTo('fred');
 * // => 'hello fred'
 */
var partialRight = baseRest(function(func, partials) {
  var holders = replaceHolders(partials, getHolder(partialRight));
  return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG$3, undefined, partials, holders);
});

// Assign default placeholders.
partialRight.placeholder = {};

/**
 * Creates an array of elements split into two groups, the first of which
 * contains elements `predicate` returns truthy for, the second of which
 * contains elements `predicate` returns falsey for. The predicate is
 * invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the array of grouped elements.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': false },
 *   { 'user': 'fred',    'age': 40, 'active': true },
 *   { 'user': 'pebbles', 'age': 1,  'active': false }
 * ];
 *
 * _.partition(users, function(o) { return o.active; });
 * // => objects for [['fred'], ['barney', 'pebbles']]
 *
 * // The `_.matches` iteratee shorthand.
 * _.partition(users, { 'age': 1, 'active': false });
 * // => objects for [['pebbles'], ['barney', 'fred']]
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.partition(users, ['active', false]);
 * // => objects for [['barney', 'pebbles'], ['fred']]
 *
 * // The `_.property` iteratee shorthand.
 * _.partition(users, 'active');
 * // => objects for [['fred'], ['barney', 'pebbles']]
 */
var partition = createAggregator(function(result, value, key) {
  result[key ? 0 : 1].push(value);
}, function() { return [[], []]; });

/**
 * The base implementation of `_.pick` without support for individual
 * property identifiers.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} paths The property paths to pick.
 * @returns {Object} Returns the new object.
 */
function basePick(object, paths) {
  return basePickBy(object, paths, function(value, path) {
    return hasIn(object, path);
  });
}

/**
 * Creates an object composed of the picked `object` properties.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to pick.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.pick(object, ['a', 'c']);
 * // => { 'a': 1, 'c': 3 }
 */
var pick = flatRest(function(object, paths) {
  return object == null ? {} : basePick(object, paths);
});

/**
 * Creates a clone of the chain sequence planting `value` as the wrapped value.
 *
 * @name plant
 * @memberOf _
 * @since 3.2.0
 * @category Seq
 * @param {*} value The value to plant.
 * @returns {Object} Returns the new `lodash` wrapper instance.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * var wrapped = _([1, 2]).map(square);
 * var other = wrapped.plant([3, 4]);
 *
 * other.value();
 * // => [9, 16]
 *
 * wrapped.value();
 * // => [1, 4]
 */
function wrapperPlant(value) {
  var result,
      parent = this;

  while (parent instanceof baseLodash) {
    var clone = wrapperClone(parent);
    clone.__index__ = 0;
    clone.__values__ = undefined;
    if (result) {
      previous.__wrapped__ = clone;
    } else {
      result = clone;
    }
    var previous = clone;
    parent = parent.__wrapped__;
  }
  previous.__wrapped__ = value;
  return result;
}

/**
 * The opposite of `_.property`; this method creates a function that returns
 * the value at a given path of `object`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Util
 * @param {Object} object The object to query.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var array = [0, 1, 2],
 *     object = { 'a': array, 'b': array, 'c': array };
 *
 * _.map(['a[2]', 'c[0]'], _.propertyOf(object));
 * // => [2, 0]
 *
 * _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
 * // => [2, 0]
 */
function propertyOf(object) {
  return function(path) {
    return object == null ? undefined : baseGet(object, path);
  };
}

/**
 * This function is like `baseIndexOf` except that it accepts a comparator.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOfWith(array, value, fromIndex, comparator) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (comparator(array[index], value)) {
      return index;
    }
  }
  return -1;
}

/** Used for built-in method references. */
var arrayProto$2 = Array.prototype;

/** Built-in value references. */
var splice$1 = arrayProto$2.splice;

/**
 * The base implementation of `_.pullAllBy` without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to remove.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns `array`.
 */
function basePullAll(array, values, iteratee, comparator) {
  var indexOf = comparator ? baseIndexOfWith : baseIndexOf,
      index = -1,
      length = values.length,
      seen = array;

  if (array === values) {
    values = copyArray(values);
  }
  if (iteratee) {
    seen = arrayMap(array, baseUnary(iteratee));
  }
  while (++index < length) {
    var fromIndex = 0,
        value = values[index],
        computed = iteratee ? iteratee(value) : value;

    while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
      if (seen !== array) {
        splice$1.call(seen, fromIndex, 1);
      }
      splice$1.call(array, fromIndex, 1);
    }
  }
  return array;
}

/**
 * This method is like `_.pull` except that it accepts an array of values to remove.
 *
 * **Note:** Unlike `_.difference`, this method mutates `array`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to modify.
 * @param {Array} values The values to remove.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
 *
 * _.pullAll(array, ['a', 'c']);
 * console.log(array);
 * // => ['b', 'b']
 */
function pullAll(array, values) {
  return (array && array.length && values && values.length)
    ? basePullAll(array, values)
    : array;
}

/**
 * Removes all given values from `array` using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * **Note:** Unlike `_.without`, this method mutates `array`. Use `_.remove`
 * to remove elements from an array by predicate.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Array
 * @param {Array} array The array to modify.
 * @param {...*} [values] The values to remove.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
 *
 * _.pull(array, 'a', 'c');
 * console.log(array);
 * // => ['b', 'b']
 */
var pull = baseRest(pullAll);

/**
 * This method is like `_.pullAll` except that it accepts `iteratee` which is
 * invoked for each element of `array` and `values` to generate the criterion
 * by which they're compared. The iteratee is invoked with one argument: (value).
 *
 * **Note:** Unlike `_.differenceBy`, this method mutates `array`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to modify.
 * @param {Array} values The values to remove.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = [{ 'x': 1 }, { 'x': 2 }, { 'x': 3 }, { 'x': 1 }];
 *
 * _.pullAllBy(array, [{ 'x': 1 }, { 'x': 3 }], 'x');
 * console.log(array);
 * // => [{ 'x': 2 }]
 */
function pullAllBy(array, values, iteratee) {
  return (array && array.length && values && values.length)
    ? basePullAll(array, values, baseIteratee(iteratee))
    : array;
}

/**
 * This method is like `_.pullAll` except that it accepts `comparator` which
 * is invoked to compare elements of `array` to `values`. The comparator is
 * invoked with two arguments: (arrVal, othVal).
 *
 * **Note:** Unlike `_.differenceWith`, this method mutates `array`.
 *
 * @static
 * @memberOf _
 * @since 4.6.0
 * @category Array
 * @param {Array} array The array to modify.
 * @param {Array} values The values to remove.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = [{ 'x': 1, 'y': 2 }, { 'x': 3, 'y': 4 }, { 'x': 5, 'y': 6 }];
 *
 * _.pullAllWith(array, [{ 'x': 3, 'y': 4 }], _.isEqual);
 * console.log(array);
 * // => [{ 'x': 1, 'y': 2 }, { 'x': 5, 'y': 6 }]
 */
function pullAllWith(array, values, comparator) {
  return (array && array.length && values && values.length)
    ? basePullAll(array, values, undefined, comparator)
    : array;
}

/** Used for built-in method references. */
var arrayProto$3 = Array.prototype;

/** Built-in value references. */
var splice$2 = arrayProto$3.splice;

/**
 * The base implementation of `_.pullAt` without support for individual
 * indexes or capturing the removed elements.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {number[]} indexes The indexes of elements to remove.
 * @returns {Array} Returns `array`.
 */
function basePullAt(array, indexes) {
  var length = array ? indexes.length : 0,
      lastIndex = length - 1;

  while (length--) {
    var index = indexes[length];
    if (length == lastIndex || index !== previous) {
      var previous = index;
      if (isIndex(index)) {
        splice$2.call(array, index, 1);
      } else {
        baseUnset(array, index);
      }
    }
  }
  return array;
}

/**
 * Removes elements from `array` corresponding to `indexes` and returns an
 * array of removed elements.
 *
 * **Note:** Unlike `_.at`, this method mutates `array`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to modify.
 * @param {...(number|number[])} [indexes] The indexes of elements to remove.
 * @returns {Array} Returns the new array of removed elements.
 * @example
 *
 * var array = ['a', 'b', 'c', 'd'];
 * var pulled = _.pullAt(array, [1, 3]);
 *
 * console.log(array);
 * // => ['a', 'c']
 *
 * console.log(pulled);
 * // => ['b', 'd']
 */
var pullAt = flatRest(function(array, indexes) {
  var length = array == null ? 0 : array.length,
      result = baseAt(array, indexes);

  basePullAt(array, arrayMap(indexes, function(index) {
    return isIndex(index, length) ? +index : index;
  }).sort(compareAscending));

  return result;
});

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeFloor$2 = Math.floor,
    nativeRandom = Math.random;

/**
 * The base implementation of `_.random` without support for returning
 * floating-point numbers.
 *
 * @private
 * @param {number} lower The lower bound.
 * @param {number} upper The upper bound.
 * @returns {number} Returns the random number.
 */
function baseRandom(lower, upper) {
  return lower + nativeFloor$2(nativeRandom() * (upper - lower + 1));
}

/** Built-in method references without a dependency on `root`. */
var freeParseFloat = parseFloat;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin$9 = Math.min,
    nativeRandom$1 = Math.random;

/**
 * Produces a random number between the inclusive `lower` and `upper` bounds.
 * If only one argument is provided a number between `0` and the given number
 * is returned. If `floating` is `true`, or either `lower` or `upper` are
 * floats, a floating-point number is returned instead of an integer.
 *
 * **Note:** JavaScript follows the IEEE-754 standard for resolving
 * floating-point values which can produce unexpected results.
 *
 * @static
 * @memberOf _
 * @since 0.7.0
 * @category Number
 * @param {number} [lower=0] The lower bound.
 * @param {number} [upper=1] The upper bound.
 * @param {boolean} [floating] Specify returning a floating-point number.
 * @returns {number} Returns the random number.
 * @example
 *
 * _.random(0, 5);
 * // => an integer between 0 and 5
 *
 * _.random(5);
 * // => also an integer between 0 and 5
 *
 * _.random(5, true);
 * // => a floating-point number between 0 and 5
 *
 * _.random(1.2, 5.2);
 * // => a floating-point number between 1.2 and 5.2
 */
function random(lower, upper, floating) {
  if (floating && typeof floating != 'boolean' && isIterateeCall(lower, upper, floating)) {
    upper = floating = undefined;
  }
  if (floating === undefined) {
    if (typeof upper == 'boolean') {
      floating = upper;
      upper = undefined;
    }
    else if (typeof lower == 'boolean') {
      floating = lower;
      lower = undefined;
    }
  }
  if (lower === undefined && upper === undefined) {
    lower = 0;
    upper = 1;
  }
  else {
    lower = toFinite(lower);
    if (upper === undefined) {
      upper = lower;
      lower = 0;
    } else {
      upper = toFinite(upper);
    }
  }
  if (lower > upper) {
    var temp = lower;
    lower = upper;
    upper = temp;
  }
  if (floating || lower % 1 || upper % 1) {
    var rand = nativeRandom$1();
    return nativeMin$9(lower + (rand * (upper - lower + freeParseFloat('1e-' + ((rand + '').length - 1)))), upper);
  }
  return baseRandom(lower, upper);
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeCeil$3 = Math.ceil,
    nativeMax$c = Math.max;

/**
 * The base implementation of `_.range` and `_.rangeRight` which doesn't
 * coerce arguments.
 *
 * @private
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @param {number} step The value to increment or decrement by.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Array} Returns the range of numbers.
 */
function baseRange(start, end, step, fromRight) {
  var index = -1,
      length = nativeMax$c(nativeCeil$3((end - start) / (step || 1)), 0),
      result = Array(length);

  while (length--) {
    result[fromRight ? length : ++index] = start;
    start += step;
  }
  return result;
}

/**
 * Creates a `_.range` or `_.rangeRight` function.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new range function.
 */
function createRange(fromRight) {
  return function(start, end, step) {
    if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
      end = step = undefined;
    }
    // Ensure the sign of `-0` is preserved.
    start = toFinite(start);
    if (end === undefined) {
      end = start;
      start = 0;
    } else {
      end = toFinite(end);
    }
    step = step === undefined ? (start < end ? 1 : -1) : toFinite(step);
    return baseRange(start, end, step, fromRight);
  };
}

/**
 * Creates an array of numbers (positive and/or negative) progressing from
 * `start` up to, but not including, `end`. A step of `-1` is used if a negative
 * `start` is specified without an `end` or `step`. If `end` is not specified,
 * it's set to `start` with `start` then set to `0`.
 *
 * **Note:** JavaScript follows the IEEE-754 standard for resolving
 * floating-point values which can produce unexpected results.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {number} [start=0] The start of the range.
 * @param {number} end The end of the range.
 * @param {number} [step=1] The value to increment or decrement by.
 * @returns {Array} Returns the range of numbers.
 * @see _.inRange, _.rangeRight
 * @example
 *
 * _.range(4);
 * // => [0, 1, 2, 3]
 *
 * _.range(-4);
 * // => [0, -1, -2, -3]
 *
 * _.range(1, 5);
 * // => [1, 2, 3, 4]
 *
 * _.range(0, 20, 5);
 * // => [0, 5, 10, 15]
 *
 * _.range(0, -4, -1);
 * // => [0, -1, -2, -3]
 *
 * _.range(1, 4, 0);
 * // => [1, 1, 1]
 *
 * _.range(0);
 * // => []
 */
var range = createRange();

/**
 * This method is like `_.range` except that it populates values in
 * descending order.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {number} [start=0] The start of the range.
 * @param {number} end The end of the range.
 * @param {number} [step=1] The value to increment or decrement by.
 * @returns {Array} Returns the range of numbers.
 * @see _.inRange, _.range
 * @example
 *
 * _.rangeRight(4);
 * // => [3, 2, 1, 0]
 *
 * _.rangeRight(-4);
 * // => [-3, -2, -1, 0]
 *
 * _.rangeRight(1, 5);
 * // => [4, 3, 2, 1]
 *
 * _.rangeRight(0, 20, 5);
 * // => [15, 10, 5, 0]
 *
 * _.rangeRight(0, -4, -1);
 * // => [-3, -2, -1, 0]
 *
 * _.rangeRight(1, 4, 0);
 * // => [1, 1, 1]
 *
 * _.rangeRight(0);
 * // => []
 */
var rangeRight = createRange(true);

/** Used to compose bitmasks for function metadata. */
var WRAP_REARG_FLAG$3 = 256;

/**
 * Creates a function that invokes `func` with arguments arranged according
 * to the specified `indexes` where the argument value at the first index is
 * provided as the first argument, the argument value at the second index is
 * provided as the second argument, and so on.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Function
 * @param {Function} func The function to rearrange arguments for.
 * @param {...(number|number[])} indexes The arranged argument indexes.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var rearged = _.rearg(function(a, b, c) {
 *   return [a, b, c];
 * }, [2, 0, 1]);
 *
 * rearged('b', 'c', 'a')
 * // => ['a', 'b', 'c']
 */
var rearg = flatRest(function(func, indexes) {
  return createWrap(func, WRAP_REARG_FLAG$3, undefined, undefined, undefined, indexes);
});

/**
 * The base implementation of `_.reduce` and `_.reduceRight`, without support
 * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} accumulator The initial value.
 * @param {boolean} initAccum Specify using the first or last element of
 *  `collection` as the initial value.
 * @param {Function} eachFunc The function to iterate over `collection`.
 * @returns {*} Returns the accumulated value.
 */
function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
  eachFunc(collection, function(value, index, collection) {
    accumulator = initAccum
      ? (initAccum = false, value)
      : iteratee(accumulator, value, index, collection);
  });
  return accumulator;
}

/**
 * Reduces `collection` to a value which is the accumulated result of running
 * each element in `collection` thru `iteratee`, where each successive
 * invocation is supplied the return value of the previous. If `accumulator`
 * is not given, the first element of `collection` is used as the initial
 * value. The iteratee is invoked with four arguments:
 * (accumulator, value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.reduce`, `_.reduceRight`, and `_.transform`.
 *
 * The guarded methods are:
 * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
 * and `sortBy`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @returns {*} Returns the accumulated value.
 * @see _.reduceRight
 * @example
 *
 * _.reduce([1, 2], function(sum, n) {
 *   return sum + n;
 * }, 0);
 * // => 3
 *
 * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
 *   (result[value] || (result[value] = [])).push(key);
 *   return result;
 * }, {});
 * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
 */
function reduce(collection, iteratee, accumulator) {
  var func = isArray(collection) ? arrayReduce : baseReduce,
      initAccum = arguments.length < 3;

  return func(collection, baseIteratee(iteratee), accumulator, initAccum, baseEach);
}

/**
 * A specialized version of `_.reduceRight` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the last element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduceRight(array, iteratee, accumulator, initAccum) {
  var length = array == null ? 0 : array.length;
  if (initAccum && length) {
    accumulator = array[--length];
  }
  while (length--) {
    accumulator = iteratee(accumulator, array[length], length, array);
  }
  return accumulator;
}

/**
 * This method is like `_.reduce` except that it iterates over elements of
 * `collection` from right to left.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @returns {*} Returns the accumulated value.
 * @see _.reduce
 * @example
 *
 * var array = [[0, 1], [2, 3], [4, 5]];
 *
 * _.reduceRight(array, function(flattened, other) {
 *   return flattened.concat(other);
 * }, []);
 * // => [4, 5, 2, 3, 0, 1]
 */
function reduceRight(collection, iteratee, accumulator) {
  var func = isArray(collection) ? arrayReduceRight : baseReduce,
      initAccum = arguments.length < 3;

  return func(collection, baseIteratee(iteratee), accumulator, initAccum, baseEachRight);
}

/**
 * The opposite of `_.filter`; this method returns the elements of `collection`
 * that `predicate` does **not** return truthy for.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 * @see _.filter
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': false },
 *   { 'user': 'fred',   'age': 40, 'active': true }
 * ];
 *
 * _.reject(users, function(o) { return !o.active; });
 * // => objects for ['fred']
 *
 * // The `_.matches` iteratee shorthand.
 * _.reject(users, { 'age': 40, 'active': true });
 * // => objects for ['barney']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.reject(users, ['active', false]);
 * // => objects for ['fred']
 *
 * // The `_.property` iteratee shorthand.
 * _.reject(users, 'active');
 * // => objects for ['barney']
 */
function reject(collection, predicate) {
  var func = isArray(collection) ? arrayFilter : baseFilter;
  return func(collection, negate(baseIteratee(predicate)));
}

/**
 * Removes all elements from `array` that `predicate` returns truthy for
 * and returns an array of the removed elements. The predicate is invoked
 * with three arguments: (value, index, array).
 *
 * **Note:** Unlike `_.filter`, this method mutates `array`. Use `_.pull`
 * to pull elements from an array by value.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Array
 * @param {Array} array The array to modify.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new array of removed elements.
 * @example
 *
 * var array = [1, 2, 3, 4];
 * var evens = _.remove(array, function(n) {
 *   return n % 2 == 0;
 * });
 *
 * console.log(array);
 * // => [1, 3]
 *
 * console.log(evens);
 * // => [2, 4]
 */
function remove(array, predicate) {
  var result = [];
  if (!(array && array.length)) {
    return result;
  }
  var index = -1,
      indexes = [],
      length = array.length;

  predicate = baseIteratee(predicate);
  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result.push(value);
      indexes.push(index);
    }
  }
  basePullAt(array, indexes);
  return result;
}

/**
 * Repeats the given string `n` times.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to repeat.
 * @param {number} [n=1] The number of times to repeat the string.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {string} Returns the repeated string.
 * @example
 *
 * _.repeat('*', 3);
 * // => '***'
 *
 * _.repeat('abc', 2);
 * // => 'abcabc'
 *
 * _.repeat('abc', 0);
 * // => ''
 */
function repeat(string, n, guard) {
  if ((guard ? isIterateeCall(string, n, guard) : n === undefined)) {
    n = 1;
  } else {
    n = toInteger(n);
  }
  return baseRepeat(toString(string), n);
}

/**
 * Replaces matches for `pattern` in `string` with `replacement`.
 *
 * **Note:** This method is based on
 * [`String#replace`](https://mdn.io/String/replace).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to modify.
 * @param {RegExp|string} pattern The pattern to replace.
 * @param {Function|string} replacement The match replacement.
 * @returns {string} Returns the modified string.
 * @example
 *
 * _.replace('Hi Fred', 'Fred', 'Barney');
 * // => 'Hi Barney'
 */
function replace() {
  var args = arguments,
      string = toString(args[0]);

  return args.length < 3 ? string : string.replace(args[1], args[2]);
}

/** Error message constants. */
var FUNC_ERROR_TEXT$9 = 'Expected a function';

/**
 * Creates a function that invokes `func` with the `this` binding of the
 * created function and arguments from `start` and beyond provided as
 * an array.
 *
 * **Note:** This method is based on the
 * [rest parameter](https://mdn.io/rest_parameters).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Function
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var say = _.rest(function(what, names) {
 *   return what + ' ' + _.initial(names).join(', ') +
 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
 * });
 *
 * say('hello', 'fred', 'barney', 'pebbles');
 * // => 'hello fred, barney, & pebbles'
 */
function rest(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT$9);
  }
  start = start === undefined ? start : toInteger(start);
  return baseRest(func, start);
}

/**
 * This method is like `_.get` except that if the resolved value is a
 * function it's invoked with the `this` binding of its parent object and
 * its result is returned.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to resolve.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
 *
 * _.result(object, 'a[0].b.c1');
 * // => 3
 *
 * _.result(object, 'a[0].b.c2');
 * // => 4
 *
 * _.result(object, 'a[0].b.c3', 'default');
 * // => 'default'
 *
 * _.result(object, 'a[0].b.c3', _.constant('default'));
 * // => 'default'
 */
function result(object, path, defaultValue) {
  path = castPath(path, object);

  var index = -1,
      length = path.length;

  // Ensure the loop is entered when path is empty.
  if (!length) {
    length = 1;
    object = undefined;
  }
  while (++index < length) {
    var value = object == null ? undefined : object[toKey(path[index])];
    if (value === undefined) {
      index = length;
      value = defaultValue;
    }
    object = isFunction(value) ? value.call(object) : value;
  }
  return object;
}

/** Used for built-in method references. */
var arrayProto$4 = Array.prototype;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeReverse = arrayProto$4.reverse;

/**
 * Reverses `array` so that the first element becomes the last, the second
 * element becomes the second to last, and so on.
 *
 * **Note:** This method mutates `array` and is based on
 * [`Array#reverse`](https://mdn.io/Array/reverse).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to modify.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = [1, 2, 3];
 *
 * _.reverse(array);
 * // => [3, 2, 1]
 *
 * console.log(array);
 * // => [3, 2, 1]
 */
function reverse(array) {
  return array == null ? array : nativeReverse.call(array);
}

/**
 * Computes `number` rounded to `precision`.
 *
 * @static
 * @memberOf _
 * @since 3.10.0
 * @category Math
 * @param {number} number The number to round.
 * @param {number} [precision=0] The precision to round to.
 * @returns {number} Returns the rounded number.
 * @example
 *
 * _.round(4.006);
 * // => 4
 *
 * _.round(4.006, 2);
 * // => 4.01
 *
 * _.round(4060, -2);
 * // => 4100
 */
var round = createRound('round');

/**
 * A specialized version of `_.sample` for arrays.
 *
 * @private
 * @param {Array} array The array to sample.
 * @returns {*} Returns the random element.
 */
function arraySample(array) {
  var length = array.length;
  return length ? array[baseRandom(0, length - 1)] : undefined;
}

/**
 * The base implementation of `_.sample`.
 *
 * @private
 * @param {Array|Object} collection The collection to sample.
 * @returns {*} Returns the random element.
 */
function baseSample(collection) {
  return arraySample(values(collection));
}

/**
 * Gets a random element from `collection`.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to sample.
 * @returns {*} Returns the random element.
 * @example
 *
 * _.sample([1, 2, 3, 4]);
 * // => 2
 */
function sample(collection) {
  var func = isArray(collection) ? arraySample : baseSample;
  return func(collection);
}

/**
 * A specialized version of `_.shuffle` which mutates and sets the size of `array`.
 *
 * @private
 * @param {Array} array The array to shuffle.
 * @param {number} [size=array.length] The size of `array`.
 * @returns {Array} Returns `array`.
 */
function shuffleSelf(array, size) {
  var index = -1,
      length = array.length,
      lastIndex = length - 1;

  size = size === undefined ? length : size;
  while (++index < size) {
    var rand = baseRandom(index, lastIndex),
        value = array[rand];

    array[rand] = array[index];
    array[index] = value;
  }
  array.length = size;
  return array;
}

/**
 * A specialized version of `_.sampleSize` for arrays.
 *
 * @private
 * @param {Array} array The array to sample.
 * @param {number} n The number of elements to sample.
 * @returns {Array} Returns the random elements.
 */
function arraySampleSize(array, n) {
  return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
}

/**
 * The base implementation of `_.sampleSize` without param guards.
 *
 * @private
 * @param {Array|Object} collection The collection to sample.
 * @param {number} n The number of elements to sample.
 * @returns {Array} Returns the random elements.
 */
function baseSampleSize(collection, n) {
  var array = values(collection);
  return shuffleSelf(array, baseClamp(n, 0, array.length));
}

/**
 * Gets `n` random elements at unique keys from `collection` up to the
 * size of `collection`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to sample.
 * @param {number} [n=1] The number of elements to sample.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the random elements.
 * @example
 *
 * _.sampleSize([1, 2, 3], 2);
 * // => [3, 1]
 *
 * _.sampleSize([1, 2, 3], 4);
 * // => [2, 3, 1]
 */
function sampleSize(collection, n, guard) {
  if ((guard ? isIterateeCall(collection, n, guard) : n === undefined)) {
    n = 1;
  } else {
    n = toInteger(n);
  }
  var func = isArray(collection) ? arraySampleSize : baseSampleSize;
  return func(collection, n);
}

/**
 * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
 * it's created. Arrays are created for missing index properties while objects
 * are created for all other missing properties. Use `_.setWith` to customize
 * `path` creation.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.set(object, 'a[0].b.c', 4);
 * console.log(object.a[0].b.c);
 * // => 4
 *
 * _.set(object, ['x', '0', 'y', 'z'], 5);
 * console.log(object.x[0].y.z);
 * // => 5
 */
function set(object, path, value) {
  return object == null ? object : baseSet(object, path, value);
}

/**
 * This method is like `_.set` except that it accepts `customizer` which is
 * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
 * path creation is handled by the method instead. The `customizer` is invoked
 * with three arguments: (nsValue, key, nsObject).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = {};
 *
 * _.setWith(object, '[0][1]', 'a', Object);
 * // => { '0': { '1': 'a' } }
 */
function setWith(object, path, value, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  return object == null ? object : baseSet(object, path, value, customizer);
}

/**
 * A specialized version of `_.shuffle` for arrays.
 *
 * @private
 * @param {Array} array The array to shuffle.
 * @returns {Array} Returns the new shuffled array.
 */
function arrayShuffle(array) {
  return shuffleSelf(copyArray(array));
}

/**
 * The base implementation of `_.shuffle`.
 *
 * @private
 * @param {Array|Object} collection The collection to shuffle.
 * @returns {Array} Returns the new shuffled array.
 */
function baseShuffle(collection) {
  return shuffleSelf(values(collection));
}

/**
 * Creates an array of shuffled values, using a version of the
 * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to shuffle.
 * @returns {Array} Returns the new shuffled array.
 * @example
 *
 * _.shuffle([1, 2, 3, 4]);
 * // => [4, 1, 3, 2]
 */
function shuffle(collection) {
  var func = isArray(collection) ? arrayShuffle : baseShuffle;
  return func(collection);
}

/** `Object#toString` result references. */
var mapTag$9 = '[object Map]',
    setTag$9 = '[object Set]';

/**
 * Gets the size of `collection` by returning its length for array-like
 * values or the number of own enumerable string keyed properties for objects.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object|string} collection The collection to inspect.
 * @returns {number} Returns the collection size.
 * @example
 *
 * _.size([1, 2, 3]);
 * // => 3
 *
 * _.size({ 'a': 1, 'b': 2 });
 * // => 2
 *
 * _.size('pebbles');
 * // => 7
 */
function size(collection) {
  if (collection == null) {
    return 0;
  }
  if (isArrayLike(collection)) {
    return isString(collection) ? stringSize(collection) : collection.length;
  }
  var tag = getTag$1(collection);
  if (tag == mapTag$9 || tag == setTag$9) {
    return collection.size;
  }
  return baseKeys(collection).length;
}

/**
 * Creates a slice of `array` from `start` up to, but not including, `end`.
 *
 * **Note:** This method is used instead of
 * [`Array#slice`](https://mdn.io/Array/slice) to ensure dense arrays are
 * returned.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function slice(array, start, end) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
    start = 0;
    end = length;
  }
  else {
    start = start == null ? 0 : toInteger(start);
    end = end === undefined ? length : toInteger(end);
  }
  return baseSlice(array, start, end);
}

/**
 * Converts `string` to
 * [snake case](https://en.wikipedia.org/wiki/Snake_case).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the snake cased string.
 * @example
 *
 * _.snakeCase('Foo Bar');
 * // => 'foo_bar'
 *
 * _.snakeCase('fooBar');
 * // => 'foo_bar'
 *
 * _.snakeCase('--FOO-BAR--');
 * // => 'foo_bar'
 */
var snakeCase = createCompounder(function(result, word, index) {
  return result + (index ? '_' : '') + word.toLowerCase();
});

/**
 * The base implementation of `_.some` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function baseSome(collection, predicate) {
  var result;

  baseEach(collection, function(value, index, collection) {
    result = predicate(value, index, collection);
    return !result;
  });
  return !!result;
}

/**
 * Checks if `predicate` returns truthy for **any** element of `collection`.
 * Iteration is stopped once `predicate` returns truthy. The predicate is
 * invoked with three arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 * @example
 *
 * _.some([null, 0, 'yes', false], Boolean);
 * // => true
 *
 * var users = [
 *   { 'user': 'barney', 'active': true },
 *   { 'user': 'fred',   'active': false }
 * ];
 *
 * // The `_.matches` iteratee shorthand.
 * _.some(users, { 'user': 'barney', 'active': false });
 * // => false
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.some(users, ['active', false]);
 * // => true
 *
 * // The `_.property` iteratee shorthand.
 * _.some(users, 'active');
 * // => true
 */
function some(collection, predicate, guard) {
  var func = isArray(collection) ? arraySome : baseSome;
  if (guard && isIterateeCall(collection, predicate, guard)) {
    predicate = undefined;
  }
  return func(collection, baseIteratee(predicate));
}

/**
 * Creates an array of elements, sorted in ascending order by the results of
 * running each element in a collection thru each iteratee. This method
 * performs a stable sort, that is, it preserves the original sort order of
 * equal elements. The iteratees are invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {...(Function|Function[])} [iteratees=[_.identity]]
 *  The iteratees to sort by.
 * @returns {Array} Returns the new sorted array.
 * @example
 *
 * var users = [
 *   { 'user': 'fred',   'age': 48 },
 *   { 'user': 'barney', 'age': 36 },
 *   { 'user': 'fred',   'age': 40 },
 *   { 'user': 'barney', 'age': 34 }
 * ];
 *
 * _.sortBy(users, [function(o) { return o.user; }]);
 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
 *
 * _.sortBy(users, ['user', 'age']);
 * // => objects for [['barney', 34], ['barney', 36], ['fred', 40], ['fred', 48]]
 */
var sortBy = baseRest(function(collection, iteratees) {
  if (collection == null) {
    return [];
  }
  var length = iteratees.length;
  if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
    iteratees = [];
  } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
    iteratees = [iteratees[0]];
  }
  return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
});

/** Used as references for the maximum length and index of an array. */
var MAX_ARRAY_LENGTH$2 = 4294967295,
    MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH$2 - 1;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeFloor$3 = Math.floor,
    nativeMin$a = Math.min;

/**
 * The base implementation of `_.sortedIndexBy` and `_.sortedLastIndexBy`
 * which invokes `iteratee` for `value` and each element of `array` to compute
 * their sort ranking. The iteratee is invoked with one argument; (value).
 *
 * @private
 * @param {Array} array The sorted array to inspect.
 * @param {*} value The value to evaluate.
 * @param {Function} iteratee The iteratee invoked per element.
 * @param {boolean} [retHighest] Specify returning the highest qualified index.
 * @returns {number} Returns the index at which `value` should be inserted
 *  into `array`.
 */
function baseSortedIndexBy(array, value, iteratee, retHighest) {
  value = iteratee(value);

  var low = 0,
      high = array == null ? 0 : array.length,
      valIsNaN = value !== value,
      valIsNull = value === null,
      valIsSymbol = isSymbol(value),
      valIsUndefined = value === undefined;

  while (low < high) {
    var mid = nativeFloor$3((low + high) / 2),
        computed = iteratee(array[mid]),
        othIsDefined = computed !== undefined,
        othIsNull = computed === null,
        othIsReflexive = computed === computed,
        othIsSymbol = isSymbol(computed);

    if (valIsNaN) {
      var setLow = retHighest || othIsReflexive;
    } else if (valIsUndefined) {
      setLow = othIsReflexive && (retHighest || othIsDefined);
    } else if (valIsNull) {
      setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
    } else if (valIsSymbol) {
      setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
    } else if (othIsNull || othIsSymbol) {
      setLow = false;
    } else {
      setLow = retHighest ? (computed <= value) : (computed < value);
    }
    if (setLow) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return nativeMin$a(high, MAX_ARRAY_INDEX);
}

/** Used as references for the maximum length and index of an array. */
var MAX_ARRAY_LENGTH$3 = 4294967295,
    HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH$3 >>> 1;

/**
 * The base implementation of `_.sortedIndex` and `_.sortedLastIndex` which
 * performs a binary search of `array` to determine the index at which `value`
 * should be inserted into `array` in order to maintain its sort order.
 *
 * @private
 * @param {Array} array The sorted array to inspect.
 * @param {*} value The value to evaluate.
 * @param {boolean} [retHighest] Specify returning the highest qualified index.
 * @returns {number} Returns the index at which `value` should be inserted
 *  into `array`.
 */
function baseSortedIndex(array, value, retHighest) {
  var low = 0,
      high = array == null ? low : array.length;

  if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
    while (low < high) {
      var mid = (low + high) >>> 1,
          computed = array[mid];

      if (computed !== null && !isSymbol(computed) &&
          (retHighest ? (computed <= value) : (computed < value))) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return high;
  }
  return baseSortedIndexBy(array, value, identity, retHighest);
}

/**
 * Uses a binary search to determine the lowest index at which `value`
 * should be inserted into `array` in order to maintain its sort order.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The sorted array to inspect.
 * @param {*} value The value to evaluate.
 * @returns {number} Returns the index at which `value` should be inserted
 *  into `array`.
 * @example
 *
 * _.sortedIndex([30, 50], 40);
 * // => 1
 */
function sortedIndex(array, value) {
  return baseSortedIndex(array, value);
}

/**
 * This method is like `_.sortedIndex` except that it accepts `iteratee`
 * which is invoked for `value` and each element of `array` to compute their
 * sort ranking. The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The sorted array to inspect.
 * @param {*} value The value to evaluate.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {number} Returns the index at which `value` should be inserted
 *  into `array`.
 * @example
 *
 * var objects = [{ 'x': 4 }, { 'x': 5 }];
 *
 * _.sortedIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
 * // => 0
 *
 * // The `_.property` iteratee shorthand.
 * _.sortedIndexBy(objects, { 'x': 4 }, 'x');
 * // => 0
 */
function sortedIndexBy(array, value, iteratee) {
  return baseSortedIndexBy(array, value, baseIteratee(iteratee));
}

/**
 * This method is like `_.indexOf` except that it performs a binary
 * search on a sorted `array`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 * @example
 *
 * _.sortedIndexOf([4, 5, 5, 5, 6], 5);
 * // => 1
 */
function sortedIndexOf(array, value) {
  var length = array == null ? 0 : array.length;
  if (length) {
    var index = baseSortedIndex(array, value);
    if (index < length && eq(array[index], value)) {
      return index;
    }
  }
  return -1;
}

/**
 * This method is like `_.sortedIndex` except that it returns the highest
 * index at which `value` should be inserted into `array` in order to
 * maintain its sort order.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The sorted array to inspect.
 * @param {*} value The value to evaluate.
 * @returns {number} Returns the index at which `value` should be inserted
 *  into `array`.
 * @example
 *
 * _.sortedLastIndex([4, 5, 5, 5, 6], 5);
 * // => 4
 */
function sortedLastIndex(array, value) {
  return baseSortedIndex(array, value, true);
}

/**
 * This method is like `_.sortedLastIndex` except that it accepts `iteratee`
 * which is invoked for `value` and each element of `array` to compute their
 * sort ranking. The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The sorted array to inspect.
 * @param {*} value The value to evaluate.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {number} Returns the index at which `value` should be inserted
 *  into `array`.
 * @example
 *
 * var objects = [{ 'x': 4 }, { 'x': 5 }];
 *
 * _.sortedLastIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
 * // => 1
 *
 * // The `_.property` iteratee shorthand.
 * _.sortedLastIndexBy(objects, { 'x': 4 }, 'x');
 * // => 1
 */
function sortedLastIndexBy(array, value, iteratee) {
  return baseSortedIndexBy(array, value, baseIteratee(iteratee), true);
}

/**
 * This method is like `_.lastIndexOf` except that it performs a binary
 * search on a sorted `array`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 * @example
 *
 * _.sortedLastIndexOf([4, 5, 5, 5, 6], 5);
 * // => 3
 */
function sortedLastIndexOf(array, value) {
  var length = array == null ? 0 : array.length;
  if (length) {
    var index = baseSortedIndex(array, value, true) - 1;
    if (eq(array[index], value)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.sortedUniq` and `_.sortedUniqBy` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseSortedUniq(array, iteratee) {
  var index = -1,
      length = array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    if (!index || !eq(computed, seen)) {
      var seen = computed;
      result[resIndex++] = value === 0 ? 0 : value;
    }
  }
  return result;
}

/**
 * This method is like `_.uniq` except that it's designed and optimized
 * for sorted arrays.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.sortedUniq([1, 1, 2]);
 * // => [1, 2]
 */
function sortedUniq(array) {
  return (array && array.length)
    ? baseSortedUniq(array)
    : [];
}

/**
 * This method is like `_.uniqBy` except that it's designed and optimized
 * for sorted arrays.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.sortedUniqBy([1.1, 1.2, 2.3, 2.4], Math.floor);
 * // => [1.1, 2.3]
 */
function sortedUniqBy(array, iteratee) {
  return (array && array.length)
    ? baseSortedUniq(array, baseIteratee(iteratee))
    : [];
}

/** Used as references for the maximum length and index of an array. */
var MAX_ARRAY_LENGTH$4 = 4294967295;

/**
 * Splits `string` by `separator`.
 *
 * **Note:** This method is based on
 * [`String#split`](https://mdn.io/String/split).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to split.
 * @param {RegExp|string} separator The separator pattern to split by.
 * @param {number} [limit] The length to truncate results to.
 * @returns {Array} Returns the string segments.
 * @example
 *
 * _.split('a-b-c', '-', 2);
 * // => ['a', 'b']
 */
function split(string, separator, limit) {
  if (limit && typeof limit != 'number' && isIterateeCall(string, separator, limit)) {
    separator = limit = undefined;
  }
  limit = limit === undefined ? MAX_ARRAY_LENGTH$4 : limit >>> 0;
  if (!limit) {
    return [];
  }
  string = toString(string);
  if (string && (
        typeof separator == 'string' ||
        (separator != null && !isRegExp(separator))
      )) {
    separator = baseToString(separator);
    if (!separator && hasUnicode(string)) {
      return castSlice(stringToArray(string), 0, limit);
    }
  }
  return string.split(separator, limit);
}

/** Error message constants. */
var FUNC_ERROR_TEXT$a = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax$d = Math.max;

/**
 * Creates a function that invokes `func` with the `this` binding of the
 * create function and an array of arguments much like
 * [`Function#apply`](http://www.ecma-international.org/ecma-262/7.0/#sec-function.prototype.apply).
 *
 * **Note:** This method is based on the
 * [spread operator](https://mdn.io/spread_operator).
 *
 * @static
 * @memberOf _
 * @since 3.2.0
 * @category Function
 * @param {Function} func The function to spread arguments over.
 * @param {number} [start=0] The start position of the spread.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var say = _.spread(function(who, what) {
 *   return who + ' says ' + what;
 * });
 *
 * say(['fred', 'hello']);
 * // => 'fred says hello'
 *
 * var numbers = Promise.all([
 *   Promise.resolve(40),
 *   Promise.resolve(36)
 * ]);
 *
 * numbers.then(_.spread(function(x, y) {
 *   return x + y;
 * }));
 * // => a Promise of 76
 */
function spread(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT$a);
  }
  start = start == null ? 0 : nativeMax$d(toInteger(start), 0);
  return baseRest(function(args) {
    var array = args[start],
        otherArgs = castSlice(args, 0, start);

    if (array) {
      arrayPush(otherArgs, array);
    }
    return apply(func, this, otherArgs);
  });
}

/**
 * Converts `string` to
 * [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
 *
 * @static
 * @memberOf _
 * @since 3.1.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the start cased string.
 * @example
 *
 * _.startCase('--foo-bar--');
 * // => 'Foo Bar'
 *
 * _.startCase('fooBar');
 * // => 'Foo Bar'
 *
 * _.startCase('__FOO_BAR__');
 * // => 'FOO BAR'
 */
var startCase = createCompounder(function(result, word, index) {
  return result + (index ? ' ' : '') + upperFirst(word);
});

/**
 * Checks if `string` starts with the given target string.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to inspect.
 * @param {string} [target] The string to search for.
 * @param {number} [position=0] The position to search from.
 * @returns {boolean} Returns `true` if `string` starts with `target`,
 *  else `false`.
 * @example
 *
 * _.startsWith('abc', 'a');
 * // => true
 *
 * _.startsWith('abc', 'b');
 * // => false
 *
 * _.startsWith('abc', 'b', 1);
 * // => true
 */
function startsWith(string, target, position) {
  string = toString(string);
  position = position == null
    ? 0
    : baseClamp(toInteger(position), 0, string.length);

  target = baseToString(target);
  return string.slice(position, position + target.length) == target;
}

/**
 * This method returns a new empty object.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Object} Returns the new empty object.
 * @example
 *
 * var objects = _.times(2, _.stubObject);
 *
 * console.log(objects);
 * // => [{}, {}]
 *
 * console.log(objects[0] === objects[1]);
 * // => false
 */
function stubObject() {
  return {};
}

/**
 * This method returns an empty string.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {string} Returns the empty string.
 * @example
 *
 * _.times(2, _.stubString);
 * // => ['', '']
 */
function stubString() {
  return '';
}

/**
 * This method returns `true`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `true`.
 * @example
 *
 * _.times(2, _.stubTrue);
 * // => [true, true]
 */
function stubTrue() {
  return true;
}

/**
 * Subtract two numbers.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Math
 * @param {number} minuend The first number in a subtraction.
 * @param {number} subtrahend The second number in a subtraction.
 * @returns {number} Returns the difference.
 * @example
 *
 * _.subtract(6, 4);
 * // => 2
 */
var subtract = createMathOperation(function(minuend, subtrahend) {
  return minuend - subtrahend;
}, 0);

/**
 * Computes the sum of the values in `array`.
 *
 * @static
 * @memberOf _
 * @since 3.4.0
 * @category Math
 * @param {Array} array The array to iterate over.
 * @returns {number} Returns the sum.
 * @example
 *
 * _.sum([4, 2, 8, 6]);
 * // => 20
 */
function sum(array) {
  return (array && array.length)
    ? baseSum(array, identity)
    : 0;
}

/**
 * This method is like `_.sum` except that it accepts `iteratee` which is
 * invoked for each element in `array` to generate the value to be summed.
 * The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Math
 * @param {Array} array The array to iterate over.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {number} Returns the sum.
 * @example
 *
 * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
 *
 * _.sumBy(objects, function(o) { return o.n; });
 * // => 20
 *
 * // The `_.property` iteratee shorthand.
 * _.sumBy(objects, 'n');
 * // => 20
 */
function sumBy(array, iteratee) {
  return (array && array.length)
    ? baseSum(array, baseIteratee(iteratee))
    : 0;
}

/**
 * Gets all but the first element of `array`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.tail([1, 2, 3]);
 * // => [2, 3]
 */
function tail(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseSlice(array, 1, length) : [];
}

/**
 * Creates a slice of `array` with `n` elements taken from the beginning.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {number} [n=1] The number of elements to take.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.take([1, 2, 3]);
 * // => [1]
 *
 * _.take([1, 2, 3], 2);
 * // => [1, 2]
 *
 * _.take([1, 2, 3], 5);
 * // => [1, 2, 3]
 *
 * _.take([1, 2, 3], 0);
 * // => []
 */
function take(array, n, guard) {
  if (!(array && array.length)) {
    return [];
  }
  n = (guard || n === undefined) ? 1 : toInteger(n);
  return baseSlice(array, 0, n < 0 ? 0 : n);
}

/**
 * Creates a slice of `array` with `n` elements taken from the end.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {number} [n=1] The number of elements to take.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.takeRight([1, 2, 3]);
 * // => [3]
 *
 * _.takeRight([1, 2, 3], 2);
 * // => [2, 3]
 *
 * _.takeRight([1, 2, 3], 5);
 * // => [1, 2, 3]
 *
 * _.takeRight([1, 2, 3], 0);
 * // => []
 */
function takeRight(array, n, guard) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  n = (guard || n === undefined) ? 1 : toInteger(n);
  n = length - n;
  return baseSlice(array, n < 0 ? 0 : n, length);
}

/**
 * Creates a slice of `array` with elements taken from the end. Elements are
 * taken until `predicate` returns falsey. The predicate is invoked with
 * three arguments: (value, index, array).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': true },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': false }
 * ];
 *
 * _.takeRightWhile(users, function(o) { return !o.active; });
 * // => objects for ['fred', 'pebbles']
 *
 * // The `_.matches` iteratee shorthand.
 * _.takeRightWhile(users, { 'user': 'pebbles', 'active': false });
 * // => objects for ['pebbles']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.takeRightWhile(users, ['active', false]);
 * // => objects for ['fred', 'pebbles']
 *
 * // The `_.property` iteratee shorthand.
 * _.takeRightWhile(users, 'active');
 * // => []
 */
function takeRightWhile(array, predicate) {
  return (array && array.length)
    ? baseWhile(array, baseIteratee(predicate), false, true)
    : [];
}

/**
 * Creates a slice of `array` with elements taken from the beginning. Elements
 * are taken until `predicate` returns falsey. The predicate is invoked with
 * three arguments: (value, index, array).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': true }
 * ];
 *
 * _.takeWhile(users, function(o) { return !o.active; });
 * // => objects for ['barney', 'fred']
 *
 * // The `_.matches` iteratee shorthand.
 * _.takeWhile(users, { 'user': 'barney', 'active': false });
 * // => objects for ['barney']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.takeWhile(users, ['active', false]);
 * // => objects for ['barney', 'fred']
 *
 * // The `_.property` iteratee shorthand.
 * _.takeWhile(users, 'active');
 * // => []
 */
function takeWhile(array, predicate) {
  return (array && array.length)
    ? baseWhile(array, baseIteratee(predicate))
    : [];
}

/**
 * This method invokes `interceptor` and returns `value`. The interceptor
 * is invoked with one argument; (value). The purpose of this method is to
 * "tap into" a method chain sequence in order to modify intermediate results.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Seq
 * @param {*} value The value to provide to `interceptor`.
 * @param {Function} interceptor The function to invoke.
 * @returns {*} Returns `value`.
 * @example
 *
 * _([1, 2, 3])
 *  .tap(function(array) {
 *    // Mutate input array.
 *    array.pop();
 *  })
 *  .reverse()
 *  .value();
 * // => [2, 1]
 */
function tap(value, interceptor) {
  interceptor(value);
  return value;
}

/** Used for built-in method references. */
var objectProto$q = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$m = objectProto$q.hasOwnProperty;

/**
 * Used by `_.defaults` to customize its `_.assignIn` use to assign properties
 * of source objects to the destination object for all destination properties
 * that resolve to `undefined`.
 *
 * @private
 * @param {*} objValue The destination value.
 * @param {*} srcValue The source value.
 * @param {string} key The key of the property to assign.
 * @param {Object} object The parent object of `objValue`.
 * @returns {*} Returns the value to assign.
 */
function customDefaultsAssignIn(objValue, srcValue, key, object) {
  if (objValue === undefined ||
      (eq(objValue, objectProto$q[key]) && !hasOwnProperty$m.call(object, key))) {
    return srcValue;
  }
  return objValue;
}

/** Used to escape characters for inclusion in compiled string literals. */
var stringEscapes = {
  '\\': '\\',
  "'": "'",
  '\n': 'n',
  '\r': 'r',
  '\u2028': 'u2028',
  '\u2029': 'u2029'
};

/**
 * Used by `_.template` to escape characters for inclusion in compiled string literals.
 *
 * @private
 * @param {string} chr The matched character to escape.
 * @returns {string} Returns the escaped character.
 */
function escapeStringChar(chr) {
  return '\\' + stringEscapes[chr];
}

/** Used to match template delimiters. */
var reInterpolate = /<%=([\s\S]+?)%>/g;

/** Used to match template delimiters. */
var reEscape = /<%-([\s\S]+?)%>/g;

/** Used to match template delimiters. */
var reEvaluate = /<%([\s\S]+?)%>/g;

/**
 * By default, the template delimiters used by lodash are like those in
 * embedded Ruby (ERB) as well as ES2015 template strings. Change the
 * following template settings to use alternative delimiters.
 *
 * @static
 * @memberOf _
 * @type {Object}
 */
var templateSettings = {

  /**
   * Used to detect `data` property values to be HTML-escaped.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  'escape': reEscape,

  /**
   * Used to detect code to be evaluated.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  'evaluate': reEvaluate,

  /**
   * Used to detect `data` property values to inject.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  'interpolate': reInterpolate,

  /**
   * Used to reference the data object in the template text.
   *
   * @memberOf _.templateSettings
   * @type {string}
   */
  'variable': '',

  /**
   * Used to import variables into the compiled template.
   *
   * @memberOf _.templateSettings
   * @type {Object}
   */
  'imports': {

    /**
     * A reference to the `lodash` function.
     *
     * @memberOf _.templateSettings.imports
     * @type {Function}
     */
    '_': { 'escape': escape }
  }
};

/** Used to match empty string literals in compiled template source. */
var reEmptyStringLeading = /\b__p \+= '';/g,
    reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
    reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

/**
 * Used to match
 * [ES template delimiters](http://ecma-international.org/ecma-262/7.0/#sec-template-literal-lexical-components).
 */
var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

/** Used to ensure capturing order of template delimiters. */
var reNoMatch = /($^)/;

/** Used to match unescaped characters in compiled string literals. */
var reUnescapedString = /['\n\r\u2028\u2029\\]/g;

/**
 * Creates a compiled template function that can interpolate data properties
 * in "interpolate" delimiters, HTML-escape interpolated data properties in
 * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
 * properties may be accessed as free variables in the template. If a setting
 * object is given, it takes precedence over `_.templateSettings` values.
 *
 * **Note:** In the development build `_.template` utilizes
 * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
 * for easier debugging.
 *
 * For more information on precompiling templates see
 * [lodash's custom builds documentation](https://lodash.com/custom-builds).
 *
 * For more information on Chrome extension sandboxes see
 * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category String
 * @param {string} [string=''] The template string.
 * @param {Object} [options={}] The options object.
 * @param {RegExp} [options.escape=_.templateSettings.escape]
 *  The HTML "escape" delimiter.
 * @param {RegExp} [options.evaluate=_.templateSettings.evaluate]
 *  The "evaluate" delimiter.
 * @param {Object} [options.imports=_.templateSettings.imports]
 *  An object to import into the template as free variables.
 * @param {RegExp} [options.interpolate=_.templateSettings.interpolate]
 *  The "interpolate" delimiter.
 * @param {string} [options.sourceURL='templateSources[n]']
 *  The sourceURL of the compiled template.
 * @param {string} [options.variable='obj']
 *  The data object variable name.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Function} Returns the compiled template function.
 * @example
 *
 * // Use the "interpolate" delimiter to create a compiled template.
 * var compiled = _.template('hello <%= user %>!');
 * compiled({ 'user': 'fred' });
 * // => 'hello fred!'
 *
 * // Use the HTML "escape" delimiter to escape data property values.
 * var compiled = _.template('<b><%- value %></b>');
 * compiled({ 'value': '<script>' });
 * // => '<b>&lt;script&gt;</b>'
 *
 * // Use the "evaluate" delimiter to execute JavaScript and generate HTML.
 * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
 * compiled({ 'users': ['fred', 'barney'] });
 * // => '<li>fred</li><li>barney</li>'
 *
 * // Use the internal `print` function in "evaluate" delimiters.
 * var compiled = _.template('<% print("hello " + user); %>!');
 * compiled({ 'user': 'barney' });
 * // => 'hello barney!'
 *
 * // Use the ES template literal delimiter as an "interpolate" delimiter.
 * // Disable support by replacing the "interpolate" delimiter.
 * var compiled = _.template('hello ${ user }!');
 * compiled({ 'user': 'pebbles' });
 * // => 'hello pebbles!'
 *
 * // Use backslashes to treat delimiters as plain text.
 * var compiled = _.template('<%= "\\<%- value %\\>" %>');
 * compiled({ 'value': 'ignored' });
 * // => '<%- value %>'
 *
 * // Use the `imports` option to import `jQuery` as `jq`.
 * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
 * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
 * compiled({ 'users': ['fred', 'barney'] });
 * // => '<li>fred</li><li>barney</li>'
 *
 * // Use the `sourceURL` option to specify a custom sourceURL for the template.
 * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
 * compiled(data);
 * // => Find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector.
 *
 * // Use the `variable` option to ensure a with-statement isn't used in the compiled template.
 * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
 * compiled.source;
 * // => function(data) {
 * //   var __t, __p = '';
 * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
 * //   return __p;
 * // }
 *
 * // Use custom template delimiters.
 * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
 * var compiled = _.template('hello {{ user }}!');
 * compiled({ 'user': 'mustache' });
 * // => 'hello mustache!'
 *
 * // Use the `source` property to inline compiled templates for meaningful
 * // line numbers in error messages and stack traces.
 * fs.writeFileSync(path.join(process.cwd(), 'jst.js'), '\
 *   var JST = {\
 *     "main": ' + _.template(mainText).source + '\
 *   };\
 * ');
 */
function template(string, options, guard) {
  // Based on John Resig's `tmpl` implementation
  // (http://ejohn.org/blog/javascript-micro-templating/)
  // and Laura Doktorova's doT.js (https://github.com/olado/doT).
  var settings = templateSettings.imports._.templateSettings || templateSettings;

  if (guard && isIterateeCall(string, options, guard)) {
    options = undefined;
  }
  string = toString(string);
  options = assignInWith({}, options, settings, customDefaultsAssignIn);

  var imports = assignInWith({}, options.imports, settings.imports, customDefaultsAssignIn),
      importsKeys = keys(imports),
      importsValues = baseValues(imports, importsKeys);

  var isEscaping,
      isEvaluating,
      index = 0,
      interpolate = options.interpolate || reNoMatch,
      source = "__p += '";

  // Compile the regexp to match each delimiter.
  var reDelimiters = RegExp(
    (options.escape || reNoMatch).source + '|' +
    interpolate.source + '|' +
    (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
    (options.evaluate || reNoMatch).source + '|$'
  , 'g');

  // Use a sourceURL for easier debugging.
  var sourceURL = 'sourceURL' in options ? '//# sourceURL=' + options.sourceURL + '\n' : '';

  string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
    interpolateValue || (interpolateValue = esTemplateValue);

    // Escape characters that can't be included in string literals.
    source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);

    // Replace delimiters with snippets.
    if (escapeValue) {
      isEscaping = true;
      source += "' +\n__e(" + escapeValue + ") +\n'";
    }
    if (evaluateValue) {
      isEvaluating = true;
      source += "';\n" + evaluateValue + ";\n__p += '";
    }
    if (interpolateValue) {
      source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
    }
    index = offset + match.length;

    // The JS engine embedded in Adobe products needs `match` returned in
    // order to produce the correct `offset` value.
    return match;
  });

  source += "';\n";

  // If `variable` is not specified wrap a with-statement around the generated
  // code to add the data object to the top of the scope chain.
  var variable = options.variable;
  if (!variable) {
    source = 'with (obj) {\n' + source + '\n}\n';
  }
  // Cleanup code by stripping empty strings.
  source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
    .replace(reEmptyStringMiddle, '$1')
    .replace(reEmptyStringTrailing, '$1;');

  // Frame code as the function body.
  source = 'function(' + (variable || 'obj') + ') {\n' +
    (variable
      ? ''
      : 'obj || (obj = {});\n'
    ) +
    "var __t, __p = ''" +
    (isEscaping
       ? ', __e = _.escape'
       : ''
    ) +
    (isEvaluating
      ? ', __j = Array.prototype.join;\n' +
        "function print() { __p += __j.call(arguments, '') }\n"
      : ';\n'
    ) +
    source +
    'return __p\n}';

  var result = attempt(function() {
    return Function(importsKeys, sourceURL + 'return ' + source)
      .apply(undefined, importsValues);
  });

  // Provide the compiled function's source by its `toString` method or
  // the `source` property as a convenience for inlining compiled templates.
  result.source = source;
  if (isError(result)) {
    throw result;
  }
  return result;
}

/** Error message constants. */
var FUNC_ERROR_TEXT$b = 'Expected a function';

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT$b);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

/**
 * This method is like `_.tap` except that it returns the result of `interceptor`.
 * The purpose of this method is to "pass thru" values replacing intermediate
 * results in a method chain sequence.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Seq
 * @param {*} value The value to provide to `interceptor`.
 * @param {Function} interceptor The function to invoke.
 * @returns {*} Returns the result of `interceptor`.
 * @example
 *
 * _('  abc  ')
 *  .chain()
 *  .trim()
 *  .thru(function(value) {
 *    return [value];
 *  })
 *  .value();
 * // => ['abc']
 */
function thru(value, interceptor) {
  return interceptor(value);
}

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$4 = 9007199254740991;

/** Used as references for the maximum length and index of an array. */
var MAX_ARRAY_LENGTH$5 = 4294967295;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin$b = Math.min;

/**
 * Invokes the iteratee `n` times, returning an array of the results of
 * each invocation. The iteratee is invoked with one argument; (index).
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 * @example
 *
 * _.times(3, String);
 * // => ['0', '1', '2']
 *
 *  _.times(4, _.constant(0));
 * // => [0, 0, 0, 0]
 */
function times(n, iteratee) {
  n = toInteger(n);
  if (n < 1 || n > MAX_SAFE_INTEGER$4) {
    return [];
  }
  var index = MAX_ARRAY_LENGTH$5,
      length = nativeMin$b(n, MAX_ARRAY_LENGTH$5);

  iteratee = castFunction(iteratee);
  n -= MAX_ARRAY_LENGTH$5;

  var result = baseTimes(length, iteratee);
  while (++index < n) {
    iteratee(index);
  }
  return result;
}

/**
 * Enables the wrapper to be iterable.
 *
 * @name Symbol.iterator
 * @memberOf _
 * @since 4.0.0
 * @category Seq
 * @returns {Object} Returns the wrapper object.
 * @example
 *
 * var wrapped = _([1, 2]);
 *
 * wrapped[Symbol.iterator]() === wrapped;
 * // => true
 *
 * Array.from(wrapped);
 * // => [1, 2]
 */
function wrapperToIterator() {
  return this;
}

/**
 * The base implementation of `wrapperValue` which returns the result of
 * performing a sequence of actions on the unwrapped `value`, where each
 * successive action is supplied the return value of the previous.
 *
 * @private
 * @param {*} value The unwrapped value.
 * @param {Array} actions Actions to perform to resolve the unwrapped value.
 * @returns {*} Returns the resolved value.
 */
function baseWrapperValue(value, actions) {
  var result = value;
  if (result instanceof LazyWrapper) {
    result = result.value();
  }
  return arrayReduce(actions, function(result, action) {
    return action.func.apply(action.thisArg, arrayPush([result], action.args));
  }, result);
}

/**
 * Executes the chain sequence to resolve the unwrapped value.
 *
 * @name value
 * @memberOf _
 * @since 0.1.0
 * @alias toJSON, valueOf
 * @category Seq
 * @returns {*} Returns the resolved unwrapped value.
 * @example
 *
 * _([1, 2, 3]).value();
 * // => [1, 2, 3]
 */
function wrapperValue() {
  return baseWrapperValue(this.__wrapped__, this.__actions__);
}

/**
 * Converts `string`, as a whole, to lower case just like
 * [String#toLowerCase](https://mdn.io/toLowerCase).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the lower cased string.
 * @example
 *
 * _.toLower('--Foo-Bar--');
 * // => '--foo-bar--'
 *
 * _.toLower('fooBar');
 * // => 'foobar'
 *
 * _.toLower('__FOO_BAR__');
 * // => '__foo_bar__'
 */
function toLower(value) {
  return toString(value).toLowerCase();
}

/**
 * Converts `value` to a property path array.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {*} value The value to convert.
 * @returns {Array} Returns the new property path array.
 * @example
 *
 * _.toPath('a.b.c');
 * // => ['a', 'b', 'c']
 *
 * _.toPath('a[0].b.c');
 * // => ['a', '0', 'b', 'c']
 */
function toPath(value) {
  if (isArray(value)) {
    return arrayMap(value, toKey);
  }
  return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
}

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$5 = 9007199254740991;

/**
 * Converts `value` to a safe integer. A safe integer can be compared and
 * represented correctly.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toSafeInteger(3.2);
 * // => 3
 *
 * _.toSafeInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toSafeInteger(Infinity);
 * // => 9007199254740991
 *
 * _.toSafeInteger('3.2');
 * // => 3
 */
function toSafeInteger(value) {
  return value
    ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER$5, MAX_SAFE_INTEGER$5)
    : (value === 0 ? value : 0);
}

/**
 * Converts `string`, as a whole, to upper case just like
 * [String#toUpperCase](https://mdn.io/toUpperCase).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the upper cased string.
 * @example
 *
 * _.toUpper('--foo-bar--');
 * // => '--FOO-BAR--'
 *
 * _.toUpper('fooBar');
 * // => 'FOOBAR'
 *
 * _.toUpper('__foo_bar__');
 * // => '__FOO_BAR__'
 */
function toUpper(value) {
  return toString(value).toUpperCase();
}

/**
 * An alternative to `_.reduce`; this method transforms `object` to a new
 * `accumulator` object which is the result of running each of its own
 * enumerable string keyed properties thru `iteratee`, with each invocation
 * potentially mutating the `accumulator` object. If `accumulator` is not
 * provided, a new object with the same `[[Prototype]]` will be used. The
 * iteratee is invoked with four arguments: (accumulator, value, key, object).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @since 1.3.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [accumulator] The custom accumulator value.
 * @returns {*} Returns the accumulated value.
 * @example
 *
 * _.transform([2, 3, 4], function(result, n) {
 *   result.push(n *= n);
 *   return n % 2 == 0;
 * }, []);
 * // => [4, 9]
 *
 * _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
 *   (result[value] || (result[value] = [])).push(key);
 * }, {});
 * // => { '1': ['a', 'c'], '2': ['b'] }
 */
function transform(object, iteratee, accumulator) {
  var isArr = isArray(object),
      isArrLike = isArr || isBuffer(object) || isTypedArray(object);

  iteratee = baseIteratee(iteratee);
  if (accumulator == null) {
    var Ctor = object && object.constructor;
    if (isArrLike) {
      accumulator = isArr ? new Ctor : [];
    }
    else if (isObject(object)) {
      accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
    }
    else {
      accumulator = {};
    }
  }
  (isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object) {
    return iteratee(accumulator, value, index, object);
  });
  return accumulator;
}

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
 * that is not found in the character symbols.
 *
 * @private
 * @param {Array} strSymbols The string symbols to inspect.
 * @param {Array} chrSymbols The character symbols to find.
 * @returns {number} Returns the index of the last unmatched string symbol.
 */
function charsEndIndex(strSymbols, chrSymbols) {
  var index = strSymbols.length;

  while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
  return index;
}

/**
 * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
 * that is not found in the character symbols.
 *
 * @private
 * @param {Array} strSymbols The string symbols to inspect.
 * @param {Array} chrSymbols The character symbols to find.
 * @returns {number} Returns the index of the first unmatched string symbol.
 */
function charsStartIndex(strSymbols, chrSymbols) {
  var index = -1,
      length = strSymbols.length;

  while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
  return index;
}

/** Used to match leading and trailing whitespace. */
var reTrim$1 = /^\s+|\s+$/g;

/**
 * Removes leading and trailing whitespace or specified characters from `string`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to trim.
 * @param {string} [chars=whitespace] The characters to trim.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {string} Returns the trimmed string.
 * @example
 *
 * _.trim('  abc  ');
 * // => 'abc'
 *
 * _.trim('-_-abc-_-', '_-');
 * // => 'abc'
 *
 * _.map(['  foo  ', '  bar  '], _.trim);
 * // => ['foo', 'bar']
 */
function trim(string, chars, guard) {
  string = toString(string);
  if (string && (guard || chars === undefined)) {
    return string.replace(reTrim$1, '');
  }
  if (!string || !(chars = baseToString(chars))) {
    return string;
  }
  var strSymbols = stringToArray(string),
      chrSymbols = stringToArray(chars),
      start = charsStartIndex(strSymbols, chrSymbols),
      end = charsEndIndex(strSymbols, chrSymbols) + 1;

  return castSlice(strSymbols, start, end).join('');
}

/** Used to match leading and trailing whitespace. */
var reTrimEnd = /\s+$/;

/**
 * Removes trailing whitespace or specified characters from `string`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to trim.
 * @param {string} [chars=whitespace] The characters to trim.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {string} Returns the trimmed string.
 * @example
 *
 * _.trimEnd('  abc  ');
 * // => '  abc'
 *
 * _.trimEnd('-_-abc-_-', '_-');
 * // => '-_-abc'
 */
function trimEnd(string, chars, guard) {
  string = toString(string);
  if (string && (guard || chars === undefined)) {
    return string.replace(reTrimEnd, '');
  }
  if (!string || !(chars = baseToString(chars))) {
    return string;
  }
  var strSymbols = stringToArray(string),
      end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;

  return castSlice(strSymbols, 0, end).join('');
}

/** Used to match leading and trailing whitespace. */
var reTrimStart$1 = /^\s+/;

/**
 * Removes leading whitespace or specified characters from `string`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to trim.
 * @param {string} [chars=whitespace] The characters to trim.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {string} Returns the trimmed string.
 * @example
 *
 * _.trimStart('  abc  ');
 * // => 'abc  '
 *
 * _.trimStart('-_-abc-_-', '_-');
 * // => 'abc-_-'
 */
function trimStart(string, chars, guard) {
  string = toString(string);
  if (string && (guard || chars === undefined)) {
    return string.replace(reTrimStart$1, '');
  }
  if (!string || !(chars = baseToString(chars))) {
    return string;
  }
  var strSymbols = stringToArray(string),
      start = charsStartIndex(strSymbols, stringToArray(chars));

  return castSlice(strSymbols, start).join('');
}

/** Used as default options for `_.truncate`. */
var DEFAULT_TRUNC_LENGTH = 30,
    DEFAULT_TRUNC_OMISSION = '...';

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags$1 = /\w*$/;

/**
 * Truncates `string` if it's longer than the given maximum string length.
 * The last characters of the truncated string are replaced with the omission
 * string which defaults to "...".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to truncate.
 * @param {Object} [options={}] The options object.
 * @param {number} [options.length=30] The maximum string length.
 * @param {string} [options.omission='...'] The string to indicate text is omitted.
 * @param {RegExp|string} [options.separator] The separator pattern to truncate to.
 * @returns {string} Returns the truncated string.
 * @example
 *
 * _.truncate('hi-diddly-ho there, neighborino');
 * // => 'hi-diddly-ho there, neighbo...'
 *
 * _.truncate('hi-diddly-ho there, neighborino', {
 *   'length': 24,
 *   'separator': ' '
 * });
 * // => 'hi-diddly-ho there,...'
 *
 * _.truncate('hi-diddly-ho there, neighborino', {
 *   'length': 24,
 *   'separator': /,? +/
 * });
 * // => 'hi-diddly-ho there...'
 *
 * _.truncate('hi-diddly-ho there, neighborino', {
 *   'omission': ' [...]'
 * });
 * // => 'hi-diddly-ho there, neig [...]'
 */
function truncate(string, options) {
  var length = DEFAULT_TRUNC_LENGTH,
      omission = DEFAULT_TRUNC_OMISSION;

  if (isObject(options)) {
    var separator = 'separator' in options ? options.separator : separator;
    length = 'length' in options ? toInteger(options.length) : length;
    omission = 'omission' in options ? baseToString(options.omission) : omission;
  }
  string = toString(string);

  var strLength = string.length;
  if (hasUnicode(string)) {
    var strSymbols = stringToArray(string);
    strLength = strSymbols.length;
  }
  if (length >= strLength) {
    return string;
  }
  var end = length - stringSize(omission);
  if (end < 1) {
    return omission;
  }
  var result = strSymbols
    ? castSlice(strSymbols, 0, end).join('')
    : string.slice(0, end);

  if (separator === undefined) {
    return result + omission;
  }
  if (strSymbols) {
    end += (result.length - end);
  }
  if (isRegExp(separator)) {
    if (string.slice(end).search(separator)) {
      var match,
          substring = result;

      if (!separator.global) {
        separator = RegExp(separator.source, toString(reFlags$1.exec(separator)) + 'g');
      }
      separator.lastIndex = 0;
      while ((match = separator.exec(substring))) {
        var newEnd = match.index;
      }
      result = result.slice(0, newEnd === undefined ? end : newEnd);
    }
  } else if (string.indexOf(baseToString(separator), end) != end) {
    var index = result.lastIndexOf(separator);
    if (index > -1) {
      result = result.slice(0, index);
    }
  }
  return result + omission;
}

/**
 * Creates a function that accepts up to one argument, ignoring any
 * additional arguments.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Function
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 * @example
 *
 * _.map(['6', '8', '10'], _.unary(parseInt));
 * // => [6, 8, 10]
 */
function unary(func) {
  return ary(func, 1);
}

/** Used to map HTML entities to characters. */
var htmlUnescapes = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'"
};

/**
 * Used by `_.unescape` to convert HTML entities to characters.
 *
 * @private
 * @param {string} chr The matched character to unescape.
 * @returns {string} Returns the unescaped character.
 */
var unescapeHtmlChar = basePropertyOf(htmlUnescapes);

/** Used to match HTML entities and HTML characters. */
var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g,
    reHasEscapedHtml = RegExp(reEscapedHtml.source);

/**
 * The inverse of `_.escape`; this method converts the HTML entities
 * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to
 * their corresponding characters.
 *
 * **Note:** No other HTML entities are unescaped. To unescape additional
 * HTML entities use a third-party library like [_he_](https://mths.be/he).
 *
 * @static
 * @memberOf _
 * @since 0.6.0
 * @category String
 * @param {string} [string=''] The string to unescape.
 * @returns {string} Returns the unescaped string.
 * @example
 *
 * _.unescape('fred, barney, &amp; pebbles');
 * // => 'fred, barney, & pebbles'
 */
function unescape(string) {
  string = toString(string);
  return (string && reHasEscapedHtml.test(string))
    ? string.replace(reEscapedHtml, unescapeHtmlChar)
    : string;
}

/** Used as references for various `Number` constants. */
var INFINITY$5 = 1 / 0;

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY$5) ? noop : function(values) {
  return new Set(values);
};

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE$2 = 200;

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  }
  else if (length >= LARGE_ARRAY_SIZE$2) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

/**
 * Creates an array of unique values, in order, from all given arrays using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of combined values.
 * @example
 *
 * _.union([2], [1, 2]);
 * // => [2, 1]
 */
var union = baseRest(function(arrays) {
  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
});

/**
 * This method is like `_.union` except that it accepts `iteratee` which is
 * invoked for each element of each `arrays` to generate the criterion by
 * which uniqueness is computed. Result values are chosen from the first
 * array in which the value occurs. The iteratee is invoked with one argument:
 * (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {Array} Returns the new array of combined values.
 * @example
 *
 * _.unionBy([2.1], [1.2, 2.3], Math.floor);
 * // => [2.1, 1.2]
 *
 * // The `_.property` iteratee shorthand.
 * _.unionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
 * // => [{ 'x': 1 }, { 'x': 2 }]
 */
var unionBy = baseRest(function(arrays) {
  var iteratee = last(arrays);
  if (isArrayLikeObject(iteratee)) {
    iteratee = undefined;
  }
  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), baseIteratee(iteratee));
});

/**
 * This method is like `_.union` except that it accepts `comparator` which
 * is invoked to compare elements of `arrays`. Result values are chosen from
 * the first array in which the value occurs. The comparator is invoked
 * with two arguments: (arrVal, othVal).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of combined values.
 * @example
 *
 * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
 * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
 *
 * _.unionWith(objects, others, _.isEqual);
 * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
 */
var unionWith = baseRest(function(arrays) {
  var comparator = last(arrays);
  comparator = typeof comparator == 'function' ? comparator : undefined;
  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined, comparator);
});

/**
 * Creates a duplicate-free version of an array, using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons, in which only the first occurrence of each element
 * is kept. The order of result values is determined by the order they occur
 * in the array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniq([2, 1, 2]);
 * // => [2, 1]
 */
function uniq(array) {
  return (array && array.length) ? baseUniq(array) : [];
}

/**
 * This method is like `_.uniq` except that it accepts `iteratee` which is
 * invoked for each element in `array` to generate the criterion by which
 * uniqueness is computed. The order of result values is determined by the
 * order they occur in the array. The iteratee is invoked with one argument:
 * (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniqBy([2.1, 1.2, 2.3], Math.floor);
 * // => [2.1, 1.2]
 *
 * // The `_.property` iteratee shorthand.
 * _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
 * // => [{ 'x': 1 }, { 'x': 2 }]
 */
function uniqBy(array, iteratee) {
  return (array && array.length) ? baseUniq(array, baseIteratee(iteratee)) : [];
}

/**
 * This method is like `_.uniq` except that it accepts `comparator` which
 * is invoked to compare elements of `array`. The order of result values is
 * determined by the order they occur in the array.The comparator is invoked
 * with two arguments: (arrVal, othVal).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 2 }];
 *
 * _.uniqWith(objects, _.isEqual);
 * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
 */
function uniqWith(array, comparator) {
  comparator = typeof comparator == 'function' ? comparator : undefined;
  return (array && array.length) ? baseUniq(array, undefined, comparator) : [];
}

/** Used to generate unique IDs. */
var idCounter = 0;

/**
 * Generates a unique ID. If `prefix` is given, the ID is appended to it.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {string} [prefix=''] The value to prefix the ID with.
 * @returns {string} Returns the unique ID.
 * @example
 *
 * _.uniqueId('contact_');
 * // => 'contact_104'
 *
 * _.uniqueId();
 * // => '105'
 */
function uniqueId(prefix) {
  var id = ++idCounter;
  return toString(prefix) + id;
}

/**
 * Removes the property at `path` of `object`.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to unset.
 * @returns {boolean} Returns `true` if the property is deleted, else `false`.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 7 } }] };
 * _.unset(object, 'a[0].b.c');
 * // => true
 *
 * console.log(object);
 * // => { 'a': [{ 'b': {} }] };
 *
 * _.unset(object, ['a', '0', 'b', 'c']);
 * // => true
 *
 * console.log(object);
 * // => { 'a': [{ 'b': {} }] };
 */
function unset(object, path) {
  return object == null ? true : baseUnset(object, path);
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax$e = Math.max;

/**
 * This method is like `_.zip` except that it accepts an array of grouped
 * elements and creates an array regrouping the elements to their pre-zip
 * configuration.
 *
 * @static
 * @memberOf _
 * @since 1.2.0
 * @category Array
 * @param {Array} array The array of grouped elements to process.
 * @returns {Array} Returns the new array of regrouped elements.
 * @example
 *
 * var zipped = _.zip(['a', 'b'], [1, 2], [true, false]);
 * // => [['a', 1, true], ['b', 2, false]]
 *
 * _.unzip(zipped);
 * // => [['a', 'b'], [1, 2], [true, false]]
 */
function unzip(array) {
  if (!(array && array.length)) {
    return [];
  }
  var length = 0;
  array = arrayFilter(array, function(group) {
    if (isArrayLikeObject(group)) {
      length = nativeMax$e(group.length, length);
      return true;
    }
  });
  return baseTimes(length, function(index) {
    return arrayMap(array, baseProperty(index));
  });
}

/**
 * This method is like `_.unzip` except that it accepts `iteratee` to specify
 * how regrouped values should be combined. The iteratee is invoked with the
 * elements of each group: (...group).
 *
 * @static
 * @memberOf _
 * @since 3.8.0
 * @category Array
 * @param {Array} array The array of grouped elements to process.
 * @param {Function} [iteratee=_.identity] The function to combine
 *  regrouped values.
 * @returns {Array} Returns the new array of regrouped elements.
 * @example
 *
 * var zipped = _.zip([1, 2], [10, 20], [100, 200]);
 * // => [[1, 10, 100], [2, 20, 200]]
 *
 * _.unzipWith(zipped, _.add);
 * // => [3, 30, 300]
 */
function unzipWith(array, iteratee) {
  if (!(array && array.length)) {
    return [];
  }
  var result = unzip(array);
  if (iteratee == null) {
    return result;
  }
  return arrayMap(result, function(group) {
    return apply(iteratee, undefined, group);
  });
}

/**
 * The base implementation of `_.update`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to update.
 * @param {Function} updater The function to produce the updated value.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseUpdate(object, path, updater, customizer) {
  return baseSet(object, path, updater(baseGet(object, path)), customizer);
}

/**
 * This method is like `_.set` except that accepts `updater` to produce the
 * value to set. Use `_.updateWith` to customize `path` creation. The `updater`
 * is invoked with one argument: (value).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.6.0
 * @category Object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {Function} updater The function to produce the updated value.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.update(object, 'a[0].b.c', function(n) { return n * n; });
 * console.log(object.a[0].b.c);
 * // => 9
 *
 * _.update(object, 'x[0].y.z', function(n) { return n ? n + 1 : 0; });
 * console.log(object.x[0].y.z);
 * // => 0
 */
function update(object, path, updater) {
  return object == null ? object : baseUpdate(object, path, castFunction(updater));
}

/**
 * This method is like `_.update` except that it accepts `customizer` which is
 * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
 * path creation is handled by the method instead. The `customizer` is invoked
 * with three arguments: (nsValue, key, nsObject).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.6.0
 * @category Object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {Function} updater The function to produce the updated value.
 * @param {Function} [customizer] The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = {};
 *
 * _.updateWith(object, '[0][1]', _.constant('a'), Object);
 * // => { '0': { '1': 'a' } }
 */
function updateWith(object, path, updater, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
}

/**
 * Converts `string`, as space separated words, to upper case.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the upper cased string.
 * @example
 *
 * _.upperCase('--foo-bar');
 * // => 'FOO BAR'
 *
 * _.upperCase('fooBar');
 * // => 'FOO BAR'
 *
 * _.upperCase('__foo_bar__');
 * // => 'FOO BAR'
 */
var upperCase = createCompounder(function(result, word, index) {
  return result + (index ? ' ' : '') + word.toUpperCase();
});

/**
 * Creates an array of the own and inherited enumerable string keyed property
 * values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.valuesIn(new Foo);
 * // => [1, 2, 3] (iteration order is not guaranteed)
 */
function valuesIn(object) {
  return object == null ? [] : baseValues(object, keysIn$1(object));
}

/**
 * Creates an array excluding all given values using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * **Note:** Unlike `_.pull`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...*} [values] The values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 * @see _.difference, _.xor
 * @example
 *
 * _.without([2, 1, 2, 3], 1, 2);
 * // => [3]
 */
var without = baseRest(function(array, values) {
  return isArrayLikeObject(array)
    ? baseDifference(array, values)
    : [];
});

/**
 * Creates a function that provides `value` to `wrapper` as its first
 * argument. Any additional arguments provided to the function are appended
 * to those provided to the `wrapper`. The wrapper is invoked with the `this`
 * binding of the created function.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {*} value The value to wrap.
 * @param {Function} [wrapper=identity] The wrapper function.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var p = _.wrap(_.escape, function(func, text) {
 *   return '<p>' + func(text) + '</p>';
 * });
 *
 * p('fred, barney, & pebbles');
 * // => '<p>fred, barney, &amp; pebbles</p>'
 */
function wrap(value, wrapper) {
  return partial(castFunction(wrapper), value);
}

/**
 * This method is the wrapper version of `_.at`.
 *
 * @name at
 * @memberOf _
 * @since 1.0.0
 * @category Seq
 * @param {...(string|string[])} [paths] The property paths to pick.
 * @returns {Object} Returns the new `lodash` wrapper instance.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
 *
 * _(object).at(['a[0].b.c', 'a[1]']).value();
 * // => [3, 4]
 */
var wrapperAt = flatRest(function(paths) {
  var length = paths.length,
      start = length ? paths[0] : 0,
      value = this.__wrapped__,
      interceptor = function(object) { return baseAt(object, paths); };

  if (length > 1 || this.__actions__.length ||
      !(value instanceof LazyWrapper) || !isIndex(start)) {
    return this.thru(interceptor);
  }
  value = value.slice(start, +start + (length ? 1 : 0));
  value.__actions__.push({
    'func': thru,
    'args': [interceptor],
    'thisArg': undefined
  });
  return new LodashWrapper(value, this.__chain__).thru(function(array) {
    if (length && !array.length) {
      array.push(undefined);
    }
    return array;
  });
});

/**
 * Creates a `lodash` wrapper instance with explicit method chain sequences enabled.
 *
 * @name chain
 * @memberOf _
 * @since 0.1.0
 * @category Seq
 * @returns {Object} Returns the new `lodash` wrapper instance.
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36 },
 *   { 'user': 'fred',   'age': 40 }
 * ];
 *
 * // A sequence without explicit chaining.
 * _(users).head();
 * // => { 'user': 'barney', 'age': 36 }
 *
 * // A sequence with explicit chaining.
 * _(users)
 *   .chain()
 *   .head()
 *   .pick('user')
 *   .value();
 * // => { 'user': 'barney' }
 */
function wrapperChain() {
  return chain(this);
}

/**
 * This method is the wrapper version of `_.reverse`.
 *
 * **Note:** This method mutates the wrapped array.
 *
 * @name reverse
 * @memberOf _
 * @since 0.1.0
 * @category Seq
 * @returns {Object} Returns the new `lodash` wrapper instance.
 * @example
 *
 * var array = [1, 2, 3];
 *
 * _(array).reverse().value()
 * // => [3, 2, 1]
 *
 * console.log(array);
 * // => [3, 2, 1]
 */
function wrapperReverse() {
  var value = this.__wrapped__;
  if (value instanceof LazyWrapper) {
    var wrapped = value;
    if (this.__actions__.length) {
      wrapped = new LazyWrapper(this);
    }
    wrapped = wrapped.reverse();
    wrapped.__actions__.push({
      'func': thru,
      'args': [reverse],
      'thisArg': undefined
    });
    return new LodashWrapper(wrapped, this.__chain__);
  }
  return this.thru(reverse);
}

/**
 * The base implementation of methods like `_.xor`, without support for
 * iteratee shorthands, that accepts an array of arrays to inspect.
 *
 * @private
 * @param {Array} arrays The arrays to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of values.
 */
function baseXor(arrays, iteratee, comparator) {
  var length = arrays.length;
  if (length < 2) {
    return length ? baseUniq(arrays[0]) : [];
  }
  var index = -1,
      result = Array(length);

  while (++index < length) {
    var array = arrays[index],
        othIndex = -1;

    while (++othIndex < length) {
      if (othIndex != index) {
        result[index] = baseDifference(result[index] || array, arrays[othIndex], iteratee, comparator);
      }
    }
  }
  return baseUniq(baseFlatten(result, 1), iteratee, comparator);
}

/**
 * Creates an array of unique values that is the
 * [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
 * of the given arrays. The order of result values is determined by the order
 * they occur in the arrays.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of filtered values.
 * @see _.difference, _.without
 * @example
 *
 * _.xor([2, 1], [2, 3]);
 * // => [1, 3]
 */
var xor = baseRest(function(arrays) {
  return baseXor(arrayFilter(arrays, isArrayLikeObject));
});

/**
 * This method is like `_.xor` except that it accepts `iteratee` which is
 * invoked for each element of each `arrays` to generate the criterion by
 * which by which they're compared. The order of result values is determined
 * by the order they occur in the arrays. The iteratee is invoked with one
 * argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * _.xorBy([2.1, 1.2], [2.3, 3.4], Math.floor);
 * // => [1.2, 3.4]
 *
 * // The `_.property` iteratee shorthand.
 * _.xorBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
 * // => [{ 'x': 2 }]
 */
var xorBy = baseRest(function(arrays) {
  var iteratee = last(arrays);
  if (isArrayLikeObject(iteratee)) {
    iteratee = undefined;
  }
  return baseXor(arrayFilter(arrays, isArrayLikeObject), baseIteratee(iteratee));
});

/**
 * This method is like `_.xor` except that it accepts `comparator` which is
 * invoked to compare elements of `arrays`. The order of result values is
 * determined by the order they occur in the arrays. The comparator is invoked
 * with two arguments: (arrVal, othVal).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
 * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
 *
 * _.xorWith(objects, others, _.isEqual);
 * // => [{ 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
 */
var xorWith = baseRest(function(arrays) {
  var comparator = last(arrays);
  comparator = typeof comparator == 'function' ? comparator : undefined;
  return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined, comparator);
});

/**
 * Creates an array of grouped elements, the first of which contains the
 * first elements of the given arrays, the second of which contains the
 * second elements of the given arrays, and so on.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to process.
 * @returns {Array} Returns the new array of grouped elements.
 * @example
 *
 * _.zip(['a', 'b'], [1, 2], [true, false]);
 * // => [['a', 1, true], ['b', 2, false]]
 */
var zip = baseRest(unzip);

/**
 * This base implementation of `_.zipObject` which assigns values using `assignFunc`.
 *
 * @private
 * @param {Array} props The property identifiers.
 * @param {Array} values The property values.
 * @param {Function} assignFunc The function to assign values.
 * @returns {Object} Returns the new object.
 */
function baseZipObject(props, values, assignFunc) {
  var index = -1,
      length = props.length,
      valsLength = values.length,
      result = {};

  while (++index < length) {
    var value = index < valsLength ? values[index] : undefined;
    assignFunc(result, props[index], value);
  }
  return result;
}

/**
 * This method is like `_.fromPairs` except that it accepts two arrays,
 * one of property identifiers and one of corresponding values.
 *
 * @static
 * @memberOf _
 * @since 0.4.0
 * @category Array
 * @param {Array} [props=[]] The property identifiers.
 * @param {Array} [values=[]] The property values.
 * @returns {Object} Returns the new object.
 * @example
 *
 * _.zipObject(['a', 'b'], [1, 2]);
 * // => { 'a': 1, 'b': 2 }
 */
function zipObject(props, values) {
  return baseZipObject(props || [], values || [], assignValue);
}

/**
 * This method is like `_.zipObject` except that it supports property paths.
 *
 * @static
 * @memberOf _
 * @since 4.1.0
 * @category Array
 * @param {Array} [props=[]] The property identifiers.
 * @param {Array} [values=[]] The property values.
 * @returns {Object} Returns the new object.
 * @example
 *
 * _.zipObjectDeep(['a.b[0].c', 'a.b[1].d'], [1, 2]);
 * // => { 'a': { 'b': [{ 'c': 1 }, { 'd': 2 }] } }
 */
function zipObjectDeep(props, values) {
  return baseZipObject(props || [], values || [], baseSet);
}

/**
 * This method is like `_.zip` except that it accepts `iteratee` to specify
 * how grouped values should be combined. The iteratee is invoked with the
 * elements of each group: (...group).
 *
 * @static
 * @memberOf _
 * @since 3.8.0
 * @category Array
 * @param {...Array} [arrays] The arrays to process.
 * @param {Function} [iteratee=_.identity] The function to combine
 *  grouped values.
 * @returns {Array} Returns the new array of grouped elements.
 * @example
 *
 * _.zipWith([1, 2], [10, 20], [100, 200], function(a, b, c) {
 *   return a + b + c;
 * });
 * // => [111, 222]
 */
var zipWith = baseRest(function(arrays) {
  var length = arrays.length,
      iteratee = length > 1 ? arrays[length - 1] : undefined;

  iteratee = typeof iteratee == 'function' ? (arrays.pop(), iteratee) : undefined;
  return unzipWith(arrays, iteratee);
});

var array = {
  chunk, compact, concat, difference, differenceBy,
  differenceWith, drop, dropRight, dropRightWhile, dropWhile,
  fill, findIndex, findLastIndex, first: head, flatten,
  flattenDeep, flattenDepth, fromPairs, head, indexOf,
  initial, intersection, intersectionBy, intersectionWith, join,
  last, lastIndexOf, nth, pull, pullAll,
  pullAllBy, pullAllWith, pullAt, remove, reverse,
  slice, sortedIndex, sortedIndexBy, sortedIndexOf, sortedLastIndex,
  sortedLastIndexBy, sortedLastIndexOf, sortedUniq, sortedUniqBy, tail,
  take, takeRight, takeRightWhile, takeWhile, union,
  unionBy, unionWith, uniq, uniqBy, uniqWith,
  unzip, unzipWith, without, xor, xorBy,
  xorWith, zip, zipObject, zipObjectDeep, zipWith
};

var collection = {
  countBy, each: forEach, eachRight: forEachRight, every, filter,
  find, findLast, flatMap, flatMapDeep, flatMapDepth,
  forEach, forEachRight, groupBy, includes, invokeMap,
  keyBy, map, orderBy, partition, reduce,
  reduceRight, reject, sample, sampleSize, shuffle,
  size, some, sortBy
};

var date = {
  now
};

var func = {
  after, ary, before, bind, bindKey,
  curry, curryRight, debounce, defer, delay,
  flip, memoize, negate, once, overArgs,
  partial, partialRight, rearg, rest, spread,
  throttle, unary, wrap
};

var lang = {
  castArray, clone, cloneDeep, cloneDeepWith, cloneWith,
  conformsTo, eq, gt, gte, isArguments,
  isArray, isArrayBuffer, isArrayLike, isArrayLikeObject, isBoolean,
  isBuffer, isDate, isElement, isEmpty, isEqual,
  isEqualWith, isError, isFinite: isFinite$1, isFunction, isInteger,
  isLength, isMap, isMatch, isMatchWith, isNaN: isNaN$1,
  isNative, isNil, isNull, isNumber, isObject,
  isObjectLike, isPlainObject, isRegExp, isSafeInteger, isSet,
  isString, isSymbol, isTypedArray, isUndefined, isWeakMap,
  isWeakSet, lt, lte, toArray, toFinite,
  toInteger, toLength, toNumber, toPlainObject, toSafeInteger,
  toString
};

var math = {
  add, ceil, divide, floor, max,
  maxBy, mean, meanBy, min, minBy,
  multiply, round, subtract, sum, sumBy
};

var number = {
  clamp, inRange, random
};

var object = {
  assign, assignIn, assignInWith, assignWith, at,
  create, defaults, defaultsDeep, entries: toPairs, entriesIn: toPairsIn,
  extend: assignIn, extendWith: assignInWith, findKey, findLastKey, forIn,
  forInRight, forOwn, forOwnRight, functions, functionsIn,
  get, has, hasIn, invert, invertBy,
  invoke, keys, keysIn: keysIn$1, mapKeys, mapValues,
  merge, mergeWith, omit, omitBy, pick,
  pickBy, result, set, setWith, toPairs,
  toPairsIn, transform, unset, update, updateWith,
  values, valuesIn
};

var seq = {
  at: wrapperAt, chain, commit: wrapperCommit, lodash, next: wrapperNext,
  plant: wrapperPlant, reverse: wrapperReverse, tap, thru, toIterator: wrapperToIterator,
  toJSON: wrapperValue, value: wrapperValue, valueOf: wrapperValue, wrapperChain
};

var string = {
  camelCase, capitalize, deburr, endsWith, escape,
  escapeRegExp, kebabCase, lowerCase, lowerFirst, pad,
  padEnd, padStart, parseInt: parseInt$1, repeat, replace,
  snakeCase, split, startCase, startsWith, template,
  templateSettings, toLower, toUpper, trim, trimEnd,
  trimStart, truncate, unescape, upperCase, upperFirst,
  words
};

var util = {
  attempt, bindAll, cond, conforms, constant,
  defaultTo, flow, flowRight, identity, iteratee,
  matches, matchesProperty, method, methodOf, mixin,
  noop, nthArg, over, overEvery, overSome,
  property, propertyOf, range, rangeRight, stubArray,
  stubFalse, stubObject, stubString, stubTrue, times,
  toPath, uniqueId
};

/**
 * Creates a clone of the lazy wrapper object.
 *
 * @private
 * @name clone
 * @memberOf LazyWrapper
 * @returns {Object} Returns the cloned `LazyWrapper` object.
 */
function lazyClone() {
  var result = new LazyWrapper(this.__wrapped__);
  result.__actions__ = copyArray(this.__actions__);
  result.__dir__ = this.__dir__;
  result.__filtered__ = this.__filtered__;
  result.__iteratees__ = copyArray(this.__iteratees__);
  result.__takeCount__ = this.__takeCount__;
  result.__views__ = copyArray(this.__views__);
  return result;
}

/**
 * Reverses the direction of lazy iteration.
 *
 * @private
 * @name reverse
 * @memberOf LazyWrapper
 * @returns {Object} Returns the new reversed `LazyWrapper` object.
 */
function lazyReverse() {
  if (this.__filtered__) {
    var result = new LazyWrapper(this);
    result.__dir__ = -1;
    result.__filtered__ = true;
  } else {
    result = this.clone();
    result.__dir__ *= -1;
  }
  return result;
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax$f = Math.max,
    nativeMin$c = Math.min;

/**
 * Gets the view, applying any `transforms` to the `start` and `end` positions.
 *
 * @private
 * @param {number} start The start of the view.
 * @param {number} end The end of the view.
 * @param {Array} transforms The transformations to apply to the view.
 * @returns {Object} Returns an object containing the `start` and `end`
 *  positions of the view.
 */
function getView(start, end, transforms) {
  var index = -1,
      length = transforms.length;

  while (++index < length) {
    var data = transforms[index],
        size = data.size;

    switch (data.type) {
      case 'drop':      start += size; break;
      case 'dropRight': end -= size; break;
      case 'take':      end = nativeMin$c(end, start + size); break;
      case 'takeRight': start = nativeMax$f(start, end - size); break;
    }
  }
  return { 'start': start, 'end': end };
}

/** Used to indicate the type of lazy iteratees. */
var LAZY_FILTER_FLAG = 1,
    LAZY_MAP_FLAG = 2;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin$d = Math.min;

/**
 * Extracts the unwrapped value from its lazy wrapper.
 *
 * @private
 * @name value
 * @memberOf LazyWrapper
 * @returns {*} Returns the unwrapped value.
 */
function lazyValue() {
  var array = this.__wrapped__.value(),
      dir = this.__dir__,
      isArr = isArray(array),
      isRight = dir < 0,
      arrLength = isArr ? array.length : 0,
      view = getView(0, arrLength, this.__views__),
      start = view.start,
      end = view.end,
      length = end - start,
      index = isRight ? end : (start - 1),
      iteratees = this.__iteratees__,
      iterLength = iteratees.length,
      resIndex = 0,
      takeCount = nativeMin$d(length, this.__takeCount__);

  if (!isArr || (!isRight && arrLength == length && takeCount == length)) {
    return baseWrapperValue(array, this.__actions__);
  }
  var result = [];

  outer:
  while (length-- && resIndex < takeCount) {
    index += dir;

    var iterIndex = -1,
        value = array[index];

    while (++iterIndex < iterLength) {
      var data = iteratees[iterIndex],
          iteratee = data.iteratee,
          type = data.type,
          computed = iteratee(value);

      if (type == LAZY_MAP_FLAG) {
        value = computed;
      } else if (!computed) {
        if (type == LAZY_FILTER_FLAG) {
          continue outer;
        } else {
          break outer;
        }
      }
    }
    result[resIndex++] = value;
  }
  return result;
}

/**
 * @license
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="es" -o ./`
 * Copyright JS Foundation and other contributors <https://js.foundation/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the semantic version number. */
var VERSION = '4.17.11';

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_KEY_FLAG$6 = 2;

/** Used to indicate the type of lazy iteratees. */
var LAZY_FILTER_FLAG$1 = 1,
    LAZY_WHILE_FLAG = 3;

/** Used as references for the maximum length and index of an array. */
var MAX_ARRAY_LENGTH$6 = 4294967295;

/** Used for built-in method references. */
var arrayProto$5 = Array.prototype,
    objectProto$r = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$n = objectProto$r.hasOwnProperty;

/** Built-in value references. */
var symIterator$1 = Symbol ? Symbol.iterator : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax$g = Math.max,
    nativeMin$e = Math.min;

// wrap `_.mixin` so it works when provided only one argument
var mixin$1 = (function(func) {
  return function(object, source, options) {
    if (options == null) {
      var isObj = isObject(source),
          props = isObj && keys(source),
          methodNames = props && props.length && baseFunctions(source, props);

      if (!(methodNames ? methodNames.length : isObj)) {
        options = source;
        source = object;
        object = this;
      }
    }
    return func(object, source, options);
  };
}(mixin));

// Add methods that return wrapped values in chain sequences.
lodash.after = func.after;
lodash.ary = func.ary;
lodash.assign = object.assign;
lodash.assignIn = object.assignIn;
lodash.assignInWith = object.assignInWith;
lodash.assignWith = object.assignWith;
lodash.at = object.at;
lodash.before = func.before;
lodash.bind = func.bind;
lodash.bindAll = util.bindAll;
lodash.bindKey = func.bindKey;
lodash.castArray = lang.castArray;
lodash.chain = seq.chain;
lodash.chunk = array.chunk;
lodash.compact = array.compact;
lodash.concat = array.concat;
lodash.cond = util.cond;
lodash.conforms = util.conforms;
lodash.constant = util.constant;
lodash.countBy = collection.countBy;
lodash.create = object.create;
lodash.curry = func.curry;
lodash.curryRight = func.curryRight;
lodash.debounce = func.debounce;
lodash.defaults = object.defaults;
lodash.defaultsDeep = object.defaultsDeep;
lodash.defer = func.defer;
lodash.delay = func.delay;
lodash.difference = array.difference;
lodash.differenceBy = array.differenceBy;
lodash.differenceWith = array.differenceWith;
lodash.drop = array.drop;
lodash.dropRight = array.dropRight;
lodash.dropRightWhile = array.dropRightWhile;
lodash.dropWhile = array.dropWhile;
lodash.fill = array.fill;
lodash.filter = collection.filter;
lodash.flatMap = collection.flatMap;
lodash.flatMapDeep = collection.flatMapDeep;
lodash.flatMapDepth = collection.flatMapDepth;
lodash.flatten = array.flatten;
lodash.flattenDeep = array.flattenDeep;
lodash.flattenDepth = array.flattenDepth;
lodash.flip = func.flip;
lodash.flow = util.flow;
lodash.flowRight = util.flowRight;
lodash.fromPairs = array.fromPairs;
lodash.functions = object.functions;
lodash.functionsIn = object.functionsIn;
lodash.groupBy = collection.groupBy;
lodash.initial = array.initial;
lodash.intersection = array.intersection;
lodash.intersectionBy = array.intersectionBy;
lodash.intersectionWith = array.intersectionWith;
lodash.invert = object.invert;
lodash.invertBy = object.invertBy;
lodash.invokeMap = collection.invokeMap;
lodash.iteratee = util.iteratee;
lodash.keyBy = collection.keyBy;
lodash.keys = keys;
lodash.keysIn = object.keysIn;
lodash.map = collection.map;
lodash.mapKeys = object.mapKeys;
lodash.mapValues = object.mapValues;
lodash.matches = util.matches;
lodash.matchesProperty = util.matchesProperty;
lodash.memoize = func.memoize;
lodash.merge = object.merge;
lodash.mergeWith = object.mergeWith;
lodash.method = util.method;
lodash.methodOf = util.methodOf;
lodash.mixin = mixin$1;
lodash.negate = negate;
lodash.nthArg = util.nthArg;
lodash.omit = object.omit;
lodash.omitBy = object.omitBy;
lodash.once = func.once;
lodash.orderBy = collection.orderBy;
lodash.over = util.over;
lodash.overArgs = func.overArgs;
lodash.overEvery = util.overEvery;
lodash.overSome = util.overSome;
lodash.partial = func.partial;
lodash.partialRight = func.partialRight;
lodash.partition = collection.partition;
lodash.pick = object.pick;
lodash.pickBy = object.pickBy;
lodash.property = util.property;
lodash.propertyOf = util.propertyOf;
lodash.pull = array.pull;
lodash.pullAll = array.pullAll;
lodash.pullAllBy = array.pullAllBy;
lodash.pullAllWith = array.pullAllWith;
lodash.pullAt = array.pullAt;
lodash.range = util.range;
lodash.rangeRight = util.rangeRight;
lodash.rearg = func.rearg;
lodash.reject = collection.reject;
lodash.remove = array.remove;
lodash.rest = func.rest;
lodash.reverse = array.reverse;
lodash.sampleSize = collection.sampleSize;
lodash.set = object.set;
lodash.setWith = object.setWith;
lodash.shuffle = collection.shuffle;
lodash.slice = array.slice;
lodash.sortBy = collection.sortBy;
lodash.sortedUniq = array.sortedUniq;
lodash.sortedUniqBy = array.sortedUniqBy;
lodash.split = string.split;
lodash.spread = func.spread;
lodash.tail = array.tail;
lodash.take = array.take;
lodash.takeRight = array.takeRight;
lodash.takeRightWhile = array.takeRightWhile;
lodash.takeWhile = array.takeWhile;
lodash.tap = seq.tap;
lodash.throttle = func.throttle;
lodash.thru = thru;
lodash.toArray = lang.toArray;
lodash.toPairs = object.toPairs;
lodash.toPairsIn = object.toPairsIn;
lodash.toPath = util.toPath;
lodash.toPlainObject = lang.toPlainObject;
lodash.transform = object.transform;
lodash.unary = func.unary;
lodash.union = array.union;
lodash.unionBy = array.unionBy;
lodash.unionWith = array.unionWith;
lodash.uniq = array.uniq;
lodash.uniqBy = array.uniqBy;
lodash.uniqWith = array.uniqWith;
lodash.unset = object.unset;
lodash.unzip = array.unzip;
lodash.unzipWith = array.unzipWith;
lodash.update = object.update;
lodash.updateWith = object.updateWith;
lodash.values = object.values;
lodash.valuesIn = object.valuesIn;
lodash.without = array.without;
lodash.words = string.words;
lodash.wrap = func.wrap;
lodash.xor = array.xor;
lodash.xorBy = array.xorBy;
lodash.xorWith = array.xorWith;
lodash.zip = array.zip;
lodash.zipObject = array.zipObject;
lodash.zipObjectDeep = array.zipObjectDeep;
lodash.zipWith = array.zipWith;

// Add aliases.
lodash.entries = object.toPairs;
lodash.entriesIn = object.toPairsIn;
lodash.extend = object.assignIn;
lodash.extendWith = object.assignInWith;

// Add methods to `lodash.prototype`.
mixin$1(lodash, lodash);

// Add methods that return unwrapped values in chain sequences.
lodash.add = math.add;
lodash.attempt = util.attempt;
lodash.camelCase = string.camelCase;
lodash.capitalize = string.capitalize;
lodash.ceil = math.ceil;
lodash.clamp = number.clamp;
lodash.clone = lang.clone;
lodash.cloneDeep = lang.cloneDeep;
lodash.cloneDeepWith = lang.cloneDeepWith;
lodash.cloneWith = lang.cloneWith;
lodash.conformsTo = lang.conformsTo;
lodash.deburr = string.deburr;
lodash.defaultTo = util.defaultTo;
lodash.divide = math.divide;
lodash.endsWith = string.endsWith;
lodash.eq = lang.eq;
lodash.escape = string.escape;
lodash.escapeRegExp = string.escapeRegExp;
lodash.every = collection.every;
lodash.find = collection.find;
lodash.findIndex = array.findIndex;
lodash.findKey = object.findKey;
lodash.findLast = collection.findLast;
lodash.findLastIndex = array.findLastIndex;
lodash.findLastKey = object.findLastKey;
lodash.floor = math.floor;
lodash.forEach = collection.forEach;
lodash.forEachRight = collection.forEachRight;
lodash.forIn = object.forIn;
lodash.forInRight = object.forInRight;
lodash.forOwn = object.forOwn;
lodash.forOwnRight = object.forOwnRight;
lodash.get = object.get;
lodash.gt = lang.gt;
lodash.gte = lang.gte;
lodash.has = object.has;
lodash.hasIn = object.hasIn;
lodash.head = array.head;
lodash.identity = identity;
lodash.includes = collection.includes;
lodash.indexOf = array.indexOf;
lodash.inRange = number.inRange;
lodash.invoke = object.invoke;
lodash.isArguments = lang.isArguments;
lodash.isArray = isArray;
lodash.isArrayBuffer = lang.isArrayBuffer;
lodash.isArrayLike = lang.isArrayLike;
lodash.isArrayLikeObject = lang.isArrayLikeObject;
lodash.isBoolean = lang.isBoolean;
lodash.isBuffer = lang.isBuffer;
lodash.isDate = lang.isDate;
lodash.isElement = lang.isElement;
lodash.isEmpty = lang.isEmpty;
lodash.isEqual = lang.isEqual;
lodash.isEqualWith = lang.isEqualWith;
lodash.isError = lang.isError;
lodash.isFinite = lang.isFinite;
lodash.isFunction = lang.isFunction;
lodash.isInteger = lang.isInteger;
lodash.isLength = lang.isLength;
lodash.isMap = lang.isMap;
lodash.isMatch = lang.isMatch;
lodash.isMatchWith = lang.isMatchWith;
lodash.isNaN = lang.isNaN;
lodash.isNative = lang.isNative;
lodash.isNil = lang.isNil;
lodash.isNull = lang.isNull;
lodash.isNumber = lang.isNumber;
lodash.isObject = isObject;
lodash.isObjectLike = lang.isObjectLike;
lodash.isPlainObject = lang.isPlainObject;
lodash.isRegExp = lang.isRegExp;
lodash.isSafeInteger = lang.isSafeInteger;
lodash.isSet = lang.isSet;
lodash.isString = lang.isString;
lodash.isSymbol = lang.isSymbol;
lodash.isTypedArray = lang.isTypedArray;
lodash.isUndefined = lang.isUndefined;
lodash.isWeakMap = lang.isWeakMap;
lodash.isWeakSet = lang.isWeakSet;
lodash.join = array.join;
lodash.kebabCase = string.kebabCase;
lodash.last = last;
lodash.lastIndexOf = array.lastIndexOf;
lodash.lowerCase = string.lowerCase;
lodash.lowerFirst = string.lowerFirst;
lodash.lt = lang.lt;
lodash.lte = lang.lte;
lodash.max = math.max;
lodash.maxBy = math.maxBy;
lodash.mean = math.mean;
lodash.meanBy = math.meanBy;
lodash.min = math.min;
lodash.minBy = math.minBy;
lodash.stubArray = util.stubArray;
lodash.stubFalse = util.stubFalse;
lodash.stubObject = util.stubObject;
lodash.stubString = util.stubString;
lodash.stubTrue = util.stubTrue;
lodash.multiply = math.multiply;
lodash.nth = array.nth;
lodash.noop = util.noop;
lodash.now = date.now;
lodash.pad = string.pad;
lodash.padEnd = string.padEnd;
lodash.padStart = string.padStart;
lodash.parseInt = string.parseInt;
lodash.random = number.random;
lodash.reduce = collection.reduce;
lodash.reduceRight = collection.reduceRight;
lodash.repeat = string.repeat;
lodash.replace = string.replace;
lodash.result = object.result;
lodash.round = math.round;
lodash.sample = collection.sample;
lodash.size = collection.size;
lodash.snakeCase = string.snakeCase;
lodash.some = collection.some;
lodash.sortedIndex = array.sortedIndex;
lodash.sortedIndexBy = array.sortedIndexBy;
lodash.sortedIndexOf = array.sortedIndexOf;
lodash.sortedLastIndex = array.sortedLastIndex;
lodash.sortedLastIndexBy = array.sortedLastIndexBy;
lodash.sortedLastIndexOf = array.sortedLastIndexOf;
lodash.startCase = string.startCase;
lodash.startsWith = string.startsWith;
lodash.subtract = math.subtract;
lodash.sum = math.sum;
lodash.sumBy = math.sumBy;
lodash.template = string.template;
lodash.times = util.times;
lodash.toFinite = lang.toFinite;
lodash.toInteger = toInteger;
lodash.toLength = lang.toLength;
lodash.toLower = string.toLower;
lodash.toNumber = lang.toNumber;
lodash.toSafeInteger = lang.toSafeInteger;
lodash.toString = lang.toString;
lodash.toUpper = string.toUpper;
lodash.trim = string.trim;
lodash.trimEnd = string.trimEnd;
lodash.trimStart = string.trimStart;
lodash.truncate = string.truncate;
lodash.unescape = string.unescape;
lodash.uniqueId = util.uniqueId;
lodash.upperCase = string.upperCase;
lodash.upperFirst = string.upperFirst;

// Add aliases.
lodash.each = collection.forEach;
lodash.eachRight = collection.forEachRight;
lodash.first = array.head;

mixin$1(lodash, (function() {
  var source = {};
  baseForOwn(lodash, function(func, methodName) {
    if (!hasOwnProperty$n.call(lodash.prototype, methodName)) {
      source[methodName] = func;
    }
  });
  return source;
}()), { 'chain': false });

/**
 * The semantic version number.
 *
 * @static
 * @memberOf _
 * @type {string}
 */
lodash.VERSION = VERSION;
(lodash.templateSettings = string.templateSettings).imports._ = lodash;

// Assign default placeholders.
arrayEach(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function(methodName) {
  lodash[methodName].placeholder = lodash;
});

// Add `LazyWrapper` methods for `_.drop` and `_.take` variants.
arrayEach(['drop', 'take'], function(methodName, index) {
  LazyWrapper.prototype[methodName] = function(n) {
    n = n === undefined ? 1 : nativeMax$g(toInteger(n), 0);

    var result = (this.__filtered__ && !index)
      ? new LazyWrapper(this)
      : this.clone();

    if (result.__filtered__) {
      result.__takeCount__ = nativeMin$e(n, result.__takeCount__);
    } else {
      result.__views__.push({
        'size': nativeMin$e(n, MAX_ARRAY_LENGTH$6),
        'type': methodName + (result.__dir__ < 0 ? 'Right' : '')
      });
    }
    return result;
  };

  LazyWrapper.prototype[methodName + 'Right'] = function(n) {
    return this.reverse()[methodName](n).reverse();
  };
});

// Add `LazyWrapper` methods that accept an `iteratee` value.
arrayEach(['filter', 'map', 'takeWhile'], function(methodName, index) {
  var type = index + 1,
      isFilter = type == LAZY_FILTER_FLAG$1 || type == LAZY_WHILE_FLAG;

  LazyWrapper.prototype[methodName] = function(iteratee) {
    var result = this.clone();
    result.__iteratees__.push({
      'iteratee': baseIteratee(iteratee),
      'type': type
    });
    result.__filtered__ = result.__filtered__ || isFilter;
    return result;
  };
});

// Add `LazyWrapper` methods for `_.head` and `_.last`.
arrayEach(['head', 'last'], function(methodName, index) {
  var takeName = 'take' + (index ? 'Right' : '');

  LazyWrapper.prototype[methodName] = function() {
    return this[takeName](1).value()[0];
  };
});

// Add `LazyWrapper` methods for `_.initial` and `_.tail`.
arrayEach(['initial', 'tail'], function(methodName, index) {
  var dropName = 'drop' + (index ? '' : 'Right');

  LazyWrapper.prototype[methodName] = function() {
    return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
  };
});

LazyWrapper.prototype.compact = function() {
  return this.filter(identity);
};

LazyWrapper.prototype.find = function(predicate) {
  return this.filter(predicate).head();
};

LazyWrapper.prototype.findLast = function(predicate) {
  return this.reverse().find(predicate);
};

LazyWrapper.prototype.invokeMap = baseRest(function(path, args) {
  if (typeof path == 'function') {
    return new LazyWrapper(this);
  }
  return this.map(function(value) {
    return baseInvoke(value, path, args);
  });
});

LazyWrapper.prototype.reject = function(predicate) {
  return this.filter(negate(baseIteratee(predicate)));
};

LazyWrapper.prototype.slice = function(start, end) {
  start = toInteger(start);

  var result = this;
  if (result.__filtered__ && (start > 0 || end < 0)) {
    return new LazyWrapper(result);
  }
  if (start < 0) {
    result = result.takeRight(-start);
  } else if (start) {
    result = result.drop(start);
  }
  if (end !== undefined) {
    end = toInteger(end);
    result = end < 0 ? result.dropRight(-end) : result.take(end - start);
  }
  return result;
};

LazyWrapper.prototype.takeRightWhile = function(predicate) {
  return this.reverse().takeWhile(predicate).reverse();
};

LazyWrapper.prototype.toArray = function() {
  return this.take(MAX_ARRAY_LENGTH$6);
};

// Add `LazyWrapper` methods to `lodash.prototype`.
baseForOwn(LazyWrapper.prototype, function(func, methodName) {
  var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName),
      isTaker = /^(?:head|last)$/.test(methodName),
      lodashFunc = lodash[isTaker ? ('take' + (methodName == 'last' ? 'Right' : '')) : methodName],
      retUnwrapped = isTaker || /^find/.test(methodName);

  if (!lodashFunc) {
    return;
  }
  lodash.prototype[methodName] = function() {
    var value = this.__wrapped__,
        args = isTaker ? [1] : arguments,
        isLazy = value instanceof LazyWrapper,
        iteratee = args[0],
        useLazy = isLazy || isArray(value);

    var interceptor = function(value) {
      var result = lodashFunc.apply(lodash, arrayPush([value], args));
      return (isTaker && chainAll) ? result[0] : result;
    };

    if (useLazy && checkIteratee && typeof iteratee == 'function' && iteratee.length != 1) {
      // Avoid lazy use if the iteratee has a "length" value other than `1`.
      isLazy = useLazy = false;
    }
    var chainAll = this.__chain__,
        isHybrid = !!this.__actions__.length,
        isUnwrapped = retUnwrapped && !chainAll,
        onlyLazy = isLazy && !isHybrid;

    if (!retUnwrapped && useLazy) {
      value = onlyLazy ? value : new LazyWrapper(this);
      var result = func.apply(value, args);
      result.__actions__.push({ 'func': thru, 'args': [interceptor], 'thisArg': undefined });
      return new LodashWrapper(result, chainAll);
    }
    if (isUnwrapped && onlyLazy) {
      return func.apply(this, args);
    }
    result = this.thru(interceptor);
    return isUnwrapped ? (isTaker ? result.value()[0] : result.value()) : result;
  };
});

// Add `Array` methods to `lodash.prototype`.
arrayEach(['pop', 'push', 'shift', 'sort', 'splice', 'unshift'], function(methodName) {
  var func = arrayProto$5[methodName],
      chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',
      retUnwrapped = /^(?:pop|shift)$/.test(methodName);

  lodash.prototype[methodName] = function() {
    var args = arguments;
    if (retUnwrapped && !this.__chain__) {
      var value = this.value();
      return func.apply(isArray(value) ? value : [], args);
    }
    return this[chainName](function(value) {
      return func.apply(isArray(value) ? value : [], args);
    });
  };
});

// Map minified method names to their real names.
baseForOwn(LazyWrapper.prototype, function(func, methodName) {
  var lodashFunc = lodash[methodName];
  if (lodashFunc) {
    var key = (lodashFunc.name + ''),
        names = realNames[key] || (realNames[key] = []);

    names.push({ 'name': methodName, 'func': lodashFunc });
  }
});

realNames[createHybrid(undefined, WRAP_BIND_KEY_FLAG$6).name] = [{
  'name': 'wrapper',
  'func': undefined
}];

// Add methods to `LazyWrapper`.
LazyWrapper.prototype.clone = lazyClone;
LazyWrapper.prototype.reverse = lazyReverse;
LazyWrapper.prototype.value = lazyValue;

// Add chain sequence methods to the `lodash` wrapper.
lodash.prototype.at = seq.at;
lodash.prototype.chain = seq.wrapperChain;
lodash.prototype.commit = seq.commit;
lodash.prototype.next = seq.next;
lodash.prototype.plant = seq.plant;
lodash.prototype.reverse = seq.reverse;
lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = seq.value;

// Add lazy aliases.
lodash.prototype.first = lodash.prototype.head;

if (symIterator$1) {
  lodash.prototype[symIterator$1] = seq.toIterator;
}

/**
 * The default settings.
 *
 * @type {Object}
 */
const DEFAULT_SETTINGS = {
    allow_accents: false,
    case_transform: 'CAPITALISE',
    character_substitutions: {},
    num_words: 3,
    padding_character: 'RANDOM',
    padding_characters_before: 2,
    padding_characters_after: 2,
    padding_digits_before: 2,
    padding_digits_after: 2,
    padding_type: 'FIXED',
    separator_character: 'RANDOM',
    symbol_alphabet: ['!', '@', '$', '%', '^', '&', '*', '-', '_', '+', '=', ':', '|', '~', '?', '/', '.', ';'],
    word_length_min: 4,
    word_length_max: 8
};

/**
 * An HSXKPAsswd Config.
 */
class Config{
    /**
     * Assert that a given value is a valid alphabet. I.e. if a given value is an array consisting of one or more single-character strings.
     *
     * A Type Error is thrown if the value is not valid.
     *
     * @param {*} val - The value to test
     * @return {boolean} Always returns `true`.
     * @throws {TypeError} A Type Error is thrown if the value is not a valid alphabet.
     */
    static assertAlphabet(val){
        if(is.not.array(val)) throw new TypeError('alphabet must be an array');
        if(val.length < 1) throw new TypeError('alphabet must contain at least one character');
        if(!is.all.string(val)) throw new TypeError('alphabet contains a value that is not a string');
        for(const i of val){
            if(i.length !== 1) throw new TypeError('alphabet contains a string that is not exactly one character long');
        }
        return true;
    }
    
    /**
     * Assert that a given object defines a valid case transformation configuration. Invalid values will result in a Type Error.
     *
     * The object must provide the key `case_transform` with one of the following valid values; `ALTERNATE`, `CAPITALISE`, `INVERT`, `LOWER`, `NONE`, `RANDOM`, or `UPPER`.
     *
     * @param {*} conf - The value to test.
     * @return {boolean} - Always returns `true`.
     * @throws {TypeError} A TypeError is thrown if the passed object does not define a valid case transformation configuration.
     */
    static assertCaseTransformation(conf){
        if(is.not.object(conf)) throw new TypeError('config must be an object');
        if(is.not.string(conf.case_transform)){
            throw new TypeError('case_transform must be a string');
        }
        if(!conf.case_transform.match(/^(ALTERNATE)|(CAPITALISE)|(INVERT)|(LOWER)|(NONE)|(RANDOM)|(UPPER)$/)){
            throw new TypeError('invalid case_transform');
        }
        return true;
    }
    
    /**
     * Assert that a given object defines a valid padding character configuration. Invalid values will result in a Type Error.
     *
     * The object must provide the key `padding_type`. The minimum valid configuation is `{ padding_type: 'NONE' }`.
     *
     * For all padding types other than `NONE` `padding_character` is also required.
     *
     * For `padding_type='FIXED'` both `padding_characters_before` & `padding_characters_after` are required.
     *
     * For `padding_type='ADAPTIVE'` `pad_to_length` is required.
     *
     * For `padding_character='RANDOM'` one of `padding_alphabet` or `symbol_alphabet` is required.
     *
     * @param {*} conf - The value to test.
     * @return {boolean} - Always returns `true`.
     * @throws {TypeError} A TypeError is thrown if the passed object does not define a valid padding configuration.
     */
    static assertPaddingCharacters(conf){
        // make sure we have an object that defines a padding type
        if(is.not.object(conf)) throw new TypeError('config must be an object');
        if(is.not.string(conf.padding_type)){
            throw new TypeError('padding_type must be a string');
        }
        
        // short-circuit no padding
        if(conf.padding_type === 'NONE') return true;
        
        // make sure we have the keys needed to determine the padding character to use
        if(is.not.string(conf.padding_character)) throw new TypeError('padding_character must be a string');
        if(conf.padding_character === 'RANDOM'){
            if(!(this.isAlphabet(conf.padding_alphabet) || this.isAlphabet(conf.symbol_alphabet))){
                throw new TypeError('padding_character is RANDOM but neither padding_alphabet nor symbol_alphabet are defined');
            }
        }else if(conf.padding_character === 'SEPARATOR');else{
            if(conf.padding_character.length !== 1) throw new TypeError('invalid padding_character');
        }
        
        // make sure we have the keys needed to determine what the amount of padding to apply
        if(conf.padding_type === 'FIXED'){
            if(is.not.integer(conf.padding_characters_before) || is.negative(conf.padding_characters_before)){
                throw new TypeError('padding_characters_before must be an integer greater than or equal to zero');
            }
            if(is.not.integer(conf.padding_characters_after) || is.negative(conf.padding_characters_after)){
                throw new TypeError('padding_characters_after must be an integer greater than or equal to zero');
            }
        }else if(conf.padding_type === 'ADAPTIVE'){
            if(is.not.integer(conf.pad_to_length) || is.under(conf.pad_to_length, 12)){
                throw new TypeError('invalid pad_to_length, must be an integer greater than or equal to 12');
            }
        }else{
            throw new TypeError("invalid padding_type, must be one of 'NONE', 'FIXED', or 'ADAPTIVE'");
        }
        
        // if we got here all is well
        return true;
    }
    
    /**
     * Assert that a given object defines a valid padding digit configuration. Invalid values will result in a Type Error.
     *
     * The object must provide the keys `padding_digits_before` & `padding_digits_after`.
     *
     * @param {*} conf - The value to test.
     * @return {boolean} - Always returns `true`.
     * @throws {TypeError} A TypeError is thrown if the passed object does not define a valid padding configuration.
     */
    static assertPaddingDigits(conf){
        // make sure we have an object
        if(is.not.object(conf)) throw new TypeError('config must be an object');
        
        // make sure we have valid values for both required keys
        if(is.not.integer(conf.padding_digits_before) || is.negative(conf.padding_digits_before)){
            throw new TypeError('padding_digits_before must be an integer greater than or equal to zero');
        }
        if(is.not.integer(conf.padding_digits_after) || is.negative(conf.padding_digits_after)){
            throw new TypeError('padding_digits_after must be an integer greater than or equal to zero');
        }
        
        // if we got here all is well
        return true;
    }
    
    /**
     * Assert that a given object defines a valid padding configuration. Invalid values will result in a Type Error.
     *
     * The object must provide the key `separator_character`.
     *
     * For `separator_character='RANDOM'` one of `separator_alphabet` or `symbol_alphabet` is required.
     *
     * @param {*} conf - The value to test.
     * @return {boolean} - Always returns `true`.
     * @throws {TypeError} A TypeError is thrown if the passed object does not define a valid padding configuration.
     */
    static assertSeparator(conf){
        // make sure we have an object that defines a padding type
        if(is.not.object(conf)) throw new TypeError('config must be an object');
        if(is.not.string(conf.separator_character)){
            throw new TypeError('separator_character must be a string');
        }
        
        // deal with each possible separator character
        if(conf.separator_character === 'NONE'){
            return true;
        }else if(conf.separator_character === 'RANDOM'){
            if(this.isAlphabet(conf.separator_alphabet) || this.isAlphabet(conf.symbol_alphabet)){
                return true;
            }else{
                throw new TypeError('separator_character is RANDOM, but neither separator_alphabet nor symbol_alphabet are defined');
            }
        }else if(conf.separator_character.length === 1){
            return true;
        }
        
        // if we got here the separator character is not valid!
        throw new TypeError("invalid separator_character, must be a single character or one of 'NONE' or 'RANDOM'");
    }
    
    /**
     * Test if a given value is an object that defines the config keys needed to specify case transformations.
     *
     * @param {*} val - The value to test.
     * @return {boolean}
     */
    static definesCaseTransformation(val){
        try{
            this.assertCaseTransformation(val);
        }catch(err){
            return false;
        }
        return true;
    }
    
    /**
     * Test if a given value is an object that defines the config keys needed to specify password character padding.
     *
     * @param {*} val - The value to test.
     * @return {boolean}
     */
    static definesPaddingCharacters(val){
        try{
            this.assertPaddingCharacters(val);
        }catch(err){
            return false;
        }
        return true;
    }
    
    /**
     * Test if a given value is an object that defines the config keys needed to specify password digit padding.
     *
     * @param {*} val - The value to test.
     * @return {boolean}
     */
    static definesPaddingDigits(val){
        try{
            this.assertPaddingDigits(val);
        }catch(err){
            return false;
        }
        return true;
    }
    
    /**
     * Test if a given value is an object that defines the config keys needed to specify a separatpor.
     *
     * @param {*} val - The value to test.
     * @return {boolean}
     */
    static definesSeparator(val){
        try{
            this.assertSeparator(val);
        }catch(err){
            return false;
        }
        return true;
    }
    
    /**
     * Test if a given value is a valid alphabet. I.e. if a given value is an array consisting of one or more single-character strings.
     *
     * @param {*} val - The value to test
     * @return {boolean}
     */
    static isAlphabet(val){
        try{
            this.assertAlphabet(val);
        }catch(err){
            return false;
        }
        return true;
    }
    
    /**
     * @param {Object} [settings] - The config settings. If no object is passed the default settings are used.
     * @throws {TypeError} - A type error is thrown if invalid args are passed.
     * @todo Validate settings
     */
    constructor(settings){
        if(is.undefined(settings)){
            this._settings = lodash.cloneDeep(DEFAULT_SETTINGS);
        }else if(is.object(settings)){
            this._settings = lodash.cloneDeep(settings);
        }else{
            throw new TypeError('settings must be a plain object');
        }
    }
    
    /**
     * @type {Object}
     */
    get all(){
        return {
            allow_accents: this.allow_accents,
            case_transform: this.case_transform,
            character_substitutions: this.character_substitutions,
            num_words: this.num_words,
            pad_to_length: this.pad_to_length,
            padding_alphabet: this.padding_alphabet,
            padding_character: this.padding_character,
            padding_characters_before: this.padding_characters_before,
            padding_characters_after: this.padding_characters_after,
            padding_digits_before: this.padding_digits_before,
            padding_digits_after: this.padding_digits_after,
            padding_type: this.padding_type,
            separator_alphabet: this.separator_alphabet,
            separator_character: this.separator_character,
            symbol_alphabet: this.symbol_alphabet,
            word_length_min: this.word_length_min,
            word_length_max: this.word_length_max
        };
    }
    
    /**
     * @type {boolean}
     */
    get allow_accents(){
        return this._settings.allow_accents ? true : false;
    }
    get allowAccents(){ return this.allow_accents; }
    
    /**
     * @type {string}
     */
    get case_transform(){
        return this._settings.case_transform;
    }
    get caseTransform(){ return this.case_transform; }
    
    /**
     * @type {Object}
     */
    get character_substitutions(){
        if(is.object(this._settings.character_substitutions)){
            return lodash.cloneDeep(this._settings.character_substitutions);
        }
        return {};
    }
    get characterSubstitutions(){ return this.character_substitutions; }
    
    /**
     * @type {number}
     */
    get num_words(){
        return this._settings.num_words;
    }
    get numWords(){ return this._settings.num_words; }
    
    /**
     * @type {number}
     */
    get pad_to_length(){
        return this._settings.pad_to_length || 12;
    }
    get padToLength(){ return this.pad_to_length; }
    
    /**
     * @type {String[]}
     */
    get padding_alphabet(){
        if(is.array(this._settings.padding_alphabet)){
            return lodash.clone(this._settings.padding_alphabet);
        }
        return [];
    }
    get paddingAlphabet(){ return this.padding_alphabet; }
    
    /**
     * @type {String}
     */
    get padding_character(){
        return this._settings.padding_character || '';
    }
    get paddingCharacter(){ return this.padding_character; }
    
    /**
     * @type {number}
     */
    get padding_characters_before(){
        return this._settings.padding_characters_before || 0;
    }
    get paddingCharactersBefore(){ return this.padding_characters_before; }
    
    /**
     * @type {number}
     */
    get padding_characters_after(){
        return this._settings.padding_characters_after || 0;
    }
    get paddingCharactersAfter(){ return this.padding_characters_after; }
    
    /**
     * @type {number}
     */
    get padding_digits_before(){
        return this._settings.padding_digits_before || 0;
    }
    get paddingDigitsBefore(){ return this.padding_digits_before; };
    
    /**
     * @type {number}
     */
    get padding_digits_after(){
        return this._settings.padding_digits_after || 0;
    }
    get paddingDigitsAfter(){ return this.padding_digits_after; }
    
    /**
     * @type {String}
     */
    get padding_type(){
        return this._settings.padding_type;
    }
    get paddingType(){ return this.padding_type; }
    
    /**
     * @type {String[]}
     */
    get separator_alphabet(){
        if(is.array(this._settings.separator_alphabet)){
            return lodash.clone(this._settings.separator_alphabet);
        }
        return [];
    }
    get separatorAlphabet(){ return this.separator_alphabet; }
    
    /**
     * @type {String}
     */
    get separator_character(){
        return this._settings.separator_character;
    }
    get separatorCharacter(){ return this.separator_character; }
    
    /**
     * @type {String[]}
     */
    get symbol_alphabet(){
        if(is.array(this._settings.symbol_alphabet)){
            return lodash.clone(this._settings.symbol_alphabet);
        }
        return [];
    }
    
    /**
     * @type {number}
     */
    get word_length_min(){
        return this._settings.word_length_min;
    }
    get wordLengthMin(){ return this.word_length_min; }
    
    /**
     * @type {number}
     */
    get word_length_max(){
        return this._settings.word_length_max;
    }
    get wordLengthMax(){ return this.word_length_max; }
}

var remove$1 = removeDiacritics;

var replacementList = [
  {
    base: ' ',
    chars: "\u00A0",
  }, {
    base: '0',
    chars: "\u07C0",
  }, {
    base: 'A',
    chars: "\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F",
  }, {
    base: 'AA',
    chars: "\uA732",
  }, {
    base: 'AE',
    chars: "\u00C6\u01FC\u01E2",
  }, {
    base: 'AO',
    chars: "\uA734",
  }, {
    base: 'AU',
    chars: "\uA736",
  }, {
    base: 'AV',
    chars: "\uA738\uA73A",
  }, {
    base: 'AY',
    chars: "\uA73C",
  }, {
    base: 'B',
    chars: "\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0181",
  }, {
    base: 'C',
    chars: "\u24b8\uff23\uA73E\u1E08\u0106\u0043\u0108\u010A\u010C\u00C7\u0187\u023B",
  }, {
    base: 'D',
    chars: "\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018A\u0189\u1D05\uA779",
  }, {
    base: 'Dh',
    chars: "\u00D0",
  }, {
    base: 'DZ',
    chars: "\u01F1\u01C4",
  }, {
    base: 'Dz',
    chars: "\u01F2\u01C5",
  }, {
    base: 'E',
    chars: "\u025B\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E\u1D07",
  }, {
    base: 'F',
    chars: "\uA77C\u24BB\uFF26\u1E1E\u0191\uA77B",
  }, {
    base: 'G',
    chars: "\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E\u0262",
  }, {
    base: 'H',
    chars: "\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D",
  }, {
    base: 'I',
    chars: "\u24BE\uFF29\xCC\xCD\xCE\u0128\u012A\u012C\u0130\xCF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197",
  }, {
    base: 'J',
    chars: "\u24BF\uFF2A\u0134\u0248\u0237",
  }, {
    base: 'K',
    chars: "\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2",
  }, {
    base: 'L',
    chars: "\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780",
  }, {
    base: 'LJ',
    chars: "\u01C7",
  }, {
    base: 'Lj',
    chars: "\u01C8",
  }, {
    base: 'M',
    chars: "\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C\u03FB",
  }, {
    base: 'N',
    chars: "\uA7A4\u0220\u24C3\uFF2E\u01F8\u0143\xD1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u019D\uA790\u1D0E",
  }, {
    base: 'NJ',
    chars: "\u01CA",
  }, {
    base: 'Nj',
    chars: "\u01CB",
  }, {
    base: 'O',
    chars: "\u24C4\uFF2F\xD2\xD3\xD4\u1ED2\u1ED0\u1ED6\u1ED4\xD5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\xD6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\xD8\u01FE\u0186\u019F\uA74A\uA74C",
  }, {
    base: 'OE',
    chars: "\u0152",
  }, {
    base: 'OI',
    chars: "\u01A2",
  }, {
    base: 'OO',
    chars: "\uA74E",
  }, {
    base: 'OU',
    chars: "\u0222",
  }, {
    base: 'P',
    chars: "\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754",
  }, {
    base: 'Q',
    chars: "\u24C6\uFF31\uA756\uA758\u024A",
  }, {
    base: 'R',
    chars: "\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782",
  }, {
    base: 'S',
    chars: "\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784",
  }, {
    base: 'T',
    chars: "\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786",
  }, {
    base: 'Th',
    chars: "\u00DE",
  }, {
    base: 'TZ',
    chars: "\uA728",
  }, {
    base: 'U',
    chars: "\u24CA\uFF35\xD9\xDA\xDB\u0168\u1E78\u016A\u1E7A\u016C\xDC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244",
  }, {
    base: 'V',
    chars: "\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245",
  }, {
    base: 'VY',
    chars: "\uA760",
  }, {
    base: 'W',
    chars: "\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72",
  }, {
    base: 'X',
    chars: "\u24CD\uFF38\u1E8A\u1E8C",
  }, {
    base: 'Y',
    chars: "\u24CE\uFF39\u1EF2\xDD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE",
  }, {
    base: 'Z',
    chars: "\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762",
  }, {
    base: 'a',
    chars: "\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250\u0251",
  }, {
    base: 'aa',
    chars: "\uA733",
  }, {
    base: 'ae',
    chars: "\u00E6\u01FD\u01E3",
  }, {
    base: 'ao',
    chars: "\uA735",
  }, {
    base: 'au',
    chars: "\uA737",
  }, {
    base: 'av',
    chars: "\uA739\uA73B",
  }, {
    base: 'ay',
    chars: "\uA73D",
  }, {
    base: 'b',
    chars: "\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253\u0182",
  }, {
    base: 'c',
    chars: "\uFF43\u24D2\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184",
  }, {
    base: 'd',
    chars: "\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\u018B\u13E7\u0501\uA7AA",
  }, {
    base: 'dh',
    chars: "\u00F0",
  }, {
    base: 'dz',
    chars: "\u01F3\u01C6",
  }, {
    base: 'e',
    chars: "\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u01DD",
  }, {
    base: 'f',
    chars: "\u24D5\uFF46\u1E1F\u0192",
  }, {
    base: 'ff',
    chars: "\uFB00",
  }, {
    base: 'fi',
    chars: "\uFB01",
  }, {
    base: 'fl',
    chars: "\uFB02",
  }, {
    base: 'ffi',
    chars: "\uFB03",
  }, {
    base: 'ffl',
    chars: "\uFB04",
  }, {
    base: 'g',
    chars: "\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\uA77F\u1D79",
  }, {
    base: 'h',
    chars: "\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265",
  }, {
    base: 'hv',
    chars: "\u0195",
  }, {
    base: 'i',
    chars: "\u24D8\uFF49\xEC\xED\xEE\u0129\u012B\u012D\xEF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131",
  }, {
    base: 'j',
    chars: "\u24D9\uFF4A\u0135\u01F0\u0249",
  }, {
    base: 'k',
    chars: "\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3",
  }, {
    base: 'l',
    chars: "\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747\u026D",
  }, {
    base: 'lj',
    chars: "\u01C9",
  }, {
    base: 'm',
    chars: "\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F",
  }, {
    base: 'n',
    chars: "\u24DD\uFF4E\u01F9\u0144\xF1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5\u043B\u0509",
  }, {
    base: 'nj',
    chars: "\u01CC",
  }, {
    base: 'o',
    chars: "\u24DE\uFF4F\xF2\xF3\xF4\u1ED3\u1ED1\u1ED7\u1ED5\xF5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\xF6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\xF8\u01FF\uA74B\uA74D\u0275\u0254\u1D11",
  }, {
    base: 'oe',
    chars: "\u0153",
  }, {
    base: 'oi',
    chars: "\u01A3",
  }, {
    base: 'oo',
    chars: "\uA74F",
  }, {
    base: 'ou',
    chars: "\u0223",
  }, {
    base: 'p',
    chars: "\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755\u03C1",
  }, {
    base: 'q',
    chars: "\u24E0\uFF51\u024B\uA757\uA759",
  }, {
    base: 'r',
    chars: "\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783",
  }, {
    base: 's',
    chars: "\u24E2\uFF53\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B\u0282",
  }, {
    base: 'ss',
    chars: "\xDF",
  }, {
    base: 't',
    chars: "\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787",
  }, {
    base: 'th',
    chars: "\u00FE",
  }, {
    base: 'tz',
    chars: "\uA729",
  }, {
    base: 'u',
    chars: "\u24E4\uFF55\xF9\xFA\xFB\u0169\u1E79\u016B\u1E7B\u016D\xFC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289",
  }, {
    base: 'v',
    chars: "\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C",
  }, {
    base: 'vy',
    chars: "\uA761",
  }, {
    base: 'w',
    chars: "\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73",
  }, {
    base: 'x',
    chars: "\u24E7\uFF58\u1E8B\u1E8D",
  }, {
    base: 'y',
    chars: "\u24E8\uFF59\u1EF3\xFD\u0177\u1EF9\u0233\u1E8F\xFF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF",
  }, {
    base: 'z',
    chars: "\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763",
  }
];

var diacriticsMap = {};
for (var i = 0; i < replacementList.length; i += 1) {
  var chars = replacementList[i].chars;
  for (var j = 0; j < chars.length; j += 1) {
    diacriticsMap[chars[j]] = replacementList[i].base;
  }
}

function removeDiacritics(str) {
  return str.replace(/[^\u0000-\u007e]/g, function(c) {
    return diacriticsMap[c] || c;
  });
}

var replacementList_1 = replacementList;
var diacriticsMap_1 = diacriticsMap;

var diacritics = {
	remove: remove$1,
	replacementList: replacementList_1,
	diacriticsMap: diacriticsMap_1
};

var interopRequireDefault = createCommonjsModule(function (module) {
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;
});

unwrapExports(interopRequireDefault);

var _global = createCommonjsModule(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var _core = createCommonjsModule(function (module) {
var core = module.exports = { version: '2.6.9' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});
var _core_1 = _core.version;

var _aFunction = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding

var _ctx = function (fn, that, length) {
  _aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var _isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var _anObject = function (it) {
  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors = !_fails(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

var document = _global.document;
// typeof document.createElement is 'object' in old IE
var is$1 = _isObject(document) && _isObject(document.createElement);
var _domCreate = function (it) {
  return is$1 ? document.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function () {
  return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])

// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive = function (it, S) {
  if (!_isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP = Object.defineProperty;

var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  _anObject(O);
  P = _toPrimitive(P, true);
  _anObject(Attributes);
  if (_ie8DomDefine) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var _objectDp = {
	f: f
};

var _propertyDesc = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var _hide = _descriptors ? function (object, key, value) {
  return _objectDp.f(object, key, _propertyDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var hasOwnProperty$o = {}.hasOwnProperty;
var _has = function (it, key) {
  return hasOwnProperty$o.call(it, key);
};

var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] : (_global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && _has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? _ctx(out, _global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) _hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
var _export = $export;

var toString$1 = {}.toString;

var _cof = function (it) {
  return toString$1.call(it).slice(8, -1);
};

// fallback for non-array-like ES3 and non-enumerable old V8 strings

// eslint-disable-next-line no-prototype-builtins
var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return _cof(it) == 'String' ? it.split('') : Object(it);
};

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

// to indexed object, toObject with fallback for non-array-like ES3 strings


var _toIobject = function (it) {
  return _iobject(_defined(it));
};

// 7.1.4 ToInteger
var ceil$1 = Math.ceil;
var floor$1 = Math.floor;
var _toInteger = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor$1 : ceil$1)(it);
};

// 7.1.15 ToLength

var min$1 = Math.min;
var _toLength = function (it) {
  return it > 0 ? min$1(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

var max$1 = Math.max;
var min$2 = Math.min;
var _toAbsoluteIndex = function (index, length) {
  index = _toInteger(index);
  return index < 0 ? max$1(index + length, 0) : min$2(index, length);
};

// false -> Array#indexOf
// true  -> Array#includes



var _arrayIncludes = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = _toIobject($this);
    var length = _toLength(O.length);
    var index = _toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var _shared = createCommonjsModule(function (module) {
var SHARED = '__core-js_shared__';
var store = _global[SHARED] || (_global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: _core.version,
  mode: 'pure',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});
});

var id = 0;
var px = Math.random();
var _uid = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var shared = _shared('keys');

var _sharedKey = function (key) {
  return shared[key] || (shared[key] = _uid(key));
};

var arrayIndexOf = _arrayIncludes(false);
var IE_PROTO = _sharedKey('IE_PROTO');

var _objectKeysInternal = function (object, names) {
  var O = _toIobject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (_has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

// 19.1.2.14 / 15.2.3.14 Object.keys(O)



var _objectKeys = Object.keys || function keys(O) {
  return _objectKeysInternal(O, _enumBugKeys);
};

var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
  _anObject(O);
  var keys = _objectKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) _objectDp.f(O, P = keys[i++], Properties[P]);
  return O;
};

var document$1 = _global.document;
var _html = document$1 && document$1.documentElement;

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])



var IE_PROTO$1 = _sharedKey('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE$1 = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = _domCreate('iframe');
  var i = _enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  _html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE$1][_enumBugKeys[i]];
  return createDict();
};

var _objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE$1] = _anObject(O);
    result = new Empty();
    Empty[PROTOTYPE$1] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO$1] = O;
  } else result = createDict();
  return Properties === undefined ? result : _objectDps(result, Properties);
};

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
_export(_export.S, 'Object', { create: _objectCreate });

var $Object = _core.Object;
var create$1 = function create(P, D) {
  return $Object.create(P, D);
};

var create$2 = create$1;

// 7.2.2 IsArray(argument)

var _isArray = Array.isArray || function isArray(arg) {
  return _cof(arg) == 'Array';
};

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)


_export(_export.S, 'Array', { isArray: _isArray });

var isArray$1 = _core.Array.isArray;

var isArray$2 = isArray$1;

function _arrayWithHoles(arr) {
  if (isArray$2(arr)) return arr;
}

var arrayWithHoles = _arrayWithHoles;

var _iterStep = function (done, value) {
  return { value: value, done: !!done };
};

var _iterators = {};

var _redefine = _hide;

var _wks = createCommonjsModule(function (module) {
var store = _shared('wks');

var Symbol = _global.Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
};

$exports.store = store;
});

var def = _objectDp.f;

var TAG = _wks('toStringTag');

var _setToStringTag = function (it, tag, stat) {
  if (it && !_has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_hide(IteratorPrototype, _wks('iterator'), function () { return this; });

var _iterCreate = function (Constructor, NAME, next) {
  Constructor.prototype = _objectCreate(IteratorPrototype, { next: _propertyDesc(1, next) });
  _setToStringTag(Constructor, NAME + ' Iterator');
};

// 7.1.13 ToObject(argument)

var _toObject = function (it) {
  return Object(_defined(it));
};

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)


var IE_PROTO$2 = _sharedKey('IE_PROTO');
var ObjectProto = Object.prototype;

var _objectGpo = Object.getPrototypeOf || function (O) {
  O = _toObject(O);
  if (_has(O, IE_PROTO$2)) return O[IE_PROTO$2];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

var ITERATOR = _wks('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

var _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  _iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = _objectGpo($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      _setToStringTag(IteratorPrototype, TAG, true);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    _hide(proto, ITERATOR, $default);
  }
  // Plug for library
  _iterators[NAME] = $default;
  _iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) _redefine(proto, key, methods[key]);
    } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
var es6_array_iterator = _iterDefine(Array, 'Array', function (iterated, kind) {
  this._t = _toIobject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return _iterStep(1);
  }
  if (kind == 'keys') return _iterStep(0, index);
  if (kind == 'values') return _iterStep(0, O[index]);
  return _iterStep(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
_iterators.Arguments = _iterators.Array;

var TO_STRING_TAG = _wks('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i$1 = 0; i$1 < DOMIterables.length; i$1++) {
  var NAME = DOMIterables[i$1];
  var Collection = _global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) _hide(proto, TO_STRING_TAG, NAME);
  _iterators[NAME] = _iterators.Array;
}

// true  -> String#at
// false -> String#codePointAt
var _stringAt = function (TO_STRING) {
  return function (that, pos) {
    var s = String(_defined(that));
    var i = _toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

var $at = _stringAt(true);

// 21.1.3.27 String.prototype[@@iterator]()
_iterDefine(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

// getting tag from 19.1.3.6 Object.prototype.toString()

var TAG$1 = _wks('toStringTag');
// ES3 wrong here
var ARG = _cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

var _classof = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T
    // builtinTag case
    : ARG ? _cof(O)
    // ES3 arguments fallback
    : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

var ITERATOR$1 = _wks('iterator');

var core_getIteratorMethod = _core.getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR$1]
    || it['@@iterator']
    || _iterators[_classof(it)];
};

var core_getIterator = _core.getIterator = function (it) {
  var iterFn = core_getIteratorMethod(it);
  if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
  return _anObject(iterFn.call(it));
};

var getIterator = core_getIterator;

var getIterator$1 = getIterator;

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = getIterator$1(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

var iterableToArrayLimit = _iterableToArrayLimit;

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var nonIterableRest = _nonIterableRest;

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || nonIterableRest();
}

var slicedToArray = _slicedToArray;

var _stringWs = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

var space = '[' + _stringWs + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = _fails(function () {
    return !!_stringWs[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim$1) : _stringWs[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  _export(_export.P + _export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim$1 = exporter.trim = function (string, TYPE) {
  string = String(_defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

var _stringTrim = exporter;

var $parseInt = _global.parseInt;
var $trim = _stringTrim.trim;

var hex = /^[-+]?0[xX]/;

var _parseInt = $parseInt(_stringWs + '08') !== 8 || $parseInt(_stringWs + '0x16') !== 22 ? function parseInt(str, radix) {
  var string = $trim(String(str), 3);
  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
} : $parseInt;

// 18.2.5 parseInt(string, radix)
_export(_export.G + _export.F * (parseInt != _parseInt), { parseInt: _parseInt });

var _parseInt$1 = _core.parseInt;

var _parseInt$2 = _parseInt$1;

var xregexp = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _create = interopRequireDefault(create$2);

var _slicedToArray2 = interopRequireDefault(slicedToArray);

var _getIterator2 = interopRequireDefault(getIterator$1);

var _parseInt2 = interopRequireDefault(_parseInt$2);

/*!
 * XRegExp 4.2.4
 * <xregexp.com>
 * Steven Levithan (c) 2007-present MIT License
 */

/**
 * XRegExp provides augmented, extensible regular expressions. You get additional regex syntax and
 * flags, beyond what browsers support natively. XRegExp is also a regex utility belt with tools to
 * make your client-side grepping simpler and more powerful, while freeing you from related
 * cross-browser inconsistencies.
 */
// ==--------------------------==
// Private stuff
// ==--------------------------==
// Property name used for extended regex instance data
var REGEX_DATA = 'xregexp'; // Optional features that can be installed and uninstalled

var features = {
  astral: false,
  namespacing: false
}; // Native methods to use and restore ('native' is an ES3 reserved keyword)

var nativ = {
  exec: RegExp.prototype.exec,
  test: RegExp.prototype.test,
  match: String.prototype.match,
  replace: String.prototype.replace,
  split: String.prototype.split
}; // Storage for fixed/extended native methods

var fixed = {}; // Storage for regexes cached by `XRegExp.cache`

var regexCache = {}; // Storage for pattern details cached by the `XRegExp` constructor

var patternCache = {}; // Storage for regex syntax tokens added internally or by `XRegExp.addToken`

var tokens = []; // Token scopes

var defaultScope = 'default';
var classScope = 'class'; // Regexes that match native regex syntax, including octals

var nativeTokens = {
  // Any native multicharacter token in default scope, or any single character
  'default': /\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9]\d*|x[\dA-Fa-f]{2}|u(?:[\dA-Fa-f]{4}|{[\dA-Fa-f]+})|c[A-Za-z]|[\s\S])|\(\?(?:[:=!]|<[=!])|[?*+]\?|{\d+(?:,\d*)?}\??|[\s\S]/,
  // Any native multicharacter token in character class scope, or any single character
  'class': /\\(?:[0-3][0-7]{0,2}|[4-7][0-7]?|x[\dA-Fa-f]{2}|u(?:[\dA-Fa-f]{4}|{[\dA-Fa-f]+})|c[A-Za-z]|[\s\S])|[\s\S]/
}; // Any backreference or dollar-prefixed character in replacement strings

var replacementToken = /\$(?:{([\w$]+)}|<([\w$]+)>|(\d\d?|[\s\S]))/g; // Check for correct `exec` handling of nonparticipating capturing groups

var correctExecNpcg = nativ.exec.call(/()??/, '')[1] === undefined; // Check for ES6 `flags` prop support

var hasFlagsProp = /x/.flags !== undefined; // Shortcut to `Object.prototype.toString`

var _ref = {},
    toString = _ref.toString;

function hasNativeFlag(flag) {
  // Can't check based on the presence of properties/getters since browsers might support such
  // properties even when they don't support the corresponding flag in regex construction (tested
  // in Chrome 48, where `'unicode' in /x/` is true but trying to construct a regex with flag `u`
  // throws an error)
  var isSupported = true;

  try {
    // Can't use regex literals for testing even in a `try` because regex literals with
    // unsupported flags cause a compilation error in IE
    new RegExp('', flag);
  } catch (exception) {
    isSupported = false;
  }

  return isSupported;
} // Check for ES6 `u` flag support


var hasNativeU = hasNativeFlag('u'); // Check for ES6 `y` flag support

var hasNativeY = hasNativeFlag('y'); // Tracker for known flags, including addon flags

var registeredFlags = {
  g: true,
  i: true,
  m: true,
  u: hasNativeU,
  y: hasNativeY
};
/**
 * Attaches extended data and `XRegExp.prototype` properties to a regex object.
 *
 * @private
 * @param {RegExp} regex Regex to augment.
 * @param {Array} captureNames Array with capture names, or `null`.
 * @param {String} xSource XRegExp pattern used to generate `regex`, or `null` if N/A.
 * @param {String} xFlags XRegExp flags used to generate `regex`, or `null` if N/A.
 * @param {Boolean} [isInternalOnly=false] Whether the regex will be used only for internal
 *   operations, and never exposed to users. For internal-only regexes, we can improve perf by
 *   skipping some operations like attaching `XRegExp.prototype` properties.
 * @returns {RegExp} Augmented regex.
 */

function augment(regex, captureNames, xSource, xFlags, isInternalOnly) {
  regex[REGEX_DATA] = {
    captureNames: captureNames
  };

  if (isInternalOnly) {
    return regex;
  } // Can't auto-inherit these since the XRegExp constructor returns a nonprimitive value


  if (regex.__proto__) {
    regex.__proto__ = XRegExp.prototype;
  } else {
    for (var p in XRegExp.prototype) {
      // An `XRegExp.prototype.hasOwnProperty(p)` check wouldn't be worth it here, since this
      // is performance sensitive, and enumerable `Object.prototype` or `RegExp.prototype`
      // extensions exist on `regex.prototype` anyway
      regex[p] = XRegExp.prototype[p];
    }
  }

  regex[REGEX_DATA].source = xSource; // Emulate the ES6 `flags` prop by ensuring flags are in alphabetical order

  regex[REGEX_DATA].flags = xFlags ? xFlags.split('').sort().join('') : xFlags;
  return regex;
}
/**
 * Removes any duplicate characters from the provided string.
 *
 * @private
 * @param {String} str String to remove duplicate characters from.
 * @returns {String} String with any duplicate characters removed.
 */


function clipDuplicates(str) {
  return nativ.replace.call(str, /([\s\S])(?=[\s\S]*\1)/g, '');
}
/**
 * Copies a regex object while preserving extended data and augmenting with `XRegExp.prototype`
 * properties. The copy has a fresh `lastIndex` property (set to zero). Allows adding and removing
 * flags g and y while copying the regex.
 *
 * @private
 * @param {RegExp} regex Regex to copy.
 * @param {Object} [options] Options object with optional properties:
 *   - `addG` {Boolean} Add flag g while copying the regex.
 *   - `addY` {Boolean} Add flag y while copying the regex.
 *   - `removeG` {Boolean} Remove flag g while copying the regex.
 *   - `removeY` {Boolean} Remove flag y while copying the regex.
 *   - `isInternalOnly` {Boolean} Whether the copied regex will be used only for internal
 *     operations, and never exposed to users. For internal-only regexes, we can improve perf by
 *     skipping some operations like attaching `XRegExp.prototype` properties.
 *   - `source` {String} Overrides `<regex>.source`, for special cases.
 * @returns {RegExp} Copy of the provided regex, possibly with modified flags.
 */


function copyRegex(regex, options) {
  if (!XRegExp.isRegExp(regex)) {
    throw new TypeError('Type RegExp expected');
  }

  var xData = regex[REGEX_DATA] || {};
  var flags = getNativeFlags(regex);
  var flagsToAdd = '';
  var flagsToRemove = '';
  var xregexpSource = null;
  var xregexpFlags = null;
  options = options || {};

  if (options.removeG) {
    flagsToRemove += 'g';
  }

  if (options.removeY) {
    flagsToRemove += 'y';
  }

  if (flagsToRemove) {
    flags = nativ.replace.call(flags, new RegExp("[".concat(flagsToRemove, "]+"), 'g'), '');
  }

  if (options.addG) {
    flagsToAdd += 'g';
  }

  if (options.addY) {
    flagsToAdd += 'y';
  }

  if (flagsToAdd) {
    flags = clipDuplicates(flags + flagsToAdd);
  }

  if (!options.isInternalOnly) {
    if (xData.source !== undefined) {
      xregexpSource = xData.source;
    } // null or undefined; don't want to add to `flags` if the previous value was null, since
    // that indicates we're not tracking original precompilation flags


    if (xData.flags != null) {
      // Flags are only added for non-internal regexes by `XRegExp.globalize`. Flags are never
      // removed for non-internal regexes, so don't need to handle it
      xregexpFlags = flagsToAdd ? clipDuplicates(xData.flags + flagsToAdd) : xData.flags;
    }
  } // Augment with `XRegExp.prototype` properties, but use the native `RegExp` constructor to avoid
  // searching for special tokens. That would be wrong for regexes constructed by `RegExp`, and
  // unnecessary for regexes constructed by `XRegExp` because the regex has already undergone the
  // translation to native regex syntax


  regex = augment(new RegExp(options.source || regex.source, flags), hasNamedCapture(regex) ? xData.captureNames.slice(0) : null, xregexpSource, xregexpFlags, options.isInternalOnly);
  return regex;
}
/**
 * Converts hexadecimal to decimal.
 *
 * @private
 * @param {String} hex
 * @returns {Number}
 */


function dec(hex) {
  return (0, _parseInt2.default)(hex, 16);
}
/**
 * Returns a pattern that can be used in a native RegExp in place of an ignorable token such as an
 * inline comment or whitespace with flag x. This is used directly as a token handler function
 * passed to `XRegExp.addToken`.
 *
 * @private
 * @param {String} match Match arg of `XRegExp.addToken` handler
 * @param {String} scope Scope arg of `XRegExp.addToken` handler
 * @param {String} flags Flags arg of `XRegExp.addToken` handler
 * @returns {String} Either '' or '(?:)', depending on which is needed in the context of the match.
 */


function getContextualTokenSeparator(match, scope, flags) {
  if ( // No need to separate tokens if at the beginning or end of a group
  match.input[match.index - 1] === '(' || match.input[match.index + match[0].length] === ')' || // No need to separate tokens if before or after a `|`
  match.input[match.index - 1] === '|' || match.input[match.index + match[0].length] === '|' || // No need to separate tokens if at the beginning or end of the pattern
  match.index < 1 || match.index + match[0].length >= match.input.length || // No need to separate tokens if at the beginning of a noncapturing group or lookahead.
  // The way this is written relies on:
  // - The search regex matching only 3-char strings.
  // - Although `substr` gives chars from the end of the string if given a negative index,
  //   the resulting substring will be too short to match. Ex: `'abcd'.substr(-1, 3) === 'd'`
  nativ.test.call(/^\(\?[:=!]/, match.input.substr(match.index - 3, 3)) || // Avoid separating tokens when the following token is a quantifier
  isQuantifierNext(match.input, match.index + match[0].length, flags)) {
    return '';
  } // Keep tokens separated. This avoids e.g. inadvertedly changing `\1 1` or `\1(?#)1` to `\11`.
  // This also ensures all tokens remain as discrete atoms, e.g. it avoids converting the syntax
  // error `(? :` into `(?:`.


  return '(?:)';
}
/**
 * Returns native `RegExp` flags used by a regex object.
 *
 * @private
 * @param {RegExp} regex Regex to check.
 * @returns {String} Native flags in use.
 */


function getNativeFlags(regex) {
  return hasFlagsProp ? regex.flags : // Explicitly using `RegExp.prototype.toString` (rather than e.g. `String` or concatenation
  // with an empty string) allows this to continue working predictably when
  // `XRegExp.proptotype.toString` is overridden
  nativ.exec.call(/\/([a-z]*)$/i, RegExp.prototype.toString.call(regex))[1];
}
/**
 * Determines whether a regex has extended instance data used to track capture names.
 *
 * @private
 * @param {RegExp} regex Regex to check.
 * @returns {Boolean} Whether the regex uses named capture.
 */


function hasNamedCapture(regex) {
  return !!(regex[REGEX_DATA] && regex[REGEX_DATA].captureNames);
}
/**
 * Converts decimal to hexadecimal.
 *
 * @private
 * @param {Number|String} dec
 * @returns {String}
 */


function hex(dec) {
  return (0, _parseInt2.default)(dec, 10).toString(16);
}
/**
 * Checks whether the next nonignorable token after the specified position is a quantifier.
 *
 * @private
 * @param {String} pattern Pattern to search within.
 * @param {Number} pos Index in `pattern` to search at.
 * @param {String} flags Flags used by the pattern.
 * @returns {Boolean} Whether the next nonignorable token is a quantifier.
 */


function isQuantifierNext(pattern, pos, flags) {
  return nativ.test.call(flags.indexOf('x') !== -1 ? // Ignore any leading whitespace, line comments, and inline comments
  /^(?:\s|#[^#\n]*|\(\?#[^)]*\))*(?:[?*+]|{\d+(?:,\d*)?})/ : // Ignore any leading inline comments
  /^(?:\(\?#[^)]*\))*(?:[?*+]|{\d+(?:,\d*)?})/, pattern.slice(pos));
}
/**
 * Determines whether a value is of the specified type, by resolving its internal [[Class]].
 *
 * @private
 * @param {*} value Object to check.
 * @param {String} type Type to check for, in TitleCase.
 * @returns {Boolean} Whether the object matches the type.
 */


function isType(value, type) {
  return toString.call(value) === "[object ".concat(type, "]");
}
/**
 * Adds leading zeros if shorter than four characters. Used for fixed-length hexadecimal values.
 *
 * @private
 * @param {String} str
 * @returns {String}
 */


function pad4(str) {
  while (str.length < 4) {
    str = "0".concat(str);
  }

  return str;
}
/**
 * Checks for flag-related errors, and strips/applies flags in a leading mode modifier. Offloads
 * the flag preparation logic from the `XRegExp` constructor.
 *
 * @private
 * @param {String} pattern Regex pattern, possibly with a leading mode modifier.
 * @param {String} flags Any combination of flags.
 * @returns {Object} Object with properties `pattern` and `flags`.
 */


function prepareFlags(pattern, flags) {
  // Recent browsers throw on duplicate flags, so copy this behavior for nonnative flags
  if (clipDuplicates(flags) !== flags) {
    throw new SyntaxError("Invalid duplicate regex flag ".concat(flags));
  } // Strip and apply a leading mode modifier with any combination of flags except g or y


  pattern = nativ.replace.call(pattern, /^\(\?([\w$]+)\)/, function ($0, $1) {
    if (nativ.test.call(/[gy]/, $1)) {
      throw new SyntaxError("Cannot use flag g or y in mode modifier ".concat($0));
    } // Allow duplicate flags within the mode modifier


    flags = clipDuplicates(flags + $1);
    return '';
  }); // Throw on unknown native or nonnative flags

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator2.default)(flags), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var flag = _step.value;

      if (!registeredFlags[flag]) {
        throw new SyntaxError("Unknown regex flag ".concat(flag));
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return {
    pattern: pattern,
    flags: flags
  };
}
/**
 * Prepares an options object from the given value.
 *
 * @private
 * @param {String|Object} value Value to convert to an options object.
 * @returns {Object} Options object.
 */


function prepareOptions(value) {
  var options = {};

  if (isType(value, 'String')) {
    XRegExp.forEach(value, /[^\s,]+/, function (match) {
      options[match] = true;
    });
    return options;
  }

  return value;
}
/**
 * Registers a flag so it doesn't throw an 'unknown flag' error.
 *
 * @private
 * @param {String} flag Single-character flag to register.
 */


function registerFlag(flag) {
  if (!/^[\w$]$/.test(flag)) {
    throw new Error('Flag must be a single character A-Za-z0-9_$');
  }

  registeredFlags[flag] = true;
}
/**
 * Runs built-in and custom regex syntax tokens in reverse insertion order at the specified
 * position, until a match is found.
 *
 * @private
 * @param {String} pattern Original pattern from which an XRegExp object is being built.
 * @param {String} flags Flags being used to construct the regex.
 * @param {Number} pos Position to search for tokens within `pattern`.
 * @param {Number} scope Regex scope to apply: 'default' or 'class'.
 * @param {Object} context Context object to use for token handler functions.
 * @returns {Object} Object with properties `matchLength`, `output`, and `reparse`; or `null`.
 */


function runTokens(pattern, flags, pos, scope, context) {
  var i = tokens.length;
  var leadChar = pattern[pos];
  var result = null;
  var match;
  var t; // Run in reverse insertion order

  while (i--) {
    t = tokens[i];

    if (t.leadChar && t.leadChar !== leadChar || t.scope !== scope && t.scope !== 'all' || t.flag && !(flags.indexOf(t.flag) !== -1)) {
      continue;
    }

    match = XRegExp.exec(pattern, t.regex, pos, 'sticky');

    if (match) {
      result = {
        matchLength: match[0].length,
        output: t.handler.call(context, match, scope, flags),
        reparse: t.reparse
      }; // Finished with token tests

      break;
    }
  }

  return result;
}
/**
 * Enables or disables implicit astral mode opt-in. When enabled, flag A is automatically added to
 * all new regexes created by XRegExp. This causes an error to be thrown when creating regexes if
 * the Unicode Base addon is not available, since flag A is registered by that addon.
 *
 * @private
 * @param {Boolean} on `true` to enable; `false` to disable.
 */


function setAstral(on) {
  features.astral = on;
}
/**
 * Adds named capture groups to the `groups` property of match arrays. See here for details:
 * https://github.com/tc39/proposal-regexp-named-groups
 *
 * @private
 * @param {Boolean} on `true` to enable; `false` to disable.
 */


function setNamespacing(on) {
  features.namespacing = on;
}
/**
 * Returns the object, or throws an error if it is `null` or `undefined`. This is used to follow
 * the ES5 abstract operation `ToObject`.
 *
 * @private
 * @param {*} value Object to check and return.
 * @returns {*} The provided object.
 */


function toObject(value) {
  // null or undefined
  if (value == null) {
    throw new TypeError('Cannot convert null or undefined to object');
  }

  return value;
} // ==--------------------------==
// Constructor
// ==--------------------------==

/**
 * Creates an extended regular expression object for matching text with a pattern. Differs from a
 * native regular expression in that additional syntax and flags are supported. The returned object
 * is in fact a native `RegExp` and works with all native methods.
 *
 * @class XRegExp
 * @constructor
 * @param {String|RegExp} pattern Regex pattern string, or an existing regex object to copy.
 * @param {String} [flags] Any combination of flags.
 *   Native flags:
 *     - `g` - global
 *     - `i` - ignore case
 *     - `m` - multiline anchors
 *     - `u` - unicode (ES6)
 *     - `y` - sticky (Firefox 3+, ES6)
 *   Additional XRegExp flags:
 *     - `n` - explicit capture
 *     - `s` - dot matches all (aka singleline)
 *     - `x` - free-spacing and line comments (aka extended)
 *     - `A` - astral (requires the Unicode Base addon)
 *   Flags cannot be provided when constructing one `RegExp` from another.
 * @returns {RegExp} Extended regular expression object.
 * @example
 *
 * // With named capture and flag x
 * XRegExp(`(?<year>  [0-9]{4} ) -?  # year
 *          (?<month> [0-9]{2} ) -?  # month
 *          (?<day>   [0-9]{2} )     # day`, 'x');
 *
 * // Providing a regex object copies it. Native regexes are recompiled using native (not XRegExp)
 * // syntax. Copies maintain extended data, are augmented with `XRegExp.prototype` properties, and
 * // have fresh `lastIndex` properties (set to zero).
 * XRegExp(/regex/);
 */


function XRegExp(pattern, flags) {
  if (XRegExp.isRegExp(pattern)) {
    if (flags !== undefined) {
      throw new TypeError('Cannot supply flags when copying a RegExp');
    }

    return copyRegex(pattern);
  } // Copy the argument behavior of `RegExp`


  pattern = pattern === undefined ? '' : String(pattern);
  flags = flags === undefined ? '' : String(flags);

  if (XRegExp.isInstalled('astral') && !(flags.indexOf('A') !== -1)) {
    // This causes an error to be thrown if the Unicode Base addon is not available
    flags += 'A';
  }

  if (!patternCache[pattern]) {
    patternCache[pattern] = {};
  }

  if (!patternCache[pattern][flags]) {
    var context = {
      hasNamedCapture: false,
      captureNames: []
    };
    var scope = defaultScope;
    var output = '';
    var pos = 0;
    var result; // Check for flag-related errors, and strip/apply flags in a leading mode modifier

    var applied = prepareFlags(pattern, flags);
    var appliedPattern = applied.pattern;
    var appliedFlags = applied.flags; // Use XRegExp's tokens to translate the pattern to a native regex pattern.
    // `appliedPattern.length` may change on each iteration if tokens use `reparse`

    while (pos < appliedPattern.length) {
      do {
        // Check for custom tokens at the current position
        result = runTokens(appliedPattern, appliedFlags, pos, scope, context); // If the matched token used the `reparse` option, splice its output into the
        // pattern before running tokens again at the same position

        if (result && result.reparse) {
          appliedPattern = appliedPattern.slice(0, pos) + result.output + appliedPattern.slice(pos + result.matchLength);
        }
      } while (result && result.reparse);

      if (result) {
        output += result.output;
        pos += result.matchLength || 1;
      } else {
        // Get the native token at the current position
        var _XRegExp$exec = XRegExp.exec(appliedPattern, nativeTokens[scope], pos, 'sticky'),
            _XRegExp$exec2 = (0, _slicedToArray2.default)(_XRegExp$exec, 1),
            token = _XRegExp$exec2[0];

        output += token;
        pos += token.length;

        if (token === '[' && scope === defaultScope) {
          scope = classScope;
        } else if (token === ']' && scope === classScope) {
          scope = defaultScope;
        }
      }
    }

    patternCache[pattern][flags] = {
      // Use basic cleanup to collapse repeated empty groups like `(?:)(?:)` to `(?:)`. Empty
      // groups are sometimes inserted during regex transpilation in order to keep tokens
      // separated. However, more than one empty group in a row is never needed.
      pattern: nativ.replace.call(output, /(?:\(\?:\))+/g, '(?:)'),
      // Strip all but native flags
      flags: nativ.replace.call(appliedFlags, /[^gimuy]+/g, ''),
      // `context.captureNames` has an item for each capturing group, even if unnamed
      captures: context.hasNamedCapture ? context.captureNames : null
    };
  }

  var generated = patternCache[pattern][flags];
  return augment(new RegExp(generated.pattern, generated.flags), generated.captures, pattern, flags);
} // Add `RegExp.prototype` to the prototype chain


XRegExp.prototype = /(?:)/; // ==--------------------------==
// Public properties
// ==--------------------------==

/**
 * The XRegExp version number as a string containing three dot-separated parts. For example,
 * '2.0.0-beta-3'.
 *
 * @static
 * @memberOf XRegExp
 * @type String
 */

XRegExp.version = '4.2.4'; // ==--------------------------==
// Public methods
// ==--------------------------==
// Intentionally undocumented; used in tests and addons

XRegExp._clipDuplicates = clipDuplicates;
XRegExp._hasNativeFlag = hasNativeFlag;
XRegExp._dec = dec;
XRegExp._hex = hex;
XRegExp._pad4 = pad4;
/**
 * Extends XRegExp syntax and allows custom flags. This is used internally and can be used to
 * create XRegExp addons. If more than one token can match the same string, the last added wins.
 *
 * @memberOf XRegExp
 * @param {RegExp} regex Regex object that matches the new token.
 * @param {Function} handler Function that returns a new pattern string (using native regex syntax)
 *   to replace the matched token within all future XRegExp regexes. Has access to persistent
 *   properties of the regex being built, through `this`. Invoked with three arguments:
 *   - The match array, with named backreference properties.
 *   - The regex scope where the match was found: 'default' or 'class'.
 *   - The flags used by the regex, including any flags in a leading mode modifier.
 *   The handler function becomes part of the XRegExp construction process, so be careful not to
 *   construct XRegExps within the function or you will trigger infinite recursion.
 * @param {Object} [options] Options object with optional properties:
 *   - `scope` {String} Scope where the token applies: 'default', 'class', or 'all'.
 *   - `flag` {String} Single-character flag that triggers the token. This also registers the
 *     flag, which prevents XRegExp from throwing an 'unknown flag' error when the flag is used.
 *   - `optionalFlags` {String} Any custom flags checked for within the token `handler` that are
 *     not required to trigger the token. This registers the flags, to prevent XRegExp from
 *     throwing an 'unknown flag' error when any of the flags are used.
 *   - `reparse` {Boolean} Whether the `handler` function's output should not be treated as
 *     final, and instead be reparseable by other tokens (including the current token). Allows
 *     token chaining or deferring.
 *   - `leadChar` {String} Single character that occurs at the beginning of any successful match
 *     of the token (not always applicable). This doesn't change the behavior of the token unless
 *     you provide an erroneous value. However, providing it can increase the token's performance
 *     since the token can be skipped at any positions where this character doesn't appear.
 * @example
 *
 * // Basic usage: Add \a for the ALERT control code
 * XRegExp.addToken(
 *   /\\a/,
 *   () => '\\x07',
 *   {scope: 'all'}
 * );
 * XRegExp('\\a[\\a-\\n]+').test('\x07\n\x07'); // -> true
 *
 * // Add the U (ungreedy) flag from PCRE and RE2, which reverses greedy and lazy quantifiers.
 * // Since `scope` is not specified, it uses 'default' (i.e., transformations apply outside of
 * // character classes only)
 * XRegExp.addToken(
 *   /([?*+]|{\d+(?:,\d*)?})(\??)/,
 *   (match) => `${match[1]}${match[2] ? '' : '?'}`,
 *   {flag: 'U'}
 * );
 * XRegExp('a+', 'U').exec('aaa')[0]; // -> 'a'
 * XRegExp('a+?', 'U').exec('aaa')[0]; // -> 'aaa'
 */

XRegExp.addToken = function (regex, handler, options) {
  options = options || {};
  var _options = options,
      optionalFlags = _options.optionalFlags;

  if (options.flag) {
    registerFlag(options.flag);
  }

  if (optionalFlags) {
    optionalFlags = nativ.split.call(optionalFlags, '');
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = (0, _getIterator2.default)(optionalFlags), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var flag = _step2.value;
        registerFlag(flag);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  } // Add to the private list of syntax tokens


  tokens.push({
    regex: copyRegex(regex, {
      addG: true,
      addY: hasNativeY,
      isInternalOnly: true
    }),
    handler: handler,
    scope: options.scope || defaultScope,
    flag: options.flag,
    reparse: options.reparse,
    leadChar: options.leadChar
  }); // Reset the pattern cache used by the `XRegExp` constructor, since the same pattern and flags
  // might now produce different results

  XRegExp.cache.flush('patterns');
};
/**
 * Caches and returns the result of calling `XRegExp(pattern, flags)`. On any subsequent call with
 * the same pattern and flag combination, the cached copy of the regex is returned.
 *
 * @memberOf XRegExp
 * @param {String} pattern Regex pattern string.
 * @param {String} [flags] Any combination of XRegExp flags.
 * @returns {RegExp} Cached XRegExp object.
 * @example
 *
 * while (match = XRegExp.cache('.', 'gs').exec(str)) {
 *   // The regex is compiled once only
 * }
 */


XRegExp.cache = function (pattern, flags) {
  if (!regexCache[pattern]) {
    regexCache[pattern] = {};
  }

  return regexCache[pattern][flags] || (regexCache[pattern][flags] = XRegExp(pattern, flags));
}; // Intentionally undocumented; used in tests


XRegExp.cache.flush = function (cacheName) {
  if (cacheName === 'patterns') {
    // Flush the pattern cache used by the `XRegExp` constructor
    patternCache = {};
  } else {
    // Flush the regex cache populated by `XRegExp.cache`
    regexCache = {};
  }
};
/**
 * Escapes any regular expression metacharacters, for use when matching literal strings. The result
 * can safely be used at any point within a regex that uses any flags.
 *
 * @memberOf XRegExp
 * @param {String} str String to escape.
 * @returns {String} String with regex metacharacters escaped.
 * @example
 *
 * XRegExp.escape('Escaped? <.>');
 * // -> 'Escaped\?\ <\.>'
 */


XRegExp.escape = function (str) {
  return nativ.replace.call(toObject(str), /[-\[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};
/**
 * Executes a regex search in a specified string. Returns a match array or `null`. If the provided
 * regex uses named capture, named backreference properties are included on the match array.
 * Optional `pos` and `sticky` arguments specify the search start position, and whether the match
 * must start at the specified position only. The `lastIndex` property of the provided regex is not
 * used, but is updated for compatibility. Also fixes browser bugs compared to the native
 * `RegExp.prototype.exec` and can be used reliably cross-browser.
 *
 * @memberOf XRegExp
 * @param {String} str String to search.
 * @param {RegExp} regex Regex to search with.
 * @param {Number} [pos=0] Zero-based index at which to start the search.
 * @param {Boolean|String} [sticky=false] Whether the match must start at the specified position
 *   only. The string `'sticky'` is accepted as an alternative to `true`.
 * @returns {Array} Match array with named backreference properties, or `null`.
 * @example
 *
 * // Basic use, with named backreference
 * let match = XRegExp.exec('U+2620', XRegExp('U\\+(?<hex>[0-9A-F]{4})'));
 * match.hex; // -> '2620'
 *
 * // With pos and sticky, in a loop
 * let pos = 2, result = [], match;
 * while (match = XRegExp.exec('<1><2><3><4>5<6>', /<(\d)>/, pos, 'sticky')) {
 *   result.push(match[1]);
 *   pos = match.index + match[0].length;
 * }
 * // result -> ['2', '3', '4']
 */


XRegExp.exec = function (str, regex, pos, sticky) {
  var cacheKey = 'g';
  var addY = false;
  var fakeY = false;
  var match;
  addY = hasNativeY && !!(sticky || regex.sticky && sticky !== false);

  if (addY) {
    cacheKey += 'y';
  } else if (sticky) {
    // Simulate sticky matching by appending an empty capture to the original regex. The
    // resulting regex will succeed no matter what at the current index (set with `lastIndex`),
    // and will not search the rest of the subject string. We'll know that the original regex
    // has failed if that last capture is `''` rather than `undefined` (i.e., if that last
    // capture participated in the match).
    fakeY = true;
    cacheKey += 'FakeY';
  }

  regex[REGEX_DATA] = regex[REGEX_DATA] || {}; // Shares cached copies with `XRegExp.match`/`replace`

  var r2 = regex[REGEX_DATA][cacheKey] || (regex[REGEX_DATA][cacheKey] = copyRegex(regex, {
    addG: true,
    addY: addY,
    source: fakeY ? "".concat(regex.source, "|()") : undefined,
    removeY: sticky === false,
    isInternalOnly: true
  }));
  pos = pos || 0;
  r2.lastIndex = pos; // Fixed `exec` required for `lastIndex` fix, named backreferences, etc.

  match = fixed.exec.call(r2, str); // Get rid of the capture added by the pseudo-sticky matcher if needed. An empty string means
  // the original regexp failed (see above).

  if (fakeY && match && match.pop() === '') {
    match = null;
  }

  if (regex.global) {
    regex.lastIndex = match ? r2.lastIndex : 0;
  }

  return match;
};
/**
 * Executes a provided function once per regex match. Searches always start at the beginning of the
 * string and continue until the end, regardless of the state of the regex's `global` property and
 * initial `lastIndex`.
 *
 * @memberOf XRegExp
 * @param {String} str String to search.
 * @param {RegExp} regex Regex to search with.
 * @param {Function} callback Function to execute for each match. Invoked with four arguments:
 *   - The match array, with named backreference properties.
 *   - The zero-based match index.
 *   - The string being traversed.
 *   - The regex object being used to traverse the string.
 * @example
 *
 * // Extracts every other digit from a string
 * const evens = [];
 * XRegExp.forEach('1a2345', /\d/, (match, i) => {
 *   if (i % 2) evens.push(+match[0]);
 * });
 * // evens -> [2, 4]
 */


XRegExp.forEach = function (str, regex, callback) {
  var pos = 0;
  var i = -1;
  var match;

  while (match = XRegExp.exec(str, regex, pos)) {
    // Because `regex` is provided to `callback`, the function could use the deprecated/
    // nonstandard `RegExp.prototype.compile` to mutate the regex. However, since `XRegExp.exec`
    // doesn't use `lastIndex` to set the search position, this can't lead to an infinite loop,
    // at least. Actually, because of the way `XRegExp.exec` caches globalized versions of
    // regexes, mutating the regex will not have any effect on the iteration or matched strings,
    // which is a nice side effect that brings extra safety.
    callback(match, ++i, str, regex);
    pos = match.index + (match[0].length || 1);
  }
};
/**
 * Copies a regex object and adds flag `g`. The copy maintains extended data, is augmented with
 * `XRegExp.prototype` properties, and has a fresh `lastIndex` property (set to zero). Native
 * regexes are not recompiled using XRegExp syntax.
 *
 * @memberOf XRegExp
 * @param {RegExp} regex Regex to globalize.
 * @returns {RegExp} Copy of the provided regex with flag `g` added.
 * @example
 *
 * const globalCopy = XRegExp.globalize(/regex/);
 * globalCopy.global; // -> true
 */


XRegExp.globalize = function (regex) {
  return copyRegex(regex, {
    addG: true
  });
};
/**
 * Installs optional features according to the specified options. Can be undone using
 * `XRegExp.uninstall`.
 *
 * @memberOf XRegExp
 * @param {Object|String} options Options object or string.
 * @example
 *
 * // With an options object
 * XRegExp.install({
 *   // Enables support for astral code points in Unicode addons (implicitly sets flag A)
 *   astral: true,
 *
 *   // Adds named capture groups to the `groups` property of matches
 *   namespacing: true
 * });
 *
 * // With an options string
 * XRegExp.install('astral namespacing');
 */


XRegExp.install = function (options) {
  options = prepareOptions(options);

  if (!features.astral && options.astral) {
    setAstral(true);
  }

  if (!features.namespacing && options.namespacing) {
    setNamespacing(true);
  }
};
/**
 * Checks whether an individual optional feature is installed.
 *
 * @memberOf XRegExp
 * @param {String} feature Name of the feature to check. One of:
 *   - `astral`
 *   - `namespacing`
 * @returns {Boolean} Whether the feature is installed.
 * @example
 *
 * XRegExp.isInstalled('astral');
 */


XRegExp.isInstalled = function (feature) {
  return !!features[feature];
};
/**
 * Returns `true` if an object is a regex; `false` if it isn't. This works correctly for regexes
 * created in another frame, when `instanceof` and `constructor` checks would fail.
 *
 * @memberOf XRegExp
 * @param {*} value Object to check.
 * @returns {Boolean} Whether the object is a `RegExp` object.
 * @example
 *
 * XRegExp.isRegExp('string'); // -> false
 * XRegExp.isRegExp(/regex/i); // -> true
 * XRegExp.isRegExp(RegExp('^', 'm')); // -> true
 * XRegExp.isRegExp(XRegExp('(?s).')); // -> true
 */


XRegExp.isRegExp = function (value) {
  return toString.call(value) === '[object RegExp]';
}; // isType(value, 'RegExp');

/**
 * Returns the first matched string, or in global mode, an array containing all matched strings.
 * This is essentially a more convenient re-implementation of `String.prototype.match` that gives
 * the result types you actually want (string instead of `exec`-style array in match-first mode,
 * and an empty array instead of `null` when no matches are found in match-all mode). It also lets
 * you override flag g and ignore `lastIndex`, and fixes browser bugs.
 *
 * @memberOf XRegExp
 * @param {String} str String to search.
 * @param {RegExp} regex Regex to search with.
 * @param {String} [scope='one'] Use 'one' to return the first match as a string. Use 'all' to
 *   return an array of all matched strings. If not explicitly specified and `regex` uses flag g,
 *   `scope` is 'all'.
 * @returns {String|Array} In match-first mode: First match as a string, or `null`. In match-all
 *   mode: Array of all matched strings, or an empty array.
 * @example
 *
 * // Match first
 * XRegExp.match('abc', /\w/); // -> 'a'
 * XRegExp.match('abc', /\w/g, 'one'); // -> 'a'
 * XRegExp.match('abc', /x/g, 'one'); // -> null
 *
 * // Match all
 * XRegExp.match('abc', /\w/g); // -> ['a', 'b', 'c']
 * XRegExp.match('abc', /\w/, 'all'); // -> ['a', 'b', 'c']
 * XRegExp.match('abc', /x/, 'all'); // -> []
 */


XRegExp.match = function (str, regex, scope) {
  var global = regex.global && scope !== 'one' || scope === 'all';
  var cacheKey = (global ? 'g' : '') + (regex.sticky ? 'y' : '') || 'noGY';
  regex[REGEX_DATA] = regex[REGEX_DATA] || {}; // Shares cached copies with `XRegExp.exec`/`replace`

  var r2 = regex[REGEX_DATA][cacheKey] || (regex[REGEX_DATA][cacheKey] = copyRegex(regex, {
    addG: !!global,
    removeG: scope === 'one',
    isInternalOnly: true
  }));
  var result = nativ.match.call(toObject(str), r2);

  if (regex.global) {
    regex.lastIndex = scope === 'one' && result ? // Can't use `r2.lastIndex` since `r2` is nonglobal in this case
    result.index + result[0].length : 0;
  }

  return global ? result || [] : result && result[0];
};
/**
 * Retrieves the matches from searching a string using a chain of regexes that successively search
 * within previous matches. The provided `chain` array can contain regexes and or objects with
 * `regex` and `backref` properties. When a backreference is specified, the named or numbered
 * backreference is passed forward to the next regex or returned.
 *
 * @memberOf XRegExp
 * @param {String} str String to search.
 * @param {Array} chain Regexes that each search for matches within preceding results.
 * @returns {Array} Matches by the last regex in the chain, or an empty array.
 * @example
 *
 * // Basic usage; matches numbers within <b> tags
 * XRegExp.matchChain('1 <b>2</b> 3 <b>4 a 56</b>', [
 *   XRegExp('(?is)<b>.*?</b>'),
 *   /\d+/
 * ]);
 * // -> ['2', '4', '56']
 *
 * // Passing forward and returning specific backreferences
 * html = '<a href="http://xregexp.com/api/">XRegExp</a>\
 *         <a href="http://www.google.com/">Google</a>';
 * XRegExp.matchChain(html, [
 *   {regex: /<a href="([^"]+)">/i, backref: 1},
 *   {regex: XRegExp('(?i)^https?://(?<domain>[^/?#]+)'), backref: 'domain'}
 * ]);
 * // -> ['xregexp.com', 'www.google.com']
 */


XRegExp.matchChain = function (str, chain) {
  return function recurseChain(values, level) {
    var item = chain[level].regex ? chain[level] : {
      regex: chain[level]
    };
    var matches = [];

    function addMatch(match) {
      if (item.backref) {
        var ERR_UNDEFINED_GROUP = "Backreference to undefined group: ".concat(item.backref);
        var isNamedBackref = isNaN(item.backref);

        if (isNamedBackref && XRegExp.isInstalled('namespacing')) {
          // `groups` has `null` as prototype, so using `in` instead of `hasOwnProperty`
          if (!(item.backref in match.groups)) {
            throw new ReferenceError(ERR_UNDEFINED_GROUP);
          }
        } else if (!match.hasOwnProperty(item.backref)) {
          throw new ReferenceError(ERR_UNDEFINED_GROUP);
        }

        var backrefValue = isNamedBackref && XRegExp.isInstalled('namespacing') ? match.groups[item.backref] : match[item.backref];
        matches.push(backrefValue || '');
      } else {
        matches.push(match[0]);
      }
    }

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = (0, _getIterator2.default)(values), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var value = _step3.value;
        XRegExp.forEach(value, item.regex, addMatch);
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    return level === chain.length - 1 || !matches.length ? matches : recurseChain(matches, level + 1);
  }([str], 0);
};
/**
 * Returns a new string with one or all matches of a pattern replaced. The pattern can be a string
 * or regex, and the replacement can be a string or a function to be called for each match. To
 * perform a global search and replace, use the optional `scope` argument or include flag g if using
 * a regex. Replacement strings can use `${n}` or `$<n>` for named and numbered backreferences.
 * Replacement functions can use named backreferences via `arguments[0].name`. Also fixes browser
 * bugs compared to the native `String.prototype.replace` and can be used reliably cross-browser.
 *
 * @memberOf XRegExp
 * @param {String} str String to search.
 * @param {RegExp|String} search Search pattern to be replaced.
 * @param {String|Function} replacement Replacement string or a function invoked to create it.
 *   Replacement strings can include special replacement syntax:
 *     - $$ - Inserts a literal $ character.
 *     - $&, $0 - Inserts the matched substring.
 *     - $` - Inserts the string that precedes the matched substring (left context).
 *     - $' - Inserts the string that follows the matched substring (right context).
 *     - $n, $nn - Where n/nn are digits referencing an existent capturing group, inserts
 *       backreference n/nn.
 *     - ${n}, $<n> - Where n is a name or any number of digits that reference an existent capturing
 *       group, inserts backreference n.
 *   Replacement functions are invoked with three or more arguments:
 *     - The matched substring (corresponds to $& above). Named backreferences are accessible as
 *       properties of this first argument.
 *     - 0..n arguments, one for each backreference (corresponding to $1, $2, etc. above).
 *     - The zero-based index of the match within the total search string.
 *     - The total string being searched.
 * @param {String} [scope='one'] Use 'one' to replace the first match only, or 'all'. If not
 *   explicitly specified and using a regex with flag g, `scope` is 'all'.
 * @returns {String} New string with one or all matches replaced.
 * @example
 *
 * // Regex search, using named backreferences in replacement string
 * const name = XRegExp('(?<first>\\w+) (?<last>\\w+)');
 * XRegExp.replace('John Smith', name, '$<last>, $<first>');
 * // -> 'Smith, John'
 *
 * // Regex search, using named backreferences in replacement function
 * XRegExp.replace('John Smith', name, (match) => `${match.last}, ${match.first}`);
 * // -> 'Smith, John'
 *
 * // String search, with replace-all
 * XRegExp.replace('RegExp builds RegExps', 'RegExp', 'XRegExp', 'all');
 * // -> 'XRegExp builds XRegExps'
 */


XRegExp.replace = function (str, search, replacement, scope) {
  var isRegex = XRegExp.isRegExp(search);
  var global = search.global && scope !== 'one' || scope === 'all';
  var cacheKey = (global ? 'g' : '') + (search.sticky ? 'y' : '') || 'noGY';
  var s2 = search;

  if (isRegex) {
    search[REGEX_DATA] = search[REGEX_DATA] || {}; // Shares cached copies with `XRegExp.exec`/`match`. Since a copy is used, `search`'s
    // `lastIndex` isn't updated *during* replacement iterations

    s2 = search[REGEX_DATA][cacheKey] || (search[REGEX_DATA][cacheKey] = copyRegex(search, {
      addG: !!global,
      removeG: scope === 'one',
      isInternalOnly: true
    }));
  } else if (global) {
    s2 = new RegExp(XRegExp.escape(String(search)), 'g');
  } // Fixed `replace` required for named backreferences, etc.


  var result = fixed.replace.call(toObject(str), s2, replacement);

  if (isRegex && search.global) {
    // Fixes IE, Safari bug (last tested IE 9, Safari 5.1)
    search.lastIndex = 0;
  }

  return result;
};
/**
 * Performs batch processing of string replacements. Used like `XRegExp.replace`, but accepts an
 * array of replacement details. Later replacements operate on the output of earlier replacements.
 * Replacement details are accepted as an array with a regex or string to search for, the
 * replacement string or function, and an optional scope of 'one' or 'all'. Uses the XRegExp
 * replacement text syntax, which supports named backreference properties via `${name}` or
 * `$<name>`.
 *
 * @memberOf XRegExp
 * @param {String} str String to search.
 * @param {Array} replacements Array of replacement detail arrays.
 * @returns {String} New string with all replacements.
 * @example
 *
 * str = XRegExp.replaceEach(str, [
 *   [XRegExp('(?<name>a)'), 'z${name}'],
 *   [/b/gi, 'y'],
 *   [/c/g, 'x', 'one'], // scope 'one' overrides /g
 *   [/d/, 'w', 'all'],  // scope 'all' overrides lack of /g
 *   ['e', 'v', 'all'],  // scope 'all' allows replace-all for strings
 *   [/f/g, ($0) => $0.toUpperCase()]
 * ]);
 */


XRegExp.replaceEach = function (str, replacements) {
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = (0, _getIterator2.default)(replacements), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var r = _step4.value;
      str = XRegExp.replace(str, r[0], r[1], r[2]);
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
        _iterator4.return();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  return str;
};
/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 *
 * @memberOf XRegExp
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * XRegExp.split('a b c', ' ');
 * // -> ['a', 'b', 'c']
 *
 * // With limit
 * XRegExp.split('a b c', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * XRegExp.split('..word1..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', '..']
 */


XRegExp.split = function (str, separator, limit) {
  return fixed.split.call(toObject(str), separator, limit);
};
/**
 * Executes a regex search in a specified string. Returns `true` or `false`. Optional `pos` and
 * `sticky` arguments specify the search start position, and whether the match must start at the
 * specified position only. The `lastIndex` property of the provided regex is not used, but is
 * updated for compatibility. Also fixes browser bugs compared to the native
 * `RegExp.prototype.test` and can be used reliably cross-browser.
 *
 * @memberOf XRegExp
 * @param {String} str String to search.
 * @param {RegExp} regex Regex to search with.
 * @param {Number} [pos=0] Zero-based index at which to start the search.
 * @param {Boolean|String} [sticky=false] Whether the match must start at the specified position
 *   only. The string `'sticky'` is accepted as an alternative to `true`.
 * @returns {Boolean} Whether the regex matched the provided value.
 * @example
 *
 * // Basic use
 * XRegExp.test('abc', /c/); // -> true
 *
 * // With pos and sticky
 * XRegExp.test('abc', /c/, 0, 'sticky'); // -> false
 * XRegExp.test('abc', /c/, 2, 'sticky'); // -> true
 */
// Do this the easy way :-)


XRegExp.test = function (str, regex, pos, sticky) {
  return !!XRegExp.exec(str, regex, pos, sticky);
};
/**
 * Uninstalls optional features according to the specified options. All optional features start out
 * uninstalled, so this is used to undo the actions of `XRegExp.install`.
 *
 * @memberOf XRegExp
 * @param {Object|String} options Options object or string.
 * @example
 *
 * // With an options object
 * XRegExp.uninstall({
 *   // Disables support for astral code points in Unicode addons
 *   astral: true,
 *
 *   // Don't add named capture groups to the `groups` property of matches
 *   namespacing: true
 * });
 *
 * // With an options string
 * XRegExp.uninstall('astral namespacing');
 */


XRegExp.uninstall = function (options) {
  options = prepareOptions(options);

  if (features.astral && options.astral) {
    setAstral(false);
  }

  if (features.namespacing && options.namespacing) {
    setNamespacing(false);
  }
};
/**
 * Returns an XRegExp object that is the union of the given patterns. Patterns can be provided as
 * regex objects or strings. Metacharacters are escaped in patterns provided as strings.
 * Backreferences in provided regex objects are automatically renumbered to work correctly within
 * the larger combined pattern. Native flags used by provided regexes are ignored in favor of the
 * `flags` argument.
 *
 * @memberOf XRegExp
 * @param {Array} patterns Regexes and strings to combine.
 * @param {String} [flags] Any combination of XRegExp flags.
 * @param {Object} [options] Options object with optional properties:
 *   - `conjunction` {String} Type of conjunction to use: 'or' (default) or 'none'.
 * @returns {RegExp} Union of the provided regexes and strings.
 * @example
 *
 * XRegExp.union(['a+b*c', /(dogs)\1/, /(cats)\1/], 'i');
 * // -> /a\+b\*c|(dogs)\1|(cats)\2/i
 *
 * XRegExp.union([/man/, /bear/, /pig/], 'i', {conjunction: 'none'});
 * // -> /manbearpig/i
 */


XRegExp.union = function (patterns, flags, options) {
  options = options || {};
  var conjunction = options.conjunction || 'or';
  var numCaptures = 0;
  var numPriorCaptures;
  var captureNames;

  function rewrite(match, paren, backref) {
    var name = captureNames[numCaptures - numPriorCaptures]; // Capturing group

    if (paren) {
      ++numCaptures; // If the current capture has a name, preserve the name

      if (name) {
        return "(?<".concat(name, ">");
      } // Backreference

    } else if (backref) {
      // Rewrite the backreference
      return "\\".concat(+backref + numPriorCaptures);
    }

    return match;
  }

  if (!(isType(patterns, 'Array') && patterns.length)) {
    throw new TypeError('Must provide a nonempty array of patterns to merge');
  }

  var parts = /(\()(?!\?)|\\([1-9]\d*)|\\[\s\S]|\[(?:[^\\\]]|\\[\s\S])*\]/g;
  var output = [];
  var _iteratorNormalCompletion5 = true;
  var _didIteratorError5 = false;
  var _iteratorError5 = undefined;

  try {
    for (var _iterator5 = (0, _getIterator2.default)(patterns), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
      var pattern = _step5.value;

      if (XRegExp.isRegExp(pattern)) {
        numPriorCaptures = numCaptures;
        captureNames = pattern[REGEX_DATA] && pattern[REGEX_DATA].captureNames || []; // Rewrite backreferences. Passing to XRegExp dies on octals and ensures patterns are
        // independently valid; helps keep this simple. Named captures are put back

        output.push(nativ.replace.call(XRegExp(pattern.source).source, parts, rewrite));
      } else {
        output.push(XRegExp.escape(pattern));
      }
    }
  } catch (err) {
    _didIteratorError5 = true;
    _iteratorError5 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
        _iterator5.return();
      }
    } finally {
      if (_didIteratorError5) {
        throw _iteratorError5;
      }
    }
  }

  var separator = conjunction === 'none' ? '' : '|';
  return XRegExp(output.join(separator), flags);
}; // ==--------------------------==
// Fixed/extended native methods
// ==--------------------------==

/**
 * Adds named capture support (with backreferences returned as `result.name`), and fixes browser
 * bugs in the native `RegExp.prototype.exec`. Use via `XRegExp.exec`.
 *
 * @memberOf RegExp
 * @param {String} str String to search.
 * @returns {Array} Match array with named backreference properties, or `null`.
 */


fixed.exec = function (str) {
  var origLastIndex = this.lastIndex;
  var match = nativ.exec.apply(this, arguments);

  if (match) {
    // Fix browsers whose `exec` methods don't return `undefined` for nonparticipating capturing
    // groups. This fixes IE 5.5-8, but not IE 9's quirks mode or emulation of older IEs. IE 9
    // in standards mode follows the spec.
    if (!correctExecNpcg && match.length > 1 && match.indexOf('') !== -1) {
      var r2 = copyRegex(this, {
        removeG: true,
        isInternalOnly: true
      }); // Using `str.slice(match.index)` rather than `match[0]` in case lookahead allowed
      // matching due to characters outside the match

      nativ.replace.call(String(str).slice(match.index), r2, function () {
        var len = arguments.length; // Skip index 0 and the last 2

        for (var i = 1; i < len - 2; ++i) {
          if ((i < 0 || arguments.length <= i ? undefined : arguments[i]) === undefined) {
            match[i] = undefined;
          }
        }
      });
    } // Attach named capture properties


    var groupsObject = match;

    if (XRegExp.isInstalled('namespacing')) {
      // https://tc39.github.io/proposal-regexp-named-groups/#sec-regexpbuiltinexec
      match.groups = (0, _create.default)(null);
      groupsObject = match.groups;
    }

    if (this[REGEX_DATA] && this[REGEX_DATA].captureNames) {
      // Skip index 0
      for (var i = 1; i < match.length; ++i) {
        var name = this[REGEX_DATA].captureNames[i - 1];

        if (name) {
          groupsObject[name] = match[i];
        }
      }
    } // Fix browsers that increment `lastIndex` after zero-length matches


    if (this.global && !match[0].length && this.lastIndex > match.index) {
      this.lastIndex = match.index;
    }
  }

  if (!this.global) {
    // Fixes IE, Opera bug (last tested IE 9, Opera 11.6)
    this.lastIndex = origLastIndex;
  }

  return match;
};
/**
 * Fixes browser bugs in the native `RegExp.prototype.test`.
 *
 * @memberOf RegExp
 * @param {String} str String to search.
 * @returns {Boolean} Whether the regex matched the provided value.
 */


fixed.test = function (str) {
  // Do this the easy way :-)
  return !!fixed.exec.call(this, str);
};
/**
 * Adds named capture support (with backreferences returned as `result.name`), and fixes browser
 * bugs in the native `String.prototype.match`.
 *
 * @memberOf String
 * @param {RegExp|*} regex Regex to search with. If not a regex object, it is passed to `RegExp`.
 * @returns {Array} If `regex` uses flag g, an array of match strings or `null`. Without flag g,
 *   the result of calling `regex.exec(this)`.
 */


fixed.match = function (regex) {
  if (!XRegExp.isRegExp(regex)) {
    // Use the native `RegExp` rather than `XRegExp`
    regex = new RegExp(regex);
  } else if (regex.global) {
    var result = nativ.match.apply(this, arguments); // Fixes IE bug

    regex.lastIndex = 0;
    return result;
  }

  return fixed.exec.call(regex, toObject(this));
};
/**
 * Adds support for `${n}` (or `$<n>`) tokens for named and numbered backreferences in replacement
 * text, and provides named backreferences to replacement functions as `arguments[0].name`. Also
 * fixes browser bugs in replacement text syntax when performing a replacement using a nonregex
 * search value, and the value of a replacement regex's `lastIndex` property during replacement
 * iterations and upon completion. Note that this doesn't support SpiderMonkey's proprietary third
 * (`flags`) argument. Use via `XRegExp.replace`.
 *
 * @memberOf String
 * @param {RegExp|String} search Search pattern to be replaced.
 * @param {String|Function} replacement Replacement string or a function invoked to create it.
 * @returns {String} New string with one or all matches replaced.
 */


fixed.replace = function (search, replacement) {
  var isRegex = XRegExp.isRegExp(search);
  var origLastIndex;
  var captureNames;
  var result;

  if (isRegex) {
    if (search[REGEX_DATA]) {
      captureNames = search[REGEX_DATA].captureNames;
    } // Only needed if `search` is nonglobal


    origLastIndex = search.lastIndex;
  } else {
    search += ''; // Type-convert
  } // Don't use `typeof`; some older browsers return 'function' for regex objects


  if (isType(replacement, 'Function')) {
    // Stringifying `this` fixes a bug in IE < 9 where the last argument in replacement
    // functions isn't type-converted to a string
    result = nativ.replace.call(String(this), search, function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (captureNames) {
        var groupsObject;

        if (XRegExp.isInstalled('namespacing')) {
          // https://tc39.github.io/proposal-regexp-named-groups/#sec-regexpbuiltinexec
          groupsObject = (0, _create.default)(null);
          args.push(groupsObject);
        } else {
          // Change the `args[0]` string primitive to a `String` object that can store
          // properties. This really does need to use `String` as a constructor
          args[0] = new String(args[0]);
          groupsObject = args[0];
        } // Store named backreferences


        for (var i = 0; i < captureNames.length; ++i) {
          if (captureNames[i]) {
            groupsObject[captureNames[i]] = args[i + 1];
          }
        }
      } // Update `lastIndex` before calling `replacement`. Fixes IE, Chrome, Firefox, Safari
      // bug (last tested IE 9, Chrome 17, Firefox 11, Safari 5.1)


      if (isRegex && search.global) {
        search.lastIndex = args[args.length - 2] + args[0].length;
      } // ES6 specs the context for replacement functions as `undefined`


      return replacement.apply(void 0, args);
    });
  } else {
    // Ensure that the last value of `args` will be a string when given nonstring `this`,
    // while still throwing on null or undefined context
    result = nativ.replace.call(this == null ? this : String(this), search, function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return nativ.replace.call(String(replacement), replacementToken, replacer);

      function replacer($0, bracketed, angled, dollarToken) {
        bracketed = bracketed || angled; // Named or numbered backreference with curly or angled braces

        if (bracketed) {
          // XRegExp behavior for `${n}` or `$<n>`:
          // 1. Backreference to numbered capture, if `n` is an integer. Use `0` for the
          //    entire match. Any number of leading zeros may be used.
          // 2. Backreference to named capture `n`, if it exists and is not an integer
          //    overridden by numbered capture. In practice, this does not overlap with
          //    numbered capture since XRegExp does not allow named capture to use a bare
          //    integer as the name.
          // 3. If the name or number does not refer to an existing capturing group, it's
          //    an error.
          var n = +bracketed; // Type-convert; drop leading zeros

          if (n <= args.length - 3) {
            return args[n] || '';
          } // Groups with the same name is an error, else would need `lastIndexOf`


          n = captureNames ? captureNames.indexOf(bracketed) : -1;

          if (n < 0) {
            throw new SyntaxError("Backreference to undefined group ".concat($0));
          }

          return args[n + 1] || '';
        } // Else, special variable or numbered backreference without curly braces


        if (dollarToken === '$') {
          // $$
          return '$';
        }

        if (dollarToken === '&' || +dollarToken === 0) {
          // $&, $0 (not followed by 1-9), $00
          return args[0];
        }

        if (dollarToken === '`') {
          // $` (left context)
          return args[args.length - 1].slice(0, args[args.length - 2]);
        }

        if (dollarToken === "'") {
          // $' (right context)
          return args[args.length - 1].slice(args[args.length - 2] + args[0].length);
        } // Else, numbered backreference without braces


        dollarToken = +dollarToken; // Type-convert; drop leading zero
        // XRegExp behavior for `$n` and `$nn`:
        // - Backrefs end after 1 or 2 digits. Use `${..}` or `$<..>` for more digits.
        // - `$1` is an error if no capturing groups.
        // - `$10` is an error if less than 10 capturing groups. Use `${1}0` or `$<1>0`
        //   instead.
        // - `$01` is `$1` if at least one capturing group, else it's an error.
        // - `$0` (not followed by 1-9) and `$00` are the entire match.
        // Native behavior, for comparison:
        // - Backrefs end after 1 or 2 digits. Cannot reference capturing group 100+.
        // - `$1` is a literal `$1` if no capturing groups.
        // - `$10` is `$1` followed by a literal `0` if less than 10 capturing groups.
        // - `$01` is `$1` if at least one capturing group, else it's a literal `$01`.
        // - `$0` is a literal `$0`.

        if (!isNaN(dollarToken)) {
          if (dollarToken > args.length - 3) {
            throw new SyntaxError("Backreference to undefined group ".concat($0));
          }

          return args[dollarToken] || '';
        } // `$` followed by an unsupported char is an error, unlike native JS


        throw new SyntaxError("Invalid token ".concat($0));
      }
    });
  }

  if (isRegex) {
    if (search.global) {
      // Fixes IE, Safari bug (last tested IE 9, Safari 5.1)
      search.lastIndex = 0;
    } else {
      // Fixes IE, Opera bug (last tested IE 9, Opera 11.6)
      search.lastIndex = origLastIndex;
    }
  }

  return result;
};
/**
 * Fixes browser bugs in the native `String.prototype.split`. Use via `XRegExp.split`.
 *
 * @memberOf String
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 */


fixed.split = function (separator, limit) {
  if (!XRegExp.isRegExp(separator)) {
    // Browsers handle nonregex split correctly, so use the faster native method
    return nativ.split.apply(this, arguments);
  }

  var str = String(this);
  var output = [];
  var origLastIndex = separator.lastIndex;
  var lastLastIndex = 0;
  var lastLength; // Values for `limit`, per the spec:
  // If undefined: pow(2,32) - 1
  // If 0, Infinity, or NaN: 0
  // If positive number: limit = floor(limit); if (limit >= pow(2,32)) limit -= pow(2,32);
  // If negative number: pow(2,32) - floor(abs(limit))
  // If other: Type-convert, then use the above rules
  // This line fails in very strange ways for some values of `limit` in Opera 10.5-10.63, unless
  // Opera Dragonfly is open (go figure). It works in at least Opera 9.5-10.1 and 11+

  limit = (limit === undefined ? -1 : limit) >>> 0;
  XRegExp.forEach(str, separator, function (match) {
    // This condition is not the same as `if (match[0].length)`
    if (match.index + match[0].length > lastLastIndex) {
      output.push(str.slice(lastLastIndex, match.index));

      if (match.length > 1 && match.index < str.length) {
        Array.prototype.push.apply(output, match.slice(1));
      }

      lastLength = match[0].length;
      lastLastIndex = match.index + lastLength;
    }
  });

  if (lastLastIndex === str.length) {
    if (!nativ.test.call(separator, '') || lastLength) {
      output.push('');
    }
  } else {
    output.push(str.slice(lastLastIndex));
  }

  separator.lastIndex = origLastIndex;
  return output.length > limit ? output.slice(0, limit) : output;
}; // ==--------------------------==
// Built-in syntax/flag tokens
// ==--------------------------==

/*
 * Letter escapes that natively match literal characters: `\a`, `\A`, etc. These should be
 * SyntaxErrors but are allowed in web reality. XRegExp makes them errors for cross-browser
 * consistency and to reserve their syntax, but lets them be superseded by addons.
 */


XRegExp.addToken(/\\([ABCE-RTUVXYZaeg-mopqyz]|c(?![A-Za-z])|u(?![\dA-Fa-f]{4}|{[\dA-Fa-f]+})|x(?![\dA-Fa-f]{2}))/, function (match, scope) {
  // \B is allowed in default scope only
  if (match[1] === 'B' && scope === defaultScope) {
    return match[0];
  }

  throw new SyntaxError("Invalid escape ".concat(match[0]));
}, {
  scope: 'all',
  leadChar: '\\'
});
/*
 * Unicode code point escape with curly braces: `\u{N..}`. `N..` is any one or more digit
 * hexadecimal number from 0-10FFFF, and can include leading zeros. Requires the native ES6 `u` flag
 * to support code points greater than U+FFFF. Avoids converting code points above U+FFFF to
 * surrogate pairs (which could be done without flag `u`), since that could lead to broken behavior
 * if you follow a `\u{N..}` token that references a code point above U+FFFF with a quantifier, or
 * if you use the same in a character class.
 */

XRegExp.addToken(/\\u{([\dA-Fa-f]+)}/, function (match, scope, flags) {
  var code = dec(match[1]);

  if (code > 0x10FFFF) {
    throw new SyntaxError("Invalid Unicode code point ".concat(match[0]));
  }

  if (code <= 0xFFFF) {
    // Converting to \uNNNN avoids needing to escape the literal character and keep it
    // separate from preceding tokens
    return "\\u".concat(pad4(hex(code)));
  } // If `code` is between 0xFFFF and 0x10FFFF, require and defer to native handling


  if (hasNativeU && flags.indexOf('u') !== -1) {
    return match[0];
  }

  throw new SyntaxError('Cannot use Unicode code point above \\u{FFFF} without flag u');
}, {
  scope: 'all',
  leadChar: '\\'
});
/*
 * Empty character class: `[]` or `[^]`. This fixes a critical cross-browser syntax inconsistency.
 * Unless this is standardized (per the ES spec), regex syntax can't be accurately parsed because
 * character class endings can't be determined.
 */

XRegExp.addToken(/\[(\^?)\]/, // For cross-browser compatibility with ES3, convert [] to \b\B and [^] to [\s\S].
// (?!) should work like \b\B, but is unreliable in some versions of Firefox

/* eslint-disable no-confusing-arrow */
function (match) {
  return match[1] ? '[\\s\\S]' : '\\b\\B';
},
/* eslint-enable no-confusing-arrow */
{
  leadChar: '['
});
/*
 * Comment pattern: `(?# )`. Inline comments are an alternative to the line comments allowed in
 * free-spacing mode (flag x).
 */

XRegExp.addToken(/\(\?#[^)]*\)/, getContextualTokenSeparator, {
  leadChar: '('
});
/*
 * Whitespace and line comments, in free-spacing mode (aka extended mode, flag x) only.
 */

XRegExp.addToken(/\s+|#[^\n]*\n?/, getContextualTokenSeparator, {
  flag: 'x'
});
/*
 * Dot, in dotall mode (aka singleline mode, flag s) only.
 */

XRegExp.addToken(/\./, function () {
  return '[\\s\\S]';
}, {
  flag: 's',
  leadChar: '.'
});
/*
 * Named backreference: `\k<name>`. Backreference names can use the characters A-Z, a-z, 0-9, _,
 * and $ only. Also allows numbered backreferences as `\k<n>`.
 */

XRegExp.addToken(/\\k<([\w$]+)>/, function (match) {
  // Groups with the same name is an error, else would need `lastIndexOf`
  var index = isNaN(match[1]) ? this.captureNames.indexOf(match[1]) + 1 : +match[1];
  var endIndex = match.index + match[0].length;

  if (!index || index > this.captureNames.length) {
    throw new SyntaxError("Backreference to undefined group ".concat(match[0]));
  } // Keep backreferences separate from subsequent literal numbers. This avoids e.g.
  // inadvertedly changing `(?<n>)\k<n>1` to `()\11`.


  return "\\".concat(index).concat(endIndex === match.input.length || isNaN(match.input[endIndex]) ? '' : '(?:)');
}, {
  leadChar: '\\'
});
/*
 * Numbered backreference or octal, plus any following digits: `\0`, `\11`, etc. Octals except `\0`
 * not followed by 0-9 and backreferences to unopened capture groups throw an error. Other matches
 * are returned unaltered. IE < 9 doesn't support backreferences above `\99` in regex syntax.
 */

XRegExp.addToken(/\\(\d+)/, function (match, scope) {
  if (!(scope === defaultScope && /^[1-9]/.test(match[1]) && +match[1] <= this.captureNames.length) && match[1] !== '0') {
    throw new SyntaxError("Cannot use octal escape or backreference to undefined group ".concat(match[0]));
  }

  return match[0];
}, {
  scope: 'all',
  leadChar: '\\'
});
/*
 * Named capturing group; match the opening delimiter only: `(?<name>`. Capture names can use the
 * characters A-Z, a-z, 0-9, _, and $ only. Names can't be integers. Supports Python-style
 * `(?P<name>` as an alternate syntax to avoid issues in some older versions of Opera which natively
 * supported the Python-style syntax. Otherwise, XRegExp might treat numbered backreferences to
 * Python-style named capture as octals.
 */

XRegExp.addToken(/\(\?P?<([\w$]+)>/, function (match) {
  // Disallow bare integers as names because named backreferences are added to match arrays
  // and therefore numeric properties may lead to incorrect lookups
  if (!isNaN(match[1])) {
    throw new SyntaxError("Cannot use integer as capture name ".concat(match[0]));
  }

  if (!XRegExp.isInstalled('namespacing') && (match[1] === 'length' || match[1] === '__proto__')) {
    throw new SyntaxError("Cannot use reserved word as capture name ".concat(match[0]));
  }

  if (this.captureNames.indexOf(match[1]) !== -1) {
    throw new SyntaxError("Cannot use same name for multiple groups ".concat(match[0]));
  }

  this.captureNames.push(match[1]);
  this.hasNamedCapture = true;
  return '(';
}, {
  leadChar: '('
});
/*
 * Capturing group; match the opening parenthesis only. Required for support of named capturing
 * groups. Also adds explicit capture mode (flag n).
 */

XRegExp.addToken(/\((?!\?)/, function (match, scope, flags) {
  if (flags.indexOf('n') !== -1) {
    return '(?:';
  }

  this.captureNames.push(null);
  return '(';
}, {
  optionalFlags: 'n',
  leadChar: '('
});
var _default = XRegExp;
exports.default = _default;
module.exports = exports["default"];
});

unwrapExports(xregexp);

var build = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*!
 * XRegExp.build 4.2.4
 * <xregexp.com>
 * Steven Levithan (c) 2012-present MIT License
 */
var _default = function _default(XRegExp) {
  var REGEX_DATA = 'xregexp';
  var subParts = /(\()(?!\?)|\\([1-9]\d*)|\\[\s\S]|\[(?:[^\\\]]|\\[\s\S])*\]/g;
  var parts = XRegExp.union([/\({{([\w$]+)}}\)|{{([\w$]+)}}/, subParts], 'g', {
    conjunction: 'or'
  });
  /**
   * Strips a leading `^` and trailing unescaped `$`, if both are present.
   *
   * @private
   * @param {String} pattern Pattern to process.
   * @returns {String} Pattern with edge anchors removed.
   */

  function deanchor(pattern) {
    // Allow any number of empty noncapturing groups before/after anchors, because regexes
    // built/generated by XRegExp sometimes include them
    var leadingAnchor = /^(?:\(\?:\))*\^/;
    var trailingAnchor = /\$(?:\(\?:\))*$/;

    if (leadingAnchor.test(pattern) && trailingAnchor.test(pattern) && // Ensure that the trailing `$` isn't escaped
    trailingAnchor.test(pattern.replace(/\\[\s\S]/g, ''))) {
      return pattern.replace(leadingAnchor, '').replace(trailingAnchor, '');
    }

    return pattern;
  }
  /**
   * Converts the provided value to an XRegExp. Native RegExp flags are not preserved.
   *
   * @private
   * @param {String|RegExp} value Value to convert.
   * @param {Boolean} [addFlagX] Whether to apply the `x` flag in cases when `value` is not
   *   already a regex generated by XRegExp
   * @returns {RegExp} XRegExp object with XRegExp syntax applied.
   */


  function asXRegExp(value, addFlagX) {
    var flags = addFlagX ? 'x' : '';
    return XRegExp.isRegExp(value) ? value[REGEX_DATA] && value[REGEX_DATA].captureNames ? // Don't recompile, to preserve capture names
    value : // Recompile as XRegExp
    XRegExp(value.source, flags) : // Compile string as XRegExp
    XRegExp(value, flags);
  }

  function interpolate(substitution) {
    return substitution instanceof RegExp ? substitution : XRegExp.escape(substitution);
  }

  function reduceToSubpatternsObject(subpatterns, interpolated, subpatternIndex) {
    subpatterns["subpattern".concat(subpatternIndex)] = interpolated;
    return subpatterns;
  }

  function embedSubpatternAfter(raw, subpatternIndex, rawLiterals) {
    var hasSubpattern = subpatternIndex < rawLiterals.length - 1;
    return raw + (hasSubpattern ? "{{subpattern".concat(subpatternIndex, "}}") : '');
  }
  /**
   * Provides tagged template literals that create regexes with XRegExp syntax and flags. The
   * provided pattern is handled as a raw string, so backslashes don't need to be escaped.
   *
   * Interpolation of strings and regexes shares the features of `XRegExp.build`. Interpolated
   * patterns are treated as atomic units when quantified, interpolated strings have their special
   * characters escaped, a leading `^` and trailing unescaped `$` are stripped from interpolated
   * regexes if both are present, and any backreferences within an interpolated regex are
   * rewritten to work within the overall pattern.
   *
   * @memberOf XRegExp
   * @param {String} [flags] Any combination of XRegExp flags.
   * @returns {Function} Handler for template literals that construct regexes with XRegExp syntax.
   * @example
   *
   * const h12 = /1[0-2]|0?[1-9]/;
   * const h24 = /2[0-3]|[01][0-9]/;
   * const hours = XRegExp.tag('x')`${h12} : | ${h24}`;
   * const minutes = /^[0-5][0-9]$/;
   * // Note that explicitly naming the 'minutes' group is required for named backreferences
   * const time = XRegExp.tag('x')`^ ${hours} (?<minutes>${minutes}) $`;
   * time.test('10:59'); // -> true
   * XRegExp.exec('10:59', time).minutes; // -> '59'
   */


  XRegExp.tag = function (flags) {
    return function (literals) {
      for (var _len = arguments.length, substitutions = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        substitutions[_key - 1] = arguments[_key];
      }

      var subpatterns = substitutions.map(interpolate).reduce(reduceToSubpatternsObject, {});
      var pattern = literals.raw.map(embedSubpatternAfter).join('');
      return XRegExp.build(pattern, subpatterns, flags);
    };
  };
  /**
   * Builds regexes using named subpatterns, for readability and pattern reuse. Backreferences in
   * the outer pattern and provided subpatterns are automatically renumbered to work correctly.
   * Native flags used by provided subpatterns are ignored in favor of the `flags` argument.
   *
   * @memberOf XRegExp
   * @param {String} pattern XRegExp pattern using `{{name}}` for embedded subpatterns. Allows
   *   `({{name}})` as shorthand for `(?<name>{{name}})`. Patterns cannot be embedded within
   *   character classes.
   * @param {Object} subs Lookup object for named subpatterns. Values can be strings or regexes. A
   *   leading `^` and trailing unescaped `$` are stripped from subpatterns, if both are present.
   * @param {String} [flags] Any combination of XRegExp flags.
   * @returns {RegExp} Regex with interpolated subpatterns.
   * @example
   *
   * const time = XRegExp.build('(?x)^ {{hours}} ({{minutes}}) $', {
   *   hours: XRegExp.build('{{h12}} : | {{h24}}', {
   *     h12: /1[0-2]|0?[1-9]/,
   *     h24: /2[0-3]|[01][0-9]/
   *   }, 'x'),
   *   minutes: /^[0-5][0-9]$/
   * });
   * time.test('10:59'); // -> true
   * XRegExp.exec('10:59', time).minutes; // -> '59'
   */


  XRegExp.build = function (pattern, subs, flags) {
    flags = flags || ''; // Used with `asXRegExp` calls for `pattern` and subpatterns in `subs`, to work around how
    // some browsers convert `RegExp('\n')` to a regex that contains the literal characters `\`
    // and `n`. See more details at <https://github.com/slevithan/xregexp/pull/163>.

    var addFlagX = flags.indexOf('x') !== -1;
    var inlineFlags = /^\(\?([\w$]+)\)/.exec(pattern); // Add flags within a leading mode modifier to the overall pattern's flags

    if (inlineFlags) {
      flags = XRegExp._clipDuplicates(flags + inlineFlags[1]);
    }

    var data = {};

    for (var p in subs) {
      if (subs.hasOwnProperty(p)) {
        // Passing to XRegExp enables extended syntax and ensures independent validity,
        // lest an unescaped `(`, `)`, `[`, or trailing `\` breaks the `(?:)` wrapper. For
        // subpatterns provided as native regexes, it dies on octals and adds the property
        // used to hold extended regex instance data, for simplicity.
        var sub = asXRegExp(subs[p], addFlagX);
        data[p] = {
          // Deanchoring allows embedding independently useful anchored regexes. If you
          // really need to keep your anchors, double them (i.e., `^^...$$`).
          pattern: deanchor(sub.source),
          names: sub[REGEX_DATA].captureNames || []
        };
      }
    } // Passing to XRegExp dies on octals and ensures the outer pattern is independently valid;
    // helps keep this simple. Named captures will be put back.


    var patternAsRegex = asXRegExp(pattern, addFlagX); // 'Caps' is short for 'captures'

    var numCaps = 0;
    var numPriorCaps;
    var numOuterCaps = 0;
    var outerCapsMap = [0];
    var outerCapNames = patternAsRegex[REGEX_DATA].captureNames || [];
    var output = patternAsRegex.source.replace(parts, function ($0, $1, $2, $3, $4) {
      var subName = $1 || $2;
      var capName;
      var intro;
      var localCapIndex; // Named subpattern

      if (subName) {
        if (!data.hasOwnProperty(subName)) {
          throw new ReferenceError("Undefined property ".concat($0));
        } // Named subpattern was wrapped in a capturing group


        if ($1) {
          capName = outerCapNames[numOuterCaps];
          outerCapsMap[++numOuterCaps] = ++numCaps; // If it's a named group, preserve the name. Otherwise, use the subpattern name
          // as the capture name

          intro = "(?<".concat(capName || subName, ">");
        } else {
          intro = '(?:';
        }

        numPriorCaps = numCaps;
        var rewrittenSubpattern = data[subName].pattern.replace(subParts, function (match, paren, backref) {
          // Capturing group
          if (paren) {
            capName = data[subName].names[numCaps - numPriorCaps];
            ++numCaps; // If the current capture has a name, preserve the name

            if (capName) {
              return "(?<".concat(capName, ">");
            } // Backreference

          } else if (backref) {
            localCapIndex = +backref - 1; // Rewrite the backreference

            return data[subName].names[localCapIndex] ? // Need to preserve the backreference name in case using flag `n`
            "\\k<".concat(data[subName].names[localCapIndex], ">") : "\\".concat(+backref + numPriorCaps);
          }

          return match;
        });
        return "".concat(intro).concat(rewrittenSubpattern, ")");
      } // Capturing group


      if ($3) {
        capName = outerCapNames[numOuterCaps];
        outerCapsMap[++numOuterCaps] = ++numCaps; // If the current capture has a name, preserve the name

        if (capName) {
          return "(?<".concat(capName, ">");
        } // Backreference

      } else if ($4) {
        localCapIndex = +$4 - 1; // Rewrite the backreference

        return outerCapNames[localCapIndex] ? // Need to preserve the backreference name in case using flag `n`
        "\\k<".concat(outerCapNames[localCapIndex], ">") : "\\".concat(outerCapsMap[+$4]);
      }

      return $0;
    });
    return XRegExp(output, flags);
  };
};

exports.default = _default;
module.exports = exports["default"];
});

unwrapExports(build);

var matchrecursive = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*!
 * XRegExp.matchRecursive 4.2.4
 * <xregexp.com>
 * Steven Levithan (c) 2009-present MIT License
 */
var _default = function _default(XRegExp) {
  /**
   * Returns a match detail object composed of the provided values.
   *
   * @private
   */
  function row(name, value, start, end) {
    return {
      name: name,
      value: value,
      start: start,
      end: end
    };
  }
  /**
   * Returns an array of match strings between outermost left and right delimiters, or an array of
   * objects with detailed match parts and position data. An error is thrown if delimiters are
   * unbalanced within the data.
   *
   * @memberOf XRegExp
   * @param {String} str String to search.
   * @param {String} left Left delimiter as an XRegExp pattern.
   * @param {String} right Right delimiter as an XRegExp pattern.
   * @param {String} [flags] Any native or XRegExp flags, used for the left and right delimiters.
   * @param {Object} [options] Lets you specify `valueNames` and `escapeChar` options.
   * @returns {Array} Array of matches, or an empty array.
   * @example
   *
   * // Basic usage
   * let str = '(t((e))s)t()(ing)';
   * XRegExp.matchRecursive(str, '\\(', '\\)', 'g');
   * // -> ['t((e))s', '', 'ing']
   *
   * // Extended information mode with valueNames
   * str = 'Here is <div> <div>an</div></div> example';
   * XRegExp.matchRecursive(str, '<div\\s*>', '</div>', 'gi', {
   *   valueNames: ['between', 'left', 'match', 'right']
   * });
   * // -> [
   * // {name: 'between', value: 'Here is ',       start: 0,  end: 8},
   * // {name: 'left',    value: '<div>',          start: 8,  end: 13},
   * // {name: 'match',   value: ' <div>an</div>', start: 13, end: 27},
   * // {name: 'right',   value: '</div>',         start: 27, end: 33},
   * // {name: 'between', value: ' example',       start: 33, end: 41}
   * // ]
   *
   * // Omitting unneeded parts with null valueNames, and using escapeChar
   * str = '...{1}.\\{{function(x,y){return {y:x}}}';
   * XRegExp.matchRecursive(str, '{', '}', 'g', {
   *   valueNames: ['literal', null, 'value', null],
   *   escapeChar: '\\'
   * });
   * // -> [
   * // {name: 'literal', value: '...',  start: 0, end: 3},
   * // {name: 'value',   value: '1',    start: 4, end: 5},
   * // {name: 'literal', value: '.\\{', start: 6, end: 9},
   * // {name: 'value',   value: 'function(x,y){return {y:x}}', start: 10, end: 37}
   * // ]
   *
   * // Sticky mode via flag y
   * str = '<1><<<2>>><3>4<5>';
   * XRegExp.matchRecursive(str, '<', '>', 'gy');
   * // -> ['1', '<<2>>', '3']
   */


  XRegExp.matchRecursive = function (str, left, right, flags, options) {
    flags = flags || '';
    options = options || {};
    var global = flags.indexOf('g') !== -1;
    var sticky = flags.indexOf('y') !== -1; // Flag `y` is controlled internally

    var basicFlags = flags.replace(/y/g, '');
    var _options = options,
        escapeChar = _options.escapeChar;
    var vN = options.valueNames;
    var output = [];
    var openTokens = 0;
    var delimStart = 0;
    var delimEnd = 0;
    var lastOuterEnd = 0;
    var outerStart;
    var innerStart;
    var leftMatch;
    var rightMatch;
    var esc;
    left = XRegExp(left, basicFlags);
    right = XRegExp(right, basicFlags);

    if (escapeChar) {
      if (escapeChar.length > 1) {
        throw new Error('Cannot use more than one escape character');
      }

      escapeChar = XRegExp.escape(escapeChar); // Example of concatenated `esc` regex:
      // `escapeChar`: '%'
      // `left`: '<'
      // `right`: '>'
      // Regex is: /(?:%[\S\s]|(?:(?!<|>)[^%])+)+/

      esc = new RegExp("(?:".concat(escapeChar, "[\\S\\s]|(?:(?!").concat( // Using `XRegExp.union` safely rewrites backreferences in `left` and `right`.
      // Intentionally not passing `basicFlags` to `XRegExp.union` since any syntax
      // transformation resulting from those flags was already applied to `left` and
      // `right` when they were passed through the XRegExp constructor above.
      XRegExp.union([left, right], '', {
        conjunction: 'or'
      }).source, ")[^").concat(escapeChar, "])+)+"), // Flags `gy` not needed here
      flags.replace(/[^imu]+/g, ''));
    }

    while (true) {
      // If using an escape character, advance to the delimiter's next starting position,
      // skipping any escaped characters in between
      if (escapeChar) {
        delimEnd += (XRegExp.exec(str, esc, delimEnd, 'sticky') || [''])[0].length;
      }

      leftMatch = XRegExp.exec(str, left, delimEnd);
      rightMatch = XRegExp.exec(str, right, delimEnd); // Keep the leftmost match only

      if (leftMatch && rightMatch) {
        if (leftMatch.index <= rightMatch.index) {
          rightMatch = null;
        } else {
          leftMatch = null;
        }
      } // Paths (LM: leftMatch, RM: rightMatch, OT: openTokens):
      // LM | RM | OT | Result
      // 1  | 0  | 1  | loop
      // 1  | 0  | 0  | loop
      // 0  | 1  | 1  | loop
      // 0  | 1  | 0  | throw
      // 0  | 0  | 1  | throw
      // 0  | 0  | 0  | break
      // The paths above don't include the sticky mode special case. The loop ends after the
      // first completed match if not `global`.


      if (leftMatch || rightMatch) {
        delimStart = (leftMatch || rightMatch).index;
        delimEnd = delimStart + (leftMatch || rightMatch)[0].length;
      } else if (!openTokens) {
        break;
      }

      if (sticky && !openTokens && delimStart > lastOuterEnd) {
        break;
      }

      if (leftMatch) {
        if (!openTokens) {
          outerStart = delimStart;
          innerStart = delimEnd;
        }

        ++openTokens;
      } else if (rightMatch && openTokens) {
        if (! --openTokens) {
          if (vN) {
            if (vN[0] && outerStart > lastOuterEnd) {
              output.push(row(vN[0], str.slice(lastOuterEnd, outerStart), lastOuterEnd, outerStart));
            }

            if (vN[1]) {
              output.push(row(vN[1], str.slice(outerStart, innerStart), outerStart, innerStart));
            }

            if (vN[2]) {
              output.push(row(vN[2], str.slice(innerStart, delimStart), innerStart, delimStart));
            }

            if (vN[3]) {
              output.push(row(vN[3], str.slice(delimStart, delimEnd), delimStart, delimEnd));
            }
          } else {
            output.push(str.slice(innerStart, delimStart));
          }

          lastOuterEnd = delimEnd;

          if (!global) {
            break;
          }
        }
      } else {
        throw new Error('Unbalanced delimiter found in string');
      } // If the delimiter matched an empty string, avoid an infinite loop


      if (delimStart === delimEnd) {
        ++delimEnd;
      }
    }

    if (global && !sticky && vN && vN[0] && str.length > lastOuterEnd) {
      output.push(row(vN[0], str.slice(lastOuterEnd), lastOuterEnd, str.length));
    }

    return output;
  };
};

exports.default = _default;
module.exports = exports["default"];
});

unwrapExports(matchrecursive);

var unicodeBase = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _getIterator2 = interopRequireDefault(getIterator$1);

/*!
 * XRegExp Unicode Base 4.2.4
 * <xregexp.com>
 * Steven Levithan (c) 2008-present MIT License
 */
var _default = function _default(XRegExp) {
  /**
   * Adds base support for Unicode matching:
   * - Adds syntax `\p{..}` for matching Unicode tokens. Tokens can be inverted using `\P{..}` or
   *   `\p{^..}`. Token names ignore case, spaces, hyphens, and underscores. You can omit the
   *   braces for token names that are a single letter (e.g. `\pL` or `PL`).
   * - Adds flag A (astral), which enables 21-bit Unicode support.
   * - Adds the `XRegExp.addUnicodeData` method used by other addons to provide character data.
   *
   * Unicode Base relies on externally provided Unicode character data. Official addons are
   * available to provide data for Unicode categories, scripts, blocks, and properties.
   *
   * @requires XRegExp
   */
  // ==--------------------------==
  // Private stuff
  // ==--------------------------==
  // Storage for Unicode data
  var unicode = {}; // Reuse utils

  var dec = XRegExp._dec;
  var hex = XRegExp._hex;
  var pad4 = XRegExp._pad4; // Generates a token lookup name: lowercase, with hyphens, spaces, and underscores removed

  function normalize(name) {
    return name.replace(/[- _]+/g, '').toLowerCase();
  } // Gets the decimal code of a literal code unit, \xHH, \uHHHH, or a backslash-escaped literal


  function charCode(chr) {
    var esc = /^\\[xu](.+)/.exec(chr);
    return esc ? dec(esc[1]) : chr.charCodeAt(chr[0] === '\\' ? 1 : 0);
  } // Inverts a list of ordered BMP characters and ranges


  function invertBmp(range) {
    var output = '';
    var lastEnd = -1;
    XRegExp.forEach(range, /(\\x..|\\u....|\\?[\s\S])(?:-(\\x..|\\u....|\\?[\s\S]))?/, function (m) {
      var start = charCode(m[1]);

      if (start > lastEnd + 1) {
        output += "\\u".concat(pad4(hex(lastEnd + 1)));

        if (start > lastEnd + 2) {
          output += "-\\u".concat(pad4(hex(start - 1)));
        }
      }

      lastEnd = charCode(m[2] || m[1]);
    });

    if (lastEnd < 0xFFFF) {
      output += "\\u".concat(pad4(hex(lastEnd + 1)));

      if (lastEnd < 0xFFFE) {
        output += '-\\uFFFF';
      }
    }

    return output;
  } // Generates an inverted BMP range on first use


  function cacheInvertedBmp(slug) {
    var prop = 'b!';
    return unicode[slug][prop] || (unicode[slug][prop] = invertBmp(unicode[slug].bmp));
  } // Combines and optionally negates BMP and astral data


  function buildAstral(slug, isNegated) {
    var item = unicode[slug];
    var combined = '';

    if (item.bmp && !item.isBmpLast) {
      combined = "[".concat(item.bmp, "]").concat(item.astral ? '|' : '');
    }

    if (item.astral) {
      combined += item.astral;
    }

    if (item.isBmpLast && item.bmp) {
      combined += "".concat(item.astral ? '|' : '', "[").concat(item.bmp, "]");
    } // Astral Unicode tokens always match a code point, never a code unit


    return isNegated ? "(?:(?!".concat(combined, ")(?:[\uD800-\uDBFF][\uDC00-\uDFFF]|[\0-\uFFFF]))") : "(?:".concat(combined, ")");
  } // Builds a complete astral pattern on first use


  function cacheAstral(slug, isNegated) {
    var prop = isNegated ? 'a!' : 'a=';
    return unicode[slug][prop] || (unicode[slug][prop] = buildAstral(slug, isNegated));
  } // ==--------------------------==
  // Core functionality
  // ==--------------------------==

  /*
   * Add astral mode (flag A) and Unicode token syntax: `\p{..}`, `\P{..}`, `\p{^..}`, `\pC`.
   */


  XRegExp.addToken( // Use `*` instead of `+` to avoid capturing `^` as the token name in `\p{^}`
  /\\([pP])(?:{(\^?)([^}]*)}|([A-Za-z]))/, function (match, scope, flags) {
    var ERR_DOUBLE_NEG = 'Invalid double negation ';
    var ERR_UNKNOWN_NAME = 'Unknown Unicode token ';
    var ERR_UNKNOWN_REF = 'Unicode token missing data ';
    var ERR_ASTRAL_ONLY = 'Astral mode required for Unicode token ';
    var ERR_ASTRAL_IN_CLASS = 'Astral mode does not support Unicode tokens within character classes'; // Negated via \P{..} or \p{^..}

    var isNegated = match[1] === 'P' || !!match[2]; // Switch from BMP (0-FFFF) to astral (0-10FFFF) mode via flag A

    var isAstralMode = flags.indexOf('A') !== -1; // Token lookup name. Check `[4]` first to avoid passing `undefined` via `\p{}`

    var slug = normalize(match[4] || match[3]); // Token data object

    var item = unicode[slug];

    if (match[1] === 'P' && match[2]) {
      throw new SyntaxError(ERR_DOUBLE_NEG + match[0]);
    }

    if (!unicode.hasOwnProperty(slug)) {
      throw new SyntaxError(ERR_UNKNOWN_NAME + match[0]);
    } // Switch to the negated form of the referenced Unicode token


    if (item.inverseOf) {
      slug = normalize(item.inverseOf);

      if (!unicode.hasOwnProperty(slug)) {
        throw new ReferenceError("".concat(ERR_UNKNOWN_REF + match[0], " -> ").concat(item.inverseOf));
      }

      item = unicode[slug];
      isNegated = !isNegated;
    }

    if (!(item.bmp || isAstralMode)) {
      throw new SyntaxError(ERR_ASTRAL_ONLY + match[0]);
    }

    if (isAstralMode) {
      if (scope === 'class') {
        throw new SyntaxError(ERR_ASTRAL_IN_CLASS);
      }

      return cacheAstral(slug, isNegated);
    }

    return scope === 'class' ? isNegated ? cacheInvertedBmp(slug) : item.bmp : "".concat((isNegated ? '[^' : '[') + item.bmp, "]");
  }, {
    scope: 'all',
    optionalFlags: 'A',
    leadChar: '\\'
  });
  /**
   * Adds to the list of Unicode tokens that XRegExp regexes can match via `\p` or `\P`.
   *
   * @memberOf XRegExp
   * @param {Array} data Objects with named character ranges. Each object may have properties
   *   `name`, `alias`, `isBmpLast`, `inverseOf`, `bmp`, and `astral`. All but `name` are
   *   optional, although one of `bmp` or `astral` is required (unless `inverseOf` is set). If
   *   `astral` is absent, the `bmp` data is used for BMP and astral modes. If `bmp` is absent,
   *   the name errors in BMP mode but works in astral mode. If both `bmp` and `astral` are
   *   provided, the `bmp` data only is used in BMP mode, and the combination of `bmp` and
   *   `astral` data is used in astral mode. `isBmpLast` is needed when a token matches orphan
   *   high surrogates *and* uses surrogate pairs to match astral code points. The `bmp` and
   *   `astral` data should be a combination of literal characters and `\xHH` or `\uHHHH` escape
   *   sequences, with hyphens to create ranges. Any regex metacharacters in the data should be
   *   escaped, apart from range-creating hyphens. The `astral` data can additionally use
   *   character classes and alternation, and should use surrogate pairs to represent astral code
   *   points. `inverseOf` can be used to avoid duplicating character data if a Unicode token is
   *   defined as the exact inverse of another token.
   * @example
   *
   * // Basic use
   * XRegExp.addUnicodeData([{
   *   name: 'XDigit',
   *   alias: 'Hexadecimal',
   *   bmp: '0-9A-Fa-f'
   * }]);
   * XRegExp('\\p{XDigit}:\\p{Hexadecimal}+').test('0:3D'); // -> true
   */

  XRegExp.addUnicodeData = function (data) {
    var ERR_NO_NAME = 'Unicode token requires name';
    var ERR_NO_DATA = 'Unicode token has no character data ';
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = (0, _getIterator2.default)(data), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;

        if (!item.name) {
          throw new Error(ERR_NO_NAME);
        }

        if (!(item.inverseOf || item.bmp || item.astral)) {
          throw new Error(ERR_NO_DATA + item.name);
        }

        unicode[normalize(item.name)] = item;

        if (item.alias) {
          unicode[normalize(item.alias)] = item;
        }
      } // Reset the pattern cache used by the `XRegExp` constructor, since the same pattern and
      // flags might now produce different results

    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    XRegExp.cache.flush('patterns');
  };
  /**
   * @ignore
   *
   * Return a reference to the internal Unicode definition structure for the given Unicode
   * Property if the given name is a legal Unicode Property for use in XRegExp `\p` or `\P` regex
   * constructs.
   *
   * @memberOf XRegExp
   * @param {String} name Name by which the Unicode Property may be recognized (case-insensitive),
   *   e.g. `'N'` or `'Number'`. The given name is matched against all registered Unicode
   *   Properties and Property Aliases.
   * @returns {Object} Reference to definition structure when the name matches a Unicode Property.
   *
   * @note
   * For more info on Unicode Properties, see also http://unicode.org/reports/tr18/#Categories.
   *
   * @note
   * This method is *not* part of the officially documented API and may change or be removed in
   * the future. It is meant for userland code that wishes to reuse the (large) internal Unicode
   * structures set up by XRegExp.
   */


  XRegExp._getUnicodeProperty = function (name) {
    var slug = normalize(name);
    return unicode[slug];
  };
};

exports.default = _default;
module.exports = exports["default"];
});

unwrapExports(unicodeBase);

var blocks = [
    {
        'name': 'InAdlam',
        'astral': '\uD83A[\uDD00-\uDD5F]'
    },
    {
        'name': 'InAegean_Numbers',
        'astral': '\uD800[\uDD00-\uDD3F]'
    },
    {
        'name': 'InAhom',
        'astral': '\uD805[\uDF00-\uDF3F]'
    },
    {
        'name': 'InAlchemical_Symbols',
        'astral': '\uD83D[\uDF00-\uDF7F]'
    },
    {
        'name': 'InAlphabetic_Presentation_Forms',
        'bmp': '\uFB00-\uFB4F'
    },
    {
        'name': 'InAnatolian_Hieroglyphs',
        'astral': '\uD811[\uDC00-\uDE7F]'
    },
    {
        'name': 'InAncient_Greek_Musical_Notation',
        'astral': '\uD834[\uDE00-\uDE4F]'
    },
    {
        'name': 'InAncient_Greek_Numbers',
        'astral': '\uD800[\uDD40-\uDD8F]'
    },
    {
        'name': 'InAncient_Symbols',
        'astral': '\uD800[\uDD90-\uDDCF]'
    },
    {
        'name': 'InArabic',
        'bmp': '\u0600-\u06FF'
    },
    {
        'name': 'InArabic_Extended_A',
        'bmp': '\u08A0-\u08FF'
    },
    {
        'name': 'InArabic_Mathematical_Alphabetic_Symbols',
        'astral': '\uD83B[\uDE00-\uDEFF]'
    },
    {
        'name': 'InArabic_Presentation_Forms_A',
        'bmp': '\uFB50-\uFDFF'
    },
    {
        'name': 'InArabic_Presentation_Forms_B',
        'bmp': '\uFE70-\uFEFF'
    },
    {
        'name': 'InArabic_Supplement',
        'bmp': '\u0750-\u077F'
    },
    {
        'name': 'InArmenian',
        'bmp': '\u0530-\u058F'
    },
    {
        'name': 'InArrows',
        'bmp': '\u2190-\u21FF'
    },
    {
        'name': 'InAvestan',
        'astral': '\uD802[\uDF00-\uDF3F]'
    },
    {
        'name': 'InBalinese',
        'bmp': '\u1B00-\u1B7F'
    },
    {
        'name': 'InBamum',
        'bmp': '\uA6A0-\uA6FF'
    },
    {
        'name': 'InBamum_Supplement',
        'astral': '\uD81A[\uDC00-\uDE3F]'
    },
    {
        'name': 'InBasic_Latin',
        'bmp': '\0-\x7F'
    },
    {
        'name': 'InBassa_Vah',
        'astral': '\uD81A[\uDED0-\uDEFF]'
    },
    {
        'name': 'InBatak',
        'bmp': '\u1BC0-\u1BFF'
    },
    {
        'name': 'InBengali',
        'bmp': '\u0980-\u09FF'
    },
    {
        'name': 'InBhaiksuki',
        'astral': '\uD807[\uDC00-\uDC6F]'
    },
    {
        'name': 'InBlock_Elements',
        'bmp': '\u2580-\u259F'
    },
    {
        'name': 'InBopomofo',
        'bmp': '\u3100-\u312F'
    },
    {
        'name': 'InBopomofo_Extended',
        'bmp': '\u31A0-\u31BF'
    },
    {
        'name': 'InBox_Drawing',
        'bmp': '\u2500-\u257F'
    },
    {
        'name': 'InBrahmi',
        'astral': '\uD804[\uDC00-\uDC7F]'
    },
    {
        'name': 'InBraille_Patterns',
        'bmp': '\u2800-\u28FF'
    },
    {
        'name': 'InBuginese',
        'bmp': '\u1A00-\u1A1F'
    },
    {
        'name': 'InBuhid',
        'bmp': '\u1740-\u175F'
    },
    {
        'name': 'InByzantine_Musical_Symbols',
        'astral': '\uD834[\uDC00-\uDCFF]'
    },
    {
        'name': 'InCJK_Compatibility',
        'bmp': '\u3300-\u33FF'
    },
    {
        'name': 'InCJK_Compatibility_Forms',
        'bmp': '\uFE30-\uFE4F'
    },
    {
        'name': 'InCJK_Compatibility_Ideographs',
        'bmp': '\uF900-\uFAFF'
    },
    {
        'name': 'InCJK_Compatibility_Ideographs_Supplement',
        'astral': '\uD87E[\uDC00-\uDE1F]'
    },
    {
        'name': 'InCJK_Radicals_Supplement',
        'bmp': '\u2E80-\u2EFF'
    },
    {
        'name': 'InCJK_Strokes',
        'bmp': '\u31C0-\u31EF'
    },
    {
        'name': 'InCJK_Symbols_And_Punctuation',
        'bmp': '\u3000-\u303F'
    },
    {
        'name': 'InCJK_Unified_Ideographs',
        'bmp': '\u4E00-\u9FFF'
    },
    {
        'name': 'InCJK_Unified_Ideographs_Extension_A',
        'bmp': '\u3400-\u4DBF'
    },
    {
        'name': 'InCJK_Unified_Ideographs_Extension_B',
        'astral': '[\uD840-\uD868][\uDC00-\uDFFF]|\uD869[\uDC00-\uDEDF]'
    },
    {
        'name': 'InCJK_Unified_Ideographs_Extension_C',
        'astral': '\uD869[\uDF00-\uDFFF]|[\uD86A-\uD86C][\uDC00-\uDFFF]|\uD86D[\uDC00-\uDF3F]'
    },
    {
        'name': 'InCJK_Unified_Ideographs_Extension_D',
        'astral': '\uD86D[\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1F]'
    },
    {
        'name': 'InCJK_Unified_Ideographs_Extension_E',
        'astral': '\uD86E[\uDC20-\uDFFF]|[\uD86F-\uD872][\uDC00-\uDFFF]|\uD873[\uDC00-\uDEAF]'
    },
    {
        'name': 'InCJK_Unified_Ideographs_Extension_F',
        'astral': '\uD873[\uDEB0-\uDFFF]|[\uD874-\uD879][\uDC00-\uDFFF]|\uD87A[\uDC00-\uDFEF]'
    },
    {
        'name': 'InCarian',
        'astral': '\uD800[\uDEA0-\uDEDF]'
    },
    {
        'name': 'InCaucasian_Albanian',
        'astral': '\uD801[\uDD30-\uDD6F]'
    },
    {
        'name': 'InChakma',
        'astral': '\uD804[\uDD00-\uDD4F]'
    },
    {
        'name': 'InCham',
        'bmp': '\uAA00-\uAA5F'
    },
    {
        'name': 'InCherokee',
        'bmp': '\u13A0-\u13FF'
    },
    {
        'name': 'InCherokee_Supplement',
        'bmp': '\uAB70-\uABBF'
    },
    {
        'name': 'InChess_Symbols',
        'astral': '\uD83E[\uDE00-\uDE6F]'
    },
    {
        'name': 'InCombining_Diacritical_Marks',
        'bmp': '\u0300-\u036F'
    },
    {
        'name': 'InCombining_Diacritical_Marks_Extended',
        'bmp': '\u1AB0-\u1AFF'
    },
    {
        'name': 'InCombining_Diacritical_Marks_For_Symbols',
        'bmp': '\u20D0-\u20FF'
    },
    {
        'name': 'InCombining_Diacritical_Marks_Supplement',
        'bmp': '\u1DC0-\u1DFF'
    },
    {
        'name': 'InCombining_Half_Marks',
        'bmp': '\uFE20-\uFE2F'
    },
    {
        'name': 'InCommon_Indic_Number_Forms',
        'bmp': '\uA830-\uA83F'
    },
    {
        'name': 'InControl_Pictures',
        'bmp': '\u2400-\u243F'
    },
    {
        'name': 'InCoptic',
        'bmp': '\u2C80-\u2CFF'
    },
    {
        'name': 'InCoptic_Epact_Numbers',
        'astral': '\uD800[\uDEE0-\uDEFF]'
    },
    {
        'name': 'InCounting_Rod_Numerals',
        'astral': '\uD834[\uDF60-\uDF7F]'
    },
    {
        'name': 'InCuneiform',
        'astral': '\uD808[\uDC00-\uDFFF]'
    },
    {
        'name': 'InCuneiform_Numbers_And_Punctuation',
        'astral': '\uD809[\uDC00-\uDC7F]'
    },
    {
        'name': 'InCurrency_Symbols',
        'bmp': '\u20A0-\u20CF'
    },
    {
        'name': 'InCypriot_Syllabary',
        'astral': '\uD802[\uDC00-\uDC3F]'
    },
    {
        'name': 'InCyrillic',
        'bmp': '\u0400-\u04FF'
    },
    {
        'name': 'InCyrillic_Extended_A',
        'bmp': '\u2DE0-\u2DFF'
    },
    {
        'name': 'InCyrillic_Extended_B',
        'bmp': '\uA640-\uA69F'
    },
    {
        'name': 'InCyrillic_Extended_C',
        'bmp': '\u1C80-\u1C8F'
    },
    {
        'name': 'InCyrillic_Supplement',
        'bmp': '\u0500-\u052F'
    },
    {
        'name': 'InDeseret',
        'astral': '\uD801[\uDC00-\uDC4F]'
    },
    {
        'name': 'InDevanagari',
        'bmp': '\u0900-\u097F'
    },
    {
        'name': 'InDevanagari_Extended',
        'bmp': '\uA8E0-\uA8FF'
    },
    {
        'name': 'InDingbats',
        'bmp': '\u2700-\u27BF'
    },
    {
        'name': 'InDogra',
        'astral': '\uD806[\uDC00-\uDC4F]'
    },
    {
        'name': 'InDomino_Tiles',
        'astral': '\uD83C[\uDC30-\uDC9F]'
    },
    {
        'name': 'InDuployan',
        'astral': '\uD82F[\uDC00-\uDC9F]'
    },
    {
        'name': 'InEarly_Dynastic_Cuneiform',
        'astral': '\uD809[\uDC80-\uDD4F]'
    },
    {
        'name': 'InEgyptian_Hieroglyphs',
        'astral': '\uD80C[\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2F]'
    },
    {
        'name': 'InElbasan',
        'astral': '\uD801[\uDD00-\uDD2F]'
    },
    {
        'name': 'InEmoticons',
        'astral': '\uD83D[\uDE00-\uDE4F]'
    },
    {
        'name': 'InEnclosed_Alphanumeric_Supplement',
        'astral': '\uD83C[\uDD00-\uDDFF]'
    },
    {
        'name': 'InEnclosed_Alphanumerics',
        'bmp': '\u2460-\u24FF'
    },
    {
        'name': 'InEnclosed_CJK_Letters_And_Months',
        'bmp': '\u3200-\u32FF'
    },
    {
        'name': 'InEnclosed_Ideographic_Supplement',
        'astral': '\uD83C[\uDE00-\uDEFF]'
    },
    {
        'name': 'InEthiopic',
        'bmp': '\u1200-\u137F'
    },
    {
        'name': 'InEthiopic_Extended',
        'bmp': '\u2D80-\u2DDF'
    },
    {
        'name': 'InEthiopic_Extended_A',
        'bmp': '\uAB00-\uAB2F'
    },
    {
        'name': 'InEthiopic_Supplement',
        'bmp': '\u1380-\u139F'
    },
    {
        'name': 'InGeneral_Punctuation',
        'bmp': '\u2000-\u206F'
    },
    {
        'name': 'InGeometric_Shapes',
        'bmp': '\u25A0-\u25FF'
    },
    {
        'name': 'InGeometric_Shapes_Extended',
        'astral': '\uD83D[\uDF80-\uDFFF]'
    },
    {
        'name': 'InGeorgian',
        'bmp': '\u10A0-\u10FF'
    },
    {
        'name': 'InGeorgian_Extended',
        'bmp': '\u1C90-\u1CBF'
    },
    {
        'name': 'InGeorgian_Supplement',
        'bmp': '\u2D00-\u2D2F'
    },
    {
        'name': 'InGlagolitic',
        'bmp': '\u2C00-\u2C5F'
    },
    {
        'name': 'InGlagolitic_Supplement',
        'astral': '\uD838[\uDC00-\uDC2F]'
    },
    {
        'name': 'InGothic',
        'astral': '\uD800[\uDF30-\uDF4F]'
    },
    {
        'name': 'InGrantha',
        'astral': '\uD804[\uDF00-\uDF7F]'
    },
    {
        'name': 'InGreek_And_Coptic',
        'bmp': '\u0370-\u03FF'
    },
    {
        'name': 'InGreek_Extended',
        'bmp': '\u1F00-\u1FFF'
    },
    {
        'name': 'InGujarati',
        'bmp': '\u0A80-\u0AFF'
    },
    {
        'name': 'InGunjala_Gondi',
        'astral': '\uD807[\uDD60-\uDDAF]'
    },
    {
        'name': 'InGurmukhi',
        'bmp': '\u0A00-\u0A7F'
    },
    {
        'name': 'InHalfwidth_And_Fullwidth_Forms',
        'bmp': '\uFF00-\uFFEF'
    },
    {
        'name': 'InHangul_Compatibility_Jamo',
        'bmp': '\u3130-\u318F'
    },
    {
        'name': 'InHangul_Jamo',
        'bmp': '\u1100-\u11FF'
    },
    {
        'name': 'InHangul_Jamo_Extended_A',
        'bmp': '\uA960-\uA97F'
    },
    {
        'name': 'InHangul_Jamo_Extended_B',
        'bmp': '\uD7B0-\uD7FF'
    },
    {
        'name': 'InHangul_Syllables',
        'bmp': '\uAC00-\uD7AF'
    },
    {
        'name': 'InHanifi_Rohingya',
        'astral': '\uD803[\uDD00-\uDD3F]'
    },
    {
        'name': 'InHanunoo',
        'bmp': '\u1720-\u173F'
    },
    {
        'name': 'InHatran',
        'astral': '\uD802[\uDCE0-\uDCFF]'
    },
    {
        'name': 'InHebrew',
        'bmp': '\u0590-\u05FF'
    },
    {
        'name': 'InHigh_Private_Use_Surrogates',
        'bmp': '\uDB80-\uDBFF'
    },
    {
        'name': 'InHigh_Surrogates',
        'bmp': '\uD800-\uDB7F'
    },
    {
        'name': 'InHiragana',
        'bmp': '\u3040-\u309F'
    },
    {
        'name': 'InIPA_Extensions',
        'bmp': '\u0250-\u02AF'
    },
    {
        'name': 'InIdeographic_Description_Characters',
        'bmp': '\u2FF0-\u2FFF'
    },
    {
        'name': 'InIdeographic_Symbols_And_Punctuation',
        'astral': '\uD81B[\uDFE0-\uDFFF]'
    },
    {
        'name': 'InImperial_Aramaic',
        'astral': '\uD802[\uDC40-\uDC5F]'
    },
    {
        'name': 'InIndic_Siyaq_Numbers',
        'astral': '\uD83B[\uDC70-\uDCBF]'
    },
    {
        'name': 'InInscriptional_Pahlavi',
        'astral': '\uD802[\uDF60-\uDF7F]'
    },
    {
        'name': 'InInscriptional_Parthian',
        'astral': '\uD802[\uDF40-\uDF5F]'
    },
    {
        'name': 'InJavanese',
        'bmp': '\uA980-\uA9DF'
    },
    {
        'name': 'InKaithi',
        'astral': '\uD804[\uDC80-\uDCCF]'
    },
    {
        'name': 'InKana_Extended_A',
        'astral': '\uD82C[\uDD00-\uDD2F]'
    },
    {
        'name': 'InKana_Supplement',
        'astral': '\uD82C[\uDC00-\uDCFF]'
    },
    {
        'name': 'InKanbun',
        'bmp': '\u3190-\u319F'
    },
    {
        'name': 'InKangxi_Radicals',
        'bmp': '\u2F00-\u2FDF'
    },
    {
        'name': 'InKannada',
        'bmp': '\u0C80-\u0CFF'
    },
    {
        'name': 'InKatakana',
        'bmp': '\u30A0-\u30FF'
    },
    {
        'name': 'InKatakana_Phonetic_Extensions',
        'bmp': '\u31F0-\u31FF'
    },
    {
        'name': 'InKayah_Li',
        'bmp': '\uA900-\uA92F'
    },
    {
        'name': 'InKharoshthi',
        'astral': '\uD802[\uDE00-\uDE5F]'
    },
    {
        'name': 'InKhmer',
        'bmp': '\u1780-\u17FF'
    },
    {
        'name': 'InKhmer_Symbols',
        'bmp': '\u19E0-\u19FF'
    },
    {
        'name': 'InKhojki',
        'astral': '\uD804[\uDE00-\uDE4F]'
    },
    {
        'name': 'InKhudawadi',
        'astral': '\uD804[\uDEB0-\uDEFF]'
    },
    {
        'name': 'InLao',
        'bmp': '\u0E80-\u0EFF'
    },
    {
        'name': 'InLatin_1_Supplement',
        'bmp': '\x80-\xFF'
    },
    {
        'name': 'InLatin_Extended_A',
        'bmp': '\u0100-\u017F'
    },
    {
        'name': 'InLatin_Extended_Additional',
        'bmp': '\u1E00-\u1EFF'
    },
    {
        'name': 'InLatin_Extended_B',
        'bmp': '\u0180-\u024F'
    },
    {
        'name': 'InLatin_Extended_C',
        'bmp': '\u2C60-\u2C7F'
    },
    {
        'name': 'InLatin_Extended_D',
        'bmp': '\uA720-\uA7FF'
    },
    {
        'name': 'InLatin_Extended_E',
        'bmp': '\uAB30-\uAB6F'
    },
    {
        'name': 'InLepcha',
        'bmp': '\u1C00-\u1C4F'
    },
    {
        'name': 'InLetterlike_Symbols',
        'bmp': '\u2100-\u214F'
    },
    {
        'name': 'InLimbu',
        'bmp': '\u1900-\u194F'
    },
    {
        'name': 'InLinear_A',
        'astral': '\uD801[\uDE00-\uDF7F]'
    },
    {
        'name': 'InLinear_B_Ideograms',
        'astral': '\uD800[\uDC80-\uDCFF]'
    },
    {
        'name': 'InLinear_B_Syllabary',
        'astral': '\uD800[\uDC00-\uDC7F]'
    },
    {
        'name': 'InLisu',
        'bmp': '\uA4D0-\uA4FF'
    },
    {
        'name': 'InLow_Surrogates',
        'bmp': '\uDC00-\uDFFF'
    },
    {
        'name': 'InLycian',
        'astral': '\uD800[\uDE80-\uDE9F]'
    },
    {
        'name': 'InLydian',
        'astral': '\uD802[\uDD20-\uDD3F]'
    },
    {
        'name': 'InMahajani',
        'astral': '\uD804[\uDD50-\uDD7F]'
    },
    {
        'name': 'InMahjong_Tiles',
        'astral': '\uD83C[\uDC00-\uDC2F]'
    },
    {
        'name': 'InMakasar',
        'astral': '\uD807[\uDEE0-\uDEFF]'
    },
    {
        'name': 'InMalayalam',
        'bmp': '\u0D00-\u0D7F'
    },
    {
        'name': 'InMandaic',
        'bmp': '\u0840-\u085F'
    },
    {
        'name': 'InManichaean',
        'astral': '\uD802[\uDEC0-\uDEFF]'
    },
    {
        'name': 'InMarchen',
        'astral': '\uD807[\uDC70-\uDCBF]'
    },
    {
        'name': 'InMasaram_Gondi',
        'astral': '\uD807[\uDD00-\uDD5F]'
    },
    {
        'name': 'InMathematical_Alphanumeric_Symbols',
        'astral': '\uD835[\uDC00-\uDFFF]'
    },
    {
        'name': 'InMathematical_Operators',
        'bmp': '\u2200-\u22FF'
    },
    {
        'name': 'InMayan_Numerals',
        'astral': '\uD834[\uDEE0-\uDEFF]'
    },
    {
        'name': 'InMedefaidrin',
        'astral': '\uD81B[\uDE40-\uDE9F]'
    },
    {
        'name': 'InMeetei_Mayek',
        'bmp': '\uABC0-\uABFF'
    },
    {
        'name': 'InMeetei_Mayek_Extensions',
        'bmp': '\uAAE0-\uAAFF'
    },
    {
        'name': 'InMende_Kikakui',
        'astral': '\uD83A[\uDC00-\uDCDF]'
    },
    {
        'name': 'InMeroitic_Cursive',
        'astral': '\uD802[\uDDA0-\uDDFF]'
    },
    {
        'name': 'InMeroitic_Hieroglyphs',
        'astral': '\uD802[\uDD80-\uDD9F]'
    },
    {
        'name': 'InMiao',
        'astral': '\uD81B[\uDF00-\uDF9F]'
    },
    {
        'name': 'InMiscellaneous_Mathematical_Symbols_A',
        'bmp': '\u27C0-\u27EF'
    },
    {
        'name': 'InMiscellaneous_Mathematical_Symbols_B',
        'bmp': '\u2980-\u29FF'
    },
    {
        'name': 'InMiscellaneous_Symbols',
        'bmp': '\u2600-\u26FF'
    },
    {
        'name': 'InMiscellaneous_Symbols_And_Arrows',
        'bmp': '\u2B00-\u2BFF'
    },
    {
        'name': 'InMiscellaneous_Symbols_And_Pictographs',
        'astral': '\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF]'
    },
    {
        'name': 'InMiscellaneous_Technical',
        'bmp': '\u2300-\u23FF'
    },
    {
        'name': 'InModi',
        'astral': '\uD805[\uDE00-\uDE5F]'
    },
    {
        'name': 'InModifier_Tone_Letters',
        'bmp': '\uA700-\uA71F'
    },
    {
        'name': 'InMongolian',
        'bmp': '\u1800-\u18AF'
    },
    {
        'name': 'InMongolian_Supplement',
        'astral': '\uD805[\uDE60-\uDE7F]'
    },
    {
        'name': 'InMro',
        'astral': '\uD81A[\uDE40-\uDE6F]'
    },
    {
        'name': 'InMultani',
        'astral': '\uD804[\uDE80-\uDEAF]'
    },
    {
        'name': 'InMusical_Symbols',
        'astral': '\uD834[\uDD00-\uDDFF]'
    },
    {
        'name': 'InMyanmar',
        'bmp': '\u1000-\u109F'
    },
    {
        'name': 'InMyanmar_Extended_A',
        'bmp': '\uAA60-\uAA7F'
    },
    {
        'name': 'InMyanmar_Extended_B',
        'bmp': '\uA9E0-\uA9FF'
    },
    {
        'name': 'InNKo',
        'bmp': '\u07C0-\u07FF'
    },
    {
        'name': 'InNabataean',
        'astral': '\uD802[\uDC80-\uDCAF]'
    },
    {
        'name': 'InNew_Tai_Lue',
        'bmp': '\u1980-\u19DF'
    },
    {
        'name': 'InNewa',
        'astral': '\uD805[\uDC00-\uDC7F]'
    },
    {
        'name': 'InNumber_Forms',
        'bmp': '\u2150-\u218F'
    },
    {
        'name': 'InNushu',
        'astral': '\uD82C[\uDD70-\uDEFF]'
    },
    {
        'name': 'InOgham',
        'bmp': '\u1680-\u169F'
    },
    {
        'name': 'InOl_Chiki',
        'bmp': '\u1C50-\u1C7F'
    },
    {
        'name': 'InOld_Hungarian',
        'astral': '\uD803[\uDC80-\uDCFF]'
    },
    {
        'name': 'InOld_Italic',
        'astral': '\uD800[\uDF00-\uDF2F]'
    },
    {
        'name': 'InOld_North_Arabian',
        'astral': '\uD802[\uDE80-\uDE9F]'
    },
    {
        'name': 'InOld_Permic',
        'astral': '\uD800[\uDF50-\uDF7F]'
    },
    {
        'name': 'InOld_Persian',
        'astral': '\uD800[\uDFA0-\uDFDF]'
    },
    {
        'name': 'InOld_Sogdian',
        'astral': '\uD803[\uDF00-\uDF2F]'
    },
    {
        'name': 'InOld_South_Arabian',
        'astral': '\uD802[\uDE60-\uDE7F]'
    },
    {
        'name': 'InOld_Turkic',
        'astral': '\uD803[\uDC00-\uDC4F]'
    },
    {
        'name': 'InOptical_Character_Recognition',
        'bmp': '\u2440-\u245F'
    },
    {
        'name': 'InOriya',
        'bmp': '\u0B00-\u0B7F'
    },
    {
        'name': 'InOrnamental_Dingbats',
        'astral': '\uD83D[\uDE50-\uDE7F]'
    },
    {
        'name': 'InOsage',
        'astral': '\uD801[\uDCB0-\uDCFF]'
    },
    {
        'name': 'InOsmanya',
        'astral': '\uD801[\uDC80-\uDCAF]'
    },
    {
        'name': 'InPahawh_Hmong',
        'astral': '\uD81A[\uDF00-\uDF8F]'
    },
    {
        'name': 'InPalmyrene',
        'astral': '\uD802[\uDC60-\uDC7F]'
    },
    {
        'name': 'InPau_Cin_Hau',
        'astral': '\uD806[\uDEC0-\uDEFF]'
    },
    {
        'name': 'InPhags_Pa',
        'bmp': '\uA840-\uA87F'
    },
    {
        'name': 'InPhaistos_Disc',
        'astral': '\uD800[\uDDD0-\uDDFF]'
    },
    {
        'name': 'InPhoenician',
        'astral': '\uD802[\uDD00-\uDD1F]'
    },
    {
        'name': 'InPhonetic_Extensions',
        'bmp': '\u1D00-\u1D7F'
    },
    {
        'name': 'InPhonetic_Extensions_Supplement',
        'bmp': '\u1D80-\u1DBF'
    },
    {
        'name': 'InPlaying_Cards',
        'astral': '\uD83C[\uDCA0-\uDCFF]'
    },
    {
        'name': 'InPrivate_Use_Area',
        'bmp': '\uE000-\uF8FF'
    },
    {
        'name': 'InPsalter_Pahlavi',
        'astral': '\uD802[\uDF80-\uDFAF]'
    },
    {
        'name': 'InRejang',
        'bmp': '\uA930-\uA95F'
    },
    {
        'name': 'InRumi_Numeral_Symbols',
        'astral': '\uD803[\uDE60-\uDE7F]'
    },
    {
        'name': 'InRunic',
        'bmp': '\u16A0-\u16FF'
    },
    {
        'name': 'InSamaritan',
        'bmp': '\u0800-\u083F'
    },
    {
        'name': 'InSaurashtra',
        'bmp': '\uA880-\uA8DF'
    },
    {
        'name': 'InSharada',
        'astral': '\uD804[\uDD80-\uDDDF]'
    },
    {
        'name': 'InShavian',
        'astral': '\uD801[\uDC50-\uDC7F]'
    },
    {
        'name': 'InShorthand_Format_Controls',
        'astral': '\uD82F[\uDCA0-\uDCAF]'
    },
    {
        'name': 'InSiddham',
        'astral': '\uD805[\uDD80-\uDDFF]'
    },
    {
        'name': 'InSinhala',
        'bmp': '\u0D80-\u0DFF'
    },
    {
        'name': 'InSinhala_Archaic_Numbers',
        'astral': '\uD804[\uDDE0-\uDDFF]'
    },
    {
        'name': 'InSmall_Form_Variants',
        'bmp': '\uFE50-\uFE6F'
    },
    {
        'name': 'InSogdian',
        'astral': '\uD803[\uDF30-\uDF6F]'
    },
    {
        'name': 'InSora_Sompeng',
        'astral': '\uD804[\uDCD0-\uDCFF]'
    },
    {
        'name': 'InSoyombo',
        'astral': '\uD806[\uDE50-\uDEAF]'
    },
    {
        'name': 'InSpacing_Modifier_Letters',
        'bmp': '\u02B0-\u02FF'
    },
    {
        'name': 'InSpecials',
        'bmp': '\uFFF0-\uFFFF'
    },
    {
        'name': 'InSundanese',
        'bmp': '\u1B80-\u1BBF'
    },
    {
        'name': 'InSundanese_Supplement',
        'bmp': '\u1CC0-\u1CCF'
    },
    {
        'name': 'InSuperscripts_And_Subscripts',
        'bmp': '\u2070-\u209F'
    },
    {
        'name': 'InSupplemental_Arrows_A',
        'bmp': '\u27F0-\u27FF'
    },
    {
        'name': 'InSupplemental_Arrows_B',
        'bmp': '\u2900-\u297F'
    },
    {
        'name': 'InSupplemental_Arrows_C',
        'astral': '\uD83E[\uDC00-\uDCFF]'
    },
    {
        'name': 'InSupplemental_Mathematical_Operators',
        'bmp': '\u2A00-\u2AFF'
    },
    {
        'name': 'InSupplemental_Punctuation',
        'bmp': '\u2E00-\u2E7F'
    },
    {
        'name': 'InSupplemental_Symbols_And_Pictographs',
        'astral': '\uD83E[\uDD00-\uDDFF]'
    },
    {
        'name': 'InSupplementary_Private_Use_Area_A',
        'astral': '[\uDB80-\uDBBF][\uDC00-\uDFFF]'
    },
    {
        'name': 'InSupplementary_Private_Use_Area_B',
        'astral': '[\uDBC0-\uDBFF][\uDC00-\uDFFF]'
    },
    {
        'name': 'InSutton_SignWriting',
        'astral': '\uD836[\uDC00-\uDEAF]'
    },
    {
        'name': 'InSyloti_Nagri',
        'bmp': '\uA800-\uA82F'
    },
    {
        'name': 'InSyriac',
        'bmp': '\u0700-\u074F'
    },
    {
        'name': 'InSyriac_Supplement',
        'bmp': '\u0860-\u086F'
    },
    {
        'name': 'InTagalog',
        'bmp': '\u1700-\u171F'
    },
    {
        'name': 'InTagbanwa',
        'bmp': '\u1760-\u177F'
    },
    {
        'name': 'InTags',
        'astral': '\uDB40[\uDC00-\uDC7F]'
    },
    {
        'name': 'InTai_Le',
        'bmp': '\u1950-\u197F'
    },
    {
        'name': 'InTai_Tham',
        'bmp': '\u1A20-\u1AAF'
    },
    {
        'name': 'InTai_Viet',
        'bmp': '\uAA80-\uAADF'
    },
    {
        'name': 'InTai_Xuan_Jing_Symbols',
        'astral': '\uD834[\uDF00-\uDF5F]'
    },
    {
        'name': 'InTakri',
        'astral': '\uD805[\uDE80-\uDECF]'
    },
    {
        'name': 'InTamil',
        'bmp': '\u0B80-\u0BFF'
    },
    {
        'name': 'InTangut',
        'astral': '[\uD81C-\uD821][\uDC00-\uDFFF]'
    },
    {
        'name': 'InTangut_Components',
        'astral': '\uD822[\uDC00-\uDEFF]'
    },
    {
        'name': 'InTelugu',
        'bmp': '\u0C00-\u0C7F'
    },
    {
        'name': 'InThaana',
        'bmp': '\u0780-\u07BF'
    },
    {
        'name': 'InThai',
        'bmp': '\u0E00-\u0E7F'
    },
    {
        'name': 'InTibetan',
        'bmp': '\u0F00-\u0FFF'
    },
    {
        'name': 'InTifinagh',
        'bmp': '\u2D30-\u2D7F'
    },
    {
        'name': 'InTirhuta',
        'astral': '\uD805[\uDC80-\uDCDF]'
    },
    {
        'name': 'InTransport_And_Map_Symbols',
        'astral': '\uD83D[\uDE80-\uDEFF]'
    },
    {
        'name': 'InUgaritic',
        'astral': '\uD800[\uDF80-\uDF9F]'
    },
    {
        'name': 'InUnified_Canadian_Aboriginal_Syllabics',
        'bmp': '\u1400-\u167F'
    },
    {
        'name': 'InUnified_Canadian_Aboriginal_Syllabics_Extended',
        'bmp': '\u18B0-\u18FF'
    },
    {
        'name': 'InVai',
        'bmp': '\uA500-\uA63F'
    },
    {
        'name': 'InVariation_Selectors',
        'bmp': '\uFE00-\uFE0F'
    },
    {
        'name': 'InVariation_Selectors_Supplement',
        'astral': '\uDB40[\uDD00-\uDDEF]'
    },
    {
        'name': 'InVedic_Extensions',
        'bmp': '\u1CD0-\u1CFF'
    },
    {
        'name': 'InVertical_Forms',
        'bmp': '\uFE10-\uFE1F'
    },
    {
        'name': 'InWarang_Citi',
        'astral': '\uD806[\uDCA0-\uDCFF]'
    },
    {
        'name': 'InYi_Radicals',
        'bmp': '\uA490-\uA4CF'
    },
    {
        'name': 'InYi_Syllables',
        'bmp': '\uA000-\uA48F'
    },
    {
        'name': 'InYijing_Hexagram_Symbols',
        'bmp': '\u4DC0-\u4DFF'
    },
    {
        'name': 'InZanabazar_Square',
        'astral': '\uD806[\uDE00-\uDE4F]'
    }
];

var unicodeBlocks = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _blocks = interopRequireDefault(blocks);

/*!
 * XRegExp Unicode Blocks 4.2.4
 * <xregexp.com>
 * Steven Levithan (c) 2010-present MIT License
 * Unicode data by Mathias Bynens <mathiasbynens.be>
 */
var _default = function _default(XRegExp) {
  /**
   * Adds support for all Unicode blocks. Block names use the prefix 'In'. E.g.,
   * `\p{InBasicLatin}`. Token names are case insensitive, and any spaces, hyphens, and
   * underscores are ignored.
   *
   * Uses Unicode 11.0.0.
   *
   * @requires XRegExp, Unicode Base
   */
  if (!XRegExp.addUnicodeData) {
    throw new ReferenceError('Unicode Base must be loaded before Unicode Blocks');
  }

  XRegExp.addUnicodeData(_blocks.default);
};

exports.default = _default;
module.exports = exports["default"];
});

unwrapExports(unicodeBlocks);

var categories = [
    {
        'name': 'C',
        'alias': 'Other',
        'isBmpLast': true,
        'bmp': '\0-\x1F\x7F-\x9F\xAD\u0378\u0379\u0380-\u0383\u038B\u038D\u03A2\u0530\u0557\u0558\u058B\u058C\u0590\u05C8-\u05CF\u05EB-\u05EE\u05F5-\u0605\u061C\u061D\u06DD\u070E\u070F\u074B\u074C\u07B2-\u07BF\u07FB\u07FC\u082E\u082F\u083F\u085C\u085D\u085F\u086B-\u089F\u08B5\u08BE-\u08D2\u08E2\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09FF\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A77-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF2-\u0AF8\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B55\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B78-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BFB-\u0BFF\u0C0D\u0C11\u0C29\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5B-\u0C5F\u0C64\u0C65\u0C70-\u0C77\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0CFF\u0D04\u0D0D\u0D11\u0D45\u0D49\u0D50-\u0D53\u0D64\u0D65\u0D80\u0D81\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DE5\u0DF0\u0DF1\u0DF5-\u0E00\u0E3B-\u0E3E\u0E5C-\u0E80\u0E83\u0E85\u0E86\u0E89\u0E8B\u0E8C\u0E8E-\u0E93\u0E98\u0EA0\u0EA4\u0EA6\u0EA8\u0EA9\u0EAC\u0EBA\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F48\u0F6D-\u0F70\u0F98\u0FBD\u0FCD\u0FDB-\u0FFF\u10C6\u10C8-\u10CC\u10CE\u10CF\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u137D-\u137F\u139A-\u139F\u13F6\u13F7\u13FE\u13FF\u169D-\u169F\u16F9-\u16FF\u170D\u1715-\u171F\u1737-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17DE\u17DF\u17EA-\u17EF\u17FA-\u17FF\u180E\u180F\u181A-\u181F\u1879-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191F\u192C-\u192F\u193C-\u193F\u1941-\u1943\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19DD\u1A1C\u1A1D\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1A9F\u1AAE\u1AAF\u1ABF-\u1AFF\u1B4C-\u1B4F\u1B7D-\u1B7F\u1BF4-\u1BFB\u1C38-\u1C3A\u1C4A-\u1C4C\u1C89-\u1C8F\u1CBB\u1CBC\u1CC8-\u1CCF\u1CFA-\u1CFF\u1DFA\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FC5\u1FD4\u1FD5\u1FDC\u1FF0\u1FF1\u1FF5\u1FFF\u200B-\u200F\u202A-\u202E\u2060-\u206F\u2072\u2073\u208F\u209D-\u209F\u20C0-\u20CF\u20F1-\u20FF\u218C-\u218F\u2427-\u243F\u244B-\u245F\u2B74\u2B75\u2B96\u2B97\u2BC9\u2BFF\u2C2F\u2C5F\u2CF4-\u2CF8\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D71-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E4F-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u2FFC-\u2FFF\u3040\u3097\u3098\u3100-\u3104\u3130\u318F\u31BB-\u31BF\u31E4-\u31EF\u321F\u32FF\u4DB6-\u4DBF\u9FF0-\u9FFF\uA48D-\uA48F\uA4C7-\uA4CF\uA62C-\uA63F\uA6F8-\uA6FF\uA7BA-\uA7F6\uA82C-\uA82F\uA83A-\uA83F\uA878-\uA87F\uA8C6-\uA8CD\uA8DA-\uA8DF\uA954-\uA95E\uA97D-\uA97F\uA9CE\uA9DA-\uA9DD\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A\uAA5B\uAAC3-\uAADA\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F\uAB66-\uAB6F\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBC2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFE\uFDFF\uFE1A-\uFE1F\uFE53\uFE67\uFE6C-\uFE6F\uFE75\uFEFD-\uFF00\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFFB\uFFFE\uFFFF',
        'astral': '\uD800[\uDC0C\uDC27\uDC3B\uDC3E\uDC4E\uDC4F\uDC5E-\uDC7F\uDCFB-\uDCFF\uDD03-\uDD06\uDD34-\uDD36\uDD8F\uDD9C-\uDD9F\uDDA1-\uDDCF\uDDFE-\uDE7F\uDE9D-\uDE9F\uDED1-\uDEDF\uDEFC-\uDEFF\uDF24-\uDF2C\uDF4B-\uDF4F\uDF7B-\uDF7F\uDF9E\uDFC4-\uDFC7\uDFD6-\uDFFF]|\uD801[\uDC9E\uDC9F\uDCAA-\uDCAF\uDCD4-\uDCD7\uDCFC-\uDCFF\uDD28-\uDD2F\uDD64-\uDD6E\uDD70-\uDDFF\uDF37-\uDF3F\uDF56-\uDF5F\uDF68-\uDFFF]|\uD802[\uDC06\uDC07\uDC09\uDC36\uDC39-\uDC3B\uDC3D\uDC3E\uDC56\uDC9F-\uDCA6\uDCB0-\uDCDF\uDCF3\uDCF6-\uDCFA\uDD1C-\uDD1E\uDD3A-\uDD3E\uDD40-\uDD7F\uDDB8-\uDDBB\uDDD0\uDDD1\uDE04\uDE07-\uDE0B\uDE14\uDE18\uDE36\uDE37\uDE3B-\uDE3E\uDE49-\uDE4F\uDE59-\uDE5F\uDEA0-\uDEBF\uDEE7-\uDEEA\uDEF7-\uDEFF\uDF36-\uDF38\uDF56\uDF57\uDF73-\uDF77\uDF92-\uDF98\uDF9D-\uDFA8\uDFB0-\uDFFF]|\uD803[\uDC49-\uDC7F\uDCB3-\uDCBF\uDCF3-\uDCF9\uDD28-\uDD2F\uDD3A-\uDE5F\uDE7F-\uDEFF\uDF28-\uDF2F\uDF5A-\uDFFF]|\uD804[\uDC4E-\uDC51\uDC70-\uDC7E\uDCBD\uDCC2-\uDCCF\uDCE9-\uDCEF\uDCFA-\uDCFF\uDD35\uDD47-\uDD4F\uDD77-\uDD7F\uDDCE\uDDCF\uDDE0\uDDF5-\uDDFF\uDE12\uDE3F-\uDE7F\uDE87\uDE89\uDE8E\uDE9E\uDEAA-\uDEAF\uDEEB-\uDEEF\uDEFA-\uDEFF\uDF04\uDF0D\uDF0E\uDF11\uDF12\uDF29\uDF31\uDF34\uDF3A\uDF45\uDF46\uDF49\uDF4A\uDF4E\uDF4F\uDF51-\uDF56\uDF58-\uDF5C\uDF64\uDF65\uDF6D-\uDF6F\uDF75-\uDFFF]|\uD805[\uDC5A\uDC5C\uDC5F-\uDC7F\uDCC8-\uDCCF\uDCDA-\uDD7F\uDDB6\uDDB7\uDDDE-\uDDFF\uDE45-\uDE4F\uDE5A-\uDE5F\uDE6D-\uDE7F\uDEB8-\uDEBF\uDECA-\uDEFF\uDF1B\uDF1C\uDF2C-\uDF2F\uDF40-\uDFFF]|\uD806[\uDC3C-\uDC9F\uDCF3-\uDCFE\uDD00-\uDDFF\uDE48-\uDE4F\uDE84\uDE85\uDEA3-\uDEBF\uDEF9-\uDFFF]|\uD807[\uDC09\uDC37\uDC46-\uDC4F\uDC6D-\uDC6F\uDC90\uDC91\uDCA8\uDCB7-\uDCFF\uDD07\uDD0A\uDD37-\uDD39\uDD3B\uDD3E\uDD48-\uDD4F\uDD5A-\uDD5F\uDD66\uDD69\uDD8F\uDD92\uDD99-\uDD9F\uDDAA-\uDEDF\uDEF9-\uDFFF]|\uD808[\uDF9A-\uDFFF]|\uD809[\uDC6F\uDC75-\uDC7F\uDD44-\uDFFF]|[\uD80A\uD80B\uD80E-\uD810\uD812-\uD819\uD823-\uD82B\uD82D\uD82E\uD830-\uD833\uD837\uD839\uD83F\uD87B-\uD87D\uD87F-\uDB3F\uDB41-\uDBFF][\uDC00-\uDFFF]|\uD80D[\uDC2F-\uDFFF]|\uD811[\uDE47-\uDFFF]|\uD81A[\uDE39-\uDE3F\uDE5F\uDE6A-\uDE6D\uDE70-\uDECF\uDEEE\uDEEF\uDEF6-\uDEFF\uDF46-\uDF4F\uDF5A\uDF62\uDF78-\uDF7C\uDF90-\uDFFF]|\uD81B[\uDC00-\uDE3F\uDE9B-\uDEFF\uDF45-\uDF4F\uDF7F-\uDF8E\uDFA0-\uDFDF\uDFE2-\uDFFF]|\uD821[\uDFF2-\uDFFF]|\uD822[\uDEF3-\uDFFF]|\uD82C[\uDD1F-\uDD6F\uDEFC-\uDFFF]|\uD82F[\uDC6B-\uDC6F\uDC7D-\uDC7F\uDC89-\uDC8F\uDC9A\uDC9B\uDCA0-\uDFFF]|\uD834[\uDCF6-\uDCFF\uDD27\uDD28\uDD73-\uDD7A\uDDE9-\uDDFF\uDE46-\uDEDF\uDEF4-\uDEFF\uDF57-\uDF5F\uDF79-\uDFFF]|\uD835[\uDC55\uDC9D\uDCA0\uDCA1\uDCA3\uDCA4\uDCA7\uDCA8\uDCAD\uDCBA\uDCBC\uDCC4\uDD06\uDD0B\uDD0C\uDD15\uDD1D\uDD3A\uDD3F\uDD45\uDD47-\uDD49\uDD51\uDEA6\uDEA7\uDFCC\uDFCD]|\uD836[\uDE8C-\uDE9A\uDEA0\uDEB0-\uDFFF]|\uD838[\uDC07\uDC19\uDC1A\uDC22\uDC25\uDC2B-\uDFFF]|\uD83A[\uDCC5\uDCC6\uDCD7-\uDCFF\uDD4B-\uDD4F\uDD5A-\uDD5D\uDD60-\uDFFF]|\uD83B[\uDC00-\uDC70\uDCB5-\uDDFF\uDE04\uDE20\uDE23\uDE25\uDE26\uDE28\uDE33\uDE38\uDE3A\uDE3C-\uDE41\uDE43-\uDE46\uDE48\uDE4A\uDE4C\uDE50\uDE53\uDE55\uDE56\uDE58\uDE5A\uDE5C\uDE5E\uDE60\uDE63\uDE65\uDE66\uDE6B\uDE73\uDE78\uDE7D\uDE7F\uDE8A\uDE9C-\uDEA0\uDEA4\uDEAA\uDEBC-\uDEEF\uDEF2-\uDFFF]|\uD83C[\uDC2C-\uDC2F\uDC94-\uDC9F\uDCAF\uDCB0\uDCC0\uDCD0\uDCF6-\uDCFF\uDD0D-\uDD0F\uDD6C-\uDD6F\uDDAD-\uDDE5\uDE03-\uDE0F\uDE3C-\uDE3F\uDE49-\uDE4F\uDE52-\uDE5F\uDE66-\uDEFF]|\uD83D[\uDED5-\uDEDF\uDEED-\uDEEF\uDEFA-\uDEFF\uDF74-\uDF7F\uDFD9-\uDFFF]|\uD83E[\uDC0C-\uDC0F\uDC48-\uDC4F\uDC5A-\uDC5F\uDC88-\uDC8F\uDCAE-\uDCFF\uDD0C-\uDD0F\uDD3F\uDD71\uDD72\uDD77-\uDD79\uDD7B\uDDA3-\uDDAF\uDDBA-\uDDBF\uDDC3-\uDDCF\uDE00-\uDE5F\uDE6E-\uDFFF]|\uD869[\uDED7-\uDEFF]|\uD86D[\uDF35-\uDF3F]|\uD86E[\uDC1E\uDC1F]|\uD873[\uDEA2-\uDEAF]|\uD87A[\uDFE1-\uDFFF]|\uD87E[\uDE1E-\uDFFF]|\uDB40[\uDC00-\uDCFF\uDDF0-\uDFFF]'
    },
    {
        'name': 'Cc',
        'alias': 'Control',
        'bmp': '\0-\x1F\x7F-\x9F'
    },
    {
        'name': 'Cf',
        'alias': 'Format',
        'bmp': '\xAD\u0600-\u0605\u061C\u06DD\u070F\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB',
        'astral': '\uD804[\uDCBD\uDCCD]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]'
    },
    {
        'name': 'Cn',
        'alias': 'Unassigned',
        'bmp': '\u0378\u0379\u0380-\u0383\u038B\u038D\u03A2\u0530\u0557\u0558\u058B\u058C\u0590\u05C8-\u05CF\u05EB-\u05EE\u05F5-\u05FF\u061D\u070E\u074B\u074C\u07B2-\u07BF\u07FB\u07FC\u082E\u082F\u083F\u085C\u085D\u085F\u086B-\u089F\u08B5\u08BE-\u08D2\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09FF\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A77-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF2-\u0AF8\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B55\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B78-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BFB-\u0BFF\u0C0D\u0C11\u0C29\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5B-\u0C5F\u0C64\u0C65\u0C70-\u0C77\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0CFF\u0D04\u0D0D\u0D11\u0D45\u0D49\u0D50-\u0D53\u0D64\u0D65\u0D80\u0D81\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DE5\u0DF0\u0DF1\u0DF5-\u0E00\u0E3B-\u0E3E\u0E5C-\u0E80\u0E83\u0E85\u0E86\u0E89\u0E8B\u0E8C\u0E8E-\u0E93\u0E98\u0EA0\u0EA4\u0EA6\u0EA8\u0EA9\u0EAC\u0EBA\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F48\u0F6D-\u0F70\u0F98\u0FBD\u0FCD\u0FDB-\u0FFF\u10C6\u10C8-\u10CC\u10CE\u10CF\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u137D-\u137F\u139A-\u139F\u13F6\u13F7\u13FE\u13FF\u169D-\u169F\u16F9-\u16FF\u170D\u1715-\u171F\u1737-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17DE\u17DF\u17EA-\u17EF\u17FA-\u17FF\u180F\u181A-\u181F\u1879-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191F\u192C-\u192F\u193C-\u193F\u1941-\u1943\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19DD\u1A1C\u1A1D\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1A9F\u1AAE\u1AAF\u1ABF-\u1AFF\u1B4C-\u1B4F\u1B7D-\u1B7F\u1BF4-\u1BFB\u1C38-\u1C3A\u1C4A-\u1C4C\u1C89-\u1C8F\u1CBB\u1CBC\u1CC8-\u1CCF\u1CFA-\u1CFF\u1DFA\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FC5\u1FD4\u1FD5\u1FDC\u1FF0\u1FF1\u1FF5\u1FFF\u2065\u2072\u2073\u208F\u209D-\u209F\u20C0-\u20CF\u20F1-\u20FF\u218C-\u218F\u2427-\u243F\u244B-\u245F\u2B74\u2B75\u2B96\u2B97\u2BC9\u2BFF\u2C2F\u2C5F\u2CF4-\u2CF8\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D71-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E4F-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u2FFC-\u2FFF\u3040\u3097\u3098\u3100-\u3104\u3130\u318F\u31BB-\u31BF\u31E4-\u31EF\u321F\u32FF\u4DB6-\u4DBF\u9FF0-\u9FFF\uA48D-\uA48F\uA4C7-\uA4CF\uA62C-\uA63F\uA6F8-\uA6FF\uA7BA-\uA7F6\uA82C-\uA82F\uA83A-\uA83F\uA878-\uA87F\uA8C6-\uA8CD\uA8DA-\uA8DF\uA954-\uA95E\uA97D-\uA97F\uA9CE\uA9DA-\uA9DD\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A\uAA5B\uAAC3-\uAADA\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F\uAB66-\uAB6F\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uD7FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBC2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFE\uFDFF\uFE1A-\uFE1F\uFE53\uFE67\uFE6C-\uFE6F\uFE75\uFEFD\uFEFE\uFF00\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFF8\uFFFE\uFFFF',
        'astral': '\uD800[\uDC0C\uDC27\uDC3B\uDC3E\uDC4E\uDC4F\uDC5E-\uDC7F\uDCFB-\uDCFF\uDD03-\uDD06\uDD34-\uDD36\uDD8F\uDD9C-\uDD9F\uDDA1-\uDDCF\uDDFE-\uDE7F\uDE9D-\uDE9F\uDED1-\uDEDF\uDEFC-\uDEFF\uDF24-\uDF2C\uDF4B-\uDF4F\uDF7B-\uDF7F\uDF9E\uDFC4-\uDFC7\uDFD6-\uDFFF]|\uD801[\uDC9E\uDC9F\uDCAA-\uDCAF\uDCD4-\uDCD7\uDCFC-\uDCFF\uDD28-\uDD2F\uDD64-\uDD6E\uDD70-\uDDFF\uDF37-\uDF3F\uDF56-\uDF5F\uDF68-\uDFFF]|\uD802[\uDC06\uDC07\uDC09\uDC36\uDC39-\uDC3B\uDC3D\uDC3E\uDC56\uDC9F-\uDCA6\uDCB0-\uDCDF\uDCF3\uDCF6-\uDCFA\uDD1C-\uDD1E\uDD3A-\uDD3E\uDD40-\uDD7F\uDDB8-\uDDBB\uDDD0\uDDD1\uDE04\uDE07-\uDE0B\uDE14\uDE18\uDE36\uDE37\uDE3B-\uDE3E\uDE49-\uDE4F\uDE59-\uDE5F\uDEA0-\uDEBF\uDEE7-\uDEEA\uDEF7-\uDEFF\uDF36-\uDF38\uDF56\uDF57\uDF73-\uDF77\uDF92-\uDF98\uDF9D-\uDFA8\uDFB0-\uDFFF]|\uD803[\uDC49-\uDC7F\uDCB3-\uDCBF\uDCF3-\uDCF9\uDD28-\uDD2F\uDD3A-\uDE5F\uDE7F-\uDEFF\uDF28-\uDF2F\uDF5A-\uDFFF]|\uD804[\uDC4E-\uDC51\uDC70-\uDC7E\uDCC2-\uDCCC\uDCCE\uDCCF\uDCE9-\uDCEF\uDCFA-\uDCFF\uDD35\uDD47-\uDD4F\uDD77-\uDD7F\uDDCE\uDDCF\uDDE0\uDDF5-\uDDFF\uDE12\uDE3F-\uDE7F\uDE87\uDE89\uDE8E\uDE9E\uDEAA-\uDEAF\uDEEB-\uDEEF\uDEFA-\uDEFF\uDF04\uDF0D\uDF0E\uDF11\uDF12\uDF29\uDF31\uDF34\uDF3A\uDF45\uDF46\uDF49\uDF4A\uDF4E\uDF4F\uDF51-\uDF56\uDF58-\uDF5C\uDF64\uDF65\uDF6D-\uDF6F\uDF75-\uDFFF]|\uD805[\uDC5A\uDC5C\uDC5F-\uDC7F\uDCC8-\uDCCF\uDCDA-\uDD7F\uDDB6\uDDB7\uDDDE-\uDDFF\uDE45-\uDE4F\uDE5A-\uDE5F\uDE6D-\uDE7F\uDEB8-\uDEBF\uDECA-\uDEFF\uDF1B\uDF1C\uDF2C-\uDF2F\uDF40-\uDFFF]|\uD806[\uDC3C-\uDC9F\uDCF3-\uDCFE\uDD00-\uDDFF\uDE48-\uDE4F\uDE84\uDE85\uDEA3-\uDEBF\uDEF9-\uDFFF]|\uD807[\uDC09\uDC37\uDC46-\uDC4F\uDC6D-\uDC6F\uDC90\uDC91\uDCA8\uDCB7-\uDCFF\uDD07\uDD0A\uDD37-\uDD39\uDD3B\uDD3E\uDD48-\uDD4F\uDD5A-\uDD5F\uDD66\uDD69\uDD8F\uDD92\uDD99-\uDD9F\uDDAA-\uDEDF\uDEF9-\uDFFF]|\uD808[\uDF9A-\uDFFF]|\uD809[\uDC6F\uDC75-\uDC7F\uDD44-\uDFFF]|[\uD80A\uD80B\uD80E-\uD810\uD812-\uD819\uD823-\uD82B\uD82D\uD82E\uD830-\uD833\uD837\uD839\uD83F\uD87B-\uD87D\uD87F-\uDB3F\uDB41-\uDB7F][\uDC00-\uDFFF]|\uD80D[\uDC2F-\uDFFF]|\uD811[\uDE47-\uDFFF]|\uD81A[\uDE39-\uDE3F\uDE5F\uDE6A-\uDE6D\uDE70-\uDECF\uDEEE\uDEEF\uDEF6-\uDEFF\uDF46-\uDF4F\uDF5A\uDF62\uDF78-\uDF7C\uDF90-\uDFFF]|\uD81B[\uDC00-\uDE3F\uDE9B-\uDEFF\uDF45-\uDF4F\uDF7F-\uDF8E\uDFA0-\uDFDF\uDFE2-\uDFFF]|\uD821[\uDFF2-\uDFFF]|\uD822[\uDEF3-\uDFFF]|\uD82C[\uDD1F-\uDD6F\uDEFC-\uDFFF]|\uD82F[\uDC6B-\uDC6F\uDC7D-\uDC7F\uDC89-\uDC8F\uDC9A\uDC9B\uDCA4-\uDFFF]|\uD834[\uDCF6-\uDCFF\uDD27\uDD28\uDDE9-\uDDFF\uDE46-\uDEDF\uDEF4-\uDEFF\uDF57-\uDF5F\uDF79-\uDFFF]|\uD835[\uDC55\uDC9D\uDCA0\uDCA1\uDCA3\uDCA4\uDCA7\uDCA8\uDCAD\uDCBA\uDCBC\uDCC4\uDD06\uDD0B\uDD0C\uDD15\uDD1D\uDD3A\uDD3F\uDD45\uDD47-\uDD49\uDD51\uDEA6\uDEA7\uDFCC\uDFCD]|\uD836[\uDE8C-\uDE9A\uDEA0\uDEB0-\uDFFF]|\uD838[\uDC07\uDC19\uDC1A\uDC22\uDC25\uDC2B-\uDFFF]|\uD83A[\uDCC5\uDCC6\uDCD7-\uDCFF\uDD4B-\uDD4F\uDD5A-\uDD5D\uDD60-\uDFFF]|\uD83B[\uDC00-\uDC70\uDCB5-\uDDFF\uDE04\uDE20\uDE23\uDE25\uDE26\uDE28\uDE33\uDE38\uDE3A\uDE3C-\uDE41\uDE43-\uDE46\uDE48\uDE4A\uDE4C\uDE50\uDE53\uDE55\uDE56\uDE58\uDE5A\uDE5C\uDE5E\uDE60\uDE63\uDE65\uDE66\uDE6B\uDE73\uDE78\uDE7D\uDE7F\uDE8A\uDE9C-\uDEA0\uDEA4\uDEAA\uDEBC-\uDEEF\uDEF2-\uDFFF]|\uD83C[\uDC2C-\uDC2F\uDC94-\uDC9F\uDCAF\uDCB0\uDCC0\uDCD0\uDCF6-\uDCFF\uDD0D-\uDD0F\uDD6C-\uDD6F\uDDAD-\uDDE5\uDE03-\uDE0F\uDE3C-\uDE3F\uDE49-\uDE4F\uDE52-\uDE5F\uDE66-\uDEFF]|\uD83D[\uDED5-\uDEDF\uDEED-\uDEEF\uDEFA-\uDEFF\uDF74-\uDF7F\uDFD9-\uDFFF]|\uD83E[\uDC0C-\uDC0F\uDC48-\uDC4F\uDC5A-\uDC5F\uDC88-\uDC8F\uDCAE-\uDCFF\uDD0C-\uDD0F\uDD3F\uDD71\uDD72\uDD77-\uDD79\uDD7B\uDDA3-\uDDAF\uDDBA-\uDDBF\uDDC3-\uDDCF\uDE00-\uDE5F\uDE6E-\uDFFF]|\uD869[\uDED7-\uDEFF]|\uD86D[\uDF35-\uDF3F]|\uD86E[\uDC1E\uDC1F]|\uD873[\uDEA2-\uDEAF]|\uD87A[\uDFE1-\uDFFF]|\uD87E[\uDE1E-\uDFFF]|\uDB40[\uDC00\uDC02-\uDC1F\uDC80-\uDCFF\uDDF0-\uDFFF]|[\uDBBF\uDBFF][\uDFFE\uDFFF]'
    },
    {
        'name': 'Co',
        'alias': 'Private_Use',
        'bmp': '\uE000-\uF8FF',
        'astral': '[\uDB80-\uDBBE\uDBC0-\uDBFE][\uDC00-\uDFFF]|[\uDBBF\uDBFF][\uDC00-\uDFFD]'
    },
    {
        'name': 'Cs',
        'alias': 'Surrogate',
        'bmp': '\uD800-\uDFFF'
    },
    {
        'name': 'L',
        'alias': 'Letter',
        'bmp': 'A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEF\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7B9\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC',
        'astral': '\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD23\uDF00-\uDF1C\uDF27\uDF30-\uDF45]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD44\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF1A]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCDF\uDCFF\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE83\uDE86-\uDE89\uDE9D\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDEE0-\uDEF2]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE7F\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFF1]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]'
    },
    {
        'name': 'LC',
        'alias': 'Cased_Letter',
        'bmp': 'A-Za-z\xB5\xC0-\xD6\xD8-\xF6\xF8-\u01BA\u01BC-\u01BF\u01C4-\u0293\u0295-\u02AF\u0370-\u0373\u0376\u0377\u037B-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0560-\u0588\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FD-\u10FF\u13A0-\u13F5\u13F8-\u13FD\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2134\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2C7B\u2C7E-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA640-\uA66D\uA680-\uA69B\uA722-\uA76F\uA771-\uA787\uA78B-\uA78E\uA790-\uA7B9\uA7FA\uAB30-\uAB5A\uAB60-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF21-\uFF3A\uFF41-\uFF5A',
        'astral': '\uD801[\uDC00-\uDC4F\uDCB0-\uDCD3\uDCD8-\uDCFB]|\uD803[\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD806[\uDCA0-\uDCDF]|\uD81B[\uDE40-\uDE7F]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDD00-\uDD43]'
    },
    {
        'name': 'Ll',
        'alias': 'Lowercase_Letter',
        'bmp': 'a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0560-\u0588\u10D0-\u10FA\u10FD-\u10FF\u13F8-\u13FD\u1C80-\u1C88\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7AF\uA7B5\uA7B7\uA7B9\uA7FA\uAB30-\uAB5A\uAB60-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A',
        'astral': '\uD801[\uDC28-\uDC4F\uDCD8-\uDCFB]|\uD803[\uDCC0-\uDCF2]|\uD806[\uDCC0-\uDCDF]|\uD81B[\uDE60-\uDE7F]|\uD835[\uDC1A-\uDC33\uDC4E-\uDC54\uDC56-\uDC67\uDC82-\uDC9B\uDCB6-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDCCF\uDCEA-\uDD03\uDD1E-\uDD37\uDD52-\uDD6B\uDD86-\uDD9F\uDDBA-\uDDD3\uDDEE-\uDE07\uDE22-\uDE3B\uDE56-\uDE6F\uDE8A-\uDEA5\uDEC2-\uDEDA\uDEDC-\uDEE1\uDEFC-\uDF14\uDF16-\uDF1B\uDF36-\uDF4E\uDF50-\uDF55\uDF70-\uDF88\uDF8A-\uDF8F\uDFAA-\uDFC2\uDFC4-\uDFC9\uDFCB]|\uD83A[\uDD22-\uDD43]'
    },
    {
        'name': 'Lm',
        'alias': 'Modifier_Letter',
        'bmp': '\u02B0-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0374\u037A\u0559\u0640\u06E5\u06E6\u07F4\u07F5\u07FA\u081A\u0824\u0828\u0971\u0E46\u0EC6\u10FC\u17D7\u1843\u1AA7\u1C78-\u1C7D\u1D2C-\u1D6A\u1D78\u1D9B-\u1DBF\u2071\u207F\u2090-\u209C\u2C7C\u2C7D\u2D6F\u2E2F\u3005\u3031-\u3035\u303B\u309D\u309E\u30FC-\u30FE\uA015\uA4F8-\uA4FD\uA60C\uA67F\uA69C\uA69D\uA717-\uA71F\uA770\uA788\uA7F8\uA7F9\uA9CF\uA9E6\uAA70\uAADD\uAAF3\uAAF4\uAB5C-\uAB5F\uFF70\uFF9E\uFF9F',
        'astral': '\uD81A[\uDF40-\uDF43]|\uD81B[\uDF93-\uDF9F\uDFE0\uDFE1]'
    },
    {
        'name': 'Lo',
        'alias': 'Other_Letter',
        'bmp': '\xAA\xBA\u01BB\u01C0-\u01C3\u0294\u05D0-\u05EA\u05EF-\u05F2\u0620-\u063F\u0641-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u0800-\u0815\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0972-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E45\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u1100-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17DC\u1820-\u1842\u1844-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C77\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u2135-\u2138\u2D30-\u2D67\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3006\u303C\u3041-\u3096\u309F\u30A1-\u30FA\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEF\uA000-\uA014\uA016-\uA48C\uA4D0-\uA4F7\uA500-\uA60B\uA610-\uA61F\uA62A\uA62B\uA66E\uA6A0-\uA6E5\uA78F\uA7F7\uA7FB-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9E0-\uA9E4\uA9E7-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA6F\uAA71-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB\uAADC\uAAE0-\uAAEA\uAAF2\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF66-\uFF6F\uFF71-\uFF9D\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC',
        'astral': '\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC50-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDD00-\uDD23\uDF00-\uDF1C\uDF27\uDF30-\uDF45]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD44\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF1A]|\uD806[\uDC00-\uDC2B\uDCFF\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE83\uDE86-\uDE89\uDE9D\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDEE0-\uDEF2]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50]|\uD821[\uDC00-\uDFF1]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]'
    },
    {
        'name': 'Lt',
        'alias': 'Titlecase_Letter',
        'bmp': '\u01C5\u01C8\u01CB\u01F2\u1F88-\u1F8F\u1F98-\u1F9F\u1FA8-\u1FAF\u1FBC\u1FCC\u1FFC'
    },
    {
        'name': 'Lu',
        'alias': 'Uppercase_Letter',
        'bmp': 'A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1C90-\u1CBA\u1CBD-\u1CBF\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AE\uA7B0-\uA7B4\uA7B6\uA7B8\uFF21-\uFF3A',
        'astral': '\uD801[\uDC00-\uDC27\uDCB0-\uDCD3]|\uD803[\uDC80-\uDCB2]|\uD806[\uDCA0-\uDCBF]|\uD81B[\uDE40-\uDE5F]|\uD835[\uDC00-\uDC19\uDC34-\uDC4D\uDC68-\uDC81\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB5\uDCD0-\uDCE9\uDD04\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD38\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD6C-\uDD85\uDDA0-\uDDB9\uDDD4-\uDDED\uDE08-\uDE21\uDE3C-\uDE55\uDE70-\uDE89\uDEA8-\uDEC0\uDEE2-\uDEFA\uDF1C-\uDF34\uDF56-\uDF6E\uDF90-\uDFA8\uDFCA]|\uD83A[\uDD00-\uDD21]'
    },
    {
        'name': 'M',
        'alias': 'Mark',
        'bmp': '\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D3-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C04\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u1885\u1886\u18A9\u1920-\u192B\u1930-\u193B\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F',
        'astral': '\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD803[\uDD24-\uDD27\uDF46-\uDF50]|\uD804[\uDC00-\uDC02\uDC38-\uDC46\uDC7F-\uDC82\uDCB0-\uDCBA\uDD00-\uDD02\uDD27-\uDD34\uDD45\uDD46\uDD73\uDD80-\uDD82\uDDB3-\uDDC0\uDDC9-\uDDCC\uDE2C-\uDE37\uDE3E\uDEDF-\uDEEA\uDF00-\uDF03\uDF3B\uDF3C\uDF3E-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF57\uDF62\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC35-\uDC46\uDC5E\uDCB0-\uDCC3\uDDAF-\uDDB5\uDDB8-\uDDC0\uDDDC\uDDDD\uDE30-\uDE40\uDEAB-\uDEB7\uDF1D-\uDF2B]|\uD806[\uDC2C-\uDC3A\uDE01-\uDE0A\uDE33-\uDE39\uDE3B-\uDE3E\uDE47\uDE51-\uDE5B\uDE8A-\uDE99]|\uD807[\uDC2F-\uDC36\uDC38-\uDC3F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD31-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD45\uDD47\uDD8A-\uDD8E\uDD90\uDD91\uDD93-\uDD97\uDEF3-\uDEF6]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF51-\uDF7E\uDF8F-\uDF92]|\uD82F[\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDCD0-\uDCD6\uDD44-\uDD4A]|\uDB40[\uDD00-\uDDEF]'
    },
    {
        'name': 'Mc',
        'alias': 'Spacing_Mark',
        'bmp': '\u0903\u093B\u093E-\u0940\u0949-\u094C\u094E\u094F\u0982\u0983\u09BE-\u09C0\u09C7\u09C8\u09CB\u09CC\u09D7\u0A03\u0A3E-\u0A40\u0A83\u0ABE-\u0AC0\u0AC9\u0ACB\u0ACC\u0B02\u0B03\u0B3E\u0B40\u0B47\u0B48\u0B4B\u0B4C\u0B57\u0BBE\u0BBF\u0BC1\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCC\u0BD7\u0C01-\u0C03\u0C41-\u0C44\u0C82\u0C83\u0CBE\u0CC0-\u0CC4\u0CC7\u0CC8\u0CCA\u0CCB\u0CD5\u0CD6\u0D02\u0D03\u0D3E-\u0D40\u0D46-\u0D48\u0D4A-\u0D4C\u0D57\u0D82\u0D83\u0DCF-\u0DD1\u0DD8-\u0DDF\u0DF2\u0DF3\u0F3E\u0F3F\u0F7F\u102B\u102C\u1031\u1038\u103B\u103C\u1056\u1057\u1062-\u1064\u1067-\u106D\u1083\u1084\u1087-\u108C\u108F\u109A-\u109C\u17B6\u17BE-\u17C5\u17C7\u17C8\u1923-\u1926\u1929-\u192B\u1930\u1931\u1933-\u1938\u1A19\u1A1A\u1A55\u1A57\u1A61\u1A63\u1A64\u1A6D-\u1A72\u1B04\u1B35\u1B3B\u1B3D-\u1B41\u1B43\u1B44\u1B82\u1BA1\u1BA6\u1BA7\u1BAA\u1BE7\u1BEA-\u1BEC\u1BEE\u1BF2\u1BF3\u1C24-\u1C2B\u1C34\u1C35\u1CE1\u1CF2\u1CF3\u1CF7\u302E\u302F\uA823\uA824\uA827\uA880\uA881\uA8B4-\uA8C3\uA952\uA953\uA983\uA9B4\uA9B5\uA9BA\uA9BB\uA9BD-\uA9C0\uAA2F\uAA30\uAA33\uAA34\uAA4D\uAA7B\uAA7D\uAAEB\uAAEE\uAAEF\uAAF5\uABE3\uABE4\uABE6\uABE7\uABE9\uABEA\uABEC',
        'astral': '\uD804[\uDC00\uDC02\uDC82\uDCB0-\uDCB2\uDCB7\uDCB8\uDD2C\uDD45\uDD46\uDD82\uDDB3-\uDDB5\uDDBF\uDDC0\uDE2C-\uDE2E\uDE32\uDE33\uDE35\uDEE0-\uDEE2\uDF02\uDF03\uDF3E\uDF3F\uDF41-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF57\uDF62\uDF63]|\uD805[\uDC35-\uDC37\uDC40\uDC41\uDC45\uDCB0-\uDCB2\uDCB9\uDCBB-\uDCBE\uDCC1\uDDAF-\uDDB1\uDDB8-\uDDBB\uDDBE\uDE30-\uDE32\uDE3B\uDE3C\uDE3E\uDEAC\uDEAE\uDEAF\uDEB6\uDF20\uDF21\uDF26]|\uD806[\uDC2C-\uDC2E\uDC38\uDE39\uDE57\uDE58\uDE97]|\uD807[\uDC2F\uDC3E\uDCA9\uDCB1\uDCB4\uDD8A-\uDD8E\uDD93\uDD94\uDD96\uDEF5\uDEF6]|\uD81B[\uDF51-\uDF7E]|\uD834[\uDD65\uDD66\uDD6D-\uDD72]'
    },
    {
        'name': 'Me',
        'alias': 'Enclosing_Mark',
        'bmp': '\u0488\u0489\u1ABE\u20DD-\u20E0\u20E2-\u20E4\uA670-\uA672'
    },
    {
        'name': 'Mn',
        'alias': 'Nonspacing_Mark',
        'bmp': '\u0300-\u036F\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D3-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09C1-\u09C4\u09CD\u09E2\u09E3\u09FE\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01\u0B3C\u0B3F\u0B41-\u0B44\u0B4D\u0B56\u0B62\u0B63\u0B82\u0BC0\u0BCD\u0C00\u0C04\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CBF\u0CC6\u0CCC\u0CCD\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D41-\u0D44\u0D4D\u0D62\u0D63\u0DCA\u0DD2-\u0DD4\u0DD6\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ABD\u1B00-\u1B03\u1B34\u1B36-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302D\u3099\u309A\uA66F\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA8C4\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F',
        'astral': '\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD803[\uDD24-\uDD27\uDF46-\uDF50]|\uD804[\uDC01\uDC38-\uDC46\uDC7F-\uDC81\uDCB3-\uDCB6\uDCB9\uDCBA\uDD00-\uDD02\uDD27-\uDD2B\uDD2D-\uDD34\uDD73\uDD80\uDD81\uDDB6-\uDDBE\uDDC9-\uDDCC\uDE2F-\uDE31\uDE34\uDE36\uDE37\uDE3E\uDEDF\uDEE3-\uDEEA\uDF00\uDF01\uDF3B\uDF3C\uDF40\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC38-\uDC3F\uDC42-\uDC44\uDC46\uDC5E\uDCB3-\uDCB8\uDCBA\uDCBF\uDCC0\uDCC2\uDCC3\uDDB2-\uDDB5\uDDBC\uDDBD\uDDBF\uDDC0\uDDDC\uDDDD\uDE33-\uDE3A\uDE3D\uDE3F\uDE40\uDEAB\uDEAD\uDEB0-\uDEB5\uDEB7\uDF1D-\uDF1F\uDF22-\uDF25\uDF27-\uDF2B]|\uD806[\uDC2F-\uDC37\uDC39\uDC3A\uDE01-\uDE0A\uDE33-\uDE38\uDE3B-\uDE3E\uDE47\uDE51-\uDE56\uDE59-\uDE5B\uDE8A-\uDE96\uDE98\uDE99]|\uD807[\uDC30-\uDC36\uDC38-\uDC3D\uDC3F\uDC92-\uDCA7\uDCAA-\uDCB0\uDCB2\uDCB3\uDCB5\uDCB6\uDD31-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD45\uDD47\uDD90\uDD91\uDD95\uDD97\uDEF3\uDEF4]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF8F-\uDF92]|\uD82F[\uDC9D\uDC9E]|\uD834[\uDD67-\uDD69\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDCD0-\uDCD6\uDD44-\uDD4A]|\uDB40[\uDD00-\uDDEF]'
    },
    {
        'name': 'N',
        'alias': 'Number',
        'bmp': '0-9\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D58-\u0D5E\u0D66-\u0D78\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19',
        'astral': '\uD800[\uDD07-\uDD33\uDD40-\uDD78\uDD8A\uDD8B\uDEE1-\uDEFB\uDF20-\uDF23\uDF41\uDF4A\uDFD1-\uDFD5]|\uD801[\uDCA0-\uDCA9]|\uD802[\uDC58-\uDC5F\uDC79-\uDC7F\uDCA7-\uDCAF\uDCFB-\uDCFF\uDD16-\uDD1B\uDDBC\uDDBD\uDDC0-\uDDCF\uDDD2-\uDDFF\uDE40-\uDE48\uDE7D\uDE7E\uDE9D-\uDE9F\uDEEB-\uDEEF\uDF58-\uDF5F\uDF78-\uDF7F\uDFA9-\uDFAF]|\uD803[\uDCFA-\uDCFF\uDD30-\uDD39\uDE60-\uDE7E\uDF1D-\uDF26\uDF51-\uDF54]|\uD804[\uDC52-\uDC6F\uDCF0-\uDCF9\uDD36-\uDD3F\uDDD0-\uDDD9\uDDE1-\uDDF4\uDEF0-\uDEF9]|\uD805[\uDC50-\uDC59\uDCD0-\uDCD9\uDE50-\uDE59\uDEC0-\uDEC9\uDF30-\uDF3B]|\uD806[\uDCE0-\uDCF2]|\uD807[\uDC50-\uDC6C\uDD50-\uDD59\uDDA0-\uDDA9]|\uD809[\uDC00-\uDC6E]|\uD81A[\uDE60-\uDE69\uDF50-\uDF59\uDF5B-\uDF61]|\uD81B[\uDE80-\uDE96]|\uD834[\uDEE0-\uDEF3\uDF60-\uDF78]|\uD835[\uDFCE-\uDFFF]|\uD83A[\uDCC7-\uDCCF\uDD50-\uDD59]|\uD83B[\uDC71-\uDCAB\uDCAD-\uDCAF\uDCB1-\uDCB4]|\uD83C[\uDD00-\uDD0C]'
    },
    {
        'name': 'Nd',
        'alias': 'Decimal_Number',
        'bmp': '0-9\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0BE6-\u0BEF\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F29\u1040-\u1049\u1090-\u1099\u17E0-\u17E9\u1810-\u1819\u1946-\u194F\u19D0-\u19D9\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\uA620-\uA629\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19',
        'astral': '\uD801[\uDCA0-\uDCA9]|\uD803[\uDD30-\uDD39]|\uD804[\uDC66-\uDC6F\uDCF0-\uDCF9\uDD36-\uDD3F\uDDD0-\uDDD9\uDEF0-\uDEF9]|\uD805[\uDC50-\uDC59\uDCD0-\uDCD9\uDE50-\uDE59\uDEC0-\uDEC9\uDF30-\uDF39]|\uD806[\uDCE0-\uDCE9]|\uD807[\uDC50-\uDC59\uDD50-\uDD59\uDDA0-\uDDA9]|\uD81A[\uDE60-\uDE69\uDF50-\uDF59]|\uD835[\uDFCE-\uDFFF]|\uD83A[\uDD50-\uDD59]'
    },
    {
        'name': 'Nl',
        'alias': 'Letter_Number',
        'bmp': '\u16EE-\u16F0\u2160-\u2182\u2185-\u2188\u3007\u3021-\u3029\u3038-\u303A\uA6E6-\uA6EF',
        'astral': '\uD800[\uDD40-\uDD74\uDF41\uDF4A\uDFD1-\uDFD5]|\uD809[\uDC00-\uDC6E]'
    },
    {
        'name': 'No',
        'alias': 'Other_Number',
        'bmp': '\xB2\xB3\xB9\xBC-\xBE\u09F4-\u09F9\u0B72-\u0B77\u0BF0-\u0BF2\u0C78-\u0C7E\u0D58-\u0D5E\u0D70-\u0D78\u0F2A-\u0F33\u1369-\u137C\u17F0-\u17F9\u19DA\u2070\u2074-\u2079\u2080-\u2089\u2150-\u215F\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA830-\uA835',
        'astral': '\uD800[\uDD07-\uDD33\uDD75-\uDD78\uDD8A\uDD8B\uDEE1-\uDEFB\uDF20-\uDF23]|\uD802[\uDC58-\uDC5F\uDC79-\uDC7F\uDCA7-\uDCAF\uDCFB-\uDCFF\uDD16-\uDD1B\uDDBC\uDDBD\uDDC0-\uDDCF\uDDD2-\uDDFF\uDE40-\uDE48\uDE7D\uDE7E\uDE9D-\uDE9F\uDEEB-\uDEEF\uDF58-\uDF5F\uDF78-\uDF7F\uDFA9-\uDFAF]|\uD803[\uDCFA-\uDCFF\uDE60-\uDE7E\uDF1D-\uDF26\uDF51-\uDF54]|\uD804[\uDC52-\uDC65\uDDE1-\uDDF4]|\uD805[\uDF3A\uDF3B]|\uD806[\uDCEA-\uDCF2]|\uD807[\uDC5A-\uDC6C]|\uD81A[\uDF5B-\uDF61]|\uD81B[\uDE80-\uDE96]|\uD834[\uDEE0-\uDEF3\uDF60-\uDF78]|\uD83A[\uDCC7-\uDCCF]|\uD83B[\uDC71-\uDCAB\uDCAD-\uDCAF\uDCB1-\uDCB4]|\uD83C[\uDD00-\uDD0C]'
    },
    {
        'name': 'P',
        'alias': 'Punctuation',
        'bmp': '!-#%-\\*,-\\/:;\\?@\\[-\\]_\\{\\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4E\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65',
        'astral': '\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDF55-\uDF59]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDF3C-\uDF3E]|\uD806[\uDC3B\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]'
    },
    {
        'name': 'Pc',
        'alias': 'Connector_Punctuation',
        'bmp': '_\u203F\u2040\u2054\uFE33\uFE34\uFE4D-\uFE4F\uFF3F'
    },
    {
        'name': 'Pd',
        'alias': 'Dash_Punctuation',
        'bmp': '\\-\u058A\u05BE\u1400\u1806\u2010-\u2015\u2E17\u2E1A\u2E3A\u2E3B\u2E40\u301C\u3030\u30A0\uFE31\uFE32\uFE58\uFE63\uFF0D'
    },
    {
        'name': 'Pe',
        'alias': 'Close_Punctuation',
        'bmp': '\\)\\]\\}\u0F3B\u0F3D\u169C\u2046\u207E\u208E\u2309\u230B\u232A\u2769\u276B\u276D\u276F\u2771\u2773\u2775\u27C6\u27E7\u27E9\u27EB\u27ED\u27EF\u2984\u2986\u2988\u298A\u298C\u298E\u2990\u2992\u2994\u2996\u2998\u29D9\u29DB\u29FD\u2E23\u2E25\u2E27\u2E29\u3009\u300B\u300D\u300F\u3011\u3015\u3017\u3019\u301B\u301E\u301F\uFD3E\uFE18\uFE36\uFE38\uFE3A\uFE3C\uFE3E\uFE40\uFE42\uFE44\uFE48\uFE5A\uFE5C\uFE5E\uFF09\uFF3D\uFF5D\uFF60\uFF63'
    },
    {
        'name': 'Pf',
        'alias': 'Final_Punctuation',
        'bmp': '\xBB\u2019\u201D\u203A\u2E03\u2E05\u2E0A\u2E0D\u2E1D\u2E21'
    },
    {
        'name': 'Pi',
        'alias': 'Initial_Punctuation',
        'bmp': '\xAB\u2018\u201B\u201C\u201F\u2039\u2E02\u2E04\u2E09\u2E0C\u2E1C\u2E20'
    },
    {
        'name': 'Po',
        'alias': 'Other_Punctuation',
        'bmp': '!-#%-\'\\*,\\.\\/:;\\?@\\\xA1\xA7\xB6\xB7\xBF\u037E\u0387\u055A-\u055F\u0589\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u166D\u166E\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u1805\u1807-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2016\u2017\u2020-\u2027\u2030-\u2038\u203B-\u203E\u2041-\u2043\u2047-\u2051\u2053\u2055-\u205E\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00\u2E01\u2E06-\u2E08\u2E0B\u2E0E-\u2E16\u2E18\u2E19\u2E1B\u2E1E\u2E1F\u2E2A-\u2E2E\u2E30-\u2E39\u2E3C-\u2E3F\u2E41\u2E43-\u2E4E\u3001-\u3003\u303D\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFE10-\uFE16\uFE19\uFE30\uFE45\uFE46\uFE49-\uFE4C\uFE50-\uFE52\uFE54-\uFE57\uFE5F-\uFE61\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF07\uFF0A\uFF0C\uFF0E\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3C\uFF61\uFF64\uFF65',
        'astral': '\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDF55-\uDF59]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDF3C-\uDF3E]|\uD806[\uDC3B\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]'
    },
    {
        'name': 'Ps',
        'alias': 'Open_Punctuation',
        'bmp': '\\(\\[\\{\u0F3A\u0F3C\u169B\u201A\u201E\u2045\u207D\u208D\u2308\u230A\u2329\u2768\u276A\u276C\u276E\u2770\u2772\u2774\u27C5\u27E6\u27E8\u27EA\u27EC\u27EE\u2983\u2985\u2987\u2989\u298B\u298D\u298F\u2991\u2993\u2995\u2997\u29D8\u29DA\u29FC\u2E22\u2E24\u2E26\u2E28\u2E42\u3008\u300A\u300C\u300E\u3010\u3014\u3016\u3018\u301A\u301D\uFD3F\uFE17\uFE35\uFE37\uFE39\uFE3B\uFE3D\uFE3F\uFE41\uFE43\uFE47\uFE59\uFE5B\uFE5D\uFF08\uFF3B\uFF5B\uFF5F\uFF62'
    },
    {
        'name': 'S',
        'alias': 'Symbol',
        'bmp': '\\$\\+<->\\^`\\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20BF\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B98-\u2BC8\u2BCA-\u2BFE\u2CE5-\u2CEA\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u32FE\u3300-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uFB29\uFBB2-\uFBC1\uFDFC\uFDFD\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD',
        'astral': '\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9B\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDE8\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD83B[\uDCAC\uDCB0\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD10-\uDD6B\uDD70-\uDDAC\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED4\uDEE0-\uDEEC\uDEF0-\uDEF9\uDF00-\uDF73\uDF80-\uDFD8]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDD00-\uDD0B\uDD10-\uDD3E\uDD40-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF\uDE60-\uDE6D]'
    },
    {
        'name': 'Sc',
        'alias': 'Currency_Symbol',
        'bmp': '\\$\xA2-\xA5\u058F\u060B\u07FE\u07FF\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BF\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6',
        'astral': '\uD83B\uDCB0'
    },
    {
        'name': 'Sk',
        'alias': 'Modifier_Symbol',
        'bmp': '\\^`\xA8\xAF\xB4\xB8\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u309B\u309C\uA700-\uA716\uA720\uA721\uA789\uA78A\uAB5B\uFBB2-\uFBC1\uFF3E\uFF40\uFFE3',
        'astral': '\uD83C[\uDFFB-\uDFFF]'
    },
    {
        'name': 'Sm',
        'alias': 'Math_Symbol',
        'bmp': '\\+<->\\|~\xAC\xB1\xD7\xF7\u03F6\u0606-\u0608\u2044\u2052\u207A-\u207C\u208A-\u208C\u2118\u2140-\u2144\u214B\u2190-\u2194\u219A\u219B\u21A0\u21A3\u21A6\u21AE\u21CE\u21CF\u21D2\u21D4\u21F4-\u22FF\u2320\u2321\u237C\u239B-\u23B3\u23DC-\u23E1\u25B7\u25C1\u25F8-\u25FF\u266F\u27C0-\u27C4\u27C7-\u27E5\u27F0-\u27FF\u2900-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2AFF\u2B30-\u2B44\u2B47-\u2B4C\uFB29\uFE62\uFE64-\uFE66\uFF0B\uFF1C-\uFF1E\uFF5C\uFF5E\uFFE2\uFFE9-\uFFEC',
        'astral': '\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD83B[\uDEF0\uDEF1]'
    },
    {
        'name': 'So',
        'alias': 'Other_Symbol',
        'bmp': '\xA6\xA9\xAE\xB0\u0482\u058D\u058E\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u09FA\u0B70\u0BF3-\u0BF8\u0BFA\u0C7F\u0D4F\u0D79\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116\u2117\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u214A\u214C\u214D\u214F\u218A\u218B\u2195-\u2199\u219C-\u219F\u21A1\u21A2\u21A4\u21A5\u21A7-\u21AD\u21AF-\u21CD\u21D0\u21D1\u21D3\u21D5-\u21F3\u2300-\u2307\u230C-\u231F\u2322-\u2328\u232B-\u237B\u237D-\u239A\u23B4-\u23DB\u23E2-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u25B6\u25B8-\u25C0\u25C2-\u25F7\u2600-\u266E\u2670-\u2767\u2794-\u27BF\u2800-\u28FF\u2B00-\u2B2F\u2B45\u2B46\u2B4D-\u2B73\u2B76-\u2B95\u2B98-\u2BC8\u2BCA-\u2BFE\u2CE5-\u2CEA\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u32FE\u3300-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA828-\uA82B\uA836\uA837\uA839\uAA77-\uAA79\uFDFD\uFFE4\uFFE8\uFFED\uFFEE\uFFFC\uFFFD',
        'astral': '\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9B\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDE8\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD83B\uDCAC|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD10-\uDD6B\uDD70-\uDDAC\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFA]|\uD83D[\uDC00-\uDED4\uDEE0-\uDEEC\uDEF0-\uDEF9\uDF00-\uDF73\uDF80-\uDFD8]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDD00-\uDD0B\uDD10-\uDD3E\uDD40-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF\uDE60-\uDE6D]'
    },
    {
        'name': 'Z',
        'alias': 'Separator',
        'bmp': ' \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000'
    },
    {
        'name': 'Zl',
        'alias': 'Line_Separator',
        'bmp': '\u2028'
    },
    {
        'name': 'Zp',
        'alias': 'Paragraph_Separator',
        'bmp': '\u2029'
    },
    {
        'name': 'Zs',
        'alias': 'Space_Separator',
        'bmp': ' \xA0\u1680\u2000-\u200A\u202F\u205F\u3000'
    }
];

var unicodeCategories = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _categories = interopRequireDefault(categories);

/*!
 * XRegExp Unicode Categories 4.2.4
 * <xregexp.com>
 * Steven Levithan (c) 2010-present MIT License
 * Unicode data by Mathias Bynens <mathiasbynens.be>
 */
var _default = function _default(XRegExp) {
  /**
   * Adds support for Unicode's general categories. E.g., `\p{Lu}` or `\p{Uppercase Letter}`. See
   * category descriptions in UAX #44 <http://unicode.org/reports/tr44/#GC_Values_Table>. Token
   * names are case insensitive, and any spaces, hyphens, and underscores are ignored.
   *
   * Uses Unicode 11.0.0.
   *
   * @requires XRegExp, Unicode Base
   */
  if (!XRegExp.addUnicodeData) {
    throw new ReferenceError('Unicode Base must be loaded before Unicode Categories');
  }

  XRegExp.addUnicodeData(_categories.default);
};

exports.default = _default;
module.exports = exports["default"];
});

unwrapExports(unicodeCategories);

var properties = [
    {
        'name': 'ASCII',
        'bmp': '\0-\x7F'
    },
    {
        'name': 'Alphabetic',
        'bmp': 'A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0345\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05B0-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05EF-\u05F2\u0610-\u061A\u0620-\u0657\u0659-\u065F\u066E-\u06D3\u06D5-\u06DC\u06E1-\u06E8\u06ED-\u06EF\u06FA-\u06FC\u06FF\u0710-\u073F\u074D-\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0817\u081A-\u082C\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08DF\u08E3-\u08E9\u08F0-\u093B\u093D-\u094C\u094E-\u0950\u0955-\u0963\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD-\u09C4\u09C7\u09C8\u09CB\u09CC\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09F0\u09F1\u09FC\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3E-\u0A42\u0A47\u0A48\u0A4B\u0A4C\u0A51\u0A59-\u0A5C\u0A5E\u0A70-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD-\u0AC5\u0AC7-\u0AC9\u0ACB\u0ACC\u0AD0\u0AE0-\u0AE3\u0AF9-\u0AFC\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D-\u0B44\u0B47\u0B48\u0B4B\u0B4C\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCC\u0BD0\u0BD7\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4C\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCC\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CF1\u0CF2\u0D00-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4C\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E46\u0E4D\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0ECD\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F71-\u0F81\u0F88-\u0F97\u0F99-\u0FBC\u1000-\u1036\u1038\u103B-\u103F\u1050-\u1062\u1065-\u1068\u106E-\u1086\u108E\u109C\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1713\u1720-\u1733\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17B3\u17B6-\u17C8\u17D7\u17DC\u1820-\u1878\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u1938\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A1B\u1A20-\u1A5E\u1A61-\u1A74\u1AA7\u1B00-\u1B33\u1B35-\u1B43\u1B45-\u1B4B\u1B80-\u1BA9\u1BAC-\u1BAF\u1BBA-\u1BE5\u1BE7-\u1BF1\u1C00-\u1C35\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1D00-\u1DBF\u1DE7-\u1DF4\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u24B6-\u24E9\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEF\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA674-\uA67B\uA67F-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7B9\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA827\uA840-\uA873\uA880-\uA8C3\uA8C5\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA92A\uA930-\uA952\uA960-\uA97C\uA980-\uA9B2\uA9B4-\uA9BF\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA60-\uAA76\uAA7A\uAA7E-\uAABE\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF5\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC',
        'astral': '\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD27\uDF00-\uDF1C\uDF27\uDF30-\uDF45]|\uD804[\uDC00-\uDC45\uDC82-\uDCB8\uDCD0-\uDCE8\uDD00-\uDD32\uDD44-\uDD46\uDD50-\uDD72\uDD76\uDD80-\uDDBF\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE34\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEE8\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D-\uDF44\uDF47\uDF48\uDF4B\uDF4C\uDF50\uDF57\uDF5D-\uDF63]|\uD805[\uDC00-\uDC41\uDC43-\uDC45\uDC47-\uDC4A\uDC80-\uDCC1\uDCC4\uDCC5\uDCC7\uDD80-\uDDB5\uDDB8-\uDDBE\uDDD8-\uDDDD\uDE00-\uDE3E\uDE40\uDE44\uDE80-\uDEB5\uDF00-\uDF1A\uDF1D-\uDF2A]|\uD806[\uDC00-\uDC38\uDCA0-\uDCDF\uDCFF\uDE00-\uDE32\uDE35-\uDE3E\uDE50-\uDE83\uDE86-\uDE97\uDE9D\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC3E\uDC40\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD41\uDD43\uDD46\uDD47\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD8E\uDD90\uDD91\uDD93-\uDD96\uDD98\uDEE0-\uDEF6]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF36\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE7F\uDF00-\uDF44\uDF50-\uDF7E\uDF93-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFF1]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9E]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43\uDD47]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD83C[\uDD30-\uDD49\uDD50-\uDD69\uDD70-\uDD89]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]'
    },
    {
        'name': 'Any',
        'isBmpLast': true,
        'bmp': '\0-\uFFFF',
        'astral': '[\uD800-\uDBFF][\uDC00-\uDFFF]'
    },
    {
        'name': 'Default_Ignorable_Code_Point',
        'bmp': '\xAD\u034F\u061C\u115F\u1160\u17B4\u17B5\u180B-\u180E\u200B-\u200F\u202A-\u202E\u2060-\u206F\u3164\uFE00-\uFE0F\uFEFF\uFFA0\uFFF0-\uFFF8',
        'astral': '\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|[\uDB40-\uDB43][\uDC00-\uDFFF]'
    },
    {
        'name': 'Lowercase',
        'bmp': 'a-z\xAA\xB5\xBA\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02B8\u02C0\u02C1\u02E0-\u02E4\u0345\u0371\u0373\u0377\u037A-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0560-\u0588\u10D0-\u10FA\u10FD-\u10FF\u13F8-\u13FD\u1C80-\u1C88\u1D00-\u1DBF\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u2071\u207F\u2090-\u209C\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2170-\u217F\u2184\u24D0-\u24E9\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7D\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B-\uA69D\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7AF\uA7B5\uA7B7\uA7B9\uA7F8-\uA7FA\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A',
        'astral': '\uD801[\uDC28-\uDC4F\uDCD8-\uDCFB]|\uD803[\uDCC0-\uDCF2]|\uD806[\uDCC0-\uDCDF]|\uD81B[\uDE60-\uDE7F]|\uD835[\uDC1A-\uDC33\uDC4E-\uDC54\uDC56-\uDC67\uDC82-\uDC9B\uDCB6-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDCCF\uDCEA-\uDD03\uDD1E-\uDD37\uDD52-\uDD6B\uDD86-\uDD9F\uDDBA-\uDDD3\uDDEE-\uDE07\uDE22-\uDE3B\uDE56-\uDE6F\uDE8A-\uDEA5\uDEC2-\uDEDA\uDEDC-\uDEE1\uDEFC-\uDF14\uDF16-\uDF1B\uDF36-\uDF4E\uDF50-\uDF55\uDF70-\uDF88\uDF8A-\uDF8F\uDFAA-\uDFC2\uDFC4-\uDFC9\uDFCB]|\uD83A[\uDD22-\uDD43]'
    },
    {
        'name': 'Noncharacter_Code_Point',
        'bmp': '\uFDD0-\uFDEF\uFFFE\uFFFF',
        'astral': '[\uD83F\uD87F\uD8BF\uD8FF\uD93F\uD97F\uD9BF\uD9FF\uDA3F\uDA7F\uDABF\uDAFF\uDB3F\uDB7F\uDBBF\uDBFF][\uDFFE\uDFFF]'
    },
    {
        'name': 'Uppercase',
        'bmp': 'A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1C90-\u1CBA\u1CBD-\u1CBF\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2160-\u216F\u2183\u24B6-\u24CF\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AE\uA7B0-\uA7B4\uA7B6\uA7B8\uFF21-\uFF3A',
        'astral': '\uD801[\uDC00-\uDC27\uDCB0-\uDCD3]|\uD803[\uDC80-\uDCB2]|\uD806[\uDCA0-\uDCBF]|\uD81B[\uDE40-\uDE5F]|\uD835[\uDC00-\uDC19\uDC34-\uDC4D\uDC68-\uDC81\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB5\uDCD0-\uDCE9\uDD04\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD38\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD6C-\uDD85\uDDA0-\uDDB9\uDDD4-\uDDED\uDE08-\uDE21\uDE3C-\uDE55\uDE70-\uDE89\uDEA8-\uDEC0\uDEE2-\uDEFA\uDF1C-\uDF34\uDF56-\uDF6E\uDF90-\uDFA8\uDFCA]|\uD83A[\uDD00-\uDD21]|\uD83C[\uDD30-\uDD49\uDD50-\uDD69\uDD70-\uDD89]'
    },
    {
        'name': 'White_Space',
        'bmp': '\t-\r \x85\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000'
    }
];

var unicodeProperties = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _properties = interopRequireDefault(properties);

/*!
 * XRegExp Unicode Properties 4.2.4
 * <xregexp.com>
 * Steven Levithan (c) 2012-present MIT License
 * Unicode data by Mathias Bynens <mathiasbynens.be>
 */
var _default = function _default(XRegExp) {
  /**
   * Adds properties to meet the UTS #18 Level 1 RL1.2 requirements for Unicode regex support. See
   * <http://unicode.org/reports/tr18/#RL1.2>. Following are definitions of these properties from
   * UAX #44 <http://unicode.org/reports/tr44/>:
   *
   * - Alphabetic
   *   Characters with the Alphabetic property. Generated from: Lowercase + Uppercase + Lt + Lm +
   *   Lo + Nl + Other_Alphabetic.
   *
   * - Default_Ignorable_Code_Point
   *   For programmatic determination of default ignorable code points. New characters that should
   *   be ignored in rendering (unless explicitly supported) will be assigned in these ranges,
   *   permitting programs to correctly handle the default rendering of such characters when not
   *   otherwise supported.
   *
   * - Lowercase
   *   Characters with the Lowercase property. Generated from: Ll + Other_Lowercase.
   *
   * - Noncharacter_Code_Point
   *   Code points permanently reserved for internal use.
   *
   * - Uppercase
   *   Characters with the Uppercase property. Generated from: Lu + Other_Uppercase.
   *
   * - White_Space
   *   Spaces, separator characters and other control characters which should be treated by
   *   programming languages as "white space" for the purpose of parsing elements.
   *
   * The properties ASCII, Any, and Assigned are also included but are not defined in UAX #44. UTS
   * #18 RL1.2 additionally requires support for Unicode scripts and general categories. These are
   * included in XRegExp's Unicode Categories and Unicode Scripts addons.
   *
   * Token names are case insensitive, and any spaces, hyphens, and underscores are ignored.
   *
   * Uses Unicode 11.0.0.
   *
   * @requires XRegExp, Unicode Base
   */
  if (!XRegExp.addUnicodeData) {
    throw new ReferenceError('Unicode Base must be loaded before Unicode Properties');
  }

  var unicodeData = _properties.default; // Add non-generated data

  unicodeData.push({
    name: 'Assigned',
    // Since this is defined as the inverse of Unicode category Cn (Unassigned), the Unicode
    // Categories addon is required to use this property
    inverseOf: 'Cn'
  });
  XRegExp.addUnicodeData(unicodeData);
};

exports.default = _default;
module.exports = exports["default"];
});

unwrapExports(unicodeProperties);

var scripts = [
    {
        'name': 'Adlam',
        'astral': '\uD83A[\uDD00-\uDD4A\uDD50-\uDD59\uDD5E\uDD5F]'
    },
    {
        'name': 'Ahom',
        'astral': '\uD805[\uDF00-\uDF1A\uDF1D-\uDF2B\uDF30-\uDF3F]'
    },
    {
        'name': 'Anatolian_Hieroglyphs',
        'astral': '\uD811[\uDC00-\uDE46]'
    },
    {
        'name': 'Arabic',
        'bmp': '\u0600-\u0604\u0606-\u060B\u060D-\u061A\u061C\u061E\u0620-\u063F\u0641-\u064A\u0656-\u066F\u0671-\u06DC\u06DE-\u06FF\u0750-\u077F\u08A0-\u08B4\u08B6-\u08BD\u08D3-\u08E1\u08E3-\u08FF\uFB50-\uFBC1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFD\uFE70-\uFE74\uFE76-\uFEFC',
        'astral': '\uD803[\uDE60-\uDE7E]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB\uDEF0\uDEF1]'
    },
    {
        'name': 'Armenian',
        'bmp': '\u0531-\u0556\u0559-\u0588\u058A\u058D-\u058F\uFB13-\uFB17'
    },
    {
        'name': 'Avestan',
        'astral': '\uD802[\uDF00-\uDF35\uDF39-\uDF3F]'
    },
    {
        'name': 'Balinese',
        'bmp': '\u1B00-\u1B4B\u1B50-\u1B7C'
    },
    {
        'name': 'Bamum',
        'bmp': '\uA6A0-\uA6F7',
        'astral': '\uD81A[\uDC00-\uDE38]'
    },
    {
        'name': 'Bassa_Vah',
        'astral': '\uD81A[\uDED0-\uDEED\uDEF0-\uDEF5]'
    },
    {
        'name': 'Batak',
        'bmp': '\u1BC0-\u1BF3\u1BFC-\u1BFF'
    },
    {
        'name': 'Bengali',
        'bmp': '\u0980-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FE'
    },
    {
        'name': 'Bhaiksuki',
        'astral': '\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC45\uDC50-\uDC6C]'
    },
    {
        'name': 'Bopomofo',
        'bmp': '\u02EA\u02EB\u3105-\u312F\u31A0-\u31BA'
    },
    {
        'name': 'Brahmi',
        'astral': '\uD804[\uDC00-\uDC4D\uDC52-\uDC6F\uDC7F]'
    },
    {
        'name': 'Braille',
        'bmp': '\u2800-\u28FF'
    },
    {
        'name': 'Buginese',
        'bmp': '\u1A00-\u1A1B\u1A1E\u1A1F'
    },
    {
        'name': 'Buhid',
        'bmp': '\u1740-\u1753'
    },
    {
        'name': 'Canadian_Aboriginal',
        'bmp': '\u1400-\u167F\u18B0-\u18F5'
    },
    {
        'name': 'Carian',
        'astral': '\uD800[\uDEA0-\uDED0]'
    },
    {
        'name': 'Caucasian_Albanian',
        'astral': '\uD801[\uDD30-\uDD63\uDD6F]'
    },
    {
        'name': 'Chakma',
        'astral': '\uD804[\uDD00-\uDD34\uDD36-\uDD46]'
    },
    {
        'name': 'Cham',
        'bmp': '\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA5C-\uAA5F'
    },
    {
        'name': 'Cherokee',
        'bmp': '\u13A0-\u13F5\u13F8-\u13FD\uAB70-\uABBF'
    },
    {
        'name': 'Common',
        'bmp': '\0-@\\[-`\\{-\xA9\xAB-\xB9\xBB-\xBF\xD7\xF7\u02B9-\u02DF\u02E5-\u02E9\u02EC-\u02FF\u0374\u037E\u0385\u0387\u0589\u0605\u060C\u061B\u061F\u0640\u06DD\u08E2\u0964\u0965\u0E3F\u0FD5-\u0FD8\u10FB\u16EB-\u16ED\u1735\u1736\u1802\u1803\u1805\u1CD3\u1CE1\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5-\u1CF7\u2000-\u200B\u200E-\u2064\u2066-\u2070\u2074-\u207E\u2080-\u208E\u20A0-\u20BF\u2100-\u2125\u2127-\u2129\u212C-\u2131\u2133-\u214D\u214F-\u215F\u2189-\u218B\u2190-\u2426\u2440-\u244A\u2460-\u27FF\u2900-\u2B73\u2B76-\u2B95\u2B98-\u2BC8\u2BCA-\u2BFE\u2E00-\u2E4E\u2FF0-\u2FFB\u3000-\u3004\u3006\u3008-\u3020\u3030-\u3037\u303C-\u303F\u309B\u309C\u30A0\u30FB\u30FC\u3190-\u319F\u31C0-\u31E3\u3220-\u325F\u327F-\u32CF\u3358-\u33FF\u4DC0-\u4DFF\uA700-\uA721\uA788-\uA78A\uA830-\uA839\uA92E\uA9CF\uAB5B\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFEFF\uFF01-\uFF20\uFF3B-\uFF40\uFF5B-\uFF65\uFF70\uFF9E\uFF9F\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFF9-\uFFFD',
        'astral': '\uD800[\uDD00-\uDD02\uDD07-\uDD33\uDD37-\uDD3F\uDD90-\uDD9B\uDDD0-\uDDFC\uDEE1-\uDEFB]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD66\uDD6A-\uDD7A\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDE8\uDEE0-\uDEF3\uDF00-\uDF56\uDF60-\uDF78]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDFCB\uDFCE-\uDFFF]|\uD83B[\uDC71-\uDCB4]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD00-\uDD0C\uDD10-\uDD6B\uDD70-\uDDAC\uDDE6-\uDDFF\uDE01\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED4\uDEE0-\uDEEC\uDEF0-\uDEF9\uDF00-\uDF73\uDF80-\uDFD8]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDD00-\uDD0B\uDD10-\uDD3E\uDD40-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF\uDE60-\uDE6D]|\uDB40[\uDC01\uDC20-\uDC7F]'
    },
    {
        'name': 'Coptic',
        'bmp': '\u03E2-\u03EF\u2C80-\u2CF3\u2CF9-\u2CFF'
    },
    {
        'name': 'Cuneiform',
        'astral': '\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC70-\uDC74\uDC80-\uDD43]'
    },
    {
        'name': 'Cypriot',
        'astral': '\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F]'
    },
    {
        'name': 'Cyrillic',
        'bmp': '\u0400-\u0484\u0487-\u052F\u1C80-\u1C88\u1D2B\u1D78\u2DE0-\u2DFF\uA640-\uA69F\uFE2E\uFE2F'
    },
    {
        'name': 'Deseret',
        'astral': '\uD801[\uDC00-\uDC4F]'
    },
    {
        'name': 'Devanagari',
        'bmp': '\u0900-\u0950\u0953-\u0963\u0966-\u097F\uA8E0-\uA8FF'
    },
    {
        'name': 'Dogra',
        'astral': '\uD806[\uDC00-\uDC3B]'
    },
    {
        'name': 'Duployan',
        'astral': '\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9C-\uDC9F]'
    },
    {
        'name': 'Egyptian_Hieroglyphs',
        'astral': '\uD80C[\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]'
    },
    {
        'name': 'Elbasan',
        'astral': '\uD801[\uDD00-\uDD27]'
    },
    {
        'name': 'Ethiopic',
        'bmp': '\u1200-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u137C\u1380-\u1399\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E'
    },
    {
        'name': 'Georgian',
        'bmp': '\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u10FF\u1C90-\u1CBA\u1CBD-\u1CBF\u2D00-\u2D25\u2D27\u2D2D'
    },
    {
        'name': 'Glagolitic',
        'bmp': '\u2C00-\u2C2E\u2C30-\u2C5E',
        'astral': '\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]'
    },
    {
        'name': 'Gothic',
        'astral': '\uD800[\uDF30-\uDF4A]'
    },
    {
        'name': 'Grantha',
        'astral': '\uD804[\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]'
    },
    {
        'name': 'Greek',
        'bmp': '\u0370-\u0373\u0375-\u0377\u037A-\u037D\u037F\u0384\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03E1\u03F0-\u03FF\u1D26-\u1D2A\u1D5D-\u1D61\u1D66-\u1D6A\u1DBF\u1F00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FC4\u1FC6-\u1FD3\u1FD6-\u1FDB\u1FDD-\u1FEF\u1FF2-\u1FF4\u1FF6-\u1FFE\u2126\uAB65',
        'astral': '\uD800[\uDD40-\uDD8E\uDDA0]|\uD834[\uDE00-\uDE45]'
    },
    {
        'name': 'Gujarati',
        'bmp': '\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AF1\u0AF9-\u0AFF'
    },
    {
        'name': 'Gunjala_Gondi',
        'astral': '\uD807[\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD8E\uDD90\uDD91\uDD93-\uDD98\uDDA0-\uDDA9]'
    },
    {
        'name': 'Gurmukhi',
        'bmp': '\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A76'
    },
    {
        'name': 'Han',
        'bmp': '\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B\u3400-\u4DB5\u4E00-\u9FEF\uF900-\uFA6D\uFA70-\uFAD9',
        'astral': '[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]'
    },
    {
        'name': 'Hangul',
        'bmp': '\u1100-\u11FF\u302E\u302F\u3131-\u318E\u3200-\u321E\u3260-\u327E\uA960-\uA97C\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC'
    },
    {
        'name': 'Hanifi_Rohingya',
        'astral': '\uD803[\uDD00-\uDD27\uDD30-\uDD39]'
    },
    {
        'name': 'Hanunoo',
        'bmp': '\u1720-\u1734'
    },
    {
        'name': 'Hatran',
        'astral': '\uD802[\uDCE0-\uDCF2\uDCF4\uDCF5\uDCFB-\uDCFF]'
    },
    {
        'name': 'Hebrew',
        'bmp': '\u0591-\u05C7\u05D0-\u05EA\u05EF-\u05F4\uFB1D-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFB4F'
    },
    {
        'name': 'Hiragana',
        'bmp': '\u3041-\u3096\u309D-\u309F',
        'astral': '\uD82C[\uDC01-\uDD1E]|\uD83C\uDE00'
    },
    {
        'name': 'Imperial_Aramaic',
        'astral': '\uD802[\uDC40-\uDC55\uDC57-\uDC5F]'
    },
    {
        'name': 'Inherited',
        'bmp': '\u0300-\u036F\u0485\u0486\u064B-\u0655\u0670\u0951\u0952\u1AB0-\u1ABE\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u200C\u200D\u20D0-\u20F0\u302A-\u302D\u3099\u309A\uFE00-\uFE0F\uFE20-\uFE2D',
        'astral': '\uD800[\uDDFD\uDEE0]|\uD804\uDF3B|\uD834[\uDD67-\uDD69\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD]|\uDB40[\uDD00-\uDDEF]'
    },
    {
        'name': 'Inscriptional_Pahlavi',
        'astral': '\uD802[\uDF60-\uDF72\uDF78-\uDF7F]'
    },
    {
        'name': 'Inscriptional_Parthian',
        'astral': '\uD802[\uDF40-\uDF55\uDF58-\uDF5F]'
    },
    {
        'name': 'Javanese',
        'bmp': '\uA980-\uA9CD\uA9D0-\uA9D9\uA9DE\uA9DF'
    },
    {
        'name': 'Kaithi',
        'astral': '\uD804[\uDC80-\uDCC1\uDCCD]'
    },
    {
        'name': 'Kannada',
        'bmp': '\u0C80-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2'
    },
    {
        'name': 'Katakana',
        'bmp': '\u30A1-\u30FA\u30FD-\u30FF\u31F0-\u31FF\u32D0-\u32FE\u3300-\u3357\uFF66-\uFF6F\uFF71-\uFF9D',
        'astral': '\uD82C\uDC00'
    },
    {
        'name': 'Kayah_Li',
        'bmp': '\uA900-\uA92D\uA92F'
    },
    {
        'name': 'Kharoshthi',
        'astral': '\uD802[\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE38-\uDE3A\uDE3F-\uDE48\uDE50-\uDE58]'
    },
    {
        'name': 'Khmer',
        'bmp': '\u1780-\u17DD\u17E0-\u17E9\u17F0-\u17F9\u19E0-\u19FF'
    },
    {
        'name': 'Khojki',
        'astral': '\uD804[\uDE00-\uDE11\uDE13-\uDE3E]'
    },
    {
        'name': 'Khudawadi',
        'astral': '\uD804[\uDEB0-\uDEEA\uDEF0-\uDEF9]'
    },
    {
        'name': 'Lao',
        'bmp': '\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF'
    },
    {
        'name': 'Latin',
        'bmp': 'A-Za-z\xAA\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02B8\u02E0-\u02E4\u1D00-\u1D25\u1D2C-\u1D5C\u1D62-\u1D65\u1D6B-\u1D77\u1D79-\u1DBE\u1E00-\u1EFF\u2071\u207F\u2090-\u209C\u212A\u212B\u2132\u214E\u2160-\u2188\u2C60-\u2C7F\uA722-\uA787\uA78B-\uA7B9\uA7F7-\uA7FF\uAB30-\uAB5A\uAB5C-\uAB64\uFB00-\uFB06\uFF21-\uFF3A\uFF41-\uFF5A'
    },
    {
        'name': 'Lepcha',
        'bmp': '\u1C00-\u1C37\u1C3B-\u1C49\u1C4D-\u1C4F'
    },
    {
        'name': 'Limbu',
        'bmp': '\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1940\u1944-\u194F'
    },
    {
        'name': 'Linear_A',
        'astral': '\uD801[\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]'
    },
    {
        'name': 'Linear_B',
        'astral': '\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA]'
    },
    {
        'name': 'Lisu',
        'bmp': '\uA4D0-\uA4FF'
    },
    {
        'name': 'Lycian',
        'astral': '\uD800[\uDE80-\uDE9C]'
    },
    {
        'name': 'Lydian',
        'astral': '\uD802[\uDD20-\uDD39\uDD3F]'
    },
    {
        'name': 'Mahajani',
        'astral': '\uD804[\uDD50-\uDD76]'
    },
    {
        'name': 'Makasar',
        'astral': '\uD807[\uDEE0-\uDEF8]'
    },
    {
        'name': 'Malayalam',
        'bmp': '\u0D00-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4F\u0D54-\u0D63\u0D66-\u0D7F'
    },
    {
        'name': 'Mandaic',
        'bmp': '\u0840-\u085B\u085E'
    },
    {
        'name': 'Manichaean',
        'astral': '\uD802[\uDEC0-\uDEE6\uDEEB-\uDEF6]'
    },
    {
        'name': 'Marchen',
        'astral': '\uD807[\uDC70-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6]'
    },
    {
        'name': 'Masaram_Gondi',
        'astral': '\uD807[\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59]'
    },
    {
        'name': 'Medefaidrin',
        'astral': '\uD81B[\uDE40-\uDE9A]'
    },
    {
        'name': 'Meetei_Mayek',
        'bmp': '\uAAE0-\uAAF6\uABC0-\uABED\uABF0-\uABF9'
    },
    {
        'name': 'Mende_Kikakui',
        'astral': '\uD83A[\uDC00-\uDCC4\uDCC7-\uDCD6]'
    },
    {
        'name': 'Meroitic_Cursive',
        'astral': '\uD802[\uDDA0-\uDDB7\uDDBC-\uDDCF\uDDD2-\uDDFF]'
    },
    {
        'name': 'Meroitic_Hieroglyphs',
        'astral': '\uD802[\uDD80-\uDD9F]'
    },
    {
        'name': 'Miao',
        'astral': '\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]'
    },
    {
        'name': 'Modi',
        'astral': '\uD805[\uDE00-\uDE44\uDE50-\uDE59]'
    },
    {
        'name': 'Mongolian',
        'bmp': '\u1800\u1801\u1804\u1806-\u180E\u1810-\u1819\u1820-\u1878\u1880-\u18AA',
        'astral': '\uD805[\uDE60-\uDE6C]'
    },
    {
        'name': 'Mro',
        'astral': '\uD81A[\uDE40-\uDE5E\uDE60-\uDE69\uDE6E\uDE6F]'
    },
    {
        'name': 'Multani',
        'astral': '\uD804[\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA9]'
    },
    {
        'name': 'Myanmar',
        'bmp': '\u1000-\u109F\uA9E0-\uA9FE\uAA60-\uAA7F'
    },
    {
        'name': 'Nabataean',
        'astral': '\uD802[\uDC80-\uDC9E\uDCA7-\uDCAF]'
    },
    {
        'name': 'New_Tai_Lue',
        'bmp': '\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u19DE\u19DF'
    },
    {
        'name': 'Newa',
        'astral': '\uD805[\uDC00-\uDC59\uDC5B\uDC5D\uDC5E]'
    },
    {
        'name': 'Nko',
        'bmp': '\u07C0-\u07FA\u07FD-\u07FF'
    },
    {
        'name': 'Nushu',
        'astral': '\uD81B\uDFE1|\uD82C[\uDD70-\uDEFB]'
    },
    {
        'name': 'Ogham',
        'bmp': '\u1680-\u169C'
    },
    {
        'name': 'Ol_Chiki',
        'bmp': '\u1C50-\u1C7F'
    },
    {
        'name': 'Old_Hungarian',
        'astral': '\uD803[\uDC80-\uDCB2\uDCC0-\uDCF2\uDCFA-\uDCFF]'
    },
    {
        'name': 'Old_Italic',
        'astral': '\uD800[\uDF00-\uDF23\uDF2D-\uDF2F]'
    },
    {
        'name': 'Old_North_Arabian',
        'astral': '\uD802[\uDE80-\uDE9F]'
    },
    {
        'name': 'Old_Permic',
        'astral': '\uD800[\uDF50-\uDF7A]'
    },
    {
        'name': 'Old_Persian',
        'astral': '\uD800[\uDFA0-\uDFC3\uDFC8-\uDFD5]'
    },
    {
        'name': 'Old_Sogdian',
        'astral': '\uD803[\uDF00-\uDF27]'
    },
    {
        'name': 'Old_South_Arabian',
        'astral': '\uD802[\uDE60-\uDE7F]'
    },
    {
        'name': 'Old_Turkic',
        'astral': '\uD803[\uDC00-\uDC48]'
    },
    {
        'name': 'Oriya',
        'bmp': '\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B77'
    },
    {
        'name': 'Osage',
        'astral': '\uD801[\uDCB0-\uDCD3\uDCD8-\uDCFB]'
    },
    {
        'name': 'Osmanya',
        'astral': '\uD801[\uDC80-\uDC9D\uDCA0-\uDCA9]'
    },
    {
        'name': 'Pahawh_Hmong',
        'astral': '\uD81A[\uDF00-\uDF45\uDF50-\uDF59\uDF5B-\uDF61\uDF63-\uDF77\uDF7D-\uDF8F]'
    },
    {
        'name': 'Palmyrene',
        'astral': '\uD802[\uDC60-\uDC7F]'
    },
    {
        'name': 'Pau_Cin_Hau',
        'astral': '\uD806[\uDEC0-\uDEF8]'
    },
    {
        'name': 'Phags_Pa',
        'bmp': '\uA840-\uA877'
    },
    {
        'name': 'Phoenician',
        'astral': '\uD802[\uDD00-\uDD1B\uDD1F]'
    },
    {
        'name': 'Psalter_Pahlavi',
        'astral': '\uD802[\uDF80-\uDF91\uDF99-\uDF9C\uDFA9-\uDFAF]'
    },
    {
        'name': 'Rejang',
        'bmp': '\uA930-\uA953\uA95F'
    },
    {
        'name': 'Runic',
        'bmp': '\u16A0-\u16EA\u16EE-\u16F8'
    },
    {
        'name': 'Samaritan',
        'bmp': '\u0800-\u082D\u0830-\u083E'
    },
    {
        'name': 'Saurashtra',
        'bmp': '\uA880-\uA8C5\uA8CE-\uA8D9'
    },
    {
        'name': 'Sharada',
        'astral': '\uD804[\uDD80-\uDDCD\uDDD0-\uDDDF]'
    },
    {
        'name': 'Shavian',
        'astral': '\uD801[\uDC50-\uDC7F]'
    },
    {
        'name': 'Siddham',
        'astral': '\uD805[\uDD80-\uDDB5\uDDB8-\uDDDD]'
    },
    {
        'name': 'SignWriting',
        'astral': '\uD836[\uDC00-\uDE8B\uDE9B-\uDE9F\uDEA1-\uDEAF]'
    },
    {
        'name': 'Sinhala',
        'bmp': '\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2-\u0DF4',
        'astral': '\uD804[\uDDE1-\uDDF4]'
    },
    {
        'name': 'Sogdian',
        'astral': '\uD803[\uDF30-\uDF59]'
    },
    {
        'name': 'Sora_Sompeng',
        'astral': '\uD804[\uDCD0-\uDCE8\uDCF0-\uDCF9]'
    },
    {
        'name': 'Soyombo',
        'astral': '\uD806[\uDE50-\uDE83\uDE86-\uDEA2]'
    },
    {
        'name': 'Sundanese',
        'bmp': '\u1B80-\u1BBF\u1CC0-\u1CC7'
    },
    {
        'name': 'Syloti_Nagri',
        'bmp': '\uA800-\uA82B'
    },
    {
        'name': 'Syriac',
        'bmp': '\u0700-\u070D\u070F-\u074A\u074D-\u074F\u0860-\u086A'
    },
    {
        'name': 'Tagalog',
        'bmp': '\u1700-\u170C\u170E-\u1714'
    },
    {
        'name': 'Tagbanwa',
        'bmp': '\u1760-\u176C\u176E-\u1770\u1772\u1773'
    },
    {
        'name': 'Tai_Le',
        'bmp': '\u1950-\u196D\u1970-\u1974'
    },
    {
        'name': 'Tai_Tham',
        'bmp': '\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA0-\u1AAD'
    },
    {
        'name': 'Tai_Viet',
        'bmp': '\uAA80-\uAAC2\uAADB-\uAADF'
    },
    {
        'name': 'Takri',
        'astral': '\uD805[\uDE80-\uDEB7\uDEC0-\uDEC9]'
    },
    {
        'name': 'Tamil',
        'bmp': '\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BFA'
    },
    {
        'name': 'Tangut',
        'astral': '\uD81B\uDFE0|[\uD81C-\uD820][\uDC00-\uDFFF]|\uD821[\uDC00-\uDFF1]|\uD822[\uDC00-\uDEF2]'
    },
    {
        'name': 'Telugu',
        'bmp': '\u0C00-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C78-\u0C7F'
    },
    {
        'name': 'Thaana',
        'bmp': '\u0780-\u07B1'
    },
    {
        'name': 'Thai',
        'bmp': '\u0E01-\u0E3A\u0E40-\u0E5B'
    },
    {
        'name': 'Tibetan',
        'bmp': '\u0F00-\u0F47\u0F49-\u0F6C\u0F71-\u0F97\u0F99-\u0FBC\u0FBE-\u0FCC\u0FCE-\u0FD4\u0FD9\u0FDA'
    },
    {
        'name': 'Tifinagh',
        'bmp': '\u2D30-\u2D67\u2D6F\u2D70\u2D7F'
    },
    {
        'name': 'Tirhuta',
        'astral': '\uD805[\uDC80-\uDCC7\uDCD0-\uDCD9]'
    },
    {
        'name': 'Ugaritic',
        'astral': '\uD800[\uDF80-\uDF9D\uDF9F]'
    },
    {
        'name': 'Vai',
        'bmp': '\uA500-\uA62B'
    },
    {
        'name': 'Warang_Citi',
        'astral': '\uD806[\uDCA0-\uDCF2\uDCFF]'
    },
    {
        'name': 'Yi',
        'bmp': '\uA000-\uA48C\uA490-\uA4C6'
    },
    {
        'name': 'Zanabazar_Square',
        'astral': '\uD806[\uDE00-\uDE47]'
    }
];

var unicodeScripts = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _scripts = interopRequireDefault(scripts);

/*!
 * XRegExp Unicode Scripts 4.2.4
 * <xregexp.com>
 * Steven Levithan (c) 2010-present MIT License
 * Unicode data by Mathias Bynens <mathiasbynens.be>
 */
var _default = function _default(XRegExp) {
  /**
   * Adds support for all Unicode scripts. E.g., `\p{Latin}`. Token names are case insensitive,
   * and any spaces, hyphens, and underscores are ignored.
   *
   * Uses Unicode 11.0.0.
   *
   * @requires XRegExp, Unicode Base
   */
  if (!XRegExp.addUnicodeData) {
    throw new ReferenceError('Unicode Base must be loaded before Unicode Scripts');
  }

  XRegExp.addUnicodeData(_scripts.default);
};

exports.default = _default;
module.exports = exports["default"];
});

unwrapExports(unicodeScripts);

var lib = createCommonjsModule(function (module, exports) {



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _xregexp = interopRequireDefault(xregexp);

var _build = interopRequireDefault(build);

var _matchrecursive = interopRequireDefault(matchrecursive);

var _unicodeBase = interopRequireDefault(unicodeBase);

var _unicodeBlocks = interopRequireDefault(unicodeBlocks);

var _unicodeCategories = interopRequireDefault(unicodeCategories);

var _unicodeProperties = interopRequireDefault(unicodeProperties);

var _unicodeScripts = interopRequireDefault(unicodeScripts);

(0, _build.default)(_xregexp.default);
(0, _matchrecursive.default)(_xregexp.default);
(0, _unicodeBase.default)(_xregexp.default);
(0, _unicodeBlocks.default)(_xregexp.default);
(0, _unicodeCategories.default)(_xregexp.default);
(0, _unicodeProperties.default)(_xregexp.default);
(0, _unicodeScripts.default)(_xregexp.default);
var _default = _xregexp.default;
exports.default = _default;
module.exports = exports["default"];
});

var XRegExp = unwrapExports(lib);

//
// Sample word list for use with the HSXKPasswd JavaScript Module compiled by Bart Busschots.
//
// Copyright 2019 Bart Busschots T/A Bartificer Web Solutions. All rights reserved.
//
// Word list based on the work of Josh Kaufman, https://github.com/first20hours/google-10000-english
// That repo contains LICENSE.MD, which states:
// Data files are derived from the Google Web Trillion Word Corpus, as described by Thorsten Brants and Alex Franz, and 
// distributed by the Linguistic Data Consortium. Subsets of this corpus distributed by Peter Novig. Corpus editing and 
// cleanup by Josh Kaufman
//
// Redistribution and use in source and binary forms, with or without modification, are
// permitted provided that the following conditions are met:
//
//   1. Redistributions of source code must retain the above copyright notice, this list of
//      conditions and the following disclaimer.
//
//   2. Redistributions in binary form must reproduce the above copyright notice, this list
//      of conditions and the following disclaimer in the documentation and/or other materials
//      provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY BART BUSSCHOTS T/A BARTIFICER WEB SOLUTIONS ''AS IS'' AND ANY
// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL
// BART BUSSCHOTS T/A BARTIFICER WEB SOLUTIONS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
// INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
// BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
// STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE
// USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
var DEFAULT_WORD_LIST = [
    'aaron',
    'abandoned',
    'aberdeen',
    'abilities',
    'ability',
    'able',
    'aboriginal',
    'abortion',
    'about',
    'above',
    'abraham',
    'abroad',
    'absence',
    'absent',
    'absolute',
    'absolutely',
    'absorption',
    'abstract',
    'abstracts',
    'abuse',
    'academic',
    'academics',
    'academy',
    'accent',
    'accept',
    'acceptable',
    'acceptance',
    'accepted',
    'accepting',
    'accepts',
    'access',
    'accessed',
    'accessibility',
    'accessible',
    'accessing',
    'accessories',
    'accessory',
    'accident',
    'accidents',
    'accommodate',
    'accommodation',
    'accommodations',
    'accompanied',
    'accompanying',
    'accomplish',
    'accomplished',
    'accordance',
    'according',
    'accordingly',
    'account',
    'accountability',
    'accounting',
    'accounts',
    'accreditation',
    'accredited',
    'accuracy',
    'accurate',
    'accurately',
    'accused',
    'acdbentity',
    'acer',
    'achieve',
    'achieved',
    'achievement',
    'achievements',
    'achieving',
    'acid',
    'acids',
    'acknowledge',
    'acknowledged',
    'acne',
    'acoustic',
    'acquire',
    'acquired',
    'acquisition',
    'acquisitions',
    'acre',
    'acres',
    'acrobat',
    'across',
    'acrylic',
    'acting',
    'action',
    'actions',
    'activated',
    'activation',
    'active',
    'actively',
    'activists',
    'activities',
    'activity',
    'actor',
    'actors',
    'actress',
    'acts',
    'actual',
    'actually',
    'acute',
    'adam',
    'adams',
    'adaptation',
    'adapted',
    'adapter',
    'adapters',
    'adaptive',
    'adaptor',
    'added',
    'addiction',
    'adding',
    'addition',
    'additional',
    'additionally',
    'additions',
    'address',
    'addressed',
    'addresses',
    'addressing',
    'adds',
    'adelaide',
    'adequate',
    'adidas',
    'adipex',
    'adjacent',
    'adjective',
    'adjust',
    'adjustable',
    'adjusted',
    'adjustment',
    'adjustments',
    'admin',
    'administered',
    'administration',
    'administrative',
    'administrator',
    'administrators',
    'admission',
    'admissions',
    'admit',
    'admitted',
    'adobe',
    'adolescent',
    'adopt',
    'adopted',
    'adoption',
    'adrian',
    'adsl',
    'adult',
    'adults',
    'advance',
    'advanced',
    'advancement',
    'advances',
    'advantage',
    'advantages',
    'adventure',
    'adventures',
    'adverse',
    'advert',
    'advertise',
    'advertisement',
    'advertisements',
    'advertiser',
    'advertisers',
    'advertising',
    'advice',
    'advise',
    'advised',
    'advisor',
    'advisors',
    'advisory',
    'advocacy',
    'advocate',
    'adware',
    'aerial',
    'aerospace',
    'affair',
    'affairs',
    'affect',
    'affected',
    'affecting',
    'affects',
    'affiliate',
    'affiliated',
    'affiliates',
    'affiliation',
    'afford',
    'affordable',
    'afghanistan',
    'afraid',
    'africa',
    'african',
    'after',
    'afternoon',
    'afterwards',
    'again',
    'against',
    'aged',
    'agencies',
    'agency',
    'agenda',
    'agent',
    'agents',
    'ages',
    'aggregate',
    'aggressive',
    'aging',
    'agree',
    'agreed',
    'agreement',
    'agreements',
    'agrees',
    'agricultural',
    'agriculture',
    'ahead',
    'aids',
    'aimed',
    'aims',
    'aircraft',
    'airfare',
    'airline',
    'airlines',
    'airplane',
    'airport',
    'airports',
    'alabama',
    'alan',
    'alarm',
    'alaska',
    'albania',
    'albany',
    'albert',
    'alberta',
    'album',
    'albums',
    'albuquerque',
    'alcohol',
    'alert',
    'alerts',
    'alex',
    'alexander',
    'alexandria',
    'alfred',
    'algebra',
    'algeria',
    'algorithm',
    'algorithms',
    'alias',
    'alice',
    'alien',
    'align',
    'alignment',
    'alike',
    'alive',
    'allah',
    'allan',
    'alleged',
    'allen',
    'allergy',
    'alliance',
    'allied',
    'allocated',
    'allocation',
    'allow',
    'allowance',
    'allowed',
    'allowing',
    'allows',
    'alloy',
    'almost',
    'alone',
    'along',
    'alot',
    'alpha',
    'alphabetical',
    'alpine',
    'already',
    'also',
    'alter',
    'altered',
    'alternate',
    'alternative',
    'alternatively',
    'alternatives',
    'although',
    'alto',
    'aluminium',
    'aluminum',
    'alumni',
    'always',
    'amanda',
    'amateur',
    'amazing',
    'amazon',
    'ambassador',
    'amber',
    'ambien',
    'ambient',
    'amend',
    'amended',
    'amendment',
    'amendments',
    'amenities',
    'america',
    'american',
    'americans',
    'americas',
    'amino',
    'among',
    'amongst',
    'amount',
    'amounts',
    'ampland',
    'amplifier',
    'amsterdam',
    'anaheim',
    'analog',
    'analyses',
    'analysis',
    'analyst',
    'analysts',
    'analytical',
    'analyze',
    'analyzed',
    'anatomy',
    'anchor',
    'ancient',
    'andale',
    'anderson',
    'andorra',
    'andrea',
    'andreas',
    'andrew',
    'andrews',
    'andy',
    'angel',
    'angela',
    'angeles',
    'angels',
    'anger',
    'angle',
    'angola',
    'angry',
    'animal',
    'animals',
    'animated',
    'animation',
    'anime',
    'anna',
    'anne',
    'annex',
    'annie',
    'anniversary',
    'annotated',
    'annotation',
    'announce',
    'announced',
    'announcement',
    'announcements',
    'announces',
    'annoying',
    'annual',
    'annually',
    'anonymous',
    'another',
    'answer',
    'answered',
    'answering',
    'answers',
    'antarctica',
    'antenna',
    'anthony',
    'anthropology',
    'anti',
    'antibodies',
    'antibody',
    'anticipated',
    'antigua',
    'antique',
    'antiques',
    'antivirus',
    'antonio',
    'anxiety',
    'anybody',
    'anymore',
    'anyone',
    'anything',
    'anytime',
    'anyway',
    'anywhere',
    'apache',
    'apart',
    'apartment',
    'apartments',
    'apnic',
    'apollo',
    'apparatus',
    'apparel',
    'apparent',
    'apparently',
    'appeal',
    'appeals',
    'appear',
    'appearance',
    'appeared',
    'appearing',
    'appears',
    'appendix',
    'apple',
    'appliance',
    'appliances',
    'applicable',
    'applicant',
    'applicants',
    'application',
    'applications',
    'applied',
    'applies',
    'apply',
    'applying',
    'appointed',
    'appointment',
    'appointments',
    'appraisal',
    'appreciate',
    'appreciated',
    'appreciation',
    'approach',
    'approaches',
    'appropriate',
    'appropriations',
    'approval',
    'approve',
    'approved',
    'approx',
    'approximate',
    'approximately',
    'apps',
    'april',
    'aqua',
    'aquarium',
    'aquatic',
    'arab',
    'arabia',
    'arabic',
    'arbitrary',
    'arbitration',
    'arbor',
    'arcade',
    'arch',
    'architect',
    'architects',
    'architectural',
    'architecture',
    'archive',
    'archived',
    'archives',
    'arctic',
    'area',
    'areas',
    'arena',
    'argentina',
    'argue',
    'argued',
    'argument',
    'arguments',
    'arise',
    'arising',
    'arizona',
    'arkansas',
    'arlington',
    'armed',
    'armenia',
    'armor',
    'arms',
    'armstrong',
    'army',
    'arnold',
    'around',
    'arrange',
    'arranged',
    'arrangement',
    'arrangements',
    'array',
    'arrest',
    'arrested',
    'arrival',
    'arrivals',
    'arrive',
    'arrived',
    'arrives',
    'arrow',
    'arthritis',
    'arthur',
    'article',
    'articles',
    'artificial',
    'artist',
    'artistic',
    'artists',
    'arts',
    'artwork',
    'aruba',
    'asbestos',
    'ascii',
    'ashley',
    'asia',
    'asian',
    'aside',
    'asin',
    'asked',
    'asking',
    'asks',
    'aspect',
    'aspects',
    'assault',
    'assembled',
    'assembly',
    'assess',
    'assessed',
    'assessing',
    'assessment',
    'assessments',
    'asset',
    'assets',
    'assign',
    'assigned',
    'assignment',
    'assignments',
    'assist',
    'assistance',
    'assistant',
    'assisted',
    'assists',
    'associate',
    'associated',
    'associates',
    'association',
    'associations',
    'assume',
    'assumed',
    'assumes',
    'assuming',
    'assumption',
    'assumptions',
    'assurance',
    'assure',
    'assured',
    'asthma',
    'astrology',
    'astronomy',
    'asus',
    'asylum',
    'athens',
    'athletes',
    'athletic',
    'athletics',
    'atlanta',
    'atlantic',
    'atlas',
    'atmosphere',
    'atmospheric',
    'atom',
    'atomic',
    'attach',
    'attached',
    'attachment',
    'attachments',
    'attack',
    'attacked',
    'attacks',
    'attempt',
    'attempted',
    'attempting',
    'attempts',
    'attend',
    'attendance',
    'attended',
    'attending',
    'attention',
    'attitude',
    'attitudes',
    'attorney',
    'attorneys',
    'attract',
    'attraction',
    'attractions',
    'attractive',
    'attribute',
    'attributes',
    'auburn',
    'auckland',
    'auction',
    'auctions',
    'audi',
    'audience',
    'audio',
    'audit',
    'auditor',
    'august',
    'aunt',
    'aurora',
    'austin',
    'australia',
    'australian',
    'austria',
    'authentic',
    'authentication',
    'author',
    'authorities',
    'authority',
    'authorization',
    'authorized',
    'authors',
    'auto',
    'automated',
    'automatic',
    'automatically',
    'automation',
    'automobile',
    'automobiles',
    'automotive',
    'autos',
    'autumn',
    'availability',
    'available',
    'avatar',
    'avenue',
    'average',
    'aviation',
    'avoid',
    'avoiding',
    'avon',
    'award',
    'awarded',
    'awards',
    'aware',
    'awareness',
    'away',
    'awesome',
    'awful',
    'axis',
    'azerbaijan',
    'babe',
    'babes',
    'babies',
    'baby',
    'bachelor',
    'back',
    'backed',
    'background',
    'backgrounds',
    'backing',
    'backup',
    'bacon',
    'bacteria',
    'bacterial',
    'badge',
    'badly',
    'baghdad',
    'bags',
    'bahamas',
    'bahrain',
    'bailey',
    'baker',
    'baking',
    'balance',
    'balanced',
    'bald',
    'bali',
    'ball',
    'ballet',
    'balloon',
    'ballot',
    'baltimore',
    'banana',
    'band',
    'bands',
    'bandwidth',
    'bang',
    'bangbus',
    'bangkok',
    'bangladesh',
    'bank',
    'banker',
    'banking',
    'bankruptcy',
    'banks',
    'banned',
    'banner',
    'banners',
    'baptist',
    'barbados',
    'barbara',
    'barbie',
    'barcelona',
    'bare',
    'barely',
    'bargain',
    'bargains',
    'barn',
    'barnes',
    'barrel',
    'barrier',
    'barriers',
    'barry',
    'bars',
    'base',
    'baseball',
    'based',
    'baseline',
    'basement',
    'basename',
    'bases',
    'basic',
    'basically',
    'basics',
    'basin',
    'basis',
    'basket',
    'basketball',
    'baskets',
    'bass',
    'batch',
    'bath',
    'bathroom',
    'bathrooms',
    'baths',
    'batman',
    'batteries',
    'battery',
    'battle',
    'battlefield',
    'beach',
    'beaches',
    'beads',
    'beam',
    'bean',
    'beans',
    'bear',
    'bearing',
    'bears',
    'beast',
    'beastality',
    'beat',
    'beatles',
    'beats',
    'beautiful',
    'beautifully',
    'beauty',
    'beaver',
    'became',
    'because',
    'become',
    'becomes',
    'becoming',
    'bedding',
    'bedford',
    'bedroom',
    'bedrooms',
    'beds',
    'beef',
    'been',
    'beer',
    'before',
    'began',
    'begin',
    'beginner',
    'beginners',
    'beginning',
    'begins',
    'begun',
    'behalf',
    'behavior',
    'behavioral',
    'behaviour',
    'behind',
    'beijing',
    'being',
    'beings',
    'belarus',
    'belfast',
    'belgium',
    'belief',
    'beliefs',
    'believe',
    'believed',
    'believes',
    'belize',
    'belkin',
    'bell',
    'belle',
    'belly',
    'belong',
    'belongs',
    'below',
    'belt',
    'belts',
    'bench',
    'benchmark',
    'bend',
    'beneath',
    'beneficial',
    'benefit',
    'benefits',
    'benjamin',
    'bennett',
    'bent',
    'benz',
    'berkeley',
    'berlin',
    'bermuda',
    'bernard',
    'berry',
    'beside',
    'besides',
    'best',
    'bestsellers',
    'beta',
    'beth',
    'better',
    'betting',
    'betty',
    'between',
    'beverage',
    'beverages',
    'beverly',
    'beyond',
    'bhutan',
    'bias',
    'bible',
    'biblical',
    'bibliographic',
    'bibliography',
    'bicycle',
    'bidder',
    'bidding',
    'bids',
    'bigger',
    'biggest',
    'bike',
    'bikes',
    'bikini',
    'bill',
    'billing',
    'billion',
    'bills',
    'billy',
    'binary',
    'bind',
    'binding',
    'bingo',
    'biodiversity',
    'biographies',
    'biography',
    'biol',
    'biological',
    'biology',
    'bios',
    'biotechnology',
    'bird',
    'birds',
    'birmingham',
    'birth',
    'birthday',
    'bishop',
    'bite',
    'bits',
    'bizarre',
    'bizrate',
    'black',
    'blackberry',
    'blackjack',
    'blacks',
    'blade',
    'blades',
    'blah',
    'blair',
    'blake',
    'blame',
    'blank',
    'blanket',
    'blast',
    'bleeding',
    'blend',
    'bless',
    'blessed',
    'blind',
    'blink',
    'block',
    'blocked',
    'blocking',
    'blocks',
    'blog',
    'blogger',
    'bloggers',
    'blogging',
    'blogs',
    'blond',
    'blonde',
    'blood',
    'bloom',
    'bloomberg',
    'blow',
    'blowing',
    'blue',
    'blues',
    'bluetooth',
    'blvd',
    'board',
    'boards',
    'boat',
    'boating',
    'boats',
    'bobby',
    'bodies',
    'body',
    'bold',
    'bolivia',
    'bolt',
    'bomb',
    'bond',
    'bonds',
    'bone',
    'bones',
    'bonus',
    'book',
    'booking',
    'bookings',
    'bookmark',
    'bookmarks',
    'books',
    'bookstore',
    'bool',
    'boolean',
    'boom',
    'boost',
    'boot',
    'booth',
    'boots',
    'booty',
    'border',
    'borders',
    'bored',
    'boring',
    'born',
    'borough',
    'borrow',
    'bosnia',
    'boss',
    'boston',
    'both',
    'bother',
    'botswana',
    'bottle',
    'bottles',
    'bottom',
    'bought',
    'boulder',
    'boulevard',
    'bound',
    'boundaries',
    'boundary',
    'bouquet',
    'boutique',
    'bowl',
    'bowling',
    'boxed',
    'boxes',
    'boxing',
    'boys',
    'bracelet',
    'bracelets',
    'bracket',
    'brad',
    'bradford',
    'bradley',
    'brain',
    'brake',
    'brakes',
    'branch',
    'branches',
    'brand',
    'brandon',
    'brands',
    'bras',
    'brass',
    'brave',
    'brazil',
    'brazilian',
    'breach',
    'bread',
    'break',
    'breakdown',
    'breakfast',
    'breaking',
    'breaks',
    'breast',
    'breath',
    'breathing',
    'breed',
    'breeding',
    'breeds',
    'brian',
    'brick',
    'bridal',
    'bride',
    'bridge',
    'bridges',
    'brief',
    'briefing',
    'briefly',
    'briefs',
    'bright',
    'brighton',
    'brilliant',
    'bring',
    'bringing',
    'brings',
    'brisbane',
    'bristol',
    'britain',
    'britannica',
    'british',
    'britney',
    'broad',
    'broadband',
    'broadcast',
    'broadcasting',
    'broader',
    'broadway',
    'brochure',
    'brochures',
    'broke',
    'broken',
    'broker',
    'brokers',
    'bronze',
    'brook',
    'brooklyn',
    'brooks',
    'brother',
    'brothers',
    'brought',
    'brown',
    'browse',
    'browser',
    'browsers',
    'browsing',
    'bruce',
    'brunei',
    'brunette',
    'brunswick',
    'brush',
    'brussels',
    'brutal',
    'bryan',
    'bryant',
    'bubble',
    'buck',
    'bucks',
    'budapest',
    'buddy',
    'budget',
    'budgets',
    'buffalo',
    'buffer',
    'bufing',
    'bugs',
    'build',
    'builder',
    'builders',
    'building',
    'buildings',
    'builds',
    'built',
    'bulgaria',
    'bulgarian',
    'bulk',
    'bull',
    'bullet',
    'bulletin',
    'bumper',
    'bunch',
    'bundle',
    'bunny',
    'burden',
    'bureau',
    'buried',
    'burke',
    'burlington',
    'burn',
    'burner',
    'burning',
    'burns',
    'burst',
    'burton',
    'buses',
    'bush',
    'business',
    'businesses',
    'busy',
    'butler',
    'butter',
    'butterfly',
    'button',
    'buttons',
    'butts',
    'buyer',
    'buyers',
    'buying',
    'buys',
    'buzz',
    'byte',
    'bytes',
    'cabin',
    'cabinet',
    'cabinets',
    'cable',
    'cables',
    'cache',
    'cached',
    'cadillac',
    'cafe',
    'cage',
    'cake',
    'cakes',
    'calcium',
    'calculate',
    'calculated',
    'calculation',
    'calculations',
    'calculator',
    'calculators',
    'calendar',
    'calendars',
    'calgary',
    'calibration',
    'california',
    'call',
    'called',
    'calling',
    'calls',
    'calm',
    'calvin',
    'cambodia',
    'cambridge',
    'camcorder',
    'camcorders',
    'came',
    'camel',
    'camera',
    'cameras',
    'cameron',
    'cameroon',
    'camp',
    'campaign',
    'campaigns',
    'campbell',
    'camping',
    'camps',
    'campus',
    'cams',
    'canada',
    'canadian',
    'canal',
    'canberra',
    'cancel',
    'cancellation',
    'cancelled',
    'cancer',
    'candidate',
    'candidates',
    'candle',
    'candles',
    'candy',
    'cannon',
    'cannot',
    'canon',
    'cant',
    'canvas',
    'canyon',
    'capabilities',
    'capability',
    'capable',
    'capacity',
    'cape',
    'capital',
    'capitol',
    'caps',
    'captain',
    'capture',
    'captured',
    'carb',
    'carbon',
    'card',
    'cardiac',
    'cardiff',
    'cardiovascular',
    'cards',
    'care',
    'career',
    'careers',
    'careful',
    'carefully',
    'carey',
    'cargo',
    'caribbean',
    'caring',
    'carl',
    'carlo',
    'carlos',
    'carmen',
    'carnival',
    'carol',
    'carolina',
    'caroline',
    'carpet',
    'carried',
    'carrier',
    'carriers',
    'carries',
    'carroll',
    'carry',
    'carrying',
    'cars',
    'cart',
    'carter',
    'cartoon',
    'cartoons',
    'cartridge',
    'cartridges',
    'casa',
    'case',
    'cases',
    'casey',
    'cash',
    'cashiers',
    'casino',
    'casinos',
    'casio',
    'cassette',
    'cast',
    'casting',
    'castle',
    'casual',
    'catalog',
    'catalogs',
    'catalogue',
    'catalyst',
    'catch',
    'categories',
    'category',
    'catering',
    'cathedral',
    'catherine',
    'catholic',
    'cats',
    'cattle',
    'caught',
    'cause',
    'caused',
    'causes',
    'causing',
    'caution',
    'cave',
    'cayman',
    'cdna',
    'cedar',
    'ceiling',
    'celebrate',
    'celebration',
    'celebrities',
    'celebrity',
    'celebs',
    'cell',
    'cells',
    'cellular',
    'celtic',
    'cement',
    'cemetery',
    'census',
    'cent',
    'center',
    'centered',
    'centers',
    'central',
    'centre',
    'centres',
    'cents',
    'centuries',
    'century',
    'ceramic',
    'ceremony',
    'certain',
    'certainly',
    'certificate',
    'certificates',
    'certification',
    'certified',
    'chad',
    'chain',
    'chains',
    'chair',
    'chairman',
    'chairs',
    'challenge',
    'challenged',
    'challenges',
    'challenging',
    'chamber',
    'chambers',
    'champagne',
    'champion',
    'champions',
    'championship',
    'championships',
    'chan',
    'chance',
    'chancellor',
    'chances',
    'change',
    'changed',
    'changelog',
    'changes',
    'changing',
    'channel',
    'channels',
    'chaos',
    'chapel',
    'chapter',
    'chapters',
    'char',
    'character',
    'characteristic',
    'characteristics',
    'characterization',
    'characterized',
    'characters',
    'charge',
    'charged',
    'charger',
    'chargers',
    'charges',
    'charging',
    'charitable',
    'charity',
    'charles',
    'charleston',
    'charlie',
    'charlotte',
    'charm',
    'charming',
    'charms',
    'chart',
    'charter',
    'charts',
    'chase',
    'chassis',
    'chat',
    'cheap',
    'cheaper',
    'cheapest',
    'cheat',
    'cheats',
    'check',
    'checked',
    'checking',
    'checklist',
    'checkout',
    'checks',
    'cheers',
    'cheese',
    'chef',
    'chelsea',
    'chem',
    'chemical',
    'chemicals',
    'chemistry',
    'chen',
    'cheque',
    'cherry',
    'chess',
    'chest',
    'chester',
    'chevrolet',
    'chevy',
    'chicago',
    'chick',
    'chicken',
    'chicks',
    'chief',
    'child',
    'childhood',
    'children',
    'childrens',
    'chile',
    'china',
    'chinese',
    'chip',
    'chips',
    'chocolate',
    'choice',
    'choices',
    'choir',
    'cholesterol',
    'choose',
    'choosing',
    'chorus',
    'chose',
    'chosen',
    'chris',
    'christ',
    'christian',
    'christianity',
    'christians',
    'christina',
    'christine',
    'christmas',
    'christopher',
    'chrome',
    'chronic',
    'chronicle',
    'chronicles',
    'chrysler',
    'chubby',
    'chuck',
    'church',
    'churches',
    'cialis',
    'ciao',
    'cigarette',
    'cigarettes',
    'cincinnati',
    'cindy',
    'cinema',
    'cingular',
    'circle',
    'circles',
    'circuit',
    'circuits',
    'circular',
    'circulation',
    'circumstances',
    'circus',
    'cisco',
    'citation',
    'citations',
    'cite',
    'cited',
    'cities',
    'citizen',
    'citizens',
    'citizenship',
    'city',
    'citysearch',
    'civic',
    'civil',
    'civilian',
    'civilization',
    'claim',
    'claimed',
    'claims',
    'claire',
    'clan',
    'clara',
    'clarity',
    'clark',
    'clarke',
    'class',
    'classes',
    'classic',
    'classical',
    'classics',
    'classification',
    'classified',
    'classifieds',
    'classroom',
    'clause',
    'clay',
    'clean',
    'cleaner',
    'cleaners',
    'cleaning',
    'cleanup',
    'clear',
    'clearance',
    'cleared',
    'clearing',
    'clearly',
    'clerk',
    'cleveland',
    'click',
    'clicking',
    'clicks',
    'client',
    'clients',
    'cliff',
    'climate',
    'climb',
    'climbed',
    'climbing',
    'clinic',
    'clinical',
    'clinics',
    'clinton',
    'clip',
    'clips',
    'clock',
    'clocks',
    'clone',
    'close',
    'closed',
    'closely',
    'closer',
    'closes',
    'closest',
    'closing',
    'closure',
    'cloth',
    'clothes',
    'clothing',
    'cloud',
    'clouds',
    'cloudy',
    'club',
    'clubs',
    'cluster',
    'clusters',
    'cnet',
    'coach',
    'coaches',
    'coaching',
    'coal',
    'coalition',
    'coast',
    'coastal',
    'coat',
    'coated',
    'coating',
    'cocktail',
    'code',
    'codes',
    'coding',
    'coffee',
    'cognitive',
    'cohen',
    'coin',
    'coins',
    'cold',
    'cole',
    'coleman',
    'colin',
    'collaboration',
    'collaborative',
    'collapse',
    'collar',
    'colleague',
    'colleagues',
    'collect',
    'collectables',
    'collected',
    'collectible',
    'collectibles',
    'collecting',
    'collection',
    'collections',
    'collective',
    'collector',
    'collectors',
    'college',
    'colleges',
    'collins',
    'cologne',
    'colombia',
    'colon',
    'colonial',
    'colony',
    'color',
    'colorado',
    'colored',
    'colors',
    'colour',
    'colours',
    'columbia',
    'columbus',
    'column',
    'Column1',
    'columnists',
    'columns',
    'combat',
    'combination',
    'combinations',
    'combine',
    'combined',
    'combines',
    'combining',
    'combo',
    'come',
    'comedy',
    'comes',
    'comfort',
    'comfortable',
    'comic',
    'comics',
    'coming',
    'comm',
    'command',
    'commander',
    'commands',
    'comment',
    'commentary',
    'commented',
    'comments',
    'commerce',
    'commercial',
    'commission',
    'commissioner',
    'commissioners',
    'commissions',
    'commit',
    'commitment',
    'commitments',
    'committed',
    'committee',
    'committees',
    'commodities',
    'commodity',
    'common',
    'commonly',
    'commons',
    'commonwealth',
    'communicate',
    'communication',
    'communications',
    'communist',
    'communities',
    'community',
    'comp',
    'compact',
    'companies',
    'companion',
    'company',
    'compaq',
    'comparable',
    'comparative',
    'compare',
    'compared',
    'comparing',
    'comparison',
    'comparisons',
    'compatibility',
    'compatible',
    'compensation',
    'compete',
    'competent',
    'competing',
    'competition',
    'competitions',
    'competitive',
    'competitors',
    'compilation',
    'compile',
    'compiled',
    'compiler',
    'complaint',
    'complaints',
    'complement',
    'complete',
    'completed',
    'completely',
    'completing',
    'completion',
    'complex',
    'complexity',
    'compliance',
    'compliant',
    'complicated',
    'complications',
    'complimentary',
    'comply',
    'component',
    'components',
    'composed',
    'composer',
    'composite',
    'composition',
    'compound',
    'compounds',
    'comprehensive',
    'compressed',
    'compression',
    'compromise',
    'computation',
    'computational',
    'compute',
    'computed',
    'computer',
    'computers',
    'computing',
    'concentrate',
    'concentration',
    'concentrations',
    'concept',
    'concepts',
    'conceptual',
    'concern',
    'concerned',
    'concerning',
    'concerns',
    'concert',
    'concerts',
    'conclude',
    'concluded',
    'conclusion',
    'conclusions',
    'concord',
    'concrete',
    'condition',
    'conditional',
    'conditioning',
    'conditions',
    'condo',
    'condos',
    'conduct',
    'conducted',
    'conducting',
    'conf',
    'conference',
    'conferences',
    'conferencing',
    'confidence',
    'confident',
    'confidential',
    'confidentiality',
    'config',
    'configuration',
    'configurations',
    'configure',
    'configured',
    'configuring',
    'confirm',
    'confirmation',
    'confirmed',
    'conflict',
    'conflicts',
    'confused',
    'confusion',
    'congo',
    'congratulations',
    'congress',
    'congressional',
    'conjunction',
    'connect',
    'connected',
    'connecticut',
    'connecting',
    'connection',
    'connections',
    'connectivity',
    'connector',
    'connectors',
    'cons',
    'conscious',
    'consciousness',
    'consecutive',
    'consensus',
    'consent',
    'consequence',
    'consequences',
    'consequently',
    'conservation',
    'conservative',
    'consider',
    'considerable',
    'consideration',
    'considerations',
    'considered',
    'considering',
    'considers',
    'consist',
    'consistency',
    'consistent',
    'consistently',
    'consisting',
    'consists',
    'console',
    'consoles',
    'consolidated',
    'consolidation',
    'consonant',
    'consortium',
    'conspiracy',
    'const',
    'constant',
    'constantly',
    'constitute',
    'constitutes',
    'constitution',
    'constitutional',
    'constraint',
    'constraints',
    'construct',
    'constructed',
    'construction',
    'consult',
    'consultancy',
    'consultant',
    'consultants',
    'consultation',
    'consulting',
    'consumer',
    'consumers',
    'consumption',
    'contact',
    'contacted',
    'contacting',
    'contacts',
    'contain',
    'contained',
    'container',
    'containers',
    'containing',
    'contains',
    'contamination',
    'contemporary',
    'content',
    'contents',
    'contest',
    'contests',
    'context',
    'continent',
    'continental',
    'continually',
    'continue',
    'continued',
    'continues',
    'continuing',
    'continuity',
    'continuous',
    'continuously',
    'contract',
    'contracting',
    'contractor',
    'contractors',
    'contracts',
    'contrary',
    'contrast',
    'contribute',
    'contributed',
    'contributing',
    'contribution',
    'contributions',
    'contributor',
    'contributors',
    'control',
    'controlled',
    'controller',
    'controllers',
    'controlling',
    'controls',
    'controversial',
    'controversy',
    'convenience',
    'convenient',
    'convention',
    'conventional',
    'conventions',
    'convergence',
    'conversation',
    'conversations',
    'conversion',
    'convert',
    'converted',
    'converter',
    'convertible',
    'convicted',
    'conviction',
    'convinced',
    'cook',
    'cookbook',
    'cooked',
    'cookie',
    'cookies',
    'cooking',
    'cool',
    'cooler',
    'cooling',
    'cooper',
    'cooperation',
    'cooperative',
    'coordinate',
    'coordinated',
    'coordinates',
    'coordination',
    'coordinator',
    'cope',
    'copenhagen',
    'copied',
    'copies',
    'copper',
    'copy',
    'copying',
    'copyright',
    'copyrighted',
    'copyrights',
    'coral',
    'cord',
    'cordless',
    'core',
    'cork',
    'corn',
    'cornell',
    'corner',
    'corners',
    'cornwall',
    'corp',
    'corporate',
    'corporation',
    'corporations',
    'corps',
    'corpus',
    'correct',
    'corrected',
    'correction',
    'corrections',
    'correctly',
    'correlation',
    'correspondence',
    'corresponding',
    'corruption',
    'cosmetic',
    'cosmetics',
    'cost',
    'costa',
    'costs',
    'costume',
    'costumes',
    'cottage',
    'cottages',
    'cotton',
    'could',
    'council',
    'councils',
    'counsel',
    'counseling',
    'count',
    'counted',
    'counter',
    'counters',
    'counties',
    'counting',
    'countries',
    'country',
    'counts',
    'county',
    'couple',
    'coupled',
    'couples',
    'coupon',
    'coupons',
    'courage',
    'courier',
    'course',
    'courses',
    'court',
    'courtesy',
    'courts',
    'cove',
    'cover',
    'coverage',
    'covered',
    'covering',
    'covers',
    'cowboy',
    'cows',
    'crack',
    'cradle',
    'craft',
    'crafts',
    'craig',
    'craps',
    'crash',
    'crawford',
    'crazy',
    'cream',
    'create',
    'created',
    'creates',
    'creating',
    'creation',
    'creations',
    'creative',
    'creativity',
    'creator',
    'creature',
    'creatures',
    'credit',
    'credits',
    'creek',
    'crest',
    'crew',
    'cricket',
    'cried',
    'crime',
    'crimes',
    'criminal',
    'crisis',
    'criteria',
    'criterion',
    'critical',
    'criticism',
    'critics',
    'croatia',
    'crop',
    'crops',
    'cross',
    'crossing',
    'crossword',
    'crowd',
    'crown',
    'crucial',
    'crude',
    'cruise',
    'cruises',
    'cruz',
    'crystal',
    'ctrl',
    'cuba',
    'cube',
    'cubic',
    'cuisine',
    'cult',
    'cultural',
    'culture',
    'cultures',
    'cumshots',
    'cumulative',
    'cups',
    'cure',
    'curious',
    'currencies',
    'currency',
    'current',
    'currently',
    'curriculum',
    'cursor',
    'curtis',
    'curve',
    'curves',
    'custody',
    'custom',
    'customer',
    'customers',
    'customise',
    'customize',
    'customized',
    'customs',
    'cute',
    'cuts',
    'cutting',
    'cyber',
    'cycle',
    'cycles',
    'cycling',
    'cylinder',
    'cyprus',
    'czech',
    'daddy',
    'daily',
    'dairy',
    'daisy',
    'dakota',
    'dale',
    'dallas',
    'damage',
    'damaged',
    'damages',
    'damascus',
    'dame',
    'dana',
    'dance',
    'dancing',
    'danger',
    'dangerous',
    'daniel',
    'danish',
    'danny',
    'dans',
    'dare',
    'dark',
    'darkness',
    'darwin',
    'dash',
    'data',
    'database',
    'databases',
    'date',
    'dated',
    'dates',
    'dating',
    'daughter',
    'daughters',
    'dave',
    'david',
    'davidson',
    'davis',
    'dawn',
    'days',
    'dayton',
    'dead',
    'deadline',
    'deadly',
    'deaf',
    'deal',
    'dealer',
    'dealers',
    'dealing',
    'deals',
    'dealt',
    'dealtime',
    'dean',
    'dear',
    'death',
    'deaths',
    'debate',
    'debian',
    'deborah',
    'debt',
    'debug',
    'debut',
    'decade',
    'decades',
    'december',
    'decent',
    'decide',
    'decided',
    'decimal',
    'decision',
    'decisions',
    'deck',
    'declaration',
    'declare',
    'declared',
    'decline',
    'declined',
    'decor',
    'decorating',
    'decorative',
    'decrease',
    'decreased',
    'dedicated',
    'deemed',
    'deep',
    'deeper',
    'deeply',
    'deer',
    'default',
    'defeat',
    'defects',
    'defence',
    'defend',
    'defendant',
    'defense',
    'defensive',
    'deferred',
    'deficit',
    'define',
    'defined',
    'defines',
    'defining',
    'definitely',
    'definition',
    'definitions',
    'degree',
    'degrees',
    'delaware',
    'delay',
    'delayed',
    'delays',
    'delegation',
    'delete',
    'deleted',
    'delhi',
    'delicious',
    'delight',
    'deliver',
    'delivered',
    'delivering',
    'delivers',
    'delivery',
    'dell',
    'delta',
    'deluxe',
    'demand',
    'demanding',
    'demands',
    'demo',
    'democracy',
    'democrat',
    'democratic',
    'democrats',
    'demographic',
    'demonstrate',
    'demonstrated',
    'demonstrates',
    'demonstration',
    'denial',
    'denied',
    'denmark',
    'dennis',
    'dense',
    'density',
    'dental',
    'dentists',
    'denver',
    'deny',
    'department',
    'departmental',
    'departments',
    'departure',
    'depend',
    'dependence',
    'dependent',
    'depending',
    'depends',
    'deployment',
    'deposit',
    'deposits',
    'depot',
    'depression',
    'dept',
    'depth',
    'deputy',
    'derby',
    'derek',
    'derived',
    'descending',
    'describe',
    'described',
    'describes',
    'describing',
    'description',
    'descriptions',
    'desert',
    'deserve',
    'design',
    'designated',
    'designation',
    'designed',
    'designer',
    'designers',
    'designing',
    'designs',
    'desirable',
    'desire',
    'desired',
    'desk',
    'desktop',
    'desktops',
    'desperate',
    'despite',
    'destination',
    'destinations',
    'destiny',
    'destroy',
    'destroyed',
    'destruction',
    'detail',
    'detailed',
    'details',
    'detect',
    'detected',
    'detection',
    'detective',
    'detector',
    'determination',
    'determine',
    'determined',
    'determines',
    'determining',
    'detroit',
    'deutsch',
    'deutsche',
    'deutschland',
    'devel',
    'develop',
    'developed',
    'developer',
    'developers',
    'developing',
    'development',
    'developmental',
    'developments',
    'develops',
    'deviant',
    'deviation',
    'device',
    'devices',
    'devil',
    'devon',
    'devoted',
    'diabetes',
    'diagnosis',
    'diagnostic',
    'diagram',
    'dial',
    'dialog',
    'dialogue',
    'diameter',
    'diamond',
    'diamonds',
    'diana',
    'diane',
    'diary',
    'dice',
    'dicke',
    'dicks',
    'dictionaries',
    'dictionary',
    'died',
    'diego',
    'dies',
    'diesel',
    'diet',
    'dietary',
    'diff',
    'differ',
    'difference',
    'differences',
    'different',
    'differential',
    'differently',
    'difficult',
    'difficulties',
    'difficulty',
    'diffs',
    'digest',
    'digit',
    'digital',
    'dimension',
    'dimensional',
    'dimensions',
    'dining',
    'dinner',
    'diploma',
    'direct',
    'directed',
    'direction',
    'directions',
    'directive',
    'directly',
    'director',
    'directories',
    'directors',
    'directory',
    'dirt',
    'dirty',
    'disabilities',
    'disability',
    'disable',
    'disabled',
    'disagree',
    'disappointed',
    'disaster',
    'disc',
    'discharge',
    'disciplinary',
    'discipline',
    'disciplines',
    'disclaimer',
    'disclaimers',
    'disclose',
    'disclosure',
    'disco',
    'discount',
    'discounted',
    'discounts',
    'discover',
    'discovered',
    'discovery',
    'discrete',
    'discretion',
    'discrimination',
    'discs',
    'discuss',
    'discussed',
    'discusses',
    'discussing',
    'discussion',
    'discussions',
    'disease',
    'diseases',
    'dish',
    'dishes',
    'disk',
    'disks',
    'disney',
    'disorder',
    'disorders',
    'dispatch',
    'dispatched',
    'display',
    'displayed',
    'displaying',
    'displays',
    'disposal',
    'disposition',
    'dispute',
    'disputes',
    'dist',
    'distance',
    'distances',
    'distant',
    'distinct',
    'distinction',
    'distinguished',
    'distribute',
    'distributed',
    'distribution',
    'distributions',
    'distributor',
    'distributors',
    'district',
    'districts',
    'disturbed',
    'dive',
    'diverse',
    'diversity',
    'divide',
    'divided',
    'dividend',
    'divine',
    'diving',
    'division',
    'divisions',
    'divorce',
    'divx',
    'dock',
    'docs',
    'doctor',
    'doctors',
    'doctrine',
    'document',
    'documentary',
    'documentation',
    'documented',
    'documents',
    'dodge',
    'does',
    'dogs',
    'doing',
    'doll',
    'dollar',
    'dollars',
    'dolls',
    'domain',
    'domains',
    'dome',
    'domestic',
    'dominant',
    'dominican',
    'donald',
    'donate',
    'donated',
    'donation',
    'donations',
    'done',
    'donna',
    'donor',
    'donors',
    'dont',
    'doom',
    'door',
    'doors',
    'dosage',
    'dose',
    'double',
    'doubt',
    'doug',
    'douglas',
    'dover',
    'down',
    'download',
    'downloadable',
    'downloaded',
    'downloading',
    'downloads',
    'downtown',
    'dozen',
    'dozens',
    'draft',
    'drag',
    'dragon',
    'drain',
    'drainage',
    'drama',
    'dramatic',
    'dramatically',
    'draw',
    'drawing',
    'drawings',
    'drawn',
    'draws',
    'dream',
    'dreams',
    'dress',
    'dressed',
    'dresses',
    'dressing',
    'drew',
    'dried',
    'drill',
    'drilling',
    'drink',
    'drinking',
    'drinks',
    'drive',
    'driven',
    'driver',
    'drivers',
    'drives',
    'driving',
    'drop',
    'dropped',
    'drops',
    'drove',
    'drug',
    'drugs',
    'drum',
    'drums',
    'drunk',
    'dryer',
    'dual',
    'dubai',
    'dublin',
    'duck',
    'dude',
    'duke',
    'dumb',
    'dump',
    'duncan',
    'duplicate',
    'durable',
    'duration',
    'durham',
    'during',
    'dusk',
    'dust',
    'dutch',
    'duties',
    'duty',
    'dvds',
    'dying',
    'dylan',
    'dynamic',
    'dynamics',
    'each',
    'eagle',
    'eagles',
    'earl',
    'earlier',
    'earliest',
    'early',
    'earn',
    'earned',
    'earning',
    'earnings',
    'earrings',
    'ears',
    'earth',
    'earthquake',
    'ease',
    'easier',
    'easily',
    'east',
    'easter',
    'eastern',
    'easy',
    'eating',
    'ebay',
    'ebony',
    'ebook',
    'ebooks',
    'echo',
    'eclipse',
    'ecological',
    'ecology',
    'ecommerce',
    'economic',
    'economics',
    'economies',
    'economy',
    'ecuador',
    'eddie',
    'eden',
    'edgar',
    'edge',
    'edges',
    'edinburgh',
    'edit',
    'edited',
    'editing',
    'edition',
    'editions',
    'editor',
    'editorial',
    'editorials',
    'editors',
    'edmonton',
    'educated',
    'education',
    'educational',
    'educators',
    'edward',
    'edwards',
    'effect',
    'effective',
    'effectively',
    'effectiveness',
    'effects',
    'efficiency',
    'efficient',
    'efficiently',
    'effort',
    'efforts',
    'eggs',
    'egypt',
    'egyptian',
    'eight',
    'either',
    'elder',
    'elderly',
    'elect',
    'elected',
    'election',
    'elections',
    'electoral',
    'electric',
    'electrical',
    'electricity',
    'electro',
    'electron',
    'electronic',
    'electronics',
    'elegant',
    'element',
    'elementary',
    'elements',
    'elephant',
    'elevation',
    'eleven',
    'eligibility',
    'eligible',
    'eliminate',
    'elimination',
    'elite',
    'elizabeth',
    'ellen',
    'elliott',
    'ellis',
    'else',
    'elsewhere',
    'elvis',
    'emacs',
    'email',
    'emails',
    'embassy',
    'embedded',
    'emerald',
    'emergency',
    'emerging',
    'emily',
    'eminem',
    'emirates',
    'emission',
    'emissions',
    'emma',
    'emotional',
    'emotions',
    'emperor',
    'emphasis',
    'empire',
    'empirical',
    'employ',
    'employed',
    'employee',
    'employees',
    'employer',
    'employers',
    'employment',
    'empty',
    'enable',
    'enabled',
    'enables',
    'enabling',
    'enclosed',
    'enclosure',
    'encoding',
    'encounter',
    'encountered',
    'encourage',
    'encouraged',
    'encourages',
    'encouraging',
    'encryption',
    'encyclopedia',
    'endangered',
    'ended',
    'endif',
    'ending',
    'endless',
    'endorsed',
    'endorsement',
    'ends',
    'enemies',
    'enemy',
    'energy',
    'enforcement',
    'engage',
    'engaged',
    'engagement',
    'engaging',
    'engine',
    'engineer',
    'engineering',
    'engineers',
    'engines',
    'england',
    'english',
    'enhance',
    'enhanced',
    'enhancement',
    'enhancements',
    'enhancing',
    'enjoy',
    'enjoyed',
    'enjoying',
    'enlarge',
    'enlargement',
    'enormous',
    'enough',
    'enquiries',
    'enquiry',
    'enrolled',
    'enrollment',
    'ensemble',
    'ensure',
    'ensures',
    'ensuring',
    'enter',
    'entered',
    'entering',
    'enterprise',
    'enterprises',
    'enters',
    'entertaining',
    'entertainment',
    'entire',
    'entirely',
    'entities',
    'entitled',
    'entity',
    'entrance',
    'entrepreneur',
    'entrepreneurs',
    'entries',
    'entry',
    'envelope',
    'environment',
    'environmental',
    'environments',
    'enzyme',
    'epic',
    'epinions',
    'episode',
    'episodes',
    'epson',
    'equal',
    'equality',
    'equally',
    'equation',
    'equations',
    'equilibrium',
    'equipment',
    'equipped',
    'equity',
    'equivalent',
    'eric',
    'ericsson',
    'erik',
    'erotica',
    'error',
    'errors',
    'escape',
    'escorts',
    'especially',
    'espn',
    'essay',
    'essays',
    'essence',
    'essential',
    'essentially',
    'essentials',
    'essex',
    'establish',
    'established',
    'establishing',
    'establishment',
    'estate',
    'estates',
    'estimate',
    'estimated',
    'estimates',
    'estimation',
    'estonia',
    'etching',
    'eternal',
    'ethernet',
    'ethical',
    'ethics',
    'ethiopia',
    'ethnic',
    'eugene',
    'euro',
    'europe',
    'european',
    'euros',
    'eval',
    'evaluate',
    'evaluated',
    'evaluating',
    'evaluation',
    'evaluations',
    'evanescence',
    'evans',
    'even',
    'evening',
    'event',
    'events',
    'eventually',
    'ever',
    'every',
    'everybody',
    'everyday',
    'everyone',
    'everything',
    'everywhere',
    'evidence',
    'evident',
    'evil',
    'evolution',
    'exact',
    'exactly',
    'exam',
    'examination',
    'examinations',
    'examine',
    'examined',
    'examines',
    'examining',
    'example',
    'examples',
    'exams',
    'exceed',
    'excel',
    'excellence',
    'excellent',
    'except',
    'exception',
    'exceptional',
    'exceptions',
    'excerpt',
    'excess',
    'excessive',
    'exchange',
    'exchanges',
    'excited',
    'excitement',
    'exciting',
    'exclude',
    'excluded',
    'excluding',
    'exclusion',
    'exclusive',
    'exclusively',
    'excuse',
    'exec',
    'execute',
    'executed',
    'execution',
    'executive',
    'executives',
    'exempt',
    'exemption',
    'exercise',
    'exercises',
    'exhaust',
    'exhibit',
    'exhibition',
    'exhibitions',
    'exhibits',
    'exist',
    'existed',
    'existence',
    'existing',
    'exists',
    'exit',
    'exotic',
    'expand',
    'expanded',
    'expanding',
    'expansion',
    'expansys',
    'expect',
    'expectations',
    'expected',
    'expects',
    'expedia',
    'expenditure',
    'expenditures',
    'expense',
    'expenses',
    'expensive',
    'experience',
    'experienced',
    'experiences',
    'experiencing',
    'experiment',
    'experimental',
    'experiments',
    'expert',
    'expertise',
    'experts',
    'expiration',
    'expired',
    'expires',
    'explain',
    'explained',
    'explaining',
    'explains',
    'explanation',
    'explicit',
    'explicitly',
    'exploration',
    'explore',
    'explorer',
    'exploring',
    'explosion',
    'expo',
    'export',
    'exports',
    'exposed',
    'exposure',
    'express',
    'expressed',
    'expression',
    'expressions',
    'extend',
    'extended',
    'extending',
    'extends',
    'extension',
    'extensions',
    'extensive',
    'extent',
    'exterior',
    'external',
    'extra',
    'extract',
    'extraction',
    'extraordinary',
    'extras',
    'extreme',
    'extremely',
    'eyed',
    'eyes',
    'fabric',
    'fabrics',
    'fabulous',
    'face',
    'faced',
    'faces',
    'facial',
    'facilitate',
    'facilities',
    'facility',
    'facing',
    'fact',
    'factor',
    'factories',
    'factors',
    'factory',
    'facts',
    'faculty',
    'fail',
    'failed',
    'failing',
    'fails',
    'failure',
    'failures',
    'fair',
    'fairfield',
    'fairly',
    'fairy',
    'faith',
    'fake',
    'fall',
    'fallen',
    'falling',
    'falls',
    'fame',
    'familiar',
    'families',
    'family',
    'famous',
    'fancy',
    'fans',
    'fantastic',
    'fantasy',
    'faqs',
    'fare',
    'fares',
    'farm',
    'farmer',
    'farmers',
    'farming',
    'farms',
    'fascinating',
    'fashion',
    'fast',
    'faster',
    'fastest',
    'fatal',
    'fate',
    'father',
    'fathers',
    'fatty',
    'fault',
    'favor',
    'favorite',
    'favorites',
    'favors',
    'favour',
    'favourite',
    'favourites',
    'fear',
    'fears',
    'feat',
    'feature',
    'featured',
    'features',
    'featuring',
    'february',
    'federal',
    'federation',
    'feed',
    'feedback',
    'feeding',
    'feeds',
    'feel',
    'feeling',
    'feelings',
    'feels',
    'fees',
    'feet',
    'fell',
    'fellow',
    'fellowship',
    'felt',
    'female',
    'females',
    'fence',
    'feof',
    'ferrari',
    'ferry',
    'festival',
    'festivals',
    'fetish',
    'fever',
    'fewer',
    'fiber',
    'fibre',
    'fiction',
    'field',
    'fields',
    'fifteen',
    'fifth',
    'fifty',
    'fight',
    'fighter',
    'fighters',
    'fighting',
    'figure',
    'figured',
    'figures',
    'fiji',
    'file',
    'filed',
    'filename',
    'files',
    'filing',
    'fill',
    'filled',
    'filling',
    'film',
    'filme',
    'films',
    'filter',
    'filtering',
    'filters',
    'final',
    'finally',
    'finals',
    'finance',
    'finances',
    'financial',
    'financing',
    'find',
    'findarticles',
    'finder',
    'finding',
    'findings',
    'findlaw',
    'finds',
    'fine',
    'finest',
    'finger',
    'fingers',
    'finish',
    'finished',
    'finishing',
    'finite',
    'finland',
    'finnish',
    'fioricet',
    'fire',
    'fired',
    'firefox',
    'fireplace',
    'fires',
    'firewall',
    'firewire',
    'firm',
    'firms',
    'firmware',
    'first',
    'fiscal',
    'fish',
    'fisher',
    'fisheries',
    'fishing',
    'fist',
    'fitness',
    'fits',
    'fitted',
    'fitting',
    'five',
    'fixed',
    'fixes',
    'fixtures',
    'flag',
    'flags',
    'flame',
    'flash',
    'flashers',
    'flashing',
    'flat',
    'flavor',
    'fleece',
    'fleet',
    'flesh',
    'flex',
    'flexibility',
    'flexible',
    'flickr',
    'flier',
    'flight',
    'flights',
    'flip',
    'float',
    'floating',
    'flood',
    'floor',
    'flooring',
    'floors',
    'floppy',
    'floral',
    'florence',
    'florida',
    'florist',
    'florists',
    'flour',
    'flow',
    'flower',
    'flowers',
    'flows',
    'floyd',
    'fluid',
    'flush',
    'flux',
    'flyer',
    'flying',
    'foam',
    'focal',
    'focus',
    'focused',
    'focuses',
    'focusing',
    'fold',
    'folder',
    'folders',
    'folding',
    'folk',
    'folks',
    'follow',
    'followed',
    'following',
    'follows',
    'font',
    'fonts',
    'food',
    'foods',
    'fool',
    'foot',
    'footage',
    'football',
    'footwear',
    'forbes',
    'forbidden',
    'force',
    'forced',
    'forces',
    'ford',
    'forecast',
    'forecasts',
    'foreign',
    'forest',
    'forestry',
    'forests',
    'forever',
    'forge',
    'forget',
    'forgot',
    'forgotten',
    'fork',
    'form',
    'formal',
    'format',
    'formation',
    'formats',
    'formatting',
    'formed',
    'former',
    'formerly',
    'forming',
    'forms',
    'formula',
    'fort',
    'forth',
    'fortieth',
    'fortune',
    'forty',
    'forum',
    'forums',
    'forward',
    'forwarding',
    'fossil',
    'foster',
    'foto',
    'fotos',
    'fought',
    'foul',
    'found',
    'foundation',
    'foundations',
    'founded',
    'founder',
    'fountain',
    'four',
    'fourth',
    'fraction',
    'fragrance',
    'fragrances',
    'frame',
    'framed',
    'frames',
    'framework',
    'framing',
    'france',
    'franchise',
    'francis',
    'francisco',
    'frank',
    'frankfurt',
    'franklin',
    'fraser',
    'fraud',
    'fred',
    'frederick',
    'free',
    'freebsd',
    'freedom',
    'freelance',
    'freely',
    'freeware',
    'freeze',
    'freight',
    'french',
    'frequencies',
    'frequency',
    'frequent',
    'frequently',
    'fresh',
    'friday',
    'fridge',
    'friend',
    'friendly',
    'friends',
    'friendship',
    'frog',
    'from',
    'front',
    'frontier',
    'frontpage',
    'frost',
    'frozen',
    'fruit',
    'fruits',
    'fuel',
    'fuji',
    'fujitsu',
    'full',
    'fully',
    'function',
    'functional',
    'functionality',
    'functioning',
    'functions',
    'fund',
    'fundamental',
    'fundamentals',
    'funded',
    'funding',
    'fundraising',
    'funds',
    'funeral',
    'funk',
    'funky',
    'funny',
    'furnished',
    'furnishings',
    'furniture',
    'further',
    'furthermore',
    'fusion',
    'future',
    'futures',
    'fuzzy',
    'gabriel',
    'gadgets',
    'gage',
    'gain',
    'gained',
    'gains',
    'galaxy',
    'gale',
    'galleries',
    'gallery',
    'gambling',
    'game',
    'gamecube',
    'games',
    'gamespot',
    'gaming',
    'gamma',
    'gang',
    'gaps',
    'garage',
    'garbage',
    'garcia',
    'garden',
    'gardening',
    'gardens',
    'garlic',
    'garmin',
    'gary',
    'gasoline',
    'gate',
    'gates',
    'gateway',
    'gather',
    'gathered',
    'gathering',
    'gauge',
    'gave',
    'gays',
    'gazette',
    'gear',
    'geek',
    'gender',
    'gene',
    'genealogy',
    'general',
    'generally',
    'generate',
    'generated',
    'generates',
    'generating',
    'generation',
    'generations',
    'generator',
    'generators',
    'generic',
    'generous',
    'genes',
    'genesis',
    'genetic',
    'genetics',
    'geneva',
    'genius',
    'genome',
    'genre',
    'genres',
    'gentle',
    'gentleman',
    'gently',
    'genuine',
    'geographic',
    'geographical',
    'geography',
    'geological',
    'geology',
    'geometry',
    'george',
    'georgia',
    'gerald',
    'german',
    'germany',
    'gets',
    'getting',
    'ghana',
    'ghost',
    'giant',
    'giants',
    'gibraltar',
    'gibson',
    'gift',
    'gifts',
    'gilbert',
    'girl',
    'girlfriend',
    'girls',
    'give',
    'given',
    'gives',
    'giving',
    'glad',
    'glance',
    'glasgow',
    'glass',
    'glasses',
    'glen',
    'glenn',
    'global',
    'globe',
    'glory',
    'glossary',
    'gloves',
    'glow',
    'glucose',
    'gmbh',
    'gnome',
    'goal',
    'goals',
    'goat',
    'gods',
    'goes',
    'going',
    'gold',
    'golden',
    'golf',
    'gone',
    'gonna',
    'good',
    'goodbye',
    'goods',
    'google',
    'gordon',
    'gore',
    'gorgeous',
    'gospel',
    'gossip',
    'gothic',
    'goto',
    'gotta',
    'gotten',
    'gourmet',
    'govern',
    'governance',
    'governing',
    'government',
    'governmental',
    'governments',
    'governor',
    'grab',
    'grace',
    'grad',
    'grade',
    'grades',
    'gradually',
    'graduate',
    'graduated',
    'graduates',
    'graduation',
    'graham',
    'grain',
    'grammar',
    'grams',
    'grand',
    'grande',
    'granny',
    'grant',
    'granted',
    'grants',
    'graph',
    'graphic',
    'graphical',
    'graphics',
    'graphs',
    'gras',
    'grass',
    'grateful',
    'gratis',
    'gratuit',
    'grave',
    'gravity',
    'gray',
    'great',
    'greater',
    'greatest',
    'greatly',
    'greece',
    'greek',
    'green',
    'greene',
    'greenhouse',
    'greensboro',
    'greeting',
    'greetings',
    'greg',
    'gregory',
    'grenada',
    'grew',
    'grey',
    'grid',
    'griffin',
    'grill',
    'grip',
    'grocery',
    'groove',
    'gross',
    'ground',
    'grounds',
    'groundwater',
    'group',
    'groups',
    'grove',
    'grow',
    'growing',
    'grown',
    'grows',
    'growth',
    'guam',
    'guarantee',
    'guaranteed',
    'guarantees',
    'guard',
    'guardian',
    'guards',
    'guatemala',
    'guess',
    'guest',
    'guestbook',
    'guests',
    'guidance',
    'guide',
    'guided',
    'guidelines',
    'guides',
    'guild',
    'guilty',
    'guinea',
    'guitar',
    'guitars',
    'gulf',
    'guns',
    'guru',
    'guyana',
    'guys',
    'gzip',
    'habitat',
    'habits',
    'hack',
    'hacker',
    'hair',
    'hairy',
    'haiti',
    'half',
    'halifax',
    'hall',
    'halloween',
    'halo',
    'halt',
    'hamburg',
    'hamilton',
    'hammer',
    'hampshire',
    'hampton',
    'hand',
    'handbags',
    'handbook',
    'handed',
    'handheld',
    'handhelds',
    'handjobs',
    'handle',
    'handled',
    'handles',
    'handling',
    'handmade',
    'hands',
    'handy',
    'hang',
    'hanging',
    'hans',
    'hansen',
    'happen',
    'happened',
    'happening',
    'happens',
    'happiness',
    'happy',
    'harassment',
    'harbor',
    'harbour',
    'hard',
    'hardcover',
    'harder',
    'hardly',
    'hardware',
    'hardwood',
    'harley',
    'harm',
    'harmful',
    'harmony',
    'harold',
    'harper',
    'harris',
    'harrison',
    'harry',
    'hart',
    'hartford',
    'harvard',
    'harvest',
    'harvey',
    'hash',
    'hate',
    'hats',
    'havana',
    'have',
    'haven',
    'having',
    'hawaii',
    'hawaiian',
    'hawk',
    'hayes',
    'hazard',
    'hazardous',
    'hazards',
    'hdtv',
    'head',
    'headed',
    'header',
    'headers',
    'heading',
    'headline',
    'headlines',
    'headphones',
    'headquarters',
    'heads',
    'headset',
    'healing',
    'health',
    'healthcare',
    'healthy',
    'hear',
    'heard',
    'hearing',
    'hearings',
    'heart',
    'hearts',
    'heat',
    'heated',
    'heater',
    'heath',
    'heather',
    'heating',
    'heaven',
    'heavily',
    'heavy',
    'hebrew',
    'heel',
    'height',
    'heights',
    'held',
    'helen',
    'helena',
    'helicopter',
    'hello',
    'helmet',
    'help',
    'helped',
    'helpful',
    'helping',
    'helps',
    'hence',
    'henderson',
    'henry',
    'hepatitis',
    'herald',
    'herb',
    'herbal',
    'herbs',
    'here',
    'hereby',
    'herein',
    'heritage',
    'hero',
    'heroes',
    'hers',
    'herself',
    'hewlett',
    'hidden',
    'hide',
    'hierarchy',
    'high',
    'higher',
    'highest',
    'highland',
    'highlight',
    'highlighted',
    'highlights',
    'highly',
    'highs',
    'highway',
    'highways',
    'hiking',
    'hill',
    'hills',
    'hilton',
    'himself',
    'hindu',
    'hint',
    'hints',
    'hire',
    'hired',
    'hiring',
    'hispanic',
    'hist',
    'historic',
    'historical',
    'history',
    'hitachi',
    'hits',
    'hitting',
    'hobbies',
    'hobby',
    'hockey',
    'hold',
    'holdem',
    'holder',
    'holders',
    'holding',
    'holdings',
    'holds',
    'hole',
    'holes',
    'holiday',
    'holidays',
    'holland',
    'hollow',
    'holly',
    'hollywood',
    'holmes',
    'holocaust',
    'holy',
    'home',
    'homeland',
    'homeless',
    'homepage',
    'homes',
    'hometown',
    'homework',
    'honda',
    'honduras',
    'honest',
    'honey',
    'hong',
    'honolulu',
    'honor',
    'honors',
    'hood',
    'hook',
    'hope',
    'hoped',
    'hopefully',
    'hopes',
    'hoping',
    'hopkins',
    'horizon',
    'horizontal',
    'hormone',
    'horn',
    'horrible',
    'horror',
    'horse',
    'horses',
    'hose',
    'hospital',
    'hospitality',
    'hospitals',
    'host',
    'hosted',
    'hostel',
    'hostels',
    'hosting',
    'hosts',
    'hotel',
    'hotels',
    'hotmail',
    'hottest',
    'hour',
    'hourly',
    'hours',
    'house',
    'household',
    'households',
    'houses',
    'housewares',
    'housewives',
    'housing',
    'houston',
    'howard',
    'however',
    'howto',
    'href',
    'html',
    'http',
    'hudson',
    'huge',
    'hugh',
    'hughes',
    'hugo',
    'hull',
    'human',
    'humanitarian',
    'humanities',
    'humanity',
    'humans',
    'humidity',
    'humor',
    'hundred',
    'hundreds',
    'hung',
    'hungarian',
    'hungary',
    'hunger',
    'hungry',
    'hunt',
    'hunter',
    'hunting',
    'huntington',
    'hurricane',
    'hurry',
    'hurt',
    'husband',
    'hybrid',
    'hydraulic',
    'hydrocodone',
    'hydrogen',
    'hygiene',
    'hypothesis',
    'hypothetical',
    'hyundai',
    'iceland',
    'icon',
    'icons',
    'idaho',
    'idea',
    'ideal',
    'ideas',
    'identical',
    'identification',
    'identified',
    'identifier',
    'identifies',
    'identify',
    'identifying',
    'identity',
    'idle',
    'idol',
    'ieee',
    'ignore',
    'ignored',
    'illegal',
    'illinois',
    'illness',
    'illustrated',
    'illustration',
    'illustrations',
    'image',
    'images',
    'imagination',
    'imagine',
    'imaging',
    'immediate',
    'immediately',
    'immigrants',
    'immigration',
    'immune',
    'immunology',
    'impact',
    'impacts',
    'impaired',
    'imperial',
    'implement',
    'implementation',
    'implemented',
    'implementing',
    'implications',
    'implied',
    'implies',
    'import',
    'importance',
    'important',
    'importantly',
    'imported',
    'imports',
    'impose',
    'imposed',
    'impossible',
    'impressed',
    'impression',
    'impressive',
    'improve',
    'improved',
    'improvement',
    'improvements',
    'improving',
    'inappropriate',
    'inbox',
    'incentive',
    'incentives',
    'inch',
    'inches',
    'incidence',
    'incident',
    'incidents',
    'incl',
    'include',
    'included',
    'includes',
    'including',
    'inclusion',
    'inclusive',
    'income',
    'incoming',
    'incomplete',
    'incorporate',
    'incorporated',
    'incorrect',
    'increase',
    'increased',
    'increases',
    'increasing',
    'increasingly',
    'incredible',
    'incurred',
    'indeed',
    'independence',
    'independent',
    'independently',
    'index',
    'indexed',
    'indexes',
    'india',
    'indian',
    'indiana',
    'indianapolis',
    'indians',
    'indicate',
    'indicated',
    'indicates',
    'indicating',
    'indication',
    'indicator',
    'indicators',
    'indices',
    'indie',
    'indigenous',
    'indirect',
    'individual',
    'individually',
    'individuals',
    'indonesia',
    'indonesian',
    'indoor',
    'induced',
    'induction',
    'industrial',
    'industries',
    'industry',
    'inexpensive',
    'infant',
    'infants',
    'infected',
    'infection',
    'infections',
    'infectious',
    'infinite',
    'inflation',
    'influence',
    'influenced',
    'influences',
    'info',
    'inform',
    'informal',
    'information',
    'informational',
    'informative',
    'informed',
    'infrared',
    'infrastructure',
    'infringement',
    'ingredients',
    'inherited',
    'initial',
    'initially',
    'initiated',
    'initiative',
    'initiatives',
    'injection',
    'injured',
    'injuries',
    'injury',
    'inkjet',
    'inline',
    'inner',
    'innocent',
    'innovation',
    'innovations',
    'innovative',
    'inns',
    'input',
    'inputs',
    'inquire',
    'inquiries',
    'inquiry',
    'insects',
    'insert',
    'inserted',
    'insertion',
    'inside',
    'insider',
    'insight',
    'insights',
    'inspection',
    'inspections',
    'inspector',
    'inspiration',
    'inspired',
    'install',
    'installation',
    'installations',
    'installed',
    'installing',
    'instance',
    'instances',
    'instant',
    'instantly',
    'instead',
    'institute',
    'institutes',
    'institution',
    'institutional',
    'institutions',
    'instruction',
    'instructional',
    'instructions',
    'instructor',
    'instructors',
    'instrument',
    'instrumental',
    'instrumentation',
    'instruments',
    'insulation',
    'insulin',
    'insurance',
    'insured',
    'intake',
    'integer',
    'integral',
    'integrate',
    'integrated',
    'integrating',
    'integration',
    'integrity',
    'intel',
    'intellectual',
    'intelligence',
    'intelligent',
    'intend',
    'intended',
    'intense',
    'intensity',
    'intensive',
    'intent',
    'intention',
    'inter',
    'interact',
    'interaction',
    'interactions',
    'interactive',
    'interest',
    'interested',
    'interesting',
    'interests',
    'interface',
    'interfaces',
    'interference',
    'interim',
    'interior',
    'intermediate',
    'internal',
    'international',
    'internationally',
    'internet',
    'internship',
    'interpretation',
    'interpreted',
    'interracial',
    'intersection',
    'interstate',
    'interval',
    'intervals',
    'intervention',
    'interventions',
    'interview',
    'interviews',
    'intimate',
    'intl',
    'into',
    'intranet',
    'intro',
    'introduce',
    'introduced',
    'introduces',
    'introducing',
    'introduction',
    'introductory',
    'invalid',
    'invasion',
    'invention',
    'inventory',
    'invest',
    'investigate',
    'investigated',
    'investigation',
    'investigations',
    'investigator',
    'investigators',
    'investing',
    'investment',
    'investments',
    'investor',
    'investors',
    'invisible',
    'invision',
    'invitation',
    'invitations',
    'invite',
    'invited',
    'invoice',
    'involve',
    'involved',
    'involvement',
    'involves',
    'involving',
    'iowa',
    'ipaq',
    'ipod',
    'iran',
    'iraq',
    'iraqi',
    'ireland',
    'irish',
    'iron',
    'irrigation',
    'isaac',
    'isbn',
    'islam',
    'islamic',
    'island',
    'islands',
    'isle',
    'isolated',
    'isolation',
    'israel',
    'israeli',
    'issn',
    'issue',
    'issued',
    'issues',
    'istanbul',
    'italia',
    'italian',
    'italiano',
    'italic',
    'italy',
    'item',
    'items',
    'itself',
    'itunes',
    'ivory',
    'jack',
    'jacket',
    'jackets',
    'jackie',
    'jackson',
    'jacksonville',
    'jacob',
    'jade',
    'jaguar',
    'jail',
    'jake',
    'jamaica',
    'james',
    'jamie',
    'jane',
    'janet',
    'january',
    'japan',
    'japanese',
    'jason',
    'java',
    'javascript',
    'jazz',
    'jean',
    'jeans',
    'jeep',
    'jeff',
    'jefferson',
    'jeffrey',
    'jelsoft',
    'jennifer',
    'jenny',
    'jeremy',
    'jerry',
    'jersey',
    'jerusalem',
    'jesse',
    'jessica',
    'jesus',
    'jets',
    'jewel',
    'jewellery',
    'jewelry',
    'jewish',
    'jews',
    'jill',
    'jimmy',
    'joan',
    'jobs',
    'joel',
    'john',
    'johnny',
    'johns',
    'johnson',
    'johnston',
    'join',
    'joined',
    'joining',
    'joins',
    'joint',
    'joke',
    'jokes',
    'jonathan',
    'jones',
    'jordan',
    'jose',
    'joseph',
    'josh',
    'joshua',
    'journal',
    'journalism',
    'journalist',
    'journalists',
    'journals',
    'journey',
    'joyce',
    'jpeg',
    'juan',
    'judge',
    'judges',
    'judgment',
    'judicial',
    'judy',
    'juice',
    'julia',
    'julian',
    'julie',
    'july',
    'jump',
    'jumped',
    'jumping',
    'junction',
    'june',
    'jungle',
    'junior',
    'junk',
    'jupiter',
    'jurisdiction',
    'jury',
    'just',
    'justice',
    'justify',
    'justin',
    'juvenile',
    'kansas',
    'karaoke',
    'karen',
    'karl',
    'karma',
    'kate',
    'kathy',
    'katie',
    'katrina',
    'kazakhstan',
    'keen',
    'keep',
    'keeping',
    'keeps',
    'keith',
    'kelkoo',
    'kelly',
    'kennedy',
    'kenneth',
    'kenny',
    'keno',
    'kent',
    'kentucky',
    'kenya',
    'kept',
    'kernel',
    'kerry',
    'kevin',
    'keyboard',
    'keyboards',
    'keys',
    'keyword',
    'keywords',
    'kick',
    'kidney',
    'kids',
    'kijiji',
    'kill',
    'killed',
    'killer',
    'killing',
    'kills',
    'kilometers',
    'kinase',
    'kind',
    'kinda',
    'kinds',
    'king',
    'kingdom',
    'kings',
    'kingston',
    'kirk',
    'kiss',
    'kissing',
    'kitchen',
    'kits',
    'kitty',
    'klein',
    'knee',
    'knew',
    'knife',
    'knight',
    'knights',
    'knit',
    'knitting',
    'knives',
    'knock',
    'know',
    'knowing',
    'knowledge',
    'knowledgestorm',
    'known',
    'knows',
    'kodak',
    'kong',
    'korea',
    'korean',
    'kruger',
    'kurt',
    'kuwait',
    'kyle',
    'label',
    'labeled',
    'labels',
    'labor',
    'laboratories',
    'laboratory',
    'labour',
    'labs',
    'lace',
    'lack',
    'ladder',
    'laden',
    'ladies',
    'lady',
    'lafayette',
    'laid',
    'lake',
    'lakes',
    'lamb',
    'lambda',
    'lamp',
    'lamps',
    'lancaster',
    'lance',
    'land',
    'landing',
    'lands',
    'landscape',
    'landscapes',
    'lane',
    'lanes',
    'lang',
    'language',
    'languages',
    'lanka',
    'laos',
    'laptop',
    'laptops',
    'large',
    'largely',
    'larger',
    'largest',
    'larry',
    'laser',
    'last',
    'lasting',
    'late',
    'lately',
    'later',
    'latest',
    'latex',
    'latin',
    'latina',
    'latinas',
    'latino',
    'latitude',
    'latter',
    'latvia',
    'lauderdale',
    'laugh',
    'laughed',
    'laughing',
    'laughter',
    'launch',
    'launched',
    'launches',
    'laundry',
    'laura',
    'lauren',
    'lawn',
    'lawrence',
    'laws',
    'lawsuit',
    'lawyer',
    'lawyers',
    'layer',
    'layers',
    'layout',
    'lazy',
    'lead',
    'leader',
    'leaders',
    'leadership',
    'leading',
    'leads',
    'leaf',
    'league',
    'lean',
    'learn',
    'learned',
    'learners',
    'learning',
    'lease',
    'leasing',
    'least',
    'leather',
    'leave',
    'leaves',
    'leaving',
    'lebanon',
    'lecture',
    'lectures',
    'leeds',
    'left',
    'legacy',
    'legal',
    'legally',
    'legend',
    'legendary',
    'legends',
    'legislation',
    'legislative',
    'legislature',
    'legitimate',
    'legs',
    'leisure',
    'lemon',
    'lend',
    'lender',
    'lenders',
    'lending',
    'length',
    'lens',
    'lenses',
    'leon',
    'leonard',
    'leone',
    'lesbian',
    'lesbians',
    'leslie',
    'less',
    'lesser',
    'lesson',
    'lessons',
    'lets',
    'letter',
    'letters',
    'letting',
    'level',
    'levels',
    'levitra',
    'levy',
    'lewis',
    'lexington',
    'lexmark',
    'lexus',
    'liabilities',
    'liability',
    'liable',
    'liar',
    'liberal',
    'liberia',
    'liberty',
    'librarian',
    'libraries',
    'library',
    'libs',
    'licence',
    'license',
    'licensed',
    'licenses',
    'licensing',
    'licking',
    'liechtenstein',
    'lies',
    'life',
    'lifestyle',
    'lifetime',
    'lift',
    'lifted',
    'light',
    'lightbox',
    'lighter',
    'lighting',
    'lightning',
    'lights',
    'lightweight',
    'like',
    'liked',
    'likelihood',
    'likely',
    'likes',
    'likewise',
    'lime',
    'limit',
    'limitation',
    'limitations',
    'limited',
    'limiting',
    'limits',
    'limousines',
    'lincoln',
    'linda',
    'lindsay',
    'line',
    'linear',
    'lined',
    'lines',
    'lingerie',
    'link',
    'linked',
    'linking',
    'links',
    'linux',
    'lion',
    'lions',
    'lips',
    'liquid',
    'lisa',
    'lisbon',
    'list',
    'listed',
    'listen',
    'listening',
    'listing',
    'listings',
    'listprice',
    'lists',
    'lite',
    'literacy',
    'literally',
    'literary',
    'literature',
    'lithuania',
    'litigation',
    'little',
    'live',
    'livecam',
    'lived',
    'liver',
    'liverpool',
    'lives',
    'livesex',
    'livestock',
    'living',
    'lloyd',
    'load',
    'loaded',
    'loading',
    'loads',
    'loan',
    'loans',
    'lobby',
    'local',
    'locale',
    'locally',
    'locate',
    'located',
    'location',
    'locations',
    'locator',
    'lock',
    'locked',
    'locking',
    'locks',
    'lodge',
    'lodging',
    'logan',
    'logged',
    'logging',
    'logic',
    'logical',
    'login',
    'logistics',
    'logitech',
    'logo',
    'logos',
    'logs',
    'london',
    'lone',
    'lonely',
    'long',
    'longer',
    'longest',
    'longitude',
    'look',
    'looked',
    'looking',
    'looks',
    'looksmart',
    'lookup',
    'loop',
    'loops',
    'loose',
    'lopez',
    'lord',
    'lose',
    'losing',
    'loss',
    'losses',
    'lost',
    'lots',
    'lottery',
    'lotus',
    'loud',
    'louis',
    'louise',
    'louisiana',
    'louisville',
    'lounge',
    'love',
    'loved',
    'lovely',
    'lover',
    'lovers',
    'loves',
    'loving',
    'lower',
    'lowest',
    'lows',
    'lucas',
    'lucia',
    'luck',
    'lucky',
    'lucy',
    'luggage',
    'luis',
    'luke',
    'lunch',
    'lung',
    'luther',
    'luxembourg',
    'luxury',
    'lycos',
    'lying',
    'lynn',
    'lyric',
    'lyrics',
    'macedonia',
    'machine',
    'machinery',
    'machines',
    'macintosh',
    'macro',
    'macromedia',
    'madagascar',
    'made',
    'madison',
    'madness',
    'madonna',
    'madrid',
    'magazine',
    'magazines',
    'magic',
    'magical',
    'magnet',
    'magnetic',
    'magnificent',
    'magnitude',
    'maiden',
    'mail',
    'mailed',
    'mailing',
    'mailman',
    'mails',
    'mailto',
    'main',
    'maine',
    'mainland',
    'mainly',
    'mainstream',
    'maintain',
    'maintained',
    'maintaining',
    'maintains',
    'maintenance',
    'major',
    'majority',
    'make',
    'maker',
    'makers',
    'makes',
    'makeup',
    'making',
    'malawi',
    'malaysia',
    'maldives',
    'male',
    'males',
    'mali',
    'mall',
    'malpractice',
    'malta',
    'mambo',
    'manage',
    'managed',
    'management',
    'manager',
    'managers',
    'managing',
    'manchester',
    'mandate',
    'mandatory',
    'manga',
    'manhattan',
    'manitoba',
    'manner',
    'manor',
    'manual',
    'manually',
    'manuals',
    'manufacture',
    'manufactured',
    'manufacturer',
    'manufacturers',
    'manufacturing',
    'many',
    'maple',
    'mapping',
    'maps',
    'marathon',
    'marble',
    'marc',
    'march',
    'marco',
    'marcus',
    'mardi',
    'margaret',
    'margin',
    'maria',
    'mariah',
    'marie',
    'marijuana',
    'marilyn',
    'marina',
    'marine',
    'mario',
    'marion',
    'maritime',
    'mark',
    'marked',
    'marker',
    'markers',
    'market',
    'marketing',
    'marketplace',
    'markets',
    'marking',
    'marks',
    'marriage',
    'married',
    'marriott',
    'marry',
    'mars',
    'marsh',
    'marshall',
    'mart',
    'martha',
    'martial',
    'martin',
    'marvel',
    'mary',
    'maryland',
    'mask',
    'mason',
    'mass',
    'massachusetts',
    'massage',
    'massive',
    'master',
    'mastercard',
    'masters',
    'masturbating',
    'masturbation',
    'match',
    'matched',
    'matches',
    'matching',
    'mate',
    'material',
    'materials',
    'maternity',
    'math',
    'mathematical',
    'mathematics',
    'mating',
    'matrix',
    'mats',
    'matt',
    'matter',
    'matters',
    'matthew',
    'mattress',
    'mature',
    'maui',
    'mauritius',
    'maximize',
    'maximum',
    'maybe',
    'mayor',
    'mazda',
    'mcdonald',
    'meal',
    'meals',
    'mean',
    'meaning',
    'meaningful',
    'means',
    'meant',
    'meanwhile',
    'measure',
    'measured',
    'measurement',
    'measurements',
    'measures',
    'measuring',
    'meat',
    'mechanical',
    'mechanics',
    'mechanism',
    'mechanisms',
    'medal',
    'media',
    'median',
    'mediawiki',
    'medicaid',
    'medical',
    'medicare',
    'medication',
    'medications',
    'medicine',
    'medicines',
    'medieval',
    'meditation',
    'mediterranean',
    'medium',
    'medline',
    'meet',
    'meeting',
    'meetings',
    'meets',
    'meetup',
    'mega',
    'melbourne',
    'melissa',
    'melody',
    'member',
    'members',
    'membership',
    'membrane',
    'memo',
    'memorabilia',
    'memorial',
    'memories',
    'memory',
    'memphis',
    'mens',
    'ment',
    'mental',
    'mention',
    'mentioned',
    'mentor',
    'menu',
    'menus',
    'mercedes',
    'merchandise',
    'merchant',
    'merchants',
    'mercury',
    'mercy',
    'mere',
    'merely',
    'merge',
    'merger',
    'merit',
    'merry',
    'mesa',
    'mesh',
    'mess',
    'message',
    'messages',
    'messaging',
    'messenger',
    'meta',
    'metabolism',
    'metadata',
    'metal',
    'metallic',
    'metallica',
    'metals',
    'meter',
    'meters',
    'method',
    'methodology',
    'methods',
    'metres',
    'metric',
    'metro',
    'metropolitan',
    'mexican',
    'mexico',
    'meyer',
    'miami',
    'mice',
    'michael',
    'michel',
    'michelle',
    'michigan',
    'micro',
    'microphone',
    'microsoft',
    'microwave',
    'middle',
    'midi',
    'midlands',
    'midnight',
    'midwest',
    'might',
    'mighty',
    'migration',
    'mike',
    'milan',
    'mild',
    'mile',
    'mileage',
    'miles',
    'milfhunter',
    'milfs',
    'military',
    'milk',
    'mill',
    'millennium',
    'miller',
    'million',
    'millions',
    'mills',
    'milton',
    'milwaukee',
    'mime',
    'mind',
    'minds',
    'mine',
    'mineral',
    'minerals',
    'mines',
    'mini',
    'miniature',
    'minimal',
    'minimize',
    'minimum',
    'mining',
    'minister',
    'ministers',
    'ministries',
    'ministry',
    'minneapolis',
    'minnesota',
    'minolta',
    'minor',
    'minority',
    'mins',
    'mint',
    'minus',
    'minute',
    'minutes',
    'miracle',
    'mirror',
    'mirrors',
    'misc',
    'miscellaneous',
    'miss',
    'missed',
    'missile',
    'missing',
    'mission',
    'missions',
    'mississippi',
    'missouri',
    'mistake',
    'mistakes',
    'mister',
    'mistress',
    'mitchell',
    'mitsubishi',
    'mixed',
    'mixer',
    'mixing',
    'mixture',
    'mobile',
    'mobiles',
    'mobility',
    'mode',
    'model',
    'modeling',
    'modelling',
    'models',
    'modem',
    'modems',
    'moderate',
    'moderator',
    'moderators',
    'modern',
    'modes',
    'modification',
    'modifications',
    'modified',
    'modify',
    'mods',
    'modular',
    'module',
    'modules',
    'moisture',
    'mold',
    'moldova',
    'molecular',
    'molecules',
    'moment',
    'moments',
    'momentum',
    'moms',
    'monaco',
    'monday',
    'monetary',
    'money',
    'mongolia',
    'monica',
    'monitor',
    'monitored',
    'monitoring',
    'monitors',
    'monkey',
    'mono',
    'monroe',
    'monster',
    'monsters',
    'montana',
    'monte',
    'montgomery',
    'month',
    'monthly',
    'months',
    'montreal',
    'mood',
    'moon',
    'moore',
    'moral',
    'more',
    'moreover',
    'morgan',
    'morning',
    'morocco',
    'morris',
    'morrison',
    'mortality',
    'mortgage',
    'mortgages',
    'moscow',
    'moses',
    'moss',
    'most',
    'mostly',
    'motel',
    'motels',
    'mother',
    'motherboard',
    'mothers',
    'motion',
    'motivated',
    'motivation',
    'motor',
    'motorcycle',
    'motorcycles',
    'motorola',
    'motors',
    'mount',
    'mountain',
    'mountains',
    'mounted',
    'mounting',
    'mounts',
    'mouse',
    'mouth',
    'move',
    'moved',
    'movement',
    'movements',
    'movers',
    'moves',
    'movie',
    'movies',
    'moving',
    'mozambique',
    'mozilla',
    'mpeg',
    'mpegs',
    'mrna',
    'msgid',
    'msgstr',
    'msie',
    'much',
    'multi',
    'multimedia',
    'multiple',
    'mumbai',
    'munich',
    'municipal',
    'municipality',
    'murder',
    'murphy',
    'murray',
    'muscle',
    'muscles',
    'museum',
    'museums',
    'music',
    'musical',
    'musician',
    'musicians',
    'muslim',
    'muslims',
    'must',
    'mustang',
    'mutual',
    'muze',
    'myanmar',
    'myers',
    'myrtle',
    'myself',
    'mysimon',
    'myspace',
    'mysql',
    'mysterious',
    'mystery',
    'myth',
    'nail',
    'nails',
    'naked',
    'name',
    'named',
    'namely',
    'names',
    'namespace',
    'namibia',
    'nancy',
    'nano',
    'naples',
    'narrative',
    'narrow',
    'nasa',
    'nascar',
    'nasdaq',
    'nashville',
    'nasty',
    'nathan',
    'nation',
    'national',
    'nationally',
    'nations',
    'nationwide',
    'native',
    'nato',
    'natural',
    'naturally',
    'naturals',
    'nature',
    'naughty',
    'naval',
    'navigate',
    'navigation',
    'navigator',
    'navy',
    'ncaa',
    'near',
    'nearby',
    'nearest',
    'nearly',
    'nebraska',
    'necessarily',
    'necessary',
    'necessity',
    'neck',
    'necklace',
    'need',
    'needed',
    'needle',
    'needs',
    'negative',
    'negotiation',
    'negotiations',
    'neighbor',
    'neighborhood',
    'neighbors',
    'neil',
    'neither',
    'nelson',
    'neon',
    'nepal',
    'neptune',
    'nerve',
    'nervous',
    'nest',
    'nested',
    'netherlands',
    'netscape',
    'network',
    'networking',
    'networks',
    'neural',
    'neutral',
    'nevada',
    'never',
    'nevertheless',
    'newark',
    'newbie',
    'newcastle',
    'newer',
    'newest',
    'newfoundland',
    'newly',
    'newman',
    'newport',
    'news',
    'newsletter',
    'newsletters',
    'newspaper',
    'newspapers',
    'newton',
    'next',
    'nextel',
    'niagara',
    'nicaragua',
    'nice',
    'nicholas',
    'nick',
    'nickel',
    'nickname',
    'nicole',
    'niece',
    'niger',
    'nigeria',
    'night',
    'nightlife',
    'nightmare',
    'nights',
    'nike',
    'nikon',
    'nine',
    'nintendo',
    'nirvana',
    'nissan',
    'nitrogen',
    'noble',
    'nobody',
    'node',
    'nodes',
    'noise',
    'nokia',
    'nominated',
    'nomination',
    'nominations',
    'none',
    'nonprofit',
    'noon',
    'norfolk',
    'norm',
    'normal',
    'normally',
    'norman',
    'north',
    'northeast',
    'northern',
    'northwest',
    'norton',
    'norway',
    'norwegian',
    'nose',
    'note',
    'notebook',
    'notebooks',
    'noted',
    'notes',
    'nothing',
    'notice',
    'noticed',
    'notices',
    'notification',
    'notifications',
    'notified',
    'notify',
    'notion',
    'notre',
    'nottingham',
    'noun',
    'nova',
    'novel',
    'novels',
    'novelty',
    'november',
    'nowhere',
    'ntsc',
    'nuclear',
    'nudist',
    'nuke',
    'null',
    'number',
    'numbers',
    'numeral',
    'numeric',
    'numerical',
    'numerous',
    'nurse',
    'nursery',
    'nurses',
    'nursing',
    'nutrition',
    'nutritional',
    'nuts',
    'nutten',
    'nvidia',
    'nylon',
    'oakland',
    'oaks',
    'oasis',
    'obesity',
    'obituaries',
    'object',
    'objective',
    'objectives',
    'objects',
    'obligation',
    'obligations',
    'observation',
    'observations',
    'observe',
    'observed',
    'observer',
    'obtain',
    'obtained',
    'obtaining',
    'obvious',
    'obviously',
    'occasion',
    'occasional',
    'occasionally',
    'occasions',
    'occupation',
    'occupational',
    'occupations',
    'occupied',
    'occur',
    'occurred',
    'occurrence',
    'occurring',
    'occurs',
    'ocean',
    'oclc',
    'october',
    'odds',
    'oecd',
    'offense',
    'offensive',
    'offer',
    'offered',
    'offering',
    'offerings',
    'offers',
    'office',
    'officer',
    'officers',
    'offices',
    'official',
    'officially',
    'officials',
    'offline',
    'offset',
    'offshore',
    'often',
    'ohio',
    'oils',
    'okay',
    'oklahoma',
    'older',
    'oldest',
    'olive',
    'oliver',
    'olympic',
    'olympics',
    'olympus',
    'omaha',
    'oman',
    'omega',
    'omissions',
    'once',
    'ones',
    'ongoing',
    'onion',
    'online',
    'only',
    'ontario',
    'onto',
    'oops',
    'open',
    'opened',
    'opening',
    'openings',
    'opens',
    'opera',
    'operate',
    'operated',
    'operates',
    'operating',
    'operation',
    'operational',
    'operations',
    'operator',
    'operators',
    'opinion',
    'opinions',
    'opponent',
    'opponents',
    'opportunities',
    'opportunity',
    'opposed',
    'opposite',
    'opposition',
    'optical',
    'optics',
    'optimal',
    'optimization',
    'optimize',
    'optimum',
    'option',
    'optional',
    'options',
    'oracle',
    'oral',
    'orange',
    'orbit',
    'orchestra',
    'order',
    'ordered',
    'ordering',
    'orderly',
    'orders',
    'ordinance',
    'ordinary',
    'oregon',
    'organ',
    'organic',
    'organisation',
    'organisations',
    'organised',
    'organisms',
    'organization',
    'organizational',
    'organizations',
    'organize',
    'organized',
    'organizer',
    'organizing',
    'oriental',
    'orientation',
    'oriented',
    'origin',
    'original',
    'originally',
    'origins',
    'orlando',
    'orleans',
    'oscar',
    'oslo',
    'other',
    'others',
    'otherwise',
    'ottawa',
    'ought',
    'ours',
    'ourselves',
    'outcome',
    'outcomes',
    'outdoor',
    'outdoors',
    'outer',
    'outlet',
    'outlets',
    'outline',
    'outlined',
    'outlook',
    'output',
    'outputs',
    'outreach',
    'outside',
    'outsourcing',
    'outstanding',
    'oval',
    'oven',
    'over',
    'overall',
    'overcome',
    'overhead',
    'overnight',
    'overseas',
    'overview',
    'owen',
    'owned',
    'owner',
    'owners',
    'ownership',
    'owns',
    'oxford',
    'oxide',
    'oxygen',
    'ozone',
    'pace',
    'pacific',
    'pack',
    'package',
    'packages',
    'packaging',
    'packard',
    'packed',
    'packet',
    'packets',
    'packing',
    'packs',
    'pads',
    'page',
    'pages',
    'paid',
    'pain',
    'painful',
    'paint',
    'paintball',
    'painted',
    'painting',
    'paintings',
    'pair',
    'pairs',
    'pakistan',
    'palace',
    'pale',
    'palestine',
    'palestinian',
    'palm',
    'palmer',
    'pamela',
    'panama',
    'panasonic',
    'panel',
    'panels',
    'panic',
    'pants',
    'pantyhose',
    'paper',
    'paperback',
    'paperbacks',
    'papers',
    'papua',
    'para',
    'parade',
    'paradise',
    'paragraph',
    'paragraphs',
    'paraguay',
    'parallel',
    'parameter',
    'parameters',
    'parcel',
    'parent',
    'parental',
    'parenting',
    'parents',
    'paris',
    'parish',
    'park',
    'parker',
    'parking',
    'parks',
    'parliament',
    'parliamentary',
    'part',
    'partial',
    'partially',
    'participant',
    'participants',
    'participate',
    'participated',
    'participating',
    'participation',
    'particle',
    'particles',
    'particular',
    'particularly',
    'parties',
    'partition',
    'partly',
    'partner',
    'partners',
    'partnership',
    'partnerships',
    'parts',
    'party',
    'paso',
    'pass',
    'passage',
    'passed',
    'passenger',
    'passengers',
    'passes',
    'passing',
    'passion',
    'passive',
    'passport',
    'password',
    'passwords',
    'past',
    'pasta',
    'paste',
    'pastor',
    'patch',
    'patches',
    'patent',
    'patents',
    'path',
    'pathology',
    'paths',
    'patient',
    'patients',
    'patio',
    'patricia',
    'patrick',
    'patrol',
    'pattern',
    'patterns',
    'paul',
    'pavilion',
    'paxil',
    'payable',
    'payday',
    'paying',
    'payment',
    'payments',
    'paypal',
    'payroll',
    'pays',
    'pdas',
    'peace',
    'peaceful',
    'peak',
    'pearl',
    'peas',
    'pediatric',
    'peeing',
    'peer',
    'peers',
    'penalties',
    'penalty',
    'pencil',
    'pendant',
    'pending',
    'penetration',
    'penguin',
    'peninsula',
    'penn',
    'pennsylvania',
    'penny',
    'pens',
    'pension',
    'pensions',
    'pentium',
    'people',
    'peoples',
    'pepper',
    'perceived',
    'percent',
    'percentage',
    'perception',
    'perfect',
    'perfectly',
    'perform',
    'performance',
    'performances',
    'performed',
    'performer',
    'performing',
    'performs',
    'perfume',
    'perhaps',
    'period',
    'periodic',
    'periodically',
    'periods',
    'peripheral',
    'peripherals',
    'perl',
    'permalink',
    'permanent',
    'permission',
    'permissions',
    'permit',
    'permits',
    'permitted',
    'perry',
    'persian',
    'persistent',
    'person',
    'personal',
    'personality',
    'personalized',
    'personally',
    'personals',
    'personnel',
    'persons',
    'perspective',
    'perspectives',
    'perth',
    'peru',
    'pest',
    'pete',
    'peter',
    'petersburg',
    'peterson',
    'petite',
    'petition',
    'petroleum',
    'pets',
    'phantom',
    'pharmaceutical',
    'pharmaceuticals',
    'pharmacies',
    'pharmacology',
    'pharmacy',
    'phase',
    'phases',
    'phenomenon',
    'phentermine',
    'phil',
    'philadelphia',
    'philip',
    'philippines',
    'philips',
    'phillips',
    'philosophy',
    'phoenix',
    'phone',
    'phones',
    'photo',
    'photograph',
    'photographer',
    'photographers',
    'photographic',
    'photographs',
    'photography',
    'photos',
    'photoshop',
    'phpbb',
    'phrase',
    'phrases',
    'phys',
    'physical',
    'physically',
    'physician',
    'physicians',
    'physics',
    'physiology',
    'piano',
    'pichunter',
    'pick',
    'picked',
    'picking',
    'picks',
    'pickup',
    'picnic',
    'pics',
    'picture',
    'pictures',
    'piece',
    'pieces',
    'pierce',
    'pierre',
    'pike',
    'pill',
    'pillow',
    'pills',
    'pilot',
    'pine',
    'ping',
    'pink',
    'pins',
    'pioneer',
    'pipe',
    'pipeline',
    'pipes',
    'pirates',
    'pitch',
    'pittsburgh',
    'pixel',
    'pixels',
    'pizza',
    'place',
    'placed',
    'placement',
    'places',
    'placing',
    'plain',
    'plains',
    'plaintiff',
    'plan',
    'plane',
    'planes',
    'planet',
    'planets',
    'planned',
    'planner',
    'planners',
    'planning',
    'plans',
    'plant',
    'plants',
    'plasma',
    'plastic',
    'plastics',
    'plate',
    'plates',
    'platform',
    'platforms',
    'platinum',
    'play',
    'playback',
    'played',
    'player',
    'players',
    'playing',
    'playlist',
    'plays',
    'playstation',
    'plaza',
    'pleasant',
    'please',
    'pleased',
    'pleasure',
    'pledge',
    'plenty',
    'plot',
    'plots',
    'plug',
    'plugin',
    'plugins',
    'plumbing',
    'plural',
    'plus',
    'pluto',
    'plymouth',
    'pmid',
    'pocket',
    'pockets',
    'podcast',
    'podcasts',
    'poem',
    'poems',
    'poet',
    'poetry',
    'point',
    'pointed',
    'pointer',
    'pointing',
    'points',
    'poison',
    'pokemon',
    'poker',
    'poland',
    'polar',
    'pole',
    'police',
    'policies',
    'policy',
    'polish',
    'polished',
    'political',
    'politicians',
    'politics',
    'poll',
    'polls',
    'pollution',
    'polo',
    'poly',
    'polyester',
    'polymer',
    'polyphonic',
    'pond',
    'pontiac',
    'pool',
    'pools',
    'poor',
    'pope',
    'popular',
    'popularity',
    'population',
    'populations',
    'porcelain',
    'pork',
    'porsche',
    'port',
    'portable',
    'portal',
    'porter',
    'portfolio',
    'portion',
    'portions',
    'portland',
    'portrait',
    'portraits',
    'ports',
    'portsmouth',
    'portugal',
    'portuguese',
    'pose',
    'posing',
    'position',
    'positioning',
    'positions',
    'positive',
    'possess',
    'possession',
    'possibilities',
    'possibility',
    'possible',
    'possibly',
    'post',
    'postage',
    'postal',
    'postcard',
    'postcards',
    'posted',
    'poster',
    'posters',
    'posting',
    'postings',
    'postposted',
    'posts',
    'potato',
    'potatoes',
    'potential',
    'potentially',
    'potter',
    'pottery',
    'poultry',
    'pound',
    'pounds',
    'pour',
    'poverty',
    'powder',
    'powell',
    'power',
    'powered',
    'powerful',
    'powerpoint',
    'powers',
    'powerseller',
    'practical',
    'practice',
    'practices',
    'practitioner',
    'practitioners',
    'prague',
    'prairie',
    'praise',
    'pray',
    'prayer',
    'prayers',
    'preceding',
    'precious',
    'precipitation',
    'precise',
    'precisely',
    'precision',
    'predict',
    'predicted',
    'prediction',
    'predictions',
    'prefer',
    'preference',
    'preferences',
    'preferred',
    'prefers',
    'prefix',
    'pregnancy',
    'pregnant',
    'preliminary',
    'premier',
    'premiere',
    'premises',
    'premium',
    'prep',
    'prepaid',
    'preparation',
    'prepare',
    'prepared',
    'preparing',
    'prerequisite',
    'prescribed',
    'prescription',
    'presence',
    'present',
    'presentation',
    'presentations',
    'presented',
    'presenting',
    'presently',
    'presents',
    'preservation',
    'preserve',
    'president',
    'presidential',
    'presidents',
    'press',
    'pressed',
    'pressing',
    'pressure',
    'preston',
    'pretty',
    'prev',
    'prevent',
    'preventing',
    'prevention',
    'preview',
    'previews',
    'previous',
    'previously',
    'price',
    'priced',
    'prices',
    'pricing',
    'pride',
    'priest',
    'primarily',
    'primary',
    'prime',
    'prince',
    'princess',
    'princeton',
    'principal',
    'principle',
    'principles',
    'print',
    'printable',
    'printed',
    'printer',
    'printers',
    'printing',
    'prints',
    'prior',
    'priorities',
    'priority',
    'prison',
    'prisoner',
    'prisoners',
    'privacy',
    'private',
    'privilege',
    'privileges',
    'prix',
    'prize',
    'prizes',
    'probability',
    'probable',
    'probably',
    'probe',
    'problem',
    'problems',
    'proc',
    'procedure',
    'procedures',
    'proceed',
    'proceeding',
    'proceedings',
    'proceeds',
    'process',
    'processed',
    'processes',
    'processing',
    'processor',
    'processors',
    'procurement',
    'produce',
    'produced',
    'producer',
    'producers',
    'produces',
    'producing',
    'product',
    'production',
    'productions',
    'productive',
    'productivity',
    'products',
    'profession',
    'professional',
    'professionals',
    'professor',
    'profile',
    'profiles',
    'profit',
    'profits',
    'program',
    'programme',
    'programmer',
    'programmers',
    'programmes',
    'programming',
    'programs',
    'progress',
    'progressive',
    'prohibited',
    'project',
    'projected',
    'projection',
    'projector',
    'projectors',
    'projects',
    'prominent',
    'promise',
    'promised',
    'promises',
    'promising',
    'promo',
    'promote',
    'promoted',
    'promotes',
    'promoting',
    'promotion',
    'promotional',
    'promotions',
    'prompt',
    'promptly',
    'proof',
    'propecia',
    'proper',
    'properly',
    'properties',
    'property',
    'prophet',
    'proportion',
    'proposal',
    'proposals',
    'propose',
    'proposed',
    'proposition',
    'proprietary',
    'pros',
    'prospect',
    'prospective',
    'prospects',
    'prostate',
    'prostores',
    'prot',
    'protect',
    'protected',
    'protecting',
    'protection',
    'protective',
    'protein',
    'proteins',
    'protest',
    'protocol',
    'protocols',
    'prototype',
    'proud',
    'proudly',
    'prove',
    'proved',
    'proven',
    'provide',
    'provided',
    'providence',
    'provider',
    'providers',
    'provides',
    'providing',
    'province',
    'provinces',
    'provincial',
    'provision',
    'provisions',
    'proxy',
    'prozac',
    'psychiatry',
    'psychological',
    'psychology',
    'public',
    'publication',
    'publications',
    'publicity',
    'publicly',
    'publish',
    'published',
    'publisher',
    'publishers',
    'publishing',
    'pubmed',
    'pubs',
    'puerto',
    'pull',
    'pulled',
    'pulling',
    'pulse',
    'pump',
    'pumps',
    'punch',
    'punishment',
    'punk',
    'pupils',
    'puppy',
    'purchase',
    'purchased',
    'purchases',
    'purchasing',
    'pure',
    'purple',
    'purpose',
    'purposes',
    'purse',
    'pursuant',
    'pursue',
    'pursuit',
    'push',
    'pushed',
    'pushing',
    'puts',
    'putting',
    'puzzle',
    'puzzles',
    'python',
    'qatar',
    'quad',
    'qualification',
    'qualifications',
    'qualified',
    'qualify',
    'qualifying',
    'qualities',
    'quality',
    'quantitative',
    'quantities',
    'quantity',
    'quantum',
    'quarter',
    'quarterly',
    'quarters',
    'quebec',
    'queen',
    'queens',
    'queensland',
    'queries',
    'query',
    'quest',
    'question',
    'questionnaire',
    'questions',
    'queue',
    'quick',
    'quickly',
    'quiet',
    'quilt',
    'quit',
    'quite',
    'quiz',
    'quizzes',
    'quotations',
    'quote',
    'quoted',
    'quotes',
    'rabbit',
    'race',
    'races',
    'rachel',
    'racial',
    'racing',
    'rack',
    'racks',
    'radar',
    'radiation',
    'radical',
    'radio',
    'radios',
    'radius',
    'rage',
    'raid',
    'rail',
    'railroad',
    'railway',
    'rain',
    'rainbow',
    'raise',
    'raised',
    'raises',
    'raising',
    'raleigh',
    'rally',
    'ralph',
    'ranch',
    'rand',
    'random',
    'randy',
    'range',
    'ranger',
    'rangers',
    'ranges',
    'ranging',
    'rank',
    'ranked',
    'ranking',
    'rankings',
    'ranks',
    'rapid',
    'rapidly',
    'rapids',
    'rare',
    'rarely',
    'rate',
    'rated',
    'rates',
    'rather',
    'rating',
    'ratings',
    'ratio',
    'rational',
    'ratios',
    'rats',
    'raymond',
    'rays',
    'reach',
    'reached',
    'reaches',
    'reaching',
    'reaction',
    'reactions',
    'read',
    'reader',
    'readers',
    'readily',
    'reading',
    'readings',
    'reads',
    'ready',
    'real',
    'realistic',
    'reality',
    'realize',
    'realized',
    'really',
    'realm',
    'realtor',
    'realtors',
    'realty',
    'rear',
    'reason',
    'reasonable',
    'reasonably',
    'reasoning',
    'reasons',
    'rebate',
    'rebates',
    'rebecca',
    'rebel',
    'rebound',
    'recall',
    'receipt',
    'receive',
    'received',
    'receiver',
    'receivers',
    'receives',
    'receiving',
    'recent',
    'recently',
    'reception',
    'receptor',
    'receptors',
    'recipe',
    'recipes',
    'recipient',
    'recipients',
    'recognised',
    'recognition',
    'recognize',
    'recognized',
    'recommend',
    'recommendation',
    'recommendations',
    'recommended',
    'recommends',
    'reconstruction',
    'record',
    'recorded',
    'recorder',
    'recorders',
    'recording',
    'recordings',
    'records',
    'recover',
    'recovered',
    'recovery',
    'recreation',
    'recreational',
    'recruiting',
    'recruitment',
    'recycling',
    'redeem',
    'redhead',
    'reduce',
    'reduced',
    'reduces',
    'reducing',
    'reduction',
    'reductions',
    'reed',
    'reef',
    'reel',
    'refer',
    'reference',
    'referenced',
    'references',
    'referral',
    'referrals',
    'referred',
    'referring',
    'refers',
    'refinance',
    'refine',
    'refined',
    'reflect',
    'reflected',
    'reflection',
    'reflections',
    'reflects',
    'reform',
    'reforms',
    'refresh',
    'refrigerator',
    'refugees',
    'refund',
    'refurbished',
    'refuse',
    'refused',
    'regard',
    'regarded',
    'regarding',
    'regardless',
    'regards',
    'reggae',
    'regime',
    'region',
    'regional',
    'regions',
    'register',
    'registered',
    'registrar',
    'registration',
    'registry',
    'regression',
    'regular',
    'regularly',
    'regulated',
    'regulation',
    'regulations',
    'regulatory',
    'rehab',
    'rehabilitation',
    'reid',
    'reject',
    'rejected',
    'relate',
    'related',
    'relates',
    'relating',
    'relation',
    'relations',
    'relationship',
    'relationships',
    'relative',
    'relatively',
    'relatives',
    'relax',
    'relaxation',
    'relay',
    'release',
    'released',
    'releases',
    'relevance',
    'relevant',
    'reliability',
    'reliable',
    'reliance',
    'relief',
    'religion',
    'religions',
    'religious',
    'reload',
    'relocation',
    'rely',
    'relying',
    'remain',
    'remainder',
    'remained',
    'remaining',
    'remains',
    'remark',
    'remarkable',
    'remarks',
    'remedies',
    'remedy',
    'remember',
    'remembered',
    'remind',
    'reminder',
    'remix',
    'remote',
    'removable',
    'removal',
    'remove',
    'removed',
    'removing',
    'renaissance',
    'render',
    'rendered',
    'rendering',
    'renew',
    'renewable',
    'renewal',
    'reno',
    'rent',
    'rental',
    'rentals',
    'repair',
    'repairs',
    'repeat',
    'repeated',
    'replace',
    'replaced',
    'replacement',
    'replacing',
    'replica',
    'replication',
    'replied',
    'replies',
    'reply',
    'report',
    'reported',
    'reporter',
    'reporters',
    'reporting',
    'reports',
    'repository',
    'represent',
    'representation',
    'representations',
    'representative',
    'representatives',
    'represented',
    'representing',
    'represents',
    'reprint',
    'reprints',
    'reproduce',
    'reproduced',
    'reproduction',
    'reproductive',
    'republic',
    'republican',
    'republicans',
    'reputation',
    'request',
    'requested',
    'requesting',
    'requests',
    'require',
    'required',
    'requirement',
    'requirements',
    'requires',
    'requiring',
    'rescue',
    'research',
    'researcher',
    'researchers',
    'reseller',
    'resent',
    'reservation',
    'reservations',
    'reserve',
    'reserved',
    'reserves',
    'reservoir',
    'reset',
    'residence',
    'resident',
    'residential',
    'residents',
    'resist',
    'resistance',
    'resistant',
    'resolution',
    'resolutions',
    'resolve',
    'resolved',
    'resort',
    'resorts',
    'resource',
    'resources',
    'respect',
    'respected',
    'respective',
    'respectively',
    'respiratory',
    'respond',
    'responded',
    'respondent',
    'respondents',
    'responding',
    'response',
    'responses',
    'responsibilities',
    'responsibility',
    'responsible',
    'rest',
    'restaurant',
    'restaurants',
    'restoration',
    'restore',
    'restored',
    'restrict',
    'restricted',
    'restriction',
    'restrictions',
    'restructuring',
    'result',
    'resulted',
    'resulting',
    'results',
    'resume',
    'resumes',
    'retail',
    'retailer',
    'retailers',
    'retain',
    'retained',
    'retention',
    'retired',
    'retirement',
    'retreat',
    'retrieval',
    'retrieve',
    'retrieved',
    'retro',
    'return',
    'returned',
    'returning',
    'returns',
    'reunion',
    'reuters',
    'reveal',
    'revealed',
    'reveals',
    'revelation',
    'revenge',
    'revenue',
    'revenues',
    'reverse',
    'review',
    'reviewed',
    'reviewer',
    'reviewing',
    'reviews',
    'revised',
    'revision',
    'revisions',
    'revolution',
    'revolutionary',
    'reward',
    'rewards',
    'reynolds',
    'rhode',
    'rhythm',
    'ribbon',
    'rica',
    'rice',
    'rich',
    'richard',
    'richards',
    'richardson',
    'richmond',
    'rick',
    'ricky',
    'rico',
    'ridden',
    'ride',
    'rider',
    'riders',
    'rides',
    'ridge',
    'riding',
    'right',
    'rights',
    'ring',
    'rings',
    'ringtone',
    'ringtones',
    'ripe',
    'rise',
    'rising',
    'risk',
    'risks',
    'river',
    'rivers',
    'riverside',
    'road',
    'roads',
    'robbie',
    'robert',
    'roberts',
    'robertson',
    'robin',
    'robinson',
    'robot',
    'robots',
    'robust',
    'rochester',
    'rock',
    'rocket',
    'rocks',
    'rocky',
    'roger',
    'rogers',
    'roland',
    'role',
    'roles',
    'roll',
    'rolled',
    'roller',
    'rolling',
    'rolls',
    'roman',
    'romance',
    'romania',
    'romantic',
    'rome',
    'ronald',
    'roof',
    'room',
    'roommate',
    'roommates',
    'rooms',
    'root',
    'roots',
    'rope',
    'rosa',
    'rose',
    'roses',
    'ross',
    'roster',
    'rotary',
    'rotation',
    'rouge',
    'rough',
    'roughly',
    'roulette',
    'round',
    'rounds',
    'route',
    'router',
    'routers',
    'routes',
    'routine',
    'routines',
    'routing',
    'rover',
    'rows',
    'royal',
    'royalty',
    'rubber',
    'ruby',
    'rugby',
    'rugs',
    'rule',
    'ruled',
    'rules',
    'ruling',
    'runner',
    'running',
    'runs',
    'runtime',
    'rural',
    'rush',
    'russell',
    'russia',
    'russian',
    'ruth',
    'rwanda',
    'ryan',
    'sacramento',
    'sacred',
    'sacrifice',
    'saddam',
    'safari',
    'safe',
    'safely',
    'safer',
    'safety',
    'sage',
    'sagem',
    'said',
    'sail',
    'sailing',
    'saint',
    'saints',
    'sake',
    'salad',
    'salaries',
    'salary',
    'sale',
    'salem',
    'sales',
    'sally',
    'salmon',
    'salon',
    'salt',
    'salvador',
    'salvation',
    'samba',
    'same',
    'samoa',
    'sample',
    'samples',
    'sampling',
    'samsung',
    'samuel',
    'sand',
    'sandra',
    'sandwich',
    'sandy',
    'sans',
    'santa',
    'sanyo',
    'sapphire',
    'sara',
    'sarah',
    'saskatchewan',
    'satellite',
    'satin',
    'satisfaction',
    'satisfactory',
    'satisfied',
    'satisfy',
    'saturday',
    'saturn',
    'sauce',
    'saudi',
    'savage',
    'savannah',
    'save',
    'saved',
    'saver',
    'saves',
    'saving',
    'savings',
    'saying',
    'says',
    'sbjct',
    'scale',
    'scales',
    'scan',
    'scanned',
    'scanner',
    'scanners',
    'scanning',
    'scared',
    'scary',
    'scenario',
    'scenarios',
    'scene',
    'scenes',
    'scenic',
    'schedule',
    'scheduled',
    'schedules',
    'scheduling',
    'schema',
    'scheme',
    'schemes',
    'scholar',
    'scholars',
    'scholarship',
    'scholarships',
    'school',
    'schools',
    'science',
    'sciences',
    'scientific',
    'scientist',
    'scientists',
    'scoop',
    'scope',
    'score',
    'scored',
    'scores',
    'scoring',
    'scotia',
    'scotland',
    'scott',
    'scottish',
    'scout',
    'scratch',
    'screen',
    'screening',
    'screens',
    'screensaver',
    'screensavers',
    'screenshot',
    'screenshots',
    'screw',
    'script',
    'scripting',
    'scripts',
    'scroll',
    'scsi',
    'scuba',
    'sculpture',
    'seafood',
    'seal',
    'sealed',
    'sean',
    'search',
    'searched',
    'searches',
    'searching',
    'seas',
    'season',
    'seasonal',
    'seasons',
    'seat',
    'seating',
    'seats',
    'seattle',
    'second',
    'secondary',
    'seconds',
    'secret',
    'secretariat',
    'secretary',
    'secrets',
    'section',
    'sections',
    'sector',
    'sectors',
    'secure',
    'secured',
    'securely',
    'securities',
    'security',
    'seed',
    'seeds',
    'seeing',
    'seek',
    'seeker',
    'seekers',
    'seeking',
    'seeks',
    'seem',
    'seemed',
    'seems',
    'seen',
    'sees',
    'sega',
    'segment',
    'segments',
    'select',
    'selected',
    'selecting',
    'selection',
    'selections',
    'selective',
    'self',
    'sell',
    'seller',
    'sellers',
    'selling',
    'sells',
    'semester',
    'semi',
    'semiconductor',
    'seminar',
    'seminars',
    'senate',
    'senator',
    'senators',
    'send',
    'sender',
    'sending',
    'sends',
    'senegal',
    'senior',
    'seniors',
    'sense',
    'sensitive',
    'sensitivity',
    'sensor',
    'sensors',
    'sent',
    'sentence',
    'sentences',
    'separate',
    'separated',
    'separately',
    'separation',
    'sept',
    'september',
    'sequence',
    'sequences',
    'serbia',
    'serial',
    'series',
    'serious',
    'seriously',
    'serum',
    'serve',
    'served',
    'server',
    'servers',
    'serves',
    'service',
    'services',
    'serving',
    'session',
    'sessions',
    'sets',
    'setting',
    'settings',
    'settle',
    'settled',
    'settlement',
    'setup',
    'seven',
    'seventh',
    'several',
    'severe',
    'sewing',
    'sexcam',
    'sexual',
    'sexuality',
    'sexually',
    'shade',
    'shades',
    'shadow',
    'shadows',
    'shaft',
    'shake',
    'shakespeare',
    'shakira',
    'shall',
    'shame',
    'shanghai',
    'shannon',
    'shape',
    'shaped',
    'shapes',
    'share',
    'shared',
    'shareholders',
    'shares',
    'shareware',
    'sharing',
    'shark',
    'sharon',
    'sharp',
    'shaved',
    'shaw',
    'shed',
    'sheep',
    'sheer',
    'sheet',
    'sheets',
    'sheffield',
    'shelf',
    'shell',
    'shelter',
    'shemales',
    'shepherd',
    'sheriff',
    'sherman',
    'shield',
    'shift',
    'shine',
    'ship',
    'shipment',
    'shipments',
    'shipped',
    'shipping',
    'ships',
    'shirt',
    'shirts',
    'shock',
    'shoe',
    'shoes',
    'shoot',
    'shooting',
    'shop',
    'shopper',
    'shoppers',
    'shopping',
    'shops',
    'shopzilla',
    'shore',
    'short',
    'shortcuts',
    'shorter',
    'shortly',
    'shorts',
    'shot',
    'shots',
    'should',
    'shoulder',
    'shout',
    'shouted',
    'show',
    'showcase',
    'showed',
    'shower',
    'showers',
    'showing',
    'shown',
    'shows',
    'showtimes',
    'shut',
    'shuttle',
    'sick',
    'side',
    'sides',
    'siemens',
    'sierra',
    'sight',
    'sigma',
    'sign',
    'signal',
    'signals',
    'signature',
    'signatures',
    'signed',
    'significance',
    'significant',
    'significantly',
    'signing',
    'signs',
    'signup',
    'silence',
    'silent',
    'silicon',
    'silk',
    'silly',
    'silver',
    'similar',
    'similarly',
    'simon',
    'simple',
    'simplified',
    'simply',
    'simpson',
    'simpsons',
    'sims',
    'simulation',
    'simulations',
    'simultaneously',
    'since',
    'sing',
    'singapore',
    'singer',
    'singh',
    'singing',
    'single',
    'singles',
    'sink',
    'sister',
    'sisters',
    'site',
    'sitemap',
    'sites',
    'sitting',
    'situated',
    'situation',
    'situations',
    'sixth',
    'size',
    'sized',
    'sizes',
    'skating',
    'skiing',
    'skill',
    'skilled',
    'skills',
    'skin',
    'skins',
    'skip',
    'skirt',
    'skirts',
    'skype',
    'slave',
    'sleep',
    'sleeping',
    'sleeps',
    'sleeve',
    'slept',
    'slide',
    'slides',
    'slideshow',
    'slight',
    'slightly',
    'slim',
    'slip',
    'slope',
    'slot',
    'slots',
    'slovak',
    'slovakia',
    'slovenia',
    'slow',
    'slowly',
    'small',
    'smaller',
    'smallest',
    'smart',
    'smell',
    'smile',
    'smiled',
    'smilies',
    'smith',
    'smithsonian',
    'smoke',
    'smoking',
    'smooth',
    'smtp',
    'snake',
    'snap',
    'snapshot',
    'snow',
    'snowboard',
    'soap',
    'soccer',
    'social',
    'societies',
    'society',
    'sociology',
    'socket',
    'socks',
    'sodium',
    'sofa',
    'soft',
    'softball',
    'software',
    'soil',
    'solar',
    'solaris',
    'sold',
    'soldier',
    'soldiers',
    'sole',
    'solely',
    'solid',
    'solo',
    'solomon',
    'solution',
    'solutions',
    'solve',
    'solved',
    'solving',
    'soma',
    'somalia',
    'some',
    'somebody',
    'somehow',
    'someone',
    'somerset',
    'something',
    'sometimes',
    'somewhat',
    'somewhere',
    'song',
    'songs',
    'sonic',
    'sons',
    'sony',
    'soon',
    'soonest',
    'sophisticated',
    'sorry',
    'sort',
    'sorted',
    'sorts',
    'sought',
    'soul',
    'souls',
    'sound',
    'sounds',
    'soundtrack',
    'soup',
    'source',
    'sources',
    'south',
    'southampton',
    'southeast',
    'southern',
    'southwest',
    'soviet',
    'space',
    'spaces',
    'spain',
    'spam',
    'span',
    'spanish',
    'spank',
    'spanking',
    'sparc',
    'spare',
    'spas',
    'spatial',
    'speak',
    'speaker',
    'speakers',
    'speaking',
    'speaks',
    'spears',
    'spec',
    'special',
    'specialist',
    'specialists',
    'specialized',
    'specializing',
    'specially',
    'specials',
    'specialties',
    'specialty',
    'species',
    'specific',
    'specifically',
    'specification',
    'specifications',
    'specifics',
    'specified',
    'specifies',
    'specify',
    'specs',
    'spectacular',
    'spectrum',
    'speech',
    'speeches',
    'speed',
    'speeds',
    'spell',
    'spelling',
    'spencer',
    'spend',
    'spending',
    'spent',
    'sperm',
    'sphere',
    'spice',
    'spider',
    'spies',
    'spin',
    'spine',
    'spirit',
    'spirits',
    'spiritual',
    'spirituality',
    'split',
    'spoke',
    'spoken',
    'spokesman',
    'sponsor',
    'sponsored',
    'sponsors',
    'sponsorship',
    'sport',
    'sporting',
    'sports',
    'spot',
    'spotlight',
    'spots',
    'spouse',
    'spray',
    'spread',
    'spreading',
    'spring',
    'springer',
    'springfield',
    'springs',
    'sprint',
    'spyware',
    'squad',
    'square',
    'squirt',
    'squirting',
    'stability',
    'stable',
    'stack',
    'stadium',
    'staff',
    'staffing',
    'stage',
    'stages',
    'stainless',
    'stake',
    'stakeholders',
    'stamp',
    'stamps',
    'stan',
    'stand',
    'standard',
    'standards',
    'standing',
    'standings',
    'stands',
    'stanford',
    'stanley',
    'star',
    'starring',
    'stars',
    'starsmerchant',
    'start',
    'started',
    'starter',
    'starting',
    'starts',
    'startup',
    'stat',
    'state',
    'stated',
    'statement',
    'statements',
    'states',
    'statewide',
    'static',
    'stating',
    'station',
    'stationery',
    'stations',
    'statistical',
    'statistics',
    'stats',
    'status',
    'statute',
    'statutes',
    'statutory',
    'stay',
    'stayed',
    'staying',
    'stays',
    'steady',
    'steal',
    'steam',
    'steel',
    'steering',
    'stem',
    'step',
    'stephanie',
    'stephen',
    'steps',
    'stereo',
    'sterling',
    'steve',
    'steven',
    'stevens',
    'stewart',
    'stick',
    'sticker',
    'stickers',
    'sticks',
    'sticky',
    'still',
    'stock',
    'stockholm',
    'stockings',
    'stocks',
    'stolen',
    'stomach',
    'stone',
    'stones',
    'stood',
    'stop',
    'stopped',
    'stopping',
    'stops',
    'storage',
    'store',
    'stored',
    'stores',
    'stories',
    'storm',
    'story',
    'straight',
    'strain',
    'strand',
    'strange',
    'stranger',
    'strap',
    'strategic',
    'strategies',
    'strategy',
    'stream',
    'streaming',
    'streams',
    'street',
    'streets',
    'strength',
    'strengthen',
    'strengthening',
    'strengths',
    'stress',
    'stretch',
    'stretched',
    'strict',
    'strictly',
    'strike',
    'strikes',
    'striking',
    'string',
    'strings',
    'strip',
    'stripes',
    'strips',
    'stroke',
    'strong',
    'stronger',
    'strongly',
    'struck',
    'struct',
    'structural',
    'structure',
    'structured',
    'structures',
    'struggle',
    'stuart',
    'stuck',
    'stud',
    'student',
    'students',
    'studied',
    'studies',
    'studio',
    'studios',
    'study',
    'studying',
    'stuff',
    'stuffed',
    'stunning',
    'stupid',
    'style',
    'styles',
    'stylish',
    'stylus',
    'subaru',
    'subcommittee',
    'subdivision',
    'subject',
    'subjective',
    'subjects',
    'sublime',
    'sublimedirectory',
    'submission',
    'submissions',
    'submit',
    'submitted',
    'submitting',
    'subscribe',
    'subscriber',
    'subscribers',
    'subscription',
    'subscriptions',
    'subsection',
    'subsequent',
    'subsequently',
    'subsidiaries',
    'subsidiary',
    'substance',
    'substances',
    'substantial',
    'substantially',
    'substitute',
    'subtle',
    'suburban',
    'succeed',
    'success',
    'successful',
    'successfully',
    'such',
    'sucking',
    'sudan',
    'sudden',
    'suddenly',
    'suffer',
    'suffered',
    'suffering',
    'sufficient',
    'sufficiently',
    'suffix',
    'sugar',
    'suggest',
    'suggested',
    'suggesting',
    'suggestion',
    'suggestions',
    'suggests',
    'suicide',
    'suit',
    'suitable',
    'suite',
    'suited',
    'suites',
    'suits',
    'sullivan',
    'summaries',
    'summary',
    'summer',
    'summit',
    'sunday',
    'sunglasses',
    'sunny',
    'sunrise',
    'sunset',
    'sunshine',
    'super',
    'superb',
    'superintendent',
    'superior',
    'supervision',
    'supervisor',
    'supervisors',
    'supplement',
    'supplemental',
    'supplements',
    'supplied',
    'supplier',
    'suppliers',
    'supplies',
    'supply',
    'support',
    'supported',
    'supporters',
    'supporting',
    'supports',
    'suppose',
    'supposed',
    'supreme',
    'sure',
    'surely',
    'surf',
    'surface',
    'surfaces',
    'surfing',
    'surge',
    'surgeon',
    'surgeons',
    'surgery',
    'surgical',
    'surname',
    'surplus',
    'surprise',
    'surprised',
    'surprising',
    'surrey',
    'surround',
    'surrounded',
    'surrounding',
    'surveillance',
    'survey',
    'surveys',
    'survival',
    'survive',
    'survivor',
    'survivors',
    'susan',
    'suse',
    'suspect',
    'suspected',
    'suspended',
    'suspension',
    'sussex',
    'sustainability',
    'sustainable',
    'sustained',
    'suzuki',
    'swap',
    'swaziland',
    'sweden',
    'swedish',
    'sweet',
    'swift',
    'swim',
    'swimming',
    'swing',
    'swingers',
    'swiss',
    'switch',
    'switched',
    'switches',
    'switching',
    'switzerland',
    'sword',
    'sydney',
    'syllables',
    'symantec',
    'symbol',
    'symbols',
    'sympathy',
    'symphony',
    'symposium',
    'symptoms',
    'sync',
    'syndicate',
    'syndication',
    'syndrome',
    'synopsis',
    'syntax',
    'synthesis',
    'synthetic',
    'syracuse',
    'syria',
    'system',
    'systematic',
    'systems',
    'table',
    'tables',
    'tablet',
    'tablets',
    'tabs',
    'tackle',
    'tactics',
    'tagged',
    'tags',
    'tahoe',
    'tail',
    'taiwan',
    'take',
    'taken',
    'takes',
    'taking',
    'tale',
    'talent',
    'talented',
    'tales',
    'talk',
    'talked',
    'talking',
    'talks',
    'tall',
    'tamil',
    'tampa',
    'tank',
    'tanks',
    'tanzania',
    'tape',
    'tapes',
    'target',
    'targeted',
    'targets',
    'tariff',
    'task',
    'tasks',
    'taste',
    'tattoo',
    'taught',
    'taxation',
    'taxes',
    'taxi',
    'taylor',
    'teach',
    'teacher',
    'teachers',
    'teaches',
    'teaching',
    'team',
    'teams',
    'tear',
    'tears',
    'tech',
    'technical',
    'technician',
    'technique',
    'techniques',
    'techno',
    'technological',
    'technologies',
    'technology',
    'techrepublic',
    'teddy',
    'teen',
    'teenage',
    'teens',
    'teeth',
    'telecharger',
    'telecom',
    'telecommunications',
    'telephone',
    'telephony',
    'telescope',
    'television',
    'televisions',
    'tell',
    'telling',
    'tells',
    'temp',
    'temperature',
    'temperatures',
    'template',
    'templates',
    'temple',
    'temporal',
    'temporarily',
    'temporary',
    'tenant',
    'tend',
    'tender',
    'tennessee',
    'tennis',
    'tension',
    'tent',
    'term',
    'terminal',
    'terminals',
    'termination',
    'terminology',
    'terms',
    'terrace',
    'terrain',
    'terrible',
    'territories',
    'territory',
    'terror',
    'terrorism',
    'terrorist',
    'terrorists',
    'terry',
    'test',
    'testament',
    'tested',
    'testimonials',
    'testimony',
    'testing',
    'tests',
    'texas',
    'text',
    'textbook',
    'textbooks',
    'textile',
    'textiles',
    'texts',
    'texture',
    'thai',
    'thailand',
    'than',
    'thank',
    'thanks',
    'thanksgiving',
    'that',
    'thats',
    'theater',
    'theaters',
    'theatre',
    'thee',
    'theft',
    'thehun',
    'their',
    'them',
    'theme',
    'themes',
    'themselves',
    'then',
    'theology',
    'theorem',
    'theoretical',
    'theories',
    'theory',
    'therapeutic',
    'therapist',
    'therapy',
    'there',
    'thereafter',
    'thereby',
    'therefore',
    'thereof',
    'thermal',
    'thesaurus',
    'these',
    'thesis',
    'theta',
    'they',
    'thick',
    'thickness',
    'thin',
    'thing',
    'things',
    'think',
    'thinking',
    'thinkpad',
    'thinks',
    'third',
    'thirteen',
    'thirty',
    'this',
    'thomas',
    'thompson',
    'thomson',
    'thong',
    'thongs',
    'thorough',
    'thoroughly',
    'those',
    'thou',
    'though',
    'thought',
    'thoughts',
    'thousand',
    'thousands',
    'thread',
    'threaded',
    'threads',
    'threat',
    'threatened',
    'threatening',
    'threats',
    'three',
    'threshold',
    'threw',
    'thriller',
    'throat',
    'through',
    'throughout',
    'throw',
    'throwing',
    'thrown',
    'throws',
    'thru',
    'thumb',
    'thumbnail',
    'thumbnails',
    'thumbs',
    'thumbzilla',
    'thunder',
    'thursday',
    'thus',
    'ticket',
    'tickets',
    'tide',
    'tied',
    'tier',
    'ties',
    'tiffany',
    'tiger',
    'tigers',
    'tight',
    'tile',
    'tiles',
    'till',
    'timber',
    'time',
    'timeline',
    'timely',
    'timer',
    'times',
    'timing',
    'timothy',
    'tiny',
    'tion',
    'tions',
    'tips',
    'tire',
    'tired',
    'tires',
    'tissue',
    'titanium',
    'titans',
    'title',
    'titled',
    'titles',
    'titten',
    'tobacco',
    'tobago',
    'today',
    'todd',
    'toddler',
    'together',
    'toilet',
    'token',
    'tokyo',
    'told',
    'tolerance',
    'toll',
    'tomato',
    'tomatoes',
    'tommy',
    'tomorrow',
    'tone',
    'toner',
    'tones',
    'tongue',
    'tonight',
    'tons',
    'tony',
    'took',
    'tool',
    'toolbar',
    'toolbox',
    'toolkit',
    'tools',
    'tooth',
    'topic',
    'topics',
    'tops',
    'tore',
    'toronto',
    'torture',
    'toshiba',
    'total',
    'totally',
    'totals',
    'touch',
    'touched',
    'tough',
    'tour',
    'touring',
    'tourism',
    'tourist',
    'tournament',
    'tournaments',
    'tours',
    'toward',
    'towards',
    'tower',
    'towers',
    'town',
    'towns',
    'township',
    'toxic',
    'toyota',
    'toys',
    'trace',
    'track',
    'trackback',
    'trackbacks',
    'tracked',
    'tracker',
    'tracking',
    'tracks',
    'tract',
    'tractor',
    'tracy',
    'trade',
    'trademark',
    'trademarks',
    'trader',
    'trades',
    'trading',
    'tradition',
    'traditional',
    'traditions',
    'traffic',
    'tragedy',
    'trail',
    'trailer',
    'trailers',
    'trails',
    'train',
    'trained',
    'trainer',
    'trainers',
    'training',
    'trains',
    'tramadol',
    'trance',
    'trans',
    'transaction',
    'transactions',
    'transcript',
    'transcription',
    'transcripts',
    'transexual',
    'transexuales',
    'transfer',
    'transferred',
    'transfers',
    'transform',
    'transformation',
    'transit',
    'transition',
    'translate',
    'translated',
    'translation',
    'translations',
    'translator',
    'transmission',
    'transmit',
    'transmitted',
    'transparency',
    'transparent',
    'transport',
    'transportation',
    'transsexual',
    'trap',
    'trash',
    'trauma',
    'travel',
    'traveler',
    'travelers',
    'traveling',
    'traveller',
    'travelling',
    'travels',
    'travesti',
    'travis',
    'tray',
    'treasure',
    'treasurer',
    'treasures',
    'treasury',
    'treat',
    'treated',
    'treating',
    'treatment',
    'treatments',
    'treaty',
    'tree',
    'trees',
    'trek',
    'trembl',
    'tremendous',
    'trend',
    'trends',
    'treo',
    'trial',
    'trials',
    'triangle',
    'tribal',
    'tribe',
    'tribes',
    'tribunal',
    'tribune',
    'tribute',
    'trick',
    'tricks',
    'tried',
    'tries',
    'trigger',
    'trim',
    'trinidad',
    'trinity',
    'trio',
    'trip',
    'tripadvisor',
    'triple',
    'trips',
    'triumph',
    'trivia',
    'troops',
    'tropical',
    'trouble',
    'troubleshooting',
    'trout',
    'troy',
    'truck',
    'trucks',
    'true',
    'truly',
    'trunk',
    'trust',
    'trusted',
    'trustee',
    'trustees',
    'trusts',
    'truth',
    'trying',
    'tsunami',
    'tube',
    'tubes',
    'tucson',
    'tuesday',
    'tuition',
    'tulsa',
    'tumor',
    'tune',
    'tuner',
    'tunes',
    'tuning',
    'tunisia',
    'tunnel',
    'turbo',
    'turkey',
    'turkish',
    'turn',
    'turned',
    'turner',
    'turning',
    'turns',
    'turtle',
    'tutorial',
    'tutorials',
    'twelve',
    'twenty',
    'twice',
    'twiki',
    'twin',
    'twinks',
    'twins',
    'twist',
    'twisted',
    'tyler',
    'type',
    'types',
    'typical',
    'typically',
    'typing',
    'uganda',
    'ugly',
    'ukraine',
    'ultimate',
    'ultimately',
    'ultra',
    'ultram',
    'unable',
    'unauthorized',
    'unavailable',
    'uncertainty',
    'uncle',
    'undefined',
    'under',
    'undergraduate',
    'underground',
    'underline',
    'underlying',
    'understand',
    'understanding',
    'understood',
    'undertake',
    'undertaken',
    'underwear',
    'undo',
    'unemployment',
    'unexpected',
    'unfortunately',
    'unified',
    'uniform',
    'union',
    'unions',
    'uniprotkb',
    'unique',
    'unit',
    'united',
    'units',
    'unity',
    'univ',
    'universal',
    'universe',
    'universities',
    'university',
    'unix',
    'unknown',
    'unless',
    'unlike',
    'unlikely',
    'unlimited',
    'unlock',
    'unnecessary',
    'unsigned',
    'unsubscribe',
    'until',
    'untitled',
    'unto',
    'unusual',
    'unwrap',
    'upcoming',
    'update',
    'updated',
    'updates',
    'updating',
    'upgrade',
    'upgrades',
    'upgrading',
    'upload',
    'uploaded',
    'upon',
    'upper',
    'upset',
    'upskirts',
    'uranus',
    'urban',
    'urge',
    'urgent',
    'urls',
    'uruguay',
    'usage',
    'usda',
    'used',
    'useful',
    'user',
    'username',
    'users',
    'uses',
    'usgs',
    'using',
    'usps',
    'usual',
    'usually',
    'utah',
    'utilities',
    'utility',
    'utilization',
    'utilize',
    'utils',
    'uzbekistan',
    'vacancies',
    'vacation',
    'vacations',
    'vaccine',
    'vacuum',
    'valentine',
    'valid',
    'validation',
    'validity',
    'valium',
    'valley',
    'valuable',
    'valuation',
    'value',
    'valued',
    'values',
    'valve',
    'valves',
    'vampire',
    'vancouver',
    'vanilla',
    'variable',
    'variables',
    'variance',
    'variation',
    'variations',
    'varied',
    'varies',
    'varieties',
    'variety',
    'various',
    'vary',
    'varying',
    'vast',
    'vatican',
    'vault',
    'vbulletin',
    'vector',
    'vegas',
    'vegetable',
    'vegetables',
    'vegetarian',
    'vegetation',
    'vehicle',
    'vehicles',
    'velocity',
    'velvet',
    'vendor',
    'vendors',
    'venezuela',
    'venice',
    'venture',
    'ventures',
    'venue',
    'venues',
    'venus',
    'verb',
    'verbal',
    'verde',
    'verification',
    'verified',
    'verify',
    'verizon',
    'vermont',
    'vernon',
    'verse',
    'version',
    'versions',
    'versus',
    'vertex',
    'vertical',
    'very',
    'verzeichnis',
    'vessel',
    'vessels',
    'veteran',
    'veterans',
    'veterinary',
    'vibrators',
    'vice',
    'victim',
    'victims',
    'victor',
    'victoria',
    'victorian',
    'victory',
    'video',
    'videos',
    'vids',
    'vienna',
    'vietnam',
    'vietnamese',
    'view',
    'viewed',
    'viewer',
    'viewers',
    'viewing',
    'viewpicture',
    'views',
    'viii',
    'viking',
    'villa',
    'village',
    'villages',
    'villas',
    'vincent',
    'vintage',
    'vinyl',
    'violation',
    'violations',
    'violence',
    'violent',
    'violin',
    'viral',
    'virgin',
    'virginia',
    'virtual',
    'virtually',
    'virtue',
    'virus',
    'viruses',
    'visa',
    'visibility',
    'visible',
    'vision',
    'visit',
    'visited',
    'visiting',
    'visitor',
    'visitors',
    'visits',
    'vista',
    'visual',
    'vital',
    'vitamin',
    'vitamins',
    'vocabulary',
    'vocal',
    'vocals',
    'vocational',
    'voice',
    'voices',
    'void',
    'voip',
    'volkswagen',
    'volleyball',
    'volt',
    'voltage',
    'volume',
    'volumes',
    'voluntary',
    'volunteer',
    'volunteers',
    'volvo',
    'vote',
    'voted',
    'voters',
    'votes',
    'voting',
    'vowel',
    'voyeurweb',
    'voyuer',
    'vsnet',
    'vulnerability',
    'vulnerable',
    'wage',
    'wages',
    'wagner',
    'wagon',
    'wait',
    'waiting',
    'waiver',
    'wake',
    'wales',
    'walk',
    'walked',
    'walker',
    'walking',
    'walks',
    'wall',
    'wallace',
    'wallet',
    'wallpaper',
    'wallpapers',
    'walls',
    'walnut',
    'walt',
    'walter',
    'wanna',
    'want',
    'wanted',
    'wanting',
    'wants',
    'warcraft',
    'ward',
    'ware',
    'warehouse',
    'warm',
    'warming',
    'warned',
    'warner',
    'warning',
    'warnings',
    'warrant',
    'warranties',
    'warranty',
    'warren',
    'warrior',
    'warriors',
    'wars',
    'warsaw',
    'wash',
    'washer',
    'washing',
    'washington',
    'waste',
    'watch',
    'watched',
    'watches',
    'watching',
    'water',
    'waterproof',
    'waters',
    'watershed',
    'watson',
    'watt',
    'watts',
    'wave',
    'waves',
    'wayne',
    'ways',
    'weak',
    'wealth',
    'weapon',
    'weapons',
    'wear',
    'wearing',
    'weather',
    'webcam',
    'webcams',
    'webcast',
    'weblog',
    'weblogs',
    'webmaster',
    'webmasters',
    'webpage',
    'webshots',
    'website',
    'websites',
    'webster',
    'wedding',
    'weddings',
    'wedge',
    'wednesday',
    'weed',
    'week',
    'weekend',
    'weekends',
    'weekly',
    'weeks',
    'weight',
    'weighted',
    'weights',
    'weird',
    'welcome',
    'welding',
    'welfare',
    'well',
    'wellington',
    'wellness',
    'wells',
    'welsh',
    'wendy',
    'went',
    'were',
    'wesley',
    'west',
    'western',
    'westminster',
    'whale',
    'what',
    'whatever',
    'whats',
    'wheat',
    'wheel',
    'wheels',
    'when',
    'whenever',
    'where',
    'whereas',
    'wherever',
    'whether',
    'which',
    'while',
    'whilst',
    'white',
    'whole',
    'wholesale',
    'whom',
    'whose',
    'wichita',
    'wicked',
    'wide',
    'widely',
    'wider',
    'widescreen',
    'widespread',
    'width',
    'wife',
    'wifi',
    'wiki',
    'wikipedia',
    'wild',
    'wilderness',
    'wildlife',
    'wiley',
    'will',
    'william',
    'williams',
    'willing',
    'willow',
    'wilson',
    'wind',
    'window',
    'windows',
    'winds',
    'windsor',
    'wine',
    'wines',
    'wing',
    'wings',
    'winner',
    'winners',
    'winning',
    'wins',
    'winston',
    'winter',
    'wire',
    'wired',
    'wireless',
    'wires',
    'wiring',
    'wisconsin',
    'wisdom',
    'wise',
    'wish',
    'wishes',
    'wishing',
    'wishlist',
    'witch',
    'with',
    'withdrawal',
    'within',
    'without',
    'witness',
    'witnesses',
    'wives',
    'wizard',
    'wolf',
    'woman',
    'women',
    'womens',
    'wonder',
    'wonderful',
    'wondering',
    'wood',
    'wooden',
    'woods',
    'wool',
    'worcester',
    'word',
    'wordpress',
    'words',
    'wore',
    'work',
    'worked',
    'worker',
    'workers',
    'workflow',
    'workforce',
    'working',
    'workout',
    'workplace',
    'works',
    'workshop',
    'workshops',
    'workstation',
    'world',
    'worldcat',
    'worlds',
    'worldsex',
    'worldwide',
    'worm',
    'worn',
    'worried',
    'worry',
    'worse',
    'worship',
    'worst',
    'worth',
    'worthy',
    'would',
    'wound',
    'wrap',
    'wrapped',
    'wrapping',
    'wrestling',
    'wright',
    'wrist',
    'write',
    'writer',
    'writers',
    'writes',
    'writing',
    'writings',
    'written',
    'wrong',
    'wrote',
    'wyoming',
    'xanax',
    'xbox',
    'xerox',
    'xhtml',
    'xnxx',
    'yacht',
    'yahoo',
    'yale',
    'yamaha',
    'yang',
    'yard',
    'yards',
    'yarn',
    'yeah',
    'year',
    'yearly',
    'years',
    'yeast',
    'yellow',
    'yemen',
    'yesterday',
    'yield',
    'yields',
    'yoga',
    'york',
    'yorkshire',
    'young',
    'younger',
    'your',
    'yours',
    'yourself',
    'youth',
    'yugoslavia',
    'yukon',
    'zambia',
    'zdnet',
    'zealand',
    'zero',
    'zimbabwe',
    'zinc',
    'zoloft',
    'zone',
    'zones',
    'zoning',
    'zoom',
    'zope',
];

/**
 * A dictionary to select words from when generating passwords.
 */
class Dictionary{
    /**
     * @type {number}
     */
    static get MIN_WORD_LENGTH(){
        return 4;
    }
    
    /**
     * The base word sanitization function.
     *
     * This function performs the following actions:
     * 1. remove all non-word characters except the simple dash (accented characters are retained)
     *
     * Regardless of how many additional sanitizers a dictionary has, this function is always called as the final sanitizer by the instance sanitizer function.
     *
     * @param {string} inputString - The string to be sanitized
     * @return {string} The sanitized string.
     * @note Using XRegExp for now until ES2018's Unicode property macting in REs is supported in FireFox & Edge.
     */
    static baseSanitizer(inputString){
        let output = String(inputString); // force to string
        
        // remove all non-word characters
        output = XRegExp.replace(output, XRegExp('[^-\\p{Letter}]', 'g'), '');
        
        // return the sanetized string
        return output;
    }
    
    /**
     * Build a Dictionary object from the default word list.
     *
     * @return {Dictionary}
     */
    static defaultDictionary(){
        return new Dictionary(DEFAULT_WORD_LIST);
    }
    
    /**
     * Strip diacritics from a string. I.e. 'cliché' becomes 'cliche'.
     *
     * @param {string} inputString
     * @return {string}
     */
    static stripDiacritics(inputString){
        return diacritics.remove(inputString);
    }
    
    /**
     * @param {(String[]|function|Promise)} [wordSource] - The source for the words.
     *
     * The source can be one of:
     * 1. An array of strings
     * 2. A callback that returns an array of strings
     * 3. A Promose for an array of strings.
     *
     * If the source is a promise the words are loaded asynchronously, otherwise they are loaded synchronously.
     * 
     * @param {Object} [options={}] - An optional options object.
     * @param {function} [options.sanitizer] - An additional sanitizer to be run before base sanitizer. Will be called with a string as an argument, and must return a string.
     * @param {function[]} [options.sanitizers] - An array of additional sanitizers to be run befor ethe base sanitizer. Will be called with a string as an argument, and must return a string.
     * @throws {TypeError} Throws a type error on invalid args
     */
    constructor(wordSource, options={}){
        this._words = [];
        this._sanitizers = [];
        this._wordsPromise = null;
        this._loadInProgress = false;
        this._lastLoadStats = {
            numLoaded: 0,
            numRejected: 0,
            rejectedWords: []
        };
        
        // process the options
        if(is.not.object(options)) throw new TypeError('if passed, options must be an object');
        if(is.not.undefined(options.sanitizer)){
            if(is.function(options.sanitizer)){
                this._sanitizers.push(options.sanitizer);
            }else{
                throw new TypeError('if passed, options.sanitizer must be a callback');
            }
        }
        if(is.not.undefined(options.sanitizers)){
            if(is.array(options.sanitizers) && is.all.function(options.sanitizers)){
                this._sanitizers.push(...options.sanitizers);
            }else{
                throw new TypeError('if passed, options.sanitizers must be an array of callbacks');
            }
        }
        
        // load any provided words
        if(is.not.undefined(wordSource)){
            if(is.array(wordSource) || is.function(wordSource)){
                this.loadWordsSync(wordSource);
            }else if(is.object(wordSource) && is.function(wordSource.then)){
                this.loadWordsAsync(wordSource);
            }
        }
    }
    
    /**
     * @type {String[]}
     */
    get allWords(){
        return [...this._words];
    }
    
    /**
     * @type {Object}
     */
    get lastLoadStats(){
        return _.cloneDeep(this._lastLoadStats);
    }
    
    /**
     * @type {boolean}
     */
    get ready(){
        return this._loadInProgress === false && this._words.length >= 0;
    }
    
    /**
     * @type {function[]}
     */
    get sanitizers(){
        return [...this._sanitizers];
    }
    
    /**
     * Build a word list from an array of strings.
     *
     * Each word in the array will be sanitized before being included in the list, and words that are too short will be omitted from the list. Anything in the array that is not a string will be ignored.
     *
     * @param {String[]} words
     * @return {Object} Returns an object indexed by `words` & `rejectedWords`.
     * @throws {TypeError} A type error is thrown if invalid arguments are passed.
     */
    buildWordList(words){
        // validate args
        if(is.not.array(words)){
            throw new TypeError('must pass an array of strings');
        }
        
        // process the words
        const ans = {
            words: [],
            rejectedWords: []
        };
        for(const word of words){
            if(is.not.string(word)){
                ans.rejectedWords.push(word);
                continue;
            }
            let sanitizedWord = '';
            try{
                sanitizedWord = this.sanitize(word);
            }catch(err){
                ans.rejectedWords.push(word);
                continue;
            }
            if(sanitizedWord.length < Dictionary.MIN_WORD_LENGTH){
                ans.rejectedWords.push(word);
                continue;
            }
            ans.words.push(sanitizedWord);
        }
        
        // sort and de-duplicate the words
        ans.words = _.uniq(ans.words);
        ans.words.sort();
        
        // return the result
        return ans;
    }
    
    /**
     * Get the words for a given set of constraints.
     *
     * @param {Object} constraints - An object specifting the constraints. Usually an HSXKPasswd Config object.
     * @param {number} constraints.word_length_min - the minimum length of words to include.
     * @param {number} constraints.word_length_max - the maximum length of words to include.
     * @param {boolean} [constraints.allow_accents=false] - whether or not accents should be stripped from accented characters. Defaults to false.
     * @param {object} [constraints.character_substitutions={}] - any character substitutions to apply before returning the words. Defaults to none.
     * @return {String[]}
     * @throws {TypeError} A Type Error is thrown on invalid args.
     * @throws {Error} An Error is thrown if the Dictionary is not ready
     */
    filteredWords(constraints){
        // make sure the dictionary is ready
        if(!this.ready) throw new Error('Dictionary not ready');
        
        // validate constraints
        if(is.not.object(constraints)) throw new TypeError('constraints are required and must be passed as an object');
        if(!(is.integer(constraints.word_length_min) && constraints.word_length_min >= Dictionary.MIN_WORD_LENGTH)){
            throw new TypeError(`constraints.word_length_min must be an integer greater than or equal to ${Dictionary.MIN_WORD_LENGTH} and less than or equal to word_length_max`);
        }
        if(!(is.integer(constraints.word_length_max) && constraints.word_length_max >= Dictionary.MIN_WORD_LENGTH)){
            throw new TypeError(`constraints.word_length_max must be an integer greater than or equal to ${Dictionary.MIN_WORD_LENGTH} and greater than or equal to word_length_min`);
        }
        if(constraints.word_length_min > constraints.word_length_max){
            throw new TypeError('constraints.word_length_min must be less than or equal to constraints.word_length_max');
        }
        if(is.not.undefined(constraints.character_substitutions)){
            const subsErrMsg = 'if present, constraints.character_substitutions must be an object mapping single characters to strings';
            if(is.not.object(constraints.character_substitutions)) throw new TypeError(subsErrMsg);
            for(const c of Object.keys(constraints.character_substitutions)){
                if(!XRegExp.match(c, XRegExp('^\\p{Letter}$'))) throw new TypeError(subsErrMsg);
                if(is.not.string(constraints.character_substitutions[c])) throw new TypeError(subsErrMsg);
            }
        }
        const validatedConstraints = {
            word_length_min: constraints.word_length_min,
            word_length_max: constraints.word_length_max,
            allow_accents: is.undefined(constraints.allow_accents) ? false : constraints.allow_accents ? true : false,
            character_substitutions: constraints.character_substitutions ? constraints.character_substitutions : {}
        };
        
        // loop through all words, apply any specified substitutions, then test against criteria
        const fiteredWords = [];
        for(let word of this._words){
            // apply substitutions
            for(const c of Object.keys(validatedConstraints.character_substitutions)){
                word = word.replace(c, validatedConstraints.character_substitutions[c]);
            }
            
            // test against constraints
            if(word.length < validatedConstraints.word_length_min) continue;
            if(word.length > validatedConstraints.word_length_max) continue;
            if(validatedConstraints.allow_accents){
                fiteredWords.push(word);
            }else{
                // strip diacritics then store
                fiteredWords.push(Dictionary.stripDiacritics(word));
            }
        }
        
        // return the filtered words
        return fiteredWords;
    }
    
    /**
     * Synchronously Load words into the dictionary, replacing any existing words.
     *
     * Each word will be sanitized, and words that don't meet the minimum length or throw an error during sanitation will be rejected.
     *
     * @param {(String[]|function|Promise)} wordSource - The source for the words. Can be:
     * 1. An array of strings
     * 2. A callback that returns an array of strings
     * @return {Object} Returns an object indexed by `numLoaded`, `numRejected` & `rejectedWords`.
     * @throws {TypeError} A Type Error is thrown if invalid args are passed.
     * @throws {Error} An error is thrown if there is already a load in progress.
     */
    loadWordsSync(wordSource){
        // get the words from the word source
        if(is.undefined(wordSource)) throw new TypeError('word source required, can be an array of strings or a callback that returns an array of strings');
        let words = [];
        if(is.array(wordSource)){
            words = wordSource;
        }else if(is.function(wordSource)){
            words = wordSource();
            if(!(is.array(words) && is.all.string(words))){
                throw new TypeError('callback did not return an array of strings');
            }
        }
        
        // build a word list from the words
        const wordList = this.buildWordList(words);
        
        // make sure there is not another load in progress
        if(this._loadInProgress) throw new Error('another load is already in progress');
        
        // store the words + stats
        const stats = {
            numLoaded: wordList.words.length,
            numRejected: wordList.rejectedWords.length,
            rejectedWords: wordList.rejectedWords
        };
        this._words = wordList.words;
        this._lastLoadStats = stats;
        this._wordsPromise = Promise.resolve(wordList.words);
        
        // return the stats
        return _.cloneDeep(stats);
    }
    
    /**
     * Asynchronously Load words into the dictionary, replacing any existing words.
     *
     * Each word will be sanitized, and words that don't meet the minimum length or throw an error during sanitation will be rejected.
     *
     * @param {(Promise} wordsPromise - A promise for an array of Strings.
     * @return {Object} Returns a promise for an object indexed by `numLoaded`, `numRejected` & `rejectedWords`.
     * @throws {TypeError} A Type Error is thrown if invalid args are passed.
     * @throws {Error} An error is thrown if there is already a load in progress.
     */
    async loadWordsAsync(wordsPromise){
        // if there's already another load in progress, throw an error
        if(this._loadInProgress){
            throw new Error('load already in progress');
        }
        
        // mark a load as being in progress and blank the words list
        this._loadInProgress = true;
        this._words = [];
        
        // build a promise for a word list generated from the word source
        const wordListPromise = wordsPromise.then(
            (words)=>{ // resolved handler
                return this.buildWordList(words);
            }
        );
        
        // build and store a promise for the words
        this._wordsPromise = wordListPromise.then(
            function(wordList){
                return wordList.words();
            }
        );
        
        // await the resolution of the word list promise
        const wordList = await wordListPromise;
        const stats = {
            numLoaded: wordList.words.length,
            numRejected: wordList.rejectedWords.length,
            rejectedWords: wordList.rejectedWords
        };
        
        // store the words + stats and mark the load as complete
        this._words = wordList.words;
        this._lastLoadStats = stats;
        this._loadInProgress = false;
        
        // return the stats
        return _.cloneDeep(stats);
    }
    
    /**
     * Sanitise a string. This function will be called on each word before it is added to the word list.
     *
     * This function executes all custom sanitizers on the passed string, and then the base sanitzer.
     *
     * @param {string} inputString
     * @return {string}
     */
    sanitize(inputString){
        let output = inputString;
        
        // apply each sanitizer in turn
        for(const sanitizer of this.sanitizers){
            output = sanitizer(String(output));
        }
        
        // apply the base sanitzer and return
        return Dictionary.baseSanitizer(output);
    }
}

/**
 * The abstract class random number soource must extend.
 */
class RandomNumberSource{
    /**
     * Default Random Number Generator. `Uses Math.random()`.
     *
     * @param {number} [n=1] - the number of random numbers to generate.
     * @return {number[]} An array of numbers between zero and one.
    * @throws {TypeError} A Type Error is thrown on invalid args.
    */
    static defaultRNG(n=1){
    // validate args
        if(is.not.integer(n) || n < 1) throw new TypeError('if passed, n must be an integer greater than or equal to 1');
    
        // generate the required random numbers
        const ans = [];
        for(let i = 0; i < n; i++){
            ans.push(Math.random());
        }
    
        // return the required random numbers
        return ans;
    }
    
    /**
     * Generate a random zero-based index from a random number between 0 and 1.
     *
     * @param {number} randomNumber - A random number between 0 and 1.
     * @param {number} [length=2] - the length of the item for which a random index should be generated. Must be greater than or equal to 1.
     * @return {number} - a random integer between zero and one less than the length (inclusive).
     * @throws {TypeError} - a Type Error is thrown on invalid args
     */
    static randomIndexFromRandomNumber(randomNumber, length=2){
        // validate args
        if(!(is.number(randomNumber) && randomNumber >= 0 && randomNumber < 1)){
            throw new TypeError('random number must be greater than or equal to zero and less than one');
        }
        if(is.not.integer(length) || length < 1) throw new TypeError('length must be an integer greater than or equal to one');
        
        // short-circuit single-element items
        if(length === 1) return 0;
        
        // do the math!
        return Math.round(randomNumber * (length - 1));
    }
    
    /**
     * Generate a random boolean from a random number between 0 and 1.
     *
     * @param {number} randomNumber - A random number between 0 and 1.
     * @return {boolean}
     * @throws {TypeError} - a Type Error is thrown on invalid args
     */
    static randomBooleanFromRandomNumber(randomNumber){
        // validate args
        if(!(is.number(randomNumber) && randomNumber >= 0 && randomNumber < 1)){
            throw new TypeError('random number must be greater than or equal to zero and less than one');
        }
        
        // do the math!
        return Math.round(randomNumber) === 0 ? false : true;
    }
    
    /**
     * @param {(function|null)} [syncRNGCallback] - a callback to synchronously generate a specified number of random numbers. Defaults to `Math.random()`. Pass `null` to disable synchronous random number generation.
     * @param {function} [asyncRNGCallback] - a callback to asynchronously generate a specified number of random numbers. Defaults to a promise for the valuies returned by the synchronous callback or `Math.random()`.
     * @throws {TypeErrpr} A Type Error is thrown when invalid args are passed.
     */
    constructor(syncRNGCallback, asyncRNGCallback){
        // store the synchronous random number generation callback, if any
        if(is.undefined(syncRNGCallback)){
            this._syncRNG = this.constructor.defaultRNG;
        }else if(is.null(syncRNGCallback)){
            this._syncRNG = null;
        }else if(is.function(syncRNGCallback)){
            this._syncRNG = syncRNGCallback;
        }else{
            throw new TypeError('synchronous random number generation callback must be a function or null');
        }
        
        // store or generate an asynchronous callback
        if(is.undefined(asyncRNGCallback)){
            if(this.sync){
                this.asyncRNG = (n)=>{ Promise.resolve(this._syncRNG(n)); };
            }else{
                this.asyncRNG = (n)=>{ Promise.resolve(this.constructor.defaultRNG(n)); };
            }
        }else if(is.function(asyncRNGCallback)){
            this.asyncRNG = asyncRNGCallback;
        }else{
            throw new TypeError('if passed, the asynchronous random number generation callback must be a function');
        }
    }
    
    /**
     * Whether or not this generator can generate passwords synchronously.
     *
     * @type {boolean}
     */
    get isSynchronous(){
        return is.function(this._syncRNG) ? true : false;
    }
    
    /**
     * Alias for `.isSynchronous`.
     */
    get sync(){ return this.isSynchronous; }
    
    /**
     * Synchronously generate random booleans.
     * @param {number} [n=1] - the number of random booleans to generate.
     * @return {boolean[]}
     * @throws {TypeError} A Type Error is thrown when the random number generator callback returns an invalid value.
     * @throws {Error} An Error is thrown if synchronous random number generation fails.
     */
    randomBooleansSync(n=1){
        // validate args
        if(is.not.integer(n) || n < 1) throw new TypeError('n must be an integer greater than or equal to one');
        
        // generate random numbers, convert them to Booleans, and return
        const rns = this.randomNumbersSync(n);
        return rns.map((rn)=>{ return this.constructor.randomBooleanFromRandomNumber(rn); });
    }
    
    /**
     * Synchronously generate a random boolean.
     *
     * @return {boolean}
     * @throws {TypeError} A Type Error is thrown when the random number generator callback returns an invalid value.
     * @throws {Error} An Error is thrown if synchronous random number generation fails.
     */
    randomBooleanSync(){
        return this.randomBooleansSync(1)[0];
    }
    
    /**
     * Synchronously generate random digits.
     * @param {number} [n=1] - the number of random digits to generate.
     * @return {number[]}
     * @throws {TypeError} A Type Error is thrown when the random number generator callback returns an invalid value.
     * @throws {Error} An Error is thrown if synchronous random number generation fails.
     */
    randomDigitsSync(n=1){
        // validate args
        if(is.not.integer(n) || n < 1) throw new TypeError('n must be an integer greater than or equal to one');
        
        // return random indexes of length 10
        return this.randomIndexesSync(n, 10);
    }
    
    /**
     * Synchronously generate a random digit.
     *
     * @return {number}
     * @throws {TypeError} A Type Error is thrown when the random number generator callback returns an invalid value.
     * @throws {Error} An Error is thrown if synchronous random number generation fails.
     */
    randomDigitSync(){
        return this.randomDigitsSync(1)[0];
    }
    
    /**
     * Synchronously generate random indexes.
     * @param {number} [n=1] - the number of random booleans to generate.
     * @param {number} [length=2] - the length of the item for which to generate random indexes.
     * @return {number[]} Returns and array of numbers greater than or equal to zero and less than the length.
     * @throws {TypeError} A Type Error is thrown when the random number generator callback returns an invalid value.
     * @throws {Error} An Error is thrown if synchronous random number generation fails.
     */
    randomIndexesSync(n=1, length=2){
        // validate args
        if(is.not.integer(n) || n < 1) throw new TypeError('n must be an integer greater than or equal to one');
        if(is.not.integer(length) || length < 2) throw new TypeError('length must be an integer greater than or equal to two');
        
        // generate random numbers, convert them to indexes, and return
        const rns = this.randomNumbersSync(n);
        return rns.map((rn)=>{ return this.constructor.randomIndexFromRandomNumber(rn, length); });
    }
    
    /**
     * Synchronously generate a random index.
     *
     * @param {number} [length=2] - the length of the item for which to generate random indexes.
     * @return {boolean}
     * @throws {TypeError} A Type Error is thrown when the random number generator callback returns an invalid value.
     * @throws {Error} An Error is thrown if synchronous random number generation fails.
     */
    randomIndexSync(length){
        return this.randomIndexesSync(1, length)[0];
    }
    
    /**
     * Synchronously pick a random item from an array.
     *
     * @param {Array} array - The array to randomly pick an item from. This array must contain at least one element.
     * @return {*} A randomly picked item from the array.
     * @throws {TypeError} A Type Error is thrown when the random number generator callback returns an invalid value.
     * @throws {Error} An Error is thrown if synchronous random number generation fails.
     */
    randomItemSync(array){
        // validate args
        if(is.not.array(array) || array.length < 1) throw new TypeError('must pass an array containing at least one item');
        
        // if there's only one item, return it
        if(array.length === 1) return array[0];
        
        // otherwise return a random item
        return array[this.randomIndexSync(array.length)];
    }
    
    /**
     * Synchronously generate random numbers.
     *
     * @param {number} [n=1] - the number of random numbers to generate.
     * @return {number[]} Returns and array of numbers greater than or equal to zero and less than one.
     * @throws {TypeError} A Type Error is thrown when invalid arguments are passed or the random number generator callback returns invaid data.
     * @throws {Error} An Error is thrown if the random number source does not support synchronous random number generation.
     */
    randomNumbersSync(n=1){
        // make sure can synchronously generate random numbers
        if(!this.sync) throw new Error('synchronous random number geneation not supported on this Random Number Source'); 
        
        // validate args
        if(is.not.integer(n) || n < 1) throw new TypeError('n must be an integer greater than or equal to one');
        
        // generate the random numbers
        const ans = this._syncRNG(n);
        
        // validate the generated numbers
        if(is.not.array(ans)) throw new TypeError('synchronous random number generator callback did not return an array');
        if(ans.length !== n) throw new TypeError(`synchronous random number generator returned wrong number of numbers: needed ${n}, got ${ans.length}`);
        if(!is.all.number(ans)) throw new TypeError('synchronous random number generator returned and array that contained a value other than a number');
        for(const rn of ans){
            if(rn < 0 || rn >= 1) throw new TypeError('synchronous random number generator returned and array that contained a number that is not greater than or equal to zero and less than one');
        }
        
        // return the numbers
        return ans;
    }
    
    /**
     * Synchronously generate a random number.
     *
     * @return {number} Returns a number gerater than or equal to zero and less than one.
     * @throws {TypeError} A Type Error is thrown when the random number generator callback returns invaid data.
     * @throws {Error} An Error is thrown if the random number source does not support synchronous random number generation.
     */
    randomNumberSync(){
        return this.randomNumbersSync(1)[0];
    }
    
    /**
     * Generate random numbers asynchronously.
     *
     * @param {number} [n=10] - the number of random numbers to generate.
     * @throws {TypeError} A Type Error is thrown when invalid arguments are passed or the random number generator callback returns a value other than an array of numbers between zero and one.
     */
}

// import _ from 'lodash';

/**
 * An HSXKPasswd password generator.
 */
class Generator{
    /**
     * Synchronously add the appropriate number of padding digits to the start and end of an array of words. Changes are applied in-place. The array is returned purely for convenience. 
     *
     * @param {String[]} words - The array contianing the words. Items will be added into this array in-place.
     * @param {(Object|Config)} config - A config object to control the number of digits inserted (if any). Can be an instance of Config, or any object that defines the keys `padding_digits_before` & `padding_digits_after` with valid values.
     * @param {RandomNumberSource} rns - A RandomNumberSource object with a syncronous random number generator.
     * @return {String[]} The same array passed as the first argument.
     * @throws {TypeError} A Type Error is thrown on invalid args.
     */
    static addPaddingDigitsSync(words, config, rns){
        if(!(is.array(words) && is.all.string(words))){
            throw new TypeError('words must be an array of strings');
        }
        if(!(config instanceof Config || Config.definesPaddingDigits(config))){
            throw new TypeError('config must be an HSXKPasswd Config object or a plain object with valid values for the keys padding_digits_before & padding_digits_after');
        }
        if(!(rns instanceof RandomNumberSource && rns.sync)){
            throw new TypeError('rns must be a RandomNumberSource object supporting synchronous random number generation');
        }
        
        // insert the required prefixed digits
        if(config.padding_digits_before > 0){
            words.unshift(rns.randomDigitsSync(config.padding_digits_before).join(''));
        }
        
        // insert the required postfixed digits
        if(config.padding_digits_after > 0){
            words.push(rns.randomDigitsSync(config.padding_digits_after).join(''));
        }
        
        // return a reference to the passed array
        return words;
    }
    
    /**
     * Synchronously add the appropriate padding characters to the start and/or end of a string. 
     *
     * @param {string} str - The string to add the padding symbols to.
     * @param {(Object|Config)} config - A config object to control the generation of the separator character. Can be an instance of Config, or any object that defines a valid combination of the keys `padding_type`, `padding_character`, `padding_alphabet`, `symbol_alphabet`, `padding_characters_before`, `padding_characters_after` & `pad_to_length`.
     * @param {RandomNumberSource} rns - A RandomNumberSource object with a syncronous random number generator.
     * @param {string} separatorCharacter - The separator character in use, if any.
     * @return {string}
     * @throws {TypeError} A Type Error is thrown on invalid args.
     */
    static addPaddingCharactersSync(str, config, rns, separatorCharacter){
        if(is.not.string(str)){
            throw new TypeError('str must be a string');
        }
        if(!(config instanceof Config || Config.definesPaddingCharacters(config))){
            throw new TypeError('config must be an HSXKPasswd Config object or a plain object with valid values for config keys defining character padding');
        }
        if(!(rns instanceof RandomNumberSource && rns.sync)){
            throw new TypeError('rns must be a RandomNumberSource object supporting synchronous random number generation');
        }
        if(is.not.string(separatorCharacter) || separatorCharacter.length > 1){
            throw new TypeError('separatorCharacter required and must be a single character string or an empty string');
        }
        
        // short-curcuit padding_type NONE
        if(config.padding_type === 'NONE') return str;
        
        // figure out what character to pad with
        let padChar = '';
        switch(config.padding_character){
            case 'RANDOM':
                if(is.array(config.padding_alphabet)){
                    padChar = rns.randomItemSync(config.padding_alphabet);
                }else if(is.array(config.symbol_alphabet)){
                    padChar = rns.randomItemSync(config.symbol_alphabet);
                }else{
                    throw new TypeError('no alphabet found'); // should not be possible
                }
                break;
            case 'SEPARATOR':
                padChar = separatorCharacter;
                break;
            default:
                padChar = config.padding_character;
        }
        
        // figure out what type of padding to apply
        let ans = str;
        switch(config.padding_type){
            case 'NONE':
                return str;
            case 'FIXED':
                for(let i = 0; i < config.padding_characters_before; i++){
                    ans = padChar + ans;
                }
                for(let i = 0; i < config.padding_characters_after; i++){
                    ans += padChar;
                }
                break;
            case 'ADAPTIVE':
                if(str.length === config.pad_to_length){
                    return str;
                }else if(str.length > config.pad_to_length){
                    ans = ans.slice(0, config.pad_to_length);
                }else{
                    while(ans.length < config.pad_to_length){
                        ans += padChar;
                    }
                }
                break;
            default:
                throw new TypeError('invalid padding type'); // should not be possible
        }
        
        // return the padded string
        return ans;
    }
    
    /**
     * Synchronously Apply the appropraite case transformations to an array of words. Changes are applied in-place. The array is returned purely for convenience. 
     *
     * @param {String[]} words - The array contianing the words to be transformed. The contents of this array will be altered in-place.
     * @param {(Object|Config)} config - A config object to control the transformations applied (if any). Can be an instance of Config, or any object that defines the key `case_transform` with a valid value.
     * @param {RandomNumberSource} rns - A RandomNumberSource object with a syncronous random number generator.
     * @return {String[]} The same array passed as the first argument.
     * @throws {TypeError} A Type Error is thrown on invalid args.
     */
    static applyCaseTransformationsSync(words, config, rns){
        if(!(is.array(words) && is.all.string(words))){
            throw new TypeError('words must be an array of strings');
        }
        if(!(config instanceof Config || Config.definesCaseTransformation(config))){
            throw new TypeError('config must be an HSXKPasswd Config object or a plain object with valid values for config key case_transform');
        }
        if(!(rns instanceof RandomNumberSource && rns.sync)){
            throw new TypeError('rns must be a RandomNumberSource object supporting synchronous random number generation');
        }
        
        // short-circuit the no transorfmation
        if(config.case_transform === 'NONE') return words;
        
        // figure out what transformations to apply, if any.
        switch(config.case_transform){
            case 'ALTERNATE':
                // randomly choose to capitalise odd or even
                const toLower = (s)=>{ return s.toLowerCase(); };
                const toUpper = (s)=>{ return s.toUpperCase(); };
                let transEven = toLower;
                let transOdd = toUpper;
                if(rns.randomBooleanSync()){
                    transEven = toUpper;
                    transOdd = toLower;
                }
                for(let i = 0; i < words.length; i++){
                    if(i % 2 === 0){
                        words[i] = transEven(words[i]);
                    }else{
                        words[i] = transOdd(words[i]);
                    }
                }
                break;
            case 'CAPITALISE':
                for(let i = 0; i < words.length; i++){
                    words[i] = words[i].toLowerCase();
                    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
                }
                break;
            case 'INVERT':
                for(let i = 0; i < words.length; i++){
                    words[i] = words[i].toUpperCase();
                    words[i] = words[i].charAt(0).toLowerCase() + words[i].slice(1);
                }
                break;
            case 'LOWER':
                for(let i = 0; i < words.length; i++){
                    words[i] = words[i].toLowerCase();
                }
                break;
            case 'RANDOM':
                for(let i = 0; i < words.length; i++){
                    words[i] = rns.randomBooleanSync() ? words[i].toLowerCase() : words[i].toUpperCase();
                }
                break;
            case 'UPPER':
                for(let i = 0; i < words.length; i++){
                    words[i] = words[i].toUpperCase();
                }
                break;
            default:
                throw new TypeError(`invalid case_transform '${config.case_transform}'`); // should not be possible!
        }
        
        // return a reference to the passed array
        return words;
    }
    
    /**
     * Synchronously Generate a password.
     *
     * @param {Config} config
     * @param {Dictionary} dict
     * @param {RandomNumberSource} rns
     * @param {number} [n=1]
     */
    static generatePasswordsSync(config, dict, rns, n=1){
        // validate args
        if(!(config instanceof Config)){
            throw new TypeError('config must be a Config object');
        }
        if(!(dict instanceof Dictionary)){
            throw new TypeError('config must be a Dictionary object');
        }
        if(!(rns instanceof RandomNumberSource)){
            throw new TypeError('config must be a RandomNumberSource object');
        }
        if(is.not.integer(n) || is.not.positive(n)){
            throw new TypeError('n must be a positibe integer');
        }
        
        // get the word list for the given config
        // returned words have accents removed if needed and any defined character replacements applied
        const words = dict.filteredWords(config);
        console.log(words.length);
        
        // build the passwords
        const ans = [];
        do{
            // start with a list of random words
            const parts = [];
            for(const randNum of rns.randomNumbersSync(config.num_words)){
                parts.push(words[RandomNumberSource.randomIndexFromRandomNumber(randNum, words.length)]);
            }
            
            // apply any needed case transforms
            this.applyCaseTransformationsSync(parts, config, rns);
        
            // pre-fix any needed digits
            this.addPaddingDigitsSync(parts, config, rns);
        
            // join the parts into a single string with the appropriate separator
            const sep = this.generateSeparatorSync(config, rns);
            const pass = parts.join(sep);
        
            // add the requested padding symbols, if any
            pass = this.addPaddingCharactersSync(pass, config, rns, sep);
            
            ans.push(pass);
        }while(ans.length < n);
        
        // return the generated passwords
        return ans;
    }
    
    /**
     * Synchronously determine or randomly select a separator based on a given configuration file. 
     *
     * @param {(Object|Config)} config - A config object to control the generation of the separator character. Can be an instance of Config, or any object that defines a valid combinatino of the keys `separator_character`, `separator_alphabet` & `symbol_alphabet`.
     * @param {RandomNumberSource} rns - A RandomNumberSource object with a syncronous random number generator.
     * @return {string} A separator character or the empty string.
     * @throws {TypeError} A Type Error is thrown on invalid args.
     */
    static generateSeparatorSync(config, rns){
        if(!(config instanceof Config || is.object(config))){
            throw new TypeError('config must be an HSXKPasswd Config object or a plain object with valid combination of values for the keys separator_character, separator_alphabet & symbol_alphabet');
        }
        if(!(rns instanceof RandomNumberSource)){
            throw new TypeError('config must be a RandomNumberSource object');
        }
        if(is.not.string(config.separator_character)){
            throw new TypeError('config.separator_character must be a string');
        }
        if(is.not.undefined(config.separator_alphabet) && !Config.isAlphabet(config.separator_alphabet)){
            throw new TypeError('if present, config.separator_alphabet must be an array of single-character strings');
        }
        if(is.not.undefined(config.symbol_alphabet) && !Config.isAlphabet(config.symbol_alphabet)){
            throw new TypeError('if present, config.symbol_alphabet must be an array of single-character strings');
        }
        
        // figure out what separator type the config specifies
        if(config.separator_character === 'NONE'){
            return '';
        }else if(config.separator_character.length === 1){
            return config.separator_character;
        }else if(config.separator_character === 'RANDOM'){
            // figure out which alphabet to use
            let alphabet = [];
            if(config.separator_alphabet){
                alphabet = config.separator_alphabet;
            }else if(config.symbol_alphabet){
                alphabet = config.symbol_alphabet;
            }else{
                throw new TypeError('config.separator_character=RANDOM but neither config.separator_alphabet nor config.symbol_alphabet are defined');
            }
            
            // return a random character from the alphabet
            return alphabet[rns.randomIndexSync(alphabet.length)];
        }else{
            throw new TypeError('invalid config.separator_character');
        }
    }
    
    /**
     * @param {Config} config - An HSXKPasswd password generation config.
     * @param {Dictionary} dictionary - The dictionary to use when generating passwords.
     * @param {RandomNumberSource} randomNumberSource - The source for the random numbers used to generate the passwords.
     */
    constructor(config, dictionary, randomNumberSource){
        this._config = config;
        this._dictionary = dictionary;
        this._randomNumberSource = randomNumberSource;
    }
    
    /**
     * @type {Config}
     */
    get config(){ return this._config; }
    
    /**
     * Generate passwords synchronously.
     *
     * @param {number} [n=1] - the number of passwords to generate.
     * @return {string[]}
     * @throws {TypeError} A Type Error is thrown on invalid args.
     * @throws {Error} An error is thrown if the generator's dictionary is not ready.
     */
    generatePasswordsSync(n=1){
        // make sure the dictionary is ready
        if(!this._dictionary.ready) throw new Error('dictionary not ready');
        
        // validate args
        if(!(is.integer(n) && n > 0)) throw new TypeError('if present, n must be an integer greater than zero');
        
        const ans = [];
        for(let i = 0; i < n; i++){
            ans.push('PASSWORD');
        }
        return ans;
    }
}

var index = {
    Config,
    Dictionary,
    Generator,
    RandomNumberSource
};

export default index;
