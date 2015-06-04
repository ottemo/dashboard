angular.module("discountsModule")

.controller("listController", [
	"$scope",
	"$discountsService",
	function($scope, $discountsService){
		$discountsService.getList().then(function(response) {
			$scope.discounts = response.result;
		});
	}
]);