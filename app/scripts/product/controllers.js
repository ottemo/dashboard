(function (define) {
    "use strict";

    define(["product/init"], function (productModule) {

        productModule
            .controller("productIndexController", ["$scope", "$productListService", function ($scope, $productListService) {
                $scope.it = $productListService;
            }]);

        return productModule;
    });
})(window.define);
