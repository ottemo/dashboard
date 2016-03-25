angular.module("discountsModule")

.controller("editController", [
    "$scope",
    "discountsService",
    "$routeParams",
    "$location",
    function($scope, discountsService, $routeParams, $location) {

        var isEditPage = !!$routeParams.id;

        $scope.discount = {};

        $scope.clearDiscountValues = clearDiscountValues;
        $scope.save = save;
        $scope.remove = remove;

        activate();

        //////////////////////////////////

        function activate() {
            if (isEditPage) {
                discountsService.one($routeParams.id)
                    .then(function(discount) {
                        $scope.discount = discount;
                    });
            } else {
                $scope.discount = discountsService.defaults();
            }
        }

        // hack - this shouldn't be needed
        function clearDiscountValues() {
            $scope.discount.amount = '';
            $scope.discount.percent = '';
        }

        function save() {
            if (isEditPage) {
                discountsService.put($scope.discount);
            } else {
                discountsService.post($scope.discount)
                    .then(goToDiscount);
            }
        }

        function remove() {
            discountsService.remove($scope.discount._id)
                .then(function(){
                    $location.path('/discounts');
                });
        }

        function goToDiscount(discount) {
            $location.path('/discounts/' + discount._id);
        }
    }
]);

