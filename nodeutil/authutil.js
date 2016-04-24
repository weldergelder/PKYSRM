//authutil.js
//User defined functions for authentication and user creation

var bCrypt = require('bcrypt-nodejs');


module.exports = {

	//checks if the password is valid
	isValidPassword: function(user, password){
		return bCrypt.compareSync(password, user.password);
	},


	//creates a hash for the password
	createHash: function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	}

}