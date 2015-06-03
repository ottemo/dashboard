
var assignMapping;

assignMapping = function (mapping) {
    var unsupportedAttr, supportedAttr, defaultMapping;

    /**
     * Unsupported attributes
     *
     * @type {string[]}
     */
    unsupportedAttr = [];

    /**
     * supported attributes
     *
     * @type {string[]}
     */
    supportedAttr = ["id", "name", "image", "shortDesc", "additionalName"];

    /**
     * Default mapping
     * @type {object}
     */
    defaultMapping = {
        "id": "Id",
        "name": "Name",
        "image": "Image",
        "shortDesc": "Desc",
        "additionalName": "additional"
    };

    for (var field in mapping) {
        if (mapping.hasOwnProperty(field)) {
            if (typeof defaultMapping[field] !== "undefined") {
                defaultMapping[field] = mapping[field];
            } else {
                unsupportedAttr.push("'" + field + "'");
            }
        }
    }
    if (unsupportedAttr.length > 0) {
        console.warn("\nUnsupported attributes for list:\n   " + unsupportedAttr.join("\n   ") +
            "\n" + "List of available attributes for setting:\n   " + supportedAttr.join("\n   "));
    }

    return defaultMapping;
};

angular.module("designModule")

/**
*  Directive used for automatic attributes editor form creation
*
*  guiListManager:
*
*  Variables:
*      items   - array of items for list
*      parent  - should implement next functions
*          - clearForm()               - cleaning form
*          - switchListView(type)      - the switching  the type of the list view
*          - select(id)                - selecting item of the list
*          - delete(id)                - deleting item from the list
*          - getImage(path, filename)  - returns full path to image
*      mapping - mapping internal fields of list to the fields from item
*
*  Functions:
*      $scope.hasImage {boolean}   - Returns an indication the list has images or not
*      $scope.getListType {string} - Returns the necessary class for list
*/

.directive("guiListManager", ["$designService", function ($designService) {
    return {
        restrict: "E",
        scope: {
            "parent": "=object",
            "items": "=items",
            "addNewDisable": "=addNewDisable",
            "mapping": "=mapping"
        },
        templateUrl: $designService.getTemplate("design/gui/list.html"),
        controller: function ($scope) {

            $scope.map = assignMapping($scope.mapping);

            $scope.canAddNew = function () {
                return $scope.addNewDisable;
            };

            /**
             * Returns an indication the list has images or not
             *
             * @returns {boolean}
             */
            $scope.hasImage = function () {
                var i, field, item;

                for (i = 0; i < $scope.items.length; i += 1) {
                    item = $scope.items[i];
                    for (field in item) {
                        if (item.hasOwnProperty(field)) {
                            if (field === "Image" && item[field] !== "") {
                                return true;
                            }
                        }
                    }
                }

                return false;
            };

            /**
             * Returns the necessary class for list
             *
             * @returns {string}
             */
            $scope.getListType = function () {
                var _class;
                switch ($scope.parent.activeView) {
                    case "tile":
                        _class = " product-list tile";
                        break;
                    case "list":
                        _class = " product-list";
                        break;
                    default:
                        _class = " product-list";
                }
                return _class;
            };

        }
    };
}]);