(function (define) {
    'use strict';
    define(["angular", "tinymce"], function (angular, tinymce) {

        tinymce.PluginManager.add('blocks', function (editor) {
            var onclick = function () {
                var blocks = [];
                angular.element.get(angular.appConfigValue("general.app.foundation_url") + "/cms/block/list", function (data) {
                    for (var i = 0; i < data.result.length; i += 1) {
                        blocks.push({
                            "value": data.result[i].Name,
                            "text": data.result[i].Name
                        });
                    }
                    editor.windowManager.open({
                        "title": 'Blocks',
                        "body": [
                            {
                                "type": 'listbox',
                                "name": 'block',
                                "label": 'Block',
                                "values": blocks
                            }
                        ],
                        "onsubmit": function (e) {
                            // Insert content when the window form is submitted
                            editor.insertContent('{{block("' + e.data.block + '")}}');
                        }
                    });
                });
            };
            // Add a button that opens a window
            editor.addButton('blocks', {
                "text": 'Blocks',
                "icon" : false,
//                "icon" : true,
//                "image": "/icon.png",
                "onclick": onclick
            });
        });


        return tinymce;
    });

})(window.define);
