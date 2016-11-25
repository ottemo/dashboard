angular.module('productModule')

.directive('otSalePriceManager', [function () {
    return {
        restrict: 'E',
        scope: {
            'attribute': '=editorScope',
            'item': '=item'
        },
        templateUrl: '/views/product/directive/ot-sale-price-manager.html',

        controller: function ($scope) {

            var isInit = false;

            $scope.removeSalePrice = removeSalePrice;
            $scope.addNewSalePrice = addNewSalePrice;

            $scope.startDateIsOpen = true;
            $scope.endDateIsOpen = true;

            $scope.$watch('item', function () {
                if ($scope.item[$scope.attribute.Attribute] === undefined) {
                    $scope.salePrices = [];
                    return false;
                }

                if (isInit) {
                    return false;
                } else {
                    initData();
                    isInit = true;
                }

            }, true);


            function initData() {
                if (!isInit) {
                    if ($scope.item[$scope.attribute.Attribute] === null) {
                        $scope.item[$scope.attribute.Attribute] = [];
                    }

                    $scope.salePrices = $scope.item[$scope.attribute.Attribute];

                    angular.forEach($scope.salePrices, function(salePrice) {
                        if (typeof(salePrice.start_datetime) === 'string') {
                            salePrice.start_datetime = new Date(salePrice.start_datetime);
                        }
                        if (typeof(salePrice.end_datetime) === 'string') {
                            salePrice.end_datetime = new Date(salePrice.end_datetime);
                        }
                    });
                }
            }

            function removeSalePrice(index) {
                $scope.salePrices.splice(index, 1);
            }

            function addNewSalePrice() {
                $scope.salePrices.push({
                    'amount': '',
                    'start_datetime': '',
                    'end_datetime': ''
                });
            }
        }
    };
}]);

