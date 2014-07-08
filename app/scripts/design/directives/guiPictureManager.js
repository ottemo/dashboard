(function (define) {
    "use strict";

    define(["design/init"], function (designModule) {
        designModule
        /**
         *  Directive used for automatic attribute editor creation
         */
            .directive("guiPictureManager", ["$designService", "$designImageService", function ($designService, $designImageService) {
                return {
                    restrict: "E",
                    transclude: true,
                    templateUrl: $designService.getTemplate("design/gui/pictureManager.html"),

                    scope: {
                        "images": "=imagesList",
                        "imagesPatch": "=?imagesPatch",
                        "placeholder": "=?placeholder",
                        "defaultImg": "=?defaultImg",
                        "selected": "=selected"
                    },

                    controller: function ($scope) {
                        if ($scope.placeholder === undefined) {
                            $scope.placeholder = "images/placeholder.png";
                        }

                        // function to split array on rows by x-elements
                        var splitBy = function (arr, x) {   // jshint ignore:line
                            var result = [], row = [], i = 0;

                            if (typeof arr !== "array" && typeof x !== "integer") {         // jshint ignore:line
                                for (var idx in arr) {
                                    if (arr.hasOwnProperty(idx)){
                                        i += 1;
                                        row.push(arr[idx]);
                                        if (i % x === 0) {
                                            result.push(row);
                                            i = 0;
                                            row = [];
                                        }
                                    }
                                }
                                if (i !== 0) {
                                    result.push(row);
                                }
                            }

                            return result;
                        };

                        $scope.$watch("images", function (newValue) {
                            $scope.splitedImages = splitBy(newValue, 4);
                        });

                        $scope.getImage = function (filename) {
                            if (typeof filename === "undefined" || filename === "") {
                                return $scope.placeholder;
                            } else {
                                return $designImageService.getFullImagePath($scope.imagesPatch, filename);
                            }
                        };

                        $scope.selectImage = function (filename) {
                            if (typeof filename !== "undefined" && filename !== "") {
                                $scope.selected = filename;
                            }
                        };

                        $scope.isDefault = function (filename) {
                            var _class = " img-default ";
                            if (filename === $scope.defaultImg) {
                                return _class;
                            }
                            return "";
                        };
                    }
                };
            }]);

        return designModule;
    });
})(window.define);