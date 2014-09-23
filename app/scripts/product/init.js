(function (define) {
    "use strict";

    /**
     * The module "productModule" is designed to work with products
     * He handles the action  with products (adding/editing/deletion).
     *
     * It"s a basic file for initialization of module. He should be included first.
     */
    define([
            "angular",
            "angular-route",
            "angular-resource"
        ],
        function (angular) {
            /**
             *  Angular "productModule" declaration.
             *  Adds routes and items in navigation bar
             */
            angular.module.productModule = angular.module("productModule", ["ngRoute", "ngResource", "designModule"])

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

            return angular.module.productModule;
        });

})(window.define);