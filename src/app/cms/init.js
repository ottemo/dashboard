angular.module('cmsModule', [
    'ngRoute',
    'ngResource',
    'designModule'
])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/cms/pages', {
            templateUrl: '/views/cms/page-list.html',
            controller: 'cmsPageListController'
        })
        .when('/cms/page/:id', {
            templateUrl: '/views/cms/page-edit.html',
            controller: 'cmsPageEditController'
        })
        .when('/cms/blocks', {
            templateUrl: '/views/cms/block-list.html',
            controller: 'cmsBlockListController'
        })
        .when('/cms/block/:id', {
            templateUrl: '/views/cms/block-edit.html',
            controller: 'cmsBlockEditController'
        })
        .when('/cms/media', {
            templateUrl: '/views/cms/media-list.html',
            controller: 'cmsMediaListController'
        });

}]);

