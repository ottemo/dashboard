angular.module("categoryModule", ["ngRoute", "ngResource", "coreModule"])

/*
 *  Basic routing configuration
 */
.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when("/categories", {
            templateUrl: "/views/category/list.html",
            controller: "categoryListController"
        })
        .when("/categories/:id", {
            templateUrl: "/views/category/edit.html",
            controller: "categoryEditController"
        });
}]);
