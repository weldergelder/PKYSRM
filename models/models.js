var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	username: String,
	password: String, //hash created
	created_on: {type: Date, default: Date.now},
	department: String,
	privilege: {type: Number, default: 0},
	provider: {type: Number, default: 0},
	first_name: String,
	last_name: String,
	log: [{ log_date: {type: Date, default: Date.now},
		log_by: String,
		log_detail: String}]
});

var catalogueSchema = new mongoose.Schema({
	department: String,
	subcategories: [{sub_category: String,
		titles: [{
			title: String,
			detail: String,
			privilege_level: {type: Number, default: 0},
			eta: {type: Number, default: 3}
		}] }]
});


var serviceRequestSchema = new mongoose.Schema({
	created_by: String,
	created_on: {type: Date, default: Date.now},
	status: {type: String, default: 'Created'},
	sr_title: String,
	approval: Number,
	sr_details: String,
	sr_department: String,
	resolve_by: Date,
	comments: [{com_date: {type: Date, default: Date.now}, 
		com_by: String,
		com_text: String}],
	log: [{ log_date: {type: Date, default: Date.now},
		log_by: String,
		log_detail: String}]
})
var postSchema = new mongoose.Schema({
	text: String,
	created_by: String,
	created_at: {type: Date, default: Date.now}
});


mongoose.model("Post", postSchema);
mongoose.model("User", userSchema);
mongoose.model("Catalogue", catalogueSchema);
mongoose.model("ServiceRequest", serviceRequestSchema);