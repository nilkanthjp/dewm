// Define main properties and methods for "viewer" class

var comments = new function() {
	var self = this;

	$("#wrapper .comments ul li div.status .switch .switchButton").click(function() {
		if ( $("#wrapper .comments ul li div.status").attr("class").split(" ")[1] == "false" ) {
			newClass = "true";
			newMargin = "20px";
		} else {
			newClass = "false";
			newMargin = "0px";
		}
		$(this).animate({marginLeft:newMargin},100,function() {
			$("#wrapper .comments ul li div.status").removeClass("false");
			$("#wrapper .comments ul li div.status").removeClass("true");
			$("#wrapper .comments ul li div.status").addClass(newClass);
		});
	})
}