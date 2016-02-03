angular.module("impexModule", ["ngRoute", "ngResource"])

/*
 *  Basic routing configuration
 */
.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when("/impex", {
            templateUrl: "/views/impex/main.html",
            controller: "impexController"
        });
}]);
