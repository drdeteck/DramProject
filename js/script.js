// The Dram Project
// by Philippe Lavoie

window.PL = window.PL || {};

(function (DramProject, $, undefined) {

// Public Properties
DramProject.Menu = $("<ul>").attr("id", "paging").addClass("nav nav-list");
DramProject.Pages = [];

// Private Properties
var menuFirstHeader = true;
var docHeight = 0;
var lastAddedPageIndex = -1;
var roundaboutIdSuffix = "-roundabout";
var footerOpenHeight = 250;
var footerCloseHeight = 40;

// Table indexes
var indexRegion = 0;
var indexDistillery = 1;
var indexOrder = 2;
var indexWhiskyName = 3;
var indexAlcohol = 4;
var indexAppearance = 5;
var indexNose = 6;
var indexTaste = 7;
var indexFinish = 8;
var indexDescription = 9;
var indexExternalUrl = 10;
var indexPictureUrl = 11;
var indexScotchitUrl = 12;

// Public Methods
DramProject.Initialize = function () {

	$(document).ready(function()
	{
		// Setup footer
		$("#footer-button").click(PL.DramProject.RunFooterAnimation);

		// Setup Data
		PL.SpreadSheet.Key = "0AoKnDojyuN8YdGZVaGpoQmhhOE5PbU1pcGRVWFctcUE";
		PL.SpreadSheet.GetData("select%20*%20order%20by%20A%2C%20B%2C%20C");

		// Settings sizes
		docHeight = $(document).height();
	});
};

DramProject.AddMenuHeader = function (name)
{
	if (!menuFirstHeader)
	{
		DramProject.Menu.append($("<li>").addClass("divider"));
	}
	else
	{
		menuFirstHeader = false;
	}

	// <li class="nav-header">Speyside</li>
	DramProject.Menu.append($("<li>").addClass("nav-header").append(name)); 
};

DramProject.AddMenuItem = function (name)
{
	// <li><a page="#page1">Page 1</a></li>
	DramProject.Menu.append($("<li>").append($("<a>").attr("page", "#" + PL.Utilities.Idfy(name)).append(name))); 
};

DramProject.UpdateMenu = function(pageToSelect)
{
	// Write menu
	$("#nav-list").html(DramProject.Menu[0].outerHTML);

	// Select item
	if (!pageToSelect)
	{
		$("#nav-list ul li a:first").parent().addClass("active")
	}
	else
	{
		$('#nav-list ul li[page="' + pageToSelect + '"]').addClass("active");
	}

	// Setup Menu item click -> select
	$('#paging a').click(function() {
		pageId = $(this).attr('page');
		num = $('#paging a').index(this);
		$(pageId).parent().animate({scrollTop: ($("#wrapper").height() * num)}, 'slow');
		PL.DramProject.RunFooterAnimation(false);
		$("#paging li").removeClass("active");
		$(this).parent().addClass("active");
	});
};

DramProject.AddPage = function (name)
{
	var nameId = PL.Utilities.Idfy(name);
	var page = $("<div>").attr("id", nameId).addClass("page").append($("<ul>").attr("id", nameId + roundaboutIdSuffix));
	DramProject.Pages.push(page);
	lastAddedPageIndex++;
};

DramProject.AddCardToLastPage = function (row)
{
	// var divImg = $("<div>").addClass("left-image").append($("<img>").addClass("bottle-image").attr("src", row[indexPictureUrl].v));
	var divImg = $("<div>").addClass("left-image").css("background-image", "url(" + row[indexPictureUrl].v + ")");
	var div = $("<div>").addClass("card").append(divImg);
	var innerDiv = $("<div class='info'>").append($("<h1>").append(row[indexDistillery].v));
	innerDiv.append($("<h2>").append(row[indexWhiskyName].v));
	innerDiv.append($("<p>").append(row[indexDescription].v));
	innerDiv.append($("<h3>").append("Nose"));
	innerDiv.append($("<div>").append(row[indexNose].v));
	innerDiv.append($("<h3>").append("Taste"));
	innerDiv.append($("<p>").append(row[indexTaste].v));
	innerDiv.append($("<h3>").append("Finish"));
	innerDiv.append($("<span>").append(row[indexFinish].v));
	div.append(innerDiv);

	DramProject.Pages[lastAddedPageIndex].children("ul").append($("<li>").append(div));
};

DramProject.AddDummyCardToLastPage = function ()
{
	DramProject.Pages[lastAddedPageIndex].children("ul").append($("<li>").addClass("dummy-card"));
}

DramProject.UpdatePages = function ()
{
	var pages = [];

	$.each(DramProject.Pages, function (index, value)
	{
		pages.push(value[0].outerHTML);
	});

	$("#wrapper").html(pages.join(""));

	// Setup sizing
	var over = docHeight - $(".page").first().height();
	var padding = over / 2;
	$("#wrapper").height(docHeight - padding);
	$("#wrapper").css("padding-top", padding);
	$(".page").css("padding-bottom", padding);

	// Menu height setup for scroll bar
	var span3 = parseInt($(".span3").css("margin-top").replace("px", ""));
	var titleHeight = $(".title-background").outerHeight() + parseInt($(".title-background").css("margin-bottom").replace("px", ""));
	var menuPadding = $("#nav-list").outerHeight() - $("#nav-list").height();
	var menuMargin = parseInt($("#nav-list").css("margin-bottom").replace("px", ""));
	$("#nav-list").height(docHeight - (menuPadding + menuMargin + titleHeight + span3));

	// Setup Round-About
	$("#wrapper ul").each(function(index, value)
	{
		$(this).roundabout({
         duration: 400,
     	});
	});

	// Delete dummy cards
	$(".dummy-card").remove();
};

DramProject.RunFooterAnimation = function(doOpen) 
{
	var footerHeight = 0;
	if ((typeof doOpen != 'boolean' && $("#footer").height() === footerOpenHeight) || (typeof doOpen === 'boolean' && !doOpen))
	{
		footerHeight = footerCloseHeight;
	}
	else
	{
		footerHeight = footerOpenHeight;
	}

	$("#footer").animate(
		{ height: footerHeight },
		{
			queue: false,
			duration: 500,
			complete: function () {
				$("#footer-button i").toggleClass("icon-chevron-up");
				$("#footer-button i").toggleClass("icon-chevron-down");
			}
		}
		);
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

	if (!callback)
	{
		callback = PL.SpreadSheet.DefaultCallback;
	}

	var url = vizPreKeyUrl + SpreadSheet.Key + args;

	$.get(url, callback, "text");
};

// Do not work yet
SpreadSheet.DefaultCallback = function (data, textStatus, jqXHR)
{
	SpreadSheet.Data = CleanVizResponse(data);
	// console.log(SpreadSheet.Data);

	var currentMenuHeader = "";
	var currentMenuItem = "";
	var lastMenuHeader = "";
	var lastMenuItem = "";
	var cardCount = 5;

	$.each(SpreadSheet.Data, function (index, scotch)
	{
		currentMenuHeader = scotch.c[0].v;
		currentMenuItem = scotch.c[1].v;

		// Check for new Menu Header
		if (currentMenuHeader != lastMenuHeader) 
		{
			lastMenuHeader = currentMenuHeader;
			PL.DramProject.AddMenuHeader(lastMenuHeader);
		}

		// Check for new Menu Item
		if (currentMenuItem != lastMenuItem) 
		{
			lastMenuItem = currentMenuItem;
			PL.DramProject.AddMenuItem(lastMenuItem);

			// Add dummy if necessary
			if (cardCount < 5)
			{
				while (cardCount < 5)
				{
					PL.DramProject.AddDummyCardToLastPage();
					cardCount++;
				}
			}

			PL.DramProject.AddPage(lastMenuItem)
			cardCount = 0;
		}

		PL.DramProject.AddCardToLastPage(scotch.c);
		cardCount++;
	});

	// Add dummy if necessary
	if (cardCount < 5)
	{
		while (cardCount < 5)
		{
			PL.DramProject.AddDummyCardToLastPage();
			cardCount++;
		}
	}

	// Write stuff
	PL.DramProject.UpdateMenu();
	PL.DramProject.UpdatePages();
};

function CleanVizResponse(data)
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