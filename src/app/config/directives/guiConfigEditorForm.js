angular.module("coreModule")

/**
*  Directive used for automatic attributes editor form creation
*/
.directive("guiConfigEditorForm", [function () {
    return {
        restrict: "E",
        scope: {
            "parent": "=object",
            "item": "=item",
            "attributes": "=attributesList"
        },
        templateUrl: "/views/config/gui/configEditorForm.html",
        controller: function ($scope) {
            var updateAttributes, addTab, addFields, sortFieldsInGroups;

            $scope.tabs = {};
            $scope.click = function (id) {
                if (typeof $scope.parent.selectTab === "function") {
                    $scope.parent.selectTab(id);
                } else {
                    return false;
                }
            };

            addTab = function (attr) {
                if (attr.Type === "group") {
                    if (typeof $scope.tabs[attr.Group] === "undefined") {
                        $scope.tabs[attr.Group] = [];
                    }
                    $scope.tabs[attr.Group].push(attr);
                }
            };

            addFields = function (attr) {
                if (typeof $scope.attributeGroups[attr.Group] === "undefined") {
                    $scope.attributeGroups[attr.Group] = [];
                }
                $scope.attributeGroups[attr.Group].push(attr);
            };

            sortFieldsInGroups = function () {
                // var sortByLabel, tab;
                // sortByLabel = function (a, b) {
                //     if (a.Label.toString() < b.Label.toString()) {
                //         return -1;
                //     }
                //     if (a.Label.toString() > b.Label.toString()) {
                //         return 1;
                //     }

                //     return 0;
                // };
                // for (tab in $scope.attributeGroups) {
                //     if ($scope.attributeGroups.hasOwnProperty(tab)) {
                //         $scope.attributeGroups[tab].sort(sortByLabel);
                //     }
                // }
            };

            updateAttributes = function () {
                if ($scope.item === "undefined" ||
                    JSON.stringify({}) === JSON.stringify($scope.item)) {
                    return true;
                }
                var i, attr, setAttrValue;
                $scope.attributeGroups = {};

                setAttrValue = function (attr) {
                    if (typeof $scope.item !== "undefined") {
                        attr.Value = $scope.item[attr.Attribute] || "";
                    }

                    return attr;
                };

                if (typeof $scope.attributes !== "undefined") {
                    for (i = 0; i < $scope.attributes.length; i += 1) {
                        attr = setAttrValue($scope.attributes[i]);

                        addFields(attr);
                        addTab(attr);
                    }
                }

                sortFieldsInGroups();
            };

            $scope.$watchCollection("attributes", updateAttributes);
            $scope.$watchCollection("item", updateAttributes);
        }
    };
}]);
