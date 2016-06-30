angular.module('coreModule')

.directive('otInventoryManager', ['_', function(_) {
    return {
        restrict: 'E',
        scope: {
            'options': '=',
            'inventory': '=',
            'qty': '=',
        },
        templateUrl: '/views/core/directives/editor/ot-inventory-manager.html',
        link: function(scope, el, attr){
            scope.$watch('options', updateOptions, true);

            //////////////////////

            // It is important that we manage the formatted options in a POJO
            // if it was bound to the scope angular will try to attach an $$hashKey
            var lastOptionSet;

            function updateOptions(newOptions, oldOptions) {
                if (newOptions === undefined) {
                    return;
                } else if (lastOptionSet === undefined) {
                    lastOptionSet = formatOptions(scope.options);
                } else {
                    var newOptionSet = formatOptions(scope.options);

                    if (!angular.equals(newOptionSet, lastOptionSet)) {
                        console.log('options have changed enough to demand an inventory clean/update');
                        lastOptionSet = angular.copy(newOptionSet);
                        scope.inventory = findPermutations(newOptionSet);
                    }
                }
            }

            /**
             * Format options for use in an inventory list
             *
             * @param Object
             * {
             *   "Bottle Type": {
             *     "label": "Bottle Type",
             *     "options": {
             *       "120 ml": {
             *         "label": "120 ml",
             *         "order": 2,
             *         "price": "61.99"
             *       },
             *       "30 ml": {
             *         "label": "30 ml",
             *         "order": 1,
             *         "price": "15.99"
             *       }
             *     },
             *     "order": 3,
             *     "required": true,
             *     "type": "select",
             *     "controls_inventory": false,
             *     "code": "Bottle Type"
             *   },
             *   ...
             * }
             *
             * @return Array
             * [
             *   {code: "color",     selections: ["red", "blue", "green", "yellow"]},
             *   {code: "size",      selections: ["small", "medium", "large"]},
             *   {code: "thickness", selections: ["heavy", "light"]},
             * ];
             */
            function formatOptions(options){
                return _.chain(options)
                    .forEach(function addCodeField(o, code){
                        o.code = code;
                    })
                    .filter('controls_inventory')
                    .map(function formatOption(o){
                        var it = {
                            code: o.code,
                            selections: _.keys(o.options)
                        };
                        return it;
                    })
                    .value();
            }

            /**
             * Create an array of all combinations of options,
             * each combination is under the "options" key which
             * is comprised of a `optionCode: selectionCode`.
             * This should match db / foundation nicely
             *
             * @param  Array see @formatOptions
             * @return Array of all permutations
             * [
             *   {"options": { "color": "red"    }},
             *   {"options": { "color": "blue"   }},
             *   {"options": { "color": "yellow" }}
             * ]
             *
             * or
             *
             * [
             *   {"options": {"size": "small",  "color": "red"}},
             *   {"options": {"size": "small",  "color": "blue"}},
             *   {"options": {"size": "small",  "color": "yellow"}},
             *   {"options": {"size": "medium", "color": "red"}},
             *   {"options": {"size": "medium", "color": "blue"}},
             *   {"options": {"size": "medium", "color": "yellow"}},
             *   {"options": {"size": "large",  "color": "red"}},
             *   {"options": {"size": "large",  "color": "blue"}},
             *   {"options": {"size": "large",  "color": "yellow"}}
             * ]
             */
            function findPermutations(options) {
                var resp = [];

                // kick off the recursion
                if (options.length) {
                    recur(options);
                }
                return resp;

                ////////////////

                function recur(choices, aggr) {
                    var aggr = aggr || {}; // jshint ignore:line

                    // We hit the bottom of our recursion
                    if (!choices.length) {
                        // write out to outer variable
                        resp.push({options:aggr});
                        return aggr;
                    }

                    // always loop over the first item we are given
                    for (var c = 0; c < choices[0].selections.length; c++) {
                        // Copy it so that we don't just keep over-writing our data
                        var newAggr = angular.copy(aggr);

                        // remove the first option and pass it back in
                        // pass the remaining choices
                        newAggr[choices[0].code] = choices[0].selections[c];
                        recur(choices.slice(1), newAggr);
                    }
                }
            }

        }
    };
}]);

