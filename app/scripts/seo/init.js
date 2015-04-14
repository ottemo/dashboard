(function (define) {
    "use strict";

    /**
     *
     */
    define([
            "angular",
            "angular-route",
            "angular-resource"
        ],
        function (angular) {
            /**
             *
             */
            angular.module.seoModule = angular.module("seoModule", ["ngRoute", "ngResource"])
                .config(["$routeProvider", function ($routeProvider) {
                    $routeProvider
                        .when("/seo", {
                            templateUrl: angular.getTheme("seo/list.html"),
                            controller: "seoListController"
                        })
//                        .when("/order/:id", {
//                            templateUrl: angular.getTheme("order/edit.html"),
//                            controller: "orderEditController"
//                        });
                    }
                ])

                .run([
                    "$loginLoginService",
                    "$rootScope",
                    "$designService",
                    "$route",
                    "$dashboardSidebarService",
                    "$dashboardHeaderService",
                    function ($loginService, $rootScope, $designService, $route, $dashboardSidebarService, $dashboardHeaderService) {
                        $designService.setTopPage("seo/index.html");

                        // NAVIGATION
                        // Adds item in the left top-menu
                        $dashboardHeaderService.addMenuItem("/seo", "seo", "/seo");
                        // Adds item in the left sidebar
                        $dashboardSidebarService.addItem("/seo", "seo", "/seo", "fa fa-exchange", 6);
                    }
                ]);

            return angular.module.seoModule;
        });

})(window.define);
