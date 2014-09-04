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
            .directive("guiTableManager", ["$designService", function ($designService) {
                return {
                    restrict: "E",
                    scope: {
                        "parent": "=object",
                        "items": "=items",
                        "addNewDisable": "=addNewDisable",
                        "mapping": "=mapping"
                    },
                    templateUrl: $designService.getTemplate("design/gui/table.html"),
                    controller: function ($scope) {
                        var splitExtraData;

                        splitExtraData = function (item) {
                            var field;
                            for (field in item.Extra) {
                                if (item.Extra.hasOwnProperty(field)) {
                                    item[field] = item.Extra[field];
                                    delete item.Extra[field];
                                }
                            }
                        };

                        $scope.map = assignMapping($scope.mapping);

                        $scope.$watch("items", function () {
                            if (typeof $scope.items === "undefined") {
                                return false;
                            }
                            var i, item;
                            for (i = 0; i < $scope.items.length; i += 1) {
                                item = $scope.items[i];
                                if (item.Extra !== null) {
                                    splitExtraData(item);
                                }
                            }
                        }, true);
                    }
                };
            }]
        );

        return designModule;
    });
})(window.define);
