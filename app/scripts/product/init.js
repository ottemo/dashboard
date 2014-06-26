(function (define) {
    "use strict";

    define([
            "angular",
            "angular-route"
        ],
        function (angular) {
            /*
             *  Angular "productModule" declaration
             */
            angular.module.productModule = angular.module("productModule", ["ngRoute", "designModule"])

                /*
                 *  Basic routing configuration
                 */
                .config(["$routeProvider", function ($routeProvider) {
                    $routeProvider
                        .when("/product", { templateUrl: "views/product/edit.html" });
                }])

                .run(["$designService", "$route", "$pageSidebarService", "$pageHeaderService",
                    function ($designService, $route, $pageSidebarService, $pageHeaderService) {

                        // NAVIGATION
                        // Adds item in the right top-menu
                        $pageHeaderService.addMenuItem("/product", "Product", "product");
                        // Adds item in the left sidebar
                        $pageSidebarService.addItem("Product", "product", "https://cdn2.iconfinder.com/data/icons/picons-essentials/71/gift-512.png", 100);
                        $pageSidebarService.addItem("Visitor", "visitor", "images/icon-browse.jpg", 90);
                        $pageSidebarService.addItem("Settings", "settings", "glyphicon glyphicon-cog", 10);
                    }
                ]);

            return angular.module.productModule;
        });

})(window.define);
