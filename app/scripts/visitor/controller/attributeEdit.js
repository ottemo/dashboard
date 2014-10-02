(function (define, $) {
    "use strict";

    define(["visitor/init"], function (visitorModule) {
        visitorModule

            .controller("visitorAttributeEditController", [
                "$scope",
                "$routeParams",
                "$location",
                "$visitorApiService",
                function ($scope, $routeParams, $location, $visitorApiService) {
                    var formDisable, formEnable, attr;

                    attr = $routeParams.attr;
                    if (!attr && attr !== "new") {
                        $location.path("/attributes");
                    }

                    if (attr === "new") {
                        attr = null;
                    }

                    formDisable = function () {
                        $(".panel-body").find("input").attr("readonly", true);
                        $(".panel-body").find("select").attr("disabled", true);
                    };

                    formEnable = function () {
                        $(".panel-body").find("input").attr("readonly", false);
                        $(".panel-body").find("select").attr("disabled", false);
                    };

                    $scope.attribute = {};
                    $scope.attributesList = [];
                    $scope.typesAttribute = ["integer", "real", "text", "blob", "numeric"];
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

                    /**
                     * Event handler to save the attribute data.
                     * Creates new attribute if ID in current visitor is empty OR updates current visitor if ID is set
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
                                $scope.message = {
                                    'type': 'success',
                                    'message': 'Attribute was created successfully'
                                };
                            }
                        };
                        if (attribute) {
                            $visitorApiService.addAttribute($scope.attribute, saveSuccess);
                        }
                    };

                    $scope.back = function () {
                        $location.path("/v/attributes");
                    };

                    $scope.readonlyEditors = function(){
                        if(-1 !== ["select", "multi_select"].indexOf($scope.attribute.Editors)){
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