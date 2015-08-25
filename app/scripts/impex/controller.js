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
        $scope.cancelImportCheck();
    });
};

$scope.chooseFile = function() {
    $('#file').click();
}

$scope.startImportCheck = function() {
    $scope.importProgress = 0;

    $scope.checkTimer = $interval(function() {

        $impexApiService.importStatus().$promise.then(function(response) {
            if (!response.result.position) return;

            $scope.importProgress = parseInt(response.result.position) / parseInt(response.result.size) * 100;
            console.log('pos: %s, size: %s', response.result.position, response.result.size);
        });

    }, 1000);
};

$scope.cancelImportCheck = function() {
    $interval.cancel($scope.checkTimer);
    $scope.importProgress = 100;
}

$scope.importModel = function () {
    $scope.modelImportSubmit = true;

    $scope.batchSubmit = true;

    if ($scope.file === "" || typeof $scope.file === "undefined") {
        return true;
    }

    var file, postData;

    $scope.sendRequest = true;
    file = document.getElementById("file");
    postData = new FormData();
    postData.append("file", file.files[0]);

    $scope.startImportCheck();

    $impexApiService.importModel({"model": $scope.model}, postData).$promise.then(function (response) {

        $scope.cancelImportCheck();
        $scope.modelImportSubmit = false;
        $scope.sendRequest = false;

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

$scope.exportModel = function () {
    $scope.modelExportSubmit = true;
    if ($scope.model === "" || typeof $scope.model === "undefined") {
        return true;
    }
    $scope.exportFile = $sce.trustAsHtml("<iframe src='" + REST_SERVER_URI + "/impex/export/" + $scope.model + "' style='display: none;' ></iframe>");
};

$scope.importBatch = function () {
    $scope.batchSubmit = true;

    if ($scope.file === "" || typeof $scope.file === "undefined") {
        return true;
    }

    $scope.sendRequest = true;

    var file = document.getElementById("file");
    var postData = new FormData();
    postData.append("file", file.files[0]);

    $scope.startImportCheck();

    $impexApiService.importBatch({}, postData).$promise.then(function (response) {

        $scope.cancelImportCheck();
        $scope.batchSubmit = false;
        $scope.sendRequest = false;

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


$scope.exportTax = function () {
    $scope.exportFile = $sce.trustAsHtml("<iframe src='" + REST_SERVER_URI + "/taxes/csv' style='display: none;' ></iframe>");
};

$scope.exportDiscount = function () {
    $scope.exportFile = $sce.trustAsHtml("<iframe src='" + REST_SERVER_URI + "/discounts/csv' style='display: none;' ></iframe>");
};

$scope.importTaxOrDiscount = function (functionName) {
    $scope.taxSubmit = true;

    if ($scope.file === "" || typeof $scope.file === "undefined") {
        return true;
    }

    $scope.sendRequest = true;

    var file = document.getElementById("file");
    var postData = new FormData();
    postData.append("file", file.files[0]);

    $scope.startImportCheck();

    $impexApiService[functionName]({}, postData).$promise.then(function (response) {
        $scope.modelImportSubmit = false;
        $scope.sendRequest = false;
        $scope.message = $dashboardUtilsService.getMessage(null, 'success', "Operation is finished");

        $scope.cancelImportCheck();

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
