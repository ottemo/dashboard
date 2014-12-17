(function (define) {
    "use strict";

    /*
     *  requireJS module entry point
     *  (to use that module you should include it to main.js)
     */
    define([
            "dashboard/controllers",

            "dashboard/service/api",
            "dashboard/service/header",
            "dashboard/service/sidebar",
            "dashboard/service/statistic",
            "dashboard/service/utils",
            "dashboard/service/list"
        ],
        function (dashboardModule) {

            return dashboardModule;
        });

})(window.define);