// Define main properties and methods for "viewer" class

var viewer = new function() {
	var self = this;
	this.iphone = {width:320};
	this.ipad = {width:768};

	this.refreshViewer = function() {
		var path = dewm.weeks[dewm.user.current].pathOrange.split("/Tablet")[1]+"/Digital%20Danville/"+stacks.currentStack+"/"+stacks.currentStack+".html";
		$("#wrapper .viewer iframe").attr("src",path);
	}

	$("#wrapper .viewer #sidebar img").click(function() {
		var device = $(this).attr("class");
		$("#wrapper .viewer iframe").animate({width:self[device].width},200);
	})
	$("#stacks").scrollTop($("#stacks .stack.active").offset().top-50);
}