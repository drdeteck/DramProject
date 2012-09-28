
$(document).ready(function()
{
	$('#balvenie-ra').roundabout();
	$('#glencairn-ra').roundabout();

	$('#paging a').click(function() {
		pageId = $(this).attr('page');
		num = $('#paging a').index(this);
		$(pageId).parent().animate({scrollTop: (700 * num)}, 'slow');
		$("#paging li").removeClass("active");
		$(this).parent().addClass("active");
	});
});

