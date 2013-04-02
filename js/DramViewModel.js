function DramViewModel() {
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
	
	var firstPage = true;
	var pageBottomPadding = "";
	
	self.MenuSelectedIndex = ko.observable(-1);
	
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
			_.each(bottles, function(bottle) { 
				distilleryViewModel.Bottles.push(self.BottleMapper(bottle));
			});
			
			// Add dummy Bottle if necessary (for the roundabout)
			distilleryViewModel.AddDummyBottlesIfNecessary();
			
			// Add the Distillery to the List of distilleries
			self.Distilleries.push(distilleryViewModel);
		});
	};
	
	// Receive a Google Spreadsheet row and return a BottleViewModel
	self.BottleMapper = function(bottle) {
		var row = bottle.c;
		return new BottleViewModel(
			row[indexRegion].v,
			row[indexDistillery].v,
			row[indexOrder].v,
			row[indexWhiskyName].v,
			row[indexAlcohol].v,
			row[indexAppearance].v,
			row[indexNose].v,
			row[indexTaste].v,
			row[indexFinish].v,
			row[indexDescription].v,
			row[indexExternalUrl].v,
			row[indexPictureUrl].v,
			row[indexScotchitUrl].v
		);
	};
	
	self.MenuDisplayMode = function(menuItem) {
		return menuItem.Class ? "menu-header-template" : "menu-item-template";
	};
	
	self.RenderMenuItem = function(element, itemObject) {
		if ($(element).children('a').length > 0) {
			if (self.MenuSelectedIndex() === -1) {
				self.MenuSelectedIndex(0);
				$(element).addClass("active");
			}
					
			$($(element).children('a')).click(function(event) {
				event.preventDefault();
				pageId = $(this).attr('href');
				num = $('#paging a').index(this);
				$(pageId).parent().animate({scrollTop: ($("#wrapper").height() * num)}, 'slow');
				PL.DramProject.RunFooterAnimation(false);
				$("#paging li").removeClass("active");
				$(this).parent().addClass("active");
			});
		}
		
	};
	
	self.RenderDistillery = function(element, itemObject) {
		// Setup Round-About
		if	($(document).width() > 1400) {
			$(element).filter("div.page").children("ul").roundabout({ duration: 400});
		}
		$(element).filter("div.page").find("li.removeme").remove();
		
		if (firstPage) {
			firstPage = false;
				
			// Setup sizing
			var docHeight = $(document).height();
			var over = docHeight - $(".page").first().height();
			pageBottomPadding = over / 2;
			$("#wrapper").height(docHeight - pageBottomPadding);
			$("#wrapper").css("padding-top", pageBottomPadding);
		}
		
		$(".page").css("padding-bottom", pageBottomPadding);
	};
}		