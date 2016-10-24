angular.module('coreModule')

    .directive('otGrid', ['$location', function($location) {
        return {
            restrict: 'EA',
            scope: {
                grid: '='
            },
            templateUrl: '/views/core/directives/ot-grid.html',
            controller: function($scope) {

                /**
                 * Row click handler
                 */
                $scope.clickRow = function(row, index, event) {
                    if (row._disabled) {
                        event.preventDefault();
                        return;
                    }

                    var isLink = isLinkClicked(event);
                    if (isLink) {
                        return;
                    }

                    if (!isCheckboxClicked(event) && !$scope.grid.enforceSelection
                        && row._link) {
                        $location.search({});
                        $location.path(row._link);
                    }

                    // Don't change selection when grid is single select
                    // and we want always keep one item selected
                    // and it's a click on the selected item
                    if (!$scope.grid.multiSelect && $scope.grid.keepSingleSelection
                        && row._selected === true) {
                        return;
                    }

                    var forcedSelectionState;
                    if ($scope.grid.beforeSelect) {
                        forcedSelectionState = $scope.grid.beforeSelect(row);
                    }
                    var newSelectionState = (typeof(forcedSelectionState) === 'boolean') ?
                        forcedSelectionState : !row._selected;
                    if (newSelectionState !== Boolean(row._selected)) {
                        $scope.grid.updateSelection(row, newSelectionState);
                    }
                }
            }
        };

        /**
         * Check if user clicked on select link in row
         */
        function isLinkClicked(event) {
            var target = $(event.target);
            while (true) {
                if (target.is('.row-select-link')) {
                    return true;
                } else if (target.is('.grid-row')) {
                    return false;
                } else {
                    target = target.parent();
                }
            }
        }

        /**
         * Check if user clicked on selection checkbox in row
         */
        function isCheckboxClicked(event) {
            var target = $(event.target);
            while (true) {
                if (target.is('.row-checkbox-col')) {
                    return true;
                } else if (target.is('.grid-row')) {
                    return false;
                } else {
                    target = target.parent();
                }
            }
        }
    }]);