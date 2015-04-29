angular.module("designModule")

/**
*  For activating a confirm field,  attributes  password should have property 'Confirm' = true
*  Example:
*  scope.attribute = {
*      Attribute: "password"
*      Collection: "visitor"
*      Confirm: true           // For this editor will be added a field confirm
*      Default: ""
*      Editors: "password"
*      Group: "Password"
*      IsLayered: false
*      IsRequired: false
*      IsStatic: true
*      Label: "Password"
*      Model: "Visitor"
*      Options: ""
*      Type: "text"
*      Validators: ""
*  }
*/

.directive("guiPassword", ["$designService", function ($designService) {
    return {
        restrict: "EA",
        scope: {
            "attribute": "=editorScope",
            "item": "=item"
        },
        templateUrl: $designService.getTemplate("design/gui/editor/password.html")
    };
}])

.directive('password', [function () {
    var passwordDontMatch = "Passwords don't match.";

    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, elem, attrs, ngModel) {
            var firstPassword, confirmPassword;

            if (!scope.attribute.Confirm) {
                return true;
            }

            firstPassword = '#' + attrs.id;
            confirmPassword = '#' + attrs.id + "_confirm";

            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    var valid;
                    valid = elem.val() === $(confirmPassword).val();

                    if (!valid) {
                        ngModel.message = passwordDontMatch;
                    }

                    ngModel.$setValidity("pwmatch", valid);
                });
            });
        }
    };
}])

.directive('passwordConfirm', ["$parse", function ($parse) {
    var passwordDontMatch = "Passwords don't match.";

    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModel) {
            var passwordId, firstPassword;

            passwordId = $parse(elem.attr('password-confirm'))(scope) || "";
            firstPassword = '#inp_' + passwordId;

            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    var valid;

                    valid = elem.val() === $(firstPassword).val();

                    if (!valid) {
                        ngModel.message = passwordDontMatch;
                        scope.passwordForm[passwordId].message = passwordDontMatch;
                    }

                    scope.passwordForm[passwordId].$setValidity("pwmatch", valid);
                    ngModel.$setValidity("pwmatch", valid);
                });
            });
        }
    };
}]);