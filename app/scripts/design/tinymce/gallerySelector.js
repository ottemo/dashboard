(function (define) {
    'use strict';
    define(["angular", "tinymce"], function (angular, tinymce) {

        tinymce.PluginManager.add('gallery', function (editor) {
        var onclick = function () {
            var baseUrl = angular.appConfigValue("general.app.dashboard_url");
            var managerUrl = baseUrl + "#/cms/gallery?mini";
            var images, galleryPath, myCmsFile, myJSFile;
            angular.element.get(angular.appConfigValue("general.app.foundation_url") + "/cms/gallery/path", function (data) {
                galleryPath = data.result;
            });
            angular.element.get(angular.appConfigValue("general.app.foundation_url") + "/cms/gallery/images", function (data) {
                images = data.result;

                editor.windowManager.open({
                    title: 'Gallery',
                    type: "container",
                    html: getMyHTML(),
                    width: 900,
                    height: 520,
                    resizable: true,
                    scrollbars: true,
                    buttons: [
                    {
                    text: "Insert",
                    onclick: function () {
                             var args = top.tinymce.activeEditor.windowManager.getParams();
                             var link = args.src, name = args.alt;
                             link = link.split("/media/");
                             editor.insertContent('<p><img class="gallery-item" src="media/' + link[1] + '" alt="' + name + '" width="400" height="400" /></p>');
                         }
                    },
                    {
                        text: 'Close',
                        onclick: 'close'
                    }]
                });
            });

            var getMyHTML = function () {
                var result = '<div style="width:860px; padding-left:20px">';

                for (var i =0; i < images.length; i+=1){
                    result = result + '<span style="display: block; float: left; margin:5px" onclick="top.tinymce.activeEditor.windowManager.setParams(this.firstChild)";><img class="gallery-item" style="padding:5px; border: 1px solid black; width:150px; height:150px" src="' + "media/" + galleryPath + images[i]+ '" alt="' + images[i]+ '" width="150" height="150"/></span>';
                }
                result = result + "</div>";
                return result;
            };
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
