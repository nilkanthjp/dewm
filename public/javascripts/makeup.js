// some js for stuff on the makeup status homepage

var makeup = new function() {
	var self = this;
	self.copy={angle:0};
	self.art={angle:0};
	self.makeup={angle:0};

	this.initStatus = function(dept,percentage) {
		$("#wrapper.makeup .status ul.depth li."+dept+" .chart").html("");
		if (percentage>66) { var c="green"; }
        else if (percentage>33) { var c="orange"; }
        else if (percentage>1) { var c="red"; }
        else { var c=""; }
        $("#wrapper.makeup .status ul.overview li."+dept).addClass(c);
		radialProgress("#wrapper.makeup .status ul.depth li."+dept+" .chart")
			.label("Status")
			.dept(dept)
			.diameter(150)
			.value(percentage)
			.c(c)
			.render();
	};

	this.init = function() {
		var self=this;
		if (window.location.search.indexOf("?stack=")>-1) { var url="stack/"+stacks.currentStack; }
		else { var url="issue/"+dewm.dates.strings[dewm.user.current]; }
		$.ajax({
			type: 'GET',
			url: '/assignments/'+url
		}).done(function( data ) {
			self.assignments=data;
			if (window.location.search.indexOf("?stack=")>-1) {
				self.initCopy();
				self.initArt();
				self.initMakeup();
				self.initSwitches();
			} else {
				self.activeReaders();
			};
		});
	};

	this.activeReaders = function() {
		for (var i=0; i<self.assignments.length; i++) {
			var active=[];
			for (var j=0; j<self.assignments[i].copy.readers.length; j++) {
				if (self.assignments[i].copy.readers[j].active) { 
					active.push(dewm.users[self.assignments[i].copy.readers[j].username].name); 
				};
			};
			if (active.length>0) { $("#stacks li#"+self.assignments[i].stack+" .meta").html('Currently reading: <span class="bold">'+active.join(", ")+"</span>").show(); }
				else { $("#stacks li#"+self.assignments[i].stack+" .meta").html('').hide(); };
		};
	};

	this.initCopy = function() {
		// init variables
		var self=this,
			unresolved=0,
			readers="",
			readersList=[],
			readersSelect="";
		// animate progress circle chart
		self.copy.num=0;
		self.copy.den=self.assignments.copy.readers.length;
		for (var i=0; i<self.assignments.copy.readers.length; i++) {
			self.copy.num=self.copy.num+(self.assignments.copy.readers[i].status?1:0);
		};
		if (self.copy.den===0) { var percentage=0; }
		else { var percentage=self.copy.num/self.copy.den*100; }
		self.initStatus("copy",percentage);
		// calculate number of comments
		for (var i=0; i<self.assignments.comments.length; i++) {
			if (self.assignments.comments[i].status=="false") { unresolved++; }
		};
		$("#wrapper.makeup .actions li.copy div#total p").text(self.assignments.comments.length+" Total Comments")
		$("#wrapper.makeup .actions li.copy div#unresolved p").text(unresolved+" Unresolved Comments")
		// create html for each reader
		for (var i=0; i<self.assignments.copy.readers.length; i++) {
			var reader=self.assignments.copy.readers[i],
				status=reader.status+(reader.active ? " active" : ""),
				readerHTML=utils.templates.reader.replace(/<!--name-->/g,dewm.users[reader.username].name).replace(/<!--username-->/g,reader.username).replace(/<!--index-->/g,i).replace(/<!--class-->/g,status);
			readersList.push(reader.username);
			readers=readers+readerHTML;
		};
		$("#wrapper.makeup .actions li.copy span#readers").html(readers);
		// create dropdown to add more readers
		for (user in dewm.users) {
			var user=dewm.users[user];
			if (user.dept=="copy" && readersList.indexOf(user.username)==-1) {
				readersSelect=readersSelect+utils.templates.select.replace(/<!--username-->/g,user.username).replace(/<!--name-->/g,user.name)
			};
		};
		if (readersSelect.length>0) {
			$("#wrapper.makeup .actions li.copy .addCopy").show();
			$("#wrapper.makeup .actions li.copy .addCopy select").html(readersSelect);
		} else {
			$("#wrapper.makeup .actions li.copy .addCopy").hide();
		}
		
	};

	this.initArt = function() {
		var self=this,
			arters=utils.templates.select.replace(/<!--username-->/g,"null").replace(/<!--name-->/g,"None");
		// init progress circle chart and switch statuses
		self.art.num=0;
		self.art.den=8;
		for (var i=0; i<self.assignments.art.status.length; i++) {
			self.art.num=self.art.num+(self.assignments.art.status[i]?1:0);
			$("#wrapper.makeup .actions li.art .status#art"+i).removeClass("true false").addClass(String(self.assignments.art.status[i]));
		};
		self.art.num=self.art.num+(self.assignments.art.layout?1:0)+(self.assignments.art.app?1:0);
		self.initStatus("art",self.art.num/self.art.den*100);
		// init art point person select bar
		if (self.assignments.art.username) {
			$("#wrapper.makeup .actions ul li.art h2 span").text(dewm.users[self.assignments.art.username].name);
		} else {
			$("#wrapper.makeup .actions ul li.art h2 span").text("None");
		};
		// create dropdown to change art person
		for (user in dewm.users) {
			var user=dewm.users[user];
			if (user.dept=="art" && user.username!==self.assignments.art.username) {
				arters=arters+utils.templates.select.replace(/<!--username-->/g,user.username).replace(/<!--name-->/g,user.name);
			};
		};
		$("#wrapper.makeup .actions li.art .add select").html(arters);
		// program status and text for app approval and layout selection respectively
		$("#wrapper.makeup .actions li.art .status#app").addClass(String(self.assignments.art.app));
		if (self.assignments.art.layout!==null) {
			$("#wrapper.makeup .actions li.art .status#layout p.layout").text(self.assignments.art.layout);
			$("#wrapper.makeup .actions li.art .status#layout p.layout").removeClass("null");
		} else {
			$("#wrapper.makeup .actions li.art .status#layout p.layout").text("None");
			$("#wrapper.makeup .actions li.art .status#layout p.layout").addClass("null");
		};
	};

	this.initMakeup = function() {
		var self=this;
		// init progress circle chart and switch statuses
		self.makeup.num=0;
		self.makeup.den=3;
		self.makeup.num=self.makeup.num+(self.assignments.makeup.built?1:0)+(self.assignments.makeup.copy?1:0)+(self.assignments.makeup.makeup?1:0);
		self.initStatus("makeup",self.makeup.num/self.makeup.den*100);
		// set statuses
		$("#wrapper.makeup .actions li.makeup .status#built").removeClass("true false").addClass(self.assignments.makeup.built?"true":"false");
		$("#wrapper.makeup .actions li.makeup .status#copy").removeClass("true false").addClass(String(self.assignments.makeup.copy));
		$("#wrapper.makeup .actions li.makeup .status#makeup").removeClass("true false").addClass(self.assignments.makeup.makeup?"true":"false");
		// if approved or built, indicate who did it
		if (self.assignments.makeup.built) { 
			$("#wrapper.makeup .actions li.makeup .status#built span").text("by "+dewm.users[self.assignments.makeup.built].name) 
		} else {
			$("#wrapper.makeup .actions li.makeup .status#built span").text("");
		};
		if (self.assignments.makeup.makeup) { 
			$("#wrapper.makeup .actions li.makeup .status#makeup span").text("by "+dewm.users[self.assignments.makeup.makeup].name) 
		} else {
			$("#wrapper.makeup .actions li.makeup .status#makeup span").text("");
		};
	};

	this.initSwitches = function() {
		$("#wrapper.makeup .actions ul li .status .switch .switchButton").click(function(){
			var buttonObject=this,
				dept=$(this).parent().parent().parent().attr("class"),
				button=$(this).attr("id"),
				status=utils.opposite(utils.getStatus($(this).parent().parent()));
			self.switchToggle(dept,button,status,function() {
				utils.toggle($(buttonObject),$(buttonObject).parent().parent());
			});
		});
	};

	this.switchToggle = function(dept,button,status,callback) {
		$("#wrapper.makeup .actions ul li p.message").text("");
		if (parseInt(button)>-1 && dept=="art") {
			var field = dept+".status."+button;
		} else if (parseInt(button)>-1 && dept=="copy") {
			var field = dept+".readers."+button+".status";
		} else if ((button=="makeup" || button=="built") && (status=="true"||status==true)) {
			var status = dewm.user.username,
				field = dept+"."+button;
			if (button=="makeup" && $("#wrapper.makeup .actions ul li .switchButton#built").parent().parent().attr("class").split(" ").indexOf("true")==-1) {
				$("#wrapper.makeup .actions ul li p.message").text("Sorry, app article must be built before it can be approved by Makeup.");
				return;
			}
		} else {
			var field = dept+"."+button;
		};
		var self=this,
			data={stack:stacks.currentStack,field:field,status:status};
		$.ajax({
			type: 'POST',
			data: data,
			url: '/assignments/update',
			dataType: 'json'
		}).done(function( response ) { 
			if (response==true) {
				callback();
			};
		});
	};

	this.openCopy = function() {
		$("#wrapper.makeup .actions ul li.copy div.add").animate({"height":100},200);
		$("#wrapper.makeup .actions ul li.copy div.status.addCopy .change").html("-").attr("onclick","makeup.closeCopy()")
	};

	this.closeCopy = function() {
		$("#wrapper.makeup .actions ul li.copy div.add").animate({"height":0},200);
		$("#wrapper.makeup .actions ul li.copy div.status.addCopy .change").html("+").attr("onclick","makeup.openCopy()")
	};

	this.addCopy = function() {
		var data={stack:stacks.currentStack,field:"copy.readers",reader:$("#wrapper.makeup .actions ul li.copy .add select").val()};
		self.closeCopy();
		$.ajax({
			type: 'POST',
			data: data,
			url: '/assignments/readers/add',
			dataType: 'json'
		});
	};

	this.removeCopy = function(username) {
		$.ajax({
			type: 'POST',
			data: {username:username, stack:stacks.currentStack},
			url: '/assignments/readers/remove',
			dataType: 'json'
		});
	};

	this.changeArt = function() {
		this.closeArt();
		var username = $("#wrapper.makeup .actions ul li.art select").val();
		if (username=="null") { username=null; };
		var data={stack:stacks.currentStack,field:"art.username",status:username};
		$.ajax({
			type: 'POST',
			data: data,
			url: '/assignments/update',
			dataType: 'json'
		});
	};

	this.openArt = function() {
		$("#wrapper.makeup .actions ul li.art div.add").animate({"height":100},200);
		$("#wrapper.makeup .actions ul li.art h2 div.edit").attr("onclick","makeup.closeArt()")
	};

	this.closeArt = function() {
		$("#wrapper.makeup .actions ul li.art div.add").animate({"height":0},200);
		$("#wrapper.makeup .actions ul li.art h2 div.edit").attr("onclick","makeup.openArt()")
	};

	$(window).resize(function() {
		self.init();
	});

};