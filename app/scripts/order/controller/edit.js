(function (define, $) {
    "use strict";

    define(["order/init"], function (orderModule) {
        var clone = function (obj) {
            if (null === obj || "object" !== typeof obj) {
                return obj;
            }
            var copy = obj.constructor();
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) {
                    copy[attr] = obj[attr];
                }
            }
            return copy;
        };
        orderModule
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
                            "value": "completed",
                            "label": "Completed"
                        },
                        {
                            "value": "pending",
                            "label": "Pending"
                        },
                        {
                            "value": "canceled",
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
                        $orderApiService.getOrder({"id": orderId}).$promise.then(
                            function (response) {
                                var result = response.result || {};
                                $scope.order = result;
                                oldString = clone($scope.order);
                                delete oldString["updated_at"];
                            }
                        );
                    }

                    $scope.back = function () {
                        $location.path("/orders");
                    };

                    /**
                     * Event handler to save the order data.
                     * Creates new order if ID in current order is empty OR updates current order if ID is set
                     */
                    $scope.save = function () {
                        $('[ng-click="save()"]').addClass('disabled').append('<i class="fa fa-spin fa-spinner"><i>').siblings('.btn').addClass('disabled');

                        delete $scope.order["updated_at"];
                        if (orderId !== null && JSON.stringify(oldString) !== JSON.stringify($scope.order)) {
                            $orderApiService.update({"id": orderId}, $scope.order).$promise.then(function (response) {
                                if (response.error === null) {
                                    $scope.message = $dashboardUtilsService.getMessage(null , 'success', 'Order was updated successfully');
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

                    $scope.getDate = function () {
                        var date, month, day;

                        date = new Date($scope.order['created_at']);
                        month = date.getMonth().toString().length < 2 ? '0' + date.getMonth() : date.getMonth();
                        day = date.getDate().toString().length < 2 ? '0' + date.getDate() : date.getDate();

                        return date.getFullYear() + '/' + month + '/' + day;
                    };

                }
            ]
        );

        return orderModule;
    });
})(window.define, jQuery);
