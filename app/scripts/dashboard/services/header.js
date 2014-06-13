(function (define) {
    'use strict';

    /*
     *  HTML top page header manipulation stuff
     */
    define([
            'dashboard/init'
        ],
        function (dashboardModule) {

            dashboardModule
                /*
                 *  $pageHeaderService implementation
                 */
                .service('$pageHeaderService', ['$loginService', function ($loginService) {

                    var it = {
                        username: '',
                        menu: {}
                    };

                    return {
                        isLogined: function() {
                            return $loginService.isLogined();
                        },

                        getUsername: function() {
                            return it.username;
                        },

                        logout: function() {
                            $loginService.logout();
                        },

                        addMenuItem: function(path, link) {
                            it.menu.path = link;
                        },

                        getMenuItems: function() {
                            return it.menu;
                        }
                    }
                }]);

            return dashboardModule;
        });

})(window.define);