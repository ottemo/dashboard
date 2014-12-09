$(document).ready(function() {
	$('.nav-tabs a').click(function (e) {
	    e.preventDefault()
	    $(this).tab('show')
	});
	$(document).on('click', '.filters', function(event) {
        $('#filters').toggle(0)
    });

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
});