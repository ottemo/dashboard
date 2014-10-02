(function (define) {
    "use strict";

    /**
     *
     */
    define([
            "dashboard/init"
        ],
        function (dashboardModule) {

            dashboardModule
            /**
             *  $dashboardListService implementation
             */
                .service("$dashboardListService", [
                    "$routeParams",
                    function ($routeParams) {

                        // Variables
                        var ID, filters, attributes, fields, isInitFields;

                        // Functions
                        var init, getFilter, getFields, setAttributes, getAttributes, getList, getExtraFields;

                        filters = {
                            "text": "text",
                            "line_text": "text",
                            "boolean": "select{'false':\"False\",'true':\"True\"}",
                            "select": "select",
                            "selector": "select",
                            "multi_select": "select",
                            "price": "range",
                            "numeric": "range"
                        };

                        isInitFields = false;

                        init = function (_id) {
                            if (ID !== _id) {
                                isInitFields = false;
                                ID = _id;
                            }
                        };

                        setAttributes = function (attr) {
                            attributes = attr;

                            return attributes;
                        };

                        getAttributes = function () {
                            return attributes;
                        };

                        getFilter = function (attribute) {
                            var editor = attribute.Editors;
                            if (-1 !== ["selector", "select", "multi_select"].indexOf(editor)) {

                                try {
                                    JSON.parse(attribute.Options.replace(/'/g, "\""));
                                    return filters[editor] + attribute.Options;
                                }
                                catch (e) {
                                    var options = {};
                                    var parts = attribute.Options.split(",");
                                    for (var i = 0; i < parts.length; i += 1) {
                                        options[parts[i]] = parts[i];
                                    }
                                    return filters[editor] + JSON.stringify(options);
                                }
                            }

                            return filters[editor];
                        };

                        getFields = function () {
                            if (isInitFields) {
                                for (var j = 0; j < fields.length; j += 1) {
                                    fields[j].filterValue = $routeParams[fields[j].attribute];
                                }
                                return fields;
                            }

                            fields = [];

                            var prepareGroups = function () {
                                var hasName, j;

                                hasName = false;
                                for (j = 0; j < attributes.length; j += 1) {
                                    if (-1 !== Object.keys(filters).indexOf(attributes[j].Editors)) {
                                        if("name" === attributes[j].Attribute){
                                            hasName = true;
                                            fields.unshift({
                                                "attribute": attributes[j].Attribute,
                                                "type": "select-link",
                                                "label": attributes[j].Label,
                                                "visible": true,
                                                "notDisable": true,
                                                "filter": getFilter(attributes[j]),
                                                "filterValue": $routeParams[attributes[j].Attribute]
                                            });
                                            continue;
                                        }
                                        fields.push({
                                            "attribute": attributes[j].Attribute,
                                            "type": "string",
                                            "label": attributes[j].Label,
                                            "visible": true,
                                            "notDisable": false,
                                            "filter": getFilter(attributes[j]),
                                            "filterValue": $routeParams[attributes[j].Attribute]
                                        });
                                    }
                                }

                                if (!hasName) {
                                    fields.unshift({
                                        "attribute": "Name",
                                        "type": "select-link",
                                        "label": "Name",
                                        "visible": true,
                                        "notDisable": true
                                    });
                                }
                            };

                            prepareGroups();
                            isInitFields = true;

                            return fields;
                        };

                        getList = function (oldList) {
                            var getOptions, substituteKeyToValue, prepareList, regExp;
                            regExp = new RegExp("({.+})", "i");

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

                                for (var i = 0; i < oldList.length; i += 1) {
                                    if (oldList[i].Extra === null) {
                                        continue;
                                    }
                                    if (oldList[i].Extra[attribute] instanceof  Array) {

                                        oldList[i].Extra[attribute] = oldList[i].Extra[attribute].map(replace);
                                        oldList[i].Extra[attribute] = oldList[i].Extra[attribute].join(", ");

                                    } else if (typeof options[oldList[i].Extra[attribute]] !== "undefined") {
                                        oldList[i].Extra[attribute] = options[oldList[i].Extra[attribute]];
                                    }
                                }
                            };

                            prepareList = function () {
                                var i, j, getOptionsData;

                                getOptionsData = function (field, attr) {
                                    var match;
                                    match = field.filter.match(regExp);
                                    if (match === null) {
                                        return attr.Options;
                                    } else {
                                        return match[1];
                                    }
                                };

                                for (i = 0; i < fields.length; i += 1) {
                                    if (typeof fields[i].filter !== "undefined" && -1 !== fields[i].filter.indexOf("select")) {

                                        for (j = 0; j < attributes.length; j += 1) {
                                            if (fields[i].attribute === attributes[j].Attribute) {
                                                substituteKeyToValue(fields[i].attribute, getOptionsData(fields[i], attributes[j]));
                                            }
                                        }
                                    }
                                }

                                return oldList;
                            };

                            return prepareList();
                        };

                        getExtraFields = function () {
                            var arr, i;
                            arr = [];

                            for (i = 0; i < fields.length; i += 1) {
                                if (fields[i].attribute !== "Name") {
                                    arr.push(fields[i].attribute);
                                }
                            }
                            return arr.join(",");
                        };

                        return {
                            "init": init,
                            "getExtraFields": getExtraFields,
                            "setAttributes": setAttributes,
                            "getAttributes": getAttributes,
                            "getFields": getFields,
                            "getList": getList
                        };
                    }
                ]
            );

            return dashboardModule;
        });

})(window.define);