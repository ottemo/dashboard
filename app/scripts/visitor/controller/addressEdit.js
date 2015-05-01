angular.module("visitorModule")
    .controller("visitorAddressEditController", [
        "$scope",
        "$visitorApiService",
        "$routeParams",
        "$location",
        "$q",
        "$dashboardUtilsService",
        function ($scope, $visitorApiService, $routeParams, $location, $q, $dashboardUtilsService) {
            var addressId, getDefaultAddress;

            getDefaultAddress = function () {
                return {"visitor_id": $scope.visitorId};
            };

            $scope.visitorId = $routeParams.visitorId;

            $scope.attributes = [];

            $scope.address = getDefaultAddress();

            addressId = $routeParams.id;

            if (!addressId && addressId !== "new") {
                $location.path("/visitor/" + $scope.visitorId + "/addresses");
            }

            if (addressId === "new") {
                addressId = null;
            }

            /**
             * Gets list all attributes of address
             */
            $visitorApiService.addressAttributeInfo().$promise.then(
                function (response) {
                    var result = response.result || [];
                    $scope.attributes = result;
                }
            );

            $scope.getFullAddress = function (obj) {
                var name;

                if (typeof obj === "undefined") {
                    name = $scope.address['zip_code'] +
                        " " + $scope.address.state +
                        ", " + $scope.address.city +
                        ", " + $scope.address['address_line1'] +
                        " " + $scope.address['address_line2'];
                } else {
                    name = obj['zip_code'] +
                        " " + obj.state +
                        ", " + obj.city +
                        ", " + obj['address_line1'] +
                        " " + obj['address_line2'];
                }

                return name;
            };

            /**
             * Handler event when selecting the address in the list
             *
             * @param id
             */
            if (null !== addressId) {
                $visitorApiService.loadAddress({"addressID": addressId}).$promise.then(
                    function (response) {
                        var result = response.result || {};
                        $scope.address = result;
                    }
                );
            }

            $scope.back = function () {
                $location.path("/visitor/" + $scope.visitorId + "/addresses");
            };

            $scope.backToVisitor = function () {
                $location.path("/visitor/" + $scope.visitorId);
            };

            /**
             * Event handler to save the address data.
             * Creates new address if ID in current address is empty OR updates current address if ID is set
             */
            $scope.save = function () {
                $('[ng-click="save()"]').addClass('disabled').append('<i class="fa fa-spin fa-spinner"><i>').siblings('.btn').addClass('disabled');
                var id, defer, saveSuccess, saveError, updateSuccess, updateError;
                defer = $q.defer();
                if (typeof $scope.address !== "undefined") {
                    id = $scope.address.id || $scope.address._id;
                }

                /**
                 *
                 * @param response
                 */
                saveSuccess = function (response) {
                    if (response.error === null) {
                        var result = response.result || getDefaultAddress();
                        $scope.address._id = response.result._id;
                        $scope.message = $dashboardUtilsService.getMessage(null, 'success', 'Address was created successfully');
                        defer.resolve(result);
                    }
                    $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                    $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                };

                /**
                 *
                 * @param response
                 */
                saveError = function () {
                    $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                    $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                    defer.resolve(false);
                };

                /**
                 *
                 * @param response
                 */
                updateSuccess = function (response) {
                    if (response.error === null) {
                        var result = response.result || getDefaultAddress();
                        $scope.message = $dashboardUtilsService.getMessage(null, 'success', 'Address was updated successfully');
                        $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                        $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                        defer.resolve(result);
                    }
                };

                /**
                 *
                 * @param response
                 */
                updateError = function () {
                    $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                    $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                    defer.resolve(false);
                };

                if (!id) {
                    $visitorApiService.saveAddress($scope.address, saveSuccess, saveError);
                } else {
                    $scope.address.id = id;
                    $visitorApiService.updateAddress($scope.address, updateSuccess, updateError);
                }

                return defer.promise;
            };
        }
    ]
);
