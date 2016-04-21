angular.module('reportsModule')

.factory('reportsService', [
    '$http', 'REST_SERVER_URI',
    function($http, REST_SERVER_URI) {

        var baseUrl = REST_SERVER_URI + '/reporting/';
        var service = {
            product: getProductPerformance,
            customerActivity: getCustomerActivity,
            paymentMethod: getPaymentMethod,
            shippingMethod: getShippingMethod,
            locationUS: locationUS,
            locationCountry: locationCountry,
        };

        return service;

        ///////////////////////////

        function _getResult(response) {
            return response.data.result;
        }

        function getProductPerformance(params) {
            var url = baseUrl + '/product-performance';
            var config = { params: params };

            return $http.get(url, config).then(_getResult);
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

            return $http.get(url, config).then(_getResult);
        }

        function getPaymentMethod(params) {
            var url = baseUrl + 'payment-method';
            var config = { params: params };

            return $http.get(url, config).then(_getResult);
        }

        function getShippingMethod(params) {
            var url = baseUrl + 'shipping-method';
            var config = { params: params };

            return $http.get(url, config).then(_getResult);
        }

        function locationUS(params) {
            var url = baseUrl + 'location-us';
            var config = { params: params };

            return $http.get(url, config).then(_getResult);
        }

        function locationCountry(params) {
            var url = baseUrl + 'location-country';
            var config = { params: params };

            return $http.get(url, config).then(_getResult);
        }
    }
]);

