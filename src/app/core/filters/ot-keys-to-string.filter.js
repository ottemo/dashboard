angular.module('coreModule')

    .filter('otKeysToString', ['_', 'coreParserService', function (_, coreParserService) {
        return function(input, options) {

            if (typeof(options) === 'string') {
                options = coreParserService.optionsStringToObject(options);
            }

            if (_.isObject(options) && !_.isEmpty(options)) {
                return _.map(input, function(key) {
                    return options[key];
                }).join(',');
            } else {
                return input.join(',');
            }
        }
    }]);