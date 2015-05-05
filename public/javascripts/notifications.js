// Define main properties and methods for "viewer" class

var notifications = new function() {
    var self = this;

	this.check = function() {
		if ('safari' in window && 'pushNotification' in window.safari) {
			var permissionData = window.safari.pushNotification.permission('web.com.example.domain');
			if (permissionData.permission === 'default') { self.ask(); };
		};
	};

	this.ask = function() {
		window.safari.pushNotification.requestPermission(
			'https://domain.example.com', // The web service URL.
			'web.com.example.domain',     // The Website Push ID.
			{username:dewm.user.username, name:dewm.users[dewm.user.username].name},
			function() {
				
			}
		);
	};
}