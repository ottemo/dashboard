angular.module('coreModule')

.service('coreCollectionItemsSelectorApiService', [
    '$resource',
    'REST_SERVER_URI',
    function (
        $resource,
        REST_SERVER_URI
    ) {

    return $resource(REST_SERVER_URI, {}, {
        'productList': {
            method: 'GET',
            url: REST_SERVER_URI + '/products'
        },
        'productCount': {
            method: 'GET',
            params: {
                action: 'count'
            },
            url: REST_SERVER_URI + '/products'
        },

        'orderList': {
            method: 'GET',
            url: REST_SERVER_URI + '/orders'
        },
        'orderCount': {
            method: 'GET',
            params: {
                action: 'count'
            },
            url: REST_SERVER_URI + '/orders'
        }
    });
}]);
