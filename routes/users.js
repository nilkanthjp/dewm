var express = require('express');
var router = express.Router();

/* POST to login user. */
router.post('/login', function(req, res) {
	var db = req.db;
	db.collection('userlist').find( {username:req.body.username, password:req.body.password} ).toArray(function(err, result) {
		if (result.length>0) {
			req.session.username = req.body.username;
			req.session.fname = result[0].fname;
			req.session.lname = result[0].lname;
			req.session.access = result[0].access;
			req.session.active = true;
			req.session.current = dewm.latest;
			req.session.save();
			res.send(true);
			console.log(result[0].fname+" logged in.");
       } else {
       		res.send({msg:"Username or password not found.",status:false});
       		res.end();
       }
   });
});

router.post('/add', function(req, res) {
	var db = req.db;
	db.collection('userlist').insert( req.body, function(err, result) {
		if (err) { res.send(err) };
		if (result) { console.log('Added!'); res.send(true); };
	});
});

router.put('/edit', function(req, res) {
	var db = req.db;
	var update = req.body;
	var key = req.body.key;
	delete update.key;
	db.collection('userlist').update( { username:key }, { $set:update }, function(err, result) {
		if (err) { res.send(err) };
		if (result) { console.log('Updated '+key); res.send(true); };
	});
});

router.get('/userlist', function(req, res) {
	if (req.session.access === 0) {	
		var db = req.db;
		db.collection('userlist').find({},{ "password":false }).toArray(function (err, items) {
			res.json(items);
		});
	} else {
		res.render('error', { error: {status: "Access Denied", message: "Come at me, bro." }});
	}
});

router.get('/user/:id*', function(req, res) {
	if (req.session.access === 0) {
		var db = req.db;
		db.collection('userlist').find({username:req.param('id')}).toArray(function (err, items) {
			res.json(items[0])
		});		
	} else {
		res.render('error', { error: {status: "Access denied", message: "Come at me, bro." }});
	}
});

router.get('/logout', function(req, res) {
	var db = req.db;
	req.session.username = null;
	req.session.fname = null;
	req.session.lname = null;
	req.session.access = null;
	req.session.active = false;
	req.session.save();
	res.redirect("/")
});

module.exports = router;