(function (define, tinymce) {
    "use strict";

    define(["angular", "design/init", "design/tinymce/blockSelector"], function (angular, designModule) {
        designModule
            .value('uiTinymceConfig', {
                "theme": "modern",
                "plugins": [
                    "blocks advlist autolink lists link image charmap preview hr anchor pagebreak",
                    "visualblocks visualchars code fullscreen",
                    "media nonbreaking save table contextmenu directionality",
                    "template paste textcolor colorpicker textpattern"
                ],
                "menubar": false,
                "toolbar1": "blocks | insertfile undo redo | styleselect | bold italic | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
                "image_advtab": true
            })
            .directive('guiTinymce', ['uiTinymceConfig', function (uiTinymceConfig) {
                uiTinymceConfig = uiTinymceConfig || {};
                var generatedIds = 0;
                return {
                    priority: 10,
                    require: 'ngModel',
                    link: function (scope, elm, attrs, ngModel) {
                        var expression, options, tinyInstance,
                            updateView = function () {
                                ngModel.$setViewValue(elm.val());
                                if (!scope.$root.$$phase) {
                                    scope.$apply();
                                }
                            };

                        // Makes a change in tinyMCE content when made changes in parent element(textarea)
                        scope.$watch(function () {
                            return elm.val();
                        }, function () {
                            if (tinyInstance) {
                                tinyInstance.setContent(ngModel.$viewValue || '');
                            }
                        });

                        // generate an ID if not present
                        if (!attrs.id) {
                            attrs.$set('id', 'uiTinymce' + (generatedIds += 1));
                        }

                        if (attrs.uiTinymce) {
                            expression = scope.$eval(attrs.uiTinymce);
                        } else {
                            expression = {};
                        }

                        // make config'ed setup method available
                        if (expression.setup) {
                            var configSetup = expression.setup;
                            delete expression.setup;
                        }

                        options = {
                            // Update model when calling setContent (such as from the source editor popup)
                            setup: function (ed) {
                                ed.on('init', function () {
                                    ngModel.$render();
                                    ngModel.$setPristine();
                                });
                                // Update model on button click
                                ed.on('ExecCommand', function () {
                                    ed.save();
                                    updateView();
                                });
                                // Update model on keypress
                                ed.on('KeyUp', function () {
                                    ed.save();
                                    updateView();
                                });
                                // Update model on change, i.e. copy/pasted text, plugins altering content
                                ed.on('SetContent', function (e) {
                                    if (!e.initial && ngModel.$viewValue !== e.content) {
                                        ed.save();
                                        updateView();
                                    }
                                });
                                ed.on('blur', function () {
                                    elm.blur();
                                });
                                // Update model when an object has been resized (table, image)
                                ed.on('ObjectResized', function () {
                                    ed.save();
                                    updateView();
                                });
                                if (configSetup) {
                                    configSetup(ed);
                                }
                            },
                            mode: 'exact',
                            elements: attrs.id
                        };
                        // extend options with initial uiTinymceConfig and options from directive attribute value
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

                        scope.$on('$destroy', function () {
                            if (!tinyInstance) {
                                tinyInstance = tinymce.get(attrs.id);
                            }
                            if (tinyInstance) {
                                tinyInstance.remove();
                                tinyInstance = null;
                            }
                        });
                    }
                };
            }]
        );
    });
})(window.define, window.tinymce);