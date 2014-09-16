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
                        .when("/visitors", {
                            templateUrl: angular.getTheme("visitor/list.html"),
                            controller: "visitorListController"
                        })
                        .when("/visitor/:id", {
                            templateUrl: angular.getTheme("visitor/edit.html"),
                            controller: "visitorEditController"
                        })
                        .when("/visitor/:visitorId/addresses", {
                            templateUrl: angular.getTheme("visitor/address/list.html"),
                            controller: "visitorAddressListController"
                        })
                        .when("/visitor/:visitorId/address/:id", {
                            templateUrl: angular.getTheme("visitor/address/edit.html"),
                            controller: "visitorAddressEditController"
                        });
                }])

                .run(["$designService", "$route", "$dashboardSidebarService", "$dashboardHeaderService",

                    function ($designService, $route, $dashboardSidebarService, $dashboardHeaderService) {

                        // NAVIGATION
                        // Adds item in the left top-menu
//                        $dashboardHeaderService.addMenuItem("/visitor", "Visitor", "/visitor");

                        // Adds item in the left sidebar
                        $dashboardSidebarService.addItem("/visitors", "Customers", "visitors", "fa fa-users", 10);
                    }
                ]);

            return angular.module.visitorModule;
        });

})(window.define);