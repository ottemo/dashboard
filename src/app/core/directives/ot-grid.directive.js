angular.module('coreModule')

    .directive('otGrid', [
        '_',
        '$location',
        'dashboardQueryService',
        function(
            _,
            $location,
            dashboardQueryService) {

        /**
         * Default directive config
         */
        var configDefaults = {

            /**
             * If `true`, while clicking on a row,
             * selection will have more priority
             * than redirecting to row._link
             */
            forceSelection: false,

            /**
             * if set to `true`, load grid data on controller initialization
             */
            autoload: true,

            /**
             * If set to `true`, changing filters, sort or page in grid
             * will modify search parameters in url
             */
            changeSearch: false,

            /**
             * Allow filtering in grid
             */
            filtering: true,

            /**
             * Filters are visible by default
             */
            isFiltersOpen: false
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
                config: '=',

                /**
                 * Directive methods that are allowed to use in external code:
                 *      toggleFilters   - change filters visibility
                 *      applyFilters    - apply filters
                 *      getSelectedIds  - returns selectedIds as array of strings
                 */
                methods: '='
            },
            templateUrl: '/views/core/directives/ot-grid.html',
            controller: function($scope) {
                var config = _.assign({}, configDefaults, $scope.config);

                if (config.changeSearch) {
                    $scope.grid.on('load', function() {
                        $location.search($scope.grid.getViewSearchParams());
                    });

                    if ($scope.grid.multiSelect) {
                        $scope.grid.on('afterSelect', function() {
                            $location.search($scope.grid.getViewSearchParams());
                        });
                    }
                }

                $scope.methods = {
                    applyFilters: applyFilters,
                    toggleFilters: toggleFilters,
                    getSelectedIds: getSelectedIds
                };
                $scope.applyFilters = applyFilters;
                $scope.isFiltersOpen = config.isFiltersOpen;

                if (config.autoload) {
                    activate();
                }

                //////////////////////////////////////

                /**
                 * Initialize
                 */
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

                    if (!isCheckboxClicked(event) && !config.forceSelection
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

                $scope.titleClick = function(column) {
                    if (column._unsortable) {
                        return;
                    }

                    var direction = 'ASC';
                    if (column.sort && column.sort === 'ASC') {
                        direction = 'DESC';
                    }
                    $scope.grid.setSort({ column: column.key, direction: direction});
                    $scope.grid.load({resetPagination: false});
                };

                /**
                 * Apply filters handler
                 */
                function applyFilters(force) {
                    var filterParams = {},
                        isFiltersChanged = false;

                    _.forEach($scope.grid.filters, function(filter) {
                        if (_.isFunction(filter.getFilter)) {
                            var newFilterValue = filter.getFilter();
                            filterParams[filter.key] = newFilterValue;

                            if (newFilterValue !== filter.value) {
                                isFiltersChanged = true;
                            }
                        }
                    });

                    if (isFiltersChanged || force) {
                        $scope.grid.applyFilters(filterParams);
                        $scope.grid.load({resetPagination: true});
                    }
                }

                /**
                 * Toggles filters visibility
                 */
                function toggleFilters() {
                    $scope.isFiltersOpen = config.isFiltersOpen;
                }

                /**
                 * Returns selected ids
                 */
                function getSelectedIds() {
                    return $scope.grid.selectedIds;
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
                if (target.is('.row-col-selection')) {
                    return true;
                } else if (target.is('.grid-row')) {
                    return false;
                } else {
                    target = target.parent();
                }
            }
        }
    }]);