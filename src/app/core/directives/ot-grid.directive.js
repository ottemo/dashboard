angular.module('coreModule')

    .directive('otGrid', ['_', '$location', function(_, $location) {

        /**
         * Default directive config
         */
        var configDefaults = {

            /**
             * If `true`, while clicking on a row,
             * selection will have more priority
             * than redirecting to row._link
             */
            enforceSelection: false,

            /**
             * if set to `true`, load grid data on controller initialization
             */
            autoload: true,

            /**
             * If set to `true`, changing filters, sort or page in grid
             * will modify search parameters in url
             */
            changeSearch: false
        };

        return {
            restrict: 'EA',
            scope: {
                /**
                 * Grid object created via dashboardGridService.grid(),
                 * required
                 */
                grid: '=',

                /**
                 * Directive config
                 */
                config: '='
            },
            templateUrl: '/views/core/directives/ot-grid.html',
            controller: function($scope) {
                var config = _.assign({}, configDefaults, $scope.config);

                if (config.changeSearch) {
                    // TODO: create setter for callbacks
                    $scope.grid.loadCallbacks.push(function() {
                        $location.search($scope.grid.getViewSearchParams());
                    });

                    if ($scope.grid.multiSelect) {
                        $scope.grid.afterSelectCallbacks.push(function() {
                            $location.search($scope.grid.getViewSearchParams());
                        });
                    }
                }
                if (config.autoload) {
                    activate();
                }

                //////////////////////////////////////

                function activate() {
                    $scope.grid.load({resetPagination: true});
                }

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

                    if (!isCheckboxClicked(event) && !config.enforceSelection
                        && row._link) {

                        $location.search({});
                        $location.path(row._link);
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
                };

                /**
                 * Page changed handler
                 */
                $scope.pageChanged = function() {
                    $scope.grid.changePage($scope.grid.pagination.page);
                    $scope.grid.load({resetPagination: false});
                };
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