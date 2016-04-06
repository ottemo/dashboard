angular.module('coreModule')

.directive('otFilterRange', function() {
    return {
        restrict: 'E',
        scope: {
            'parent': '=object',
            'attribute': '=editorScope',
            'item': '=item'
        },
        templateUrl: '/views/core/directives/filter/ot-range.html',

        controller: function($scope) {

            // $scope.low = '';
            // $scope.high = '';
            var isInit = false;

            $scope.submit = function() {
                var targetAttribute = $scope.attribute.Attribute;
                var newFilterValue = '';

                if ($scope.low || $scope.high) {
                    newFilterValue = [
                        $scope.low,
                        '..',
                        $scope.high
                    ].join('');
                }

                $scope.item[targetAttribute] = newFilterValue;
                $scope.parent.newFilters[targetAttribute] = $scope.item[targetAttribute];
            };

            $scope.$watch('item', function() {
                if (typeof $scope.item === 'undefined') {
                    return false;
                }
                if (isInit || typeof $scope.item[$scope.attribute.Attribute] === 'undefined') {
                    return false;
                }

                var values = $scope.item[$scope.attribute.Attribute].split('..');
                if (null !== values) {
                    $scope.low =  parseFloat(values[0]);
                    $scope.high = parseFloat(values[1]);
                    isInit = true;
                }

                $scope.parent.newFilters[$scope.attribute.Attribute] = $scope.item[$scope.attribute.Attribute];

            }, true);
        }
    };
});

