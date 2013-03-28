// Class to holds a Bottle attributes
function Bottle(region, distillery, order, name, alcohol, appearance, nose, taste, finish, description, externalurl, pictureurl, scotchiturl) {
	var self = this;
	
	self.region = region;
	self.distillery = distillery;
	self.order = order;
	self.name = name;
	self.alcohol = alcohol;
	self.appearance = appearance;
	self.nose = nose;
	self.taste = taste;
	self.finish = finish;
	self.description = description;
	self.externalurl = externalurl;
	self.pictureurl = pictureurl;
	self.scotchiturl = scotchiturl;
}


function DistilleryViewModel() {
	var self = this;
	
	self.Region = "";
	self.Distillery = "";
	self.BottlesCount = "";
	
	self.Bottles = ko.observableArray();
}