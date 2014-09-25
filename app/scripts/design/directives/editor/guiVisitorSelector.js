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
                                    "type": "select-link",
                                    "label": "Name",
                                    "visible": true,
                                    "notDisable": true
                                },
                                {
                                    "attribute": "first_name",
                                    "type": "string",
                                    "label": "First name",
                                    "visible": true,
                                    "notDisable": false,
                                    "filter": "text",
                                    "filterValue": $routeParams['first_name']
                                },
                                {
                                    "attribute": "last_name",
                                    "type": "string",
                                    "label": "Last name",
                                    "visible": true,
                                    "notDisable": false,
                                    "filter": "text",
                                    "filterValue": $routeParams['last_name']
                                },
                                {
                                    "attribute": "email",
                                    "type": "string",
                                    "label": "Email",
                                    "visible": true,
                                    "notDisable": false,
                                    "filter": "text",
                                    "filterValue": $routeParams.email
                                },
                                {
                                    "attribute": "group",
                                    "type": "string",
                                    "label": "Group",
                                    "visible": true,
                                    "notDisable": false,
                                    "filter": "select",
                                    "filterValue": $routeParams.group
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
                                $visitorApiService.visitorList($scope.search, {"extra": "email,group,last_name,first_name"}).$promise.then(
                                    function (response) {
                                        var result, i;
                                        $scope.visitorsTmp = [];
                                        result = response.result || [];
                                        for (i = 0; i < result.length; i += 1) {
                                            $scope.visitorsTmp.push(result[i]);
                                        }
                                    }
                                );

                                /**
                                 * Gets list of visitors
                                 */
                                $visitorApiService.getCountVisitors($scope.search, {}).$promise.then(
                                    function (response) {
                                        if (response.error === "") {
                                            $scope.count = response.result;
                                        } else {
                                            $scope.count = 0;
                                        }
                                    }
                                );


                                $visitorApiService.attributesInfo().$promise.then(
                                    function (response) {
                                        var result = response.result || [];

                                        $scope.attributes = result;
                                        var prepareGroups = function () {
                                            for (var i = 0; i < $scope.fields.length; i += 1) {
                                                if (typeof $scope.fields[i].filter !== "undefined" && -1 !== $scope.fields[i].filter.indexOf("select")) {
                                                    for (var j = 0; j < $scope.attributes.length; j += 1) {
                                                        if ($scope.fields[i].attribute === $scope.attributes[j].Attribute) {
                                                            $scope.fields[i].filter = "select" + $scope.attributes[j].Options;
                                                        }
                                                    }
                                                }
                                            }
                                        };
                                        prepareGroups();
                                    }
                                );

                                var prepareList = function () {
                                    if (typeof $scope.attributes === "undefined" || typeof $scope.visitorsTmp === "undefined") {
                                        return false;
                                    }

                                    var getOptions, substituteKeyToValue, prepareVisitor;

                                    getOptions = function (opt) {
                                        var options = {};

                                        if (typeof opt === "string") {
                                            try {
                                                options = JSON.parse(opt.replace(/'/g, "\""));
                                            }
                                            catch (e) {
                                                var parts = opt.split(",");
                                                for (var i = 0; i < parts.length; i += 1) {
                                                    options[parts[i]] = parts[i];
                                                }
                                            }
                                        } else {
                                            options = opt;
                                        }

                                        return options;
                                    };

                                    substituteKeyToValue = function (attribute, jsonStr) {
                                        var options = getOptions(jsonStr);
                                        var replace = function (key) {
                                            return options[key];
                                        };
                                        for (var i = 0; i < $scope.visitorsTmp.length; i += 1) {
                                            $scope.visitorsTmp[i].Extra[attribute] = $scope.visitorsTmp[i].Extra[attribute].map(replace);
                                            $scope.visitorsTmp[i].Extra[attribute] = $scope.visitorsTmp[i].Extra[attribute].join(", ");
                                        }
                                    };

                                    prepareVisitor = function () {
                                        for (var i = 0; i < $scope.fields.length; i += 1) {
                                            if (typeof $scope.fields[i].filter !== "undefined" && -1 !== $scope.fields[i].filter.indexOf("select")) {
                                                for (var j = 0; j < $scope.attributes.length; j += 1) {
                                                    if ($scope.fields[i].attribute === $scope.attributes[j].Attribute) {
                                                        substituteKeyToValue($scope.attributes[j].Attribute, $scope.attributes[j].Options);
                                                    }
                                                }
                                            }
                                        }

                                        return $scope.visitorsTmp;
                                    };

                                    $scope.items = prepareVisitor();

                                };

                                $scope.$watch("visitorsTmp", prepareList);
                                $scope.$watch("attributes", prepareList);
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