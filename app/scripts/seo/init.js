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
    function ($loginService, $rootScope, $designService) {
        $designService.setTopPage("seo/index.html");
    }
]);
