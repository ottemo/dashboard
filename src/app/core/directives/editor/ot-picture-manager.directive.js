/**
*  Directive used for automatic attribute editor creation
*/
angular.module("coreModule")

.directive("otPictureManager", ["designImageService", function (designImageService) {
    return {
        restrict: "E",
        templateUrl: "/views/core/directives/editor/ot-picture-manager.html",

        scope: {
            "parent": "=parent",
            "item": "=item"
        },

        controller: function ($scope) {
            // function to split array on rows by x-elements
            var splitBy = function (arr, x) {
                var result = [], row = [], i = 0;

                for (var idx in arr) {
                    if (arr.hasOwnProperty(idx)) {
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

                return result;
            };

            $scope.$watch("parent.productImages", function () {
                if(typeof $scope.parent.productImages !== "undefined") {
                    $scope.imagesPath = $scope.parent.imagesPath;
                    $scope.splitedImages = splitBy($scope.parent.productImages, 4);
                }
            });

            $scope.getImage = function (filename) {
                return designImageService.getImage($scope.imagesPath + filename);
            };

            $scope.selectImage = function (filename) {
                if (typeof filename !== "undefined" && filename !== "") {
                    $scope.parent.selectedImage = filename;
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