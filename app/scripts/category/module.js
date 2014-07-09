(function (define) {
    "use strict";

    /*
     *  requireJS module entry point
     *  (to use that module you should include it to main.js)
     */
    define([
            "category/service/api",
            "category/controller"
        ],
        function (categoryModule) {

            return categoryModule;
        });

})(window.define);