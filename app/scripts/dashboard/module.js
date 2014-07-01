(function (define) {
    "use strict";

    /*
     *  requireJS module entry point
     *  (to use that module you should include it to main.js)
     */
    define([
            "dashboard/controllers",
            "dashboard/directives",

            "dashboard/services/page",
            "dashboard/services/header",
            "dashboard/services/sidebar"
        ],
        function (dashboardModule) {

            return dashboardModule;
        });

})(window.define);
