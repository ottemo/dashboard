angular.module("loginModule")

.controller('loginLoginController', [
'$scope',
'$route',
'$location',
'$routeParams',
'loginApiService',
'loginLoginService',
'dashboardUtilsService',
function ($scope, $route, $location, $routeParams, loginApiService, loginLoginService, dashboardUtilsService) {

    $scope.loginCredentials = {};

    $scope.login = function () {
        loginApiService.login($scope.loginCredentials).$promise.then(function (response) {
            if (response.result === 'ok') {
                console.log(response)
                document.cookie = 'OTTEMOSESSION=' + response.session
                window.location.assign('/')
            } else {
                $scope.message = dashboardUtilsService.getMessage(response);
            }
        });
    };

    $scope.isLoggedIn = function () {
        return loginLoginService.isLoggedIn();
    };

}]);
