var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	if (req.session.access < 3) {
		if (req.session.access === 0) { var admin = true; }
		res.render('copy', { name: (req.session.fname+" "+req.session.lname), dept:dewm.depts[req.session.access], admin:admin, fname:req.session.fname, dewm:dewm, home:true });
	} else {
		res.redirect('./');
	}
});

router.get('/:stack*', function(req, res) {
	var stack = req.param('stack');
	if (req.session.access < 3) {
		if (req.session.access === 0) { var admin = true; }
		if (dewm.weeks[dewm.current].files.indexOf(stack)>-1) {
			res.render('copy', { name: (req.session.fname+" "+req.session.lname), dept:dewm.depts[req.session.access], admin:admin, fname:req.session.fname, dewm:dewm, stack:stack, home:false });
		} else {
			var issue = stack.split("_")[stack.split("_").length-1];
			if (dewm.dates.strings.indexOf(issue)>-1) { 
				dewm.getWeek(dewm.dates.strings.indexOf(issue),"",function() {
					res.redirect('./'+stack);
				});
			} else {
				res.render('error', { error: {status: 404, message: "This stack isn't available ahora. Drink some coffee and come back later." }});
			}
		}
	} else {
		res.redirect('/');
	}
});

module.exports = router;