var express = require('express');
var router = express.Router();
var views = ['makeup','makeup','copy','design']

/* GET home page. */
router.get('/', function(req, res) {
	if(req.session.active) {
		if (req.session.access === 0) { var admin = true; }
		else { var admin = false; }
		res.render(views[req.session.access], { name: (req.session.fname+" "+req.session.lname), dept:views[req.session.access], admin:admin, fname:req.session.fname, dewm:dewm });
	} else {
		res.render('index', { title: 'TNY Digital Edition Workflow Manager' });
	}
});

module.exports = router;
