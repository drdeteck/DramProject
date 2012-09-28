
$(document).ready(function()
{
	// Settings sizes
	var docHeight = $(document).height()
	var over = docHeight - $(".page").first().height();
	var padding = over / 2;

	$("#wrapper").height(docHeight - padding);
	$("#wrapper").css("padding-top", padding);
	$(".page").css("padding-bottom", padding);

	$('#balvenie-ra').roundabout(
	{
		responsive:true
	});
	$('#glencairn-ra').roundabout();

	$('#paging a').click(function() {
		pageId = $(this).attr('page');
		num = $('#paging a').index(this);
		$(pageId).parent().animate({scrollTop: (docHeight * num)}, 'slow');
		$("#paging li").removeClass("active");
		$(this).parent().addClass("active");
	});



	var feedUrl = "http://www.google.com/calendar/feeds/liz@gmail.com/public/full";
	feedUrl = "https://docs.google.com/a/philippelavoie.com/spreadsheet/ccc?key=0AoKnDojyuN8YdGZVaGpoQmhhOE5PbU1pcGRVWFctcUE#gid=0";

	function setupMyService() {
		var myService = new google.gdata.calendar.CalendarService('exampleCo-exampleApp-1');
		return myService;
	}

	function getMyFeed() {
		myService = setupMyService();

		myService.getEventsFeed(feedUrl, handleMyFeed, handleError);
	}
});

