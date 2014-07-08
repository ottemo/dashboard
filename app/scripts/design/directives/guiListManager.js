(function (define) {
    "use strict";

    define(["design/init"], function (designModule) {
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
            supportedAttr = ["id", "name", "default_image", "image_path", "shortDesc"];

            /**
             * Default mapping
             * @type {object}
             */
            defaultMapping = {
                "id": "_id",
                "name": "name",
                "default_image": "default_image",
                "image_path": "image_path",
                "shortDesc": "shortDesc"
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

        designModule

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
                        "mapping": "=mapping"
                    },
                    templateUrl: $designService.getTemplate("design/gui/list.html"),
                    controller: function ($scope) {

                        $scope.map = assignMapping($scope.mapping);

                        /**
                         * Returns an indication the list has images or not
                         *
                         * @returns {boolean}
                         */
                        $scope.hasImage = function () {
                            var field, item;

                            item = $scope.items[0];
                            for (field in item) {
                                if (item.hasOwnProperty(field)) {
                                    if (field === "default_image" || field === "image") {
                                        return true;
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
                                default:
                                    _class = " product-list";
                            }
                            return _class;
                        };

                    }
                };
            }]);

        return designModule;
    });
})(window.define);
