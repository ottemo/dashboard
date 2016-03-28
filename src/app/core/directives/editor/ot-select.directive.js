/**
*  Directive used for automatic attribute editor creation
*/
angular.module("coreModule")

.directive("otSelect", [function () {
    return {
        restrict: "E",
        templateUrl: "/views/core/directives/editor/select.html",

        scope: {
            "attribute": "=editorScope",
            "item": "=item"
        },

        controller: function ($scope) {
            var getOptions;

            $scope.options = [];

            getOptions = function (opt) {
                var options = {};

                if (typeof $scope.attribute.Options === "string") {
                    try {
                        options = JSON.parse(opt.replace(/'/g, "\""));
                    }
                    catch (e) {
                        var parts = $scope.attribute.Options.split(",");
                        for (var i = 0; i < parts.length; i += 1) {
                            options[parts[i]] = parts[i];
                        }
                    }
                } else {
                    options = opt;
                }

                return options;
            };

            $scope.$watch("item", function () {
                var options, field;

                if (typeof $scope.item === "undefined") {
                    return false;
                }

                $scope.options = [];
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

                if ($scope.attribute.Default === "" && !$scope.attribute.IsRequired){
                    $scope.options.unshift({
                        Desc: "",
                        Extra: null,
                        Id: "",
                        Image: "",
                        Name: ""
                    });
                }
            });
        }
    };
}]);
