angular.module("orderModule")

.controller("orderListController", [
"$rootScope",
"$scope",
"$location",
"$routeParams",
"$q",
"$dashboardListService",
"$orderApiService",
"COUNT_ITEMS_PER_PAGE",
function ($rootScope, $scope, $location, $routeParams, $q, DashboardListService, $orderApiService, COUNT_ITEMS_PER_PAGE) {
    var getOrdersList, serviceList, getOrderCount, getAttributeList, showColumns;
    serviceList = new DashboardListService();
    showColumns = {
        _id : {type: 'select-link', label : 'Order ID', filter: 'text'},
        status : {},
        customer_email : {},
        customer_name : {},
        grand_total : {label : 'Total', filter : 'range', type : 'price'},
        created_at : {label : 'Date', type : 'date'}
    };

    // REFACTOR: I only want to work with the selected ids
    // instead of an object of ids where the value was the selected state
    $scope.selectedIds = [];
    $scope.idsSelectedRows = {};
    $scope.$watch('idsSelectedRows', function(newVal, oldVal){
        var ids = [];
        angular.forEach($scope.idsSelectedRows, function(active, id) {
            if (active) {
                ids.push(id);
            }
        });
        $scope.selectedIds = ids;
    }, true);

    /**
     * Gets list of orders
     */
    getOrdersList = function () {
        var params = $location.search();
        params["extra"] = serviceList.getExtraFields();

        $orderApiService.orderList(params).$promise.then(
            function (response) {
                var result = response.result || [];
                $scope.orders = serviceList.getList(result)
            }
        );
    };

    getOrderCount = function() {
        $orderApiService.getCount($location.search(), {}).$promise.then(
            function (response) {
                if (response.error === null) {
                    $scope.count = response.result;
                } else {
                    $scope.count = 0;
                }
            }
        );
    };

    getAttributeList = function() {
        $orderApiService.getAttributes().$promise.then(
            function (response) {
                var result = response.result || [];
                serviceList.init('orders');
                $scope.attributes = result;
                serviceList.setAttributes($scope.attributes);
                $scope.fields = serviceList.getFields(showColumns);
                getOrdersList();
            }
        );
    };

    /**
     * Handler event when selecting the order in the list
     *
     * @param id
     */
    $scope.select = function (id) {
        $location.path("/orders/" + id).search('');
    };

    /**
     *
     */
    $scope.create = function () {
        $location.path("/orders/new");
    };

    var hasSelectedRows = function () {
        return $scope.selectedIds.length;
    };


    $scope.actions = {
        isOpen: false,
        export: angular.appConfigValue('general.app.foundation_url') +'/export/quickbooks'
    };

    $scope.actions.printUrl = function() {
        return '/orders/print?ids=' + $scope.selectedIds.join(',');
    }

    $scope.actions.packingSlipUrl = function() {
        return '/orders/print?price=0&ids=' + $scope.selectedIds.join(',');
    }

    /**
     * Removes order by ID
     *
     */
    $scope.remove = function () {
        if (!hasSelectedRows()) {
            return true;
        }

        var i, answer, _remove;
        answer = window.confirm("You really want to remove this order(s)?");
        _remove = function (id) {
            var defer = $q.defer();

            $orderApiService.remove({"orderID": id},
                function (response) {
                    if (response.result === "ok") {
                        defer.resolve(id);
                    } else {
                        defer.resolve(false);
                    }
                }
            );

            return defer.promise;
        };
        if (answer) {
            $('[ng-click="parent.remove()"]').addClass('disabled').append('<i class="fa fa-spin fa-spinner"><i>').siblings('.btn').addClass('disabled');
            var callback = function (response) {
                if (response) {
                    for (i = 0; i < $scope.orders.length; i += 1) {
                        if ($scope.orders[i].ID === response) {
                            $scope.orders.splice(i, 1);
                        }
                    }
                }
            };
            for (var id in $scope.idsSelectedRows) {
                if ($scope.idsSelectedRows.hasOwnProperty(id) && true === $scope.idsSelectedRows[id]) {
                    _remove(id).then(callback);
                }
            }
        }
        $('[ng-click="parent.remove()"]').removeClass('disabled').children('i').remove();
        $('[ng-click="parent.remove()"]').siblings('.btn').removeClass('disabled');

    };


    $scope.init = (function () {
        // test if it is an empty object
        if (JSON.stringify({}) === JSON.stringify($location.search())) {
            $location.search({
                sort: '^created_at',
                limit: '0,50'
            }).replace();
            return;
        }
        getOrderCount();
        getAttributeList();
    })();
}]);