(function (define) {
    "use strict";

    define(["seo/init"], function (seoModule) {
        seoModule
            .controller("seoEditController", [
                "$scope",
                "$seoService",
                function ($scope, $seoService) {

                    var seo, seoFields, itemName, urlRewrite, hasAttribute, save, remove, isModifySave, isInitUrlRewrite,
                        modifyRemoveMethod, isModifyRemove, modifySaveMethod, addAttributes, addAttributesValue, getDefaultSeo;

                    $seoService.init();

                    getDefaultSeo = function () {
                        return {
                            "url": "",
                            "rewrite": typeof $scope[itemName] !== "undefined" ? $scope[itemName]._id : "",
                            "title": "",
                            "type": itemName,
                            "meta_keywords": "",
                            "meta_description": ""
                        };
                    };

//                    seoFields = ["url", "rewrite", "title", "type", "meta_keywords", "meta_description"];
                    seoFields = ["url"];
                    urlRewrite = "url";
                    isModifySave = false;
                    isModifyRemove = false;
                    isInitUrlRewrite = false;

                    /**
                     * Checks on the existing attribute
                     *
                     * @param {string} attr
                     * @returns {boolean}
                     */
                    hasAttribute = function (attr) {
                        var i, flag;
                        flag = false;
                        if (typeof $scope.attributes !== "undefined") {

                            for (i = 0; i < $scope.attributes.length; i += 1) {
                                if ($scope.attributes[i].Attribute === attr) {
                                    flag = true;
                                    break;
                                }
                            }
                        }
                        return flag;
                    };

                    /**
                     * Overrides the method save
                     */
                    modifySaveMethod = function () {
                        if (!isModifySave) {

                            save = $scope.save;
                            delete $scope.save;

                            $scope.save = function () {
                                for (var i = 0; i < seoFields.length; i += 1) {
                                    seo[seoFields[i]] = $scope[itemName][seoFields[i]];
                                }
                                delete $scope[itemName][urlRewrite];

                                save();

                                if (typeof seo._id !== "undefined") {
                                    seo = $seoService.update(seo).then(
                                        function (response) {
                                            seo = response || null;
                                            $scope[itemName][urlRewrite] = seo !== null ? seo.url : getDefaultSeo();
                                            isInitUrlRewrite = true;
                                        }
                                    );

                                } else {
                                    seo.type = itemName;
                                    seo = $seoService.save(seo).then(
                                        function (response) {
                                            seo = response || null;
                                            $scope[itemName][urlRewrite] = seo !== null ? seo.url : getDefaultSeo();
                                            isInitUrlRewrite = true;
                                        }
                                    );

                                    $scope[itemName][urlRewrite] = seo !== null ? seo.url : getDefaultSeo();
                                    isInitUrlRewrite = true;
                                }
                            };

                            isInitUrlRewrite = false;
                            isModifySave = true;
                        }
                    };

                    /**
                     * Overrides the method review. Added remove rewrite rules
                     */
                    modifyRemoveMethod = function () {
                        if (!isModifyRemove) {

                            remove = $scope.remove;
                            delete $scope.remove;

                            $scope.remove = function (id) {
                                remove(id);

                                if (typeof seo._id !== "undefined") {
                                    seo = $seoService.remove(seo);
                                }
                            };

                            isInitUrlRewrite = false;
                            isModifyRemove = true;
                        }
                    };

                    /**
                     * Initializes module
                     *
                     * @param {string} item - Type item with which will be work. Name object in child scope
                     */
                    $scope.initSeo = function (item) {
                        $scope = this;
                        itemName = item;
                        isModifySave = false;
                        isModifyRemove = false;
                        isInitUrlRewrite = false;
                        seo = getDefaultSeo();
                    };

                    /**
                     * Adds attributes for seo
                     */
                    addAttributes = function () {
                        if (typeof $scope.attributes !== "undefined") {
                            for (var i = 0; i < seoFields.length; i += 1) {
                                if (!hasAttribute(seoFields[i])) {
                                    $scope.attributes.push({
                                        "Attribute": seoFields[i],
                                        "Collection": "product",
                                        "Default": "",
                                        "Editors": "text",
                                        "Group": "SEO",
                                        "IsRequired": false,
                                        "IsStatic": true,
                                        "Label": seoFields[i].charAt(0).toUpperCase() + seoFields[i].slice(1),
                                        "Model": "Product",
                                        "Options": "",
                                        "Type": "text",
                                        "Value": ""
                                    });
                                }
                            }
                        }
                    };

                    /**
                     * Filling attributes for seo
                     */
                    addAttributesValue = function () {
                        if (typeof $scope[itemName] !== "undefined" && !isInitUrlRewrite) {

                            seo = $seoService.find(itemName, $scope[itemName]._id);
                            if (seo === null) {
                                seo = getDefaultSeo();
                            }
                            for (var i = 0; i < seoFields.length; i += 1) {
                                $scope[itemName][seoFields[i]] = seo[seoFields[i]];
                            }
                            isInitUrlRewrite = true;
                        }
                    };

                    /**
                     * Watches for the attributes
                     */
                    $scope.$watch(function () {
                        return $scope.attributes;
                    }, function () {

                        addAttributes();

                        addAttributesValue();

                        modifySaveMethod();
                        modifyRemoveMethod();

                    }, true);

                    /**
                     * Watches for the selected item in child scope
                     */
                    $scope.$watch(function () {
                        return $scope[itemName]._id;
                    }, function () {

                        isInitUrlRewrite = false;

                    }, true);

                }
            ]
        )
        ;
        return seoModule;
    });
})(window.define);
