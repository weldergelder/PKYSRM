var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var ServiceRequest = mongoose.model('ServiceRequest');

var moment = require('moment');
//moment().format("YYYY-MM-DD");



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
/*

	//gets all catalogue items
	.get(function(req, res){
		ServiceRequest.find(function(err, allSR){
			if(err){
				return res.send(err);
			}
			return res.send(200,allSR);
		});
	});


router.route('/comment/:id')
	.post(function(req, res){
		ServiceRequest.findOne({'_id': req.params.id}, function(err, sr){
			if(err)
				res.send(err);
			newComment = {'com_by': req.body.currentUser, 'com_text': req.body.commentText}
			sr.comments.push(newComment);
			sr.save(function(err, sr){
				if(err)
					res.send(err);
				return res.json(sr);
			});
		});
	});



//catalogue item specific functions
router.route('/:id')
	//gets specified catalogue item
	.get(function(req, res){
		ServiceRequest.findOne({'_id': req.params.id}, function(err, sr){
			if(err)
				res.send(err);
			res.json(sr);
		});
	}) 
	//updates specified catalogue item
	.put(function(req, res){
		ServiceRequest.findOne({'_id': req.params.id}, function(err, sr){
			if(err)
				res.send(err);

			sr.sr_department = req.body.sr_department;
			sr.sr_title = req.body.sr_title;
			sr.title = req.body.title;
			sr.status = req.body.status;
			sr.approval = req.body.approval;
			sr.resolve_by = req.body.resolve_by;
			sr.sr_details = req.body.sr_details;
			var newLog = {log_by: req.body.currentUser, log_detail: 'change'};
			sr.log.push(newLog);
			sr.save(function(err, sr){
				if(err)
					res.send(err);

				res.json(sr);
			});
		});
	})
	//deletes the post
	.delete(function(req, res) {
		ServiceRequest.remove({
			_id: req.params.id
		}, function(err) {
			if (err)
				res.send(err);
			res.json('Service Request Deleted');
		});
	});
*/
module.exports = router;