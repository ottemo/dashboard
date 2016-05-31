angular.module('coreModule')

.directive('otPrettify', [
    function(){
    return {
        require: '?ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        link: function(scope, elem, attr, ngModel) {
            if (scope.attribute.Type == 'json'){

                ngModel.$formatters.push(function(value){
                    var parsed = {};
                    if (typeof value == 'object' && value != null) { //if it is already parsed json
                        parsed = value; // then its ok
                    } else if (typeof value == 'string') {
                        parsed = JSON.parse(value) // need to parse
                    }

                    return JSON.stringify(parsed ,null,'    ') // 4 spaces indent
                })
            }
        }
    };
}]);
