angular.module('reportsModule', [
    'ngRoute',
    'ngResource',
    'coreModule',
    'configModule',
])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/reports', {
            templateUrl: '/views/reports/view.html',
        })
        .when('/reports/product', {
            templateUrl: '/views/reports/product.html',
            controller: 'reportsProductController',
        })
        .when('/reports/customer-activity', {
            templateUrl: '/views/reports/customer-activity.html',
            controller: 'reportsCustomerActivityController',
        })
        .when('/reports/payment-method', {
            templateUrl: '/views/reports/payment-method.html',
            controller: 'reportsPaymentMethodController',
        })
        .when('/reports/shipping-method', {
            templateUrl: '/views/reports/shipping-method.html',
            controller: 'reportsShippingMethodController',
        })
        .when('/reports/location-country', {
            templateUrl: '/views/reports/location-country.html',
            controller: 'reportsLocationCountryController',
        })
        .when('/reports/location-us', {
            templateUrl: '/views/reports/location-us.html',
            controller: 'reportsLocationUSController',
        });
}]);

