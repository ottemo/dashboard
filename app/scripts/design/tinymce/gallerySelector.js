(function (define) {
    'use strict';
    define(["angular", "tinymce"], function (angular, tinymce) {

        tinymce.PluginManager.add('gallery', function (editor) {
        var onclick = function () {
            var baseUrl = angular.appConfigValue("general.app.dashboard_url");
            var managerUrl = baseUrl + "#/cms/gallery?mini";

            editor.windowManager.open({
                title: 'Gallery',
                url: managerUrl,
                width: 900,
                height: 450,
                buttons: [
                {
                text: "Insert",
                onclick: function () {
                     var args = top.tinymce.activeEditor.windowManager.getParams();
                     for (var item in args) {
                        editor.insertContent('<p><img class="gallery-item" src="' + baseUrl + args[item]+ '" alt="' + item+ '" width="400" height="400" /></p>');
                     }}
                },
                {
                    text: 'Close',
                    onclick: 'close'
                }]
            });
        };

            // Add a button that opens a window
            editor.addButton('gallery', {
                "text": 'Gallery',
                "icon" : false,
                "onclick": onclick
            });
    });
        return tinymce;
    });

})(window.define);
