angular.module('productModule')

.directive('otCustomOption', [function() {
    return {
        restrict: 'EA',
        scope: {
            option: '=',
            isManagingStock: '='
        },
        templateUrl: '/views/product/directive/ot-custom-option.html',

        controller: function ($scope) {
            $scope.types = [
                "field",
                "select",
                "radio",
                "multi_select",
                "date"
            ];
            $scope.unfoldedSelections = [];
        }
    }
}]);