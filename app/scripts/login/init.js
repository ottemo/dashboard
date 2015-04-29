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
    "$dashboardHeaderService",
    "$route",
    function ($loginLoginService, $rootScope, $designService, $dashboardHeaderService) {

        $rootScope.$on("$locationChangeStart", function () {
            $loginLoginService.init().then(
                function(){
                    if (!$loginLoginService.isLoggedIn()) {
                        $designService.setTopPage("login.html");
                    }
                }
            );
        });

        // NAVIGATION
        // Adds item in the right top-menu
        $dashboardHeaderService.addMenuRightItem("/logout", "Log Out", "/logout");

    }
]
);