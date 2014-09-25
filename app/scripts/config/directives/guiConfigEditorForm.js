(function (define) {
    "use strict";

    define(["design/init", "config/init"], function (designModule) {
        designModule

        /**
         *  Directive used for automatic attributes editor form creation
         */
            .directive("guiConfigEditorForm", ["$designService", function ($designService) {
                return {
                    restrict: "E",
                    scope: {
                        "parent": "=object",
                        "item": "=item",
                        "attributes": "=attributesList"
                    },
                    templateUrl: $designService.getTemplate("config/gui/configEditorForm.html"),
                    controller: function ($scope) {
                        var updateAttributes;

                        $scope.click = function (id) {
                            if (typeof $scope.parent.selectTab === "function") {
                                $scope.parent.selectTab(id);
                            } else {
                                return false;
                            }
                        };

                        updateAttributes = function () {
                            var i, groups, attr, setAttrValue;
                            groups = {};
                            setAttrValue = function(attr){
                                if (typeof $scope.item !== "undefined") {
                                    attr.Value = $scope.item[attr.Attribute] || "";
                                }

                                return attr;
                            };

                            if (typeof $scope.attributes !== "undefined") {
                                for (i = 0; i < $scope.attributes.length; i += 1) {
                                    attr = $scope.attributes[i];
                                    attr= setAttrValue(attr);
                                    if (typeof groups[attr.Group] === "undefined") {
                                        groups[attr.Group] = [];
                                    }
                                    groups[attr.Group].push(attr);
                                }
                            }
                            $scope.attributeGroups = groups;
                        };

                        $scope.$watchCollection("attributes", updateAttributes);
                        $scope.$watchCollection("item", updateAttributes);
                    }
                };
            }]);

        return designModule;
    });
})(window.define);
