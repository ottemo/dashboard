angular.module('configModule', [
    'ngRoute',
    'ngResource',
    'coreModule'
])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/settings/:group', {
            templateUrl: '/views/config/edit.html',
            controller: 'configEditController',
        });
}]);

