(function (define, $) {
    "use strict";

    define(["cms/init"], function (cmsModule) {
        cmsModule
            .controller("cmsBlockEditController", [
                "$scope",
                "$routeParams",
                "$location",
                "$q",
                "$cmsApiService",
                "$dashboardUtilsService",
                function ($scope, $routeParams, $location, $q, $cmsApiService, $dashboardUtilsService) {
                    var blockId, getDefaultBlock;

                    blockId = $routeParams.id;

                    if (!blockId && blockId !== "new") {
                        $location.path("/cms/blocks");
                    }

                    if (blockId === "new") {
                        blockId = null;
                    }

                    getDefaultBlock = function () {
                        return {
                            "id": "",
                            "url": "",
                            "identifier": "",
                            "content": "",
                            "created_at": "",
                            "updated_at": ""
                        };
                    };

                    $scope.count = 100;

                    /**
                     * Current selected cms
                     *
                     * @type {Object}
                     */
                    $scope.block = getDefaultBlock();

                    /**
                     * Gets list all attributes of cms
                     */
                    $cmsApiService.blockAttributes().$promise.then(
                        function (response) {
                            var result = response.result || [];
                            $scope.attributes = result;
                        }
                    );

                    if (null !== blockId) {
                        $cmsApiService.blockGet({"blockID": blockId}).$promise.then(
                            function (response) {
                                var result = response.result || {};
                                $scope.block = result;
                            }
                        );
                    }

                    $scope.back = function () {
                        $location.path("/cms/blocks");
                    };

                    /**
                     * Event handler to save the cms data.
                     * Creates new cms if ID in current cms is empty OR updates current cms if ID is set
                     */
                    $scope.save = function () {
                        $('[ng-click="save()"]').addClass('disabled').append('<i class="fa fa-spin fa-spinner"><i>').siblings('.btn').addClass('disabled');
                        var id, defer, saveSuccess, saveError, updateSuccess, updateError;
                        defer = $q.defer();

                        if (typeof $scope.block !== "undefined") {
                            id = $scope.block.id || $scope.block._id;
                        }

                        /**
                         *
                         * @param response
                         */
                        saveSuccess = function (response) {
                            if (response.error === null) {
                                var result = response.result || getDefaultBlock();
                                $scope.block._id = response.result._id;
                                $scope.message = $dashboardUtilsService.getMessage(null, 'success', 'Block was saved successfully');
                                defer.resolve(result);

                                $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                                $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                            }
                        };

                        /**
                         *
                         */
                        saveError = function () {
                            $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                            $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                            defer.resolve(false);
                        };

                        /**
                         *
                         * @param response
                         */
                        updateSuccess = function (response) {
                            if (response.error === null) {
                                var result = response.result || getDefaultBlock();
                                $scope.message = $dashboardUtilsService.getMessage(null, 'success', 'Block was updated successfully');
                                $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                                $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                                defer.resolve(result);
                            }
                        };

                        /**
                         *
                         */
                        updateError = function () {
                            $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                            $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                            defer.resolve(false);
                        };


                        if (!id) {
                            $cmsApiService.blockAdd($scope.block, saveSuccess, saveError);
                        } else {
                            $scope.block.id = id;
                            $cmsApiService.blockUpdate($scope.block, updateSuccess, updateError);
                        }

                        return defer.promise;
                    };

                }
            ]
        );

        return cmsModule;
    });
})(window.define, jQuery);
