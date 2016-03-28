/**
 * You can just add this to an it'll sync the value, like ng-model
 * but for FileList.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/FileList
 * https://developer.mozilla.org/en-US/docs/Web/API/File
 *
 * @template input[type=file ot-bind-file=filesModel]
 */
angular.module('coreModule')

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

