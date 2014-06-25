(function (define) {
    'use strict';

    /*
     *  HTML top page manipulation stuff
     */
    define([
            'dashboard/init'
        ],
        function (dashboardModule) {

            dashboardModule
                /*
                 *  $pageService implementation
                 */
                .service('$pageService', [function () {

                    var it = { showHeader: true };

                    return {
                        hideHeader: function() { it.showHeader = false; },
                        showHeader: function() { it.showHeader = true; },
                          isHeader: function() { return it.showHeader; }
                    }
                }]);

            return dashboardModule;
        });

})(window.define);