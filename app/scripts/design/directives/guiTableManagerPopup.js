(function (define) {
    "use strict";

    define(["design/init"], function (designModule) {
        var assignMapping;

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

        assignMapping = function (mapping) {
            var defaultMapping;

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
                    }
                }
            }

            return defaultMapping;
        };

        designModule

        /**
         *  Directive used for automatic attributes editor form creation
         *
         */
            .directive("guiTableManagerPopup", [
                "$location",
                "$designService",
                "COUNT_ITEMS_PER_PAGE",
                function ($location, $designService, COUNT_ITEMS_PER_PAGE) {
                    return {
                        restrict: "E",
                        scope: {
                            "parent": "=object",
                            "items": "=items",
                            "buttonData": "=buttons",
                            "mapping": "=mapping"
                        },
                        templateUrl: $designService.getTemplate("design/gui/table-popup.html"),
                        controller: function ($scope) {
                            // Variables
                            var isInit, activeFilters, possibleButtons;

                            // Functions
                            var splitExtraData, prepareFilters, getOptions, compareFilters, saveCurrentActiveFilters,
                                getFilterDetails, initButtons, initPaginator;

                            isInit = false;
                            possibleButtons = ["new", "delete", "checkbox"];
                            activeFilters = {};

                            // Scope data
                            $scope.map = assignMapping($scope.mapping);
                            $scope.filters = [];
                            $scope.newFilters = {};

                            initButtons = function () {
                                var i;
                                if (typeof $scope.buttons === "undefined") {
                                    $scope.buttons = {};
                                    for (i = 0; i < possibleButtons.length; i += 1) {
                                        if(typeof $scope.buttonData !== "undefined"){
                                            if(typeof $scope.buttonData[possibleButtons[i]] !== "undefined"){
                                                $scope.buttons[possibleButtons[i]] = $scope.buttonData[possibleButtons[i]];
                                            } else {
                                                $scope.buttons[possibleButtons[i]] = true;
                                            }
                                        } else {
                                            $scope.buttons[possibleButtons[i]] = true;
                                        }
                                    }
                                }
                            };

                            initPaginator = function () {
                                var limit, search, page, parts, countPerPage;

                                page = 1;
                                countPerPage = COUNT_ITEMS_PER_PAGE;
                                search = $location.search();
                                limit = search.limit;

                                if (limit) {
                                    parts = limit.split(",");
                                    page = Math.floor(parts[0] / countPerPage) + 1;
                                }
                                $scope.paginator = {
                                    "page": page,
                                    "countItems": $scope.parent.count,
                                    "countPages": 0,
                                    "countPerPage": countPerPage,
                                    "limitStart": 0
                                };

                                $scope.paginator.countPages = Math.ceil($scope.paginator.countItems / $scope.paginator.countPerPage);
                            };

                            $scope.init = function () {
                                initButtons();
                            };

                            getOptions = function (opt) {
                                var options = {"": ""};

                                if (typeof opt === "string") {
                                    try {
                                        options = JSON.parse(opt.replace(/'/g, "\""));
                                    }
                                    catch (e) {
                                        var parts = opt.replace(/[{}]/g, "").split(",");
                                        for (var i = 0; i < parts.length; i += 1) {
                                            options[parts[i]] = parts[i];
                                        }
                                    }
                                } else {
                                    options = opt;
                                }

                                return options;
                            };

                            splitExtraData = function (item) {
                                var field;
                                for (field in item.Extra) {
                                    if (item.Extra.hasOwnProperty(field)) {
                                        item[field] = item.Extra[field];
                                        delete item.Extra[field];
                                    }
                                }
                            };

                            /**
                             * Save active filters
                             *
                             * @param {object} filterDetails
                             */
                            saveCurrentActiveFilters = function (filterDetails) {
                                if (filterDetails.filterValue) {
                                    if ("range" !== filterDetails.type) {
                                        activeFilters[filterDetails.attribute.toLowerCase()] = filterDetails.filterValue.replace(/~/g, "").split(",");
                                    } else {
                                        activeFilters[filterDetails.attribute.toLowerCase()] = filterDetails.filterValue.replace(/~/g, "");
                                    }
                                }
                            };

                            getFilterDetails = function (field) {
                                var filterInfo, parts, details;

                                filterInfo = field.filter;
                                parts = filterInfo.match(/.+(\{.*\})/i);

                                details = {
                                    "options": parts === null ? {} : getOptions(parts[1]),
                                    "type": filterInfo.substr(0, (-1 !== filterInfo.indexOf("{") ? filterInfo.indexOf("{") : filterInfo.length)),
                                    "filterValue": field.filterValue,
                                    "attribute": field.attribute,
                                    "visible": field.visible
                                };

                                if ("select" === details.type) {
                                    details.options[""] = "";
                                }

                                return details;
                            };

                            prepareFilters = function () {
                                var i, filterDetails, filter;

                                for (i = 0; i < $scope.parent.fields.length; i += 1) {

                                    if (typeof $scope.parent.fields[i].filter === "undefined") {
                                        $scope.filters.push({});
                                        continue;
                                    }

                                    filterDetails = getFilterDetails($scope.parent.fields[i]);

                                    filter = {
                                        "type": filterDetails.type,
                                        "visible": filterDetails.visible || false,
                                        "attributes": {
                                            "Attribute": filterDetails.attribute,
                                            "Options": filterDetails.options
                                        }
                                    };

                                    filter[filterDetails.attribute] = filterDetails.filterValue || "";
                                    saveCurrentActiveFilters(filterDetails);

                                    $scope.filters.push(filter);
                                }
                            };

                            /**
                             * Checks filters has the changes or not
                             *
                             * @returns {boolean}
                             */
                            compareFilters = function () {
                                for (var key in $scope.newFilters) {
                                    if ($scope.newFilters.hasOwnProperty(key)) {
                                        if (typeof activeFilters[key] === "undefined") {
                                            if ($scope.newFilters[key] instanceof Array) {
                                                if ("" !== $scope.newFilters[key].sort().join()) {
                                                    return false;
                                                }
                                            } else if ($scope.newFilters[key].trim() !== "") {
                                                return false;
                                            }
                                            continue;
                                        }
                                        if ($scope.newFilters[key] instanceof Array) {
                                            if ($scope.newFilters[key].sort().join() !== activeFilters[key].sort().join()) {
                                                return false;
                                            }
                                        } else {
                                            if ($scope.newFilters[key] !== activeFilters[key]) {
                                                return false;
                                            }
                                        }
                                    }
                                }

                                return true;
                            };

                            /** PAGINATOR */


                            $scope.getPages = function () {
                                if (typeof $scope.paginator === "undefined") {
                                    return false;
                                }
                                var p, result;
                                result = [];

                                for (p = 1; p <= $scope.paginator.countPages; p += 1) {
                                    result.push(p);
                                }
                                return result;
                            };

                            $scope.setPage = function (page) {
                                if (typeof $scope.paginator === "undefined") {
                                    return false;
                                }

                                switch (page) {
                                    case 'prev':
                                        if ($scope.paginator.page !== 1) {
                                            $scope.paginator.page = $scope.paginator.page - 1;
                                        }
                                        break;
                                    case 'next':
                                        if ($scope.paginator.page !== $scope.paginator.countPages) {
                                            $scope.paginator.page = $scope.paginator.page + 1;
                                        }
                                        break;
                                    default:
                                        $scope.paginator.page = page;
                                }
                                $scope.parent.search = getSearchObj();
                            };

                            /**
                             * Gets class for item of paginator
                             *
                             * @param {string} page
                             * @returns {string}
                             */
                            $scope.getClass = function (page) {
                                if (typeof $scope.paginator === "undefined") {
                                    return false;
                                }

                                var _class;
                                _class = '';

                                switch (page) {
                                    case 'prev':
                                        if ($scope.paginator.page === 1) {
                                            _class = 'disabled';
                                        }
                                        break;
                                    case 'next':
                                        if ($scope.paginator.page >= $scope.paginator.countPages) {
                                            _class = 'disabled';
                                        }
                                        break;
                                    default:
                                        if (page === parseInt($scope.paginator.page, 10)) {
                                            _class = 'active';
                                        }
                                }

                                return _class;
                            };

                            /** PAGINATOR END*/

                            var getSearchObj = function (reset) {
                                var search = {};
                                var removeEmpty = function (arr) {
                                    for (var i = 0; i < arr.length; i += 1) {
                                        if ("" === arr[i].trim()) {
                                            arr.splice(i, 1);
                                        }
                                    }
                                };
                                for (var key in $scope.newFilters) {
                                    if ($scope.newFilters.hasOwnProperty(key)) {
                                        if ($scope.newFilters[key] instanceof Array) {
                                            removeEmpty($scope.newFilters[key]);
                                            if ($scope.newFilters[key].length > 0) {
                                                search[key.toLowerCase()] = '~' + $scope.newFilters[key].join();
                                            }
                                        } else if ($scope.newFilters[key] !== "") {
                                            search[key.toLowerCase()] = $scope.newFilters[key];
                                        }
                                    }
                                }

                                if (reset) {
                                    search.limit = "0," + $scope.paginator.countPerPage;
                                } else {
                                    search.limit = (($scope.paginator.page - 1) * $scope.paginator.countPerPage) + "," + $scope.paginator.countPerPage;
                                }

                                return search;
                            };

                            $scope.$watch("newFilters", function () {
                                if (typeof $scope.filters === "undefined") {
                                    return false;
                                }

                                if (!compareFilters()) {
                                    activeFilters = clone($scope.newFilters);
                                    $scope.parent.search = getSearchObj(true);
                                }

                            }, true);

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
                                if (isInit) {
                                    return false;
                                }
                                prepareFilters();
                                isInit = true;
                            }, true);

                            $scope.$watch("parent.count", function () {
                                if (typeof $scope.parent.count === "undefined") {
                                    return false;
                                }
                                initPaginator();
                            }, true);
                        }
                    };
                }
            ]
        );

        return designModule;
    });
})(window.define);
