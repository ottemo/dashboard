angular.module("seoModule", ["ngRoute", "ngResource"])

.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when("/seo", {
            templateUrl: "/themes/views/seo/list.html",
            controller: "seoListController"
        })
        .when("/seo/:id", {
            templateUrl: "/themes/views/seo/edit.html",
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
        // NAVIGATION
        
        // Adds item in the left sidebar
        $dashboardSidebarService.addItem("/seo", "URL Rewrite", "/seo", "fa fa-random", 3);
    }
]);
