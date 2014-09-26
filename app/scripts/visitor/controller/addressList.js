(function (define) {
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
                function ($scope, $routeParams, $location, $q, $dashboardListService, $visitorApiService, COUNT_ITEMS_PER_PAGE) {

                    $scope.visitorId = $routeParams.visitorId;

                    $scope.removeIds = {};

                    $location.search("visitor_id", $scope.visitorId);

                    if (JSON.stringify({}) === JSON.stringify($location.search())) {
                        $location.search("limit", "0," + COUNT_ITEMS_PER_PAGE);
                    }

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
                    var getAddressesList = function(){
                        var params = {
                            "visitorId": $scope.visitorId,
                            "extra": $dashboardListService.getExtraFields()
                        };
                        $visitorApiService.addressesG(params).$promise.then(
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
                    $visitorApiService.getCountAddresses($location.search(), {}).$promise.then(
                        function (response) {
                            if (response.error === "") {
                                $scope.count = response.result;
                            } else {
                                $scope.count = 0;
                            }
                        }
                    );

                    $visitorApiService.addressAttributeInfo().$promise.then(
                        function (response) {
                            var result = response.result || [];
                            $dashboardListService.init('addresses');
                            $scope.attributes = result;
                            $dashboardListService.setAttributes($scope.attributes);
                            $scope.fields = $dashboardListService.getFields();
                            getAddressesList();
                        }
                    );

                    var prepareList = function () {
                        if (typeof $scope.attributes === "undefined" || typeof $scope.addressesTmp === "undefined") {
                            return false;
                        }

                        $scope.addresses = $dashboardListService.getList($scope.addressesTmp);
                    };

                    $scope.$watch("addressesTmp", prepareList);
                    $scope.$watch("attributes", prepareList);

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

                    var remove = function (id) {
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

                    /**
                     * Removes address by ID
                     *
                     * @param {string} id
                     */
                    $scope.remove = function (id) {
                        var i, answer;
                        answer = window.confirm("You really want to remove this address");
                        if (answer) {
                            var callback = function (response) {
                                if (response) {
                                    for (i = 0; i < $scope.addresses.length; i += 1) {
                                        if ($scope.addresses[i].Id === response) {
                                            $scope.addresses.splice(i, 1);
                                        }
                                    }
                                }
                            };

                            for (id in $scope.removeIds) {
                                if ($scope.removeIds.hasOwnProperty(id) && true === $scope.removeIds[id]) {
                                    remove(id).then(callback);
                                }
                            }
                        }
                    };
                }
            ]
        );

        return visitorModule;
    });
})(window.define);
