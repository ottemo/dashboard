(function (define) {
    "use strict";

    define([
            "angular",
            "angular-route",
            "angular-resource"
        ],
        function (angular) {
            /*
             *  Angular "visitorModule" declaration
             */
            angular.module.visitorModule = angular.module("visitorModule", ["ngRoute", "ngResource", "designModule"])

                /*
                 *  Basic routing configuration
                 */
                .config(["$routeProvider", function ($routeProvider) {
                    $routeProvider
                        .when("/visitor", { templateUrl: angular.getTheme("visitor/edit.html") })
                        .when("/visitor/address/:id", { templateUrl: angular.getTheme("visitor/address/edit.html"), controller: "visitorAddressController"});
                }])

                .run(["$designService", "$route", "$dashboardSidebarService", "$dashboardHeaderService",

                    function ($designService, $route, $dashboardSidebarService, $dashboardHeaderService) {

                        // NAVIGATION
                        // Adds item in the left top-menu
                        $dashboardHeaderService.addMenuItem("/visitor", "Visitor", "/visitor");

                        // Adds item in the left sidebar
                        $dashboardSidebarService.addItem("Customers", "visitor", "fa fa-users", 10);
                    }
                ]);

            return angular.module.visitorModule;
        });

})(window.define);