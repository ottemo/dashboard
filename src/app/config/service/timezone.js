angular.module('configModule')

.factory('timezoneService', ['configApiService', '$q',
    function(configApiService, $q) {
        var storeTz = null;

        var service = {
            init: init, // @deprecated
            get: get,
            storeTz: 0, // @deprecated
        };

        return service;

        ////////////////////////

        function init() {

            // Cache the store tz
            configApiService.getPath({
                    path: 'general.store.timezone'
                }).$promise
                .then(function(response) {
                    service.storeTz = response.result.substr(3);
                });
        }

        function get() {
            // We have the tz return a promise wrapped value
            if (null !== storeTz) {
                return $q.resolve(storeTz)
            }

            var config = {
                path: 'general.store.timezone'
            };

            return configApiService.getPath(config).$promise
                .then(function(response) {
                    storeTz = response.result.substr(3);
                    return storeTz
                })

        }
    }
]);

