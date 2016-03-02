angular.module("visitorModule")

.controller("visitorEditController", [
"$scope",
"$routeParams",
"$location",
"$q",
"$visitorApiService",
"$dashboardUtilsService",
"$orderApiService",
"$subscriptionsApiService",
function (
    $scope,
    $routeParams,
    $location,
    $q,
    $visitorApiService,
    $dashboardUtilsService,
    $orderApiService,
    $subscriptionsApiService
) {

    var visitorId = $routeParams.id || null;

    $scope.defaultVisitor = getDefaultVisitor();
    $scope.visitor = $scope.defaultVisitor;

    $scope.orders = [];
    $scope.subscriptions = [];

    activate();

    //////////////////////////

    function activate() {

        if (visitorId) {
            fetchOrders(visitorId).then(function(orders) {
                $scope.orders = orders;
            });

            fetchSubscriptions(visitorId).then(function(subs) {
                $scope.subscriptions = subs;
            });
        }
    }


    function getDefaultVisitor() {
        return {};
    };


    $scope.addressForm = function () {
        $location.path("/visitors/" + $scope.visitor._id + "/addresses");
    };

    $scope.getFullName = function () {
        return $scope.visitor['first_name'] + " " + $scope.visitor['last_name'];
    };

    $visitorApiService.attributesInfo().$promise.then(
        function (response) {
            var result = response.result || [];
            $scope.attributes = result;
            for (var i = 0; i < $scope.attributes.length; i += 1) {
                if($scope.attributes[i].Editors === "password"){
                    $scope.attributes[i].Confirm = true;
                }
            }
        }
    );

    /**
     * Handler event when selecting the visitor in the list
     *
     * @param id
     */
    if (null !== visitorId) {
        $visitorApiService.load({"visitorID": visitorId}).$promise.then(
            function (response) {
                var result = response.result || {};
                $scope.visitor = result;
                if ($scope.visitor['shipping_address'] !== null) {
                    $scope.visitor['shipping_address_id'] = $scope.visitor['shipping_address']._id;
                }
                if ($scope.visitor['billing_address'] !== null) {
                    $scope.visitor['billing_address_id'] = $scope.visitor['billing_address']._id;
                }
            }
        );
    }

    $scope.back = function () {
        $location.path("/visitors");
    };

    $scope.getName = function () {
        return "first_name";
    };

    /**
     * Event handler to save the visitor data.
     * Creates new visitor if ID in current visitor is empty OR updates current visitor if ID is set
     */
    $scope.save = function () { // jshint ignore:line
        $('[ng-click="save()"]').addClass('disabled').append('<i class="fa fa-spin fa-spinner"><i>').siblings('.btn').addClass('disabled');
        var id, defer, saveSuccess, saveError, updateSuccess, updateError;
        defer = $q.defer();
        if (typeof $scope.visitor !== "undefined") {
            id = $scope.visitor.id || $scope.visitor._id;
        }

        saveSuccess = function (response) {
            if (response.error === null) {
                var result = response.result || getDefaultVisitor();
                $scope.visitor._id = response.result._id;
                $scope.message = $dashboardUtilsService.getMessage(null, 'success', 'Visitor was created successfully');
                $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                defer.resolve(result);
            }
        };

        saveError = function () {
            $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
            $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
            defer.resolve(false);
        };

        updateSuccess = function (response) {
            if (response.error === null) {
                var result = response.result || getDefaultVisitor();
                $scope.message = $dashboardUtilsService.getMessage(null, 'success', 'Visitor was updated successfully');
                $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                defer.resolve(result);
            }
        };

        updateError = function () {
            $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
            $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
            defer.resolve(false);
        };

        delete $scope.visitor['billing_address'];
        delete $scope.visitor['shipping_address'];

        if (!id) {
            $visitorApiService.save($scope.visitor, saveSuccess, saveError);
        } else {
            $scope.visitor.id = id;

            $visitorApiService.update($scope.visitor, updateSuccess, updateError);
        }

        return defer.promise;
    };

    function fetchOrders(visitorId){
        var params = {
            extra: ['_id', 'status', 'grand_total', 'created_at', 'visitor_id', 'notes'].join(','),
            sort: '^created_at',
            visitor_id: visitorId
        };

        return $orderApiService.orderList(params).$promise.then(function(response) {
            return response.result;
        });
    }

    function fetchSubscriptions(visitorId) {
        var params = {
            extra: ['_id', 'status', 'created_at'].join(','),
            visitor_id: visitorId
        };

        return $subscriptionsApiService.list(params).$promise.then(function(response) {
            return response.result;
        });
    }

}]);
