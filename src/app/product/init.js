/**
 * Products Modules
 */
angular.module('productModule', ['ngRoute', 'ngResource', 'coreModule'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/products', {
            templateUrl: '/views/product/list.html',
            controller: 'productListController'
        })
        .when('/products/:id', {
            templateUrl: '/views/product/edit.html',
            controller: 'productEditController'
        })
        .when('/attributes', {
            templateUrl: '/views/product/attribute/list.html',
            controller: 'productAttributeListController'
        })
        .when('/attributes/:attr', {
            templateUrl: '/views/product/attribute/edit.html',
            controller: 'productAttributeEditController'
        });
}]);
