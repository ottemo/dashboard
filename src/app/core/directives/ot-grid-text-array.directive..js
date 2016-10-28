angular.module('coreModule')

    .directive('otGridTextArray', ['_', function (_) {
            return {
                restrict: 'EA',
                templateUrl: '/views/core/directives/ot-grid-text-array.directive.html',
                scope: {
                    options: '=',
                    values: '='
                },
                link: function ($scope) {
                    $scope.$watch('values', function() {
                        $scope.result = _.map($scope.values, function(valueKey) {
                            return $scope.options[valueKey];
                        }).join(',');
                    });
                }
            };
        }]);