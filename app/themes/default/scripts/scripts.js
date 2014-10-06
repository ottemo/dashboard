(function ($) {
    "use strict";

    // custom scrollbar

    $("html").niceScroll({styler: "fb", cursorcolor: "#65cea7", cursorwidth: '6', cursorborderradius: '0px', background: '#424f63', spacebarenabled: false, cursorborder: '0', zindex: '1000'});

    $(".left-side").niceScroll({styler: "fb", cursorcolor: "#65cea7", cursorwidth: '3', cursorborderradius: '0px', background: '#424f63', spacebarenabled: false, cursorborder: '0'});


    $(".left-side").getNiceScroll();
    if ($('body').hasClass('left-side-collapsed')) {
        $(".left-side").getNiceScroll().hide();
    }


    function mainContentHeightAdjust() {
        // Adjust main content height
        var docHeight = $(document).height();
        if (docHeight > $('.main-content').height())
            $('.main-content').height(docHeight);
    }

    //  class add mouse hover
    $('.custom-nav > li').hover(function () {
        $(this).addClass('nav-hover');
    }, function () {
        $(this).removeClass('nav-hover');
    });


    // Menu Toggle
    $('.toggle-btn').click(function () {
        $(".left-side").getNiceScroll().hide();

        if ($('body').hasClass('left-side-collapsed')) {
            $(".left-side").getNiceScroll().hide();
        }
        var body = $('body');
        var bodyposition = body.css('position');

        if (bodyposition != 'relative') {

            if (!body.hasClass('left-side-collapsed')) {
                body.addClass('left-side-collapsed');
                $('.custom-nav ul').attr('style', '');

                $(this).addClass('menu-collapsed');

            } else {
                body.removeClass('left-side-collapsed chat-view');
                $('.custom-nav li.active ul').css({display: 'block'});

                $(this).removeClass('menu-collapsed');

            }
        } else {

            if (body.hasClass('left-side-show'))
                body.removeClass('left-side-show');
            else
                body.addClass('left-side-show');

            mainContentHeightAdjust();
        }

    });


    searchform_reposition();

    $(window).resize(function () {

        if ($('body').css('position') == 'relative') {

            $('body').removeClass('left-side-collapsed');

        } else {

            $('body').css({left: '', marginRight: ''});
        }

        searchform_reposition();

    });

    function searchform_reposition() {
        if ($('.searchform').css('position') == 'relative') {
            $('.searchform').insertBefore('.left-side-inner .logged-user');
        } else {
            $('.searchform').insertBefore('.menu-right');
        }
    }

    // panel collapsible
    $('.panel .tools .fa').click(function () {
        var el = $(this).parents(".panel").children(".panel-body");
        if ($(this).hasClass("fa-chevron-down")) {
            $(this).removeClass("fa-chevron-down").addClass("fa-chevron-up");
            el.slideUp(200);
        } else {
            $(this).removeClass("fa-chevron-up").addClass("fa-chevron-down");
            el.slideDown(200);
        }
    });

    $('.todo-check label').click(function () {
        $(this).parents('li').children('.todo-title').toggleClass('line-through');
    });

    $(document).on('click', '.todo-remove', function () {
        $(this).closest("li").remove();
        return false;
    });

    $("#sortable-todo").sortable();


    // panel close
    $('.panel .tools .fa-times').click(function () {
        $(this).parents(".panel").parent().remove();
    });


    // tool tips

    $('.tooltips').tooltip();

    // popovers

    $('.popovers').popover();

    // Switching tabs on the editing forms
    $(document).on("click", 'ul.nav-tabs li a', function (event) {
        event.preventDefault();

        $(this).parent().siblings().removeClass('active');
        $(this).parent().addClass('active');
        var href = $(this).attr('href');

        $('.tab-content div').removeClass('active');
        $(href).addClass('active');
    });

    /** Datepicker for gui-datepicker element */
//    $(document).on('click', '.datepicker', function () {
//        $(this).datepicker({
//            showOn: 'focus',
//            yearRange: '1900:+0',
//            changeMonth: true,
//            changeYear: true
//        }).focus();
//    });

    $(document).ready(function () {

        var str = $(location).attr('hash');
        str = str.substring(2);

        if (str === '') {
            $('.left-side-inner > ul > li:first-child').addClass('nav-active');
        } else if (-1 !== str.indexOf('visitor')) {
            $('.left-side-inner > ul > li:nth-child(2)').addClass('nav-active');
        } else if (-1 !== str.indexOf('product')) {
            $('.left-side-inner > ul > li:nth-child(3)').addClass('nav-active');
        } else if (-1 !== str.indexOf('category')) {
            $('.left-side-inner > ul > li:nth-child(4)').addClass('nav-active');
        } else if (-1 !== str.indexOf('config')) {
            $('.left-side-inner > ul > li:nth-child(5)').addClass('nav-active');
        }

        $(document).on('click', '.left-side-inner > ul > li > a', function () {
            $(this).parent().parent().find('li').removeClass('nav-active');
            $(this).parent().addClass('nav-active');
        });

        // drop down list for small left side of menu 
        $(document).on("hover", '.menu-list', function () {
                if ($(this).hasClass('nav-hover')) {
                    $(this).removeClass('nav-hover');
                } else {
                    $(this).addClass('nav-hover');
                }
            }
        );

    });

})(jQuery);




