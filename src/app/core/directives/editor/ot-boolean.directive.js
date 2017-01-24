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
                if ($scope.attribute !== undefined && $scope.item !== undefined) {
                    if ($scope.attribute.Default === 'true') {
                        $scope.attribute.Default = true;
                    } else if ($scope.attribute.Default === 'false') {
                        $scope.attribute.Default = false;
                    }
                }
            }

        }
    };
}]);

