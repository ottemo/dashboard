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
    "$dashboardSidebarService",
    function ($loginLoginService, $rootScope, $designService,$dashboardSidebarService) {

        $rootScope.$on("$locationChangeStart", function () {
            $loginLoginService.init();
        });


        $dashboardSidebarService.addMenuItem("/logout", "Log Out", "/logout");
    }
]
);