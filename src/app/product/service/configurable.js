angular.module('productModule')

    .service('productConfigurableService', [
        '_',
        'coreParserService',
        function (
            _,
            coreParserService
        ) {
            /**
             * Constructor
             */
            function Configurable(attributes) {

                /**
                 * Configurable attributes {Object}
                 *  { color: { label: 'Color', values: { red: 'Red', blue: 'Blue' },
                 *    size: {label: 'Size', values: {...} }
                 */
                this.attributes = this.getConfigurableAttributes(attributes);

                /**
                 * Option with 'has_associated_products'=true
                 * { color: true, size: true }
                 */
                this.options = {};

                this.products = {};
                this.optionsCombinations = {};
            }


            // Methods
            /////////////////////////////////////////

            Configurable.prototype = {

                init: function(productOptions) {
                    this.options = this.getConfigurableOptions(productOptions);
                    this.products = this.getProductIdsFromOptions(productOptions);
                },

                /**
                 * Returns a list of associated products ids from product options
                 * ['id_1', 'id_2', ... ]
                 */
                getProductIdsFromOptions: function (productOptions) {
                    var productIds = {};

                    _.forEach(productOptions, function (option) {
                        if (option.options && option.has_associated_products) {
                            _.forEach(option.options, function (subOption) {
                                if (subOption.ids) {
                                    _.forEach(subOption.ids, function (productId) {
                                        productIds[productId] = true;
                                    });
                                }
                            })
                        }
                    });

                    return Object.keys(productIds);
                },

                /**
                 * Get configurable options keys
                 * Returns { color: true, size: true }
                 */
                getConfigurableOptions: function(productOptions) {
                    var configurableOptions = {};
                    _.forEach(productOptions, function(option) {
                        if (option.has_associated_products) {
                            configurableOptions[option.key] = true;
                        }
                    });

                    return configurableOptions;
                },

                /**
                 * Returns all product attributes that can be used
                 * for configurable product creation
                 * and parses their options to an object
                 *
                 * Currently we suppose that only attributes with an array type
                 * may be configurable
                 * e.g. []text, []id,
                 */
                getConfigurableAttributes: function(attributes) {
                    var configurableAttributes = {};

                    _.forEach(attributes, function (attribute) {
                        if (coreParserService.isConfigurableAttrType(attribute.Type)) {
                            var attributeKey = attribute.Attribute;
                            var attributeOptions = coreParserService.optionsStringToObject(attribute.Options);

                            configurableAttributes[attributeKey] = {
                                label: attribute.Label,
                                values: attributeOptions
                            };
                        }
                    });

                    return configurableAttributes;
                },

                /**
                 * Returns grid columns settings accordingly to configurable options
                 * Default columns are `Name`, `SKU`
                 */
                 getGridColumns: function() {
                    var self = this;

                    var columns = [
                        { key: 'name', label: 'Name', type: 'text', editor: 'text', isLink: true},
                        { key: 'sku', label: 'SKU', type: 'text', editor: 'text' }
                    ];

                    _.forEach(this.options, function(o, optionKey) {
                        var column = {
                            key: optionKey,
                            type: '[]text',
                            editor: 'select',
                            options:  self.attributes[optionKey].values
                        };
                        column.label = self.attributes[optionKey].label;
                        columns.push(column);
                    });

                    return columns;
                },

                /**
                 * Returns grid mapping accordingly to configurable options
                 */
                getGridMapping: function() {
                    var mapping = {
                        extra: { name: 'name', sku: 'sku' }
                    };

                    _.forEach(this.attributes, function(attribute, attributeKey) {
                        mapping.extra[attributeKey] = attributeKey;
                    });

                    return mapping;
                },

                /**
                 * Disables row if it has incorrect attribute values
                 * or if such options combination is already selected
                 * skip selected rows
                 */
                validateRow: function(row, productOptions, skipSelected) {
                    if (row._selected && skipSelected) return;
                    var self = this;

                    var isValid = true;
                    _.forEach(this.options, function(o, optionKey) {
                        var rowColumnValue = row[optionKey];
                        if (!_.isArray(rowColumnValue) || rowColumnValue.length !== 1) {
                            isValid = false;
                            return false;
                        }
                    });

                    if (isValid) {
                        var optionsCombination = this.getRowOptionsCombination(row);
                        if (optionsCombination in self.optionsCombinations) {
                            isValid = false;
                        }
                    }

                    if (row._selected === true) {
                        if (isValid) {
                            this.saveOptionsCombination(row);
                        } else {
                            row._selected = false;
                            row._disabled = true;
                            this.removeProductIdFromOptions(row, productOptions);
                        }
                    } else {
                        row._disabled = !isValid;
                    }
                },

                /**
                 * Saves options combination of the row
                 */
                saveOptionsCombination: function(row) {
                    this.optionsCombinations[this.getRowOptionsCombination(row)] = true;
                },

                /**
                 * Removes options combination of the row
                 */
                removeOptionsCombination: function(row) {
                    var optionsCombination = this.getRowOptionsCombination(row);
                    if (this.optionsCombinations[optionsCombination]) {
                        delete this.optionsCombinations[optionsCombination];
                    }
                },

                /**
                 * Create unique string from options keys and values in row:
                 * { color: 'red', size: 'm' } -> 'color=red&size=blue'
                 */
                getRowOptionsCombination: function(row) {
                    var optionCombination = [];
                    _.forEach(this.options, function(o, optionKey) {
                        var rowColumnValue = row[optionKey];
                        optionCombination.push(optionKey + '=' + rowColumnValue);
                    });

                    return optionCombination.join('&');
                },

                addProductIdToOptions: function(row, productOptions) {
                    var self = this;
                    var id = row._id;
                    _.forEach(this.options, function(o, optionKey) {
                        var subOptionKey = row[optionKey][0];
                        var subOptionLabel = self.attributes[optionKey].values[subOptionKey];

                        var productOption = productOptions[optionKey];
                        if (productOption.options) {
                            if (productOption.options[subOptionKey]) {
                                productOption.options[subOptionKey].ids.push(id);
                            } else {
                                productOption.options[subOptionKey] = {
                                    key: subOptionKey,
                                    label: subOptionLabel,
                                    order: 0,
                                    ids: [id]
                                };
                            }
                        } else {
                            productOption.options = {};
                            productOption.options[subOptionKey] = {
                                key: subOptionKey,
                                label: subOptionLabel,
                                order: 0,
                                ids: [id]
                            };
                        }
                    });
                },

                removeProductIdFromOptions: function(row, productOptions) {
                    var id = row._id;
                    _.forEach(this.options, function(o, optionKey) {
                        var subOptionKey = row[optionKey][0];

                        if (!productOptions[optionKey]) return;

                        var ids = productOptions[optionKey].options[subOptionKey].ids;
                        var index = ids.indexOf(id);
                        if (index !== -1) {
                            ids.splice(index, 1);
                            if (ids.length === 0) {
                                delete productOptions[optionKey].options[subOptionKey];
                            }
                        }
                    });
                }
            };


            return {
                configurable: function(attributes) {
                    return new Configurable(attributes);
                }
            }
        }]);