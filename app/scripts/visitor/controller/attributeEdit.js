(function (define, $) {
    "use strict";

    define(["visitor/init"], function (visitorModule) {
        visitorModule

            .controller("visitorAttributeEditController", [
                "$scope",
                "$routeParams",
                "$location",
                "$visitorApiService",
                "$dashboardUtilsService",
                function ($scope, $routeParams, $location, $visitorApiService, $dashboardUtilsService) {
                    var formDisable, formEnable, formValidate, attr, requiredFields;

                    attr = $routeParams.attr;
                    if (!attr && attr !== "new") {
                        $location.path("/attributes");
                    }

                    if (attr === "new") {
                        attr = null;
                    }

                    formDisable = function () {
                        $("form.container").find("input").attr("disabled", true);
                        $("form.container").find("select").attr("disabled", true);
                    };

                    formEnable = function () {
                        $("form.container").find("input").removeAttr("disabled", false);
                        $("form.container").find("select").removeAttr("disabled", false);
                    };

                    $scope.attribute = {};
                    $scope.attributesList = [];
                    $scope.typesAttribute = ["integer", "real", "text"];
                    $scope.editorsList = [
                        "not_editable",
                        "text",
                        "datetime",
                        "password",
                        "multiline_text",
                        "html",
                        "boolean",
                        "select",
                        "multi_select"
                    ];
                    /**
                     * Gets list all attributes of visitor
                     */
                    $visitorApiService.attributesInfo().$promise.then(
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
                        $scope.attribute = {
                            "Options": '{"a":"1st","b":"2st","c";"3st"}'
                        };
                        formEnable();
                    };

                    requiredFields = ["Attribute", "Label"];
                    formValidate = function () {
                        var i, value;
                        $scope.invalid = true;
                        for (i = 0; i < requiredFields.length; i+=1) {
                            if ($scope.attribute.hasOwnProperty(requiredFields[i])) {
                                value = $scope.attribute[requiredFields[i]] || "";
                                if (!value.match(/^\w+[\w*$()@^&!]*$/)) {
                                    $scope.message = $dashboardUtilsService.getMessage(null, 'danger', 'The field '+ requiredFields[i]+' invalid');
                                    return false;
                                }
                            } else {
                                $scope.message = $dashboardUtilsService.getMessage(null, 'danger', 'The field '+ requiredFields[i]+' is not specified');
                                return false;
                            }
                        }
                        $scope.invalid = false;
                        return true;
                    };


                    /**
                     * Event handler to save the attribute data.
                     * Creates new attribute if ID in current visitor is empty OR updates current visitor if ID is set
                     */
                    $scope.save = function () {
                        var attribute, saveSuccess;
                        $('[ng-click="save()"]').addClass('disabled').append('<i class="fa fa-spin fa-spinner"><i>').siblings('.btn').addClass('disabled');

                        /**
                         *
                         * @param response
                         */
                        saveSuccess = function (response) {
                            if (response.error === null) {
                                $scope.message = $dashboardUtilsService.getMessage(null, 'success', 'Attribute was created successfully');
                            } else {
                                $scope.message = $dashboardUtilsService.getMessage(response);
                            }
                        };

                        if (formValidate()) {
                            if (typeof $scope.attribute !== "undefined") {
                                attribute = $scope.attribute.Attribute;
                            }
                            if (-1 !== ["multi_select"].indexOf($scope.attribute.Editors)) {
                                $scope.attribute.Type = "[]text";
                            }
                            $visitorApiService.addAttribute($scope.attribute, saveSuccess);
                        }

                        $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                        $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                    };

                    $scope.back = function () {
                        $location.path("/v/attributes");
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
        return visitorModule;
    });
})(window.define, jQuery);
