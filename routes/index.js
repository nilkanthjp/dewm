var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	dewm.url = req.path;
	if(req.session.active) {
		if (req.session.access === 0) { var admin = true; }
		else { var admin = false; }
		if (dewm.weeks[req.session.current] == undefined) { dewm.setWeek(req.session,current-1); };
		res.redirect("views/"+dewm.depts[req.session.access]);
	} else {
		res.render('index', { title: 'TNY Digital Edition Workflow Manager',logged:false });
	}
});

module.exports = router;
