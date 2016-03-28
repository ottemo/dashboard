angular.module("coreModule")
/**
*  Directive used for automatic attribute editor creation
*/
.directive("otJsonEditor", [function () {
    return {
        restrict: "E",
        scope: {
            "data": "=data"
        },
        templateUrl: "/views/core/directives/editor/json.html",

        controller: ["$scope", function ($scope) {
            $scope.items = [
                { "key": "",
                    "value": ""
                }
            ];
            $scope.show = function () {
                $("#jsonEditor").modal("show");
            };

            $scope.hide = function () {
                var data;
                data = {};
                for (var i = 0; i < $scope.items.length; i += 1) {
                    data[$scope.items[i].key] = $scope.items[i].value;
                }
                $scope.data = JSON.stringify(data);

                $("#jsonEditor").modal("hide");
            };

            $scope.addItem = function () {
                $scope.items.push({
                    "key": "",
                    "value": ""
                });
            };

            $scope.$watch("data", function () {

                var obj, key;
                if ($scope.data === "" || typeof $scope.data === "undefined") {
                    return false;
                }
                obj = JSON.parse($scope.data);
                $scope.items = [];
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        $scope.items.push({
                            "key": key,
                            "value": obj[key]
                        });
                    }
                }

            }, true);

            $scope.remove = function (key) {
                for (var i = 0; i < $scope.items.length; i += 1) {
                    if (key === $scope.items[i].key) {
                        $scope.items.splice(i, 1);
                        break;
                    }
                }
            };

            $scope.$watch("items", function () {
//                            var data;
//                            data = {};
//                            for (var i = 0; i < $scope.items.length; i += 1) {
//                                data[$scope.items[i].key] = $scope.items[i].value;
//                            }
////                            console.log(data.toString())
//                            $scope.data = JSON.stringify(data);
            }, true);
        }]
    };
}]);