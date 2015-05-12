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
            controller: "loginLoginController",
            resolve: {
                'auth' : function($loginLoginService,$q,$location){
                    var def = $q.defer();
                    
                    $loginLoginService.init().then(function(auth){
                        console.log('auth',auth);
                        if (auth)
                            $location.url('/');
                        else {
                            return def.resolve();
                        }
                    })
                    return def.promise
                }
            }
        });
}])
.run([
    "$loginLoginService",
    "$rootScope",
    "$designService",
    "$dashboardSidebarService",
    function ($loginLoginService, $rootScope, $designService,$dashboardSidebarService) {

        // $rootScope.$on("$locationChangeStart", function () {
            // console.log('$loginLoginService init')
            // $loginLoginService.init(true);
        // });


        $dashboardSidebarService.addMenuItem("/logout", "Log Out", "/logout");
    }
]
);