angular.module('dashboardModule', [
    // Angular
    'ngRoute',
    'ngResource',
    'ngSanitize',

    // Lib
    'ui.odometer',
    'ui.bootstrap',
    'highcharts-ng',

    // Ottemo
    'categoryModule',
    'cmsModule',
    'configModule',
    'designModule',
    'discountsModule',
    'impexModule',
    'loginModule',
    'orderModule',
    'productModule',
    'reportingModule',
    'seoModule',
    'subscriptionsModule',
    'visitorModule'
])

.constant('REST_SERVER_URI', angular.appConfigValue('general.app.foundation_url'))

.constant('COUNT_ITEMS_PER_PAGE', angular.appConfigValue('general.app.item_per_page'))

.config([
    '$routeProvider',
    '$locationProvider',
    '$sceDelegateProvider',
    '$animateProvider',
    function(
        $routeProvider,
        $locationProvider,
        $sceDelegateProvider,
        $animateProvider
    ) {
        $locationProvider.html5Mode(true);

        // Whitelisting
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            angular.appConfigValue('general.app.foundation_url') + '/**'
        ]);

        // Don't monitor font awesome animation .fa-spin
        $animateProvider.classNameFilter(/^((?!(fa-spin)).)*$/);

        // Routes
        $routeProvider
            .when('/', {
                templateUrl: '/views/dashboard/welcome.html',
                controller: 'dashboardController'
            })
            .when('/help', {
                templateUrl: '/views/help.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    }
])

.run([
    '$rootScope',
    '$http',
    '$location',
    'loginLoginService',
    function(
        $rootScope,
        $http,
        $location,
        loginLoginService
    ) {
        // ajax cookies support fix
        $http.defaults.withCredentials = true;
        delete $http.defaults.headers.common['X-Requested-With'];

        // Redirect to login page
        $rootScope.$on('$routeChangeError', function(ev, current, previous, rejection) {
            if (rejection && rejection.needsAuthentication === true) {
                $location.url('/login');
            }
        });

        // Add an auth check to every route
        $rootScope.$on('$routeChangeStart', function(e, to, from) {

            if (to.originalPath === '/login') {
                return;
            }

            to.resolve = to.resolve || {};
            to.resolve.checkLoggedIn = function($q, loginLoginService) {
                var def = $q.defer();

                loginLoginService.init()
                    .then(function(auth) {
                        if (auth) {
                            def.resolve(auth);
                        } else {
                            def.reject({
                                needsAuthentication: true
                            });
                        }
                    });

                return def.promise;
            };
        });
    }
]);

