angular.module("dashboardModule")

.directive('content', [function () {
  return {
    restrict: 'E',
    templateUrl: function(elem,attr){
      return attr.src || "/themes/views/index.html"
    },
    link: function (scope, elem, attr) {
      // console.log('scope',scope);


    }
  };
}])