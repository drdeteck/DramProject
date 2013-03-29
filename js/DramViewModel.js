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
					self.Regions.push({ Name : "", Class : "divider" });
				}
				
				firstTime = false;
					
				self.Regions.push({ Name : region, Class : "nav-header" });
				lastRegion = region;
			}
			self.Regions.push({ Name : distillery, Class : "" });
			
			var distilleryViewModel =  new DistilleryViewModel(region, distillery);
			_.each(bottles, function(bottle) { 
				distilleryViewModel.Bottles.push(self.BottleMapper(bottle));
			});
			
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
}		