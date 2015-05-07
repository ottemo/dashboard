angular.module("impexModule", ["ngRoute", "ngResource"])

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

.run(["$designService", "$route", "$dashboardSidebarService",

    function ($designService, $route, $dashboardSidebarService) {

        // NAVIGATION

        // Adds item in the left sidebar
        $dashboardSidebarService.addItem("/impex", "Import / Export", "/impex", "fa fa-exchange", 3);
    }
]);