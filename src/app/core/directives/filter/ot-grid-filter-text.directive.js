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
                controller: function ($scope) {
                    $scope.filter = ($scope.initValue) ? $scope.initValue : '';

                    $scope.getFilter = function() {
                        // TODO: extra option for LIKE ?
                        // Return LIKE filter
                        return ($scope.filter !== '') ? '~' + $scope.filter : undefined;
                    };

                    $scope.apply = function() {
                        $scope.onApply();
                    }
                }
            };
        }]);