$(document).ready(function () {

    // click on tab link
    $('.nav-tabs a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

    // sho/hide filsters
    $(document).on('click', '.filters', function () {
        $('#filters').toggle(0);
    });

    // click on offcanvas button
    $(document).on('click', '[data-toggle="offcanvas"]', function (event) {
        event.preventDefault();
        $(this).toggleClass('active');
        $('#offcanvas').toggleClass('active');
        $('.offcanvas-wrapper').toggleClass('active');
    });

    
    // set theme from storage

    var navbarTop = localStorage.getItem('navbarTop');

    setTimeout(function () {


        //set sidebar position
        if (navbarTop === '1') {
            $('#header_sidebar').css('display', 'none');
            $('#header_no_sidebar').css('display', 'block');
            $('#offcanvas').removeClass('active');
            $('body').removeClass('sticky-sidebar');
        }
        else {
            $('#header_no_sidebar').css('display', 'none');
            $('body').css('paddingTop', 0).removeClass('have-fixed-sidebar');
            $('#header_no_sidebar').removeClass('navbar-fixed-top');
            $('#header_sidebar').css('display', 'block');
        }
    }, 2500);


    

    // clickable scroll bottom
    $(document).on('click', '#theme_switcher .scroll-down', function scrollDown() {
        var step = 150;
        $("#switcher").stop().animate({
            scrollTop: "+=" + step + "px"
        }, 400);
        event.preventDefault();
    });

    // clickable scroll top
    $(document).on('click', '#theme_switcher .scroll-up', function scrollUp() {
        var step = 150;
        $("#switcher").stop().animate({
            scrollTop: "-=" + step + "px"
        }, 400);
        event.preventDefault();
    });

    // uploading files
    $(document).on('click', '.upl-btn', function () {
        $(this).prev('.upl-input').trigger('click');
    });

    // modals table checkbox active on tr click
    $(document).on('click', '.modal-dialog table tbody tr', function (event) {
        $(this).children('td:first-child').children('input').trigger('click');
    });

    // modals table checkbox prevent self click for double result
    $(document).on('click', '.modal-dialog table tbody tr td:first-child input', function (event) {
        event.stopPropagation();
    });

    // click on element of offcanvas
    $(document).on('click', '#offcanvas a.menu-item', function (event) {
        var itHasLink = $(this).attr('href');

        if (itHasLink === '') {
            event.preventDefault();
            $('#offcanvas .sub-menu').not($(this).next()).slideUp(300);
            $(this).next('.sub-menu').slideToggle(300);
        }
        else {
            $('#offcanvas').removeClass('active');
            $('#offcanvas a.menu-item').removeClass('active');
            $(this).addClass('active');
        }
    });

    //navtop function
    function goTopNavbarMode() {
        $('#header_sidebar').fadeOut(500, function () {
            $('#header_no_sidebar').fadeIn(500);
            $('#offcanvas').removeClass('active');
            $('body').removeClass('sticky-sidebar');
        });

    }

    // go to 'no_sidebar' mode
    $(document).on('click', '#navbar_switch_top', function () {
        goTopNavbarMode();
        localStorage.removeItem('navbarTop');
        localStorage.setItem('navbarTop', '1');
    });

    //sidebar function
    function goSideBarMode() {
        $('#header_no_sidebar').fadeOut(500, function () {
            $('body').css('paddingTop', 0).removeClass('have-fixed-sidebar');
            $('#header_no_sidebar').removeClass('navbar-fixed-top');
            $('#header_sidebar').fadeIn(500);
            $('#offcanvas').addClass('active');
        });

    }

    // go to 'sidebar' mode
    $(document).on('click', '#navbar_switch_side', function () {
        goSideBarMode();
        localStorage.removeItem('navbarTop');
        localStorage.setItem('navbarTop', '0');
    });

    // fix the navbar in the top
    $(document).on('click', '#fix_navbar', function () {
        var navbarFixed = $('#header_no_sidebar').hasClass('navbar-fixed-top');
        if (navbarFixed === true) {
            $('body').animate({paddingTop: 0}, 400);
        }
        else {
            var navbarHeight = $('#header_no_sidebar').outerHeight(true);
            $('body').animate({paddingTop: navbarHeight}, 400);
        }
        $('#header_no_sidebar').toggleClass('navbar-fixed-top');
    });

    //make the sidebar sticky
    $(document).on('click', '#static_sidebar', function (event) {
        event.preventDefault();
        $('body').toggleClass('sticky-sidebar');
    });

});
