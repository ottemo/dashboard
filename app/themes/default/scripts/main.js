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

    //theme switcher
    $(document).on('click', '#switcher .preview', function () {

        // clear the containers and storage
        $('#code_container').html('');
        $('#theme_container').html('');
        localStorage.setItem("cssCode", '');
        localStorage.setItem("activeTheme", '');

        // get new theme
        var thisId = $(this).attr('id');
        var link = '<link rel="stylesheet" href="themes/default/styles/themes/' + thisId + '.css" type="text/css" />';

        // set theme and storage
        $('#theme_container').append(link);
        localStorage.setItem("activeTheme", link);
    });

    // apply the code
    $(document).on('click', '#apply', function () {

        // clear the containers and storage
        $('#code_container').html('');
        $('#theme_container').html('');
        localStorage.setItem("cssCode", '');
        localStorage.setItem("activeTheme", '');

        // get new theme
        var thisCode = $('#code_area').val();
        $('#code_container').text(thisCode);

        // set theme and storage
        localStorage.setItem("cssCode", thisCode);
    });

    // set theme from storage
    document.getElementById("code_container").innerHTML = localStorage.getItem("cssCode");
    document.getElementById("theme_container").innerHTML = localStorage.getItem("activeTheme");
    var navbarTop = localStorage.getItem('navbarTop');

    setTimeout(function () {

        // set the theme
        $('#switcher .preview').each(function () {
            var thisId = $(this).attr('id');
            $(this).children('img').attr('src', 'themes/default/images/themes/' + thisId + '.jpg');
        });

    }, 2500);

    // logout button on menu bottom
    $(document).on('click', '#offcanvas .logout', function () {
        window.location="/logout";
    });

    $(document).on('click', '#switcher-toogle', function () {
        $('#theme_switcher > span.btn').toggleClass('active');
        if (($('#theme_switcher').hasClass('active')) === true) {
            $('#theme_switcher').removeClass('active');
        }
    });

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

    // toggle theme_switcher
    $(document).on('click', '#theme_switcher > span.btn', function () {
        $('#theme_switcher').toggleClass('active');
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

});
