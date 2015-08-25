angular.module('designModule')

.directive('otFileReader', [function () {
    return {
        restrict: 'A',
        scope: {
            file: '='
        },
        link: function (scope, element, attributes) {
            element.on('change', function (changeEvent) {
                scope.$apply(function() {
                    scope.file = changeEvent.target.files[0].name;
                    console.log(scope.file);
                });
            });
        }
    }
}]);