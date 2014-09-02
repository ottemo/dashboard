(function (define) {
    "use strict";

    define([
            "angular",
            "angular-route",
            "angular-resource"
        ],
        function (angular) {
            /*
             *  Angular "cmsModule" declaration
             */
            angular.module.cmsModule = angular.module("cmsModule", ["ngRoute", "ngResource", "designModule"])

                /*
                 *  Basic routing configuration
                 */
                .config(["$routeProvider", function ($routeProvider) {
                    $routeProvider
                        .when("/cms/pages", { templateUrl: angular.getTheme("cms/pages.html") })
                        .when("/cms/blocks", { templateUrl: angular.getTheme("cms/blocks.html") });
                }])

                .run(["$designService", "$route", "$dashboardSidebarService", "$dashboardHeaderService",

                    function ($designService, $route, $dashboardSidebarService, $dashboardHeaderService) {

                        // NAVIGATION
                        // Adds item in the left top-menu
                        $dashboardHeaderService.addMenuItem("/cms", "Cms", null);
                        $dashboardHeaderService.addMenuItem("/cms/pages", "Pages", "/cms/pages");
                        $dashboardHeaderService.addMenuItem("/cms/blocks", "Blocks", "/cms/blocks");

                        // Adds item in the left sidebar
//                        $dashboardSidebarService.addItem("Cms manage", "cms", "glyphicon glyphicon-file", 60);
                    }
                ]);

            return angular.module.cmsModule;
        });

})(window.define);