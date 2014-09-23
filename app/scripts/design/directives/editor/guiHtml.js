(function (define) {
    "use strict";

    define(["design/init"], function (designModule) {
        designModule
            .value('uiTinymceConfig', {
                theme: "modern",
                plugins: [
                    "advlist autolink lists link image charmap print preview hr anchor pagebreak",
                    "searchreplace wordcount visualblocks visualchars code fullscreen",
                    "insertdatetime media nonbreaking save table contextmenu directionality",
                    "emoticons template paste textcolor colorpicker textpattern"
                ],
                toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
                toolbar2: "print preview media | forecolor backcolor emoticons",
                image_advtab: true
            })
            .directive('guiHtml', ['uiTinymceConfig', function (uiTinymceConfig) {
                uiTinymceConfig = uiTinymceConfig || {};
                var generatedIds = 0;
                return {
                    require: 'ngModel',
                    link: function (scope, elm, attrs, ngModel) {
                        var expression, options, tinyInstance;
                        // generate an ID if not present
                        if (!attrs.id) {
                            attrs.$set('id', 'uiTinymce' + (generatedIds += 1));
                        }
                        options = {
                            // Update model when calling setContent (such as from the source editor popup)
                            setup: function (ed) {
                                ed.on('init', function () {
                                    ngModel.$render();
                                });
                                // Update model on button click
                                ed.on('ExecCommand', function () {
                                    ed.save();
                                    ngModel.$setViewValue(elm.val());
                                    if (!scope.$$phase) {
                                        scope.$apply();
                                    }
                                });
                                // Update model on keypress
                                ed.on('KeyUp', function () {
                                    console.log(ed.isDirty());
                                    ed.save();
                                    ngModel.$setViewValue(elm.val());
                                    if (!scope.$$phase) {
                                        scope.$apply();
                                    }
                                });
                            },
                            mode: 'exact',
                            elements: attrs.id
                        };
                        if (attrs.uiTinymce) {
                            expression = scope.$eval(attrs.uiTinymce);
                        } else {
                            expression = {};
                        }
                        angular.extend(options, uiTinymceConfig, expression);
                        setTimeout(function () {
                            tinymce.init(options);
                        });


                        ngModel.$render = function () {
                            if (!tinyInstance) {
                                tinyInstance = tinymce.get(attrs.id);
                            }
                            if (tinyInstance) {
                                tinyInstance.setContent(ngModel.$viewValue || '');
                            }
                        };
                    }
                };

                return designModule;
            }]);
    });
})(window.define);