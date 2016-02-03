angular.module("orderModule", [
    "ngRoute",
    "ngResource",
    "designModule",
    "cmsModule"
])

.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when("/orders", {
            templateUrl: "/themes/views/order/list.html",
            controller: "orderListController"
        })
        .when("/orders/:id", {
            templateUrl: "/themes/views/order/edit.html",
            controller: "orderEditController"
        })
        .when("/orders/print", {
            templateUrl: "/themes/views/order/print.html",
            controller: "orderPrintController"
        });
}]);
