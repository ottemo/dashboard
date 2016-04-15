angular.module('reportsModule')

.factory('reportsService', [
    '$http',
    'REST_SERVER_URI',
    'timezoneService',
    'moment',
    function($http, REST_SERVER_URI, timezoneService, moment) {

        var baseUrl = REST_SERVER_URI + '/reporting/';
        var service = {
            product: getProductPerformance,
            customerActivity: getCustomerActivity,
            paymentMethod: getPaymentMethod,
        };

        return service;

        ///////////////////////////

        function getProductPerformance(params) {
            var url = baseUrl + '/product-performance';
            var config = { params: params };

            console.log('fetching product performance report for:', config.params);

            return $http.get(url, config).then(function(response) {
                return response.data.result;
            });
        }

        /**
         * Gets the customer activity report
         *
         * @param  start_date
         * @param  end_date
         * @param  sort
         */
        function getCustomerActivity(params){
            var url = baseUrl + 'customer-activity';
            var config = { params: params };

            console.log('fetching product performance report for:', config.params);

            return $http.get(url, config).then(function(response) {
                return response.data.result;
            });
        }

        function getPaymentMethod(params) {
            var url = baseUrl + 'payment-method';
            var config = { params: params };

            return $http.get(url, config).then(function(response) {
                return response.data.result;
            });
        }
    }
]);

