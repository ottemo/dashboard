(function (define) {
    "use strict";

    define(["visitor/init"], function (visitorModule) {
        visitorModule

            .controller("visitorAttributeListController", [
                "$scope",
                "$routeParams",
                "$q",
                "$visitorApiService",
                "$location",
                "COUNT_ITEMS_PER_PAGE",
                function ($scope, $routeParams, $q, $visitorApiService, $location, COUNT_ITEMS_PER_PAGE) {
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
                        $location.search("limit", "0," + COUNT_ITEMS_PER_PAGE);
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
                     * Gets list all attributes of visitor
                     */
                    $visitorApiService.attributesInfo($location.search(), {"extra": getFields()}).$promise.then(function (response) {
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
                        $location.path("/v/attribute/" + attr);
                    };

                    /**
                     *
                     */
                    $scope.create = function () {
                        $location.path("/v/attribute/new");
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
                     * Removes attribute
                     *
                     */
                    $scope.remove = function () {
                        if (!hasSelectedRows()) {
                            return true;
                        }

                        var i, answer, _remove;
                        answer = window.confirm("Please confirm you want to remove this attribute.");
                        _remove = function (attr) {
                            var defer = $q.defer();

                            $visitorApiService.removeAttribute({"attribute": attr},
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
                                    _remove(attr).then(callback);
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
