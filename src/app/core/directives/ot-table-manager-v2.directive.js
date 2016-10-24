angular.module('coreModule')

    .directive('otTableManagerV2', [function() {
        return {
            restrict: 'AE',
            scope: {
                grid: '='
            },
            controller: function($scope, $attrs) {
                $scope.isMultiselect = 'multiselect' in $attrs;
            }
        }
    }]);