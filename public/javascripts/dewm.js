// Define main properties and methods for "stack" class and get the "dewm" object from node
$.ajax({
	type: 'GET',
	url: '/dewm'
}).done(function( data ) {
	dewm = data;
	dewm.socket = io.connect(window.location.host);
	dewm.socket.on('newStack', function (changes) { stacks.newStack(changes);});
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

	this.newStack = function(changes) {

	}

	$( "#header #issues #week" ).change(function() {
		var newWeek = $(this).val();
		self.changeWeek(newWeek);
	});

}