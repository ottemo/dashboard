angular.module("discountsModule")

.controller("editController", [
	"$scope",
	"$discountsService",
	"$routeParams",
	"$location",
	function($scope, $discountsService, $routeParams, $location){

		// Defaults
		$scope.discount = $discountsService.defaults;

		var isEditPage = !!$routeParams.id;

		if (isEditPage) {
			// Edit Page
			$discountsService.one($routeParams.id)
			.then(function(discount) {
				$scope.discount = discount;
			});
		}

		$scope.clearDiscountValues = function() {
			$scope.discount.amount = '';
			$scope.discount.percent = '';
		}

		$scope.save = function() {
			if ($scope.discount.isNoLimit) {
				$scope.discount.times = -1;
			}

			if (isEditPage) {
				$discountsService.put($scope.discount);
			} else {
				$discountsService.post($scope.discount, function(savedDiscount) {
					// Navigate to our edit page
					var id = savedDiscount._id;
					$location.path('/discounts/' + id );
				});
			}
		}
	}
]);