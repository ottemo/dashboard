angular.module("impexModule", ["ngRoute", "ngResource", "coreModule"])

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
