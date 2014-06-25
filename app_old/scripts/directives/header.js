(function (define) {
    'use strict';

    define(['angular'], function (angular) {
        angular.module('dashboardApp.directives.DashboardHeader', [])
            .directive('dashboardHeader', function () {
                return {
                    templateUrl: 'views/header/header.html',
                    controller: function ($scope, $location, $cookieStore, $timeout) {
                        var timeout = 15 * 60 * 1000;
                        $scope.logUsername = $cookieStore.get('logUsername');
                        if (!$scope.logUsername) {
                            $location.path('/dashboard/login');
                        }
                        $timeout(function () {
                            $cookieStore.remove('logUsername');
                        }, timeout);

                        $scope.loggedOut = function () {
                            $cookieStore.remove('logUsername');
                            $location.path('/dashboard/login');
                        };
                    },
                    restrict: 'E'
                };
            });
    });
})(window.define);