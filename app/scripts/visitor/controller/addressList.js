(function (define) {
    "use strict";

    define(["visitor/init"], function (visitorModule) {

        visitorModule
            .controller("visitorAddressListController", [
                "$scope",
                "$visitorApiService",
                "$routeParams",
                "$location",
                "$q",
                function ($scope, $visitorApiService, $routeParams, $location, $q) {

                    /**
                     * List fields which will shows in table
                     *
                     * @type [object]
                     */
                    $scope.fields = [
                        {
                            "attribute": "Name",
                            "type": "select-link",
                            "label": "Name",
                            "visible": true,
                            "notDisable": true
                        }
                    ];

                    $scope.visitorId = $routeParams.visitorId;

                    $scope.removeIds = {};

                    $location.search("visitor_id", $scope.visitorId);
                    if (JSON.stringify({}) === JSON.stringify($location.search())) {
                        $location.search("limit", "0,5");
                    }

                    $scope.getFullAddress = function (obj) {
                        var name;

                        if (typeof obj === "undefined") {
                            name = $scope.address.zip_code +        // jshint ignore:line
                                " " + $scope.address.state +
                                ", " + $scope.address.city +
                                ", " + $scope.address.street;
                        } else {
                            name = obj.zip_code +                   // jshint ignore:line
                                " " + obj.state +
                                ", " + obj.city +
                                ", " + obj.street;
                        }

                        return name;
                    };

                    /**
                     * Gets list of address
                     */
                    $visitorApiService.addresses({"visitorId": $scope.visitorId}).$promise.then(
                        function (response) {
                            var result, i;
                            $scope.addresses = [];
                            result = response.result || [];
                            for (i = 0; i < result.length; i += 1) {
                                $scope.addresses.push(result[i]);
                            }
                        });

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
