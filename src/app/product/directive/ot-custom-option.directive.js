angular.module('productModule')

.directive('otCustomOption', [function() {
    return {
        restrict: 'EA',
        scope: {
            option: '=',
            optionsManager: '=',
            isManagingStock: '=',
        },
        templateUrl: '/views/product/directive/ot-custom-option.html',

        link: function (scope) {
            scope.types = [
                "field",
                "select",
                "radio",
                "multi_select",
                "date"
            ];
            scope.unfoldedSelections = [];
        }
    }
}]);