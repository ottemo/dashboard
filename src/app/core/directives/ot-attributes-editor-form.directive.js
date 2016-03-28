/**
*  Directive used for automatic attributes editor form creation
*
*  Form to edit as accordion
*/
angular.module("coreModule")

.directive("otAttributesEditorForm", [function () {
    return {
        restrict: "E",
        scope: {
            "parent": "=object",
            "item": "=item",
            "attributes": "=attributesList"
        },
        templateUrl: "/views/core/directives/attributes-editor-form.html",
        controller: function ($scope) {
            var updateAttributes;
            updateAttributes = function () {
                var i, groups, setAttrValue;
                groups = {};
                setAttrValue = function(attr){
                    if (typeof $scope.item !== "undefined") {
                        attr.Value = $scope.item[attr.Attribute] || "";
                    }

                    return attr;
                };
                if (typeof $scope.attributes !== "undefined") {
                    for (i = 0; i < $scope.attributes.length; i += 1) {
                        var attr = $scope.attributes[i];
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
