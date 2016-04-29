//emailutil.js
//User defined functions for sending emails
var request = require('request');
var azureURI = 'https://prod-05.northcentralus.logic.azure.com:443/workflows/a87305cecf5646229d210e7ef8fa37ec/triggers/manual/run?api-version=2015-08-01-preview&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=_oIBOf7amPzJKL9tX-f0frn6kpy4M4ISexTRq5OIE3Y';

module.exports = {

	//sends email notification
	//email is the SR creator's email
	//action is either Approve, Cancelled, In Progress, Complete
	sendEmail: function(email, action, user, id){

		var emailBody = {
			'SendEmail_To': email,
			'SendEmail_Body': 'This email is an automated notification regarding SR# ' + id + '. '
				+ user + ' submitted a change: ' + action + '. Check the SR details and comments for further details. '
				+ 'This mailbox is not being monitored, please do not reply to this email'
		};


		//Lets configure and request
		request({
		    url: azureURI, //URL to hit
		    //qs: {from: 'blog example', time: +new Date()}, //Query string data
		    method: 'POST',
		    //Lets post the following key/values as form
		    json: emailBody
		}, function(error, response, body){
		    if(error) {
		        console.log(error);
		    } else {
		        console.log(response.statusCode, body);
		}
		});

		/*



		request(
		  { method: 'POST'
		  , uri: azureURI
		  , multipart:
		    [ { 'content-type': 'application/json'}
		    , { body: emailBody }
		    ]
		  }
		, function (error, response, body) {
		    if(!error){
		      console.log('email sent');
		    } else {
		      console.log('error has occurred');
		    }
		  }
		)
*/
	}

	

}