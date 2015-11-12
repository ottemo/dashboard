angular.module('cmsModule', [
    'ngRoute',
    'ngResource',
    'designModule'
])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/cms/pages', {
            templateUrl: '/themes/views/cms/page-list.html',
            controller: 'cmsPageListController'
        })
        .when('/cms/page/:id', {
            templateUrl: '/themes/views/cms/page-edit.html',
            controller: 'cmsPageEditController'
        })
        .when('/cms/blocks', {
            templateUrl: '/themes/views/cms/block-list.html',
            controller: 'cmsBlockListController'
        })
        .when('/cms/block/:id', {
            templateUrl: '/themes/views/cms/block-edit.html',
            controller: 'cmsBlockEditController'
        })
        .when('/cms/images', {
            templateUrl: '/themes/views/cms/images-list.html',
            controller: 'cmsImagesListController'
        });

}]);

