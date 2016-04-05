angular.module("loginModule")

.controller("loginLogoutController", [
"$scope",
"loginLoginService",
"$location",
function ($scope, loginLoginService, $location) {

    if (loginLoginService.isLoggedIn()) {
        loginLoginService.logout().then(
            function () {
                $location.path("/login");
            }
        );

    } else {
        $location.path("/");
    }

}]);