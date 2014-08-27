(function (define) {
    "use strict";

    define(["angular", "design/init"], function (angular, designModule) {
        designModule
        /**
         *  $designService allows to do operations over very top HTML page
         */
            .service("$designService", [function () {

                var data = { theme: "default", topPage: "index.html", cssList: []};
                var isFullPathRegex = new RegExp("^http[s]?://", "i");
                var isCssRegex = new RegExp(".css$", "i");
                var themesDir = "themes/";

                return {
                    getTheme: function () {
                        return data.theme;
                    },

                    setTheme: function (newTheme) {
                        data.theme = newTheme;

                        angular.activeTheme = newTheme;
                        data.cssList = [];

                        return data.theme;
                    },

                    getTopPage: function () {
                        return this.getTemplate(data.topPage);
                    },

                    setTopPage: function (newTopPage) {
                        data.topPage = newTopPage;

                        return data.topPage;
                    },

                    getTemplate: function (templateName) {
                        var template;

                        template = angular.getTheme(templateName)();

                        return template;
                    },

                    addCss: function (cssName) {
                        var fileName;

                        if (isFullPathRegex.test(cssName) === false && isCssRegex.test(cssName) === true) {
                            fileName = "/styles/" + cssName;

                            if (angular.isExistFile(fileName)) {
                                cssName = (themesDir + data.theme + fileName).replace(/\/+/, "/");
                            } else {
                                cssName = (themesDir + "default" + fileName).replace(/\/+/, "/");
                            }
                        }
                        data.cssList.push(cssName);

                        return cssName;
                    },

                    getCssList: function () {
                        return data.cssList;
                    },

                    getImage: function (img) {
                        var image;

                        if (angular.isExistFile(img)) {
                            image = themesDir + data.theme + "/images/" + img;
                        } else {
                            image = themesDir + "default/images/" + img;
                        }

                        return image;
                    }
                };
            }]);

        return designModule;
    });
})(window.define);