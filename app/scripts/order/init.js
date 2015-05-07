angular.module("orderModule", ["ngRoute", "ngResource", "designModule"])

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

.run(["$designService", "$route", "$dashboardSidebarService",

    function ($designService, $route, $dashboardSidebarService) {

        // NAVIGATION
       
        // Adds item in the left sidebar
        $dashboardSidebarService.addItem("/order", "Orders", "/orders", "fa fa-list-alt", 5);
    }
]);

