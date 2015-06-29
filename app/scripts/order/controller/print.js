angular.module("orderModule")

.controller("orderPrintController", [
"$scope",
"$location",
"$q",
"$orderApiService",
"$cmsApiService",
function($scope, $location, $q, $orderApiService, $cmsApiService) {
	var search = $location.search();

	var params = {
		_id: search.ids
	}

	$scope.orders = [];
	var allPromises = [];
	angular.forEach(search.ids.split(','), function(id){
		var promise = $orderApiService.getOrder({"orderID": id}).$promise.then(function(resp){
			$scope.orders.push(resp.result);
		});
		allPromises.push(promise);
	});

	// Give time for angular to apply
	$q.all(allPromises)
	.then(function(/*results*/){
		setTimeout(function(){
			window.print();
		}, 1000);
	});

	$scope.cms = {};

	$cmsApiService.blockList({'identifier':'dash-order-print-header', 'extra':'content'}).$promise
	.then(function(resp){
		if (resp.result) {
			var cmsBlock = resp.result[0];
			$scope.cms.header = cmsBlock.Extra.content;
		}
	});
}]);