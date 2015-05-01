// some js for stuff on the makeup status homepage

var copy = new function() {
	var self = this;

	this.init = function() {
		var depts=["copy","art","makeup"],
			self=this;
		$.ajax({
			type: 'GET',
			url: '/assignments/'+stacks.currentStack
		}).done(function( data ) {
			self.assignments=data;
			var reader = null;
			for (var i=0; i<self.assignments.copy.readers.length; i++) {
				if (dewm.user.username==self.assignments.copy.readers[i].username) {
					reader=i;
				};
			};
			if (reader!==null) {
				self.initApprove(reader);
				self.initReading(reader);
				self.initAssigned(reader);
			};
		});
	};

	this.initApprove = function(reader) {
		var self=this;
		$("#wrapper .viewer #sidebar #approve").html(utils.makeStatus("approve","Is your portion of this piece approved?",self.assignments.copy.readers[reader].status,reader));
		self.activateSwitches();
	};

	this.initReading = function(reader) {
		var self=this
			reading=[];
		for (var i=0; i<self.assignments.copy.readers.length; i++) {
			if (self.assignments.copy.readers[i].active && i!=reader) {
				reading.push(dewm.users[self.assignments.copy.readers[i].username].name)
			};
		};
		if (reading.length>1) {
			reading="There are currently "+reading.length+" other people reading this piece: <span class='bold'>"+reading.slice(0,-1).join(", ")+", and "+reading[reading.length-1]+"</span>";
		} else if (reading.length==1) {
			reading="<span class='bold'>"+reading[0]+"</span> is the only other person reading this piece.";
		} else {
			reading="No one else is reading this piece at the moment.";
		}
		$("#wrapper .viewer #sidebar #reading").html(
			utils.templates.header
				.replace(/<!--status-->/g,self.assignments.copy.readers[reader].status)
				.replace(/<!--index-->/g,reader)
				.replace(/<!--class-->/g,"approve")
				.replace(/<!--text-->/g,reading)
		);
	};

	this.initAssigned = function(reader) {
		var self=this,
			total=self.assignments.copy.readers.length,
			position=$(".viewer iframe").contents().height()*((reader+1)/total);
		$("#wrapper .viewer #sidebar #assigned").html(
			utils.templates.header
				.replace(/<!--status-->/g,self.assignments.copy.readers[reader].status)
				.replace(/<!--index-->/g,reader)
				.replace(/<!--class-->/g,"approve")
				.replace(/<!--text-->/g,"You are assigned <span class='bold'>part "+(reader+1)+" of "+total+"</span> for this piece. <span class='bold'><a onclick='copy.scroll("+position+")'>Go &raquo;</a></span>")
		);
	};

	this.scroll = function(position) {
		$(".viewer iframe").contents().scrollTop(position);
	};

	this.activateSwitches = function() {
		$("#wrapper .viewer #sidebar #approve .switchButton").click(function() {
			var statusDiv = $(this).parent().parent(),
				status = utils.opposite(utils.getStatus(statusDiv)),
				userIndex = $(this).attr("id"),
				data={stack:stacks.currentStack,field:"copy.readers."+userIndex+".status",status:status};
			utils.toggle($(this),statusDiv);
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