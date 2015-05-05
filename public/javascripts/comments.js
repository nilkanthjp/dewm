// Define main properties and methods for "viewer" class

var comments = new function() {
	var self = this;
	this.dept = window.location.pathname.split("/")[2];
	this.stack = window.location.search.split("stack=")[1];

	this.commentsSocket = function() {
		var socket=dewm.socket;
		socket.emit('reqComment', { stack:self.stack, dept:self.dept });
		socket.on('newComment', function (data) {
			for (var i=0; i<data.length; i++) {
				var timestamp = new Date(data[i].time),
					content = "<li class='comment' id='"+data[i]._id+"'><div class='timestamp'>"+data[i].name+" at "+self.formatDateForComments(timestamp)+"</div><div class='text'>"+data[i].text+"</div><div class='status "+data[i].status+"'><div class='switch'><div class='switchButton'></div></div></div></li>";
				if ( $("#wrapper .comments li#"+data[i]._id).length==0 && $("#wrapper .comments li").length==0 ) {
					$("#wrapper .comments ul").html(content);
				} else if ($("#wrapper .comments li#"+data[i]._id).length==0) {
					$("#wrapper .comments ul").append(content);
				}
			}
			if (data.length == 0) {
				$("#wrapper .comments ul").html("No comments yet.");
			}
			self.activateSwitches();
		});
		if (dewm.depts[dewm.user.access]=="copy") { socket.emit('reading', { stack:self.stack, username:dewm.user.username }); }
	};

	this.newCommentClose = function() { $("#wrapper .comments .newComment").animate({height:0},100); };
	this.newCommentOpen = function() { $("#wrapper .comments .newComment").animate({height:100},100); }

	this.newCommentToggle = function() {
		var height = $("#wrapper .comments .newComment").height();
		if (height==0) {
			self.newCommentOpen();
		} else {
			self.newCommentClose();
		}
	};

	this.newCommentSubmit = function() {
		var comment = { 
			stack:stacks.currentStack,
			username:dewm.user.username,
			type:window.location.pathname.split("/")[2],
			status:false,
			time:new Date(),
			approved:null,
			text: $("#wrapper .comments .newComment .newCommentText").val()
		};
		$.ajax({
			type: 'POST',
			data: comment,
			url: '/comments/add'
		}).done(function( response ) { 
			$("#wrapper .comments .newComment").val("")
			self.newCommentClose();
		});
	};

	this.activateSwitches = function() {
		$("#wrapper .comments ul li div.status .switch .switchButton").click(function() {
			var id = $(this).parent().parent().parent().attr("id"),
				opt = ["true","false"],
				approved = false,
				status = $("#wrapper .comments ul li#"+id+" div.status");
			utils.toggle($(this),status);
			status = utils.opposite(status.attr("class").split(" ")[1]);
			if (status) { var approved = JSON.stringify({by:dewm.user.username, at:new Date()}); };
			updatedComment = { _id:id, status:status, approved:approved};
			$.ajax({
				type: 'PUT',
				data: updatedComment,
				url: '../comments/edit',
				dataType: 'JSON'
			});
		})
	}

	this.formatDateForComments = function(dateToFormat) {
		var text = dateToFormat.getHours()+":"+dateToFormat.getMinutes()+" on "+utils.months[dateToFormat.getMonth()]+" "+dateToFormat.getDate()+", "+dateToFormat.getFullYear();
		return text;
	}
}