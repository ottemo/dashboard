angular.module("stripeSubscriptionsModule", [
    "ngRoute",
    "ngResource",
    "coreModule",
])

.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when("/stripesubscriptions", {
            templateUrl: "/views/stripesubscriptions/list.html",
            controller: "stripeSubscriptionsListController"
        })
        .when("/stripesubscriptions/:id", {
            templateUrl: "/views/stripesubscriptions/edit.html",
            controller: "stripeSubscriptionsEditController"
        });
}]);
