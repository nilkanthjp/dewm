// Define main properties and methods for "viewer" class

var viewer = new function() {
	var self = this;
	this.iphone = {width:320,wrapper:"",iframe:""};
	this.ipad = {width:768,wrapper:"",frame:""};
	this.ipadLandscape = {width:1024,wrapper:1024+$("#wrapper .viewer #sidebar").width()+100,iframe:1024};

	$("#wrapper .viewer #sidebar img").click(function() {
		var device = $(this).attr("class");
		$("#wrapper").css("min-width",self[device].wrapper);
		$("#wrapper .viewer #iframe").css("width",self[device].iframe);
		$("#wrapper .viewer iframe").animate({width:self[device].width},200);
	})
	$("#stacks").scrollTop($("#stacks .stack.active").offset().top-50);
}