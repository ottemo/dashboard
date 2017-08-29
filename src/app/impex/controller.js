angular.module("impexModule")

.controller("impexController", [
"$scope",
"$timeout",
"$interval",
"$sce",
"impexApiService",
"dashboardUtilsService",
"REST_SERVER_URI",
function ($scope, $timeout, $interval, $sce, impexApiService, dashboardUtilsService, REST_SERVER_URI) {

$scope.init = function () {
    impexApiService.getModels().$promise.then(function (response) {
        if(response.error === null) {
            $scope.modelList = response.result;
        } else {
            $scope.message = dashboardUtilsService.getMessage(response.error);
        }
    });

    impexApiService.magentoOptions().$promise.then(function(response) {
        console.log(response);
        if (!response.result.foundation_url || !response.result.api_key) {
            return;
        }

        $scope.foundation_url = response.result.foundation_url;
        $scope.api_key = response.result.api_key;
    });

    $scope.$on('$destroy', function(){
        $interval.cancel($scope.importTrackInterval);
        $timeout.cancel($scope.importTrackTimeout);
    });
};

$scope.startImportTrack = function() {
    $scope.isImportRun = true;
    $scope.importProgress = 0;
    $scope.message = null;

    $scope.importTrackInterval = $interval(function() {

        impexApiService.importStatus().$promise.then(function(response) {
            if (response.result.status === "idle") {
                $scope.importMethod = null;
                $scope.cancelImportTrack();
                
                if (response.result.importResult) {
                    $scope.message = (response.result.importError === null) ?
                        dashboardUtilsService.getMessage(null, "success", response.result.importResult) :
                        dashboardUtilsService.getMessage({
                            "result": response.result.importResult,
                            "error": response.result.importError
                        });
                }
            } else {
                if (!response.result.position) return;

                $scope.importProgress = Math.round(response.result.position / response.result.size * 100);
            }
        });

    }, 1000);
};

$scope.cancelImportTrack = function() {
    $interval.cancel($scope.importTrackInterval);
    $scope.importProgress = 100;

    // Show progress bar at least for one second for small files
    $scope.importTrackTimeout = $timeout(function() {
        $scope.isImportRun = false;
    }, 1000);
}


$scope.import = function(method) {
    $scope.importMethod = method;
    $scope.exportMethod = null;

    if (!$scope.file ||
        (method == 'model' && !$scope.model))
        return;

    var postData = new FormData();
    postData.append('file', $scope.file);

    var apiMethodName,
        methodOptions = {};

    switch (method) {
        case 'model':
            apiMethodName = 'importModel';
            methodOptions = { 'model': $scope.model };
            break;
        case 'batch':
            apiMethodName = 'importBatch';
            break;
        case 'tax':
            apiMethodName = 'importTax';
            break;
        case 'discount':
            apiMethodName = 'importDiscount';
            break;
    }

    $scope.startImportTrack();

    impexApiService[apiMethodName](methodOptions, postData).$promise
        .then(function(response) {
            // Process immediate error. If no error, result will be got async way by status check.
            if (response.error !== null) {
                $scope.importMethod = null;
                $scope.cancelImportTrack();
                $scope.message = dashboardUtilsService.getMessage(response);
            }
    });
};

$scope.export = function(method) {
    $scope.exportMethod = method;
    $scope.importMethod = null;

    if (method == 'model' && !$scope.model) return;

    var apiUrl = '';

    switch (method) {
        case 'model':
            apiUrl = '/impex/export/' + $scope.model;
            break;
        case 'tax':
            apiUrl = '/taxes/csv';
            break;
        case 'discount':
            apiUrl = '/csv/coupons';
            break;
    }

    $scope.exportFile = $sce.trustAsHtml("<iframe src ='" +
        REST_SERVER_URI + apiUrl +
        "' style='display:none;'></iframe");
}

}]);
