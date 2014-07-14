(function (define) {
    "use strict";

    define(["visitor/init"], function (visitorModule) {

        visitorModule
            .controller("visitorAddressController", ["$scope", "$visitorApiService", "$routeParams",
                function ($scope, $visitorApiService, $routeParams) {

                    $scope.visitorId = $routeParams.id;

                    $scope.attributes = [];

                    $scope.addressesList = [];

                    $scope.addressDefault = {"visitor_id": $scope.visitorId};

                    /**
                     * Clears the form to create a new address
                     */
                    $scope.clearForm = function () {
                        $scope.address = {"visitor_id": $scope.visitorId};
                    };

                    $scope.clearForm();

                    /**
                     * Gets list all attributes of address
                     */
                    $visitorApiService.addressAttributeInfo().$promise.then(
                        function (response) {
                            var result = response.result || [];
                            $scope.attributes = result;
                        });

                    $scope.getFullAddress = function(){
                        return $scope.address.street +
                            " " +$scope.address.city +
                            " " + $scope.address.state +
                            " " + $scope.address.zip_code;
                    }

                    /**
                     * Clears the form to create a new address
                     */
                    $scope.clearForm = function () {
                        $scope.address = {"visitor_id": $scope.visitorId};
                    };

                    /**
                     * Gets list of address
                     */
//                    $visitorApiService.addressesList({"visitorId": $scope.visitorId}).$promise.then(
//                        function (response) {
//                            var result, i;
//                            result = response.result || [];
//                            for (i = 0; i < result.length; i += 1) {
//                                $scope.addressesList.push(result[i]);
//                            }
//                        });

                    /**
                     * Handler event when selecting the address in the list
                     *
                     * @param id
                     */
                    $scope.select = function (id) {
                        $visitorApiService.loadAddress({"id": id}).$promise.then(
                            function (response) {
                                var result = response.result || {};
                                $scope.address = result;
                            });
                    };

                    /**
                     * Removes address by ID
                     *
                     * @param {string} id
                     */
                    $scope.delete = function (id) {
                        var i, answer;
                        answer = window.confirm("You really want to remove this address");
                        if (answer) {
                            $visitorApiService.deleteAddress({"id": id}, function (response) {
                                if (response.result === "ok") {
                                    for (i = 0; i < $scope.addressesList.length; i += 1) {
                                        if ($scope.addressesList[i]._id === id) {
                                            $scope.addressesList.splice(i, 1);
                                            $scope.clearForm();
                                        }
                                    }
                                }
                            });
                        }
                    };

                    /**
                     * Event handler to save the address data.
                     * Creates new address if ID in current address is empty OR updates current address if ID is set
                     */
                    $scope.save = function () {
                        var id, saveSuccess, saveError, updateSuccess, updateError;
                        if (typeof $scope.address !== "undefined") {
                            id = $scope.address.id || $scope.address._id;
                        }

                        /**
                         *
                         * @param response
                         */
                        saveSuccess = function (response) {
                            if (response.error === "") {
                                $scope.addressesList.push(response.result);
                                $scope.clearForm();
                            }
                        };

                        /**
                         *
                         * @param response
                         */
                        saveError = function (response) {
                        };

                        /**
                         *
                         * @param response
                         */
                        updateSuccess = function (response) {
                            var i;
                            if (response.error === "") {
                                for (i = 0; i < $scope.addressesList.length; i += 1) {
                                    if ($scope.addressesList[i]._id === response.result._id) {
                                        $scope.addressesList[i] = response.result;
                                    }
                                }
                            }
                        };

                        /**
                         *
                         * @param response
                         */
                        updateError = function (response) {
                        };

                        if (!id) {
                            $visitorApiService.saveAddress($scope.address, saveSuccess, saveError);
                        } else {
                            $scope.address.id = id;
                            $visitorApiService.updateAddress($scope.address, updateSuccess, updateError);
                        }
                    };
                }
            ]);
        return visitorModule;
    });
})(window.define);