$(document).ready(function() {
	$('.nav-tabs a').click(function (e) {
	    e.preventDefault()
	    $(this).tab('show')
	});
	$(document).on('click', '.filters', function() {
        $('#filters').toggle(0)
    });

    //theme switcher
    $(document).on('click', '#switcher .preview', function() {	
    	$('#code_container').html('');
        $('#theme_container > *').remove();
        var thisId = $(this).attr('id');
        var link = '<link rel="stylesheet" href="themes/default/styles/themes/' + thisId + '.css" type="text/css" />';
    	$('#theme_container').append(link);
        $('#code_container').html('');
            
        //clear coockie and storage
        setCookie('test1','');
        localStorage.setItem("cssCode", '');

        //get cookie
        var container1 = $('#theme_container').html();
        
        //set cookie
        setCookie('test1',container1);

    });

    $(document).on('click', '#apply', function() {
        $('#code_container').html('');
        $('#theme_container > *').remove();

        //clear coockie and storage
        setCookie('test1','');
        localStorage.setItem("cssCode", '');

        //get cookie
        var thisCode = $('#code_area').val();
        $('#code_container').text(thisCode);

        //set cookie
        localStorage.setItem("cssCode", thisCode);
    });

    //cookies function
    function setCookie(cname, cvalue) {
        document.cookie = cname + "=" + cvalue + "; ";
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
         var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
     }
        return "";
    }



    document.getElementById("code_container").innerHTML = localStorage.getItem("cssCode");


    $('#theme_container').html(getCookie('test1'));

    $('#switcher .preview').each(function() {
        var thisId = $(this).attr('id');
        $(this).children('img').attr('src', 'themes/default/images/themes/' + thisId + '.jpg');
    });

    $(document).on('click', '#switcher-toogle', function() {
        $('#theme_switcher > span.btn').toggleClass('active');
        if ( ($('#theme_switcher').hasClass('active')) == true ) {
            $('#theme_switcher').removeClass('active')
        };
    });

    $(document).on('click', '#theme_switcher .scroll-down', function scrollDown() {
        var step = 150;
        $("#switcher").stop().animate({
            scrollTop: "+=" + step + "px"
        },400);
         event.preventDefault();
    });

    $(document).on('click', '#theme_switcher .scroll-up', function scrollUp() {
        var step = 150;
        $("#switcher").stop().animate({
            scrollTop: "-=" + step + "px"
        },400);
         event.preventDefault();
    });

    $(document).on('click', '#theme_switcher > span.btn', function() {
        $('#theme_switcher').toggleClass('active');
    });

    // uploading files
    $(document).on('click', '.upl-btn', function() {
        $(this).prev('.upl-input').trigger('click');
    });

    // modals table checkbox active on td click
    $(document).on('click', '.modal-dialog table tbody td', function() {
        $(this).parents('tr').children('td:first-child').children('input').trigger('click');
    });
});