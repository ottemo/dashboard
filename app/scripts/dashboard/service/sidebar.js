
var getParentItem, parentItem, transformMenu;

getParentItem = function (data, field, value) {
for (var i in data) {
    if (data.hasOwnProperty(i)) {
        if (data[i][field] === value) {
            parentItem = data[i];
        }
        var $subList = data[i].items;
        if ($subList) {
            getParentItem($subList, field, value);
        }
    }
}

return parentItem;
};

/**
* Transforms simple array with menu items to the object array which includes array subitems
* and returns this array
*
* @param menu
* @returns {Array}
*/
transformMenu = function (menu) {// jshint ignore:line
var i, item, parentPath, tmpMenu;
tmpMenu = [];
menu.sort(function (obj1, obj2) {
    return obj2.path < obj1.path;
});

for (i in menu) {
    if (menu.hasOwnProperty(i)) {
        parentItem = undefined;
        item = menu[i];
        /**
         * Item belongs to the upper level.
         * He has only one level in path
         */
        if (item.path.split("/").length <= 2) {
            tmpMenu.push(item);
        } else {
            /**
             * Gets from path parent path
             * Exaample:
             * for this item with path
             * /item_1/sub_item_1/sub_item_1_1
             *
             * parent item should have path
             * /item_1/sub_item_1
             *
             * @type {string}
             */
            parentPath = item.path.substr(0, item.path.lastIndexOf("/"));
            if (getParentItem(menu, "path", parentPath)) {
                if (typeof parentItem.items === "undefined") {
                    parentItem.items = [];
                }
                parentItem.items.push(item);
            }
        }
    }
}
return tmpMenu;
};

angular.module("dashboardModule")
/*
 *  $pageSidebarService implementation
 */
.service("$dashboardSidebarService", [function () {
    var addItem, getItems, getType, items, isImagePathRegex, transformedItems;
    items = [];
    transformedItems = null;
    isImagePathRegex = new RegExp(".gif|png|jpg|ico$", "i");

    /**
     * Adds item in the left sidebar
     *
     * @param {string} title
     * @param {string} link
     * @param {string} _class
     * @param {number} sort - The list will be displayed in descending order by this field
     */
    addItem = function (path, title, link, icon, sort) {
        var prepareLink;

        prepareLink = function (p) {
            var result;

            if(null === p){
                return p;
            }

            if ("/" !== p[0]) {
                result = "#/" + p;
            } else {
                result = "#" + p;
            }

            return result;
        };

        sort = ( sort || 0 );

        items.push({
            "path": path,
            "title": title,
            "link": prepareLink(link),
            "icon": icon,
            "sort": sort});
    };

    /**
     * Gets items for left sidebar
     *
     * @returns {Array}
     */
    getItems = function () {
        if(transformedItems !== null){
            return transformedItems;
        }

        transformedItems = transformMenu(items);

        var recursiveSort = function(arr){
            arr.sort(function (a, b) {
                if(typeof a.items !== "undefined" && a.items.length > 0){
                    recursiveSort(a.items);
                }
                if(typeof b.items !== "undefined" && b.items.length > 0){
                    recursiveSort(b.items);
                }
                return a.sort < b.sort;
            });
        };

        recursiveSort(transformedItems);

        return transformedItems;
    };

    /**
     *
     * @param {string} icon
     * @returns {string}
     */
    getType = function (icon) {
        var type;
        type = "class";

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