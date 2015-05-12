angular.module("dashboardModule")

.directive('content', [function () {
  return {
    restrict: 'E',
    templateUrl: function(elem,attr){
      return attr.src || "/themes/views/index.html"
    },
    link: function (scope, elem, attr) {
      // console.log('scope',scope);
      $(elem).css({
        opacity: 0
      })

      scope.$on('LoadingBar:loaded',function(){
        $(elem).animate({
          opacity: 1
        }).removeClass('ng-hide');
      });

    }
  };
}])