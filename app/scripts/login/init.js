angular.module("loginModule", ["ngRoute", "ngResource", "ngCookies"])

.constant("LOGIN_COOKIE", "OTTEMOSESSION")
.constant("VISITOR_DEFAULT_AVATAR", "avatar-placeholder.png")

/**
*  Basic routing configuration
*/
.config(["$routeProvider", function ($routeProvider) {

    $routeProvider
        .when("/logout", {
            template: "",
            controller: "loginLogoutController"
        })
        .when("/login", {
            templateUrl: angular.getTheme("login.html"),
            controller: "loginLoginController"
        });
}])
.run([
    "$loginLoginService",
    "$rootScope",
    "$designService",
    "$route",
    function ($loginLoginService, $rootScope, $designService) {

        $rootScope.$on("$locationChangeStart", function () {
            $loginLoginService.init().then(
                function(){
                    if (!$loginLoginService.isLoggedIn()) {
                        $designService.setTopPage("login.html");
                    }
                }
            );
        });
    }
]
);
