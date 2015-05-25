$(document).ready(function () {

    // click on tab link
    $('.nav-tabs a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

    // show/hide filters
    $(document).on('click', '.filters', function () {
        $('#filters').toggle(0);
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
        if ($(this).attr('href') === '') {
            event.preventDefault();
            $('#offcanvas .sub-menu').not($(this).next()).slideUp(300);
            $(this).next('.sub-menu').slideToggle(300);
        } else {
            $('#offcanvas a.menu-item').removeClass('active');
            $(this).addClass('active');
        }
    });

});
