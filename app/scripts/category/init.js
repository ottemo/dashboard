angular.module("categoryModule", ["ngRoute", "ngResource", "designModule"])

/*
 *  Basic routing configuration
 */
.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when("/categories", {
            templateUrl: angular.getTheme("category/list.html"),
            controller: "categoryListController"
        })
        .when("/category/:id", {
            templateUrl: angular.getTheme("category/edit.html"),
            controller: "categoryEditController"
        });
}])

.run(["$designService", "$route", "$dashboardSidebarService",
    function ($designService, $route, $dashboardSidebarService) {

        // Adds item in the left sidebar
        $dashboardSidebarService.addItem("/categories", "Categories", "/categories", "fa fa-th-list", 6);
    }
]);