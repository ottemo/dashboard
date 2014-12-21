(function (define) {
    "use strict";

    define(["product/init"], function (productModule) {
        productModule

            .controller("productAttributeListController", [
                "$scope",
                "$routeParams",
                "$q",
                "$productApiService",
                "$location",
                function ($scope, $routeParams, $q, $productApiService, $location) {
                    $scope.fields = [
                        {
                            "attribute": "Label",
                            "type": "select-link",
                            "label": "Name",
                            "visible": true,
                            "notDisable": true
                        }
                    ];

                    if (JSON.stringify({}) === JSON.stringify($location.search())) {
                        $location.search("limit", "0,5");
                    }

                    var getFields = function () {
                        var arr, i;
                        arr = [];

                        for (i = 0; i < $scope.fields.length; i += 1) {
                            arr.push($scope.fields[i].attribute);
                        }
                        return arr.join(",");
                    };


                    $scope.idsSelectedRows = {};

                    /**
                     * Gets list all attributes of product
                     */
                    $productApiService.attributesInfo($location.search(), {"extra": getFields()}).$promise.then(
                        function (response) {
                            var result, i;
                            $scope.attributesList = [];
                            result = response.result || [];
                            for (i = 0; i < result.length; i += 1) {
                                $scope.attributesList.push(result[i]);
                            }
                        });


                    /**
                     * Handler event when selecting the attribute in the list
                     *
                     * @param {string} attr
                     */
                    $scope.select = function (attr) {
                        $location.path("/attribute/" + attr);
                    };

                    /**
                     *
                     */
                    $scope.create = function () {
                        $location.path("/attribute/new");
                    };

                    var remove = function (attr) {
                        var defer = $q.defer();

                        $productApiService.deleteAttribute({"attribute": attr},
                            function (response) {
                                if (response.result === "ok") {
                                    defer.resolve(attr);
                                } else {
                                    defer.resolve(false);
                                }
                            }
                        );

                        return defer.promise;
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
                     * Removes attribute by ID
                     *
                     */
                    $scope.remove = function () {
                        if (!hasSelectedRows()) {
                            return true;
                        }

                        var i, answer;
                        answer = window.confirm("You really want to remove this attribute?");
                        if (answer) {
                            var callback = function (response) {
                                if (response) {
                                    for (i = 0; i < $scope.attributesList.length; i += 1) {
                                        if ($scope.attributesList[i].Attribute === response) {
                                            $scope.attributesList.splice(i, 1);
                                        }
                                    }
                                }
                            };

                            for (var attr in $scope.idsSelectedRows) {

                                if ($scope.idsSelectedRows.hasOwnProperty(attr) && true === $scope.idsSelectedRows[attr]) {
                                    remove(attr).then(callback);
                                }
                            }
                        }
                    };

                }
            ]
        );

        return productModule;
    });
})(window.define);