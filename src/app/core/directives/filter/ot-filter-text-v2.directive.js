angular.module('coreModule')

    .directive('otFilterTextV2', ['_', function (_) {
        return {
            restrict: 'AE',
            scope: {
                model: '=',
                initWithValue: '@',
                onSubmit: '=',
                placeholder: '@'
            },
            templateUrl: '/views/core/directives/filter/ot-text-v2.html',

            controller: ['$scope', function ($scope) {
                $scope.text = ($scope.initWithValue) ? filterToText($scope.initWithValue) : '';

                $scope.model = {
                    getFilter: getFilter
                };
                
                function filterToText(filter) {
                    var filterParts = filter.split(',');
                    if (filterParts.length > 0) {
                        return filterParts.join(' ');
                    } else {
                        return filter.replace('~', '');
                    }
                }
                
                function getFilter() {
                    var filterParts = $scope.text.split(/\s+/);
                    if (filterParts.length > 0) {
                        return filterParts.join(',')
                    } else {
                        var filter = _.trim($scope.text);
                        if (filter !== '') {
                            return '~' + filter;
                        }
                    }
                }
                
                $scope.submit = function () {
                    if ($scope.onSubmit) {
                        $scope.onSubmit();
                    }
                };
            }]};
    }]);