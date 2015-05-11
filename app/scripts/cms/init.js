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
}])

.run([ "$route", "$dashboardSidebarService",

    function ( $route, $dashboardSidebarService) {

        // NAVIGATION

        // Adds item in the left sidebar
        $dashboardSidebarService.addItem("/cms", "CMS", null, "fa fa-indent", 60);
        $dashboardSidebarService.addItem("/cms/pages", "Page", "/cms/pages", "", 2);
        $dashboardSidebarService.addItem("/cms/blocks", "Block", "/cms/blocks", "", 1);
    }
]);
