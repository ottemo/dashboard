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
            angular.module.configModule = angular.module("configModule", ["ngRoute", "ngResource", "designModule"])

            /**
             *  Basic routing configuration
             */
                .config(["$routeProvider", function ($routeProvider) {
                    $routeProvider
                        .when("/config", { templateUrl: angular.getTheme("config/edit.html") });
                }])

                .run([
                    "$designService",
                    "$route",
                    "$dashboardSidebarService",
                    function ($designService, $route, $dashboardSidebarService) {

                        // Adds item in the left sidebar
                        $dashboardSidebarService.addItem("/settings", "Settings", null, "fa fa-cogs", 2);
                        $dashboardSidebarService.addItem("/settings/sipping", "Sipping", null, "", 2);
                        $dashboardSidebarService.addItem("/settings/payment", "Payment", null, "", 3);
                        $dashboardSidebarService.addItem("/settings/themes", "Themes", null, "", 1);
                    }
                ]);

            return angular.module.configModule;
        });

})(window.define);