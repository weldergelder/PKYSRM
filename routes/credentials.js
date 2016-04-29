var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var User = mongoose.model('User');
var authutil = require('../nodeutil/authutil.js');
var bCrypt = require('bcrypt-nodejs');

router.route('/')
	
	//gets all users and sends them to the frontend
	.get(function(req, res){
		User.find(function(err, allUsers){
			if(err){
				return res.send(500, err);
			}
			res.setHeader('Cache-Control', 'no-cache');
			return res.send(200,allUsers);
		});
	});

router.route('/pwd')

	.put(function(req, res){
		User.findOne({'username': req.body.username}, function(err, user){
			if(err)
				res.send({message: 'Error has occurred, try later'});
			user.password = bCrypt.hashSync(req.body.password, bCrypt.genSaltSync(10), null);
			var newLog = {log_by: req.body.currentUser, log_detail: 'Password Change'};
			user.log.push(newLog);
			user.save(function(err, user){
				if(err)
					res.send({message: 'Error has occurred, try later'});
				res.json(user);
			});
		}); 
	});


//catalogue item specific functions
router.route('/:username')
	//gets specified catalogue item
	.get(function(req, res){
		User.findOne({'username': req.params.username}, function(err, user){
			if(err)
				res.send({message: 'Error has occurred, please try later'});
			user.save(function(err, user){
				if(err)
					res.send({message: 'Error has occurred, please try later'});
			})
			res.setHeader('Cache-Control', 'no-cache');
			res.send(user);
		});
	}) 
	//updates specified catalogue item
	.put(function(req, res){
		User.findOne({'username': req.params.username}, function(err, user){
			if(err)
				res.send({message: 'Error has occurred, please try later'});

			user.department = req.body.department;
			user.privilege = req.body.privilege;
			user.provider = req.body.provider;
			user.first_name = req.body.first_name;
			user.last_name = req.body.last_name;
			user.email = req.body.email;
			var newLog = {log_by: req.body.currentUser, log_detail: 'Edit'};
			user.log.push(newLog);
			user.save(function(err, user){
				if(err)
					res.send({message: 'Error has occurred, please try later'});

				res.json(user);
			});
		});
	})
	//deletes the post
	.delete(function(req, res) {
		User.remove({
			username: req.params.username
		}, function(err) {
			if (err)
				res.send(err);
			res.json('User Removed');
		});
	});

module.exports = router;