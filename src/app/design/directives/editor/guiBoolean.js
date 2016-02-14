angular.module("designModule")

.directive("guiBoolean", ["$designService", function($designService) {
  return {
    restrict: "E",
    templateUrl: $designService.getTemplate("design/gui/editor/select.html"),

    scope: {
      "attribute": "=editorScope",
      "item": "=item"
    },

    controller: function($scope) {
      $scope.options = [{
        Id: false,
        Name: "false"
      }, {
        Id: true,
        Name: "true"
      }];

      $scope.$watch("item", init);
      $scope.$watch("attribute", init);

      function init() {
        if (typeof $scope.attribute === "undefined" ||
          typeof $scope.item === "undefined"
        ) {
          return false;
        }
      }

    }
  };
}]);

