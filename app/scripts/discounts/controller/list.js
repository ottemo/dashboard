angular.module("discountsModule")

.controller("listController", [
"$scope",
"$discountsService",
function($scope, $discountsService){
	$discountsService.query(function(response){
		$scope.discounts = response.result;
	});
}]);