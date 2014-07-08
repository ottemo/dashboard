(function (define) {
    'use strict';

    define(['design/init'], function (designModule) {
        designModule
            /**
             *  Directive used for automatic attribute editor creation
             */
            .directive('guiNotEditable', ['$designService', function ($designService) {
                return {
                    restrict: 'E',
                    scope: {
                        'attribute': '=editorScope',
                        'item': '=item'
                    },
                    templateUrl: $designService.getTemplate('design/gui/editor/notEditable.html'),

                    controller: ['$scope', function($scope) {

                    }]
                };
            }]);

        return designModule;
    });
})(window.define);