(function (define) {
    "use strict";

    /**
     *
     */
    define([
            "dashboard/init"
        ],
        function (dashboardModule) {

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

            dashboardModule.service("$dashboardUtilsService", function () {
                var clone;

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

                return {
                    "clone": clone
                };
            });

            return dashboardModule;
        });

})(window.define);