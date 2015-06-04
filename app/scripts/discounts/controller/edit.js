angular.module("discountsModule")

.controller("editController", [
	"$scope",
	"$discountsService",
	"$routeParams",
	"$location",
	function($scope, $discountsService, $routeParams, $location){

		$scope.discount = {};
		var isEditPage = !!$routeParams.id;

		if (isEditPage) {
			// Edit Page
			$discountsService.one($routeParams.id).then(function(discount) {
				$scope.discount = discount;
				$scope.discount.noLimit = ($scope.discount.times === -1);

				$scope.discount.type = $scope.discount.amount !== '' ? 'amount' : 'percent';
			});
		} else {
			// New Page
			$scope.discount = {
				noLimit: true,
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

			if (isEditPage) {
				$discountsService.put($scope.discount);
			} else {
				$discountsService.post($scope.discount, function(savedDiscount) {
					// Get our routes updated
					var id = savedDiscount._id;
					$location.path('/discounts/' + id );
				});
			}
		}
	}
]);