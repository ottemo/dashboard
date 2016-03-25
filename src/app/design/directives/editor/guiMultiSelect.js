/**
*  Directive used for automatic attribute editor creation
*/
angular.module("designModule")

.directive("guiMultiSelect", [function () {
    return {
        restrict: "E",
        templateUrl: "/views/design/gui/editor/multi-select.html",

        scope: {
            "attribute": "=editorScope",
            "item": "=item"
        },

        controller: function ($scope) {
            var isInit = false;
            $scope.options = [];

            $scope.$watch("item", function () {
                if (isInit) {
                    return false;
                }
                var getOptions, options, field;

                $scope.options = [];

                getOptions = function (opt) {
                    var options = {};

                    if (typeof $scope.attribute.Options === "string") {
                        try {
                            options = JSON.parse(opt.replace(/'/g, "\""));
                        } catch(err) {
                        }
                    } else {
                        options = opt;
                    }

                    return options;
                };

                options = getOptions($scope.attribute.Options);

                for (field in options) {
                    if (options.hasOwnProperty(field)) {
                        $scope.options.push({
                            Desc: "",
                            Extra: null,
                            Id: field,
                            Image: "",
                            Name: options[field]
                        });
                    }
                }
                if (typeof $scope.item[$scope.attribute.Attribute] === "string") {
                    var stringData = $scope.item[$scope.attribute.Attribute].trim('\\[\\]').replace(/['"\s]/g,'');
                    $scope.item[$scope.attribute.Attribute] = stringData.split(",");
                }
                isInit = true;
            });

        }
    };
}]);