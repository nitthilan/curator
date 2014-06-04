var mongoose = require('mongoose');
var Channel = mongoose.model('Channel');
var Article = mongoose.model('Article');
module.exports = function(app, auth, config, baseUrl){
	var log = require(config.root+'./setup/log.js').appLogger;
	var rest_validation = require(config.root+'./curator/rest_validation.js');
	var resourceUrl = baseUrl+"/query"; 
	var resourceUrlConfig = {
		url:resourceUrl, validation: {
    	channelId: { isRequired: false, isHexadecimal: true, scope: 'params' },
    	categories: { isRequired: false, scope: 'params' },
    	isLike: { isRequired: false, isIn: ['true','false'], scope: 'params' },
    	isRead: { isRequired: false, isIn: ['true','false'], scope: 'params' },
    	readLater: { isRequired: false, isIn: ['true','false'], scope: 'params' }
	}};
	// getting the list of all subscriptions
	app.get(resourceUrlConfig, 
		/*auth.requiresLogin,*/ 
		rest_validation.validateGet,
		function(req, res, next){
			var query = {};
			if(req.params.channelId) query["channelId"] = req.params.channelId;
			if(req.params.categories) query["categories"] = req.params.categories;
			if(req.params.isLike) query["isLike"] = req.params.isLike;
			if(req.params.isRead) query["isRead"] = req.params.isRead;
			if(req.params.readLater) query["readLater"] = req.params.readLater;
			log.info("Article Query "+JSON.stringify(query));
			Article.find(query, '', 
				function(error, data){
			//log.info("Query "+query);
			if(error) return callback(error);
			else if(data.length == 0) return res.send(new Error("No matching subscriptions:"+JSON.stringify(query)));
			else res.send(data);
			next();
		});
	});
}