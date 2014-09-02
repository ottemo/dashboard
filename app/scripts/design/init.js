(function (define) {
    "use strict";

    /*
     *  Angular "designModule" is very common module and responds for a top HTML page rendering stuff.
     *  It contains theming feature as well as ui editor controls directives. And even more.
     *
     *  (check other modules dependency before exclude this module from include list)
     *
     */
    define(["angular"], function (angular) {

        angular.activeTheme = "default";

        // TODO: modify this check when we support multiple themes
        angular.isExistFile = false;
        // angular.isExistFile = function (path) {
//            if (files[angular.activeTheme].indexOf(path) !== -1) {
//                return true;
//            }
        //
        //     return false;
        // };

        angular.getTheme = function (path) {

            return function () {
                var template, tpl;
                tpl = "/views/" + path;

                if (angular.isExistFile) {
                    template = "themes/" + angular.activeTheme + tpl;
                } else {
                    template = "themes/default" + tpl;
                }

                return template;
            };
        };

        /*
         *  Angular "designModule" allows to use themes
         *
         *  default [themeName] is blank
         *  Usage:
         *      <ng-include src="getTemplate("dashboard/footer.html")" />
         *      i.e. - getTemplate("someTemplate.html") = views/[themeName]/someTemplate.html
         *
         */
        angular.module.designModule = angular.module("designModule",[])

            .constant("MEDIA_BASE_PATH", "http://dev.ottemo.io/media/")
            .constant("PRODUCT_DEFAULT_IMG", "placeholder.png")

            /*
             *  Startup for designModule - registration globally visible functions
             */
            .run(["$designService", "$rootScope", function ($designService, $rootScope) {

                /**
                 *  Global functions you can use in any angular template
                 */
                $rootScope.setTheme = $designService.setTheme;
                $rootScope.getTemplate = $designService.getTemplate;
                $rootScope.getTopPage = $designService.getTopPage;
                $rootScope.getCss = $designService.getCssList;
                $rootScope.getImg = $designService.getImage;


                /**
                 *  CSS appending in head of document after document ready
                 *  TODO: should work with "addCss" directive but is buggy, review/update needed
                 */
                // angular.element(document).ready(function() {
                //     angular.element(document.head).append( $designService.getCssHeadLinks() );
                // });

            }]);

        return angular.module.designModule;
    });
})(window.define);
