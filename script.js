
$(document).ready(function()
{
	$('#balvenie-ra').roundabout();
	$('#glencairn-ra').roundabout();

	$('#nav a').click(function() {
		pageId = $(this).attr('href');
		num = $('#nav a').index(this);
		$(pageId).parent().animate({scrollTop: (700 * num)}, 'slow');
	});
});

