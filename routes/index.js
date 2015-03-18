var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	if(req.session.active) {
		if (req.session.access === 0) { var admin = true; }
		else { var admin = false; }
		if (dewm.weeks[dewm.current] == undefined) { dewm.getWeek(dewm.current-1); }
		res.render(dewm.depts[req.session.access], { name: (req.session.fname+" "+req.session.lname), dept:dewm.depts[req.session.access], admin:admin, fname:req.session.fname, dewm:dewm });
	} else {
		res.render('index', { title: 'TNY Digital Edition Workflow Manager' });
	}
});

module.exports = router;
