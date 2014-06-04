MyAppServices.service('deviceUserInfoService', ['localStorageService', 
	function(localStorageService){
	'use strict';
	/*
	*/
	//var deviceUserInfo = {};
	this.addUser = function(user){
		localStorageService.add('deviceUserInfo', user);
	};
	this.getUser = function(){
		return localStorageService.get('deviceUserInfo');
	};
}]);