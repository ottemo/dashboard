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
            angular.module.impexModule = angular.module("impexModule", ["ngRoute", "ngResource"])

                /*
                 *  Basic routing configuration
                 */
                .config(["$routeProvider", function ($routeProvider) {
                    $routeProvider
                        .when("/impex", {
                            templateUrl: angular.getTheme("impex/main.html"),
                            controller: "impexController"
                        });
                }])

                .run(["$designService", "$route", "$dashboardSidebarService", "$dashboardHeaderService",

                    function ($designService, $route, $dashboardSidebarService, $dashboardHeaderService) {

                        // NAVIGATION
                        // Adds item in the left top-menu
                        $dashboardHeaderService.addMenuItem("/impex", "Import / Export", "/impex");

                        // Adds item in the left sidebar
                        $dashboardSidebarService.addItem("/impex", "Import / Export", "/impex", "fa fa-exchange", 3);
                    }
                ]);

            return angular.module.impexModule;
        });

})(window.define);