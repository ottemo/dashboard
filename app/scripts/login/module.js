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
                    $scope.it = $loginService;
                    $scope.login = function () {
                        $scope.$broadcast('autofill:update');
                        $loginService.login($scope.username, $scope.password);
                    };
                }])
                .controller('logoutController', ['$scope', '$loginService', function ($scope, $loginService) {
                    $loginService.logout();
                }])
                /*
                 *  $loginService implementation
                 */
                .service('$loginService', ['$cookieStore', '$location', function ($cookieStore, $location) {
                    return {
                        login: function (username, password) {
                            if (username === 'admin' && password === 'admin') {
                                $cookieStore.put('logUsername', username);
                            }
                        },
                        logout: function () {
                            $cookieStore.put('logUsername', '');
                            $location.path('/');
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

                .config(['$routeProvider', function ($routeProvider) {
                    $routeProvider
                        .when('/logout', {template: ' ', controller: 'logoutController' });
                }])
                /*
                 *  Login page redirect-or for not registered users
                 */
                .run(['$loginService', '$rootScope', '$designService', '$pageHeaderService', '$route',
                    function ($loginService, $rootScope, $designService, $pageHeaderService, $route) {
                        $rootScope.$on('$locationChangeStart', function () {
                            $pageHeaderService.addMenuRightItem('/logout', 'Log Out', 'logout');
                            $pageHeaderService.addMenuItem('/item_1', 'Item 1', '');
                            $pageHeaderService.addMenuItem('/item_1/sub_item_1', 'Sub Item 1/1', 'item_1/sub_item_1');
                            $pageHeaderService.addMenuItem('/item_1/sub_item_2', 'Sub Item 1/2', 'item_1/sub_item_2');
                            $pageHeaderService.addMenuItem('/item_2', 'Item 2', 'item_2');
                            $pageHeaderService.addMenuItem('/item_3', 'Item 3', '');
                            $pageHeaderService.addMenuItem('/item_3/sub_item_1', 'Sub Item 3/1', 'item_3/sub_item_1');
                            $pageHeaderService.addMenuItem('/item_3/sub_item_2', 'Sub Item 3/2', 'item_3/sub_item_2');
                            $pageHeaderService.addMenuItem('/item_1/sub_item_3/sub_item_1', 'Sub Item 4', 'item_4/sub_item_4');
                            if (!$loginService.isLogined()) {
                                $designService.setTopPage('login.html');
                            }
                        });
                    }]);
            return angular.module.loginModule;
        });
})(window.define);