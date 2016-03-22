angular.module('designModule')

.directive('guiPassword', [function() {
    return {
        restrict: 'EA',
        scope: {
            'attribute': '=editorScope',
            'item': '=item'
        },
        templateUrl: '/views/design/gui/editor/password.html'
    };
}]);

