angular.module('coreModule')

    .controller('coreCollectionItemsSelectorController', [
        '$scope',
        'coreCollectionItemsSelectorApiService',
        'config',
        'callbacks',
        '$uibModalInstance',
        function ($scope, coreCollectionItemsSelectorApiService, config, callbacks, $uibModalInstance) {
            var vm = this;
            $scope.model = {
                activate: activate
            };

            activate(config, callbacks);

            /////////////////////////////////////////

            function activate(config, callbacks) {
                vm.config = config;
                vm.callbacks = callbacks;
                vm.columns = config.columns;
                vm.searchParams = config.searchParams;
                vm.mapping = getColumnMapping(vm.columns, config.mapping, config.extraFields);
                vm.extraQuery = getExtraQuery(vm.mapping, config.privateFields);
                vm.filters = initFilters(vm.columns, vm.searchParams);
                vm.pagination = initPagination(vm.searchParams, config.itemsPerPage);

                initEntities().then(function(response) {
                    if (response.error === null) {
                        var collectionItems = response.result;
                        vm.items = _.map(collectionItems, convertToViewItem);
                    }
                });
            }

            $scope.selectItem = function(item, $event) {
                if (vm.config.multiSelect) {

                } else {
                    $uibModalInstance.close(true);
                }

                if ($event) {
                    $event.preventDefault();
                }
            };

            function convertToViewItem(collectionItem) {
                var viewItem = {};

                _.each(vm.mapping, function(map, key) {
                    var columnValue;
                    if (map.extraField !== undefined) {
                        if (collectionItem.Extra) {
                            columnValue = collectionItem.Extra[map.extraField];
                        }
                    } else if (map.entityField !== undefined) {
                        columnValue = collectionItem[map.entityField];
                    }

                    viewItem[key] = columnValue;
                });

                if (vm.callbacks.onItemLoad) {
                    vm.callbacks.onItemLoad(viewItem);
                }

                return viewItem;
            }


            function getLimitQuery() {
                return [
                    vm.pagination.itemsPerPage * (vm.pagination.page - 1),
                    vm.pagination.itemsPerPage * (vm.pagination.page)
                ].join(',');
            }

            function getViewFilters() {
                var currentFilters = [];
                _.each(vm.filters, function(filter) {
                    if (filter.type && filter.model) {
                        currentFilters.push(filter.key + '=' + filter.model.getFilter());
                    }
                });

                return currentFilters;
            }

            function initPagination(searchParams, itemsPerPageConfig) {
                var itemsPerPage = itemsPerPageConfig;
                var currentPage = 1;

                if (searchParams.limit) {
                    var limitItems = searchParams.limit.split(',');
                    if (limitItems.length === 2) {
                        var limitStart = +limitItems[0];
                        var limitEnd = +limitItems[1];
                        if (limitEnd - limitStart > 1 && limitStart >= 0) {
                            itemsPerPage = limitEnd - limitStart;
                            currentPage = Math.floor(limitStart / itemsPerPage) + 1;
                        }
                    }
                }

                return {
                    itemsPerPage: itemsPerPage,
                    page: currentPage
                };
            }

            function getColumnMapping(columns, mappingConfig, extraFields) {
                var mapping = {};

                _.each(columns, function(column) {
                    var key = column.key;

                    if (key in mappingConfig) {
                        mapping[key] = { entityField: mappingConfig[key] };
                    } else {
                        mapping[key] = { extraField: key };
                    }
                });

                _.each(extraFields.split(','), function(extraField) {
                   if (!(extraField in mapping)) {
                       mapping[extraField] = { extraField: extraField };
                   }
                });

                return mapping;
            }

            function getExtraQuery(mapping) {
                var extraQuery = [];

                _.each(mapping, function(mappingItem) {
                    if (mappingItem.extraField !== undefined) {
                        extraQuery.push(mappingItem.extraField)
                    }
                });

                return extraQuery.join(',');
            }

            function initFilters(columns, searchParams) {
                var filters = [];
                _.each(columns, function(column) {
                    var filter = {
                        key: column.key
                    };

                    if (column.editor) {
                        filter.type = column.editor;
                        if (searchParams[column.key]) {
                            filter.value = searchParams[column.key];
                        }
                    }

                    filters.push(filter);
                });

                return filters;
            }

            function initEntities() {
                var params = getViewFilters() || {};
                params.limit = getLimitQuery();
                params.extra = vm.extraQuery;
                return coreCollectionItemsSelectorApiService[vm.config.collection + 'List'](params).$promise;
            }
        }]);