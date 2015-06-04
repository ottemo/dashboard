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

		this.one = function(id) {
			return $http.get(_url + '/' + id).then(function(response){

				//"2015-05-06T00:00:00Z" -> yyyy-mm-dd
				var result = response.data.result;
				result.since = moment.utc(result.since).format('YYYY-MM-DD');
				result.until = moment.utc(result.until).format('YYYY-MM-DD');

				return result;
			});
		}

		this.post = function(data) {
			return $http.post(_url, data).then(function(response){
				return response.data.result;
			});
		}

		this.put = function(data) {
			return $http.put(_url +'/' + data._id, data).then(function(response){
				return response.data.result;
			});
		}

		this.getList = function() {
			return $http.get(_url).then(function(response){
				return response.data.result || [];
			});
		}

		return this;
	}
]);