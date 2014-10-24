(function (define) {
    "use strict";

    /*
     *  requireJS module entry point
     *  (to use that module you should include it to main.js)
     */
    define([
            "login/service/api",
            "login/service/login",

            "login/controller/login",
            "login/controller/logout"
        ],
        function (loginModule) {

            return loginModule;
        });

})(window.define);