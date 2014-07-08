(function (define) {
    "use strict";

    define(["product/init"], function (productModule) {
        productModule

            .controller("productAttributeController", ["$scope", "$productApiService", function ($scope, $productApiService) {

                $scope.attributesList = [];
                $scope.attribute = {};
                $scope.typesAttribute = ["integer", "real", "text", "blob", "numeric"];
                $scope.editorsList = ["text", "multiline_text", "not_editable"];
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
                 * Clears the form to create a new attribute
                 */
                $scope.clearForm = function () {
                    $scope.attribute = {};
                }

                /**
                 * Handler event when selecting the attribute in the list
                 *
                 * @param {string} attr
                 */
                $scope.select = function (attr) {
                    var i;
                    for (i = 0; i < $scope.attributesList.length; i += 1) {
                        if ($scope.attributesList[i].Attribute === attr) {
                            $scope.attribute = $scope.attributesList[i];
                            return true;
                        }
                    }
                };

                /**
                 * Removes product by attribute name
                 *
                 * @param {string} attr
                 */
                $scope.delete = function (attr) {
                    var i, answer;
                    answer = window.confirm("You really want to remove this attribute");
                    if (answer) {
                        $productApiService.deleteAttribute({"attribute": attr}, function (response) {
                            if (response.result === "ok") {
                                for (i = 0; i < $scope.attributesList.length; i += 1) {
                                    if ($scope.attributesList[i].Attribute === attr) {
                                        $scope.attributesList.splice(i, 1);
                                        $scope.attribute = {};
                                    }
                                }
                            }
                        });
                    }
                };

                /**
                 * Event handler to save the attribute data.
                 * Creates new attribute if ID in current product is empty OR updates current product if ID is set
                 */
                $scope.save = function () {
                    var attribute, saveSuccess;
                    if (typeof $scope.attribute !== "undefined") {
                        attribute = $scope.attribute.Attribute;
                    }

                    /**
                     *
                     * @param response
                     */
                    saveSuccess = function (response) {
                        if (response.error === "") {
                            $scope.attributesList.push(response.result);
                        }
                    };

                    if (!attribute) {
                        $productApiService.addAttribute($scope.attribute, saveSuccess);
                    }
                };

            }]);
        return productModule;
    });
})(window.define);