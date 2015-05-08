// Define main properties and methods for "stack" class and get the "dewm" object from node
$.ajax({
	type: 'GET',
	url: '/dewm'
}).done(function( data ) {
	dewm = data;
	dewm.socket = io.connect(window.location.host);
	stacks.sockets();
	notifications.check();
	if ($("#stacks.makeup, #wrapper.makeup").length>0) { makeup.init(); };
	if ($("#wrapper .comments").length>0) { comments.commentsSocket(); };
});

var stacks = new function() {
	var self = this;
	this.dept = window.location.pathname.split("/")[2];
	this.currentStack = window.location.search.split("stack=")[1];

	this.changeWeek = function(week) {
		$.ajax({
			type: 'POST',
			data: {"week":week},
			url: '/dewm/week',
			dataType: 'text'
		}).done(function() {
			location.reload();
		});
	};

	this.sockets = function() {
		var self=this;
		if (dewm.user.access<2) { 
			dewm.socket.on('newStack', function (changes) { self.newStack(changes); });
			dewm.socket.on('endStack', function() { $("#alert").hide(); });
		};
		dewm.socket.on('assignments', function(s) {
			if (dewm.user.access<=1 && stacks.dept=="makeup") { makeup.init(); }
			if (stacks.currentStack && s==stacks.currentStack) { 
				if (dewm.user.access<=1 && stacks.dept=="art") { art.init(); }
				else if (dewm.user.access==2) { copy.init(); }
			};
		});
		$( "#header #issues #week" ).change(function() {
			var newWeek = $(this).val();
			self.changeWeek(newWeek);
		});
	};

	this.newStack = function(changes) {
		var added=changes[0],
			deleted=changes[1],
			nHTML="<li><select><option id='deleted'>Deleted</option>",
			nFullHTML="",
			oHTML="";
		for (var i=0; i<added.length; i++) {
			nHTML=nHTML+"<option id='"+added[i]+"'>"+added[i]+"</option>"
		}
		nHTML=nHTML+"</select></li>"
		for (var i=0; i<deleted.length; i++) {
			nFullHTML=nFullHTML+nHTML;
			oHTML=oHTML+"<li id='"+deleted[i]+"'>"+deleted[i]+"</li>";
		}
		$("#alertContent #new ul").html(nFullHTML)
		$("#alertContent #old ul").html(oHTML)
		$("#alert #submit").click(function(){self.submit()});
		$("#alert #close").click(function(){$("#alert").hide();})
		$("#alert").show()
	};

	this.submit = function() {
		var deleted=$.makeArray($("#alert #old").find('li').map(function(){return $(this).text();})),
			added=$.makeArray($("#alert #new li:first-child").find('option').map(function(){return $(this).text();})).remove('Deleted'),
			actions={},
			matched=[];
		$("#alert #new select").each(function(i) { 
			var action=$(this).val();
			matched.push(action);
			added.remove(action);
			if (action=="Deleted") {
				actions[deleted[i]]=false;
			} else {
				actions[deleted[i]]=action;
			};
		});
		for (var i=0; i<added.length; i++) {
			actions[added[i]]=true;
		}
		dewm.socket.emit('reqStack', [actions,dewm.user.current]);
		window.location=window.location.href
	};

}