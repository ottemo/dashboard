angular.module('orderModule')

.controller('orderListController', [
    '$scope',
    '$location',
    '$dashboardListService',
    '$orderApiService',
    function(
        $scope,
        $location,
        DashboardListService,
        $orderApiService
    ) {

        var serviceList = new DashboardListService();
        var showColumns = {
            _id: {
                type: 'select-link',
                label: 'Order ID',
                filter: 'text'
            },
            status: {},
            customer_email: {},
            customer_name: {},
            grand_total: {
                label: 'Total',
                filter: 'range',
                type: 'price'
            },
            created_at: {
                label: 'Date',
                type: 'date'
            }
        };

        var searchDefaults = {
            status: 'processed',
            sort: '^created_at',
            limit: '0,50',
        };

        // REFACTOR: I only want to work with the selected ids
        // instead of an object of ids where the value was the selected state
        $scope.selectedIds = [];
        $scope.idsSelectedRows = {};

        $scope.actions = {
            isOpen: false,
            export: angular.appConfigValue('general.app.foundation_url') + '/export/quickbooks',
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

        activate();

        ///////////////////////////////////////

        function activate() {
            $scope.$watch('idsSelectedRows', function(newVal, oldVal) {
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

            $orderApiService.orderList(params).$promise
                .then(function(response) {
                    var result = response.result || [];
                    $scope.orders = serviceList.getList(result);
                });
        }

        function getProcessedOrderCount() {
            var params = {};
            angular.copy(searchDefaults, params);
            params.status = 'processed';

            $orderApiService.getCount(params).$promise
                .then(function(response) {
                    $scope.tabs.processedCount = response.result || 0;
                });
        }

        function getOrderCount() {
            $orderApiService.getCount($location.search()).$promise
                .then(function(response) {
                    $scope.count = (response.error === null) ? response.result : 0;
                });
        }

        function getAttributeList() {
            $orderApiService.getAttributes().$promise.then(
                function(response) {
                    var result = response.result || [];
                    serviceList.init('orders');
                    $scope.attributes = result;
                    serviceList.setAttributes($scope.attributes);
                    $scope.fields = serviceList.getFields(showColumns);
                    getOrdersList();
                }
            );
        }

        function select(id) {
            $location.path('/orders/' + id).search('');
        }

        function create() {
            $location.path('/orders/new');
        }

        function hasSelectedRows() {
            return $scope.selectedIds.length;
        }

        function printUrl() {
            return '/orders/print?ids=' + $scope.selectedIds.join(',');
        }

        function packingSlipUrl() {
            return '/orders/print?price=0&ids=' + $scope.selectedIds.join(',');
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
    }
]);

