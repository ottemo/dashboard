angular.module("designModule")

    .directive("otBetween", function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, elem, attrs, ngModel) {
				var numberToLess = "The value is not within the specified range.";
				var numberToMore = "The value is not within the specified range.";
                var params = elem.attr('ot-between').split(",");

                var validate = function (value) {
                    var valid;
                    if (typeof value !== "undefined" &&
                        parseFloat(value) < parseFloat(params[0])) {
                        ngModel.message = numberToLess;
                        valid = false;
                    } else if (typeof value !== "undefined" &&
                        parseFloat(value) > parseFloat(params[1]))   {
                        ngModel.message = numberToMore;
                        valid = false;
                    } else {
                        valid = true;
                    }

                    ngModel.$setValidity('ot-between', valid);
                    return valid ? value : undefined;
                };

                //For DOM -> model validation
                ngModel.$parsers.unshift(validate);
                //For model -> DOM validation
                ngModel.$formatters.unshift(validate);
            }
        };
    });
