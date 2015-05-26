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
    $(document).on('click', '#offcanvas .menu-item a', function (event) {
        // toggle active state
        $('#offcanvas .active').removeClass('active');
        $(this).addClass('active');

        // toggle open state
        var isParentOpen = $(this).parents('.menu-item.open').length;
        if (!isParentOpen) {
            $('#offcanvas .menu-item.open').removeClass('open');
        }
        if ($(this).is('.dropdown-toggle')) {
            event.preventDefault();
            $(this).parents('.menu-item').addClass('open');
        }
    });

});
