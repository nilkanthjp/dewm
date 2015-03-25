var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/:p*', function(req, res) {
	var format = req.param('f');
	var path = req.param('p');
	var root = "file://localhost"+path.split('/',path.split('/').length-2).join("/")+"/";
	console.log(format);
	fs.readFile(path, {encoding: format}, function (err, html) {
		if (err) {
			throw err; 
		}
		absoluteHTML = html.replace(/\.\.\//g,root);
		res.send(absoluteHTML);
	});
});

module.exports = router;