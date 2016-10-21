angular.module('coreModule')

.service('coreCollectionItemsSelectorService', [
    '$uibModal',
    function($uibModal) {
        var DEFAULT_ITEMS_LIMIT = 3;

        var DEFAULT_COLUMNS = [
            {
                label: 'Image',
                key: 'images',
                type: 'images'
            },
            {
                label: 'ID',
                key: 'id',
                editor: 'text',
                type: 'text'
            },
            {
                label: 'Name',
                key: 'name',
                editor: 'text',
                type: 'text'
            },
            {
                label: 'Description',
                key: 'description',
                editor: 'text',
                type: 'text'
            }
        ];

        /**
         * column values to item fields mapping
         * columnKey   <-   itemField
         *
         * id: 'ID'
         * column 'id' <-   item.ID
         *
         * if column isn't present in mapping:
         * column 'price' <- item.Extra.price
         */
        var DEFAULT_MAPPING = {
            id: 'ID',
            name: 'Name',
            images: 'Images',
            description: 'Desc'
        };

        function modalSelector(params) {
            return $uibModal.open({
                controller: 'coreCollectionItemsSelectorController',
                templateUrl: "/views/core/collection-items-selector.html",
                size: 'lg',
                controllerAs: 'vm',
                resolve: applyParams(params)
            });
        }

        function applyParams(params) {
            return {
                config: function () {
                    return {
                        collection: params.collection || 'product',
                        columns: params.columns || DEFAULT_COLUMNS,
                        mapping: params.mapping || DEFAULT_MAPPING,
                        extraFields: params.extraFields || '',

                        interactWithLocation: params.interactWithLocation || false,
                        searchParams: params.searchParams || {},
                        itemsPerPage: params.itemsPerPage || DEFAULT_ITEMS_LIMIT,

                        multiSelect: params.multiSelect || false,
                        selection: params.selection || [],

                        heading: params.heading || '',
                        buttons: params.buttons || []
                    }
                },
                callbacks: function () {
                    return {
                        onItemLoad: params.onItemLoad || null,
                        onItemSelect: params.onItemSelect || null
                    }
                }
            };
        }

        return {
            modalSelector: modalSelector,
            applyParams: applyParams
        };
}]);