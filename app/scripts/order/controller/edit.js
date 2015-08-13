angular.module("orderModule")

.controller("orderEditController", [
"$scope",
"$routeParams",
"$location",
"$q",
"$orderApiService",
"$dashboardUtilsService",
function ($scope, $routeParams, $location, $q, $orderApiService, $dashboardUtilsService) {
    var orderId, getDefaultOrder, oldString;

    orderId = $routeParams.id;

    if (!orderId && orderId !== "new") {
        $location.path("/orders");
    }

    if (orderId === "new") {
        orderId = null;
    }

    getDefaultOrder = function () {
        return {
            "id": "",
            "url": "",
            "identifier": "",
            "title": "",
            "content": "",
            "meta_keywords": "",
            "meta_description": "",
            "created_at": "",
            "updated_at": ""
        };
    };

    /**
     * Current selected order
     *
     * @type {Object}
     */
    $scope.order = getDefaultOrder();

    $scope.statuses = [
        {
            "value": "new",
            "label": "New"
        },
        {
            "value": "pending",
            "label": "Pending"
        },
        {
            "value": "processed"
            "label": "Processed"
        },
        {
            "value": "completed",
            "label": "Completed"
        },
        {
            "value": "cancelled",
            "label": "Cancel Order"
        }
    ];


    /**
     * Gets list all attributes of order
     */
    $orderApiService.getAttributes().$promise.then(
        function (response) {
            var result = response.result || [];
            $scope.attributes = result;
        }
    );

    if (null !== orderId) {
        $orderApiService.getOrder({"orderID": orderId}).$promise.then(
            function (response) {
                var result = response.result || {};
                $scope.order = result;
                oldString = $.extend({}, $scope.order);
                delete oldString["updated_at"];
            }
        );
    }

    /**
     * Event handler to save the order data.
     * Creates new order if ID in current order is empty OR updates current order if ID is set
     */
    $scope.save = function () {
        $('[ng-click="save()"]').addClass('disabled').append('<i class="fa fa-spin fa-spinner"><i>').siblings('.btn').addClass('disabled');

        delete $scope.order.updated_at;
        delete $scope.order.notes; // if you submit notes it will replace all notes

        if (orderId !== null && JSON.stringify(oldString) !== JSON.stringify($scope.order)) {
            $orderApiService.update({"orderID": orderId}, $scope.order).$promise.then(function (response) {

                // Success
                if (response.error === null) {
                    $scope.message = $dashboardUtilsService.getMessage(null , 'success', 'Order was updated successfully');

                    // Update the notes list with whatever is on the server.
                    // we get the whole order back, so we could set the entire thing
                    $scope.order.note = '';
                    $scope.order.notes = response.result.notes || [];

                    for (var field in response.result) {
                        if (response.result.hasOwnProperty(field) && "updated_at" !== field) {
                            oldString[field] = response.result[field];
                        }
                    }
                } else {
                    $scope.message = $dashboardUtilsService.getMessage(response);
                }
                $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
            });

        }

    };

}]);
