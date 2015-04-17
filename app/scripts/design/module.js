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
            "design/directives/guiPaginator",
            "design/directives/guiFormBuilder",
            "design/directives/guiAttributesEditorForm",
            "design/directives/guiAttributesEditorFormTabs",
            "design/directives/guiListManager",
            "design/directives/guiTableManager",
            "design/directives/guiTableManagerPopup",
            "design/directives/guiMessageManager",

            // Table filters
            "design/directives/filter/guiText",
            "design/directives/filter/guiRange",
            "design/directives/filter/guiSelect",

            // Validator
            "design/directives/otApplyValidator",
            "design/directives/validator/sku",
            "design/directives/validator/email",
            "design/directives/validator/price",
            "design/directives/validator/len",
            "design/directives/validator/between",
            "design/directives/validator/number",
            "design/directives/validator/positive",
            "design/directives/validator/date",
            "design/directives/validator/regexp",
            "design/directives/validator/password",

            // Form fields
            "design/directives/editor/guiHtml",
            "design/directives/editor/guiTinymce",
            "design/directives/editor/guiPictureManager",
            "design/directives/editor/guiModelSelector",
            "design/directives/editor/guiArrayModelSelector",
            "design/directives/editor/guiVisitorSelector",
            "design/directives/editor/guiPageSelector",
            "design/directives/editor/guiProductsSelector",
            "design/directives/editor/guiProductSelector",
            "design/directives/editor/guiCategorySelector",
            "design/directives/editor/guiNotEditable",
            "design/directives/editor/guiMultilineText",
            "design/directives/editor/guiPassword",
            "design/directives/editor/guiBoolean",
            "design/directives/editor/guiSelect",
            "design/directives/editor/guiMultiSelect",
            "design/directives/editor/guiText",
            "design/directives/editor/guiPrice",
            "design/directives/editor/guiDatetime",
            "design/directives/editor/guiJsonEditor",
            "design/directives/editor/guiThemesManager",
            "design/directives/editor/guiThemesManager",

            "design/tinymce/blockSelector"
        ],
        function (designModule) {

            return designModule;
        });

})(window.define);
