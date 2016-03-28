/**
*  Directive used for automatic attribute editor creation
*/
angular.module("coreModule")

.directive("otFilterSelect", [function () {
    return {
        restrict: "E",
        templateUrl: "/views/core/directives/filter/select.html",

        scope: {
            "parent": "=object",
            "attribute": "=editorScope",
            "item": "=item"
        },

        controller: function ($scope) {
            var getOptions;
            var isInit = false;

            $scope.options = [];

            getOptions = function (opt) {
                var options = {};

                if (typeof $scope.attribute.Options === "string") {
                    try {
                        options = JSON.parse(opt.replace(/'/g, "\""));

                    }
                    catch (e) {
                        var parts = $scope.attribute.Options.replace(/[{}]/g, "").split(",");
                        for (var i = 0; i < parts.length; i += 1) {
                            options[parts[i]] = parts[i];
                        }
                    }
                } else {
                    options = opt;
                }

                return options;
            };

            $scope.submit = function (id) {
                $scope.item[$scope.attribute.Attribute] = id;
                $scope.parent.newFilters[$scope.attribute.Attribute.toLowerCase()] = id.split(" ");
                if (-1 !== ['text', 'string'].indexOf($scope.item.dataType)) {
                    $scope.parent.newFilters[$scope.attribute.Attribute.toLowerCase()] = id.split(" ");
                } else {
                    $scope.parent.newFilters[$scope.attribute.Attribute.toLowerCase()] = id;
                }
            };

            $scope.$watch("item", function () {
                if (typeof $scope.item === "undefined" || isInit) {
                    return false;
                }

                var options, field, setNewFilterValues;

                setNewFilterValues = function () {
                    if (-1 !== ['text', 'string', 'varchar'].indexOf($scope.item.dataType)) {
                        $scope.item[$scope.attribute.Attribute] = $scope.item[$scope.attribute.Attribute].replace(/~/g, "");
                        $scope.parent.newFilters[$scope.attribute.Attribute] = $scope.item[$scope.attribute.Attribute].replace(/~/g, "").split(" ");
                    } else {
                        $scope.item[$scope.attribute.Attribute] = $scope.item[$scope.attribute.Attribute].replace(/~/g, "");
                        $scope.parent.newFilters[$scope.attribute.Attribute] = $scope.item[$scope.attribute.Attribute].replace(/~/g, "");
                    }

                };

                $scope.options = [];
                options = getOptions($scope.attribute.Options);

                for (field in options) {
                    if (options.hasOwnProperty(field)) {
                        $scope.options.unshift({
                            Desc: "",
                            Extra: null,
                            Id: field,
                            Image: "",
                            Name: options[field]
                        });
                    }
                }

                setNewFilterValues();

                isInit = true;
            });
        }
    };
}]);