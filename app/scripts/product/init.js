angular.module("productModule", ["ngRoute", "ngResource", "designModule"])

/**
*  Basic routing configuration
*/
.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when("/products", {
            templateUrl: "/themes/views/product/list.html",
            controller: "productListController"
        })
        .when("/product/:id", {
            templateUrl: "/themes/views/product/edit.html",
            controller: "productEditController"
        })
        .when("/attributes", {
            templateUrl: "/themes/views/product/attribute/list.html",
            controller: "productAttributeListController"
        })
        .when("/attribute/:attr", {
            templateUrl: "/themes/views/product/attribute/edit.html",
            controller: "productAttributeEditController"
        });
}]);
