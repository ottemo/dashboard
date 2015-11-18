angular.module("discountsModule")

/**
 * code
 * name
 * until
 * since
 * amount
 * percent
 * times
 */
.service("$discountsService", [
	"$http",
	"REST_SERVER_URI",
	"moment",
	"timezoneService",
	function ($http, REST_SERVER_URI, moment, timezoneService) {
		var _url = REST_SERVER_URI + '/coupons';

		var defaults = {
			isNoLimit: true,
			times: -1,
			type: 'amount'
		};

		var service = {
			one: one,
			post: post,
			put: put,
			getList: getList,
			defaults: defaults
		};

		return service;

		////////////////////////////

		function _transformResponse(discount) {
			var _storeTz = timezoneService.storeTz;

			// Process the datetime, down to just a date
			discount.sinceLocal = moment(discount.since).utcOffset(_storeTz).format('YYYY-MM-DD');
			discount.untilLocal = moment(discount.until).utcOffset(_storeTz).format('YYYY-MM-DD');

			// Some helper methods
			discount.type = discount.amount ? 'amount' : 'percent';
			discount.isNoLimit = (discount.times == -1);

			return discount;
		}

		function _transformRequest(discount) {
			var _storeTz = ' ' + timezoneService.storeTz;

			discount.since = moment(discount.sinceLocal + _storeTz, 'YYYY-MM-DD Z').toISOString();
			discount.until = moment(discount.untilLocal + _storeTz, 'YYYY-MM-DD Z').toISOString();

			return discount;
		}

		function one(id) {
			return $http.get(_url + '/' + id).then(function(response){
				return _transformResponse(response.data.result);
			});
		}

		function post(data) {
			// processing the params can effect the source data, so we need to copy it out
			var params = {};
			angular.copy(data, params);

			params = _transformRequest(params);
			return $http.post(_url, params).then(function(response){
				return response.data.result;
			});
		}

		function put(data) {
			// processing the params can effect the source data, so we need to copy it out
			var params = {};
			angular.copy(data, params);

			params = _transformRequest(params);

			return $http.put(_url +'/' + params._id, params).then(function(response){
				return response.data.result;
			});
		}

		function getList() {
			return $http.get(_url).then(function(response){
				var results = response.data.result || [];
				results = results.map(function(discount) {
					return _transformResponse(discount);
				});

				return results;
			});
		}

	}
]);