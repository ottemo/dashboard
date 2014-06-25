(function (define) {
    'use strict';
    define(['angular'], function (angular) {
        angular.module('dashboardApp.directives.ProductList', [])
            .directive('productList', function () {
                return {
                    templateUrl: 'views/product/list.html',
                    restrict: 'E',
                    controller: function ($scope) {
                        /**
                         * @todo utilize a constant here
                         */
                        $scope.$on('change.the.browse.view', function (event, value) {
                            $scope.activeView = value;
                        });
                        $scope.activeView = 'tile';
                    }
                };
            });
    });
})(window.define);