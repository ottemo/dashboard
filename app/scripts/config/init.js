angular.module("configModule", ["ngRoute", "ngResource", "designModule"])

/**
 *  Basic routing configuration
 */

.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when("/settings/:group", {
            templateUrl: angular.getTheme("config/edit.html"),
            controller: "configEditController"
        });
}]);
