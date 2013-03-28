function DramViewModel() {
	var self = this;
	
	self.Distilleries = ko.observableArray();
	
	self.MapperCallback = function(data, textStatus, jqXHR) {
		
		data = PL.SpreadSheet.CleanVizResponse(data);

		var a = _.groupBy(data, function(scotch){return scotch.c[0].v;});
		
		console.log(a);
	};
}