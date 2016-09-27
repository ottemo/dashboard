angular.module('seoModule')

.service('seoApiService', ['$resource', 'REST_SERVER_URI', function ($resource, REST_SERVER_URI) {
    return $resource(REST_SERVER_URI, {}, {
        'add': {
            method: 'POST',
            url: REST_SERVER_URI + '/seo/item'
        },
        'remove': {
            method: 'DELETE',
            url: REST_SERVER_URI + '/seo/item/:itemID'
        },
        'canonical': {
            method: 'GET',
            params: { id: '@id'},
            url: REST_SERVER_URI + '/seo/canonical/:id'
        },
        'getAttributes': {
            method: 'GET',
            url: REST_SERVER_URI + '/seo/attributes'
        },
        'listSeo': {
            method: 'GET',
            url: REST_SERVER_URI + '/seo/items'
        },
        'getCount': {
            method: 'GET',
            params: { action: 'count'},
            url: REST_SERVER_URI + '/seo/items'
        },
        'update': {
            method: 'PUT',
            url: REST_SERVER_URI + '/seo/item/:itemID'
        }
    });
}]);
