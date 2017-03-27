angular.module('discountsModule')

/**
 * code
 * name
 * until
 * since
 * amount
 * percent
 * times
 */
.service('discountsService', [
    '$http',
    '$q',
    'REST_SERVER_URI',
    'moment',
    'timezoneService',
    function(
        $http,
        $q,
        REST_SERVER_URI,
        moment,
        timezoneService
    ) {
        var _url = REST_SERVER_URI + '/coupons';

        var service = {
            one: one,
            post: post,
            put: put,
            remove: remove,
            getList: getList,
            defaults: defaults,
        };

        return service;

        ////////////////////////////

        function _transformResponse(discountSource) {
            return timezoneService.get().then(adjustDiscount);

            function adjustDiscount(tz) {
                var discount = {};

                angular.merge(discount, defaults(), discountSource);

                // We aren't currently recognizing this property
                delete discount.name;

                // Process the datetime into the storefront tz
                discount.sinceLocal = moment(discount.since).utcOffset(tz).format('YYYY-MM-DD HH:mm');
                discount.untilLocal = moment(discount.until).utcOffset(tz).format('YYYY-MM-DD HH:mm');

                // hack for handling target
                if ( ['order','cart'].indexOf(discount.target) === -1 ) {
                    // extra hack because the list comes back as a string of json `"[123,234]"`
                    discount.target_line_items = angular.fromJson(discount.target);
                    discount.target = 'product';
                } else {
                    discount.target = 'order';
                }

                // hack for handling type
                discount.type = discount.amount ? 'amount' : 'percent';

                return discount;
            }
        }

        function _transformRequest(discountSource) {
            return timezoneService.get().then(adjustDiscount);

            function adjustDiscount(tz) {
                // processing the params can effect the source data, so we need to copy it out
                var discount = {};
                angular.merge(discount, discountSource);

                // We aren't currently recognizing this
                discount.name = discount.code;

                // Process the datetime back
                discount.since = moment(discount.sinceLocal + tz, 'YYYY-MM-DD HH:mm Z').toISOString();
                discount.until = moment(discount.untilLocal + tz, 'YYYY-MM-DD HH:mm Z').toISOString();
                delete discount.sinceLocal;
                delete discount.untilLocal;

                // hack for formatting target
                if (discount.target === 'order') {
                    discount.target = 'cart';
                } else {
                    discount.target = discount.target_line_items;
                }

                // Clean up empty variable
                delete discount.target_line_items;
                delete discount.type;

                return discount;
            }
        }

        function one(id) {
            return $http.get(_url + '/' + id).then(function(response) {
                return _transformResponse(response.data.result);
            });
        }

        function post(data) {
            return _transformRequest(data).then(function(params){
                return $http.post(_url, params);
            }).then(function(response){
                return response.data.result;
            });
        }

        function put(data) {
            return _transformRequest(data).then(function(params){
                return $http.put(_url + '/' + params._id, params);
            })
            .then(function(response) {
                return response.data.result;
            });

        }

        function remove(id) {
            return $http.delete(_url + '/' + id).then(function(response) {
                return response.data.result;
            });
        }

        function getList() {
            return $http.get(_url).then(function(response) {
                var results = response.data.result || [];
                var promiseResults = results.map(_transformResponse);

                return $q.all(promiseResults);
            });
        }

        function defaults() {
            return {
                times: -1,
                limits: {
                    max_usage_qty: -1,
                },
                target: 'order',
                type: 'amount',
            };
        }
    }
]);

