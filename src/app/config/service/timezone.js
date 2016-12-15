angular.module('configModule')

.factory('timezoneService', ['configApiService', '$q', 'moment',
    function(configApiService, $q, moment) {
        var tzPromise = false;

        var service = {
            get: getTz,
            makeDateRange: makeDateRange,
        };

        return service;

        ////////////////////////

        function getTz() {

            if (!tzPromise){
                var config = { path: 'general.store.timezone' };

                tzPromise = configApiService.getPath(config).$promise
                    .then(function(response) {
                        return response.result.substr(3) || '+0000';
                    });
            }

            return tzPromise;
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

