(function (define) {
    "use strict";

    define(["angular", "design/init"], function (angular, designModule) {
        designModule
        /**
         *  $designService allows to do operations over very top HTML page
         */
            .service("$designService", [function () {

                var data = { theme: angular.appConfigValue("themes.list.active"), topPage: "index.html", cssList: []};
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
                        angular.appConfig["themes.list.active"] = newTheme;
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
                        var i, uniqueCss;
                        uniqueCss = [];
                        for (i = 0; i < data.cssList.length; i += 1) {
                            if (-1 === uniqueCss.indexOf(data.cssList[i])) {
                                uniqueCss.push(data.cssList[i]);
                            }
                        }

                        return uniqueCss;
                    },

                    getImage: function (img) {
                        var image;
                        img = "/images/" + img;

                        if (angular.isExistFile(img)) {
                            image = themesDir + data.theme + img;
                        } else {
                            image = themesDir + "default" + img;
                        }

                        return image;
                    }
                };
            }]);

        return designModule;
    });
})(window.define);