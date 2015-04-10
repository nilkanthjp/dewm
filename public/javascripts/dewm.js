var _roost = _roost || [];
_roost.push(['experimental', true]);

// Define main properties and methods for "stack" class and get the "dewm" object from node
$.ajax({
	type: 'GET',
	url: '/dewm'
}).done(function( data ) {
	dewm = data;
	dewm.socket = io.connect(window.location.host);
	stacks.sockets();
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
		}).done(function( response ) {
			if (response.length>1) {
				alert(response);
			} else {
				window.location.href="http://"+window.location.host+window.location.pathname;
			}
		});
	}

	this.sockets = function() {
		var self=this;
		if (dewm.user.access<2) { 
			dewm.socket.on('newStack', function (changes) { self.newStack(changes); }); 
		}
	}

	this.newStack = function(changes) {
		var added=changes[0],
			deleted=changes[1],
			nHTML="<li><select>",
			nFullHTML="",
			oHTML="";
		for (var i=0; i<added.length; i++) {
			nHTML=nHTML+"<option id='"+added[i]+"'>"+added[i]+"</option>"
		}
		nHTML=nHTML+"<option id='deleted'>Deleted</option></select></li>"
		for (var i=0; i<deleted.length; i++) {
			nFullHTML=nFullHTML+nHTML;
			oHTML=oHTML+"<li id='"+deleted[i]+"'>"+deleted[i]+"</li>";
		}
		$("#alertContent #new ul").html(nFullHTML)
		$("#alertContent #old ul").html(oHTML)
		$("#alert").show()
	}

	$( "#alert #submit" ).click(function(){
		var matched=[],
			deleted=[],
			added=[],
			actions={},
			toDelete=[];
		$("#alert #old li").each(function() { 
			deleted.push($(this).text()) 
		});
		$("#alert #new li:first-child option").each(function() { 
			added.push($(this).text()) 
		});
		$("#alert #new select").each(function(i) { 
			var action=$(this).val();
			matched.push(action);
			if (action=="Deleted") {
				actions[deleted[i]]=false;
			} else {
				actions[deleted[i]]=action;
			}
		});
		var toAdd=added.diff(matched).remove('Deleted');
		dewm.socket.emit('reqStack', [actions,toAdd]);
	})

	$( "#alert #close" ).click(function(){
		$("#alert").hide();
	})

	$( "#header #issues #week" ).change(function() {
		var newWeek = $(this).val();
		self.changeWeek(newWeek);
	});

}