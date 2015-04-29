angular.module("impexModule")

.controller("impexController", [
"$scope",
"$timeout",
"$sce",
"$impexApiService",
"$dashboardUtilsService",
"REST_SERVER_URI",
function ($scope, $timeout, $sce, $impexApiService, $dashboardUtilsService, REST_SERVER_URI) {

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

    $scope.checkStatus()
    $scope.$on('$destroy', function(){
        $timeout.cancel($scope.activeProgressPromise);
    });
};


$scope.checkStatus = function(){
    $impexApiService.importStatus().$promise.then(function (response) {
        var run = response.result.position ? true : false
        var timeLimit = (run) ? 1000 : 5000
        $scope.importProgress = (run) ? parseInt( parseInt(response.result.position) / parseInt(response.result.size) *100 ) : 0
        $scope.importFileName = response.result.name
        var promise = $timeout(function(){
            $scope.checkStatus()
        }, timeLimit);
        $scope.activeProgressPromise = promise
    });
}

$scope.importModel = function () {
    $scope.modelImportSubmit = true;

    if ($scope.model === "" || typeof $scope.model === "undefined") {
        return true;
    }

    $scope.batchSubmit = true;

    if ($scope.file === "" || typeof $scope.file === "undefined") {
        return true;
    }

    var file, postData;

    $scope.sendRequest = true;
    file = document.getElementById("file");
    postData = new FormData();
    postData.append("file", file.files[0]);

    $impexApiService.importModel({"model": $scope.model}, postData).$promise.then(function (response) {
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
    var file, postData;
    $scope.batchSubmit = true;

    if ($scope.file === "" || typeof $scope.file === "undefined") {
        return true;
    }

    $scope.sendRequest = true;
    file = document.getElementById("file");
    postData = new FormData();
    postData.append("file", file.files[0]);

    $impexApiService.importBatch({}, postData).$promise.then(function (response) {
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

    $('#processing').modal('show');
    var file, postData;

    $scope.sendRequest = true;
    file = document.getElementById("file");
    postData = new FormData();
    postData.append("file", file.files[0]);

    $impexApiService[functionName]({}, postData).$promise.then(function (response) {
        $scope.modelImportSubmit = false;
        $scope.sendRequest = false;
        $('#processing').modal('hide');
        // @todo: temporary fix with closing popup, while these methods not returns json in response
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
