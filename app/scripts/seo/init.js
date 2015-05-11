angular.module("seoModule", ["ngRoute", "ngResource"])

.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when("/seo", {
            templateUrl: angular.getTheme("seo/list.html"),
            controller: "seoListController"
        })
        .when("/seo/:id", {
            templateUrl: angular.getTheme("seo/edit.html"),
            controller: "seoIndependentEditController"
        });
    }
])

.run([
    "$loginLoginService",
    "$rootScope",
    "$designService",
    "$route",
    "$dashboardSidebarService",
    function ($loginService, $rootScope, $designService, $route, $dashboardSidebarService) {
        // $designService.setTopPage("seo/index.html");

        // NAVIGATION
        
        // Adds item in the left sidebar
        $dashboardSidebarService.addItem("/seo", "URL Rewrite", "/seo", "fa fa-random", 3);
    }
]);
