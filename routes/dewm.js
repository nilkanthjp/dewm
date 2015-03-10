var express = require('express');
var router = express.Router();

/* GET DEWM object. */
router.get('/', function(req, res) {
	res.json(dewm);
});

router.post('/week', function(req, res) {
	response = dewm.getWeek(parseInt(req.body.week),"",function(r) {
		res.send(r);
	});
});

module.exports = router;
