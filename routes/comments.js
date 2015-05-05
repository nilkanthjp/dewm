var express = require('express');
var router = express.Router();
var utils = require('dewm-utils');
var mongo = require('mongodb');

router.get('/', function(req, res) {
	if (req.session.access === 0) {
		var stack = req.param('stack'),
			type = req.param('dept');
		utils.comments(function(comments) {
			res.json(comments);
		},stack,type);
	} else {
		res.redirect('/');
	}
});

router.post('/add', function(req, res) {
	var db = req.db,
		comment = req.body;
	db.collection('comments').insert( comment, function(err, result) {
		if (err) { res.send(err) };
		if (result) { console.log('added comment for '+comment.stack+' by '+comment.username); res.send(true); };
	});
});

router.put('/edit', function(req, res) {
	var db = req.db,
		update = {status:req.body.status, approved:req.body.approved},
		key = new mongo.BSONPure.ObjectID(req.body._id);
	if (update.status == "true" || update.status == "false") {
		update.status = JSON.parse(update.status);
	};
	update.approved=JSON.parse(update.approved);
	db.collection('comments').update( { _id:key }, { $set:update }, function(err, result) {
		if (err) { res.send(err); };
		if (result) { console.log('Updated comment with id: '+key); res.send(true); };
	});
});

module.exports = router;