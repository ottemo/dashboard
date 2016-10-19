angular.module('productModule')

.directive('otProductOption', [function() {
    return {
        restrict: 'EA',
        require: '^otProductOptionsManager',
        scope: {
            option: '=',
        },
        templateUrl: '/views/product/directive/ot-product-option.html',
        link: function(scope, elem, attrs, ctrl) {
            scope.optionManagerCtrl = ctrl;
        },
        controller: function ($scope) {
            $scope.updateAssociatedProductsList = function() {
                console.log('reload table');
            };

            $scope.unfoldedSelections = [];
        }
    }
}]);