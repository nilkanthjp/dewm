var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	if (req.session.access < 3) {
		if (req.session.access === 0) { var admin = true; }
		res.render('copy', { name: (req.session.fname+" "+req.session.lname), dept:dewm.depts[req.session.access], admin:admin, fname:req.session.fname, dewm:dewm });
	} else {
		res.render('error', { error: {status: "Access denied", message: "Come at me, bro." }});
	}
});

module.exports = router;