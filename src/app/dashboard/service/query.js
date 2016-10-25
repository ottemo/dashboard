angular.module('dashboardModule')

    /**
     * Provides helper functions for converting request parameters
     */
    .service('dashboardQueryService', [function() {

        /**
         * Returns limit start value as number from limit string
         * '20,40' -> 20
         * 'abc' -> 0
         */
        function limitStartFromString(limitStr) {
            if (typeof(limitStr) !== 'string') {
                return 0;
            }
            var limitStart = Number(limitStr.split(',')[0]);
            if (!isNaN(limitStart) && isFinite(limitStart) && limitStart >= 0) {
                return limitStart;
            } else {
                return 0;
            }
        }

        /**
         * Converts limit object to string
         * { start: 20, perPage: 15 } -> '20, 35'
         */
        function limitToString(limit) {
            return limit.start + ',' + limit.perPage;
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
         * Converts selected ids string to an array or single string
         * accordingly to isMultiSelect value
         */
        function idsFromString(ids, isMultiselect) {
            if (isMultiselect) {
                return (ids) ? ids.split(',') : [];
            } else {
                return ids;
            }
        }

        /**
         * Converts selected ids array or single string to an url search parameter string
         */
        function idsToString(ids, isMultiSelect) {
            if (isMultiSelect) {
                return ids.join(',');
            } else {
                return ids;
            }
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
            if (!_.isNumber(parseFloat(range.low)) || !_.isNumber(parseFloat(range.high))) {
                return '';
            } else {
                return range.low + '..' + range.high;
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

        return {
            limitStartFromString: limitStartFromString,
            limitToString: limitToString,
            sortFromString: sortFromString,
            sortToString: sortToString,
            idsFromString: idsFromString,
            idsToString: idsToString,
            optionsStringToObject: optionsStringToObject,
            rangeFromString: rangeFromString,
            rangeToString: rangeToString,
            filterValueFromUrl: filterValueFromUrl,
            filterValueToUrl: filterValueToUrl
        }
    }]);