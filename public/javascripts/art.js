// some js for stuff on the makeup status homepage

var art = new function() {
	var self = this;

	this.init = function() {
		var depts=["copy","art","makeup"],
			self=this;
		$.ajax({
			type: 'GET',
			url: '/assignments/'+stacks.currentStack
		}).done(function( data ) {
			self.assignments=data;
			self.initStatuses();
		});
	};

	this.initStatuses = function() {
		var html="",
			text=[
				"Has the art been dropped into New Scans?",
				"Has someone made the crop?",
				"Has someone resized the art?",
				"Has someone uploaded art to Wordpress?",
				"Has someone cropped art for Wordpress?",
				"Has someone resized the Wordpress crops?",
				"Has someone approved the app layout?"
			];
		for (var i=0; i<self.assignments.art.status.length; i++) {
			html=html+"<div class='art_status'>"+utils.makeStatus("",text[i],self.assignments.art.status[i],i)+"</div>";
		};
		$("#wrapper .viewer #sidebar #statuses").html(html);
		self.activateSwitches();
	};

	this.initLayout = function() {
		
	};

	this.activateSwitches = function() {
		$("#wrapper .viewer #sidebar .switchButton").click(function() {
			var statusDiv = $(this).parent().parent(),
				status = utils.opposite(utils.getStatus(statusDiv)),
				userIndex = $(this).attr("id"),
				data={stack:stacks.currentStack,field:"art.status."+userIndex,status:status};
			utils.miniToggle($(this),statusDiv);
			$.ajax({
				type: 'POST',
				data: data,
				url: '/assignments/update',
				dataType: 'json'
			});
		})
	};

	this.init();
};