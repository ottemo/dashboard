angular.module("dashboardModule", [
    // Angular
    "ngRoute",
    "ngResource",
    "ngSanitize",

    // Lib
    "ui.odometer",
    "ui.bootstrap",
    "highcharts-ng",

    // Ottemo
    "categoryModule",
    "cmsModule",
    "configModule",
    "designModule",
    "discountsModule",
    "impexModule",
    "loginModule",
    "orderModule",
    "productModule",
    "seoModule",
    "subscriptionsModule",
    "visitorModule"
])

.constant("REST_SERVER_URI", angular.appConfigValue("general.app.foundation_url"))
.constant("COUNT_ITEMS_PER_PAGE", angular.appConfigValue("general.app.item_per_page"))

/*
 *  Basic routing configuration
 */
.config(['$routeProvider',
    '$httpProvider',
    '$locationProvider',
    '$sceDelegateProvider',
    '$animateProvider',
    'odometerOptionsProvider',
    function ($routeProvider, $httpProvider, $locationProvider, $sceDelegateProvider, $animateProvider,odometerOptionsProvider) {

        var otInterceptor = ['$q',
            function ($q) {
                return {
                    response: function (response) {
                        if (typeof response.data.error !== "undefined" &&
                            response.data.error !== null &&
                            response.data.error.code === "0bc07b3d-1443-4594-af82-9d15211ed179") {
                            location.replace('/');
                        }
                        return response;
                    },
                    responseError: function (rejection) {
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
        }];

        $httpProvider.interceptors.push(otInterceptor);

        function checkLoggedIn($q,$log,loginLoginService){
            var def = $q.defer();

            loginLoginService.init().then(function(auth){

                if (auth)
                    def.resolve(auth)
                else {
                    // $location.url('/login');
                    $log.error('Authentication required. Redirect to login.');
                    def.reject({ needsAuthentication: true });
                    def.reject();
                }
            })

            return def.promise
        }

        $routeProvider.whenAuthenticated = function(path,route){
            route.resolve = route.resolve || {};

            angular.extend(route.resolve, {
                isLoggedIn: ['$q','$log', 'loginLoginService', checkLoggedIn]
            })

            return $routeProvider.when(path,route);
        }

        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            angular.appConfigValue("general.app.foundation_url") + '/**'
        ]);

        $routeProvider
            .whenAuthenticated("/", {
                templateUrl: "/views/dashboard/welcome.html",
                controller: "dashboardController"
            })
            .when("/help", {
                templateUrl: "/views/help.html"
            })
            .otherwise({ redirectTo: "/"});

        $locationProvider.html5Mode(true);

        // Don't monitor font awesome animation .fa-spin
        $animateProvider.classNameFilter(/^((?!(fa-spin)).)*$/);

    }]
)

.run([
    "$rootScope",
    "$route",
    "$http",
    "dashboardListService",
    "$location",
    "$log",
    function ($rootScope, $route, $http, DashboardListService,$location,$log) {
        // ajax cookies support fix
        $http.defaults.withCredentials = true;
        delete $http.defaults.headers.common["X-Requested-With"];

        $rootScope.$list = new DashboardListService();

        $route.reload();

        $rootScope.$on('$routeChangeError', function (ev, current, previous, rejection) {
            if (rejection && rejection.needsAuthentication === true) {
                // redirect to login page
                $location.url('/login');
            }
        });

        // content loaded handler
        $rootScope.$on('$routeChangeSuccess', function(res){
            $rootScope.contentLoaded = true;
        });
    }
]);
