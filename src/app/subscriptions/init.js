angular.module("subscriptionsModule", [
    "ngRoute",
    "ngResource",
    "coreModule",
])

.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when("/subscriptions", {
            templateUrl: "/views/subscriptions/list.html",
            controller: "subscriptionsListController"
        })
        .when("/subscriptions/:id", {
            templateUrl: "/views/subscriptions/edit.html",
            controller: "subscriptionsEditController"
        });
}]);
