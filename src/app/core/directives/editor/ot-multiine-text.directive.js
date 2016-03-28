/**
 *  Directive used for automatic attribute editor creation
 */
angular.module('coreModule')

.directive('otMultilineText', [function() {
    return {
        restrict: 'E',
        scope: {
            'attribute': '=editorScope',
            'item': '=item'
        },
        templateUrl: '/views/core/directives/editor/multiline-text.html'
    };
}]);

