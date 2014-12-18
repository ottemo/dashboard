(function (define) {
    "use strict";

    define(["design/init"], function (designModule) {

        var notValid = "The field is not valid";

        designModule.directive("otRegexp", function () {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, elem, attrs, ngModel) {
                    var regexpValue = elem.attr('ot-regexp');


                    var validate = function (value) {
                        var params = regexpValue.split(/['"],['"]/);
                        var regExp;

                        if (params.length > 1) {
                            regExp = new RegExp(params[0].trim("/,\""), params[1].trim("/,\""));

                        } else {
                            regExp = new RegExp(params[0].trim("/,\""), "g");
                        }

                        var valid = regExp.test(value);
                        ngModel.$setValidity('ot-regexp', valid);
                        if (!valid) {
                            ngModel.message = notValid;
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