// Directive for file input value binding
// Hides file input and wraps it within button element
// to provide better possibilities for styling
angular.module('coreModule')

.directive('otInputFile', [function() {
    return {
        restrict: 'E',
        scope: {
            'file': '=', // bind file input value to outer scope
            'id': '=inputId', // file input id
            'name': '=inputName', // file input name attribute
            'onChange': '&' // On change event listener
        },
        templateUrl: '/views/core/directives/input-file.html',
        replace: true,
        transclude: true,

        link: function(scope, element, attr, ctrl, transclude) {
            var fileInput = element.find('input');

            fileInput.on('change', function(event) {
                scope.$apply(function() {
                    // Update scope.file when file input changes
                    scope.file = event.target.files[0];
                    // Run onChange listener
                    if (scope.onChange) {
                        scope.onChange();
                    }
                });
            });

            // Cancel event bubbling when file input click triggered
            fileInput.on('click', function(e) {
                e.stopPropagation();
            });

            // Click event on button triggers click on file input
            // to open file dialog
            element.on('click', function() {
                fileInput.trigger('click');
            });
        }
    };
}]);

