// The Dram Project
// by Philippe Lavoie

window.PL = window.PL || {};

(function (DramProject, $, undefined) {

// Public Properties
DramProject.ViewModel = null;

// Private Properties

// Public Methods
DramProject.Initialize = function () {

	// Manage dependancy with YepNope
	yepnope({
		test: PL.DramProject.IsMobile(),
		yep: { "jquery-mobile": "js/jquery.mobile-1.3.0.js" , "jquery-mobile-css": "css/jquery.mobile-1.3.0.css" },
		nope: { "roundabout": "js/jquery.roundabout.min.js", "bootstrap-css": "css/bootstrap.min.css", "bootstrap": "js/bootstrap.min.js" },
		callback: { "jquery-mobile": PL.DramProject.Setup, "roundabout": PL.DramProject.Setup}
	});

	// Add custom bindings for jQuery Mobile List refresh
	ko.bindingHandlers.jqmRefreshList = { 
		update: function(element, valueAccessor) { 
	   ko.utils.unwrapObservable(valueAccessor()); //just to create a dependency
	   if (PL.DramProject.IsMobile()) {
	   	      $(element).listview("refresh"); 
	       }
	   } 
	};
};

// Setup method. 
// Create the View Model, Apply the Knockout binding and call the WebService
DramProject.Setup = function () {
	$(document).ready(function()
	{
		// Setup footer
		$("#footer-button").click(PL.DramProject.RunFooterAnimation);

		// Knockout apply bindings
		DramProject.ViewModel = new DramViewModel([PL.DramProject.RefreshMenuHeight, PL.DramProject.ScrollTo]);
		ko.applyBindings(DramProject.ViewModel);
		
		// Setup Data
		PL.SpreadSheet.Key = "0AoKnDojyuN8YdGZVaGpoQmhhOE5PbU1pcGRVWFctcUE";
		PL.SpreadSheet.GetData("select%20*%20order%20by%20A%2C%20B%2C%20C", DramProject.ViewModel.MapperCallback);
	});

	$(window).resize(function() {
		PL.DramProject.RefreshMenuHeight();
	});

	// $(window).load(function () {
	// 	// Menu height setup for scroll bar
	// 	PL.DramProject.RefreshMenuHeight();
	// });
};

DramProject.IsTablet = function() {
	return $(window).width() <= 1400 && $(window).width() > 480;
};

DramProject.IsFullSize = function() {
	return $(window).width() > 1400;
};

DramProject.IsMobile = function() {
	return $(window).width() <= 480;
};

// Resize the left menu size
DramProject.RefreshMenuHeight = function() {
	var menuPadding = $("#nav-list").outerHeight(true) - $("#nav-list").height();
	$("#nav-list").height($(window).height() - (menuPadding + $("#nav-list").offset().top));
	// console.log($(window).height());
	// $("#nav-list").height($(window).height() - 233);
};

DramProject.RunFooterAnimation = function(doOpen) {
	var footerOpenHeight = 250,
	footerCloseHeight = 40,
	footerHeight = 0;

	if ((typeof doOpen != 'boolean' && $("#footer").height() === footerOpenHeight) || (typeof doOpen === 'boolean' && !doOpen)) {
		footerHeight = footerCloseHeight;
	}
	else {
		footerHeight = footerOpenHeight;
	}

	$("#footer").animate( { height: footerHeight }, {
		queue: false,
		duration: 500,
		complete: function () {
			$("#footer-button i").toggleClass("icon-chevron-up");
			$("#footer-button i").toggleClass("icon-chevron-down");
		}
	});
};

DramProject.ScrollTo = function() {
	if (location.hash) {
		var regex = /#(\w+\s?\w+)&?(\d)?/g;
		var result = regex.exec(location.hash);

		if (result.length > 2) {
			var distillery = result[1].replace(" ", "");
			var bottleIndex = result[2];

			// Scroll vertically
			var menuElement = $("[href=#" + distillery + "]");
			var num = $('#paging a').index(menuElement);
			var scrollHeight = PL.DramProject.IsTablet() ? ($(window).height() - 18) * num : $("#wrapper").height() * num;

			$("#" + distillery).parent().animate({scrollTop: scrollHeight}, 'fast');

			// Scroll horizontally
			if (PL.DramProject.IsTablet()) {
				$($("#" + distillery + " ul li").get(bottleIndex)).show("slide", { direction: "right" }, 500);
				$($("#" + distillery + " ul li").get(0)).hide("slide", { direction: "left" }, 500);
			}
			else {
				$("#" + distillery + " ul").roundabout("animateToChild", bottleIndex);
			}

			// Select menu
			$("#paging li").removeClass("active");
			menuElement.parent().addClass("active");
			
			// Scroll to the menu element if necessary
			if (!isScrolledIntoView(menuElement)) {
				var menuElementTop = menuElement.offset().top - $("#nav-list").offset().top;
				$("#nav-list").animate({scrollTop: menuElementTop}, 'fast');
			}
		}
	}
}

function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom)
      && (elemBottom <= docViewBottom) &&  (elemTop >= docViewTop) );
}

} (PL.DramProject = PL.DramProject || {}, $));


/***************/
/* Utilities */
/***************/

(function (Utilities, $, undefined) {

// Public Method
Utilities.Idfy = function (name)
{
	return name.replace(" ", "");
};

Utilities.FormatMoney = function(number){
	if (typeof number === "number") {
		var num = number.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
		return num + " $";
	}
 };

} (PL.Utilities = PL.Utilities || {}, $));


/***************/
/* SpreadSheet */
/***************/

(function (SpreadSheet, $, undefined) {

// Public Properties
SpreadSheet.Key = "";
SpreadSheet.Data = {};

// Private Properties
var vizPreKeyUrl = "https://spreadsheets.google.com/tq?key=";
var vizArgsKey = "&tq=";

// Public Methods
SpreadSheet.GetData = function (args, callback)
{
	// Args testing
	if (!args)
	{
		args = "";
	}
	else
	{
		args = vizArgsKey + args;
	}
	
	var url = vizPreKeyUrl + SpreadSheet.Key + args;

	$.get(url, callback, "text");
};

SpreadSheet.CleanVizResponse = function(data)
{
	try
	{
		var startIndex = data.indexOf("{");
		return $.parseJSON(data.substr(startIndex, (data.length - startIndex - 2))).table.rows;
	}
	catch(e)
	{
		// We report an error, and show the erronous JSON string (we replace all " by ', to prevent another error)
		console.log(data);
		console.log(e);
	}

	return "";
}

} (PL.SpreadSheet = PL.SpreadSheet || {}, $));

PL.DramProject.Initialize();