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
            function ($scope, $route, $location, $routeParams, $loginApiService, $loginLoginService) {

                $scope.loginCredentials = {};

                $scope.login = function () {
                    $loginApiService.loginPost($scope.loginCredentials).$promise.then(function (response) {
                        if (response.result === 'ok') {
                            window.location.assign("/");
                        } else {
                            $scope.message = {
                                "type": "warning",
                                "message": response.error
                            };
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
