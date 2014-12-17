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
                return {};
            });

            return dashboardModule;
        });

})(window.define);