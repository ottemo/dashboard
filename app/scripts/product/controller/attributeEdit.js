(function (define) {
    "use strict";

    define(["product/init"], function (productModule) {
        productModule

            .controller("productAttributeEditController", [
                "$scope",
                "$routeParams",
                "$location",
                "$productApiService",
                function ($scope, $routeParams, $location, $productApiService) {
                var formDisable, formEnable, attr;

                attr = $routeParams.attr;
                if (!attr && attr !== "new") {
                    $location.path("/attributes");
                }

                if (attr === "new") {
                    attr = null;
                }

                formDisable = function () {
                    jQuery(".panel-body").find("input").attr("readonly", true);
                    jQuery(".panel-body").find("select").attr("disabled", true);
                };

                formEnable = function () {
                    $(".panel-body").find("input").attr("readonly", false);
                    jQuery(".panel-body").find("select").attr("disabled", false);
                };

                $scope.attribute = {};
                $scope.attributesList = [];
                $scope.typesAttribute = ["integer", "real", "text", "blob", "numeric"];
                $scope.editorsList = [
                    "text",
                    "multiline_text",
                    "not_editable",
                    "password",
                    "boolean",
                    "select",
                    "multi_select"
                ];

                /**
                 * Gets list all attributes of product
                 */
                $productApiService.attributesInfo().$promise.then(
                    function (response) {
                        var result, i;
                        result = response.result || [];
                        for (i = 0; i < result.length; i += 1) {
                            $scope.attributesList.push(result[i]);

                            if (result[i].Attribute === $routeParams.attr) {
                                $scope.attribute = result[i];
                                formDisable();
                            }
                        }
                    }
                );

                /**
                 * Clears the form to create a new attribute
                 */
                $scope.clearForm = function () {
                    $scope.attribute = {};
                    formEnable();
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
                            window.alert("Attribute is added");
                                                    }
                    };
                    if (attribute) {
                        $productApiService.addAttribute($scope.attribute, saveSuccess);
                    }
                };

                $scope.back = function () {
                    $location.path("/attributes");
                };

            }]);
        return productModule;
    });
})(window.define);