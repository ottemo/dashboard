angular.module("discountsModule")

.controller("discountsListController", [
"$scope",
"$discountsService",
function($scope, $discountsService){
	$discountsService.get(function(response){
		$scope.discounts = response.result;
	});
}]);