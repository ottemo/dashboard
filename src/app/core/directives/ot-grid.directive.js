angular.module('coreModule')

    .directive('otGrid', ['_', '$location', function(_, $location) {
        return {
            restrict: 'EA',
            scope: {
                /**
                 * Grid object created via coreGridService.grid(),
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
                    showParamsInUrl: false,

                    /**
                     * Allow filtering in grid
                     */
                    filtering: true,

                    /**
                     * Filters are visible by default
                     */
                    isFiltersOpen: false
                };

                var config = $.extend(true, {}, configDefaults, $scope.config);
                activate();


                //////////////////////////////////////

                function activate() {
                    if (config.showParamsInUrl) {
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
                    $scope.page = $scope.grid.pagination.page;

                    if (config.autoload) {
                        $scope.grid.load({ getCount: true });
                    }
                }

                /**
                 * Row click handler
                 */
                $scope.rowClick = function(row, index, event) {

                    if (row._disabled) {
                        event.preventDefault();
                        return;
                    }

                    if (isLinkClicked(event) || isInputClicked(event)) {
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

                    $scope.grid.updateSelection(row, !row._selected);
                };

                /**
                 * Page changed handler
                 */
                $scope.pageChanged = function() {
                    $scope.grid.applyPage($scope.page);
                    $scope.grid.load({});
                };

                $scope.titleClick = function(column) {
                    if (column._not_sortable) {
                        return;
                    }

                    var direction = 'ASC';
                    if (column.sort && column.sort === 'ASC') {
                        direction = 'DESC';
                    }
                    $scope.grid.applySort({ column: column.key, direction: direction});
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
                        $scope.grid.load({ resetPage: true, getCount: true });
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
         * Check if user clicked on select link in row
         */
        function isInputClicked(event) {
            var target = $(event.target);
            while (true) {
                if (target.is('.row-col-input-number')) {
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
                if (target.is('.row-col-_selection')) {
                    return true;
                } else if (target.is('.grid-row')) {
                    return false;
                } else {
                    target = target.parent();
                }
            }
        }
    }]);