angular.module("discountsModule")

.controller("discountsListController", [
"$scope",
"$discountsService",
function($scope, $discountsService){
	$discountsService.query(function(response){
		$scope.discounts = response.result;
	});
}]);