// some js for stuff on the makeup status homepage

var makeup = new function() {
	var self = this;
	this.copyStatus = d3.select("#wrapper.makeup .status ul.depth li.copy .chart");

	this.initStatus = function(dept,percentage) {
		$("#wrapper.makeup .status ul.depth li."+dept+" .chart").html("");
		if (percentage>66) { var c="green"; }
        else if (percentage>33) { var c="orange"; }
        else if (percentage>1) { var c="red"; }
        else { var c=""; }
        $("#wrapper.makeup .status ul.overview li."+dept).addClass(c);
		radialProgress("#wrapper.makeup .status ul.depth li."+dept+" .chart")
			.label("Status")
			.diameter(150)
			.value(percentage)
			.c(c)
			.render();
	}

	this.init = function() {
		self.initStatus("copy",80);
		self.initStatus("art",50);
		self.initStatus("makeup",0);
	}

	$(window).resize(function() {
		self.init();
	});
	self.init();
};