MyAppServices.service('appMapperService', ['groupChatListInfoService',
	function(groupChatListInfoService){
	'use strict';

	this.getChatListForAppHome = function(){
		var groupChatList = groupChatListInfoService.getGroupChatList();
		console.log("group chat list "+JSON.stringify(groupChatList));
		var appInfoList = [];
		for(var x in groupChatList){
			if(groupChatList[x].unread_messages.length !== 0){
				var appInfo = {};
				appInfo.name = groupChatList[x].groupInfo.name;
				appInfo.numUnreadMessages = groupChatList[x].unread_messages.length;
				appInfoList.push(appInfo);				
			}
		}
		return appInfoList;
	};
}]);