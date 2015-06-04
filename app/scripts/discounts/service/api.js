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
	function ($http, REST_SERVER_URI) {
		var _url = REST_SERVER_URI + '/coupons';

		this.one = function(id) {
			return $http.get(_url + '/' + id).then(function(response){
				return response.data;
			});
		}

		this.post = function(data) {
			return $http.post(_url, data).then(function(response){
				return response.data;
			});
		}

		this.put = function(data) {
			return $http.put(_url +'/' + data._id, data).then(function(response){
				return response.data;
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