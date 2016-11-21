angular.module("visitorModule")

.controller("visitorGuestsController", [
    "$scope",
    "$routeParams",
    "$location",
    "$q",
    "dashboardListService",
    "visitorApiService",
    "orderApiService",
    "COUNT_ITEMS_PER_PAGE",
    function (
        $scope,
        $routeParams,
        $location,
        $q,
        DashboardListService,
        visitorApiService,
        orderApiService,
        COUNT_ITEMS_PER_PAGE
    ) {

        var serviceList = new DashboardListService();

        var showColumns = {
            'customer_email': {},
            'customer_name': {}
        };

        $scope.buttons = {
            new: false,
            delete: false
        };
        $scope.mapping = {
            id: "customer_email"
        };

        $scope.select = select;

        activate();

        ////////////////////////////////////

        /**
         * Initialization
         */
        function activate() {
            if (JSON.stringify({}) === JSON.stringify($location.search())) {
                $location.search('limit', '0,' + COUNT_ITEMS_PER_PAGE).replace();
                return;
            }

            getAttributeList()
                .then(function() {
                    $scope.$watch(
                        function() {
                            return ( $scope.attributes && $scope.visitorsTmp ) ? true : false;
                        },
                        function (isInitAll) {
                            if (isInitAll) {
                                $scope.visitors = serviceList.getList($scope.visitorsTmp);
                            }
                        }
                    );
                });
        }

        /**
         * Gets visitor attributes
         */
        function getAttributeList() {
            return orderApiService.getAttributes().$promise
                .then(function (response) {
                    $scope.attributes = response.result || [];
                    serviceList.setAttributes($scope.attributes);
                    $scope.fields = serviceList.getFields(showColumns);

                    getGuestsList();
                }
            );
        }

        /**
         * Gets list of guests
         */
        function getGuestsList(){
            var params = $location.search();

            return visitorApiService.guestsList(params).$promise
                .then(function(response){
                    var result = response.result || [];

                    $scope.count = result.count;
                    $scope.visitorsTmp = result.guests;
                });
        }

        /**
         * Handler event when selecting the visitor in the list
         *
         * @param id
         */
        function select(id) {
            id = id.replace(".", "%2E"); // encode dot symbol
            $location.path("/guests/" + id);
        }
}]);
