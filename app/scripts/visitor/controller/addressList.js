(function (define, $) {
    "use strict";

    define(["visitor/init"], function (visitorModule) {

        visitorModule
            .controller("visitorAddressListController", [
                "$scope",
                "$routeParams",
                "$location",
                "$q",
                "$dashboardListService",
                "$visitorApiService",
                "COUNT_ITEMS_PER_PAGE",
                function ($scope, $routeParams, $location, $q, DashboardListService, $visitorApiService, COUNT_ITEMS_PER_PAGE) {
                    var serviceList, getAddressesList, getAddressesCount, getAttributeList;
                    serviceList = new DashboardListService();

                    $scope.visitorId = $routeParams.visitorId;

                    $scope.idsSelectedRows = {};

                    $location.search("visitor_id", $scope.visitorId);

                    $scope.getFullAddress = function (obj) {
                        var name;

                        if (typeof obj === "undefined") {
                            name = $scope.address['zip_code'] +
                                " " + $scope.address.state +
                                ", " + $scope.address.city +
                                ", " + $scope.address.street;
                        } else {
                            name = obj['zip_code'] +
                                " " + obj.state +
                                ", " + obj.city +
                                ", " + obj.street;
                        }

                        return name;
                    };

                    /**
                     * Gets list of address
                     */
                    getAddressesList = function () {
                        var params = {
                            "visitorId": $scope.visitorId,
                            "extra": serviceList.getExtraFields()
                        };
                        $visitorApiService.addresses(params).$promise.then(
                            function (response) {
                                var result, i;
                                $scope.addressesTmp = [];
                                result = response.result || [];
                                for (i = 0; i < result.length; i += 1) {
                                    $scope.addressesTmp.push(result[i]);
                                }
                            });
                    };

                    /**
                     * Gets list of addresses
                     */
                    getAddressesCount = function () {
                        $visitorApiService.getCountAddresses($location.search(), {}).$promise.then(
                            function (response) {
                                if (response.error === null) {
                                    $scope.count = response.result;
                                } else {
                                    $scope.count = 0;
                                }
                            }
                        );
                    };

                    getAttributeList = function () {
                        $visitorApiService.addressAttributeInfo().$promise.then(
                            function (response) {
                                var result = response.result || [];
                                serviceList.init('addresses');
                                $scope.attributes = result;
                                serviceList.setAttributes($scope.attributes);
                                $scope.fields = serviceList.getFields();
                                getAddressesList();
                            }
                        );
                    };

                    /**
                     * Handler event when selecting the address in the list
                     *
                     * @param id
                     */
                    $scope.select = function (id) {
                        $location.path("/visitor/" + $scope.visitorId + "/address/" + id);
                    };

                    /**
                     *
                     */
                    $scope.create = function () {
                        $location.path("/visitor/" + $scope.visitorId + "/address/new");
                    };

                    $scope.backToVisitor = function () {
                        $location.path("/visitor/" + $scope.visitorId);
                    };

                    var hasSelectedRows = function () {
                        var result = false;
                        for (var _id in $scope.idsSelectedRows) {
                            if ($scope.idsSelectedRows.hasOwnProperty(_id) && $scope.idsSelectedRows[_id]) {
                                result = true;
                            }
                        }
                        return result;
                    };

                    /**
                     * Removes address
                     *
                     */
                    $scope.remove = function () {

                        if (!hasSelectedRows()) {
                            return true;
                        }

                        var i, answer, _remove;
                        answer = window.confirm("Please confirm you want to remove this address.");
                        _remove = function (id) {
                            var defer = $q.defer();

                            $visitorApiService.deleteAddress({"id": id},
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
                                    for (i = 0; i < $scope.addresses.length; i += 1) {
                                        if ($scope.addresses[i].ID === response) {
                                            $scope.addresses.splice(i, 1);
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

                    $scope.$watch(function () {
                        if (typeof $scope.attributes !== "undefined" && typeof $scope.addressesTmp !== "undefined") {
                            return true;
                        }

                        return false;
                    }, function (isInitAll) {
                        if (isInitAll) {
                            $scope.addresses = serviceList.getList($scope.addressesTmp);
                        }
                    });

                    $scope.init = (function () {
                        if (JSON.stringify({}) === JSON.stringify($location.search())) {
                            $location.search("limit", "0," + COUNT_ITEMS_PER_PAGE);
                            return;
                        }
                        getAddressesCount();
                        getAttributeList();
                    })();
                }
            ]
        );

        return visitorModule;
    });
})(window.define, jQuery);
