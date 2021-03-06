angular.module("seoModule", ["ngRoute", "ngResource", "coreModule"])

.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when("/seo", {
            templateUrl: "/views/seo/list.html",
            controller: "seoListController"
        })
        .when("/seo/:id", {
            templateUrl: "/views/seo/edit.html",
            controller: "seoIndependentEditController"
        });
    }
]);
