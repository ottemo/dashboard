$(document).ready(function() {
	$('.nav-tabs a').click(function (e) {
	    e.preventDefault()
	    $(this).tab('show')
	});
	$(document).on('click', '.filters', function(event) {
        $('#filters').toggle(0)
    });

    //theme switcher
    $(document).on('click', '#switcher .modal-body button', function(event) {	
    	$('body #code_container').html('');
        $('body #theme_container > *').remove();
        var thisId = $(this).attr('id');
        var link = '<link rel="stylesheet" href="themes/default/styles/' + thisId + '.css" type="text/css" />';
    	$('body #theme_container').append(link);
    });

    $(document).on('click', '#apply', function(event) {
    	$('body #code_container').html('');
    	$('body #theme_container > *').remove();
    	var thisCode = $('#code_area').val();
    	$('body #code_container').text(thisCode);
    });

    // uploading files
    $(document).on('click', '.upl-btn', function(event) {
        $(this).prev('.upl-input').trigger('click');
    });

    // modals table checkbox active on td click
    $(document).on('click', '.modal-dialog table tbody td', function(event) {
        $(this).parents('tr').children('td:first-child').children('input').trigger('click');
    });
  
});