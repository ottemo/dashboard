angular.module('coreModule')

.service('coreCollectionItemsSelectorService', [
    '$uibModal',
    function($uibModal) {
        var DEFAULT_ITEMS_LIMIT = 3;
        var DEFAULT_FIELDS = [
            {
                label: 'Image',
                key: 'image',
                editor: 'not_editable'
            },
            {
                label: 'ID',
                key: 'id',
                editor: 'text'
            },
            {
                label: 'Name',
                key: 'name',
                editor: 'text'
            },
            {
                label: 'Description',
                key: 'description',
                editor: 'text'
            }
        ];
        var DEFAULT_MAPPING = {
            id: 'ID',
            name: 'Name',
            image: 'Image',
            description: 'Desc'
        };

        function modalSelector(params) {
            return $uibModal.open({
                controller: 'coreCollectionItemsSelectorController',
                templateUrl: "/views/core/collection-items-selector.html",
                size: 'lg',
                resolve: getControllerInjections(params)
            });
        }

        function getControllerInjections(params) {
            return {
                collection: function () {
                    return {
                        name: params.collection || 'product',
                        columns: params.columns || DEFAULT_FIELDS,
                        mapping: params.mapping || DEFAULT_MAPPING,
                        searchQuery: params.searchQuery || ''
                    }
                },
                entities: function () {
                    return {
                        selected: params.selectedItems || [],
                        handle: params.handleEntity || null,
                        selectCallback: params.onSelect || null
                    }
                },
                view: function () {
                    return {
                        heading: params.heading || '',
                        buttons: params.buttons || [],
                        itemsPerPage: params.itemsPerPage || DEFAULT_ITEMS_LIMIT,
                        multiSelect: params.multiSelect || false
                    }
                }
            };
        }

        return {
            modalSelector: modalSelector
        };
}]);