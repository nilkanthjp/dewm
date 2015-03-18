var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	express.static("Users/nilkanthpatel/Desktop/d/2000_dept_marx_150323/2000_dept_marx_150323.html");	
});

module.exports = router;