angular.module("impexModule")

.controller("impexController", [
"$scope",
"$timeout",
"$interval",
"$sce",
"$impexApiService",
"$dashboardUtilsService",
"REST_SERVER_URI",
function ($scope, $timeout, $interval, $sce, $impexApiService, $dashboardUtilsService, REST_SERVER_URI) {

$scope.sendRequest = false;
$scope.modelImportSubmit = false;
$scope.modelExportSubmit = false;
$scope.batchSubmit = false;

$scope.init = function () {
    $impexApiService.getModels().$promise.then(function (response) {
        if(response.error === null) {
            $scope.modelList = response.result;
        } else {
            $scope.message = $dashboardUtilsService.getMessage(response.error);
        }
    });

    $scope.$on('$destroy', function(){
        $interval.cancel($scope.importTrackInterval);
        $timeout.cancel($scope.importTrackTimeout);
    });
};

$scope.startImportTrack = function() {
    $scope.isImportRun = true;
    $scope.importProgress = 0;

    $scope.importTrackInterval = $interval(function() {

        $impexApiService.importStatus().$promise.then(function(response) {
            if (!response.result.position) return;

            $scope.importProgress = Math.round(response.result.position / response.result.size * 100);
        });

    }, 1000);
};

$scope.cancelImportTrack = function() {
    $interval.cancel($scope.importTrackInterval);
    $scope.importProgress = 100;

    $scope.importTrackTimeout = $timeout(function() {
        $scope.isImportRun = false;
    }, 1000);
}

$scope.import = function(method) {
    if (!$scope.file) return;

    
}

$scope.importModel = function () {
    if (!$scope.file) return;

    $scope.modelImportSubmit = true;
    $scope.batchSubmit = true;
    $scope.sendRequest = true;

    var postData = new FormData();
    postData.append("file", $scope.file);

    $scope.startImportTrack();

    $impexApiService.importModel({"model": $scope.model}, postData).$promise.then(function (response) {

        $scope.cancelImportTrack();
        $scope.modelImportSubmit = false;
        $scope.sendRequest = false;

        try {
            if (response.error === null) {
                $scope.message = $dashboardUtilsService.getMessage(null, 'success', response.result);
            } else {
                $scope.message = $dashboardUtilsService.getMessage(response);
            }
        } catch(e) {}
    });
};

$scope.exportModel = function () {
    $scope.modelExportSubmit = true;
    if ($scope.model === "" || typeof $scope.model === "undefined") {
        return true;
    }
    $scope.exportFile = $sce.trustAsHtml("<iframe src='" + REST_SERVER_URI + "/impex/export/" + $scope.model + "' style='display: none;' ></iframe>");
};

$scope.importBatch = function () {
    if (!$scope.file) return;

    $scope.batchSubmit = true;
    $scope.sendRequest = true;

    var postData = new FormData();
    postData.append("file", $scope.file);

    $scope.startImportTrack();

    $impexApiService.importBatch({}, postData).$promise.then(function (response) {

        $scope.cancelImportTrack();
        $scope.batchSubmit = false;
        $scope.sendRequest = false;

        try {
            if (response.error === null) {
                $scope.message = $dashboardUtilsService.getMessage(null, 'success', response.result);
            } else {
                $scope.message = $dashboardUtilsService.getMessage(response);
            }
        } catch(e) {}
    });
};


$scope.exportTax = function () {
    $scope.exportFile = $sce.trustAsHtml("<iframe src='" + REST_SERVER_URI + "/taxes/csv' style='display: none;' ></iframe>");
};

$scope.exportDiscount = function () {
    $scope.exportFile = $sce.trustAsHtml("<iframe src='" + REST_SERVER_URI + "/discounts/csv' style='display: none;' ></iframe>");
};

$scope.importTaxOrDiscount = function (functionName) {
    if (!$scope.file) return;

    $scope.taxSubmit = true;
    $scope.sendRequest = true;

    var postData = new FormData();
    postData.append("file", $scope.file);

    $scope.startImportTrack();

    $impexApiService[functionName]({}, postData).$promise.then(function (response) {
        $scope.cancelImportTrack();
        $scope.modelImportSubmit = false;
        $scope.sendRequest = false;
        $scope.message = $dashboardUtilsService.getMessage(null, 'success', "Operation is finished");


        try {
            if (response.error === null) {
                $scope.message = $dashboardUtilsService.getMessage(null, 'success', response.result);
            } else {
                $scope.message = $dashboardUtilsService.getMessage(response);
            }
        } catch(e) {}

        return true;
    });
};

$scope.importDiscount = function () {
    $scope.importTaxOrDiscount('importDiscount');
};

$scope.importTax = function () {
    $scope.importTaxOrDiscount('importTax');
};
}]);
