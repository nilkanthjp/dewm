// Define main properties and methods for "viewer" class

var viewer = new function() {
	var self = this;
	this.iphone = {width:320};
	this.ipad = {width:768};

	$("#wrapper .viewer #sidebar img").click(function() {
		var device = $(this).attr("class");
		$("#wrapper .viewer iframe").animate({width:self[device].width},200);
	})
	$("#stacks").scrollTop($("#stacks .stack.active").offset().top-50);
}