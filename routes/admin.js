var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	if(req.session.active) {
		if (req.session.access === 0) { var admin = true; }
		else { var admin = false; }
	    var db = req.db;
	    db.collection('userlist').find({},{ "password":false }).toArray(function (err, items) {
	    	var items = items.sort(function(a, b) {
				var A = a.lname.toUpperCase();
				var B = b.lname.toUpperCase();
				return (A < B) ? -1 : (A > B) ? 1 : 0;
			});
	        res.render('admin', { users:items, user:req.session, name: (req.session.fname+" "+req.session.lname), dept:dewm.depts[req.session.access], admin:admin, fname:req.session.fname, dewm:dewm });
	    });
	} else {
		res.redirect('./');
	}
});

module.exports = router;