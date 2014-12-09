(function (define) {
    "use strict";

    define(["design/init"], function (designModule) {

        var re = new RegExp("^[\\w\\d\\_]+[\\w\\d\\_\\-]*$", "");
        var stringNotValid = "not valid string";

        designModule.directive("otString", function () {
            return {
                restrict: 'A',
                terminal: true,
                require: '?ngModel',
                link: function (scope, elem, attrs, ngModel) {

                    var validate = function (value) {
                        var valid = re.test(value);
                        ngModel.$setValidity('ot-string', valid);
                        if (!valid) {
                            ngModel.message = stringNotValid;
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