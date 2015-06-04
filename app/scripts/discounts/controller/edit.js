angular.module("discountsModule")

.controller("editController", [
	"$scope",
	"$discountsService",
	"$routeParams",
	"$location",
	function($scope, $discountsService, $routeParams, $location){

		// Edit Page
		if ($routeParams.id) {
			$discountsService.one($routeParams.id).then(function(response) {
				$scope.discount = response.result;
				if ($scope.discount.times === -1) {
					$scope.discount.noLimit = true;
				}
				$scope.discount.type = $scope.discount.amount !== '' ? 'amount' : 'percent';
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
				console.log(response);
				var id = response.result._id;
				$location.path('/discounts/' + id );
			});
		}
	}
]);