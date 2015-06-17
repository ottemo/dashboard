angular.module("orderModule")

.controller("orderPrintController", [
"$scope",
"$location",
"$orderApiService",
function($scope, $location, $orderApiService) {
	var search = $location.search();
	var orderIds = false;
	if (search.ids){
		orderIds = search.ids.split(',');
	}

	console.log(orderIds);

}]);