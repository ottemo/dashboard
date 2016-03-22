/**
 *  Directive used for automatic attribute editor creation
 */
angular.module('designModule')

.directive('guiText', [function() {
    return {
        restrict: 'E',
        scope: {
            'attribute': '=editorScope',
            'item': '=item'
        },
        templateUrl: '/views/design/gui/editor/text.html',

        controller: ['$scope', function() {}]
    };
}]);

