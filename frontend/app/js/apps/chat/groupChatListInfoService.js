MyAppServices.service('groupChatListInfoService', [function(){
	'use strict';
	/*
	groupChatList = [
		{
			groupInfo:{
				id: identifier for the group,
				name: group name,
				friendList: [userInfo],
				owner: owner userInfo,
			}
			read_messages:[
			],
			unread_messages:[
			]
		},
	];
	*/
	var groupChatListInfoService = [];
	this.isGroupPresent = function(groupId){
		//console.log("The filteroutput"+JSON.stringify($filter('filter')(friendList, user).length !== 0));
		return ($filter('filter')(groupChatListInfoService, groupId).length !== 0);
	};
	this.addNewGroup = function(group){
		groupChatListInfoService.push({
			groupInfo:group,
			read_messages:[],
			unread_messages:[
				{
					from:"nitthilan@gmail.com",
					message:"Hi! How are you?"
				}
			]
		});
	};
	this.getGroupChatList = function(){
		return groupChatListInfoService;
	};
}]);