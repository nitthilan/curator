MyAppControllers.controller('createGroupCtrl', ['$scope', '$filter', 'FriendListService', 
	'deviceUserInfoService', 'groupChatListInfoService', '$location',
	function($scope, $filter, FriendListService, deviceUserInfoService, 
		groupChatListInfoService, $location) {
		//| filter:searchString | orderBy:'email'
	$scope.changeLocation = function(newPath){
			$location.path(newPath);
	};
	$scope.friendList = FriendListService.getFriendList();
	$scope.groupFriendList = [];
	$scope.groupName = null;
	$scope.addToGroup = function($index, isSelected){
		var filteredFriendList = $filter('filter')(FriendListService.getFriendList(), 
			$scope.searchString);
		var orderedFriendList = $filter('orderBy')(filteredFriendList, 'email');
		$scope.friendList = orderedFriendList;
		var friend = $scope.friendList[$index];
		/*console.log("Selected friend "+JSON.stringify(friend)+" "+$index+" "+
			JSON.stringify($scope.friendList)+" "+JSON.stringify(orderedFriendList));*/
		if(isSelected){
			$scope.groupFriendList.push(friend);
		}
		else{
			var index = $scope.groupFriendList.indexOf(friend);
			if (index > -1) {
				$scope.groupFriendList.splice(index, 1);
			}
		}
		//console.log("The selected list "+JSON.stringify($scope.groupFriendList));
	};
	$scope.createGroup = function(groupName){
		var user = deviceUserInfoService.getUser();
		// Get a id for the group from the server
		// Form the group object and store
		var groupInfo = {
			id:user.email+$scope.groupName,
			name:$scope.groupName,
			friendList:$scope.groupFriendList,
			owner:user
		};
		groupChatListInfoService.addNewGroup(groupInfo);
		console.log("Added group info "+JSON.stringify(groupInfo));
	};
}]);