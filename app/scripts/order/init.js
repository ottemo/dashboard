(function (define) {
    "use strict";

    define([
            "angular",
            "angular-route",
            "angular-resource"
        ],
        function (angular) {
            /**
             *  Angular "orderModule" declaration
             */
            angular.module.orderModule = angular.module("orderModule", ["ngRoute", "ngResource", "designModule"])

                /**
                 *  Basic routing configuration
                 */
                .config(["$routeProvider", function ($routeProvider) {
                    $routeProvider
                        .when("/orders", {
                            templateUrl: angular.getTheme("order/list.html"),
                            controller: "orderListController"
                        })
                        .when("/order/:id", {
                            templateUrl: angular.getTheme("order/edit.html"),
                            controller: "orderEditController"
                        });
                }])

                .run(["$designService", "$route", "$dashboardSidebarService", "$dashboardHeaderService",

                    function ($designService, $route, $dashboardSidebarService, $dashboardHeaderService) {

                        // NAVIGATION
                        // Adds item in the left top-menu
                        $dashboardHeaderService.addMenuItem("/order", "Orders", "/orders");

                        // Adds item in the left sidebar
                        $dashboardSidebarService.addItem("/order", "Orders", "/orders", "fa fa-gavel", 5);
                    }
                ]);

            return angular.module.orderModule;
        });

})(window.define);