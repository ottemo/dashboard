angular.module("subscriptionsModule", [
    "ngRoute",
    "ngResource",
    "designModule",
])

.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when("/subscriptions", {
            templateUrl: "/themes/views/subscriptions/list.html",
            controller: "subscriptionsListController"
        })
        .when("/subscriptions/:id", {
            templateUrl: "/themes/views/subscriptions/edit.html",
            controller: "subscriptionsEditController"
        });
}]);
