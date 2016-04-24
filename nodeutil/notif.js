//notif.js

module.exports = {

	errorMessage: function(){
		return {message: 'Error has occurred, try again later'};
	},

	passwordChange: function(){
		return {message: 'Password changed succcessfully'};
	},

	loginError: function(){
		return {message: 'Invalid Username or Password'};
	},

	userExists: function(){
		return {message: 'User already exists'};
	},

	userCreated: function(){
		return {message: 'User created successfully'};
	}

}