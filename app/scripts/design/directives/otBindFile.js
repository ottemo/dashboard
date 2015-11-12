/**
 * You can just add this to an input[typ=file] and it'll sync the value, like ng-model
 *
 * <input type="file" ot-bind-file="filesModel" />
 */
angular.module('designModule')

.directive('otBindFile', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, el, attrs) {
            el.bind('change', function() {
                $parse(attrs.otBindFile)
                    .assign(scope, el[0].files);

                scope.$apply();
            });
        }
    }
}]);

