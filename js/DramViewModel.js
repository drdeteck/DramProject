function DramViewModel(dataLoadedCallback) {
	var self = this;
	
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
	var indexSAQUrl = 13;
	var indexSAQPrice = 14;
	
	var firstPage = true;
	var pageBottomPadding = "";
	
	self.MenuSelectedIndex = ko.observable(-1);
	self.DataLoadedCallback = dataLoadedCallback;
	self.Distilleries = ko.observableArray();
	self.Regions = ko.observableArray();
	
	self.MapperCallback = function(data, textStatus, jqXHR) {

		data = PL.SpreadSheet.CleanVizResponse(data);
		// Group the data first
		var distilleries = _.groupBy(data, function(scotch){
			return scotch.c[1].v;
		});

		var lastRegion = "";
		var firstTime = true;

		// For each distillery.. map the view model
		_.each(distilleries, function(bottles, distillery){ 
			var region = bottles[0].c[0].v;

			// Build the menu : Insert the region when different
			if (lastRegion != region)
			{
				if (!firstTime)
				{
					self.Regions.push({ Name: "", Class: "divider" });
				}
				
				firstTime = false;

				self.Regions.push({ Name: region, Class: "nav-header" });
				lastRegion = region;
			}
			self.Regions.push({ Name: distillery, Class: null });
			
			// Create the Distillery ViewModel
			var distilleryViewModel =  new DistilleryViewModel(region, distillery);
			
			// Add the bottles to the Distillery View Model
			
			_.each(bottles, function(bottle, index, list) { 
				distilleryViewModel.Bottles.push(self.BottleMapper(bottle, index));
			});
			
			// Add dummy Bottle if necessary (for the roundabout)
			distilleryViewModel.AddDummyBottlesIfNecessary();
			
			// Add the Distillery to the List of distilleries
			self.Distilleries.push(distilleryViewModel);
		});

		_.each(self.DataLoadedCallback, function(callback) {
			callback();
		});
	};
	
	// Receive a Google Spreadsheet row and return a BottleViewModel
	self.BottleMapper = function(bottle, index) {
		var row = bottle.c;
		return new BottleViewModel(
			self.TryGet(row[indexRegion]),
			self.TryGet(row[indexDistillery]),
			self.TryGet(row[indexOrder]),
			self.TryGet(row[indexWhiskyName]),
			self.TryGet(row[indexAlcohol]),
			self.TryGet(row[indexAppearance]),
			self.TryGet(row[indexNose]),
			self.TryGet(row[indexTaste]),
			self.TryGet(row[indexFinish]),
			self.TryGet(row[indexDescription]),
			self.TryGet(row[indexExternalUrl]),
			self.TryGet(row[indexPictureUrl]),
			self.TryGet(row[indexScotchitUrl]),
			self.TryGet(row[indexSAQUrl]),
			self.TryGet(row[indexSAQPrice]),
			index
			);
	};
	
	self.TryGet = function(cell) {
		if (cell) return cell.v;
		return "";
	}

	self.MenuDisplayMode = function(menuItem) {
		return menuItem.Class ? "menu-header-template" : "menu-item-template";
	};
	
	self.RenderMenuItem = function(element, itemObject) {
		if (PL.DramProject.IsMobile()) {
			$("#paging").listview("refresh");
			$(element).click(function(){
				$.mobile.changePage( $($(this).find("a").attr("href")), "slide", true, true);
			});
		}
		else {

			if ($(element).children('a').length > 0) {
				if (self.MenuSelectedIndex() === -1) {
					self.MenuSelectedIndex(0);
					$(element).addClass("active");
				}

				// Paging snippet
				$($(element).children('a')).click(function(event) {
					event.preventDefault();
					var pageId = $(this).attr('href');
					var num = $('#paging a').index(this);
					var scrollHeight = $("#wrapper").height() * num;
					
					if (PL.DramProject.IsTablet()) {
						scrollHeight = ($(window).height() - 18) * num;
					}

					$(pageId).parent().animate({scrollTop: scrollHeight}, 'slow');
					PL.DramProject.RunFooterAnimation(false);
					$("#paging li").removeClass("active");
					$(this).parent().addClass("active");
				});
			}
		}
	};
	
	self.RenderDistillery = function (element, itemObject) {

		if	(PL.DramProject.IsFullSize()) {
			// Setup Round-About
			$(element).filter("div.page").children("ul").roundabout({ duration: 400});


			if (firstPage) {
				firstPage = false;
				
				// Setup sizing
				var docHeight = $(document).height();
				var over = docHeight - $(".page").first().height();
				pageBottomPadding = over / 2;
				$("#wrapper").height(docHeight - pageBottomPadding);
				$("#wrapper").css("padding-top", pageBottomPadding);
			}
		}
		else if (PL.DramProject.IsTablet()) {	
			$(element).children("ul").children("li").click(function (event) {
				if ($(window).width() < 1400) {
					var pageList = $(this).parent().children();
					console.log(pageList);
					var index = $(this).index() + 1;
					
					if (index === pageList.length) index = 0;
					
					$(pageList.get(index)).show("slide", { direction: "right" }, 500);
					
					$(this).hide("slide", { direction: "left" }, 500);
				}});

			$(element).children("ul").children("li").first().show();

			$(element).addClass("well");
			$(element).height($(window).height() - 40);
			console.log($(element).find(".left-image"))
			$(element).find(".left-image").height($(window).height() - 110);
			$(element).find(".info").height($(window).height() - 110);

			// Setup sizing
			$("#wrapper").height($(window).height() - 42);
		}
		else if (PL.DramProject.IsMobile()) {

			$(element).page();
		}

		$(element).filter("div.page").find("li.removeme").remove();


		$(".page").css("padding-bottom", pageBottomPadding);
	};
}		