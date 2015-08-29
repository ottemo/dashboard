angular.module('designModule')

// Directive for file input value binding
// Hides file input and wraps it within button element
// to provide better possibilities for styling
.directive('guiInputFile', ['$designService', function ($designService) {
    return {
        restrict: 'E',
        scope: {
            'file': '=', // bind file input value to outer scope
            'id': '=inputId', // file input id
            'name': '=inputName', // file input name attribute
            'placeholder': '=inputPlaceholder', // placeholder text when no file selected
        },
        templateUrl: $designService.getTemplate("design/gui/inputFile.html"),
        replace: true,
        link: function(scope, element) {
            var fileInput = element.find('input');

            // Update scope.file when file input changes
            fileInput.on('change', function(event) {
                scope.$apply(function() {
                    scope.file = event.target.files[0];
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
        },
   }
}]);