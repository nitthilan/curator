MyAppControllers.controller('addFriendCtrl', ['$scope', '$location', 
	'$timeout', 'FriendListService', '$resource',
	function($scope, $location, $timeout, FriendListService, $resource) {

		$scope.changeLocation = function(newPath){
			$location.path(newPath);
		};

		var testUserList = [
			{id:0, email:"nitthilan@gmail.com"},
			{id:1, email:"anitthilan1@gmail.com"},
			{id:2, email:"bnitthilan2@gmail.com"},
			{id:3, email:"cnitthilan3@gmail.com"},
			{id:4, email:"dnitthilan4@gmail.com"},
			{id:5, email:"enitthilan5@gmail.com"},
			{id:6, email:"fnitthilan6@gmail.com"},
			{id:7, email:"gnitthilan7@gmail.com"},
			{id:8, email:"hnitthilan8@gmail.com"},
			{id:9, email:"initthilan9@gmail.com"},
			{id:10, email:"jnitthilan0@gmail.com"},
		];

		$scope.searchUserList = [];
		$scope.selectedUser = [];
		$scope.isUserAlreadyPresent = false;

		$scope.searchUser = function(searchString){
			if(!searchString || searchString.length === 0){
				return;
			}
			var searchQuery = $resource('user/search', {}, 
			{ search: {method:'GET', isArray: true, params:{emailPattern:searchString}} });
			
			$scope.searchUserList = searchQuery.search();
			$scope.searchString = null;
		};
		$scope.searchUserEnter = function($event){
			//console.log("Enter event trigger "+JSON.stringify($event));
			$scope.searchUser($scope.searchString);
		};
		$scope.selectUser = function(index){
			var user = $scope.searchUserList[index];
			if(FriendListService.isUserPresent(user)) {
				$scope.isUserAlreadyPresent = true;
				return;
			}
			$scope.selectedUser = user;
		};
		$scope.confirmSelection = function(){
			FriendListService.addFriend($scope.selectedUser);
		};
		$scope.resetSelection = function(){
			$timeout(function(){
				$scope.isUserAlreadyPresent = false;
			}, 500);
		};
}]);