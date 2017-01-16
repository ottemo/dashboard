angular.module('dashboardModule')

/**
 * coreGridService creates Grid instances - models of collections on the server
 */

    .service('coreGridService', [
        '_',
        '$q',
        'coreGridApiService',
        'coreParserService',
        function (
            _,
            $q,
            coreGridApiService,
            coreParserService
        ) {

        var ITEMS_PER_PAGE = 15;

        /**
         * Constructor
         */
        function Grid(settings) {

            var defaults = {

                /**
                 * Grid columns
                 * Each columns is an object with properties:
                 *      key
                 *      label          - column title,
                 *      type           - value type,
                 *      editor         - filter type,
                 *      options        - {JSON} key-value pairs for filter type='select'
                 *                          {"red": "Red", "blue": "Blue"}
                 *      _not_sortable  - {Boolean} forbid sorting for the column
                 *      _selected_only - {Boolean} show column value only for selected rows
                 *      _link          - {Boolean} column value is wrapped with <a> element
                 *                              with 'href' = row._link
                 */
                columns: [
                    {
                        key: 'image',
                        label: 'Image',
                        type: 'image',
                        _not_sortable: true
                    },
                    {
                        key: 'id',
                        label: 'ID',
                        type: 'text',
                        editor: 'text',
                        _link: true
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
                 * defines how value for each column in row is obtained from collection entity
                 * field: { ID: 'id' }                  entity.ID -> row.id
                 * extra: { customer_email: 'email' }   entity.Extra.customer_email -> row.email
                 *
                 * It may make filters, that are visible in a view, be different from filters,
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
                 * Collection primary key
                 */
                collectionPrimaryKey: '_id',

                /**
                 * Search params object
                 * may contain filters, sort and limit parameters
                 * { sort: '^created_at', limit: '10,25' }
                 *
                 * Used to initialize grid with parameters from page url
                 */
                searchParams: {},

                /**
                 * Extra parameters that are always passed in request
                 * e.g: 'weight,price'
                 */
                forcedExtra: '',

                /**
                 * Filters that are not visible in view and always passed to the server
                 * e.g.:
                 * { status=processed } - users are not allowed to change that filter,
                 * and it will be always passed in request
                 */
                forcedFilters: {},

                itemsPerPage: ITEMS_PER_PAGE,

                /**
                 * Function should return an unique entity id value
                 * when there is no `ID` field in collection entity
                 */
                resolveEntityId: null,

                multiSelect: false,
                selectedIds: []
            };

            var config = $.extend({}, defaults, settings);

            this.collection = config.collection; // Collection name, e.g. 'product', 'order'
            this.multiSelect = config.multiSelect;
            this.collectionPrimaryKey = config.collectionPrimaryKey;
            this.forcedExtra = config.forcedExtra;
            this.forcedFilters = config.forcedFilters;
            this.resolveEntityId = config.resolveEntityId;
            this.events = {};

            this.initColumns(config.columns);
            this.initMapping(config.mapping);
            this.initFilters();
            this.initPagination(config.itemsPerPage);

            this.applyParams(config.searchParams);

            // Set selected rows from either
            //      {Array} config.selectedIds, or
            //      {String} config.searchParams._sel
            if (config.selectedIds.length !== 0) {
                this.selectedIds = config.selectedIds;
            } else {
                this.selectedIds = coreParserService.idsFromString(config.searchParams._sel);
            }
        }


        // Methods
        /////////////////////////////////////////

        Grid.prototype = {

            /**
             * Loads collection and converts each collection entity into grid row item
             * Row item is an object that copies all fields form entity item
             * accordingly to mapping object
             *
             * {Object} settings
             * getCount             - {Boolean} get collection entities count for pagination
             * resetPage            - {Boolean} reset pagination on the first page
             *
             * Row has system fields:
             *      _id             - {String} required, unique entity ID string
             *      _selected       - {Boolean} changed while selecting in grid
             *      _links          - {Object} urls for column links
             *      _source         - {Object} collection entity object
             *      _disabled       - {Boolean} row is disabled for selection
             *      _not_selectable - {Boolean} row cannot be selected
             */
            load: function(settings) {

                var self = this;
                var loadDeferred = $q.defer();
                var apiLoadCollection = coreGridApiService[this.collection + 'List'];

                if (settings.getCount) {
                    this.resetPagination(settings.resetPage);
                }

                apiLoadCollection(this.getRequestParams()).$promise
                    .then(function(response) {
                        if (response.error === null) {

                            var rows = [];
                            _.forEach(response.result, function(entity, key, collection) {
                                var row = self.convertEntityToRow(entity);
                                row._source = entity;

                                self.trigger('rowCreated', {
                                    row: row,
                                    index: key,
                                    collection: collection
                                });

                                rows.push(row);
                            });
                            self.rows = rows;

                            self.trigger('load');
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
             * Returns object with parameters for server request
             */
            getRequestParams: function() {
                var filterParams = this.getRequestFiltersParams();
                var params = $.extend({}, filterParams, this.forcedFilters);

                var extraParam = this.getRequestExtraParam();
                if (extraParam !== '') {
                    params.extra = extraParam;
                }

                var sortParam = this.getRequestSortParam();
                if (sortParam !== '') {
                    params.sort = sortParam;
                }

                params.limit = coreParserService.paginationToString(this.pagination);

                return params;
            },

            /**
             * Converts collection entity into a row item accordingly to mapping settings
             */
            convertEntityToRow: function(entity) {
                var row = {};

                _.forEach(this.mapping.field, function(columnKey, entityKey) {
                   row[columnKey] = entity[entityKey];
                });

                _.forEach(this.mapping.extra, function(columnKey, extraKey) {
                    row[columnKey] = (entity.Extra !== null) ? entity.Extra[extraKey] : null;
                });

                // Always set _id for selection implementation
                if (entity.ID != undefined) { // ID !== undefined && ID !== null
                    row._id = entity.ID;
                } else {
                    row._id = this.resolveEntityId(entity);
                }

                row._selected = isIdSelected(row._id, this.selectedIds);

                return row;
            },

            /**
             * Return count of collection entities
             */
            count: function() {
                var countDeferred = $q.defer();
                var apiGetCount = coreGridApiService[this.collection + 'Count'];

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
             * Initialize grid columns from config
             */
            initColumns: function(columnsConfig) {
                var columns = [];
                _.forEach(columnsConfig, function(columnsConfigItem) {
                    var column = $.extend({}, columnsConfigItem);
                    column.type = coreParserService.resolveColumnType(columnsConfigItem.type);
                    columns.push(column);
                });

                this.columns = columns;
            },

            /**
             * Init filters for each column
             */
            initFilters: function() {
                var filters = [];

                if (this.multiSelect) {
                    filters.push({
                        type: 'select',
                        key: '_selection',
                        options: { yes: 'Yes', no: 'No' }
                    });
                }

                _.forEach(this.columns, function(column) {
                    var filter = $.extend({}, column);
                    filter.type = coreParserService.resolveFilterType(column.editor);
                    filters.push(filter);
                });

                this.filters = filters;
            },

            /**
             * Initialize pagination
             */
            initPagination: function(itemsPerPage) {
                this.pagination = {
                    page: 1,
                    itemsPerPage: itemsPerPage
                };
            },

            /**
             * Apply search params to the grid
             */
            applyParams: function(params) {
                this.applyFilters(params);
                this.applySort(params.sort);
                this.applyPage(params.p);
            },

            /**
             *  Apply filters from params object
             *  { size: '~small' } -> filter { key: 'size', value: '~small' }
             */
            applyFilters: function(params) {
                _.forEach(this.filters, function(filter) {
                    if (params[filter.key] !== undefined) {
                        filter.value = coreParserService.filterValueFromUrl(params[filter.key], filter.type);
                    } else {
                        filter.value = undefined;
                    }
                })
            },

            /**
             *  Sets page
             */
            applyPage: function(page) {
                if (page !== undefined) {
                    if (typeof(page) === 'string') {
                        page = coreParserService.pageFromString(page);
                    }

                    this.pagination.page = page;
                    if (this.pagination.count === undefined) {
                        this.pagination.count = page * this.pagination.itemsPerPage;
                    }
                }
            },

            /**
             *  Returns an object of filters key-values that can be shown in the view
             */
            getViewFiltersParams: function() {
                var filtersParams = {};
                _.forEach(this.filters, function(filter) {
                    if (filter.value !== undefined) {
                        filtersParams[filter.key] = coreParserService.filterValueToUrl(filter.value, filter.type);
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
                    if (filter.value !== undefined && filter.key !== '_selection') {
                        filtersParams[filter._entityKey] = filter.value;
                    }
                });

                // Process selection filter,
                // it should be the first filter in multi-select grid
                if (this.multiSelect && this.filters[0] &&
                    this.filters[0].key === '_selection') {

                    var selectionFilter =  this.filters[0];
                    var idKey = this.collectionPrimaryKey;

                    // Don't apply selection filter
                    // if '_id' field already present in filters
                    // or if selection in grid is empty
                    if (selectionFilter.value !== undefined
                        && filtersParams[idKey] === undefined
                        && this.selectedIds.length > 0) {

                        switch(selectionFilter.value) {
                            case 'yes':
                                filtersParams[idKey] = this.selectedIds.join(',');
                                break;
                            case 'no':
                                filtersParams[idKey] = '!=' + this.selectedIds.join(',');
                                break;
                        }
                    }
                }

                return filtersParams;
            },

            /**
             * Assign sort parameter, which can be a string or an object, to a grid column
             * 'name' -> column { key: 'name', ... , sort: 'ASC' }
             * { column: 'name', direction: 'ASC' } -> column { key: 'name', ... , sort: 'ASC' }
             */
            applySort: function(sortParam) {
                var sort = sortParam;
                if (typeof(sort) === 'string') {
                    sort = coreParserService.sortFromString(sort);
                }
                if (sort) {
                    // Reset previous sort
                    _.forEach(this.columns, function(column) {
                        if (column.sort) {
                            column.sort = undefined;
                        }
                    });
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
            getViewSortParam: function() {
                var sortParam = '';
                _.forEach(this.columns, function(column) {
                    if (column.sort) {
                        sortParam = coreParserService.sortToString({ column: column.key, direction: column.sort });
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
                        sortParam = coreParserService.sortToString({ column: column._entityKey, direction: column.sort });
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
            initMapping: function(mapping) {
                var self = this;
                _.forEach(mapping.field, function(columnKey, entityKey) {
                    var column = _.filter(self.columns, { key: columnKey })[0];
                    if (column) {
                        column._entityKey = entityKey;
                    }
                });
                _.forEach(mapping.extra, function(columnKey, entityKey) {
                    var column = _.filter(self.columns, { key: columnKey })[0];
                    if (column) {
                        column._entityKey = entityKey;
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
                var params = this.getViewFiltersParams();
                var sortParam = this.getViewSortParam();
                if (sortParam !== '') {
                    params.sort = sortParam;
                }
                params.p = this.pagination.page;

                var selectedIdsStr = coreParserService.idsToString(this.selectedIds, this.multiSelect);
                if (selectedIdsStr !== '') {
                    params._sel = selectedIdsStr;
                }

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
                        selectedIds = [_id];
                    } else {
                        affectedRow._selected = false;
                        selectedIds = [];
                    }
                }

                this.selectedIds = selectedIds;
                this.trigger('afterSelect', { row: affectedRow, selectionState: selectionState });
            },

            /**
             * Setups pagination settings
             */
            resetPagination: function(resetPage) {
                var self = this;
                if (resetPage) {
                    this.pagination.page = 1;
                }

                return this.count().then(function(count) {
                    self.pagination.count = count;
                });
            },

            // Events
            /////////////////////////////////////////

            /**
             * Adds event listeners to an event
             */
            on: function(eventName, listener) {
                if (eventName in this.events) {
                    this.events[eventName].push(listener);
                } else {
                    this.events[eventName] = [listener];
                }
            },

            /**
             * Triggers an event and invokes listeners that assigned to the event
             */
            trigger: function(eventName, event) {
                var self = this;
                _.forEach(this.events[eventName], function(listener) {
                    if (_.isFunction(listener)) {
                        listener.call(self, event);
                    }
                });
            }
        };


        // Helpers
        /////////////////////////////////////////

        /**
         * Checks if id in selectedIds
         */
        function isIdSelected(id, selectedIds) {
            return selectedIds.indexOf(id) !== -1;
        }

        return {
            grid: function(settings) {
                return new Grid(settings);
            }
        }
    }]);