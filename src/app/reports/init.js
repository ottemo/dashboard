angular.module('reportsModule', [
    'ngRoute',
    'ngResource',
    'designModule'
])

.config(["$routeProvider", function($routeProvider) {
    $routeProvider
        .when("/reports/product", {
            templateUrl: "/views/reports/product.html",
            controller: "reportsProductController"
        });
}]);

