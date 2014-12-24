(function (define, $) {
    "use strict";

    define(["angular", "impex/init"], function (angular, impexModule) {

        impexModule
        /**
         *
         */
            .controller("impexController", [
                "$scope",
                "$sce",
                "$impexApiService",
                "$dashboardUtilsService",
                "REST_SERVER_URI",
                function ($scope, $sce, $impexApiService, $dashboardUtilsService, REST_SERVER_URI) {

                    $scope.modelList = {
                        "Product": "Product",
                        "Order": "Order",
                        "CMSPage": "CMSPage",
                        "CMSBlock": "CMSBlock",
                        "Category": "Category",
                        "Visitor": "Visitor"
                    };
                    $scope.sendRequest = false;
                    $scope.modelImportSubmit = false;
                    $scope.modelExportSubmit = false;
                    $scope.batchSubmit = false;

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
                            if (response.error === null) {
                                $scope.message = $dashboardUtilsService.getMessage(null, 'success', response.result);
                            } else {
                                $scope.message = $dashboardUtilsService.getMessage(response.error);
                            }

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
                        $('#processing').modal('show');

                        $scope.sendRequest = true;
                        file = document.getElementById("file");
                        postData = new FormData();
                        postData.append("file", file.files[0]);

                        $impexApiService.importBatch({}, postData).$promise.then(function (response) {
                            $scope.batchSubmit = false;
                            $scope.sendRequest = false;
                            if (response.error === null) {
                                $scope.message = $dashboardUtilsService.getMessage(null, 'success', response.result);
                            } else {
                                $scope.message = $dashboardUtilsService.getMessage(response.error);
                            }
                        $('#processing').modal('hide');
                        });
                    };

                }]);

        return impexModule;
    });
})(window.define, jQuery);
