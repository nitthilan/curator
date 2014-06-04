var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


var articleSchema = new Schema({
	title: {type: String, required:true, trim:true, index:true, unique:true},
	description: String,
	createdDate: { type: Date, default: Date.now },
	lastSavedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notes',articleSchema);