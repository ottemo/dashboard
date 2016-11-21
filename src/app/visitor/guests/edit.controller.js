angular.module("visitorModule")

.controller("visitorGuestsEditController", [
    "$scope",
    "$routeParams",
    "$location",
    "$q",
    "dashboardUtilsService",
    "visitorApiService",
    "orderApiService",
    function (
        $scope,
        $routeParams,
        $location,
        $q,
        dashboardUtilsService,
        visitorApiService,
        orderApiService
    ) {

        $scope.email = $routeParams.email.replace("%2E", ".");

        activate();

        ////////////////////////////////////

        function activate() {
            visitorApiService.getGuestOrders({ 'customer_email': $scope.email }).$promise.then(
                function(response){
                    $scope.orders = response.result || [];

                    processGuest();
                }
            );
        }

        function processGuest() {
            var guest = $scope.orders[0].Extra.billing_address;

            $scope.guestName = guest.first_name + " " + guest.last_name;
            $scope.fields = [
                {
                    label: "First name",
                    value: guest.first_name
                }, {
                    label: "Last name",
                    value: guest.last_name
                }, {
                    label: "Email",
                    value: $scope.email
                }
            ]
        }

        $scope.back = function () {
            $location.path("/guests");
        };

}]);
