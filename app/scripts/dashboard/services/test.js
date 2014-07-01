(function (define) {
    "use strict";

    /*
     *  HTML top page test service stub
     */
    define(["dashboard/init"], function (dashboardModule) {

        dashboardModule
            .service("$testService", ["location", function ($location) {
                return {
                    tst: function () {
                        console.log("I am on: " + $location.path());
                    }
                };
            }]);
        return dashboardModule;
    });
})(window.define);
