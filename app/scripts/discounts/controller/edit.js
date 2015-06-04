angular.module("discountsModule")

.controller("editController", [
"$scope",
"$discountsService",
"$routeParams",
function($scope, $discountsService, $routeParams){

	// Edit Page
	if ($routeParams.id) {
		$discountsService.get({id: $routeParams.id}, function(response) {
			$scope.discount = response.result;
		});
	} else {
		// New Page
		$scope.discount = {
			noLimit: true,
			// noExpiry: true,
			type: 'amount'
		}
	}

	$scope.clearDiscountValues = function() {
		$scope.discount.amount = '';
		$scope.discount.percent = '';
	}

	$scope.save = function() {
		if ($scope.discount.noLimit) {
			$scope.discount.times = -1;
		}
		// if ($scope.discount.noExpiry) {
		// 	$scope.discount.until = -1;
		// }

		$discountsService.save($scope.discount, function(response) {
			var id = response.result._id;
			$location.path('/discounts/' + id );
		});
	}
}]);