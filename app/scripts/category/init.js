angular.module("categoryModule", ["ngRoute", "ngResource", "designModule"])

/*
 *  Basic routing configuration
 */
.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when("/categories", {
            templateUrl: "/themes/views/category/list.html",
            controller: "categoryListController"
        })
        .when("/category/:id", {
            templateUrl: "/themes/views/category/edit.html",
            controller: "categoryEditController"
        });
}])

.run([ "$route", "$dashboardSidebarService",
    function ( $route, $dashboardSidebarService) {

        // Adds item in the left sidebar
        $dashboardSidebarService.addItem("/categories", "Categories", "/categories", "fa fa-th-list", 6);
    }
]);