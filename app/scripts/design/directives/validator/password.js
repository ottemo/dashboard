(function (define) {
    "use strict";
    define(["design/init"], function (designModule) {
        var minLen, minCountUppercase, minCountLowercase, minCountNumbers, minCountSymbols, passwordNotValidLength,
            passwordNotEnoughLowercases, passwordNotEnoughUppercases, passwordNotEnoughNumbers, passwordNotEnoughSymbols;

        minLen = 8;
        minCountUppercase = 1;
        minCountLowercase = 1;
        minCountNumbers = 1;
        minCountSymbols = 1;

        passwordNotValidLength = "password should have " + minLen + " char or more";
        passwordNotEnoughLowercases = "password should have not less " + minCountUppercase + " lowercase";
        passwordNotEnoughUppercases = "password should have not less " + minCountUppercase + " uppercase";
        passwordNotEnoughNumbers = "password should have not less " + minCountNumbers + " numbers";
        passwordNotEnoughSymbols = "password should have not less " + minCountSymbols + " symbols";

        designModule.directive("otPassword", function () {
            return {
                restrict: 'EA',
                require: '?ngModel',
                link: function (scope, elem, attrs, ngModel) {
                    var checkLowercases = function (value) {
                        var matches = value.match(/([a-z]+)/g);
                        return (matches === null || (matches !== null && matches.join("").length < minCountLowercase));
                    };
                    var checkUppercases = function (value) {
                        var matches = value.match(/([A-Z]+)/g);
                        return (matches === null || (matches !== null && matches.join("").length < minCountUppercase));
                    };
                    var checkNumbers = function (value) {
                        var matches = value.match(/([\d]+)/g);
                        return (matches === null || (matches !== null && matches.join("").length < minCountNumbers));
                    };
                    var checkSymbols = function (value) {
                        var matches = value.match(/([\!\@\#\\$\%\^\&\*\(\)\_\+\-\~]+)/g);
                        return (matches === null || (matches !== null && matches.join("").length < minCountSymbols));
                    };
                    var validate = function (value) {
                        /*jshint maxcomplexity:6 */
                        var valid = true;
                        if (value.length < minLen) {
                            valid = false;
                            ngModel.message = passwordNotValidLength;
                        }
                        if (checkLowercases(value)) {
                            valid = false;
                            ngModel.message = passwordNotEnoughLowercases;
                        }
                        if (checkUppercases(value)) {
                            valid = false;
                            ngModel.message = passwordNotEnoughUppercases;
                        }
                        if (checkNumbers(value)) {
                            valid = false;
                            ngModel.message = passwordNotEnoughNumbers;
                        }
                        if (checkSymbols(value)) {
                            valid = false;
                            ngModel.message = passwordNotEnoughSymbols;
                        }
                        ngModel.$setValidity('ot-password', valid);
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