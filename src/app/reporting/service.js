angular.module('reportingModule')

.factory('reportingService', [
    '$http',
    'REST_SERVER_URI',
    'moment',
    function($http, REST_SERVER_URI, moment) {
    var _url = REST_SERVER_URI + '/reporting/';
    
    var service = {
        product: getProductPerformance, 
    };
    
    return service;
    
    // http://api.local.dev/reporting/product-performance?start_date=2016-03-01&end_date=2016-04-01
    function getProductPerformance(startDate, endDate) {
        var dateFmt = 'YYYY-MM-DD HH:mm';
        var params = {
            start_date: moment(startDate).format(dateFmt),
            end_date: moment(endDate).format(dateFmt),
        };
        console.log(params);
        return $http.get(_url+'product-performance', {params:params})
            .then(function(response){
                return response.data.result
            })    
    }
    
}]);