angular.module('dashboardModule')

.factory('menuService', [
    '$location',
    'loginLoginService',
    '_',
    function($location, loginLoginService, _) {
        // States:
        // - isActive (bool)
        // - isOpen   (bool)
        var items = [{
            title: 'Dashboard',
            link: '/',
            icon: 'fa-home'
        }, {
            title: 'Orders',
            icon: 'fa-list-alt',
            children: [{
                title: 'Orders',
                link: '/orders',
            }, {
                title: 'Subscriptions',
                link: '/subscriptions'
            }]
        }, {
            title: 'Products',
            icon: 'fa-tags',
            children: [{
                title: 'Products',
                link: '/products'
            }, {
                title: 'Attributes',
                link: '/attributes'
            }, {
                title: 'Swatches',
                link: '/swatches'
            }]
        }, {
            title: 'Categories',
            link: '/categories',
            icon: 'fa-scissors'
        }, {
            title: 'Discounts',
            icon: 'fa-tags',
            children: [{
                title: 'Discounts',
                link: '/discounts'
            }, {
                title: 'Gift Cards',
                link: '/giftcards'
            }]
        }, {
            title: 'Visitors',
            icon: 'fa-users',
            children: [{
                title: 'Guests',
                link: '/guests'
            }, {
                title: 'Visitors',
                link: '/visitors'
            }, {
                title: 'Reviews',
                link: '/reviews'
            }, {
                title: 'Attributes',
                link: '/v/attributes'
            }, {
                title: 'Email',
                link: '/emails'
            }]
        }, {
            title: 'CMS',
            icon: 'fa-file-o',
            children: [{
                title: 'Page',
                link: '/cms/pages'
            }, {
                title: 'Block',
                link: '/cms/blocks'
            }, {
                title: 'Media',
                link: '/cms/media'
            }, {
                title: 'Blog',
                link: '/cms/posts'
            }]
        }, {
            title: 'URL Rewrite',
            link: '/seo',
            icon: 'fa-random'
        }, {
            title: 'Reports',
            link: '/reports',
            icon: 'fa-area-chart'
        }, {
            title: 'Settings',
            icon: 'fa-cog',
            children: [{
                title: 'General',
                link: '/settings/general'
            }, {
                title: 'Payment',
                link: '/settings/payment'
            }, {
                title: 'Shipping',
                link: '/settings/shipping'
            }, {
                title: 'Tax',
                link: '/settings/tax'
            }, {
                title: 'Import / Export',
                link: '/impex'
            }, {
                title: 'API',
                link: '/settings/api'
            }]
        }];

        update();

        return {
            items: items,
            update: update,
            closeAll: closeAll,
        };

        ////////////////////////////

        function update() {
            resetAll();
            setActiveItem();
        }

        // Set active state
        function setActiveItem() {
            _.each(items, function(item) {

                // Top level match
                if (isPathMatch(item)) {
                    item.isActive = true;
                } else {

                    // Submenu match
                    var c = _.find(item.children, isPathMatch);
                    if (c) {
                        c.isActive = true;

                        // Make sure the parent is left open
                        item.isOpen = true;
                    }
                }
            });
        }

        function isPathMatch(item) {
            var path = $location.path();
            var link = item.link;

            // Exact match if either is a route url
            if (path === '/' || link === '/') {
                return link === path;
            } else {
                // Starts with link
                return path.indexOf(link) === 0;
            }
        }

        function resetAll() {
            _.each(items, function(i) {
                resetItem(i);
                _.each(i.children, resetItem);
            });

            function resetItem(i) {
                i.isOpen = false;
                i.isActive = false;
            }
        }

        function closeAll() {
            _.each(items, function(i) {
                i.isOpen = false;
            });
        }
    }
]);

