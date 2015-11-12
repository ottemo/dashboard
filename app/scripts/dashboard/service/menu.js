// TODO:
// * monitor route change:
// * add 'active:true' to matching menu item, instead of with $
// * add 'afix' class to body when menu is open, so that the body doesn't scroll
// * let the menu scroll
//
angular.module('dashboardModule')

.service('$menuService', [function() {

    // We have these routes and pages floating around as well

    var menu = [{
        title: 'Dashboard',
        link: '/',
        icon: 'fa-home'
    }, {
        title: 'Orders',
        link: '/orders',
        icon: 'fa-list-alt'
    }, {
        title: 'Products',
        link: null,
        icon: 'fa-tags',
        children: [{
            title: 'Products',
            link: '/products'
        }, {
            title: 'Attributes',
            link: '/attributes'
        }]
    }, {
        title: 'Categories',
        link: '/categories',
        icon: 'fa-list'
    }, {
        title: 'Discounts',
        link: '/discounts',
        icon: 'fa-scissors'
    }, {
        title: 'Visitors',
        link: null,
        icon: 'fa-users',
        children: [{
            title: 'Visitors',
            link: '/visitors'
        }, {
            title: 'Attributes',
            link: '/v/attributes'
        }, {
            title: 'Email',
            link: '/emails'
        }, ]
    }, {
        title: 'CMS',
        link: null,
        icon: 'fa-file-o',
        children: [{
            title: 'Page',
            link: '/cms/pages'
        }, {
            title: 'Block',
            link: '/cms/blocks'
        },{
			title: 'Images',
			link: '/cms/images'
		}]
    }, {
        title: 'URL Rewrite',
        link: '/seo',
        icon: 'fa-random'
    }, {
        title: 'Settings',
        link: null,
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
            title: 'Import / Export',
            link: '/impex'
        }]
    }];

    return menu;
}]);

