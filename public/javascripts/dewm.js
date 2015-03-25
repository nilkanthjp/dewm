// Define main properties and methods for "dewm" class

var dewm = new function() {
	var self = this;
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
			location.reload();
		});
	}

	$( "#header #issues #week" ).change(function() {
		var newWeek = $(this).val();
		self.changeWeek(newWeek);
	});
	
	$("#stacks .stack").click(function() {
		self.currentStack = $(this).attr("id");
		$("#wrapper .welcome").html("<img src='./images/loader.gif' />");
	})
	
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