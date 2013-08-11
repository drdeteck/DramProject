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
		yep: { "jquery-mobile": "js/jquery.mobile-1.3.0.js" , "jquery-mobile-css": "css/jquery.mobile-1.3.0.css", "base-css": "css/style.css", "mobile-css": "css/mobile.css" },
		nope: { "roundabout": "js/jquery.roundabout.min.js", "bootstrap-css": "css/bootstrap.min.css", "bootstrap": "js/bootstrap.min.js", "base-css": "css/style.css"},
		callback: { "jquery-mobile": PL.DramProject.Setup, "roundabout": PL.DramProject.Setup}
	});
};

// Setup method. 
// Create the View Model, Apply the Knockout binding and call the WebService
DramProject.Setup = function () {
	$(document).ready(function()
	{
		// Setup footer
		$("#footer-button").click(PL.DramProject.RunFooterAnimation);

		// Knockout apply bindings
		var callbacks = [PL.DramProject.HideLoadingMask];
		
		if (!DramProject.IsMobile()) {
			callbacks.unshift(PL.DramProject.ScrollTo);
			callbacks.unshift(PL.DramProject.RefreshMenuHeight);
		}

		DramProject.ViewModel = new DramViewModel(callbacks);
		ko.applyBindings(DramProject.ViewModel);
		
		// Setup Data
		PL.SpreadSheet.Key = "0AoKnDojyuN8YdGZVaGpoQmhhOE5PbU1pcGRVWFctcUE";
		PL.SpreadSheet.GetData("select%20*%20order%20by%20A%2C%20B%2C%20C", DramProject.ViewModel.MapperCallback);
	});

	$(window).resize(function() {
		PL.DramProject.RefreshMenuHeight();
	});
};

DramProject.IsTablet = function() {
	return $(window).width() <= 1400 && $(window).width() > 480;
};

DramProject.IsFullSize = function() {
	return $(window).width() > 1400;
};

DramProject.IsMobile = function() {
	return $(window).width() <= 480 || jQuery.browser.mobile;
};

// Resize the left menu size
DramProject.RefreshMenuHeight = function() {
	var menuPadding = $("#nav-list").outerHeight(true) - $("#nav-list").height();
	$("#nav-list").height($(window).height() - (menuPadding + $("#nav-list").offset().top));
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

DramProject.HideLoadingMask = function() {
	$("#mask").hide();
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

/**
 * jQuery.browser.mobile (http://detectmobilebrowser.com/)
 *
 * jQuery.browser.mobile will be true if the browser is a mobile device
 *
 **/
(function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);

// Start the app
PL.DramProject.Initialize();