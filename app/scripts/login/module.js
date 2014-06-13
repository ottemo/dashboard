(function (define) {
    'use strict';

    define([
            'angular',
            'angular-route',
            'angular-cookies'
        ],
        function (angular) {
            /*
             *  Angular 'loginModule' declaration
             */
            angular.module.loginModule = angular.module('loginModule', ['ngRoute', 'ngCookies', 'designModule'])

                /*
                 *  controller for login page
                 */
                .controller('loginController', ['$scope', '$loginService', function ($scope, $loginService) {
                    $scope.username = '';
                    $scope.password = '';
                    $scope.login = function () {
                        $scope.$broadcast('autofill:update');
                        $loginService.login($scope.username, $scope.password);
                    };

                    $scope.isLogined = function () {
                        return $loginService.isLogined();
                    };
                }])

                /*
                 *  $loginService implementation
                 */
                .service('$loginService', ['$cookieStore', function ($cookieStore) {
                    return {
                        login: function (username, password) {
                            if (username === 'admin' && password === 'admin') {
                                $cookieStore.put('logUsername', username);
                            }
                        },
                        logout: function () {
                            $cookieStore.put('logUsername', '');
                        },
                        isLogined: function () {
                            var val = $cookieStore.get('logUsername');
                            return val !== 'undefined' && val !== '';
                        },
                        getUsername: function () {
                            return $cookieStore.get('logUsername');
                        }
                    };
                }])

                /*
                 *  Login page redirect-or for not registered users
                 */
                .run(['$loginService', '$rootScope', '$designService', function ($loginService, $rootScope, $designService) {
                    $rootScope.$on('$locationChangeStart', function () {
                        if (!$loginService.isLogined()) {
                            $designService.setTopPage('login.html');
                        }
                    });
                }]);
            return angular.module.loginModule;
        });
})(window.define);