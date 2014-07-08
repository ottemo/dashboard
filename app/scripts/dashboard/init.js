(function (define) {
    "use strict";

    /*
     *  Angular "dashboardModule" declaration
     *  (module internal files refers to this instance)
     */
    define([
            "angular",
            "angular-route"

            // "login/module"
        ],
        function (angular) {
            /*
             *  Angular "dashboardModule" declaration
             */
            angular.module.dashboardModule = angular.module("dashboardModule", ["ngRoute", "loginModule", "designModule"])

                .constant('REST_SERVER_URI', 'http://localhost:3000')

                /*
                 *  Basic routing configuration
                 */
                .config(["$routeProvider", function ($routeProvider) {
                    $routeProvider
                        .when("/", { templateUrl: "views/dashboard/welcome.html" })
                        .when("/help", { templateUrl: "views/help.html"})

                        .otherwise({ redirectTo: "/"});
                }])

                .run(["$designService", "$route", function ($designService, $route) {
                    // hack to allow browser page refresh work with routes
                    $route.reload();
                }]);

            return angular.module.dashboardModule;
        });

})(window.define);
