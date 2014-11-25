(function (define) {
    "use strict";

    /*
     *  Angular "dashboardModule" declaration
     *  (module internal files refers to this instance)
     */
    define([
            "angular",
            "angular-route",
            "angular-sanitize"

            // "login/module"
        ],
        function (angular) {
            /*
             *  Angular "dashboardModule" declaration
             */
            angular.module.dashboardModule = angular.module("dashboardModule", ["ngRoute", "loginModule", "ngSanitize", "designModule"])

                .constant("REST_SERVER_URI", angular.appConfigValue("general.app.foundation_url"))
                .constant("COUNT_ITEMS_PER_PAGE", angular.appConfigValue("general.app.item_per_page"))

                /*
                 *  Basic routing configuration
                 */
                .config(["$routeProvider", function ($routeProvider) {
                    $routeProvider
                        .when("/", {
                            templateUrl: angular.getTheme("dashboard/welcome.html") ,
                            controller: "dashboardController"
                        })
                        .when("/help", { templateUrl: angular.getTheme("help.html")})

                        .otherwise({ redirectTo: "/"});
                }])

                .run([
                    "$rootScope",
                    "$route",
                    "$http",
                    "$designService",
                    "$dashboardSidebarService",
                    "$dashboardListService",
                    function ($rootScope, $route,  $http, $designService, $dashboardSidebarService, DashboardListService) {
                        // ajax cookies support fix
                        $http.defaults.withCredentials = true;
                        delete $http.defaults.headers.common["X-Requested-With"];

                        $dashboardSidebarService.addItem("/dashboard", "Dashboard", "", "fa fa-home", 100);

                        $rootScope.$list = new DashboardListService();

                        $route.reload();
                    }
                ]);

            return angular.module.dashboardModule;
        });

})(window.define);
