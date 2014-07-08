(function (define) {
    "use strict";

    define(["design/init"], function (designModule) {
        designModule
            /*
             *  $designService allows to do operations over very top HTML page
             */
            .service("$designService", [function () {
                var data = { theme: "", topPage: "index.html", cssList: []};

                var isFullPathRegex = new RegExp("^http[s]?://", "i");
                var isCssRegex = new RegExp(".css$", "i");

                return {
                    getTheme: function() { return data.theme; },
                    setTheme: function(newTheme) {
                        data.theme = newTheme;
                        return data.theme;
                    },

                    getTopPage: function() {
                        return this.getTemplate( data.topPage );
                    },
                    setTopPage: function(newTopPage) {
                        data.topPage = newTopPage;
                        return data.topPage;
                    },

                    getTemplate: function(templateName) {
                        return ("views/" + data.theme + "/" + templateName).replace(/\/+/, "/");
                    },

                    addCss: function(cssName) {
                        if ( isFullPathRegex.test(cssName) === false && isCssRegex.test(cssName) === true ) {
                            cssName = "styles/" + data.theme + "/" + cssName;
                            cssName = cssName.replace(/\/+/, "/");
                        }
                        data.cssList.push(cssName);

                        return cssName;
                    },

                    getCssList: function() {
                        return data.cssList;
                    },

                    getCssHeadLinks: function() {
                        var html = "";
                        for (var idx in data.cssList) {
                            if  (data.cssList.hasOwnProperty(idx)) {
                                var cssFile = data.cssList[idx];
                                html += "<link rel='stylesheet' href='" + cssFile + "' type='text/css' />" + "\n";
                            }
                        }
                        return html;
                    }
                };
            }]);

        return designModule;
    });
})(window.define);
