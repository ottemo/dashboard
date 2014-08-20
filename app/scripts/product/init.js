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
                        .when("/product", { templateUrl: "views/product/edit.html" })
                        .when("/product/attributes", { templateUrl: "views/product/attribute/edit.html" });
                }])

                .run(["$designService", "$route", "$dashboardSidebarService", "$dashboardHeaderService",

                    function ($designService, $route, $dashboardSidebarService, $dashboardHeaderService) {

                        // NAVIGATION
                        // Adds item in the right top-menu
                        $dashboardHeaderService.addMenuItem("/product", "Products", null);
                        $dashboardHeaderService.addMenuItem("/product/attributes", "Manage", "/product");
                        $dashboardHeaderService.addMenuItem("/product/attributes", "Attributes", "/product/attributes");

                        // Adds item in the left sidebar
                        $dashboardSidebarService.addItem("Product manage", "product", "glyphicon glyphicon-barcode", 100);
                    }
                ]);

            return angular.module.productModule;
        });

})(window.define);