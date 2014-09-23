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
                        })
                        .when("/v/attributes", {
                            templateUrl: angular.getTheme("visitor/attribute/list.html"),
                            controller: "visitorAttributeListController"
                        })
                        .when("/v/attribute/:attr", {
                            templateUrl: angular.getTheme("visitor/attribute/edit.html"),
                            controller: "visitorAttributeEditController"
                        });
                }])

                .run(["$designService", "$route", "$dashboardSidebarService", "$dashboardHeaderService",

                    function ($designService, $route, $dashboardSidebarService) {

                        // Adds item in the left sidebar
                        $dashboardSidebarService.addItem("/visitors", "Visitors", null, "fa fa-users", 10);
                        $dashboardSidebarService.addItem("/visitors/list", "Visitors", "visitors", "", 3);
                        $dashboardSidebarService.addItem("/visitors/attributes", "Attributes", "/v/attributes", "", 2);
                        $dashboardSidebarService.addItem("/visitors/email", "Email", "/v/email", "", 1);
                    }
                ]);

            return angular.module.visitorModule;
        });

})(window.define);