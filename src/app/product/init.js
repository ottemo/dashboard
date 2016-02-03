angular.module("productModule", ["ngRoute", "ngResource", "designModule"])

/**
*  Basic routing configuration
*/
.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when("/products", {
            templateUrl: "/views/product/list.html",
            controller: "productListController"
        })
        .when("/product/:id", {
            templateUrl: "/views/product/edit.html",
            controller: "productEditController"
        })
        .when("/attributes", {
            templateUrl: "/views/product/attribute/list.html",
            controller: "productAttributeListController"
        })
        .when("/attribute/:attr", {
            templateUrl: "/views/product/attribute/edit.html",
            controller: "productAttributeEditController"
        });
}]);
