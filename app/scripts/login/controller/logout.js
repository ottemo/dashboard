(function (define) {
    "use strict";

    define(["login/init"], function (loginModule) {
        loginModule.controller("loginLogoutController", [
            "$scope",
            "$loginLoginService",
            "$location",
            function ($scope, $loginLoginService, $location) {

                if ($loginLoginService.isLoggedIn()) {

                    $loginLoginService.logout().then(
                        function () {
                            $location.path("/");
                        }
                    );

                } else {
                    $location.path("/");
                }

            }
        ]);
        return loginModule;
    });
})(window.define);