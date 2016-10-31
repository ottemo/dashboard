angular.module('coreModule')

    .directive('otGridFilterRange', [
        '_',
        'coreParserService',
        function (
            _,
            coreParserService
        ) {
            return {
                restrict: 'EA',
                templateUrl: '/views/core/directives/filter/ot-grid-filter-range.directive.html',
                scope: {
                    getFilter: '=',
                    initValue: '@',
                    label: '@',
                    onApply: '='
                },
                controller: function ($scope) {
                    /**
                     * Parse label
                     * 'start,end' -> { low: 'start', high: 'end' }
                     */
                    if ($scope.label) {
                        var labelParts = $scope.label.split(',');
                        $scope.label = {
                            low: labelParts[0] || 'Low',
                            high: labelParts[1] || 'High'
                        }
                    }

                    $scope.filter = ($scope.initValue) ?
                        coreParserService.rangeFromString($scope.initValue) : { low: '', high: '' };

                    $scope.getFilter = function() {
                        var filterValue = coreParserService.rangeToString($scope.filter);
                        return (filterValue !== '') ? filterValue : undefined;
                    };

                    $scope.apply = function() {
                        $scope.onApply();
                    }
                }
            };
        }]);