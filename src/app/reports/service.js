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

        function getProductPerformance(dates) {
            var url = REST_SERVER_URI + '/reporting/product-performance';
            var config = {
                params: {
                    start_date: dates.startDate.toISOString(),
                    end_date: dates.endDate.toISOString(),
                }
            };

            console.log('fetching product performance report for:', config.params);

            return $http.get(url, config).then(function(response) {
                return response.data.result
            });
        }
    }
]);

