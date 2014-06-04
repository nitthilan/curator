MyAppServices.service('FriendListService', ['$filter', function($filter){
	'use strict';
	var friendList = [];	

	this.isUserPresent = function(user){
		//console.log("The filteroutput"+JSON.stringify($filter('filter')(friendList, user).length !== 0));
		return ($filter('filter')(friendList, user._id).length !== 0);
	};
	this.addFriend = function(user){

		if(!this.isUserPresent(user)){
			friendList.push(user);
			//console.log("Current friend list "+JSON.stringify(friendList));
		}
	};

	this.getFriendList = function(){
		return friendList;
	};
}]);