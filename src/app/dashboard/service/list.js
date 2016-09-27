angular.module("dashboardModule")
/**
*  dashboardListService implementation
*/
.service("dashboardListService", ["$routeParams", function ($routeParams) {
    return function () {
        // Variables
        var attributes, fields;

        var filters = {
            "text": "text",
            "line_text": "text",
            "boolean": "select{'false':\"False\",'true':\"True\"}",
            "select": "select",
            "selector": "select",
            "multi_select": "select",
            "price": "range",
            "numeric": "range",
            "date_range": "date_range"
        };

        var isInitFields = false;

        //////////////////////////////////////////

        /**
         * Saves attributes in the service instance
         */
        function setAttributes(newAttributes) {
            attributes = newAttributes;
            return attributes;
        }

        /**
         * Gets saved attributes
         */
        function getAttributes() {
            return attributes;
        }

        function getFilter(attribute) {
            var editor = attribute.Editors;

            if (isEditorSelect()) {
                try {
                    JSON.parse(attribute.Options.replace(/'/g, '\"'));
                    return filters[editor] + attribute.Options;

                }
                catch (e) {
                    var options = {};
                    var parts = attribute.Options.split(",");
                    angular.forEach(parts, function(part) {
                       options[part] = part;
                    });
                    return filters[editor] + JSON.stringify(options);
                }
            }

            if (attribute.Type == "datetime"){
                return "date_range";
            }

            return filters[editor];

            function isEditorSelect(editor) {
                var selects = ["selector", "select", "multi_select"];
                return selects.indexOf(editor) !== -1;
            }
        }


    /*  showColumns Define set of attributes that will be added to fields list value
        fields used to define persistence of columns in table.
        showColumns object of objects that contains:
         - key as an attribute name
            - object: {} when no parameters
              - key: custom parameters name
              - value: it's value

         Attributes that can be specified:
        "attribute"    "visible"    "type"   "notDisable"
        "label"    "filter"   "dataType"    "filterValue"

        Example:  showColumns = {
                  'identifier' : {'type' : 'select-link','notDisable' : true},
                  'enabled' : {}
                  };
        If showColumns not specified fields will be filled by editable attributes.
    */
        // TODO: Refactor, too complex
        // also if we could pass in an array we could control the order of the fields
        // from the request.
        function getFields(showColumns) {

            if (isInitFields) {
                angular.forEach(fields, function(field) {
                   field.filterValue = $routeParams[field.attribute];
                });

                return fields;
            }

            fields = [];
            prepareFields();
            isInitFields = true;

            return fields;

            //////////////////////////////////////////

            function prepareFields() {

                // use showColumns if it has specified attributes to show
                if (showColumns) {
                    angular.forEach(attributes, function(attribute) {

                        var attributeName = attribute.Attribute;

                        // Attribute is in showColumns or
                        // it's a custom filterable attribute
                        if (isAttributeInColumns(attributeName, showColumns) ||
                            isCustomFilterableAttribute(attribute)) {

                            // Default params for a field
                            var field = {
                                "attribute": attributeName,
                                "type": "string",
                                "label": attribute.Label,
                                "dataType": attribute.Type,
                                "visible": true,
                                "notDisable": false,
                                "filter": getFilter(attribute),
                                "filterValue": $routeParams[attributeName]
                            };

                            // add properties defined in controller
                            var columnProps = showColumns[attributeName];
                            angular.extend(field, columnProps);

                            // check is it a main column type and it's persistence
                            if (field.type === 'select-link') {
                                field.visible = true;
                                field.notDisable = true;
                                fields.unshift(field);

                            } else {
                                fields.push(field);
                            }
                        }
                    });
                }

                function isAttributeInColumns(attributeName, columns) {
                    var columnsKeys = Object.keys(columns);
                    return columnsKeys.indexOf(attributeName) !== -1;
                }

                function isCustomFilterableAttribute(attribute) {
                    var isCustom = !attribute.IsStatic;
                    var canUseFilter =  Object.keys(filters).indexOf(attribute.Editors) !== -1;
                    return  isCustom && canUseFilter;
                }
            }
        }


        function getList(oldList) {
            return prepareList();

            //////////////////////////////////////////

            function getOptions(option) {
                var options = {};

                if (typeof option === "string") {
                    try {
                        options = JSON.parse(option.replace(/'/g, '\"'));
                    }
                    catch (e) {
                        var parts = option.split(",");
                        angular.forEach(parts, function(part) {
                            options[part] = part;
                        });
                    }

                } else {
                    options = option;
                }

                return options;
            }

            function substituteKeyToValue(attribute, jsonStr) {
                var options = getOptions(jsonStr);

                angular.forEach(oldList, function(item) {
                    if (item.Extra !== null) {
                        if (item.Extra[attribute] instanceof  Array) {

                            item.Extra[attribute] = item.Extra[attribute].map(function(key) {
                                return options[key];
                            });
                            item.Extra[attribute] = item.Extra[attribute].join(", ");

                        } else if (options[item.Extra[attribute]] !== undefined) {
                            item.Extra[attribute] = options[item.Extra[attribute]];
                        }
                    }
                });
            }

            function prepareList() {
                var optionsRegex = new RegExp('({.+})', 'i');

                angular.forEach(fields, function(field) {
                    if (field.filter !== undefined && field.filter.indexOf('select') !== -1) {
                        angular.forEach(attributes, function(attribute) {
                            if (field.attribute === attribute.Attribute) {
                                substituteKeyToValue(field.attribute, getOptionsData(field, attribute));
                            }
                        });
                    }
                });

                return oldList;

                function getOptionsData(field, attr) {
                    var match;
                    match = field.filter.match(optionsRegex);
                    if (match === null) {
                        return attr.Options;
                    } else {
                        return match[1];
                    }
                }
            }

        }

        function getExtraFields() {
            var result = [];

            angular.forEach(fields, function(field) {
                var fieldName = field.attribute;
                if (fieldName !== 'Name') {
                    result.push(fieldName);
                }
            });

            return result.join(',');
        }

        return {
            'getExtraFields': getExtraFields,
            'setAttributes': setAttributes,
            'getAttributes': getAttributes,
            'getFields': getFields,
            'getList': getList
        };
    };
}]);
