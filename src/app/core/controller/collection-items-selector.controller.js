angular.module('coreModule')

    .controller('coreCollectionItemsSelectorController', [
        '$scope',
        'coreCollectionItemsSelectorApiService',
        'collection',
        'entities',
        'view',
        function ($scope, coreCollectionItemsSelectorApiService, collection, entities, view) {
            var vm = this;
            $scope.filters = [];
            $scope.page = 1;
            $scope.columns = collection.columns;

            activate();

            /////////////////////////////////////////

            function activate() {
                vm.mapping = getColumnMapping(collection.columns, collection.mapping);
                console.log(vm.mapping);
                vm.extraQuery = getExtraQuery(vm.mapping);
                console.log(vm.extraQuery);

                var searchParams = getSearchParams(collection.searchQuery);
                console.log(searchParams);

                vm.filters = getFiltersConfig(searchParams, collection.columns);
                console.log(vm.filters);

                $scope.pagination = getPaginationConfig(searchParams, view.itemsPerPage);
                console.log($scope.pagination);

                getEntities().then(function(response) {
                    if (response.error === null) {
                        var collectionItems = response.result;
                        var viewItems = _.map(collectionItems, convertToViewItem)
                        $scope.items = viewItems;
                    }
                });
            }

            function updateCollection() {

                console.log('update');
            }

            function convertToViewItem(collectionItem) {
                var viewItem = {};

                _.each(collection.columns, function(column) {
                    var key = column.key;
                    var mapping = vm.mapping[key];

                    var columnValue;
                    if (mapping.extraField) {
                        columnValue = collectionItem.Extra[mapping.extraField];
                    } else {
                        columnValue = collectionItem[mapping.entityField];
                    }

                    viewItem[key] = columnValue;
                });

                if (entities.handle) {
                    return entities.handle(viewItem);
                } else {
                    return viewItem;
                }
            }


            function getLimitQuery() {
                return [
                    $scope.pagination.itemsPerPage * ($scope.pagination.page - 1),
                    $scope.pagination.itemsPerPage * ($scope.pagination.page)
                ].join(',');
            }

            function getViewFilters() {
                var currentFilters = [];
                _.each($scope.filters, function(filter) {
                    if (filter.type && filter.model) {
                        currentFilters.push(filter.key + '=' + filter.model.getFilter());
                    }
                });

                return currentFilters;
            }

            function getPaginationConfig(searchParams, itemsPerPageConfig) {
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

            function getSearchParams(query) {
                var searchItems = query.split('&');

                var searchParams = {};
                _.each(searchItems, function(searchItem) {
                    var searchItemParts = searchItem.split('=');
                    if (searchItemParts.length === 2) {
                        var searchItemKey = searchItemParts[0];
                        var searchItemValue = searchItemParts[1];
                        searchParams[searchItemKey] = searchItemValue;
                    }
                });

                return searchParams;
            }

            function getColumnMapping(columns, mappingSetting) {
                var mapping = {};

                _.each(columns, function(column) {
                    var key = column.key;

                    if (key in mappingSetting) {
                        mapping[key] = { entityField: mappingSetting[key] };
                    } else {
                        mapping[key] = { extraField: key };
                    }
                });

                return mapping;
            }

            function getExtraQuery(mapping) {
                var extraQuery = [];

                _.each(mapping, function(columnMapping) {
                    if ('extraField' in columnMapping) {
                        extraQuery.push(columnMapping.extraField)
                    }
                });

                return extraQuery.join(',');
            }

            function getFiltersConfig(searchParams, columns) {
                var filterConfig = [];
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

                    filterConfig.push(filter);
                });

                return filterConfig;
            }

            function getRequestParams() {
                var params = getViewFilters() || {};
                params.limit = getLimitQuery();
                params.extra = vm.extraQuery;
                console.log(params);
                return params;
            }

            function getEntities() {
                var params = getRequestParams();
                return coreCollectionItemsSelectorApiService[collection.name + 'List'](params).$promise;
            }
        }]);