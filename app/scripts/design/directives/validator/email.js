(function (define) {
    "use strict";
    define(["design/init"], function (designModule) {

        var re = new RegExp("^(([^<>()[\\]\\.,;:\\s@\"]+(\\.[^<>()[\\]\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$", "");
        var emailNotValid = "not valid email";

        designModule.directive("email", function () {
            return {
                restrict: 'EA',
                terminal: true,
                require: 'ngModel',
                link: function (scope, elem, attrs, ngModel) {

                    //For DOM -> model validation
                    ngModel.$parsers.unshift(function (value) {
                        var valid = re.test(value);
                        console.log(valid)
                        ngModel.$setValidity('email', valid);
                        ngModel.message = emailNotValid;
                        return valid ? value : undefined;
                    });

                    //For model -> DOM validation
                    ngModel.$formatters.unshift(function (value) {
                        var valid = re.test(value);
                        console.log(valid)
                        ngModel.$setValidity('email', valid);
                        ngModel.message = emailNotValid;
                        return value;
                    });
                }
            };
        });
    });
})(window.define);