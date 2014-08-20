(function (define) {
    "use strict";

    define(["config/init"], function (configModule) {
        configModule
            .controller("configEditController", [
                "$scope",
                "$configApiService",
                "$configService",
                function ($scope, $configApiService, $configService) {

                    $scope.config = $configService;
                    $scope.currentGroup = null;

                    $scope.attributes = [];
                    $scope.items = {};

                    $scope.init = function () {
                        $scope.config.init();
                    };

                    $scope.select = function (item) {
                        $scope.sections = $scope.config.getConfigSection(item);
                        $scope.currentGroup = item;
                    };

                    $scope.load = function (path) {
                        $scope.config.load(path);
                    };

                    $scope.save = function (code) {
                        $scope.config.save(code).then(
                            function(){
                                window.alert("Save operation is successful");
                                $scope.config.load(code, true);
                            }
                        );
                    };

                    $scope.getGroupName = function () {
                        return $scope.currentGroup !== null ?
                            $scope.currentGroup.charAt(0).toUpperCase() + $scope.currentGroup.slice(1) :
                            "Configuration";
                    };

                    $scope.getGroupPath = function (attributes) {
                        var path, parts;
                        if (attributes instanceof Array) {
                            path = attributes[0].Path;
                            parts = path.split(".");
                            return parts[0] + "." + parts[1];
                        }
                    };
                }
            ]
        );

        return configModule;
    });
})(window.define);