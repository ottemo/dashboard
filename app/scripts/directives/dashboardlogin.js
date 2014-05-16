define(['angular'], function (angular) {
    'use strict';

    angular.module('dashboardApp.directives.DashboardLogin', [])
        .directive('dashboardLogin', function () {
            return {
                templateUrl: 'views/login/login.html',
                restrict: 'E',
                controller :  function ($scope, $location, $cookieStore) {
                    $scope.credentials = {
                        username: "",
                        password: ""
                    };
                    $scope.logUsername = $cookieStore.get('logUsername');
                        if ($scope.logUsername) {
                            $location.path('/dashboard/visitor');
                        }
                    $scope.login = function (){
                        if($scope.credentials.username === 'admin' && $scope.credentials.password === 'qwer1234') {

                            $cookieStore.put('logUsername', $scope.credentials.username );
                            $location.path('/dashboard/visitor');
                        }
                    };

                }
            };
        });
});
