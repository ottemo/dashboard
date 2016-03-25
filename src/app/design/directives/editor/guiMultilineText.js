/**
 *  Directive used for automatic attribute editor creation
 */
angular.module('designModule')

.directive('guiMultilineText', [function() {
    return {
        restrict: 'E',
        scope: {
            'attribute': '=editorScope',
            'item': '=item'
        },
        templateUrl: '/views/design/gui/editor/multilineText.html'
    };
}]);

