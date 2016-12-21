angular.module('coreModule')

    .directive('otGridFilterText', [
        function () {
            return {
                restrict: 'EA',
                templateUrl: '/views/core/directives/filter/ot-grid-filter-text.directive.html',
                scope: {
                    getFilter: '=',
                    initValue: '@',
                    label: '@',
                    onApply: '='
                },
                controller: function ($scope, $attrs) {
                    var strictComparison = 'strictComparison' in $attrs;

                    if ($scope.initValue) {
                        if (!strictComparison && $scope.initValue.indexOf('~') === 0) {
                            $scope.initValue = $scope.initValue.slice(1);
                        }
                    }
                    $scope.filter = ($scope.initValue) ? $scope.initValue : '';

                    $scope.getFilter = function() {
                        if ($scope.filter !== '') {
                            return strictComparison ? $scope.filter : '~' + $scope.filter;
                        } else {
                            return undefined;
                        }
                    };

                    $scope.apply = function() {
                        $scope.onApply();
                    }
                }
            };
        }]);