(function () {
    'use strict';

    // TODO find a better place
    document.addEventListener('deviceready', function () {
        if (window.plugins && window.plugins.insomnia) {
            // Keeps the screen on for cordova apps
            window.plugins.insomnia.keepAwake();
        }
    });

    var utils = {};

    /**
    * Extracts data from the response.
    *
    * @param {object} response - An ajax response object
    * @returns {object/string} - Returns a string.
    */
    utils.extractResponseData = function (response) {
        response = response || {};

        if (response.responseJSON && response.responseJSON !== '') {
            response = response.responseJSON;
        } else if (response.responseText && response.responseText !== '') {
            response = response.responseText;
        }
        return utils.getString(response);
    };

    /**
    * Calls the callback for each entry in an array / keys of an object
    *
    * @param {object} obj - The object/array to iterate through
    * @param callback(index, obj[index])
    */
    utils.forEach = function (obj, callback) {
        var key;

        if (utils.isArray(obj)) {
            for (key = 0; key < obj.length; key += 1) {
                callback(key, obj[key]);
            }
        } else if (utils.isObject(obj)) {
            for (key in obj) {
            /* eslint-disable-next-line no-prototype-builtins */
                if (obj.hasOwnProperty(key)) {
                    callback(key, obj[key]);
                }
            }
        }
    };

    /**
    * Gets the value for a cookie with name.
    * Modified from: https://www.w3schools.com/js/js_cookies.asp
    *
    * @param {string} name - The name of the cookie.
    * @returns {string} - The string stored in the cookie, else null.
    */
    utils.getCookie = function (name) {
        name += '=';
        var cookies = document.cookie.split(';');
        var cookie;
        for (var i = 0; i < cookies.length; i++) {
            cookie = cookies[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(name) === 0) {
                return cookie.substring(name.length, cookie.length);
            }
        }
        return null;
    };

    /**
    *
    * @param {int} input - milliSeconds since epoch
    * @returns {string} - Returns a formatted data string in the user's timezone.
    */
    utils.getLocalDateString = function (millisSinceEpoch) {
        var date = new Date(millisSinceEpoch);
        try {
            date = date.toLocaleString('en-us', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        } catch (err) {
            date = date.toString();
        }
        return date;
    };

    /**
    *
    * @param {*} input - Can be anything
    * @returns {string} - Returns a string which is either only stringified once,
    *                     or just a plain string, or an empty string if it fails
    *                     to parse/stringify/toString.
    */
    utils.getString = function (input) {
        // Handle initial non-strings
        if (!utils.isString(input)) {
            try {
                // return if we can successfully stringify
                return JSON.stringify(input);
            } catch (e) {
                // If we can't stringify, we can try toString
                try {
                    // return if we can successfully stringify
                    return input.toString();
                } catch (e) {
                    // We can't get a string at all
                    return 'Utils could not getString.';
                }
            }
        }

        // Unpack str to minimally stringified
        var temp = input;
        // Loop to ensure the string is completely unpacked.
        // Limit loop to 4 to protect against anything that could cause an endless loop.
        // If something needs more parsing than 4 loops we need to deal with that at the source
        for (var i = 4; i > 0; i--) {
            try {
                // attempt to unpack string
                temp = JSON.parse(temp);
                // If the result is an object, we're at the minimally stringified
                if (utils.isObject(temp)) {
                    return JSON.stringify(temp);
                }
                // Otherwise, try to unpack again
            } catch (e) {
                // If we failed to unpack then we just have a normal string
                return temp;
            }
        }
    };

    /**
    * Returns true if val is an Array.
    * @param {*} val
    * @returns {boolean} - true if val is an Array
    */
    utils.isArray = function (val) {
        return Object.prototype.toString.call(val) === '[object Array]';
    };

    /**
    * Returns true if val is an Object.
    * @param {*} val
    * @returns {boolean} - true if val is an Object
    */
    utils.isObject = function (val) {
        return Object.prototype.toString.call(val) === '[object Object]';
    };

    /**
    * Returns true if val is a string.
    * @param {*} val
    * @returns {boolean} - true if val is a string
    */
    utils.isString = function (val) {
        return Object.prototype.toString.call(val) === '[object String]';
    };

    /**
    * Logs an error to sentry
    *
    * @param {*} error
    */
    utils.logToSentry = function (error) {
        if (!error || !error.stack) {
            error = new Error(utils.getString(error));
        }

        window.Sentry.captureException(error);
    };

    /**
    * Recursively merges two objects.
    *
    * @param {Object} obj1 - Acts as the base object. It may have non-unique properties overwritten.
    * @param {Object} obj2 - Object whose properties will be added to obj1.
    * @param {boolean} untouched - If true, don't modify obj1.
    * @returns {Object} obj1 with all of obj2 properties.
    */
    utils.merge = function (obj1, obj2, untouched) {
        obj1 = obj1 || {};

        var result;

        if (untouched) {
            result = JSON.parse(JSON.stringify(obj1));
        } else {
            result = obj1;
        }

        // Apply obj2 properties
        utils.forEach(obj2, function (key, val) {
            if (utils.isObject(val) && utils.isObject(result[key])) {
                // merge the sub object
                result[key] = utils.merge(result[key], val);
            } else {
                result[key] = JSON.parse(JSON.stringify(val));
            }
        });

        return result;
    };

    /**
    * Sets the value for a cookie.
    * Will override any cookie with the same name.
    * Modified from: https://www.w3schools.com/js/js_cookies.asp
    *
    * @param {string} name - The name of the cookie.
    * @param {string} value - The value for the cookie.
    * @param {Date} expiryDate - (optional) The Date the cookie should expire.
    */
    utils.setCookie = function (name, value, expiryDate) {
        if (expiryDate) {
            var expires = 'expires=' + expiryDate.toUTCString() + ';';
        }
        document.cookie = name + '=' + value + ';' + expires + 'path=/';
    };

    /**
    * Used as a barrier to synchronize multiple asynchronous "threads".
    *
    * @param {number} syncCalls - The number of calls to "barrier" before we can proceed.
    * @param {function(errs)} callback - Called after "barrier" has been called
    * syncCalls number of times. "errs" will contain an array of errors reported
    * by the "barrier" calls.
    * @returns {function(err)} barrier - Should be called by each asynchronous "thread".
    */
    utils.syncBarrier = function (syncCalls, callback) {
        if (syncCalls <= 0) {
            return callback();
        }
        var errors = [];
        return function (err) {
            if (err !== undefined && err !== null) {
                errors.push(err);
            }
            syncCalls -= 1;
            if (syncCalls === 0 && callback) {
                errors = errors.length ? errors : undefined; // If no errors returned undefined rather than empty string.
                callback(errors);
            }
        };
    };

    window.mktv = window.mktv || {};
    window.mktv.utils = utils;
}());
