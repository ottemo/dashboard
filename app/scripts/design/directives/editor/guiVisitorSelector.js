(function (define, $) {
    "use strict";

    define(["design/init"], function (designModule) {
        var clone = function (obj) {
            if (null === obj || "object" !== typeof obj) {
                return obj;
            }
            var copy = obj.constructor();
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) {
                    copy[attr] = obj[attr];
                }
            }
            return copy;
        };
        designModule
        /**
         *  Directive used for automatic attribute editor creation
         */
            .directive("guiVisitorSelector", [
                "$location",
                "$routeParams",
                "$designService",
                "$visitorApiService",
                "$designImageService",
                "COUNT_ITEMS_PER_PAGE",
                function ($location, $routeParams, $designService, $visitorApiService, $designImageService, COUNT_ITEMS_PER_PAGE) {
                    return {
                        restrict: "E",
                        templateUrl: $designService.getTemplate("design/gui/editor/visitorSelector.html"),

                        scope: {
                            "attribute": "=editorScope",
                            "item": "=item"
                        },

                        controller: function ($scope) {
                            var loadData;

                            $scope.fields = [
                                {
                                    "attribute": "Name",
                                    "type": "string",
                                    "label": "Name",
                                    "visible": true,
                                    "notDisable": true,
                                    "filter": "text",
                                    "filterValue": ""
                                }
                            ];

                            $scope.oldSearch = {};
                            $scope.selected = {};
                            $scope.isExpand = false;

                            var oldWidth;

                            /**
                             * Gets count items
                             *
                             * @returns {number}
                             */
                            $scope.getCountItems = function () {
                                var len = 0;
                                if (typeof $scope.item !== "undefined" &&
                                    typeof $scope.item[$scope.attribute.Attribute] !== "undefined" &&
                                    $scope.item[$scope.attribute.Attribute].length) {
                                    len = $scope.item[$scope.attribute.Attribute].length;
                                }
                                return len;
                            };

                            $scope.show = function (id) {
                                $("#" + id).modal("show");
                            };

                            $scope.hide = function (id) {
                                $("#" + id).modal("hide");
                            };

                            loadData = function () {

                                if (typeof $scope.search === "undefined") {
                                    $scope.search = {};
                                    $scope.search.limit = "0," + COUNT_ITEMS_PER_PAGE;
                                }
                                if (typeof $scope.search.limit === "undefined") {
                                    $scope.search.limit = "0," + COUNT_ITEMS_PER_PAGE;
                                }

                                if (JSON.stringify($scope.oldSearch) === JSON.stringify($scope.search)) {
                                    return false;
                                }

                                $scope.oldSearch = clone($scope.search);

                                /**
                                 * Gets list of visitors
                                 */
                                $visitorApiService.visitorList($location.search(), {}).$promise.then(
                                    function (response) {
                                        var result, i;
                                        $scope.items = [];
                                        result = response.result || [];
                                        for (i = 0; i < result.length; i += 1) {
                                            $scope.items.push(result[i]);
                                        }
                                    }
                                );

                                /**
                                 * Gets list of visitors
                                 */
                                $visitorApiService.getCountVisitors($location.search(), {}).$promise.then(
                                    function (response) {
                                        if (response.error === "") {
                                            $scope.count = response.result;
                                        } else {
                                            $scope.count = 0;
                                        }
                                    }
                                );
                            };

                            $scope.$watch("item", function () {
                                $scope.selected = {};

                                if (typeof $scope.item !== "undefined" && $scope.item._id) {

                                    for (var i = 0; i < $scope.item[$scope.attribute.Attribute].length; i += 1) {
                                        if (typeof $scope.item[$scope.attribute.Attribute] === "object") {
                                            $scope.selected[$scope.item[$scope.attribute.Attribute][i]._id] = true;
                                        }
                                    }
                                }
                            });

                            $scope.$watch("search", function () {
                                loadData();
                            });

                            $scope.$watch("selected", function () {
                                var id;
                                $scope.item[$scope.attribute.Attribute] = [];
                                for (id in $scope.selected) {
                                    if ($scope.selected.hasOwnProperty(id) && $scope.selected[id] === true) {
                                        $scope.item[$scope.attribute.Attribute].push(id);
                                    }
                                }

                            }, true);

                            $scope.expand = function () {
                                oldWidth = $('.modal-dialog').css("width");
                                $('.modal-dialog').css("width", "90%");
                                $scope.isExpand = true;
                            };

                            $scope.compress = function () {
                                $('.modal-dialog').css("width", oldWidth || "600px");
                                $scope.isExpand = false;
                            };
                        }
                    };
                }]);

        return designModule;
    });
})(window.define, jQuery);