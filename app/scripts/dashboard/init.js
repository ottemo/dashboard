angular.module("dashboardModule", [
    // Angular
    "ngRoute",
    "ngResource",
    "ngSanitize",
    "ngAnimate",
    "ngCookies",

    // Lib
    "ui.odometer",
    "highcharts-ng",
    "moment",

    // Ottemo
    "loginModule",
    "designModule",
    "categoryModule",
    "cmsModule",
    "configModule",
    "impexModule",
    "orderModule",
    "productModule",
    "seoModule",
    "visitorModule"
])

.constant("REST_SERVER_URI", angular.appConfigValue("general.app.foundation_url"))
.constant("COUNT_ITEMS_PER_PAGE", angular.appConfigValue("general.app.item_per_page"))

/*
 *  Basic routing configuration
 */
.config(["$routeProvider", "$httpProvider",'$locationProvider', function ($routeProvider, $httpProvider,$locationProvider) {
    $httpProvider.interceptors.push(function ($q) {
        return {
            'response': function (response) {
                if (typeof response.data.error !== "undefined" &&
                    response.data.error !== null &&
                    response.data.error.code === "0bc07b3d-1443-4594-af82-9d15211ed179") {
                    location.replace('/');
                }
                return response;
            },
            'responseError': function (rejection) {
                switch (rejection.status) {
                    case 401:
                        location.reload();
                        break;
                    case 404:
                        console.warn("The server is unable to process this request - " + rejection.config.url);
                        break;
                }
                return $q.reject(rejection);
            }
        };
    });
    $routeProvider
        .when("/", {
            templateUrl: "/themes/views/dashboard/welcome.html",
            controller: "dashboardController",
            resolve: {
                'auth' : function($loginLoginService,$q,$location){
                    var def = $q.defer();

                    $loginLoginService.init().then(function(auth){

                        if (auth)
                            return def.resolve()
                        else {
                            $location.url('/login');
                        }
                    })
                    return def.promise
                }
            }
        })
        .when("/help", {
            templateUrl: "/themes/views/help.html"
        })

        .otherwise({ redirectTo: "/"});

    $locationProvider.html5Mode(true);
}])

.run([
    "$rootScope",
    "$route",
    "$http",
    "$dashboardListService",
    function ($rootScope, $route, $http, DashboardListService) {
        // ajax cookies support fix
        $http.defaults.withCredentials = true;
        delete $http.defaults.headers.common["X-Requested-With"];

        $rootScope.$list = new DashboardListService();

        $route.reload();


        // content loaded handler
        $rootScope.$on('LoadingBar:loaded', function(res){
            $rootScope.contentLoaded = true;
        });
    }
]);
