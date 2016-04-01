angular.module('reportsModule')

.factory('reportsService', [
    '$http',
    'REST_SERVER_URI',
    'timezoneService',
    'moment',
    function($http, REST_SERVER_URI, timezoneService, moment) {

        var service = {
            product: getProductPerformance,
        };

        return service;

        ///////////////////////////

        function getProductPerformance(startDate, endDate) {
            return timezoneService.get().then(function(tz) {
                var params = transformDates(tz, startDate, endDate);
                return fetchProductReport(params)
            })

            //////////

            // apply tz and format for server
            function transformDates(tz, startDate, endDate) {
                var params = {
                    start_date: moment(startDate).utcOffset(tz).toISOString(),
                    end_date: moment(endDate).utcOffset(tz).toISOString(),
                };
                console.log(params); //TODO: CLEANUP
                return params;
            }

            // fetch report and parse response
            function fetchProductReport(params) {
                var url = REST_SERVER_URI + '/reporting/product-performance';
                var config = {
                    params: params
                };

                return $http.get(url, config).then(function(response) {
                    return response.data.result
                })

            }
        }
    }
]);

