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
}]);
