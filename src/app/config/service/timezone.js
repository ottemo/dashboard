angular.module('configModule')

.factory('timezoneService', ['configApiService', '$q',
    function(configApiService, $q) {
        var service = {
            init: init,
            storeTz : 0
        };

        return service;

        ////////////////////////

        function init() {

            // Cache the store tz
            configApiService.getPath({path: 'general.store.timezone'}).$promise
                .then(function(response) {
                    service.storeTz = response.result.substr(3);
                });
        }
    }
]);

