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
                        $scope.selection = [];
                        $scope.selected = [];

                        $scope.toggleSelection = function toggleSelection(id, name) {
                            var parentScope;
                            parentScope = $scope.item[$scope.attribute.Attribute];

                            if (typeof parentScope !== "undefined") {
                                var idx, isExist;
                                isExist = false;
                                for(var i =0 ; i< parentScope.length; i+=1){
                                    if(typeof parentScope[i] === "object" && parentScope[i]._id === id){
                                        console.log(parentScope[i]._id)
                                        isExist = true;
                                        idx = i;
                                    } else if(parentScope[i] === id) {
                                        console.log(parentScope[i])
                                        isExist = true;
                                        idx = i;
                                    }
                                }
                            } else {
                                parentScope = [];
                            }

                            if (typeof $scope.selected !== "undefined") {
                                var names = $scope.selected.indexOf(name);
                            } else {
                                $scope.selected = [];
                            }

                            if (isExist) {
                                parentScope.splice(idx, 1);
                            } else {
                                parentScope.push(id);
                            }

                            if (names > -1) {
                                $scope.selected.splice(names, 1);
                            } else {
                                $scope.selected.push(name);
                            }
                        };

                        $scope.show = function (id) {
                            $("#" + id).modal("show");
                        };

                        $scope.$watch("item", function () {
                            $scope.selection = [];
                            $scope.selected = [];
                            if (typeof $scope.item !== "undefined" &&
                            typeof $scope.item[$scope.attribute.Attribute] !== "undefined") {
                                for (var i = 0; i < $scope.item[$scope.attribute.Attribute].length; i += 1) {
                                    if (typeof $scope.item[$scope.attribute.Attribute] === "object") {

                                        $scope.selection.push($scope.item[$scope.attribute.Attribute][i]._id);
                                        $scope.selected.push($scope.item[$scope.attribute.Attribute][i].name);

                                    }
                                }
                            }
console.log($scope.selected)
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

                            $designApiService.attributesModel({"model": options.model}).$promise.then(
                                function (response) {
                                    var result = response.result || [];
                                    $scope.items = result;
                                });
                        });

                    }
                };
            }]);

        return designModule;
    });
})(window.define, jQuery);