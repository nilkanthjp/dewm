// Define main properties and methods for "stack" class and get the "dewm" object from node
$.ajax({
	type: 'GET',
	url: '/dewm'
}).done(function( data ) {
	dewm = data;
	if ($("#wrapper .viewer").length>0) { viewer.refreshViewer(); };
	if ($("#wrapper .comments").length>0) { comments.refreshComments(); };
});

var stacks = new function() {
	var self = this;
	this.currentStack = window.location.pathname.split("/")[2];

	this.changeWeek = function(week) {
		$.ajax({
			type: 'POST',
			data: {"week":week},
			url: '/dewm/week',
			dataType: 'text'
		}).done(function( response ) {
			if (response.length>1) {
				alert(response);
			}
			window.location=window.location.origin;
		});
	}

	$( "#header #issues #week" ).change(function() {
		var newWeek = $(this).val();
		self.changeWeek(newWeek);
	});
	
	this.showMakeup = function() {
		$(".makeup #stacks").animate({width:"100%"},800,function() {
			$(".makeup #stacks .number").css({"width":"20%"});
			$(".makeup #stacks .status").css({"width":"5%","display":"inline-block"});
			$(".makeup #stacks .head").css({"width":"70%","display":"inline-block"});
			$(".makeup #stacks .status").animate({opacity:1});
			$(".makeup #stacks .head").animate({opacity:1});
		});
	}
}