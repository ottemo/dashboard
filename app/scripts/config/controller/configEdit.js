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

                    $scope.configGroups = [];
                    $scope.configSection = {};

                    $scope.init = function () {
                        $configApiService.getGroups().$promise.then(
                            function (response) {
                                var configGroups = response.result || [];

                                if (configGroups.length > 0) {
                                    var regExp = new RegExp("(\\w+)\\.(\\w+).+", "i");
                                    for (var i = 0; i < configGroups.length; i += 1) {
                                        var parts = configGroups[i].Path.match(regExp);
                                        var group = parts[1];

                                        $scope.configGroups.push({
                                            "Name": group,
                                            "Id": group,
                                            "Static": true
                                        });
                                        if (typeof $scope.configSection[group] === 'undefined') {
                                            $scope.configSection[group] = [];
                                        }
                                        $scope.configSection[group].push({
                                            "Name": configGroups[i].Label,
                                            "Code": parts[2],
                                            "Path": configGroups[i].Path
                                        });

                                    }
                                }
                            }
                        );

                    };

                    $scope.select = function (item) {
                        $scope.sections = $scope.configSection[item];
                    }

                    $scope.load = function (code) {
                        console.log(code);

                        $configApiService.getInfo({"path":code}).$promise.then(
                            function (response) {
                                $scope.attributes = response.result || [];
                                console.log(response);
                            }
                        );
                    }
                }
            ]
        );

        return configModule;
    });
})(window.define);