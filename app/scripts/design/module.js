(function (define) {
    "use strict";

    /*
     *  Module contains general purpose directives and services used to render HTML page
     *  (make sure module present in main.js requireJS list)
     */
    define([
            "design/services",
            "design/service/image",
            "design/service/api",

            "design/directives/design",
            "design/directives/guiAttributesEditorForm",
            "design/directives/guiPictureManager",
            "design/directives/editor/guiModelSelector",
            "design/directives/editor/guiArrayModelSelector",
            "design/directives/guiListManager",

            "design/directives/editor/guiNotEditable",
            "design/directives/editor/guiMultilineText",
            "design/directives/editor/guiPassword",
            "design/directives/editor/guiBoolean",
            "design/directives/editor/guiSelect",
            "design/directives/editor/guiMultiSelect",
            "design/directives/editor/guiText"
        ],
        function (designModule) {

            return designModule;
        });

})(window.define);