angular.module("orderModule", [
    "ngRoute",
    "ngResource",
    "coreModule",
    "cmsModule"
])

.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when("/orders", {
            templateUrl: "/views/order/list.html",
            controller: "orderListController"
        })
        .when("/orders/print", {
            templateUrl: "/views/order/print.html",
            controller: "orderPrintController"
        })
        .when("/orders/:id", {
            templateUrl: "/views/order/edit.html",
            controller: "orderEditController"
        });
}]);
