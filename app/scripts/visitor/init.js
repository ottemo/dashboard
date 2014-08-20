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
                        .when("/visitor", { templateUrl: "views/visitor/edit.html" })
                        .when("/visitor/address/:id", { templateUrl: "views/visitor/address/edit.html", controller: "visitorAddressController"});
                }])

                .run(["$designService", "$route", "$dashboardSidebarService", "$dashboardHeaderService",

                    function ($designService, $route, $dashboardSidebarService, $dashboardHeaderService) {

                        // NAVIGATION
                        // Adds item in the left top-menu
                        $dashboardHeaderService.addMenuItem("/visitor", "Visitor", "/visitor");

                        // Adds item in the left sidebar
                        $dashboardSidebarService.addItem("Visitor manage", "visitor", "glyphicon glyphicon-user", 90);
                    }
                ]);

            return angular.module.visitorModule;
        });

})(window.define);