angular.module("discountsModule")

.controller("discountsEditController", [
"$scope",
"$discountsService",
function($scope, $discountsService){

	$scope.discount = {
		noLimit: true,
		noExpiry: true,
		type: 'amount'
	}

	$scope.clearDiscountValues = function() {
		$scope.discount.amount = '';
		$scope.discount.percent = '';
	}

	$scope.save = function() {
		if ($scope.discount.noLimit) {
			$scope.discount.times = -1;
		}
		if ($scope.discount.noExpiry) {
			$scope.discount.until = -1;
		}

		$discountsService.save($scope.discount, function() {
			$location.path('/discounts/' + discount._id );
		});
	}
}]);