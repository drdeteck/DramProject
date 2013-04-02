// The Dram Project
// by Philippe Lavoie

window.PL = window.PL || {};

(function (DramProject, $, undefined) {

// Public Properties
DramProject.ViewModel = null;

// Private Properties

// Public Methods
DramProject.Initialize = function () {
	
	$(document).ready(function()
	{
		// Setup footer
		$("#footer-button").click(PL.DramProject.RunFooterAnimation);

		// Knockout apply bindings
		DramProject.ViewModel = new DramViewModel();
		ko.applyBindings(DramProject.ViewModel);
		
		// Setup Data
		PL.SpreadSheet.Key = "0AoKnDojyuN8YdGZVaGpoQmhhOE5PbU1pcGRVWFctcUE";
		PL.SpreadSheet.GetData("select%20*%20order%20by%20A%2C%20B%2C%20C", DramProject.ViewModel.MapperCallback);
	});
	
	$(window).resize(function() {
		console.log("Document.Resize")
	});
	
	$(window).load(function () {
		// Menu height setup for scroll bar
		PL.DramProject.RefreshMenuHeight();
	});
};

// Resize the left menu size
DramProject.RefreshMenuHeight = function() {
	var menuPadding = $("#nav-list").outerHeight(true) - $("#nav-list").height();
	$("#nav-list").height($(document).height()-( menuPadding + $("#nav-list").offset().top));
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