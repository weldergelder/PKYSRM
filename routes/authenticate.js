var express = require('express');
var router = express.Router();

module.exports = function(passport){

	//sends successful login state back to angular
	router.get('/success', function(req, res){
		res.send({state: 'success', user: req.user ? req.user : null});
	});

	//sends failure login state back to angular
	router.get('/failure', function(req, res){
		res.send({state: 'failure', user: null, message: "Invalid username or password"});
	});

	router.get('/successsignup', function(req, res){
		res.send({state: 'success', message: "User created successfully"});
	});

	router.get('/failuresignup', function(req, res){
		res.send({state: 'failure', message: "Username already exists"});
	});

	//log in
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure'
	}));

	//sign up
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/auth/successsignup',
		failureRedirect: '/auth/failuresignup'
	}));

	//log out
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;

}