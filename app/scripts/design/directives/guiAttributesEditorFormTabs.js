angular.module("designModule")

/**
*  Directive used for automatic attributes editor form creation
*
*  Form to edit with tabs
*/
.directive("guiAttributesEditorFormTabs", ["$designService", "$dashboardUtilsService", function ($designService, $dashboardUtilsService) {
    return {
        restrict: "E",
        scope: {
            "parent": "=object",
            "item": "=item",
            "attributes": "=attributesList"
        },
        templateUrl: $designService.getTemplate("design/gui/attributesEditorFormTabs.html"),
        controller: function ($scope) {
            var updateAttributes;

            $scope.click = function (id) {
                if (typeof $scope.parent.selectTab === "function") {
                    $scope.parent.selectTab(id);
                } else {
                    return false;
                }
            };

            $scope.save = function () {
                $scope.otEditForm.submitted = true;
                if ($scope.otEditForm.$valid) {
                    $scope.parent.save();
                } else {
                    $scope.parent.message = $dashboardUtilsService.getMessage(null, "warning", "Form is invalid");
                }
            };

            $scope.back = function () {
                $scope.parent.back();
            };

            updateAttributes = function () {
                var i, groups, setAttrValue;
                groups = {};
                setAttrValue = function (attr) {
                    if (typeof $scope.item !== "undefined") {
                        attr.Value = $scope.item[attr.Attribute] || "";
                    }

                    return attr;
                };
                if (typeof $scope.attributes !== "undefined") {
                    for (i = 0; i < $scope.attributes.length; i += 1) {
                        var attr = $scope.attributes[i];
                        attr = setAttrValue(attr);
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

            $scope.$watch("editForm", function () {
                $scope.parent.form = $scope.otEditForm;
            }, true);

            $scope.$watch("parent.message", function () {
                $scope.message = $scope.parent.message;
            }, true);
        }
    };
}]);
