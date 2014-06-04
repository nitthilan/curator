MyAppServices.service('ShareArticleList', [ function(){
	'use strict';
	var subscription = [];
	this.set = function(subscription){
		this.subscription = subscription;
	};
	this.get = function(){
		return this.subscription;
	};
}]);