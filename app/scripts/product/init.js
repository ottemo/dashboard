angular.module("productModule", ["ngRoute", "ngResource", "designModule"])

/**
*  Basic routing configuration
*/
.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when("/products", {
            templateUrl: angular.getTheme("product/list.html"),
            controller: "productListController"
        })
        .when("/product/:id", {
            templateUrl: angular.getTheme("product/edit.html"),
            controller: "productEditController"
        })
        .when("/attributes", {
            templateUrl: angular.getTheme("product/attribute/list.html"),
            controller: "productAttributeListController"
        })
        .when("/attribute/:attr", {
            templateUrl: angular.getTheme("product/attribute/edit.html"),
            controller: "productAttributeEditController"
        });
}]);
