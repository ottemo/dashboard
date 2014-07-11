(function (define, $) {
    "use strict";

    define(["design/init"], function (designModule) {
        designModule
        /**
         *  Directive used for automatic attribute editor creation
         */
            .directive("guiArrayModelSelector", ["$designService", "$designApiService", function ($designService, $designApiService) {
                return {
                    restrict: "E",
                    templateUrl: $designService.getTemplate("design/gui/editor/arrayModelSelector.html"),

                    scope: {
                        "attribute": "=editorScope",
                        "item": "=item"
                    },

                    controller: function ($scope) {

                        $scope.toggleSelection = function toggleSelection(fruitName) {
                            if (typeof $scope.item[$scope.attribute.Attribute] !== "undefined") {
                                var idx = $scope.item[$scope.attribute.Attribute].indexOf(fruitName);
                            } else {
                                $scope.item[$scope.attribute.Attribute] = [];
                            }

                            // is currently selected
                            if (idx > -1) {
                                $scope.item[$scope.attribute.Attribute].splice(idx, 1);
                            }

                            // is newly selected
                            else {
                                $scope.item[$scope.attribute.Attribute].push(fruitName);
                            }
                        };

                        $scope.show = function (id) {
                            $("#" + id).modal("show");
                        };
                        $scope.$watch("item", function () {

                            var options, parseOptions;
                            options = {};

                            parseOptions = function () {
                                var i, optionsPairs, parts;
                                optionsPairs = $scope.attribute.Options.split(/[,;]+/i) || [];

                                for (i = 0; i < optionsPairs.length; i += 1) {
                                    parts = optionsPairs[i].split(/[:=]+/i);
                                    options[parts[0].trim()] = parts[1].trim();
                                }
                                return options;
                            };
                            parseOptions();
//                            console.log(options)
////
//
                            $designApiService.attributesModel({"model": options.model}).$promise.then(
                                function (response) {
                                    var result = response.result || [];
                                    $scope.items = result;
                                    console.log($scope.items);
                                });
                        });

                    }
                };
            }]);

        return designModule;
    });
})(window.define, jQuery);