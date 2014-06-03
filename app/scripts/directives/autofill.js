(function (define) {
    'use strict';

    /*****************************************************************************/
    /*                                                                           */
    /*                                                                           */
    /*  Solves the problem with getting values from fields with auto filling     */
    /*                                                                           */
    /*                Source: http://stackoverflow.com/a/21073094                */
    /*                                                                           */
    /*                                                                           */
    /*                                                                           */
    /*****************************************************************************/

    define(['angular'], function (angular) {
        angular.module('dashboardApp.directives.Autofill', [])
            .directive('autofill', function () {
                return {
                    require: 'ngModel',
                    link: function (scope, element, attrs, ngModel) {
                        scope.$on('autofill:update', function () {
                            console.log('autofill -> ' + element.val());
                            ngModel.$setViewValue(element.val());
                        });
                    }
                };
            });
    });
})(window.define);