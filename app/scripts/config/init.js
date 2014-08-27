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
                        $dashboardSidebarService.addItem("Config managment", "config", "glyphicon glyphicon-cog", 20);
                    }
                ]);

            return angular.module.configModule;
        });

})(window.define);