(function (define) {
    "use strict";

    /*
     *  requireJS module entry point
     *  (to use that module you should include it to main.js)
     */
    define([
            "visitor/service/api",
            "visitor/controller/visitorList",
            "visitor/controller/visitorEdit",
            "visitor/controller/addressList",
            "visitor/controller/addressEdit",
            "visitor/controller/attributeList",
            "visitor/controller/attributeEdit"
        ],
        function (visitorModule) {

            return visitorModule;
        });

})(window.define);