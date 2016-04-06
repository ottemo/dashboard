/**
 * Discounts Module
 */
angular.module('discountsModule', ['ngRoute', 'coreModule'])

.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/discounts', {
                templateUrl: '/views/discounts/list.html',
                controller: 'listController'
            })
            .when('/discounts/new', {
                templateUrl: '/views/discounts/edit.html',
                controller: 'editController'
            })
            .when('/discounts/:id', {
                templateUrl: '/views/discounts/edit.html',
                controller: 'editController'
            });
    }
]);

