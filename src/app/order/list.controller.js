angular.module("orderModule")

.controller("orderListController", [
    "$scope",
    "$location",
    "dashboardListService",
    "orderApiService",
    function(
        $scope,
        $location,
        DashboardListService,
        orderApiService
    ) {

        var serviceList = new DashboardListService();

        var showColumns = {
            _id: {
                type: "select-link",
                label: "Order ID",
                filter: "text"
            },
            increment_id: {
                type: "text",
                label: "Order #",
                filter: "text"
            },
            status: {},
            customer_email: {},
            customer_name: {},
            grand_total: {
                label: "Total",
                filter: "range",
                type: "price"
            },
            created_at: {
                label: "Date",
                type: "date"
            }
        };

        var searchDefaults = {
            sort: "^created_at",
            limit: "0,50",
            status: "processed"
        };

        // REFACTOR: I only want to work with the selected ids
        // instead of an object of ids where the value was the selected state
        $scope.selectedIds = [];
        $scope.idsSelectedRows = {};

        $scope.openButton = openButton;
        $scope.actions = {
            export: angular.appConfigValue("general.app.foundation_url") + "/orders/exportToCSV",
            printUrl: printUrl,
            packingSlipUrl: packingSlipUrl,
        };

        $scope.tabs = {
            isActive: isTabActive,
            setStatus: setStatusFilter,
            processedCount: 0,
        };

        $scope.select = select;
        $scope.create = create;
        $scope.changeOrderStatus = changeOrderStatus;

        activate();

        ///////////////////////////////////////

        function activate() {
            $scope.$watch("idsSelectedRows", function(newVal, oldVal) {
                var ids = [];
                angular.forEach($scope.idsSelectedRows, function(active, id) {
                    if (active) {
                        ids.push(id);
                    }
                });
                $scope.selectedIds = ids;
            }, true);

            setSearchDefaults();

            getOrderCount();
            getAttributeList();
            getProcessedOrderCount();
        }

        function setSearchDefaults() {
            if (JSON.stringify({}) === JSON.stringify($location.search())) {
                $location.search(searchDefaults).replace();
            }
        }

        function getOrdersList() {
            var params = $location.search();
            params.extra = serviceList.getExtraFields();

            orderApiService.orderList(params).$promise
                .then(function(response) {
                    var result = response.result || [];
                    $scope.orders = serviceList.getList(result);
                });
        }

        function getProcessedOrderCount() {
            orderApiService.getCount({ status: "processed" }).$promise
                .then(function(response) {
                    $scope.tabs.processedCount = response.result || 0;
                });
        }

        function getOrderCount() {
            orderApiService.getCount($location.search()).$promise
                .then(function(response) {
                    $scope.count = (response.error === null) ? response.result : 0;
                });
        }

        function getAttributeList() {
            orderApiService.getAttributes().$promise.then(
                function(response) {
                    var result = response.result || [];
                    $scope.attributes = result;
                    serviceList.setAttributes($scope.attributes);
                    $scope.fields = serviceList.getFields(showColumns);
                    getOrdersList();
                }
            );
        }

        function changeOrderStatus(status){
            var index;

            orderApiService.updateOrderStatus({
                "order_id": $scope.selectedIds,
                "status": status
            }).$promise.then(function(responce){
                for (var i = 0; i < $scope.selectedIds.length; i++){

                    index = _.findIndex($scope.orders, {"ID" : $scope.selectedIds[i]});
                    $scope.orders[index].status = status;
                }
            });

        }

        function select(id) {
            $location.path("/orders/" + id).search("");
        }

        function create() {
            $location.path("/orders/new");
        }

        function hasSelectedRows() {
            return $scope.selectedIds.length;
        }

        function printUrl() {
            return "/orders/print?ids=" + $scope.selectedIds.join(",");
        }

        function packingSlipUrl() {
            return "/orders/print?price=0&ids=" + $scope.selectedIds.join(",");
        }

        function isTabActive(compareStatus) {
            var search = $location.search();
            return compareStatus === search.status;
        }

        function setStatusFilter(newStatus) {
            // Use the default search params as a starting point
            searchDefaults.status = newStatus;
            $location.search(searchDefaults);
        }

        function openButton(e){
            var btn = e.currentTarget,
                isOpened = btn.classList.contains("open");

            $(".actions").removeClass("open");
            isOpened ? btn.classList.remove("open") : btn.classList.add("open");
        }
    }
]);

