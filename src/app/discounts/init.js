/**
 * Discounts Module
 */
angular.module('discountsModule', ['ngRoute', 'coreModule'])

.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/discounts', {
                templateUrl: '/views/discounts/discounts/list.html',
                controller: 'discountsListController'
            })
            .when('/discounts/new', {
                templateUrl: '/views/discounts/discounts/edit.html',
                controller: 'discountsEditController'
            })
            .when('/discounts/:id', {
                templateUrl: '/views/discounts/discounts/edit.html',
                controller: 'discountsEditController'
            })
            .when('/giftcards', {
                templateUrl: '/views/discounts/giftcards/list.html',
                controller: 'giftcardsListController'
            })
            .when('/giftcards/new', {
                templateUrl: '/views/discounts/giftcards/edit.html',
                controller: 'giftcardsEditController'
            })
            .when('/giftcards/:id', {
                templateUrl: '/views/discounts/giftcards/edit.html',
                controller: 'giftcardsEditController'
            });
    }
]);

