(function (define) {
    "use strict";

    define(["design/init"], function (designModule) {
        var assignMapping;

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
            .directive("guiTableManager", [
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
                        templateUrl: $designService.getTemplate("design/gui/table.html"),
                        controller: function ($scope) {
                            // Variables
                            var isInit, activeFilters, possibleButtons;

                            // Functions
                            var splitExtraData, prepareFilters, getOptions, getFilterStr, compareFilters, saveCurrentActiveFilters,
                                getFilterDetails, getQueryStr, getLimitStr;

                            isInit = false;
                            possibleButtons = ["new", "delete"];
                            activeFilters = {};

                            // Scope data
                            $scope.map = assignMapping($scope.mapping);
                            $scope.filters = [];
                            $scope.newFilters = {};

                            $scope.init = function () {
                                var i;
                                if (typeof $scope.buttons === "undefined") {
                                    $scope.buttons = {};
                                    for (i = 0; i < possibleButtons.length; i += 1) {
                                        $scope.buttons[possibleButtons[i]] = typeof $scope.buttonData !== "undefined" ? $scope.buttonData[possibleButtons[i]] : true;
                                    }
                                }
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
                             * @param {object} field
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
                             * Generates a query string for filters
                             *
                             * @param {array} filters
                             * @returns {string}
                             */
                            getFilterStr = function (filters) {
                                var filtersArr = [];

                                var removeEmpty = function (arr) {
                                    for (var i = 0; i < arr.length; i += 1) {
                                        if ("" === arr[i]) {
                                            arr.splice(i, 1);
                                        }
                                    }
                                };
                                for (var key in filters) {
                                    if (filters.hasOwnProperty(key) && filters[key] !== "") {
                                        if (filters[key] instanceof Array) {
                                            removeEmpty(filters[key]);
                                            if (filters[key].length > 0) {
                                                filtersArr.push(key.toLowerCase() + '=~' + filters[key].join());
                                            }
                                        } else {
                                            filtersArr.push(key.toLowerCase() + '=' + filters[key]);
                                        }

                                    }
                                }

                                return filtersArr.join("&");
                            };

                            /**
                             * Checks filters has the changes or not
                             *
                             * @returns {boolean}
                             */
                            compareFilters = function () {
                                var checkActiveFilters, compareArrays, check;

                                checkActiveFilters = function (key) {
                                    if ($scope.newFilters[key] instanceof Array) {
                                        if ("" !== $scope.newFilters[key].sort().join()) {
                                            return false;
                                        }
                                    } else if ($scope.newFilters[key].trim() !== "") {
                                        return false;
                                    }

                                    return true;
                                };

                                compareArrays = function (key) {
                                    if ($scope.newFilters[key] instanceof Array && typeof activeFilters[key] !== "undefined") {
                                        if ($scope.newFilters[key].sort().join() !== activeFilters[key].sort().join()) {
                                            return false;
                                        }
                                    } else {
                                        if ($scope.newFilters[key] !== activeFilters[key]) {
                                            return false;
                                        }
                                    }

                                    return true;
                                };

                                check = function(key){
                                    if (typeof activeFilters[key] === "undefined") {
                                        if (!checkActiveFilters(key)) {
                                            return false;
                                        }
                                        return true;
                                    }

                                    if (!compareArrays(key)) {
                                        return false;
                                    }
                                    return true;
                                };

                                for (var key in $scope.newFilters) {
                                    if ($scope.newFilters.hasOwnProperty(key)) {
                                        if(check(key)){
                                            continue;
                                        } else {
                                            return false;
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

                                if ("prev" === page && $scope.paginator.page !== 1) {
                                    $scope.paginator.page = $scope.paginator.page - 1;
                                } else if ("next" === page && $scope.paginator.page !== $scope.paginator.countPages) {
                                    $scope.paginator.page = $scope.paginator.page + 1;
                                } else if(-1 === ["prev", "next"].indexOf(page)){
                                    $scope.paginator.page = page;
                                }

                                $location.search(getQueryStr());
                            };

                            /**
                             * Gets class for item of paginator
                             *
                             * @param {string} page
                             * @returns {string}
                             */
                            $scope.getClass = function (page) {
                                if (typeof $scope.paginator === "undefined") {
                                    return '';
                                }

                                var _class;
                                _class = '';

                                if (page === parseInt($scope.paginator.page, 10)) {
                                    _class = 'active';
                                }

                                if (("prev" === page && $scope.paginator.page === 1) ||
                                    ("next" === page && $scope.paginator.page >= $scope.paginator.countPages)) {
                                    _class = 'disabled';
                                }

                                return _class;
                            };

                            getLimitStr = function (reset) {
                                var str = "";
                                if (typeof $scope.paginator === "undefined") {
                                    return str;
                                }

                                if (reset) {
                                    str = "limit=0," + $scope.paginator.countPerPage;
                                } else {
                                    str = "limit=" + (($scope.paginator.page - 1) * $scope.paginator.countPerPage) + "," + $scope.paginator.countPerPage;
                                }

                                return str;
                            };

                            /** PAGINATOR END*/

                            getQueryStr = function (reset) {
                                var arr = [];
                                arr.push(getLimitStr(reset));
                                arr.push(getFilterStr($scope.newFilters));

                                return arr.join("&");
                            };

                            $scope.$watch("newFilters", function () {
                                if (typeof $scope.filters === "undefined") {
                                    return false;
                                }

                                if (!compareFilters()) {
                                    $location.search(getQueryStr(true));
                                }

                            }, true);

                            $scope.$watch("items", function () {
                                if (typeof $scope.items === "undefined") {
                                    return false;
                                }
                                if (isInit) {
                                    return false;
                                }

                                var i, item;
                                for (i = 0; i < $scope.items.length; i += 1) {
                                    item = $scope.items[i];
                                    if (item.Extra !== null) {
                                        splitExtraData(item);
                                    }
                                }

                                prepareFilters();
                                isInit = true;
                            }, true);

                            $scope.$watch("parent.count", function () {
                                if (typeof $scope.parent.count === "undefined") {
                                    return false;
                                }

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

                            }, true);
                        }
                    };
                }
            ]
        );

        return designModule;
    });
})(window.define);
