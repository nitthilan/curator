var restify = require('restify');
exports.validateGet = function(req, res, next){
  if(!req.accepts("application/json")){
    next(new restify.InvalidHeaderError('Accept header should be application/json'));
  }
  next();
}
exports.validatePost = function(req, res, next){
  if(!req.accepts("application/json")){
    return next(new restify.InvalidHeaderError('Accept header should be application/json'));
  }
  if(!req.is("application/json")){
    return next(new restify.InvalidContentError('Content type should be application/json'));
  }
  next();
}
