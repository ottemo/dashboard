(function (define) {
    "use strict";

    define(["design/init"], function (designModule) {

        designModule
        /**
         *  Directive used for automatic attribute editor creation
         */
            .directive("guiFilterSelect", ["$designService", function ($designService) {
                return {
                    restrict: "E",
                    templateUrl: $designService.getTemplate("design/gui/filter/select.html"),

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
                                    var parts = $scope.attribute.Options.replace(/[{}]/g,"").split(",");
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
                        };

                        $scope.$watch("item", function () {
                            var options, field;

                            if (typeof $scope.item === "undefined" || isInit) {
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

                            $scope.item[$scope.attribute.Attribute] = $scope.item[$scope.attribute.Attribute].replace(/~/g, "");
                            $scope.parent.newFilters[$scope.attribute.Attribute] = $scope.item[$scope.attribute.Attribute].replace(/~/g, "").split(" ");

                            isInit = true;
                        });
                    }
                };
            }]);

        return designModule;
    });
})(window.define);