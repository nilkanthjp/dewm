var login = new function() {
	var self = this;
	var accesses = ['Admin','Makeup','Copy','Design']
	this.init = function() {
		var credentials = { 'username':$("#login #inputUsername").val(), 'password':$("#login #inputPassword").val() };
		$.ajax({
			type: 'POST',
			data: credentials,
			url: '/users/login',
			dataType: 'JSON'
		}).done(function( response ) {
			if (response == true) {
				location.reload();
			} else {
				$("#error_login").text(response.msg);
			}
		}
	)};

	this.addNew = function() {
		var self = this;
		var user = { 'username':$("#adminEdit #newUsername").val(), 'password':$("#adminEdit #newPassword").val(), 'access':parseInt(accesses.indexOf($("#adminEdit select").val())), 'fname':$("#adminEdit #newFname").val(), 'lname':$("#adminEdit #newLname").val(), 'email':$("#adminEdit #newEmail").val() };
		if ( user.username && user.password && user.access>-1 && user.fname && user.lname && user.email) {
			$.ajax({
				type: 'POST',
				data: user,
				url: '/users/add',
				dataType: 'text'
			}).done(function( response ) { 
				if (response === true) {
					window.setTimeout(function(){ location.reload(); },100);
				} else {
					var error = $.parseJSON(response);
					if (error.code == 11000) {
						$("#adminEdit .error").text("The username '"+user.username+"' already exists.");
					}
				}
			});
		} else {
			$("#adminEdit .error").text("Sorry, all fields must be filled in to add a new user.")
		}
	}

	// preventative measures for shortcuts
	$("#login form, #adminEdit form").submit(function(e) { e.preventDefault(); });
	$(document).keyup(function(e) { if (e.keyCode == 27) { self.editToggle(2,false) } });

	this.editToggle = function (win,operation) {
		wins = [
			$("#adminEdit, #adminEdit #adminAddNewUser"), 
			$("#adminEdit, #adminEdit #adminEditUser"), 
			$("#adminEdit, #adminEdit #adminAddNewUser, #adminEdit #adminEditUser")
		];
		if (operation) {
			wins[win].show()
		} else {
			wins[win].hide()
		}
	}

	this.editUser = function (username) {
		$.ajax({
			type: 'GET',
			url: '../users/user/'+username,
			dataType: 'JSON'
		}).done(function( data ) {
			$("#adminEdit #adminEditUser form").attr("key",data.username);
			$("#adminEdit #adminEditUser #fname").val(data.fname);
			$("#adminEdit #adminEditUser #lname").val(data.lname);
			$("#adminEdit #adminEditUser #email").val(data.email);
			$("#adminEdit #adminEditUser #username").val(data.username);
			$("#adminEdit #adminEditUser #password").val(data.password);
			$("#adminEdit #adminEditUser select").val(accesses[data.access]);
			self.editToggle(1,true);
		});
	}

	this.updateUser = function () {
		var user = {
			"key":$("div.adminEditBox#adminEditUser form").attr("key"),
			"fname":$("#adminEdit #adminEditUser #fname").val(),
			"lname":$("#adminEdit #adminEditUser #lname").val(),
			"email":$("#adminEdit #adminEditUser #email").val(),
			"username":$("#adminEdit #adminEditUser #username").val(),
			"password":$("#adminEdit #adminEditUser #password").val(),
			"access":accesses.indexOf($("#adminEdit #adminEditUser select").val())
		};
		$.ajax({
			type: 'PUT',
			data: user,
			url: '../users/edit',
			dataType: 'JSON'
		}).done(function( data ) {
			if (data !== true) {
				if (data.code == 11000) {
					$("#adminEdit .error").text("The username '"+user.username+"' already exists.");
				}
			} else {
				location.reload();
			}
		});
	}
}