// Class to holds a Bottle attributes
function BottleViewModel(region, distillery, order, name, alcohol, appearance, nose, taste, finish, description, externalurl, pictureurl, scotchiturl, saqurl, saqprice, index) {
	var self = this;
	
	self.Region = region;
	self.Distillery = distillery;
	self.Order = order;
	self.Name = name;
	self.Alcohol = alcohol;
	self.Appearance = appearance;
	self.Nose = nose;
	self.Taste = taste;
	self.Finish = finish;
	self.Description = description;
	self.ExternalUrl = externalurl;
	self.PictureUrl = pictureurl;
	self.ScotchitUrl = scotchiturl;
	self.SAQUrl = saqurl;
	self.SAQPrice = saqprice;
	self.Index = index;

	self.SAQImageCssClass = self.SAQUrl ? "saq-img" : "display-none";

	this.Permalink = ko.computed(function() {
        return "#" + this.Distillery + "&" + this.Index;
    }, this);
}


function DistilleryViewModel(region, distillery) {
	var self = this;
	var minBottleForRoundabout = 5;
		
	self.Region = region;
	self.Distillery = distillery;
	self.Bottles = ko.observableArray();
	
	// Method to add dummies to Bottles for a better jQuery Roundabout rendering
	self.AddDummyBottlesIfNecessary = function() {
		var safetyCounter = 0;
		
		while(self.Bottles().length < 5 && safetyCounter < 5) {
			self.Bottles.push(new BottleViewModel("", "removeme"));
			safetyCounter++;
		}
	};
}