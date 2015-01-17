(function (define) {
    'use strict';

    define(['login/init'], function (loginModule) {
        loginModule.controller('loginLoginController', [
            '$scope',
            '$route',
            '$location',
            '$routeParams',
            '$loginApiService',
            '$loginLoginService',
            '$dashboardUtilsService',
            function ($scope, $route, $location, $routeParams, $loginApiService, $loginLoginService, $dashboardUtilsService) {

                $scope.loginCredentials = {};

                $scope.login = function () {
                    $loginApiService.loginPost($scope.loginCredentials).$promise.then(function (response) {
                        if (response.result === 'ok') {
                            window.location.assign("/");
                        } else {
                            $scope.message = $dashboardUtilsService.getMessage(response);
                        }
                    });
                };

                $scope.isLoggedIn = function () {
                    return $loginLoginService.isLoggedIn();
                };

            }
        ]);
        return loginModule;
    });
})(window.define);
