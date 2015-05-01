// Define main properties and methods for "viewer" class

var viewer = new function() {
	var self = this;
	this.iphone = {width:330,height:480,wrapper:"",iframe:""};
	this.ipad = {width:778,height:1024,wrapper:"",frame:""};
	this.ipadLandscape = {width:1034,height:768,wrapper:1024+$("#wrapper .viewer #sidebar").width()+100,iframe:1024};

	this.resize = function(device) {
		if (self[device].width>800) {
			$("#iframe").css("min-width",self[device].width);
		} else {
			$("#iframe").css("min-width",800);
		};
		$("#wrapper .viewer iframe").animate({width:self[device].width},200);
		$("#wrapper .viewer iframe").animate({height:self[device].height},200,function() {
			if (self[device].height<$(window).height()*.8) {
				$("#wrapper .comments").css("height",$(window).height()-$("#wrapper .viewer").outerHeight()-120);
			} else {
				$("#wrapper .comments").css("height","auto");
			}
		});
	};

	this.init = function() {
		self.resize("iphone");
	};

	$("#wrapper .viewer #sidebar img").click(function() { self.resize($(this).attr("class")); })
	this.init()
}