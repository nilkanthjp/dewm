var express = require('express');
var router = express.Router();
var utils = require('dewm-utils');
var build = require('dewm-build');

/* GET DEWM object. */
router.get('/', function(req, res) {
	var userDewm = dewm;
	delete userDewm["socket"];
	userDewm.user = req.session;
	res.json(userDewm);
});

router.post('/week', function(req, res) {
	var week = parseInt(req.body.week);
	req.session.current = week;
	req.session.save();
	response = dewm.setWeek(week,function(response) { res.send(response); });
});

router.post('/build', function(req, res) {
	if (req.session.access <= 1) {
		var date = utils.format.date.stack(req.body.stack), week = dewm.dates.strings.indexOf(date), stack = dewm.weeks[week].files.indexOf(req.body.stack);
		build.init(week,stack,req.body.type,dewm,function(response) { res.send(response); });
	} else { res.redirect('/'); }
});

router.get('/stacks/:stack*', function(req, res) {
	var stack = req.param('stack'),
		stackDate = utils.dateFromStack(stack),
		week = dewm.dates.strings.indexOf(stackDate);
	if (week>=0) {
		if (dewm.weeks[week].files.indexOf(stack)>=0) {
			var stackIndex = dewm.weeks[week].files.indexOf(stack);
			res.json(dewm.weeks[week].stacks[stackIndex]);
		} else {
			dewm.getWeek(week,function() {
				var stackIndex = dewm.weeks[week].files.indexOf(stack);
				res.json(dewm.weeks[week].stacks[stackIndex]);
			})
		}
	} else {
		res.render('error',{error:{status:404}})
	}
});

module.exports = router;
