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

                .constant("REST_SERVER_URI", "http://dev.ottemo.io:3000") 

                /*
                 *  Basic routing configuration
                 */
                .config(["$routeProvider", function ($routeProvider) {
                    $routeProvider
                        .when("/", { templateUrl: angular.getTheme("dashboard/welcome.html") })
                        .when("/help", { templateUrl: angular.getTheme("help.html")})

                        .otherwise({ redirectTo: "/"});
                }])

                .run(["$designService", "$route", "$dashboardSidebarService",
                    function ($designService, $route, $dashboardSidebarService) {
                    // hack to allow browser page refresh work with routes

                    $dashboardSidebarService.addItem("Dashboard", "", "fa fa-home", 100);

                    $route.reload();
                }]);

            return angular.module.dashboardModule;
        });

})(window.define);
