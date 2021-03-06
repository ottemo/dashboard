angular.module("dashboardModule")

.service("dashboardUtilsService", function() {

    /**
     * Extends String object
     *
     * @param {string} charlist
     * @returns {string}
     */
    String.prototype.trimLeft = function(charlist) {
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
    String.prototype.trimRight = function(charlist) {
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
    String.prototype.trim = function(charlist) {
        return this.trimLeft(charlist).trimRight(charlist);
    };

    var clone, getMessage, getMessageByCode, isJson;

    clone = function(obj) {
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

    isJson = function(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    };

    /**
     * Gets message text by code. If message by code not exist, returns default message from  error object
     *
     * @param {object} error - should contain code and default message for error
     * @returns {string}
     */
    getMessageByCode = function(error) {
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
    getMessage = function(response, type, message, timeout) {
        var messageObj, error;
        messageObj = {};
        error = {};

        if (response !== null && response.error !== null) {
            messageObj.type = "danger";
            if (typeof message === "undefined" || message === null) {
                error = response.error;
            } else {
                error = {
                    "code": message,
                    "message": message
                };
            }
        } else {
            messageObj.type = type;
            error = {
                "code": message,
                "message": message
            };
        }

        messageObj.message = getMessageByCode(error);
        messageObj.timeout = timeout || null;

        return messageObj;
    };

    /**
     * Returns a label of product option value
     * @param {Object} option
     * @returns {string}
     */
    function getOptionValueLabel(option) {
        if (option.type === 'field') {
            return option.value;

        } else if (option.type === 'multi_select') {
            return _.map(option.options, 'label').join(', ');

        } else {
            var childOptions = option.options;
            return childOptions[option.value].label;
        }
    }

    return {
        clone: clone,
        getMessage: getMessage,
        isJson: isJson,
        getOptionValueLabel: getOptionValueLabel
    };

});