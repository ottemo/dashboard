angular.module('dashboardModule')

    .service('dashboardGridService', [
        '_',
        '$q',
        'dashboardGridApiService',
        'dashboardQueryService',
        function (
            _,
            $q,
            dashboardGridApiService,
            dashboardQueryService
        ) {

        var ITEMS_PER_PAGE = 15;

        // TODO: split config fields into smaller objects ?
        var defaults = {

            /**
             * Default grid columns
             * Each columns is object with properties:
             *      key
             *      label       - column title,
             *      type        - value type,
             *      editor      - filter type,
             *      isSortable  - column is sortable
             *      isLink      - {Boolean} column value is wrapped with <a> element
             *                              with 'href' = row._link
             */
            columns: [
                {
                    key: 'image',
                    label: 'Image',
                    type: 'image'
                },
                {
                    key: 'id',
                    label: 'ID',
                    type: 'text',
                    editor: 'text',
                    isLink: true
                },
                {
                    key: 'name',
                    label: 'Name',
                    type: 'text',
                    editor: 'text'
                },
                {
                    key: 'description',
                    label: 'Description',
                    type: 'text',
                    editor: 'text'
                }
            ],

            /**
             * Mapping object
             * defines how value for each row column is obtained from collection entity
             * field: { ID: 'id' }                  entity.ID -> row.id
             * extra: { customer_email: 'email' }   entity.Extra.customer_email -> row.email
             *
             * It may make filters, that are visible in view, be different from filters,
             * that are sent to the server
             * in view:                     email=~ottemo
             * actual filter in request:    customer_email=~ottemo
             */
            mapping: {
                field: {
                    ID: 'id',
                    Image: 'image',
                    Name: 'name',
                    Desc: 'description'
                },
                extra: {}
            },

            /**
             * Initial search params object
             * may contain filters, sort and limit parameters
             * { sort: '^created_at', limit: '10,25' }
             *
             * Used to initialize grid with parameters from page url
             */
            searchParams: {},

            /**
             * Additional extra parameters that are passed to the server and can be used in rowCallback
             * e.g: 'weight,price'
             */
            forcedExtra: '',

            /**
             * Filters that are not visible in view and always passed to the server
             * e.g.:
             * { status=processed } - users are not allowed to change that filter, but it will be send to the server
             */
            forcedFilters: {},

            itemsPerPage: ITEMS_PER_PAGE,

            /**
             * An array of callbacks that are invoked for each row in grid
             * callback parameters:
             *      row - row object
             *      key - entity index in collection
             *      collection
             */
            rowCallbacks: [],

            /**
             * Callback after grid data loading
             */
            loadCallbacks: [],

            /**
             * Callback before row selection/deselection
             * invoked before selection, parameters:
             *      row - row object
             *
             * Should return Boolean value
             * that will be assigned to row._selected
             */
            beforeSelect: null,

            /**
             * Callback after row selection/deselection
             */
            afterSelect: null,

            /**
             * Function should return an unique id value
             * when there is no `ID` field in collection entity
             */
            resolveEntityId: null,

            multiSelect: false,
            selectedIds: null,
            keepSingleSelection: true
        };

        /**
         * Default setting for grid.load method
         */
        var defaultLoadSettings = {
            /**
             * Indicates if grid pagination will be reinitialized
             */
            resetPagination: false
        };

        /**
         * Constructor
         */
        function Grid(settings) {
            var config = _.assign({}, defaults, settings);

            // TODO: split these into private variables and public getters/setters ?
            this.collection = config.collection;
            this.columns = config.columns;
            this.applyMapping(config.mapping);

            this.limit = {
                start: dashboardQueryService.limitStartFromString(config.searchParams.limit),
                perPage: config.itemsPerPage
            };
            this.forcedExtra = config.forcedExtra;
            this.forcedFilters = config.forcedFilters;
            this.initFilters();
            this.applyFilters(config.searchParams);
            this.setSort(config.searchParams.sort);

            this.rowCallbacks = config.rowCallbacks;
            this.loadCallbacks = config.loadCallbacks;
            this.beforeSelect = config.beforeSelect;
            this.afterSelect = config.afterSelect;
            this.resolveEntityId = config.resolveEntityId;

            this.multiSelect = config.multiSelect;
            this.selectedIds = config.selectedIds;
            this.keepSingleSelection = config.keepSingleSelection;
        }


        // Methods
        /////////////////////////////////////////

        Grid.prototype = {

            /**
             * Loads collection and converts each collection entity into grid row item
             * Row item is an object that copies all fields form entity item
             * accordingly to mapping object
             *
             * Row has system fields:
             *      _id          - {String} required, unique entity ID string
             *      _selected    - {Boolean} changed while selecting in grid
             *      _link        - {String} link for a column with 'isLink'=true
             *      _source      - {Object} collection entity object
             *      _disabled    - {Boolean} row is disabled for selection
             */
            load: function(settings) {
                var config = _.assign({}, defaultLoadSettings, settings);

                var loadDeferred = $q.defer();
                var self = this;
                var apiLoadCollection = dashboardGridApiService[this.collection + 'List'];

                if (config.resetPagination) {
                    this.setupPagination();
                }

                apiLoadCollection(this.getRequestParams()).$promise
                    .then(function(response) {
                        if (response.error === null) {

                            var rows = [];
                            _.forEach(response.result, function(entity, key, collection) {
                                var row = self.convertEntityToRow(entity);
                                row._source = entity;

                                // Apply callbacks to each row
                                _.forEach(self.rowCallbacks, function(callback) {
                                    var result = callback.call(self, row, key, collection);
                                    if (result !== undefined) {
                                        row = result;
                                    }
                                });

                                rows.push(row);
                            });
                            self.rows = rows;

                            // Apply load callbacks
                            _.forEach(self.loadCallbacks, function(callback) {
                                callback.call(self);
                            });

                            loadDeferred.resolve(rows);

                        } else {
                            loadDeferred.reject(null);
                        }
                    }, function() {
                        loadDeferred.reject(null);
                    });

                return loadDeferred.promise;
            },

            /**
             * Returns parameters object for api call
             */
            getRequestParams: function() {
                var requestFilterParams = this.getRequestFiltersParams();
                var params = _.assign({}, requestFilterParams, this.forcedFilters);
                var extraParam = this.getRequestExtraParam();
                if (extraParam !== '') {
                    params.extra = extraParam;
                }
                var sortParam = this.getRequestSortParam();
                if (sortParam !== '') {
                    params.sort = sortParam;
                }
                params.limit = dashboardQueryService.limitToString(this.limit);

                return params;
            },

            /**
             * Converts collection entity into row item accordingly to mapping
             */
            convertEntityToRow: function(entity) {
                var row = {};

                _.forEach(this.mapping.field, function(columnKey, entityKey) {
                   row[columnKey] = entity[entityKey];
                });

                if (entity.Extra !== null) {
                    _.forEach(this.mapping.extra, function(columnKey, extraKey) {
                        row[columnKey] = entity.Extra[extraKey]
                    });
                }

                // Always set _id for selection implementation
                if (entity.ID) {
                    row._id = entity.ID;
                } else {
                    row._id = this.resolveEntityId(entity);
                }

                row._selected = isIdSelected(row._id, this.selectedIds);

                return row;
            },

            /**
             * Return count of collection items
             */
            count: function() {
                var countDeferred = $q.defer();
                var apiGetCount = dashboardGridApiService[this.collection + 'Count'];

                apiGetCount(this.getRequestParams()).$promise
                    .then(function(response) {
                        if (response.error === null && response.result !== null) {
                            countDeferred.resolve(response.result);
                        } else {
                            countDeferred.reject(null);
                        }
                    }, function() {
                        countDeferred.reject(null);
                    });

                return countDeferred.promise;
            },

            /**
             * Init filters for each column
             */
            initFilters: function() {
                var filters = [];
                _.forEach(this.columns, function(column) {
                    var filter = {};
                    filter.type = column.editor || 'not_editable';
                    filter.key = column.key;
                    filter.entityKey = column.entityKey;
                    filters.push(filter);
                });

                this.filters = filters;
            },

            /**
             *  Apply filters from params object
             *  { size: '~small' } -> filter { key: 'size', value: '~small' }
             */
            applyFilters: function(params) {
                _.forEach(this.filters, function(filter) {
                    if (params[filter.key] !== undefined) {
                        filter.value = params[filter.key];
                    }
                })
            },

            /**
             *  Returns an object of filters key-values that can be shown in the view
             */
            getColumnsFiltersParams: function() {
                var filtersParams = {};
                _.forEach(this.filters, function(filter) {
                    if (filter.value !== undefined) {
                        filtersParams[filter.key] = filter.value;
                    }
                });

                return filtersParams;
            },

            /**
             * Returns an object of filters key-values that are sent to the server in a request
             */
            getRequestFiltersParams: function() {
                var filtersParams = {};
                _.forEach(this.filters, function(filter) {
                    if (filter.value !== undefined) {
                        filtersParams[filter.entityKey] = filter.value;
                    }
                });

                return filtersParams;
            },

            /**
             * Assign sort parameter defined in search parameters to a grid column
             * search: { sort: 'name' } -> column { key: 'name', ... , sort: 'ASC' }
             */
            setSort: function(sortStr) {
                var sort = dashboardQueryService.sortFromString(sortStr);
                if (sort !== null) {
                    var column = _.filter(this.columns, { key: sort.column})[0];
                    if (column) {
                        column.sort = sort.direction;
                    }
                }
            },

            /**
             * Return current sort parameter as a string
             * column { key: 'name', ... , sort: 'DESC' } -> '^name'
             */
            getColumnSortParam: function() {
                var sortParam = '';
                _.forEach(this.columns, function(column) {
                    if (column.sort) {
                        sortParam = dashboardQueryService.sortToString({ column: column.key, direction: column.sort });
                        return false;
                    }
                });

                return sortParam;
            },

            /**
             * Returns sorting parameter for a request to the server
             */
            getRequestSortParam: function() {
                var sortParam = '';
                _.forEach(this.columns, function(column) {
                    if (column.sort) {
                        sortParam = dashboardQueryService.sortToString({ column: column.entityKey, direction: column.sort });
                        return false;
                    }
                });

                return sortParam;
            },

            /**
             * Applies mapping to grid columns
             * adds to each column 'entityKey' - actual field key in collection entity,
             * from which column value is obtained
             */
            applyMapping: function(mapping) {
                var self = this;
                _.forEach(mapping.field, function(columnKey, entityKey) {
                    var column = _.filter(self.columns, { key: columnKey })[0];
                    if (column) {
                        column.entityKey = entityKey;
                    }
                });
                _.forEach(mapping.extra, function(columnKey, entityKey) {
                    var column = _.filter(self.columns, { key: columnKey })[0];
                    if (column) {
                        column.entityKey = entityKey;
                    }
                });

                this.mapping = mapping;
            },

            /**
             * Returns extra parameter for a request
             */
            getRequestExtraParam: function() {
                var forcedExtra = this.forcedExtra.split(',');
                var extra = Object.keys(this.mapping.extra);
                return extra.concat(forcedExtra).join(',');
            },

            /**
             * Returns search parameters that are shown in the view
             */
            getViewSearchParams: function() {
                var params = this.getColumnsFiltersParams();
                var sortParam = this.getColumnSortParam();
                if (sortParam !== '') {
                    params.sort = sortParam;
                }
                params.limit = dashboardQueryService.limitToString(this.limit);

                return params;
            },

            /**
             * Updates rows._selected states and selectedIds after selection in grid
             */
            updateSelection: function(affectedRow, selectionState) {
                var _id = affectedRow._id;
                if (_id === undefined) return;

                var selectedIds = this.selectedIds;

                // When grid is multi select
                if (this.multiSelect) {
                    if (selectionState === true) {
                        affectedRow._selected = true;
                        if (!(selectedIds instanceof Array)) {
                            selectedIds = [];
                        }
                        selectedIds.push(_id);
                    } else {
                        affectedRow._selected = false;
                        var idIndex = selectedIds.indexOf(_id);
                        selectedIds.splice(idIndex, 1);
                    }

                // When is single select
                } else {
                    if (selectionState === true) {
                        _.forEach(this.rows, function(row) {
                            row._selected = Boolean(row._id === _id);
                        });
                        selectedIds = _id;
                    } else {
                        affectedRow._selected = false;
                        selectedIds = null;
                    }
                }

                this.selectedIds = selectedIds;

                // Invoke callback after selection
                if (this.afterSelect) {
                    this.afterSelect();
                }
            },

            /**
             * Setups pagination settings
             */
            setupPagination: function() {
                var self = this;
                var pagination = {};

                return this.count(this.getRequestParams()).then(function(count) {
                    pagination.count = count;
                    pagination.pages = 300;
                    pagination.page = Math.floor(self.limit.start / self.limit.perPage) + 1;
                    self.pagination = pagination;
                });
            },

            /**
             * Sets grid limit settings accordingly to page parameter
             */
            changePage: function(page) {
                if (!this.pagination.count) return;
                this.limit.start = (page - 1) * this.limit.perPage;
            }
        };


        // Helpers
        /////////////////////////////////////////

        /**
         * Checks if id in selectedIds
         */
        function isIdSelected(id, selectedIds) {
            if (!selectedIds) {
                return false;
            } else if (selectedIds instanceof Array) {
                return selectedIds.indexOf(id) !== -1;
            } else {
                return id === selectedIds;
            }
        }

        return {
            grid: function(settings) {
                return new Grid(settings);
            }
        }
    }]);