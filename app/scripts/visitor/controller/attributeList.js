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
                function ($scope, $routeParams, $q, $visitorApiService, $location) {
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


                    $scope.removeIds = {};

                    /**
                     * Gets list all attributes of visitor
                     */
                    $visitorApiService.attributesInfo($location.search(), {"extra": getFields()}).$promise.then(
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
                        $location.path("/v/attribute/" + attr);
                    };

                    /**
                     *
                     */
                    $scope.create = function () {
                        $location.path("/v/attribute/new");
                    };

                    var remove = function (attr) {
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

                    /**
                     * Removes visitor by attribute name
                     *
                     * @param {string} attr
                     */
                    $scope.remove = function (attr) {
                        var i, answer;
                        answer = window.confirm("You really want to remove this attribute");
                        if (answer) {
                            for (attr in $scope.removeIds) {

                                if ($scope.removeIds.hasOwnProperty(attr) && true === $scope.removeIds[attr]) {
                                    remove(attr).then(
                                        function (response) {
                                            if (response) {
                                                for (i = 0; i < $scope.attributesList.length; i += 1) {
                                                    if ($scope.attributesList[i].Attribute === response) {
                                                        $scope.attributesList.splice(i, 1);
                                                    }
                                                }
                                            }
                                        }
                                    );
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