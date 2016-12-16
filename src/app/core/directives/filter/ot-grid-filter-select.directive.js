angular.module('coreModule')

    .directive('otGridFilterSelect', [
        '_',
        'coreParserService',
        function (
            _,
            coreParserService
        ) {
            return {
                restrict: 'EA',
                templateUrl: '/views/core/directives/filter/ot-grid-filter-select.directive.html',
                scope: {
                    getFilter: '=',
                    initValue: '@',
                    options: '=',
                    onApply: '='
                },
                controller: function ($scope) {

                    activate();

                    //////////////////////////////////////

                    function activate() {
                        var options = $scope.options;

                        // If options is a string - convert to object
                        if (typeof(options) === 'string') {
                            options = coreParserService.optionsStringToObject($scope.options);
                        }
                        // If options is an object and not an array, convert to array
                        if (!_.isArray(options) && _.isObject(options)) {
                            var optionsArray = [];
                            _.forEach(options, function(option, key) {
                                optionsArray.push({ key: key, label: option });
                            });
                            options = optionsArray;
                        }
                        // If options is still not an array - set them empty
                        if (!_.isArray(options)) {
                            options = [];
                        }

                        // Add <Any> option when filter is empty
                        options.unshift({ key: '', label: '<Any>'});
                        $scope.options = options;

                        $scope.filter = $scope.initValue || '';
                    }

                    $scope.getFilter = function() {
                        return ($scope.filter !== '') ? $scope.filter: undefined;
                    };

                    $scope.apply = function() {
                        $scope.onApply();
                    }
                }
            };
    }]);