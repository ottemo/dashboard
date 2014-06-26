(function (define) {
    "use strict";

    define([
            "angular",
            "angular-route",
            "angular-cookies"
        ],
        function (angular) {
            /*
             *  Angular "loginModule" declaration
             */
            angular.module.loginModule = angular.module("loginModule", ["ngRoute", "ngCookies", "designModule"])

                /*
                 *  controller for login page
                 */
                .controller("loginController", ["$scope", "$loginService", function ($scope, $loginService) {
                    $scope.username = "";
                    $scope.password = "";
                    $scope.it = $loginService;
                    $scope.login = function () {
                        $scope.$broadcast("autofill:update");
                        $loginService.login($scope.username, $scope.password);
                    };
                }])
                .controller("logoutController", ["$scope", "$loginService", function ($scope, $loginService) {
                    $loginService.logout();
                }])
                /*
                 *  $loginService implementation
                 */
                .service("$loginService", ["$cookieStore", "$location", function ($cookieStore, $location) {
                    return {
                        login: function (username, password) {
                            if (username === "admin" && password === "admin") {
                                $cookieStore.put("logUsername", username);
                                window.location.assign("/");
                            }
                        },
                        logout: function () {
                            $cookieStore.put("logUsername", "");
                            $location.path("/");
                        },
                        isLogined: function () {
                            var val = $cookieStore.get("logUsername");
                            return val !== "undefined" && val !== "";
                        },
                        getUsername: function () {
                            return $cookieStore.get("logUsername");
                        }
                    };
                }])

                .config(["$routeProvider", function ($routeProvider) {
                    $routeProvider
                        .when("/logout", {template: " ", controller: "logoutController" });
                }])
                /*
                 *  Login page redirect-or for not registered users
                 */
                .run(["$loginService", "$rootScope", "$designService", "$pageHeaderService", "$route",
                    function ($loginService, $rootScope, $designService, $pageHeaderService) {
                        $rootScope.$on("$locationChangeStart", function () {
                            if (!$loginService.isLogined()) {
                                $designService.setTopPage("login.html");
                            }
                        });

                        // NAVIGATION
                        // Adds item in the right top-menu
                        $pageHeaderService.addMenuRightItem("/logout", "Log Out", "logout");
                    }]);
            return angular.module.loginModule;
        });
})(window.define);
