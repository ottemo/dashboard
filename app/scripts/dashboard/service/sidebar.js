(function (define) {
    "use strict";

    /*
     *  HTML top page header manipulation stuff
     */
    define([
            "dashboard/init"
        ],
        function (dashboardModule) {

            dashboardModule
                /*
                 *  $pageSidebarService implementation
                 */
                .service("$dashboardSidebarService", [function () {
                    var addItem, getItems, getType, items, isImagePathRegex;
                    items = [];
                    isImagePathRegex = new RegExp(".gif|png|jpg|ico$", "i");

                    /**
                     * Adds item in the left sidebar
                     *
                     * @param {string} title
                     * @param {string} link
                     * @param {string} _class
                     * @param {number} sort - The list will be displayed in descending order by this field
                     */
                    addItem = function (title, link, icon, sort) {
                        sort = ( sort || 0 );
                        items.push({"title": title, "link": link, "icon": icon, "sort": sort});
                    };

                    /**
                     * Gets items for left sidebar
                     *
                     * @returns {Array}
                     */
                    getItems = function () {
                        return items.sort(function (a, b) {
                            return a.sort < b.sort;
                        });
                    };

                    /**
                     *
                     * @param {string} icon
                     * @returns {string}
                     */
                    getType = function (icon) {
                        var type;

                        if (isImagePathRegex.test(icon) === true) {
                            type = "image";
                        }
                        if (icon.indexOf("glyphicon") !== -1) {
                            type = "glyphicon";
                        }

                        return type;
                    };

                    return {
                        addItem: addItem,
                        getItems: getItems,
                        getType: getType
                    };
                }]);

            return dashboardModule;
        });

})(window.define);