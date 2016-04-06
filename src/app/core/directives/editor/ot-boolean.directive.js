angular.module('coreModule')

.directive('otBoolean', [function() {
    return {
        restrict: 'E',
        templateUrl: '/views/core/directives/editor/ot-select.html',

        scope: {
            'attribute': '=editorScope',
            'item': '=item'
        },

        controller: function($scope) {
            $scope.options = [{
                Id: false,
                Name: 'false'
            }, {
                Id: true,
                Name: 'true'
            }];

            $scope.$watch('item', init);
            $scope.$watch('attribute', init);

            function init() {
                if (typeof $scope.attribute === 'undefined' ||
                    typeof $scope.item === 'undefined'
                ) {
                    return false;
                }
            }

        }
    };
}]);

