angular.module("discountsModule")

.controller("listController", [
	"$scope",
	"$discountsService",
	function($scope, $discountsService){
		$discountsService.getList().then(function(discounts) {
			$scope.discounts = discounts;
		});
	}
]);