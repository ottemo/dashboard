angular.module('coreModule')

.directive('otConfigEditorForm', [function () {
    return {
        restrict: 'E',
        scope: {
            'parent': '=object',
            'item': '=item',
            'attributes': '=attributesList'
        },
        templateUrl: '/views/config/directives/ot-config-editor-form.html',
        controller: function ($scope, _) {

            $scope.tabs = [];
            $scope.attributeGroups = {};
            $scope.click = click;

            activate();

            ///////////////////////

            function activate() {
                $scope.$watchCollection('attributes', updateAttributes);
                $scope.$watchCollection('item', updateAttributes);
            }

            function click(id) {
                if (typeof $scope.parent.selectTab === 'function') {
                    $scope.parent.selectTab(id);
                } else {
                    return false;
                }
            }

             function updateAttributes() {
                if ($scope.item === 'undefined' ||
                    JSON.stringify({}) === JSON.stringify($scope.item)) {
                    return true;
                }

                $scope.attributeGroups = {};
                if (typeof $scope.attributes !== 'undefined') {
                    for (var i = 0; i < $scope.attributes.length; i += 1) {
                        var attr = setAttrValue($scope.attributes[i]);
                        addFields(attr);
                    }

                    // only write tabs out once
                    if ($scope.tabs.length === 0) {
                        $scope.attributes.forEach(function(a){
                            if (a.Type === 'group') {
                                addTab(a.Label, a.Group);
                            }
                        });

                        // activate the first tab
                        $scope.click($scope.tabs[0].key);
                    }
                }
            }

            function addTab(label, key) {
                $scope.tabs.push({label:label, key:key});
                $scope.tabs = _.sortBy($scope.tabs, 'label');
            }

            function addFields(attr) {
                if (typeof $scope.attributeGroups[attr.Group] === 'undefined') {
                    $scope.attributeGroups[attr.Group] = [];
                }
                $scope.attributeGroups[attr.Group].push(attr);
            }

            function setAttrValue(attr) {
                if (typeof $scope.item !== 'undefined') {
                    attr.Value = $scope.item[attr.Attribute] || '';
                }

                return attr;
            }
        }
    };
}]);
