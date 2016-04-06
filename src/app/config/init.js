/**
 * Config Module
 */
angular.module("configModule", ["ngRoute", "ngResource", "coreModule"])

.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when("/settings/:group", {
            templateUrl: "/views/config/edit.html",
            controller: "configEditController"
        });
}])

.run(['timezoneService', function (timezoneService) {
    timezoneService.init();
}]);