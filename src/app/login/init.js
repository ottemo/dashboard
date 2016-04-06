angular.module("loginModule", ["ngRoute", "ngResource", "coreModule"])

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
            templateUrl: "/views/login/login.html",
            controller: "loginLoginController",
            resolve: {
                'auth' : function(loginLoginService,$q,$location){
                    var def = $q.defer();

                    loginLoginService.init().then(function(auth){

                        if (auth) {
                            $location.url('/');
                        } else {
                            return def.resolve();
                        }
                    });

                    return def.promise;
                }
            }
        });
}]);
