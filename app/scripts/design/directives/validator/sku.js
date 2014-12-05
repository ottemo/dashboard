(function (define) {
    "use strict";

    define(["design/init"], function (designModule) {

        var maxLength = 150;
        var re = new RegExp("^[\\w\\d\\_\\+]{1," + maxLength + "}$", "i");
        var skuNotValid = "not valid sku";
        var skuTooMuchLong = "sku too much long";

        designModule.directive("sku", function () {
            return {
                restrict: 'EA',
                terminal: true,
                require: 'ngModel',
                link: function (scope, elem, attrs, ngModel) {

                    //For DOM -> model validation
                    ngModel.$parsers.unshift(function (value) {

                        if (typeof value !== "undefined" && value.length > maxLength) {
                            ngModel.$setValidity('sku', false);
                            ngModel.message = skuTooMuchLong;
                            return false;
                        }

                        var valid = re.test(value);
                        ngModel.$setValidity('sku', valid);
                        if(!valid){
                            ngModel.message = skuNotValid;
                        }
                        return valid ? value : undefined;
                    });

                    //For model -> DOM validation
                    ngModel.$formatters.unshift(function (value) {
                        if (typeof value !== "undefined" && value.length > maxLength) {
                            ngModel.$setValidity('sku', false);
                            ngModel.message = skuTooMuchLong;
                            return false;
                        }

                        var valid = re.test(value);
                        ngModel.$setValidity('sku', valid);
                        if(!valid){
                            ngModel.message = skuNotValid;
                        }
                        return value;
                    });
                }
            };
        });
    });
})(window.define);