angular.module("configModule", ["ngRoute", "ngResource", "designModule"])

/**
 *  Basic routing configuration
 */

.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when("/settings/:group", {
            templateUrl: "/themes/views/config/edit.html",
            controller: "configEditController"
        });
}]);
