angular.module("designModule")
/**
*  Directive used for automatic attribute editor creation
*/

.directive("guiDatetime", [function () {
    return {
        restrict: "E",
        scope: {
            "attribute": "=editorScope",
            "item": "=item"
        },
        templateUrl: "/views/design/gui/editor/datetime.html",

        controller: [
            "$scope",
            function ($scope) {

                var isInit = false;
                $scope.$watch("item", function () {
                    if (typeof $scope.item === "undefined") {
                        return false;
                    }
                    var date;

                    if (typeof $scope.item[$scope.attribute.Attribute] === "undefined") {
                        date = new Date();
                    } else {
                        date = new Date($scope.item[$scope.attribute.Attribute]);
                    }

                    var month = date.getMonth().toString().length < 2 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
                    var day = date.getDate().toString().length < 2 ? '0' + date.getDate() : date.getDate();

                    $scope.value = month + "/" + day + '/' + date.getFullYear();

                    isInit = true;
                }, true);

                $scope.changeValue = function () {
                    if (typeof $scope.value === "undefined") {
                        return false;
                    }

                    try {
                        $scope.item[$scope.attribute.Attribute] = new Date($scope.value).toISOString();
                    } catch (e) {
                        $scope.item[$scope.attribute.Attribute] = new Date().toISOString();
                    }
                };
            }
        ]
    //                    link: function ($scope, elm, attrs, ngModel) {
    ////                        $scope.$watch("value", function(){
    //                        if (typeof $scope.value !== "undefined") {
    //                            $scope.value.$setViewValue(elm.val());
    //                            $scope.changeValue();
    //                        }
    ////                        });
    //
    //                    }
    };
}]);