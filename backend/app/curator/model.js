var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var categorySchema = new Schema({
	_id:{type: String, required:true, trim:true, index:true, unique:true, lowercase:true}
});
var articleSchema = new Schema({
	title: {type: String, required:true, trim:true},
	description: String,
	gist: String,
	imageUrl: String,
	pubDate: { type: Date, default: Date.now },
	link: {type: String, required:true, trim:true, index:true, unique:true},
	author: String,
	categories : {type:[{type:String, trim:true, lowercase:true}], default:["nonchannel"]},
	channelId: Schema.Types.ObjectId,
	isRead :{type: Boolean, default: false},
	isLike :{type: Boolean, default: false},
	readLater :{type: Boolean, default: false}
});
var channelSchema = new Schema({
	title: {type: String, required:true, trim:true, index:true, unique:true},
    feedUrl: {type: String, required:true, trim:true, index:true, unique:true},
    siteUrl: {type: String, required:true, trim:true},
    categories: {type:[{type:String, trim:true, lowercase:true}], default:["uncategorised"]},
    lastUpdatedDate: { type: Date, default: Date.now },
    numQueryFailures: {type: Number, default: 0},
    numArticles: {type: Number, default: 0}
});

module.exports = mongoose.model('Article',articleSchema);
module.exports = mongoose.model('Channel',channelSchema);
module.exports = mongoose.model('Categories',categorySchema);