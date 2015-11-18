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
]);
