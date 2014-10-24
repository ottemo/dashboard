(function (define) {
    "use strict";

    define(["design/init"], function (designModule) {
        designModule
        /**
         *  Directive used for automatic attribute editor creation
         */
            .directive("guiThemesManager", [
                "$designService",
                "$configApiService",
                function ($designService, $configApiService) {
                    return {
                        restrict: "E",
                        scope: {
                            "attribute": "=editorScope",
                            "item": "=item"
                        },
                        templateUrl: $designService.getTemplate("design/gui/editor/themesManager.html"),

                        controller: [
                            "$scope",
                            "$routeParams",
                            "$configService",
                            function ($scope, $routeParams, $configService) {
                                var  storefrontUrl;


                                $scope.config = $configService;
                                $scope.currentPath = "themes.list.active";

                                $scope.init = function () {
                                    $configApiService.getInfo({"path": "general.app.storefront_url"}).$promise.then(
                                        function (response) {
                                            storefrontUrl = response.result[0].Value;
                                        }
                                    );
                                    $configApiService.getInfo({"path": $scope.currentPath}).$promise.then(
                                        function(response){
                                            $scope.themes = JSON.parse(response.result[0].Options.replace(/'/g, "\""));
                                            $scope.activeTheme = response.result[0].Value;
                                        }
                                    );
                                };

                                $scope.getPreview = function (theme) {
                                    if (typeof storefrontUrl === "undefined") {
                                        return "";
                                    }
                                    return storefrontUrl + "/themes/" + theme + "/preview.png";
                                };

                                $scope.setActive = function(theme){
                                    $configApiService.setPath({
                                        "path": $scope.currentPath,
                                        "value": theme
                                    }).$promise.then(
                                        function () {
                                            $scope.activeTheme = theme;
                                        }
                                    );
                                };
                            }
                        ]
                    };
                }]);

        return designModule;
    });
})(window.define);