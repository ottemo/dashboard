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
                    if (row._disabled) {
                        event.preventDefault();
                        return;
                    }

                    var isLink = isLinkClicked(event);
                    if (isLink) {
                        return;
                    }

                    if ($scope.grid.beforeSelect) {
                        var isSelected = $scope.grid.beforeSelect(row);
                        if (typeof(isSelected) === 'boolean') {
                            row._selected = isSelected;
                        } else {
                            row._selected = !row._selected;
                        }
                    } else {
                        row._selected = !row._selected;
                    }

                    event.preventDefault();
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