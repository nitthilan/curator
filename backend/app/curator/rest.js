var restify = require('restify');
var mongoose = require('mongoose');

module.exports = function(app, auth, baseUrl, config){
  var log = require(config.root+'./setup/log.js').appLogger;
  var Channel = mongoose.model('Channel');
  var rest_validation = require(config.root+'./curator/rest_validation.js');
  var channelUrl = baseUrl+"/channels";
  var sendResponse = function(res, next){
	return function(error, data){
		if(error) res.send(error);
		else if(data === null ) res.send (new Error("no data for given id"));
		else res.send(data);
		next();
	};
  }
  // getting the list of all subscriptions
  app.get(channelUrl, 
  	/*auth.requiresLogin,*/ 
  	rest_validation.validateGet,
  	function(req, res, next){ 
  		Channel.find({}, '', function(error, data){
			//log.info("Query "+query);
			if(error) return callback(error);
			else if(data.length == 0) return res.send(new Error("No matching subscriptions:"+JSON.stringify(query)));
			else res.send(data);
			next();
		});
  	});
  // Channel
  app.post(channelUrl, 
  	/*auth.requiresLogin,*/ 
  	rest_validation.validatePost,
  	function(req, res, next){ Channel.create(req.params.info, sendResponse(res, next)); });
  app.put(rest_validation.getIdUrlConfig(channelUrl), 
  	/*auth.requiresLogin,*/ 
  	rest_validation.validatePost,
  	function(req, res, next){ 
  		Channel.findByIdAndUpdate(req.params.id, req.params.info, sendResponse(res, next)); 
  	});
  app.get(rest_validation.getIdUrlConfig(channelUrl), 
  	/*auth.requiresLogin,*/ 
  	rest_validation.validateGet,
  	function(req, res, next){ Channel.findById(req.params.id, sendResponse(res, next)); });
   app.del(rest_validation.getIdUrlConfig(channelUrl), 
  	/*auth.requiresLogin,*/ 
  	function(req, res, next){ Channel.findByIdAndRemove(req.params.id, sendResponse(res, next)); });
	  app.post(channelUrl+"/xmlUrls", /*auth.requiresLogin, */
	  	function(req,res){
	    res.send(req.params);
	  });
}
