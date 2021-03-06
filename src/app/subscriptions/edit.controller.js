angular.module("subscriptionsModule")

.controller("subscriptionsEditController", [
    "$scope",
    "$routeParams",
    "subscriptionsApiService",
    "dashboardUtilsService",
    function($scope, $routeParams, subscriptionsApiService, dashboardUtilsService) {

        var subscriptionId = $routeParams.id;

        $scope.subscription = {};
        $scope.cancel = cancel;
        $scope.isCancelVis = false;

        activate();

        ////////////////////////////////

        function activate() {

            // Fetch the order
            var params = {
                id: subscriptionId
            };

            subscriptionsApiService.one(params).$promise.then(function(response) {
                // Set subscription
                $scope.subscription = response.result || {};

                // Set cancel button visibility
                $scope.isCancelVis = isCancelVis($scope.subscription);
            });
        }

        function cancel() {
            var params = {
                id: $scope.subscription._id,
                status: 'canceled',
            };

            subscriptionsApiService.update(params).$promise
                .then(function(response){
                    console.log('updated', response);
                    $scope.message = dashboardUtilsService.getMessage(null , 'success', 'Subscription was updated successfully');
                });
        };

        function isCancelVis(subscription) {
            return (subscription && subscription.status !== 'canceled');
        }

    }
]);

