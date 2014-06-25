(function (define) {
    'use strict';

    define([
            'angular'
        ],
        function (angular) {
            /*
             *  Angular 'designModule' allows to use themes
             *
             *  default [themeName] is blank
             *  Usage:
             *      <ng-include src="getTemplate('dashboard/footer.html')" />
             *      i.e. - getTemplate('someTemplate.html') = views/[themeName]/someTemplate.html
             *
             */
            angular.module.designModule = angular.module('designModule',[])

                /*
                 *  $designService implementation
                 */
                .service('$designService', [function () {
                    var data = { theme: '', topPage: 'index.html', cssList: []};

                    var isFullPathRegex = RegExp('^http[s]?://', "i");
                    var isCssRegex = RegExp('.css$', "i");

                    return {
                        getTheme: function() { return data.theme; },
                        setTheme: function(newTheme) {
                            return data.theme = newTheme;
                        },

                        getTopPage: function() {
                            return this.getTemplate( data.topPage );
                        },
                        setTopPage: function(newTopPage) {
                            return data.topPage = newTopPage;
                        },

                        getTemplate: function(templateName) {
                            return ('views/' + data.theme + "/" + templateName).replace(/\/+/, '/');
                        },

                        addCss: function(cssName) {
                            if ( isFullPathRegex.test(cssName) == false && isCssRegex.test(cssName) == true ) {
                                cssName = 'styles/' + data.theme + "/" + cssName;
                                cssName = cssName.replace(/\/+/, '/');
                            }
                            data.cssList.push(cssName);

                            return cssName;
                        },

                        getCssList: function() {
                            return data.cssList;
                        },

                        getCssHeadLinks: function() {
                            var html = '';
                            for (var idx in data.cssList) {
                                var cssFile = data.cssList[idx];
                                html += '<link rel="stylesheet" href="' + cssFile + '" type="text/css" />' + "\n";
                            }
                            return html;
                        }
                    };
                }])

                /**
                 *  Directive that allows to declare CSS inside module templates
                 */
                .directive('addCss', ['$designService', function ($designService) {
                    return {
                        restrict: 'E',
                        link: function (scope, elem, attrs) {
                            var cssFile = attrs['href'];
                            if (cssFile != 'undefined' && cssFile != '') {
                                $designService.addCss(cssFile);
                            }
                        }
                    };
                }])

                /*
                 *  Startup for designModule - registration of couple global function + document.ready handler
                 */
                .run(['$designService', '$rootScope', function ($designService, $rootScope) {

                    /**
                     *  Global functions you can use in any angular template
                     */
                    $rootScope.getTemplate = $designService.getTemplate;
                    $rootScope.getCss = $designService.getCss;
                    $rootScope.getTopPage = $designService.getTopPage;

                    /**
                     *  CSS appending in head of document after document ready
                     */
                    angular.element(document).ready(function() {
                        angular.element(document.head).append( $designService.getCssHeadLinks() );
                    });

                }]);

            return angular.module.designModule;
        });
})(window.define);