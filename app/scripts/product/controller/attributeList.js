(function (define) {
    "use strict";

    define(["product/init"], function (productModule) {
        productModule

            .controller("productAttributeListController", [
                "$scope",
                "$q",
                "$productApiService",
                "$location",
                function ($scope, $q, $productApiService, $location) {
                    $scope.fields = [
                        {
                            "attribute": "Label",
                            "type": "select-link",
                            "label": "Name"
                        }
                    ];

                    $scope.attributesList = [];
                    $scope.removeIds = {};

                    /**
                     * Gets list all attributes of product
                     */
                    $productApiService.attributesInfo().$promise.then(
                        function (response) {
                            var result, i;
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

                    /**
                     * Removes product by attribute name
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
                                    )
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