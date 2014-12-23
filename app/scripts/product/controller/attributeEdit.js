(function (define, $) {
    "use strict";

    define(["product/init"], function (productModule) {
        productModule

            .controller("productAttributeEditController", [
                "$scope",
                "$routeParams",
                "$location",
                "$productApiService",
                function ($scope, $routeParams, $location, $productApiService) {
                    var editableFields, formDisable, formEnable, attr;

                    attr = $routeParams.attr;
                    if (!attr && attr !== "new") {
                        $location.path("/attributes");
                    }

                    if (attr === "new") {
                        attr = null;
                    }

                    editableFields = ["Label", "Group", "Editors", "Options", "Default", "Validators", "IsRequired", "IsLayered", "IsPublic", "Validators"];

                    formDisable = function () {
                        $(".panel-body").find("input").attr("readonly", true);
                        $(".panel-body").find("select").attr("disabled", true);
                        for (var i = 0; i < editableFields.length; i += 1) {
                            $(".panel-body").find("input[id=inp_" + editableFields[i] + "]").removeAttr("readonly");
                            $(".panel-body").find("select[id=inp_" + editableFields[i] + "]").removeAttr("disabled");
                        }
                    };

                    formEnable = function () {
                        $(".panel-body").find("input").attr("readonly", false);
                        $(".panel-body").find("select").attr("disabled", false);
                    };

                    $scope.attribute = {};
                    $scope.attributesList = [];
                    $scope.typesAttribute = ["integer", "real", "text"];
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

                    /**
                     * Event handler to save the attribute data.
                     * Creates new attribute if ID in current product is empty OR updates current product if ID is set
                     */
                    $scope.save = function () {
                        $('[ng-click="save()"]').addClass('disabled').append('<i class="fa fa-spin fa-spinner"><i>').siblings('.btn').addClass('disabled');

                        if (attr === null) {
                            if (-1 !== ["multi_select"].indexOf($scope.attribute.Editors)) {
                                $scope.attribute.Type = "[]text";
                            }
                            $productApiService.addAttribute($scope.attribute).$promise.then(function (response) {
                                if (response.error === "") {
                                    $scope.message = {
                                        'type': 'success',
                                        'message': 'Attribute was updated successfully'
                                    };
                                } else {
                                    $scope.message = {
                                        'type': 'error',
                                        'message': response.error
                                    };
                                }
                            });
                            $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                            $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                        } else {
                            $productApiService.updateAttribute({"attribute": attr}, $scope.attribute).$promise.then(function (response) {
                                if (response.error === "") {
                                    $scope.message = {
                                        'type': 'success',
                                        'message': 'Attribute was updated successfully'
                                    };
                                } else {
                                    $scope.message = {
                                        'type': 'danger',
                                        'message': response.error
                                    };
                                }
                            });
                            $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                            $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                        }
                        

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