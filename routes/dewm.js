var express = require('express');
var router = express.Router();

/* GET DEWM object. */
router.get('/', function(req, res) {
	var userDewm = dewm;
	userDewm.user = req.session;
	res.json(userDewm);
});

router.post('/week', function(req, res) {
	var week = parseInt(req.body.week);
	req.session.current = week;
	req.session.save();
	response = dewm.setWeek(week,"",function(response) {
		res.send(response);
	});
});

router.post('/issues', function(req, res) {
	
});

module.exports = router;
