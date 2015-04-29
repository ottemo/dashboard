angular.module("productModule", ["ngRoute", "ngResource", "designModule"])

/**
*  Basic routing configuration
*/
.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when("/products", {
            templateUrl: angular.getTheme("product/list.html"),
            controller: "productListController"
        })
        .when("/product/:id", {
            templateUrl: angular.getTheme("product/edit.html"),
            controller: "productEditController"
        })
        .when("/attributes", {
            templateUrl: angular.getTheme("product/attribute/list.html"),
            controller: "productAttributeListController"
        })
        .when("/attribute/:attr", {
            templateUrl: angular.getTheme("product/attribute/edit.html"),
            controller: "productAttributeEditController"
        });
}])

.run([
    "$designService",
    "$route",
    "$dashboardSidebarService",
    function ($designService, $route, $dashboardSidebarService) {

        // Adds item in the left sidebar
        $dashboardSidebarService.addItem("/product", "Products", null, "fa fa-tags", 8);
        $dashboardSidebarService.addItem("/product/products", "Products", "/products", "", 2);
        $dashboardSidebarService.addItem("/product/attributes", "Attributes", "/attributes", "", 1);
    }
]);