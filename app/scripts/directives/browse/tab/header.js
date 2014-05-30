(function (define) {
  'use strict';
  define(['angular'], function (angular) {

    angular.module('dashboardApp.directives.BrowseTabHeader', [])
      .directive('browseTabHeader', function () {
        return {
          scope: true,
          templateUrl: 'views/browse/tab/header.html',
          link: function (scope, element, attributes) {
            scope.activeTab = 0;
            for (var i = 0; i < scope.tabs.length; i += 1) {
              if (attributes.activeTab === scope.tabs[i].name) {
                scope.activeTab = i;
                break;
              }
            }
          },
          controller: function ($scope, $location) {
            $scope.menuitems = [
              {
                title: 'visitors',
                content: '<img src="images/icon-visitor.png">',
                linktype: {
                  externalink: 'false',
                  href: '/dashboard/visitor'
                },
                submenu: [
                  {
                    title: ' Sub-sub-Menu Item 1',
                    content: '',
                    linktype: {
                      externalink: 'false',
                      href: '#'
                    }
                  },
                  {
                    title: 'Sub-sub-Menu Item 2',
                    content: '',
                    linktype: {
                      externalink: 'false',
                      href: '#'
                    }


                  }
                ]

              },
              {
                title: 'products',
                content: '<img src="images/icon-product.png">',
                linktype: {
                  externalink: 'false',
                  href: '/dashboard/product'
                },
                submenu: [
                  {
                    title: ' Sub-Menu Item 1',
                    content: '',
                    linktype: {
                      externalink: 'false',
                      href: '#'
                    }
                  },
                  {
                    title: ' Sub-Menu Item 2',
                    content: '',
                    linktype: {
                      externalink: 'false',
                      href: '#'
                    },
                    submenu: [
                      {
                        title: ' Sub-sub-Menu Item 1',
                        content: '',
                        linktype: {
                          externalink: 'false',
                          href: '#'
                        }
                      },
                      {
                        title: 'Sub-sub-Menu Item 2',
                        content: '',
                        linktype: {
                          externalink: 'false',
                          href: '#'
                        }


                      }
                    ]
                  }
                ]
              },
              {
                title: 'config',
                content: '',
                linktype: {
                  externalink: 'false',
                  href: '/dashboard/config'
                }
              },
              {
                title: 'help',
                content: '',
                linktype: {
                  externalink: 'false',
                  href: '/dashboard/help'
                }
              }
            ];
            $scope.tabs = [
              {
                name: 'visitors',
                img: 'images/icon-visitor.png',
                url: '/dashboard/visitor'
              },
              {
                name: 'products',
                img: 'images/icon-product.png',
                url: '/dashboard/product'
              },
              {
                name: 'config',
                img: 'images/icon-product.png',
                url: '/dashboard/config'
              },
              {
                name: 'help',
                img: 'images/icon-help.jpg',
                url: '/dashboard/help'
              }
            ];
            $scope.getClass = function (path) {
              if ($location.path().substr(0, path.length) === path) {
                return 'active';
              } else {
                return '';
              }
            };
          },
          restrict: 'E'
        };
      });
  });
})(window.define);