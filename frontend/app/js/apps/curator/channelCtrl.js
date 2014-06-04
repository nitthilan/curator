MyAppControllers.controller('channelCtrl', ['$scope', '$http', '$location',
    function($scope, $http, $location) {

    // test data: js/apps/curator/channel_list.json
	$http.get('/curator/channels').success(function(data) {
		$scope.channelList = data;
	});

	var filterCategories = function(data) {
		$scope.categories = [];
		for (index = 0; index < data.length; ++index) {
			$scope.categories.push(data[index]._id);
		}
		$scope.select2Options = {
			'multiple': true,
			'simple_tags': true,
			'tags': $scope.categories
		};		
		//$scope.$apply();
	};
	// test data: ['uncategorised', 'math', 'technology', 'cinema', 'digg', 'blogger-following', 'photography'];
	$http.get('/curator/categories').success(filterCategories);

	$scope.vewArticle = function(subscription){
		//ShareArticleList.set(subscription);
		$location.path("/article");
	};
	$scope.list_of_string = ['uncategorised'];


	$scope.addCategory = function(newCategory){
		$http.post('/curator/categories', {info:{_id:newCategory}}).success(function(data){
			$http.get('/curator/categories').success(filterCategories);
			$scope.newCategory = null;
		});
	};
	$scope.deleteCategory = function(category){
		$http.delete('/curator/categories/'+category).success(function(data){
			$http.get('/curator/categories').success(filterCategories);
		});
		//console.log("delete response"+response);
	};
	$scope.saveChannel = function(channel){
		//$scope.editCategory = !$scope.editCategory;
		console.log("save channel "+JSON.stringify(channel));
		$http.put('/curator/channels/'+channel._id, {info:{categories:channel.categories}}).error(function(data){
			$http.get('/curator/channels').success(function(data) {
				$scope.channelList = data;
			});
		});
	};
	$scope.updateAllChannels = function(){
		$http.post('/curator/channels/update', {}).success(function(data){
			console.log(data);
		});		
	};

}]);