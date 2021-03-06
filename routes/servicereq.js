var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var ServiceRequest = mongoose.model('ServiceRequest');
var User = mongoose.model('User');
var emailutil = require('../nodeutil/emailutil.js');
var moment = require('moment');



router.route('/')
	//creates a new SR
	.post(function(req, res){

		var newSR = new ServiceRequest();

		newSR.id = req.body.sr_department.substring(0, 3) + moment().year().toString() + moment().date().toString() + moment().hour().toString()
				 + moment().minute().toString() + moment().second().toString();
		newSR.sr_department = req.body.sr_department;
		newSR.sr_title = req.body.sr_title;
		newSR.created_by = req.body.sr_currentUser;
		newSR.resolve_by = moment().add(req.body.sr_eta, 'days');
		newSR.sr_details = req.body.sr_details;
		if(req.body.sr_privilege_level == 1)
			newSR.status = 'Pending';

		var newLog = {'log_by': req.body.sr_currentUser, 'log_detail': 'create'};
		newSR.log.push(newLog);

		newSR.save(function(err, newSR) {
			if (err)
				return res.send({message: "Error has occurred, please contact your administrator"});
			return res.send({message: "Service Request submitted successfully", state: "success"});
		});
		
	});

router.route('/:currentUser')
		//gets catalogue items made by a single user
	.get(function(req, res){
		ServiceRequest.find({'created_by': req.params.currentUser}, function(err, allSR){
			if(err){
				res.setHeader('Cache-Control', 'no-cache');
				return res.send(err);
			}
			res.setHeader('Cache-Control', 'no-cache');
			return res.send(200,allSR);
		});
	});

router.route('/list/:user/:department')
	//gets list of SRs for privileged users and service providers
	.get(function(req, res){
		if(req.params.user == 'mgr'){
			ServiceRequest.find({'sr_department': req.params.department, 'status': 'Pending'}, function(err, allSR){
				if(err){
					res.setHeader('Cache-Control', 'no-cache');
					return res.send(err);
				}
				res.setHeader('Cache-Control', 'no-cache');
				return res.send(200,allSR);
			});
		}

		else{
			if(req.params.user == 'provider'){
				ServiceRequest.find({'sr_department': req.params.department, $or: [ { 'status': 'Created'}, { 'status': 'In Progress'}]}, function(err, allSR){
					if(err){
						res.setHeader('Cache-Control', 'no-cache');
						return res.send(err);
					}
					res.setHeader('Cache-Control', 'no-cache');
					return res.send(200,allSR);
				});
			}
			else{
				res.setHeader('Cache-Control', 'no-cache');
				res.send({message: "Insufficient credentials"});
			}
		}
	});

//adding a new comment
router.route('/comment/:id')
	.post(function(req, res){
		ServiceRequest.findOne({'id': req.params.id}, function(err, sr){
			if(err)
				res.send(err);
			newComment = {'com_by': req.body.currentUser, 'com_text': req.body.commentText};
			sr.comments.push(newComment);
			sr.save(function(err, sr){
				if(err)
					res.send(err);
				return res.send(sr);
			});
		});
	});


//catalogue item specific functions
router.route('/item/:id')
	//gets specified catalogue item with given id
	.get(function(req, res){
		ServiceRequest.findOne({'id': req.params.id}, function(err, sr){
			if(err){
				res.setHeader('Cache-Control', 'no-cache');
				res.send(err);
			}
			res.setHeader('Cache-Control', 'no-cache');
			res.send(200, sr);
		});
	})


	.post(function(req, res){
		//Changing the state of the SR
		ServiceRequest.findOne({'id': req.params.id}, function(err, sr){
			if(err)
				res.send(err);
			var newLog = {'log_by': req.body.currentUser, 'log_detail': req.body.newState};
			sr.log.push(newLog);
			if(req.body.newState == "Approved")
				sr.status = "Created";
			else
				sr.status = req.body.newState;

			sr.save(function(err, sr){
				if(err)
					res.send(err);
				User.findOne({'username': sr.created_by}, function(err, user){
					if(err)
						res.send(err);
					emailutil.sendEmail(user.email, req.body.newState, req.body.currentUser, req.params.id);
					res.send({message: "Status changed successfully"});
				});
			});
		});
	});

	
module.exports = router;