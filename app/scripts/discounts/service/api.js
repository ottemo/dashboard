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
	function ($http, REST_SERVER_URI, moment) {
		var _url = REST_SERVER_URI + '/coupons';

		var _normalizeData = function(discount) {
			// Process the datetime, down to just a date
			discount.since = moment(discount.since).format('YYYY-MM-DD');
			discount.until = moment(discount.until).format('YYYY-MM-DD');

			// Some helper methods
			discount.type = discount.amount ? 'amount' : 'percent';
			discount.isNoLimit = (discount.times == -1);

			return discount;
		}

		var _processDates = function(discount) {
			discount.since = moment(discount.since).format();
			discount.until = moment(discount.until).format();
			return discount;
		}

		this.defaults = {
			noLimit: true,
			times: -1,
			type: 'amount'
		};

		this.one = function(id) {
			return $http.get(_url + '/' + id).then(function(response){
				var result = response.data.result;
				return _normalizeData(result);
			});
		}

		this.post = function(data) {
			// processing the params can effect the source data, so we need to copy it out
			var params = {};
			angular.copy(data, params);

			params = _processDates(params);
			return $http.post(_url, data).then(function(response){
				return response.data.result;
			});
		}

		this.put = function(data) {
			// processing the params can effect the source data, so we need to copy it out
			var params = {};
			angular.copy(data, params);

			params = _processDates(params);
			return $http.put(_url +'/' + data._id, data).then(function(response){
				return response.data.result;
			});
		}

		this.getList = function() {
			return $http.get(_url).then(function(response){
				var results = response.data.result || [];
				results = results.map(function(discount) {
					return _normalizeData(discount);
				});

				return results;
			});
		}

		return this;
	}
]);