var express = require('express');
var router = express.Router();
var utils = require('dewm-utils');

router.get('/', function(req, res) {
	res.redirect("/");
});

router.get('/:dept*', function(req, res) {
	var dept = req.param('dept'),
		stack = req.param('stack'),
		restriction = [0,1,dewm.depts.indexOf(dept)];
	req.session.access=parseInt(req.session.access);
	// if user is allowed to view this page
	if (restriction.indexOf(req.session.access)>-1) {
		// if viewer is looking for a specific stack
		if (dewm.depts.indexOf(dept)>-1 && stack !== undefined) {
			var issue = stack.split("_")[stack.split("_").length-1];
			if (req.session.access === 0) { var admin = true; }
			if (dewm.weeks[req.session.current].files.indexOf(stack)>-1) {
				utils.mongo.find("assignments",{stack:{$regex : ".*"+issue}},{},function(err,assignments) {
					utils.mongo.find("comments",{stack:stack},{},function(err,comments) {					
						var stackIndex = dewm.weeks[req.session.current].files.indexOf(stack),
							stackContent = dewm.weeks[req.session.current].stacks[stackIndex],
							c={total:comments.length,unresolved:0};
						for (var i=0; i<assignments.length; i++) {
							if (assignments[i].stack==stack) {
								var assignment = assignments[i];
							}
						}
						for (var i=0; i<comments.length; i++) {
							if (comments[i].status==="false") {
								c.unresolved++;
							}
						}
						res.render(dept, { name: (req.session.fname+" "+req.session.lname), dept:dewm.depts[req.session.access], admin:admin, fname:req.session.fname, dewm:dewm, stack:stackContent, assignments:assignments, assignment:assignment, comments:c, user:req.session, home:false });
					});
				});
			} else {
				if (dewm.dates.strings.indexOf(issue)>-1) { 
					dewm.setWeek(dewm.dates.strings.indexOf(issue));
					res.redirect("/");
				} else {
					res.render('error', { error: {status: 404, message: "This stack isn't available ahora. Drink some coffee and come back later." }});
				}
			}
		// if viewer is looking for a department page (like copy or art)
		} else if (dewm.depts.indexOf(dept)>-1) {
			if (req.session.access === 0) { var admin = true; };
			var issue = dewm.dates.strings[req.session.current];
			utils.mongo.find("assignments",{stack:{$regex : ".*"+issue}},{},function(err,assignments) {
				res.render(dept, { name: (req.session.fname+" "+req.session.lname), dept:dewm.depts[req.session.access], admin:admin, fname:req.session.fname, dewm:dewm, user:req.session, assignments:assignments, home:true });
			});
		};
	} else {
		res.redirect("/");
	}
});

module.exports = router;
