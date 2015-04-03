// Define main properties and methods for "viewer" class

var comments = new function() {
	var self = this;
	this.dept = window.location.pathname.split("/")[2];
	this.stack = window.location.search.split("stack=")[1];

	this.commentsSocket = function() {
		var self = this,
			socket = io.connect(window.location.host);
		socket.emit('reqComment', { stack:self.stack, dept:self.dept });
		socket.on('newComment', function (data) {
			for (var i=0; i<data.length; i++) {
				if ( $("#wrapper .comments li#"+data[i]._id).length==0 ) {
					var timestamp = new Date(data[i].time);
					$("#wrapper .comments ul").append("<li class='comment' id='"+data[i]._id+"'><div class='timestamp'>"+data[i].name+" at "+self.formatDateForComments(timestamp)+"</div><div class='text'>"+data[i].text+"</div><div class='status "+data[i].status+"'><div class='switch'><div class='switchButton'></div></div></div></li>");
				}
			}
			if (data.length == 0) {
				$("#wrapper .comments ul").html("No comments yet.");
			}
			self.activateSwitches();
		});
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
			text: $("#wrapper .comments .newComment .newCommentText").val()
		};
		$.ajax({
			type: 'POST',
			data: comment,
			url: '/comments/add'
		}).done(function( response ) { 
			$("#wrapper .comments .newComment").val("")
			self.newCommentClose();
			self.refreshComments();
		});
	};

	this.activateSwitches = function() {
		$("#wrapper .comments ul li div.status .switch .switchButton").click(function() {
			var id = $(this).parent().parent().parent().attr("id");
			if ( $("#wrapper .comments ul li#"+id+" div.status").attr("class").split(" ")[1] == "false" ) {
				newClass = "true";
				newMargin = "20px";
			} else {
				newClass = "false";
				newMargin = "0px";
			}
			var updatedComment = { _id:id, status:newClass };
			$.ajax({
				type: 'PUT',
				data: updatedComment,
				url: '../comments/edit',
				dataType: 'JSON'
			});
			$(this).animate({marginLeft:newMargin},100,function() {
				$("#wrapper .comments ul li#"+id+" div.status").removeClass("false");
				$("#wrapper .comments ul li#"+id+" div.status").removeClass("true");
				$("#wrapper .comments ul li#"+id+" div.status").addClass(newClass);
			});
		})
	}

	this.formatDateForComments = function(dateToFormat) {
		var text = dateToFormat.getHours()+":"+dateToFormat.getMinutes()+" on "+utils.months[dateToFormat.getMonth()]+" "+dateToFormat.getDate()+", "+dateToFormat.getFullYear();
		return text;
	}
}