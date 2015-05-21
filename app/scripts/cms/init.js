angular.module("cmsModule", ["ngRoute", "ngResource", "designModule"])

/*
 *  Basic routing configuration
 */
.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when("/cms/pages", {
            templateUrl: angular.getTheme("cms/page-list.html"),
            controller: "cmsPageListController"
        })
        .when("/cms/page/:id", {
            templateUrl: angular.getTheme("cms/page-edit.html"),
            controller: "cmsPageEditController"
        })
        .when("/cms/blocks", {
            templateUrl: angular.getTheme("cms/block-list.html"),
            controller: "cmsBlockListController"
        })
        .when("/cms/block/:id", {
            templateUrl: angular.getTheme("cms/block-edit.html"),
            controller: "cmsBlockEditController"
        })
        .when("/cms/gallery", {
            templateUrl: angular.getTheme("cms/gallery.html"),
            controller: "cmsGalleryController"
        });
}]);
