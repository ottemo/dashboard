(function (define) {
    "use strict";
    define(["design/init"], function (designModule) {

        var re = new RegExp("^(([^<>()[\\]\\.,;:\\s@\"]+(\\.[^<>()[\\]\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$", "");
        var emailNotValid = "Please enter a valid email address. For example johndoe@domain.com.";

        designModule.directive("otEmail", function () {
            return {
                restrict: 'EA',
                require: '?ngModel',
                link: function (scope, elem, attrs, ngModel) {
                    var validate = function (value) {
                        var valid = re.test(value);
                        ngModel.$setValidity('ot-email', valid);
                        if (!valid) {
                            ngModel.message = emailNotValid;
                        }

                        return value;
                    };

                    //For DOM -> model validation
                    ngModel.$parsers.unshift(validate);
                    //For model -> DOM validation
                    ngModel.$formatters.unshift(validate);
                }
            };
        });
    });
})(window.define);