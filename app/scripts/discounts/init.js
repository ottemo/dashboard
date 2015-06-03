angular.module("discountsModule", ["ngRoute", "ngResource"])

/*
 *  Basic routing configuration
 */
.config([
"$routeProvider",
function ($routeProvider) {
    $routeProvider
    .when("/discounts", {
        templateUrl: "/themes/views/discounts/list.html",
        controller: "discountsListController"
    })
    .when("/discounts/new", {
        templateUrl: "/themes/views/discounts/edit.html",
        controller: "discountsEditController"
    })
    .when("/discounts/:id", {
        templateUrl: "/themes/views/discounts/edit.html",
        controller: "discountsEditController"
    });
}]);
