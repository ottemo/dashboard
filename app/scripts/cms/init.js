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
}])

.run(["$designService", "$route", "$dashboardSidebarService", "$dashboardHeaderService",

    function ($designService, $route, $dashboardSidebarService, $dashboardHeaderService) {

        // NAVIGATION
        // Adds item in the left top-menu
        $dashboardHeaderService.addMenuItem("/cms", "CMS", null);
        $dashboardHeaderService.addMenuItem("/cms/pages", "Pages", "/cms/pages");
        $dashboardHeaderService.addMenuItem("/cms/blocks", "Blocks", "/cms/blocks");
        $dashboardHeaderService.addMenuItem("/cms/gallery", "Gallery", "/cms/gallery");

        // Adds item in the left sidebar
        $dashboardSidebarService.addItem("/cms", "CMS", null, "fa fa-indent", 60);
        $dashboardSidebarService.addItem("/cms/pages", "Page", "/cms/pages", "", 2);
        $dashboardSidebarService.addItem("/cms/blocks", "Block", "/cms/blocks", "", 1);
        $dashboardSidebarService.addItem("/cms/gallery", "Gallery", "/cms/gallery", "", 3);
    }
]);
