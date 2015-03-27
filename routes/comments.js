var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');

router.get('/', function(req, res) {
	if (req.session.access === 0) {
		var db = req.db,
			stack = req.param('s'),
			type = req.param('d');
		db.collection('comments').find({stack:stack, type:type}).toArray(function (err, items) {
			var usernames = [];
			for (var i=0; i<items.length; i++) {
				usernames.push(items[i].username);
			}
			db.collection('userlist').find({username:{ $in: usernames }}).toArray(function (err, users) {
				var usernameDict = {};
				for (var i=0; i<users.length; i++) {
					usernameDict[users[i].username] = users[i].fname+" "+users[i].lname;
				};
				for (var i=0; i<items.length; i++) {
					items[i].name = usernameDict[items[i].username];
				};
				res.json(items);
			});
		});		
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
		update = {status:req.body.status},
		key = new mongo.BSONPure.ObjectID(req.body._id);
	db.collection('comments').update( { _id:key }, { $set:update }, function(err, result) {
		if (err) { res.send(err) };
		if (result) { console.log('Updated comment with id: '+key); res.send(true); };
	});
});

module.exports = router;