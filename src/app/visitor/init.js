/**
 *  Visitor Module
 */
angular.module('visitorModule', [
    'ngRoute',
    'ngResource',
    'coreModule'
])

.config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider
            .when('/visitors', {
                templateUrl: '/views/visitor/list.html',
                controller: 'visitorListController'
            })
            .when('/visitors/:id', {
                templateUrl: '/views/visitor/edit.html',
                controller: 'visitorEditController'
            })
            .when('/visitors/:visitorId/addresses', {
                templateUrl: '/views/visitor/address/list.html',
                controller: 'visitorAddressListController'
            })
            .when('/visitors/:visitorId/address/:id', {
                templateUrl: '/views/visitor/address/edit.html',
                controller: 'visitorAddressEditController'
            })
            .when('/v/attributes', {
                templateUrl: '/views/visitor/attribute/list.html',
                controller: 'visitorAttributeListController'
            })
            .when('/v/attributes/:attr', {
                templateUrl: '/views/visitor/attribute/edit.html',
                controller: 'visitorAttributeEditController'
            })
            .when('/emails', {
                templateUrl: '/views/visitor/email.html',
                controller: 'visitorEmailController'
            });
    }]
);
