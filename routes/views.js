var express = require('express');
var router = express.Router();

router.get('/:dept*', function(req, res) {
	var dept = req.param('dept');
		stack = req.param('stack'),
		restriction = [0,1,dewm.depts.indexOf(dept)];
	// if user is allowed to view this page
	if (restriction.indexOf(req.session.access)>-1) {
		// if viewer is looking for a specific stack
		if (dewm.depts.indexOf(dept)>-1 && stack !== undefined) {
			if (req.session.access === 0) { var admin = true; }
			if (dewm.weeks[req.session.current].files.indexOf(stack)>-1) {
				res.render(dept, { name: (req.session.fname+" "+req.session.lname), dept:dewm.depts[req.session.access], admin:admin, fname:req.session.fname, dewm:dewm, stack:stack, user:req.session, home:false });
			} else {
				var issue = stack.split("_")[stack.split("_").length-1];
				if (dewm.dates.strings.indexOf(issue)>-1) { 
					dewm.getWeek(dewm.dates.strings.indexOf(issue));
					res.redirect("/");
				} else {
					res.render('error', { error: {status: 404, message: "This stack isn't available ahora. Drink some coffee and come back later." }});
				}
			}
		// if viewer is looking for a department page (like copy or art)
		} else if (dewm.depts.indexOf(dept)>-1) {
			if (req.session.access === 0) { var admin = true; }
			res.render(dept, { name: (req.session.fname+" "+req.session.lname), dept:dewm.depts[req.session.access], admin:admin, fname:req.session.fname, dewm:dewm, user:req.session, home:true });
		};
	} else {
		res.redirect("/");
	}
});

module.exports = router;
