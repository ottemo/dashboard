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

        return {
            limitStartFromString: limitStartFromString,
            limitToString: limitToString,
            sortFromString: sortFromString,
            sortToString: sortToString
        }
    }]);