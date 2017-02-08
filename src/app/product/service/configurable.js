angular.module('productModule')

    .service('productConfigurableService', [
        '_',
        '$q',
        'coreParserService',
        'coreGridService',
        'productApiService',
        function (
            _,
            $q,
            coreParserService,
            coreGridService,
            productApiService
        ) {
            function Configurable(attributes, product, superOptions) {
                var self = this;

                /**
                 * Super Attributes {Object} - attributes that are used in configurations
                 *  { color: { label: 'Color', values: { red: 'Red', blue: 'Blue' },
                 *    size: {label: 'Size', values: {...} }
                 */
                this._superAttributes = getSuperAttributes(attributes);

                /**
                 * Product options {Object} - options that store configurations IDs
                 */
                this._superOptions = superOptions;

                /**
                 * Configurable product {Object}
                 */
                this._product = product;

                /**
                 * Inventory {Object} - inventory of configurable product
                 * (alias for _product.inventory)
                 */
                this._inventory = product.inventory;

                /**
                 * Deferred object that is resolved after configurations grid setup
                 */
                var configurationsGridDeferred = $q.defer();

                // Public methods
                ///////////////////////////////////////////////////

                /**
                 * Returns a promise with configurations grid instance
                 */
                this.getConfigurationsGrid = function() {
                    return configurationsGridDeferred.promise;
                };

                // Initialization
                ///////////////////////////////////////////////////

                this._applyConfigurations().then(function () {
                    var grid = self._setupConfigurationsGrid();
                    configurationsGridDeferred.resolve(grid);
                });
            }

            Configurable.prototype = {

                // Private methods
                ///////////////////////////////////////////////////

                /**
                 * Loads configurations, validates them, validates product inventory
                 */
                _applyConfigurations: function() {
                    var self = this;

                    var configurationsIds = this._getConfigurationsIds();

                    return productApiService.productList({
                        _id: configurationsIds.join(','),
                        extra: Object.keys(this._superOptions).join(',')
                    }).$promise
                        .then(function (response) {
                            var result = response.result || [];
                            var configurations = self._transformConfigurationsList(result);
                            var inventory = [];
                            self._attributesCombinations = {};

                            _.forEach(configurationsIds, function(id) {
                                var configuration = configurations[id];

                                if ((configuration !== undefined) &&
                                    self._hasUniqueAttributesCombination(configuration) &&
                                    self._hasValidAttributesValues(configuration)
                                ) {
                                    // Save a combination of attributes
                                    // Use it to check uniqueness of next configurations
                                    self._addAttributesCombination(configuration);

                                    // Re-assign configuration
                                    self._addConfiguration(configuration);

                                    if (self._inventory) {
                                        // Read qty from product inventory
                                        var stockIdx = self._getConfigurationStockIdx(configuration, self._product.inventory);
                                        var qty = (stockIdx !== -1) ? self._inventory[stockIdx].qty : 0;

                                        // Write qty to new inventory to avoid outdated or invalid values
                                        self._addConfigurationStock(qty, configuration, inventory);
                                    }
                                } else {
                                    self._removeConfiguration(configuration);
                                }
                            });

                            // Rewrite product inventory
                            if (self._inventory) {
                                self._inventory = inventory;
                                self._product.inventory = self._inventory;
                            }
                    });
                },

                /**
                 * Checks if configuration has an unique combination of attributes
                 * in scope of configurable product
                 */
                _hasUniqueAttributesCombination: function(configuration) {
                    var attributesCombination = this._getAttributesCombination(configuration);
                    return !(attributesCombination in this._attributesCombinations);
                },

                /**
                 * Checks if configuration has valid values of attributes
                 */
                _hasValidAttributesValues: function(configuration) {
                    var isValid = true;
                    _.forEach(this._superOptions, function(o, optionKey) {
                        var attrValue = configuration[optionKey];
                        if (!_.isArray(attrValue) || attrValue.length !== 1) {
                            isValid = false;
                            return false;
                        }
                    });

                    return isValid;
                },

                /**
                 * Transforms list of products:
                 * [ { ID: '001', Extra: { color: 'red', size: '2' } },
                 *   { ID: '002' , ... },
                 *   ...
                 * ]
                 * into Object:
                 * {
                 *   001: { _id: '001', color: 'red', size: '2' },
                 *   002: { _id: '002', ... },
                 *   ...
                 * }
                 */
                _transformConfigurationsList: function(list) {
                    var configurations = {};
                    var superOptions = this._superOptions;

                    _.forEach(list, function(listItem) {
                        var configuration = {
                            _id: listItem.ID
                        };
                        _.forEach(superOptions, function(o, optionKey) {
                            configuration[optionKey] = (listItem.Extra) ? listItem.Extra[optionKey] : null;
                        });

                        configurations[listItem.ID] = configuration;
                    });

                    return configurations;
                },

                /**
                 * Returns a position of inventory item for configuration in inventory array
                 */
                _getConfigurationStockIdx: function(configuration, inventory) {
                    var self = this;
                    var stockIdx = -1;
                    var superOptionsCount = Object.keys(this._superOptions).length;

                    _.forEach(inventory, function(inventoryItem, idx) {
                        if (!inventoryItem.options) return;

                        var match = true;
                        var inventoryOptions = inventoryItem.options;

                        _.forEach(self._superOptions, function(o, optionKey) {
                            if (String(inventoryOptions[optionKey]) !== String(configuration[optionKey])) {
                                match = false;
                                return false;
                            }
                        });

                        if (match && Object.keys(inventoryOptions).length !== superOptionsCount) {
                            match = false;
                        }

                        if (match) {
                            stockIdx = idx;
                            return false;
                        }
                    });

                    return stockIdx;
                },

                /**
                 * Creates inventory item for configuration with provided qty in inventory array
                 */
                _addConfigurationStock: function(qty, configuration, inventory) {
                    var stock = {
                        qty: qty,
                        options: {}
                    };
                    _.forEach(this._superOptions, function(o, optionKey) {
                        stock.options[optionKey] = String(configuration[optionKey]);
                    });

                    inventory.push(stock);
                },

                /**
                 * Updates qty value for configuration in inventory
                 */
                _updateConfigurationStock: function(qty, configuration, inventory) {
                    var stockIdx = this._getConfigurationStockIdx(configuration, inventory);
                    inventory[stockIdx].qty = qty;
                },

                /**
                 * Removes inventory item of configuration
                 */
                _removeConfigurationsStock: function(configuration, inventory) {
                    var stockIdx = this._getConfigurationStockIdx(configuration, inventory);
                    inventory.splice(stockIdx, 1);
                },

                /**
                 * Create an instance of Grid with product configurations
                 */
                _setupConfigurationsGrid: function() {
                    var self = this;
                    var configurationsIds = this._getConfigurationsIds();

                    // Columns setup
                    var gridColumns = this._getGridColumns();
                    if (this._inventory) {
                        gridColumns.push({
                            key: 'qty',
                            label: 'Qty',
                            type: 'input-number',
                            editor: 'not-editable',
                            _not_sortable: true,
                            _selected_only: true,
                            listeners: {
                                onBlur: function(row) {
                                    if (row.qty < 0) {
                                        row.qty = 0;
                                    }
                                    self._updateConfigurationStock(row.qty, row, self._inventory);
                                }
                            }
                        });
                    }

                    // Grid setup
                    var grid = coreGridService.grid({
                        collection: 'product',
                        columns: gridColumns,
                        mapping: this._getGridMapping(),
                        multiSelect: true,
                        searchParams: (configurationsIds.length > 0) ? { _selection: 'yes' } : {},
                        selectedIds: configurationsIds,
                        forcedFilters: { type: '!=configurable' }
                    });

                    // Grid events
                    grid.on('rowCreated', function(e) {
                        var row = e.row;

                        row._link = 'products/' + row._id;
                        if (row._selected) {
                            if (self._inventory) {
                                var stockIdx = self._getConfigurationStockIdx(row, self._inventory);
                                row.qty = self._inventory[stockIdx].qty;
                            }
                        } else {
                            row._disabled = !self._isValidRow(row);
                        }
                    });
                    grid.on('afterSelect', function(e) {
                        var row = e.row;

                        if (e.selectionState === true) {
                            self._addAttributesCombination(row);
                            self._addConfiguration(row);
                            if (self._inventory) {
                                self._addConfigurationStock(0, row, self._inventory);
                                row.qty = 0;
                            }
                        } else {
                            self._removeAttributesCombination(row);
                            self._removeConfiguration(row);
                            if (self._inventory) {
                                self._removeConfigurationsStock(row, self._inventory);
                            }
                        }

                        _.forEach(grid.rows, function(row) {
                            if (!row._selected) {
                                row._disabled = !self._isValidRow(row);
                            }
                        });
                    });

                    grid.load({ getCount: true });

                    return grid;
                },

                /**
                 * Checks if row is valid
                 */
                _isValidRow: function(row) {
                    return this._hasUniqueAttributesCombination(row) &&
                        this._hasValidAttributesValues(row);
                },

                /**
                 * Saves options combination of a configuration
                 */
                _addAttributesCombination: function(configuration) {
                    this._attributesCombinations[this._getAttributesCombination(configuration)] = true;
                },

                /**
                 * Removes options combination of a configuration
                 */
                _removeAttributesCombination: function(configuration) {
                    var attributesCombination = this._getAttributesCombination(configuration);
                    if (this._attributesCombinations[attributesCombination]) {
                        delete this._attributesCombinations[attributesCombination];
                    }
                },

                /**
                 * Create unique string from attribute values in a configuration:
                 * { color: 'red', size: 'm' } -> 'color=red&size=blue'
                 */
                _getAttributesCombination: function(configuration) {
                    var attrCombination = [];
                    _.forEach(this._superOptions, function(o, optionKey) {
                        var attrValue = configuration[optionKey];
                        attrCombination.push(optionKey + '=' + attrValue);
                    });

                    return attrCombination.join('&');
                },

                /**
                 * Adds new configuration id to product options
                 */
                _addConfiguration: function(configuration) {
                    var self = this;
                    var id = configuration._id;

                    _.forEach(this._superOptions, function(option, optionKey) {
                        var subOptionKey = String(configuration[optionKey]);
                        var subOptionLabel = self._superAttributes[optionKey].values[subOptionKey];

                        if (!option.options) {
                            option.options = {};
                        }

                        var subOption = option.options[subOptionKey];
                        if (subOption) {
                            if (_.isArray(subOption._ids)) {
                                if (subOption._ids.indexOf(id) === -1) {
                                    subOption._ids.push(id);
                                }
                            } else {
                                subOption._ids = [id];
                            }
                        } else {
                            option.options[subOptionKey] = {
                                key: subOptionKey,
                                label: subOptionLabel,
                                order: 0,
                                _ids: [id]
                            };
                        }
                    });
                },

                /**
                 * Delete configuration id from product options
                 */
                _removeConfiguration: function(configuration) {
                    var id = configuration._id;

                    _.forEach(this._superOptions, function(option) {
                        var subOptions = option.options;
                        _.forEach(subOptions, function(subOption, subOptionKey) {
                            var ids = subOption._ids;
                            if (_.isArray(ids)) {
                                var idx = ids.indexOf(id);
                                if (idx !== -1) {
                                    ids.splice(idx, 1);
                                    if (ids.length === 0) {
                                        delete option.options[subOptionKey];
                                    }
                                }
                            }
                        });
                    });
                },

                /**
                 * Returns grid columns settings accordingly to configurable options
                 * Default columns are `Name`, `SKU`
                 */
                _getGridColumns: function() {
                    var self = this;

                    var columns = [
                        { key: 'name', label: 'Name', type: 'text', editor: 'text', isLink: true},
                        { key: 'sku', label: 'SKU', type: 'text', editor: 'text' },
                        { key: 'price', label: 'Price', type: 'price', editor: 'text' },
                        { key: 'enabled', label: 'Enabled', type: 'text', editor: 'select',
                            options: { 'true': 'True', 'false': 'False' }
                        }
                    ];

                    _.forEach(this._superOptions, function(o, optionKey) {
                        var column = {
                            key: optionKey,
                            type: '[]text',
                            editor: 'select',
                            options:  self._superAttributes[optionKey].values
                        };
                        column.label = self._superAttributes[optionKey].label;
                        columns.push(column);
                    });

                    return columns;
                },

                /**
                * Returns grid mapping accordingly to configurable options
                */
                _getGridMapping: function() {
                    var mapping = {
                        extra: { name: 'name', sku: 'sku', price: 'price', enabled: 'enabled' }
                    };

                    _.forEach(this._superOptions, function(option) {
                        mapping.extra[option.key] = option.key;
                    });

                    return mapping;
                },

                /**
                 * Returns an array of associated products ids
                 * [id1, id2, ... ]
                 */
                _getConfigurationsIds: function() {
                    var configurationsIds = {};

                    _.forEach(this._superOptions, function (option) {
                        if (option.options && option.has_associated_products) {
                            _.forEach(option.options, function (subOption) {
                                if (subOption._ids) {
                                    _.forEach(subOption._ids, function (productId) {
                                        configurationsIds[productId] = true;
                                    });
                                }
                            })
                        }
                    });

                    return Object.keys(configurationsIds);
                }
            };

            /**
             * Returns all product attributes that can be used
             * for configurable product creation
             * and parses their options to an object
             *
             * Currently we suppose that only attributes with an array type
             * may be configurable
             * e.g. []text, []id,
             */
            function getSuperAttributes(attributes) {
                var configurableAttributes = {};

                _.forEach(attributes, function (attribute) {
                    if (isConfigurableAttribute(attribute)) {
                        var attributeKey = attribute.Attribute;
                        var attributeOptions = coreParserService.optionsStringToObject(attribute.Options);

                        configurableAttributes[attributeKey] = {
                            label: attribute.Label,
                            values: attributeOptions
                        };
                    }
                });

                return configurableAttributes;
            }

            /**
             * Checks if attribute can be used for product configurations
             */
            function isConfigurableAttribute(attribute) {
                return attribute.Type.indexOf('[]') === 0 &&
                    attribute.Attribute !== 'related_pids';
            }

            return {
                configurable: function(attributes, product, superOptions) {
                    return new Configurable(attributes, product, superOptions);
                },
                getSuperAttributes: getSuperAttributes
            }
        }]);