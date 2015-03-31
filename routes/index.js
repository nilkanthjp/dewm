var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	dewm.url = req.path;
	if(req.session.active) {
		if (req.session.access === 0) { var admin = true; }
		else { var admin = false; }
		if (dewm.weeks[dewm.current] == undefined) { dewm.setWeek(dewm.current-1); };
		if (req.session.access<2) {
			res.render('index', { name: (req.session.fname+" "+req.session.lname), dept:dewm.depts[req.session.access], admin:admin, fname:req.session.fname, user:req.session, dewm:dewm, logged:true });
		} else {
			res.redirect("views/"+dewm.depts[req.session.access]);
		}
	} else {
		res.render('index', { title: 'TNY Digital Edition Workflow Manager',logged:false });
	}
});

module.exports = router;
