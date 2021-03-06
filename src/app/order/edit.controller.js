angular.module("orderModule")

.controller("orderEditController", [
"$scope",
"$routeParams",
"$location",
"$q",
"orderApiService",
"dashboardUtilsService",
function ($scope, $routeParams, $location, $q, orderApiService, dashboardUtilsService) {
    var orderId, getDefaultOrder, oldString;
    $scope.trackingInfo = {};

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
            "increment_id": "",
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

    $scope.getOptionValueLabel = dashboardUtilsService.getOptionValueLabel;

    /**
     * Current selected order
     *
     * @type {Object}
     */
    $scope.order = getDefaultOrder();

    $scope.statuses = [
        {
            value: 'new',
            label: 'New',
            isDisabled: true
        },
        {
            value: 'pending',
            label: 'Pending',
            isDisabled: true
        },
        {
            value: 'processed',
            label: 'Processed',
            isDisabled: false
        },
        {
            value: 'declined',
            label: 'Declined',
            isDisabled: true
        },
        {
            value: 'completed',
            label: 'Completed',
            isDisabled: false
        },
        {
            value: 'cancelled',
            label: 'Cancelled',
            isDisabled: false
        }
    ];


    /**
     * Gets list all attributes of order
     */
    orderApiService.getAttributes().$promise.then(
        function (response) {
            var result = response.result || [];
            $scope.attributes = result;
        }
    );

    if (null !== orderId) {
        orderApiService.getOrder({"orderID": orderId}).$promise.then(
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
            orderApiService.update({"orderID": orderId}, $scope.order).$promise.then(function (response) {

                // Success
                if (response.error === null) {
                    $scope.message = dashboardUtilsService.getMessage(null , 'success', 'Order was updated successfully');

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
                    $scope.message = dashboardUtilsService.getMessage(response);
                }
                $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
            });

        }

    };

    /**
     * Resending confirmation email in case if it was clicked on the "Send confirmation email" button
     */
    $scope.sendConfirmation = function() {
        orderApiService.sendConfirmation({"orderID": orderId}).$promise.then(function (response) {
            // Success
            if (response.error === null) {
                $scope.message = dashboardUtilsService.getMessage(null , 'success', 'Confirmation emails sent');
            } else {
                $scope.message = dashboardUtilsService.getMessage(response);
            }
        });
    };

    $scope.showTrackingForm = function(){
        $('#tracking-form').modal('show');
    };

    /**
     * Sending tracking email with tracking info
     */
    $scope.sendTracking = function() {
        $('#tracking-form').modal('hide');
        orderApiService.sendTracking({"orderID" : orderId}, $scope.trackingInfo)
            .$promise.then(function(response){
                if (response.error === null) {
                    orderApiService.getOrder({"orderID": orderId}).$promise
                        .then(function (response) {
                            $scope.order = response.result || {};
                            oldString = $.extend({}, $scope.order);
                            delete oldString["updated_at"];
                        }
                    );
                    $scope.message = dashboardUtilsService.getMessage(null , 'success', 'Tracking information was updated successfully');
                } else {
                    $scope.message = dashboardUtilsService.getMessage(response);
                }
            })
    }

}]);
