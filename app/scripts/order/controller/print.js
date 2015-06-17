angular.module("orderModule")

.controller("orderPrintController", [
"$scope",
"$location",
"$q",
"$orderApiService",
function($scope, $location, $q, $orderApiService) {
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

	// Update the title so that we have a nice file name on the print
	var pageTitle = "orders " + (new Date().toString());
	pageTitle = pageTitle.toLowerCase().replace(/ /g, '_');
	document.title = pageTitle;

	$q.all(allPromises)
	.then(function(/*results*/){
		// Give time for angular to apply
		setTimeout(function(){
			window.print();
		}, 1000);
	});

}]);