(function (define, $) {
    "use strict";

    define(["product/init"], function (productModule) {
        productModule

            .controller("productAttributeEditController", [
                "$scope",
                "$routeParams",
                "$location",
                "$productApiService",
                "$dashboardUtilsService",
                function ($scope, $routeParams, $location, $productApiService, $dashboardUtilsService) {
                    var editableFields, requiredFields, formDisable, formEnable, attr, formValidate;

                    attr = $routeParams.attr;
                    if (!attr && attr !== "new") {
                        $location.path("/attributes");
                    }

                    if (attr === "new") {
                        attr = null;
                    }

                    editableFields = ["Label", "Group", "Editors", "Options", "Default", "Validators", "IsRequired", "IsLayered", "IsPublic", "Validators"];

                    formDisable = function () {
                        $("form.container").find("input").attr("disabled", true);
                        $("form.container").find("select").attr("disabled", true);
                        for (var i = 0; i < editableFields.length; i += 1) {
                            $("form.container").find("input[id=inp_" + editableFields[i] + "]").removeAttr("disabled");
                            $("form.container").find("select[id=inp_" + editableFields[i] + "]").removeAttr("disabled");
                        }
                    };

                    formEnable = function () {
                        $("form.container").find("input").removeAttr("disabled", false);
                        $("form.container").find("select").removeAttr("disabled", false);
                    };

                    $scope.attribute = {};
                    $scope.attributesList = [];
                    $scope.typesAttribute = ["id", "boolean", "integer", "text", "json", "decimal", "datetime", "[]id", "[]integer", "[]text"];
                    $scope.editorsList = [
                        "text",
                        "multiline_text",
                        "not_editable",
                        "password",
                        "boolean",
                        "select",
                        "multi_select",
                        "product_options"
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
                                    $scope.choiceEditor();
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

                    requiredFields = {"Attribute": /^\w+[\w*$()@^&!]*$/, "Label": /^\w+[\w*$()@^&!\s]*$/};
                    formValidate = function () {
                        var field, value;
                        $scope.invalid = true;
                        for (field in requiredFields) {
                            if ($scope.attribute.hasOwnProperty(field)) {
                                value = $scope.attribute[field]  || "";
                                if (!value.match(requiredFields[field])) {
                                    $scope.message = $dashboardUtilsService.getMessage(null, 'warning', 'The field '+ field +' invalid');
                                    return false;
                                }
                            } else {
                                $scope.message = $dashboardUtilsService.getMessage(null, 'warning', 'The field '+ field +' is not specified');
                                return false;
                            }
                        }
                        $scope.invalid = false;
                        return true;
                    };

                    /**
                     * Event handler to save the attribute data.
                     * Creates new attribute if ID in current product is empty OR updates current product if ID is set
                     */
                    $scope.save = function () {
                        $('[ng-click="save()"]').addClass('disabled').append('<i class="fa fa-spin fa-spinner"><i>').siblings('.btn').addClass('disabled');
                        if (formValidate()) {
                            if (attr === null) { // it's a new attribute
                                if (-1 !== ["multi_select"].indexOf($scope.attribute.Editors)) {
                                    $scope.attribute.Type = "[]text";
                                }
                                $productApiService.addAttribute($scope.attribute).$promise.then(function (response) {
                                    if (response.error === null) {
                                        $scope.message = $dashboardUtilsService.getMessage(null, 'success', 'Attribute was updated successfully');
                                    } else {
                                        $scope.message = $dashboardUtilsService.getMessage(response);
                                    }
                                });
                            } else {
                                $productApiService.updateAttribute({"attribute": attr}, $scope.attribute).$promise.then(function (response) {
                                    if (response.error === null) {
                                        $scope.message = $dashboardUtilsService.getMessage(null, 'success', 'Attribute was updated successfully');
                                    } else {
                                        $scope.message = $dashboardUtilsService.getMessage(response);
                                    }
                                });
                            }
                        }
                        $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                        $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                    };

                    $scope.back = function () {
                        $location.path("/attributes");
                    };

                    $scope.readonlyEditors = function () {
                        if (-1 !== ["select", "multi_select"].indexOf($scope.attribute.Editors)) {
                            return true;
                        }
                        return false;
                    };

                    $scope.choiceEditor = function () {
                        if (-1 !== ["select", "multi_select"].indexOf($scope.attribute.Editors)) {
                            $scope.isEditOptions = true;
                        } else {
                            $scope.isEditOptions = false;
                        }
                    };

                }]);
        return productModule;
    });
})(window.define, jQuery);
