angular.module('coreModule')

    .directive('otGrid', [function() {
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
                    console.log('click');
                    if (row._disabled) {
                        event.preventDefault();
                        return;
                    }

                    var isLink = isLinkClicked(event);
                    if (isLink) {
                        return;
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
    }]);