var restify = require('restify');
var mongoose = require('mongoose');

module.exports = function(app, auth, config, resourceUrl, model){
  var log = require(config.root+'./setup/log.js').appLogger;
  //var model = mongoose.model('Categories');
  var rest_validation = require(config.root+'./curator/rest_validation.js');
  //var resourceUrl = baseUrl+"/category";

  var sendResponse = function(res, next){
	return function(error, data){
		if(error) res.send(error);
		else if(data === null ) res.send (new Error("no data for given id"));
		else res.send(data);
		next();
	};
  }
  // getting the list of all subscriptions
  app.get(resourceUrl, 
  	/*auth.requiresLogin,*/ 
  	rest_validation.validateGet,
  	function(req, res, next){ 
  		model.find({}, '', function(error, data){
			//log.info("Query "+query);
			if(error) return callback(error);
			else if(data.length == 0) return res.send(new Error("No matching subscriptions:"+JSON.stringify(query)));
			else res.send(data);
			next();
		});
  });

  app.post(resourceUrl, 
  	/*auth.requiresLogin,*/ 
  	rest_validation.validatePost,
  	function(req, res, next){ model.create(req.params.info, sendResponse(res, next)); });

  var idUrlConfig = { url : resourceUrl+"/:id", validation : { id:{ isRequired:true, scope:'params' } } }  
  app.put(idUrlConfig, 
  	/*auth.requiresLogin,*/ 
  	rest_validation.validatePost,
  	function(req, res, next){ 
  		model.findByIdAndUpdate(req.params.id, req.params.info, sendResponse(res, next)); 
  	});

  app.get(idUrlConfig, 
  	/*auth.requiresLogin,*/ 
  	rest_validation.validateGet,
  	function(req, res, next){ model.findById(req.params.id, sendResponse(res, next)); });
   app.del(idUrlConfig, 
  	/*auth.requiresLogin,*/ 
  	function(req, res, next){ model.findByIdAndRemove(req.params.id, sendResponse(res, next)); });
}
