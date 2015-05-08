var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.redirect('/');
});

router.get('/stack/:stack*', function(req, res) {
	var stack=req.param('stack');
	if (req.session.access === 0) {
		var db = req.db;
		db.collection('assignments').find({stack:stack}).toArray(function (err, items) {
			var data = items[0];
			db.collection('comments').find({stack:stack}).toArray(function (err, items) {
				data.comments=items;
				res.json(data);
			});
		});		
	} else {
		var db = req.db;
		db.collection('assignments').find({stack:stack},{copy:1,art:1,stack:1}).toArray(function (err, items) {
			res.json(items[0]);
		});		
	}
});

router.get('/issue/:issue*', function(req, res) {
	var issue=req.param('issue');
	if (req.session.access === 0) {
		var db = req.db;
		db.collection('assignments').find({stack:{$regex : ".*"+issue}}).toArray(function (err, items) {
			res.json(items);
		});		
	} else {
		var db = req.db;
		db.collection('assignments').find({stack:{$regex : ".*"+issue}},{copy:1,art:1,stack:1}).toArray(function (err, items) {
			res.json(items);
		});		
	}
});

router.post('/update', function(req, res) {
	var db = req.db,
		stack = req.body.stack,
		field = req.body.field,
		status = req.body.status,
		update = {$set:{}};
	// update copy approved total
	if (["true","false"].indexOf(status)>-1) {
		status = ["true","false"].indexOf(status) ? false : true;
	};
	if (field.indexOf("copy.readers")==0) {
		var i = status ? 1 : -1;
		db.collection('assignments').find({stack:stack}).toArray(function (err, items) {
			var approved = items[0].copy.approved+i;
			db.collection('assignments').update( {stack:stack}, {$set:{ "copy.approved":approved }}, function(err, result) {});
		});
	};
	update["$set"][field]=status;
	db.collection('assignments').update( {stack:stack}, update, function(err, result) {
		if (err) { res.send(err); console.log(err) };
		if (result) { res.send(true); };
	});
});

router.post('/readers/add', function(req, res) {
	var db = req.db,
		stack = req.body.stack,
		field = req.body.field,
		reader = { "username":req.body.reader, "status":false, "active":false},
		update = {$addToSet:{}};;
	db.collection('assignments').find({stack:stack}).toArray(function (err, items) {
		console.log(items[0])
		var assignments = items[0];
			total = assignments.copy.readers.length+1;
		update["$addToSet"][field]=reader;
		console.log(update)
		db.collection('assignments').update( {stack:stack}, update, function(err, result) {
			if (err) { res.send(err); console.log(err) };
			if (result) { res.send(true); };
		});
		db.collection('assignments').update( {stack:stack}, {$set:{"copy.total":total}}, function(err, result) {
			if (err) { res.send(err); console.log(err) };
		});
	});	
});

router.post('/readers/remove', function(req, res) {
	var db = req.db,
		stack = req.body.stack,
		update = {$pull:{ "copy.readers":{ "username":req.body.username }}};
	db.collection('assignments').find({stack:stack}).toArray(function (err, items) {
		var assignments = items[0];
			total = assignments.copy.readers.length-1;
		db.collection('assignments').update( {stack:stack}, update, function(err, result) {
			if (err) { res.send(err); console.log(err) };
			if (result) { res.send(true); };
		});
		db.collection('assignments').update( {stack:stack}, {$set:{"copy.total":total}}, function(err, result) {
			if (err) { res.send(err); console.log(err) };
		});
	});	
});

module.exports = router;
