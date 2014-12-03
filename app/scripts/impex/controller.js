(function (define) {
    "use strict";

    define(["angular", "impex/init"], function (angular, impexModule) {

        impexModule
        /**
         *
         */
            .controller("impexController", [
                "$scope",
                "$impexApiService",
                "REST_SERVER_URI",
                function ($scope, $impexApiService, REST_SERVER_URI) {

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

                        var file, postData;

                        $scope.sendRequest = true;
                        file = document.getElementById("file");
                        postData = new FormData();
                        postData.append("file", file.files[0]);

                        $impexApiService.importModel({"model": $scope.model}, postData).$promise.then(function (response) {
                            $scope.modelImportSubmit = false;
                            $scope.sendRequest = false;
                            if (response.error === "") {
                                $scope.message = {
                                    'type': 'success',
                                    'message': response.result
                                };
                            } else {
                                $scope.message = {
                                    'type': 'danger',
                                    'message': response.error
                                };
                            }

                        });
                    };

                    $scope.exportModel = function () {
                        $scope.modelExportSubmit = true;

                        if ($scope.model === "" || typeof $scope.model === "undefined") {
                            return true;
                        }
                        document.body.innerHTML += "<iframe src='" + REST_SERVER_URI + "/impex/export/" + $scope.model + "' style='display: none;' ></iframe>";
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
                            if (response.error === "") {
                                $scope.message = {
                                    'type': 'success',
                                    'message': response.result
                                };
                            } else {
                                $scope.message = {
                                    'type': 'danger',
                                    'message': response.error
                                };
                            }

                        });
                    };

                }]);

        return impexModule;
    });
})(window.define);
