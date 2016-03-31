angular.module('reportingModule', ['ngRoute', 'ngResource', 'designModule'])

.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when("/reporting/product", {
            templateUrl: "/views/reporting/product.html",
            controller: "reportingProductController"
        });
}]);
