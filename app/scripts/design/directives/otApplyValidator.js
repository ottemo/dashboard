(function (define) {
    "use strict";

    define(["design/init"], function (designModule) {

        designModule.directive("otApplyValidator", function ($parse, $compile) {
            return {
                restrict: 'A',
                replace: false,
                terminal: true,
                priority: 1000,
                link: function (scope, elem) {
                    var validatorStr = $parse(elem.attr('ot-apply-validator'))(scope);

                    if (typeof validatorStr !== "string" && validatorStr !== "") {
                        return true;
                    }

                    var i, validatorList, validator, regExp, matches;
                    validatorList = validatorStr.split(/[ ]/);

                    for (i = 0; i < validatorList.length; i += 1) {
                        validator = validatorList[i];

                        if (validator === "") {
                            continue;
                        }

                        regExp = new RegExp("(\\w+)(\(\\d+\\,\\d+\)|\(\\d+\))*", "g"); // jshint ignore:line
                        matches = validator.match(regExp);

                        if (matches.length > 1) {
                            elem.attr("ot-" + matches[0], matches[1] + "," + matches[2]);
                        } else {
                            elem.attr("ot-" + matches[0], "true");
                        }
                    }

                    elem.removeAttr("ot-apply-validator");

                    $compile(elem)(scope);
                }
            };
        });

    });
})(window.define);