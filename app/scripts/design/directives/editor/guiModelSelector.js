(function (define) {
    "use strict";

    define(["design/init"], function (designModule) {
        designModule
        /**
         *  Directive used for automatic attribute editor creation
         */
            .directive("guiModelSelector", ["$designService", "$designApiService", function ($designService, $designApiService) {
                return {
                    restrict: "E",
                    templateUrl: $designService.getTemplate("design/gui/editor/modelSelector.html"),

                    scope: {
                        "attribute": "=editorScope",
                        "item": "=item"
                    },

                    controller: function ($scope) {
                        $scope.$watch("item", function(){
                            console.log($scope.item);
                            $designApiService.attributesModel({"visitorId": $scope.item._id}).$promise.then(

                                function (response) {
                                    var result = response.result || [];
                                    $scope.options = result;
                                });
                        });

                    }
                };
            }]);

        return designModule;
    });
})(window.define);