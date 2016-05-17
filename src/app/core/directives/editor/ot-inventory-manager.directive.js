angular.module('coreModule')

.directive('otInventoryManager', [function() {
    return {
        restrict: 'E',
        scope: {
            'options': '=',
            'inventory': '=',
        },
        templateUrl: '/views/core/directives/editor/ot-inventory-manager.html',
        link: function(scope, el, attr){

            // TODO mutate the options to look like this array

            var options = [
              {code: "color",     selections: ["red", "blue", "green", "yellow"]}, // color
              {code: "size",      selections: ["small", "medium", "large"]},       // size
              {code: "thickness", selections: ["heavy", "light"]},                 // thickness
            ];
            scope.inventory = findPermutations(options);

            //////////////////////

            function findPermutations(options) {
                var resp = [];
                recur(options); // kick off the recursion
                return resp;

                ////////////////

                function recur(choices, aggr) {
                    var aggr = aggr || []; // aggregator

                    // We hit the bottom of our recursion
                    if (!choices.length) {
                        // write out to outer variable
                        resp.push(aggr);
                        return aggr;
                    }

                    // always loop over the first item we are given
                    for (var c = 0; c < choices[0].selections.length; c++) {
                        // remove the first option and pass it back in
                        // pass the remaining choices
                        var thisOption = {
                            code: choices[0].code,
                            selection: choices[0].selections[c]
                        };
                        recur(choices.slice(1), aggr.concat(thisOption));
                    }
                }
            }

        }
    };
}]);

