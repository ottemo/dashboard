angular.module("discountsModule")

.controller("discountsListController", [
	"$scope",
	"discountsService",
	function($scope, discountsService){
		discountsService.getList().then(function(discounts) {
			$scope.discounts = discounts;
		});
	}
]);
