
/**
* Extends String object
*
* @param {string} charlist
* @returns {string}
*/
String.prototype.trimLeft = function (charlist) {
    if (typeof charlist === "undefined") {
        charlist = "\\s";
    }

    return this.replace(new RegExp("^[" + charlist + "]+"), "");
};

/**
* Extends String object
*
* @param {string} charlist
* @returns {string}
*/
String.prototype.trimRight = function (charlist) {
    if (typeof charlist === "undefined") {
        charlist = "\\s";
    }

    return this.replace(new RegExp("[" + charlist + "]+$"), "");
};

/**
* Extends String object
*
* @param {string} charlist
* @returns {string}
*/
String.prototype.trim = function (charlist) {
    return this.trimLeft(charlist).trimRight(charlist);
};

angular.module("dashboardModule")

.service("$dashboardUtilsService", function () {
var clone, getMessage, getMessageByCode, isJson, sortObjectsArrayByField;

clone = function (obj) {
if (null === obj || "object" !== typeof obj) {
    return obj;
}
var copy = obj.constructor();
for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) {
        copy[attr] = obj[attr];
    }
}
return copy;
};

isJson = function (str) {
try {
    JSON.parse(str);
} catch (e) {
    return false;
}
return true;
};

/**
* Sorts objects array by the field. By default sorting ascending a strings
*
* @param {object} array - [Object_1, Object_2...Object_N]
* @param {string} field - Field from object
* @param {string} type - Field type
* @param {string} order - Ыort order
* @returns {array}
*/
sortObjectsArrayByField = function (array, field, type, order) {

/**
 * Converts the value of the type
 *
 * @param {*} val
 * @param {string} type
 * @returns {*}
 */
var getInType = function (val, type) {
    var integerTypes = ['int', 'integer', 'numeric', 'number'];
    var floatTypes = ['float', 'real'];
    var result = val.toString();

    if (integerTypes.indexOf(type) >= 0) {
        result = parseInt(val, 10);
    } else if (floatTypes.indexOf(type) >= 0) {
        result = parseFloat(val);
    }

    return result;
};


return array.sort(function (a, b) {
    if (getInType(a[field], type) < getInType(b[field], type)) {
        return order === "ASC" ? -1 : 1;
    }
    if (getInType(a[field], type) > getInType(b[field], type)) {
        return order === "ASC" ? 1 : -1;
    }

    return 0;
});
};


/**
* Gets message text by code. If message by code not exist, returns default message from  error object
*
* @param {object} error - should contain code and default message for error
* @returns {string}
*/
getMessageByCode = function (error) {
    var msgList = {};

    return typeof msgList[error.code] !== "undefined" ? msgList[error.code].toString() : error.message;
};

/**
*
* @param {object} response
* @param {string} type
* @param {string} message
* @param {int} timeout
*/
getMessage = function (response, type, message, timeout) {
    var messageObj, error;
    messageObj = {};
    error = {};

    if (response !== null && response.error !== null) {
        messageObj.type = "danger";
        if (typeof message === "undefined" || message === null) {
            error = response.error;
        } else {
            error = {"code": message, "message": message};
        }
    } else {
        messageObj.type = type;
        error = {"code": message, "message": message};
    }

    messageObj.message = getMessageByCode(error);
    messageObj.timeout = timeout || null;

    return messageObj;
};

    return {
    "clone": clone,
    "getMessage": getMessage,
    "isJson": isJson,
    "sortObjectsArrayByField": sortObjectsArrayByField
    };

});
