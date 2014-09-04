$(document).ready(function(){

    var str = $(location).attr('hash');
    str = str.substring(2);

    if(str === '')
        $('.left-side-inner > ul > li:first-child').addClass('nav-active');
    else if(str === 'visitor')
        $('.left-side-inner > ul > li:nth-child(2)').addClass('nav-active');
    else if(str === 'product')
        $('.left-side-inner > ul > li:nth-child(3)').addClass('nav-active');
    else if(str === 'category')
        $('.left-side-inner > ul > li:nth-child(4)').addClass('nav-active');
    else if(str === 'config')
        $('.left-side-inner > ul > li:nth-child(5)').addClass('nav-active');

    $(document).on('click', '.left-side-inner > ul > li > a', function(){
        $(this).parent().parent().find('li').removeClass('nav-active');
        $(this).parent().addClass('nav-active');
    });
});