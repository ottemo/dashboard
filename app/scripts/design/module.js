(function (define) {
    "use strict";

    /**
     *  Module contains general purpose directives and services used to render HTML page
     *  (make sure module present in main.js requireJS list)
     */
    define([
            "design/service/image",
            "design/service/api",
            "design/service/design",

            "design/directives/design",
            "design/directives/guiAttributesEditorForm",
            "design/directives/guiAttributesEditorFormTabs",
            "design/directives/guiPictureManager",
            "design/directives/guiListManager",
            "design/directives/guiTableManager",
            "design/directives/guiMessageManager",

            "design/directives/editor/guiModelSelector",
            "design/directives/editor/guiArrayModelSelector",
            "design/directives/editor/guiNotEditable",
            "design/directives/editor/guiMultilineText",
            "design/directives/editor/guiPassword",
            "design/directives/editor/guiBoolean",
            "design/directives/editor/guiSelect",
            "design/directives/editor/guiMultiSelect",
            "design/directives/editor/guiText",
            "design/directives/editor/guiJsonEditor",
            "design/directives/editor/guiThemesManager"
        ],
        function (designModule) {

            return designModule;
        });

})(window.define);