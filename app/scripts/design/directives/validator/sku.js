(function (define) {
    "use strict";

    define(["design/init"], function (designModule) {

        var maxLength = 150;
        var re = new RegExp("^[\\w\\d\\_\\-]{1," + maxLength + "}$", "i");
        var skuNotValid = "Please use only letters (a-z, A-Z), numbers (0-9) or underscore(_) in this field, first character should be a letter. Max length " + maxLength;
        var skuTooMuchLong = "Please use only letters (a-z), numbers (0-9) or underscore(_) in this field, first character should be a letter. Max length " + maxLength;

        designModule.directive("otSku", function () {
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function (scope, elem, attrs, ngModel) {

                    var validate = function (value) {
                        if (typeof value !== "undefined" && value.length > maxLength) {
                            ngModel.$setValidity('ot-sku', false);
                            ngModel.message = skuTooMuchLong;

                            return false;
                        }

                        var valid = re.test(value);
                        ngModel.$setValidity('ot-sku', valid);
                        if (!valid) {
                            ngModel.message = skuNotValid;
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