angular.module('coreModule')

    /**
     * Provides helper functions for parsing data from the server
     */
    .service('coreParserService', [function() {
        /**
         * We save selected ids in url that has limit about 2000 chars,
         * so maximum ids count is approximately 80 when id is 24 chars long
         */
        var SELECTED_IDS_LIMIT = 80;

        /**
         * Returns page as a number from string
         * '20' -> 20, '20abc' -> 1, 'abc' -> 1
         */
        function pageFromString(pageStr) {
            if (!isNaN(parseFloat(pageStr)) && isFinite(pageStr)) {
                return Number(pageStr);
            } else return 1;
        }

        /**
         * Converts pagination object to request limit string
         * { page: 3, itemsPerPage: 20 } -> '40, 20'
         */
        function paginationToString(pagination) {
            return (pagination.page - 1) * pagination.itemsPerPage + ',' + pagination.itemsPerPage;
        }

        /**
         * Converts sort string to sort object
         * '^name' -> { key: 'name', direction: 'DESC' }
         * 'price' -> { key: 'price', direction: 'ASC' }
         */
        function sortFromString(sortStr) {
            if (typeof(sortStr) !== 'string') {
                return null;
            }

            var sort = {};
            if (sortStr.indexOf('^') === 0) {
                sort.direction = 'DESC';
                sort.column = sortStr.slice(1);
            } else {
                sort.direction = 'ASC';
                sort.column = sortStr;
            }

            return sort;
        }

        /**
         * Converts sort object to string
         * { key: 'name', direction: 'DESC' } -> '^name'
         */
        function sortToString(sort) {
            var sortStr = sort.column;
            if (sort.direction === 'DESC') {
                sortStr = '^' + sortStr;
            }
            return sortStr;
        }

        /**
         * Converts selected ids string to an array of strings
         */
        function idsFromString(ids) {
            return (Boolean(ids)) ? ids.split(',') : [];
        }

        /**
         * Converts selected ids array or single string to an url search parameter string
         */
        function idsToString(ids) {
            return (ids.length <= SELECTED_IDS_LIMIT) ? ids.join(',') : '';
        }

        /**
         * Parses options string to an object
         */
        function optionsStringToObject(optionsStr) {
            var options = {};

            try {
                // JSON
                options = JSON.parse(optionsStr.replace('\'', '"'));
            } catch(e) {
                // String '{red,blue}' -> Object {red: red, blue: blue}
                var optionItems = optionsStr.replace(/[{}]/g, '').split(',');
                _.forEach(optionItems, function(optionItem) {
                    options[optionItem] = optionItem;
                });
            }

            return options;
        }

        /**
         * Parses range string to object
         * '2..10' -> { low: 2, high: 10 }
         */
        function rangeFromString(rangeStr) {
            var rangeParts = rangeStr.split('..');
            if (!_.isNumber(parseFloat(rangeParts[0])) || !_.isNumber(parseFloat(rangeParts[1]))) {
                return { low: '', high: ''}
            } else {
                return { low: rangeParts[0], high: rangeParts[1] };
            }
        }

        /**
         * Converts range object to string
         * { low: 2, high: 10 } -> '2..10'
         */
        function rangeToString(range) {
            if (isNaN(parseFloat(range.low)) || isNaN(parseFloat(range.high))) {
                return '';
            } else {
                return parseFloat(range.low) + '..' + parseFloat(range.high);
            }
        }

        /**
         * Convert filter value from url format
         */
        function filterValueFromUrl(filterValue, filterType) {
            switch(filterType) {
                case 'range':
                    return filterValue.replace('_', '..');
                default: return filterValue;
            }
        }

        /**
         * Convert filter value to format that can be stored in url
         */
        function filterValueToUrl(filterValue, filterType) {
            switch(filterType) {
                case 'range':
                    return filterValue.replace('..', '_');
                default: return filterValue;
            }
        }

        function resolveFilterType(columnEditorType) {
            switch (columnEditorType) {
                case 'multi_select':
                case 'select':
                    return 'select';
                case '':
                    return 'not_editable';
                default:
                    return columnEditorType;
            }
        }

        function resolveColumnType(columnType) {
            if (columnType.indexOf('[]') === 0) {
                return 'array';
            } else return columnType;
        }

        return {
            pageFromString: pageFromString,
            paginationToString: paginationToString,
            sortFromString: sortFromString,
            sortToString: sortToString,
            idsFromString: idsFromString,
            idsToString: idsToString,
            optionsStringToObject: optionsStringToObject,
            rangeFromString: rangeFromString,
            rangeToString: rangeToString,
            filterValueFromUrl: filterValueFromUrl,
            filterValueToUrl: filterValueToUrl,
            resolveFilterType: resolveFilterType,
            resolveColumnType: resolveColumnType
        }
    }]);