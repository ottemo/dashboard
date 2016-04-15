//TODO: Consider moving to coreModule
angular.module('configModule')

.factory('timezoneService', ['configApiService', '$q', 'moment',
    function(configApiService, $q, moment) {
        var storeTz = null;

        var service = {
            get: getTz,
            makeDateRange: makeDateRange,
            init: init, // @deprecated
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

        function getTz() {
            // We have the tz return a promise wrapped value
            if (null !== storeTz) {
                return $q.resolve(storeTz);
            }

            var config = {
                path: 'general.store.timezone'
            };

            return configApiService.getPath(config).$promise
                .then(function(response) {
                    storeTz = response.result.substr(3);
                    return storeTz;
                });
        }

        /**
         * @param  string; today, yesterday, last 7 days, last 30 days
         * @return {[type]}
         */
        function makeDateRange(rangeString) {
            return getTz().then(function(tz) {
                return _make(tz, rangeString);
            });

            ////////////////////////

            function _make(tz, rangeString) {
                // Default to today
                var startDate = moment().utcOffset(tz);
                var endDate = moment().utcOffset(tz).endOf('day');

                switch (rangeString.toLowerCase()) {
                    case 'all time':
                        return {};
                    case 'today':
                        startDate = startDate.startOf('day');
                        break;
                    case 'yesterday':
                        startDate = startDate.subtract(1, 'day').startOf('day');
                        endDate = moment().utcOffset(tz).subtract(1, 'day').endOf('day');
                        break;
                    case 'last 7 days':
                        startDate = startDate.subtract(7, 'days').startOf('day');
                        break;
                    case 'last 30 days':
                        startDate = startDate.subtract(30, 'days').startOf('day');
                        break;
                    case 'month to date':
                        startDate = startDate.startOf('month');
                        break;
                    case 'year to date':
                        startDate = startDate.startOf('year');
                        break;
                }

                return {
                    start_date: startDate.toISOString(),
                    end_date: endDate.toISOString(),
                };
            }
        }
    }
]);

