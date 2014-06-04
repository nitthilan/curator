MyAppControllers.controller('articleCtrl', ['$scope','$http','$timeout',
	function($scope, $http, $timeout) {

	$scope.select2Options = {
        allowClear:true
    };

	// test data: ['uncategorised', 'math', 'technology', 'cinema', 'digg', 'blogger-following', 'photography'];
	$http.get('/curator/categories').success(function(data) {
		$scope.categories = data;
	});
	$scope.addCategory = function(newCategory){
		$http.post('/curator/categories', {info:{_id:newCategory}}).success(function(data){
			$http.get('/curator/categories').success(function(data) { $scope.categories = data;	});
			$scope.newCategory = null;
		});
	};
	$scope.deleteCategory = function(category){
		$http.delete('/curator/categories/'+category._id).success(function(data){
			$http.get('/curator/categories').success(function(data) { $scope.categories = data;	});
		});
		//console.log("delete response"+response);
	};

	$http.get('/curator/channels').success(function(data) {
		$scope.channelList = data;
	});
	$scope.showChannel = true;
	$scope.addChannelPlaceholder = "Add channel";
	$scope.addChannel = function(feedUrl){
		$http.post('/curator/channels/feedUrl', {info:{feedUrl:feedUrl}}).success(function(data){
			console.log(data);
			$scope.addChannelPlaceholder = "Channel added successfully";
			$timeout(function(){
				$scope.addChannelPlaceholder = "Add channel";
			}, 5000);
		}).error(function(err){
			console.log(err);
			$scope.addChannelPlaceholder = "Failed to add channel";
			$timeout(function(){
				$scope.addChannelPlaceholder = "Add channel";
			}, 5000);			
		});
		$scope.feedUrl = null;
		$scope.addChannelPlaceholder = null;
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
	$scope.channelToBeDeleted = null;
	$scope.chooseChannelToBeDeleted = function(channel){
		$scope.channelToBeDeleted = channel;
	};
	$scope.deleteChannel = function(){
		//$scope.editCategory = !$scope.editCategory;
		console.log("save channel "+JSON.stringify($scope.channelToBeDeleted));
		$http.delete('/curator/channels/'+$scope.channelToBeDeleted._id).success(function(data){
			$http.get('/curator/channels').success(function(data) {
				$scope.channelList = data;
			});
		});
		$scope.channelToBeDeleted = null;
	};

	

	//
	$scope.isLike = false;
	$scope.isRead = false;
	$scope.readLater = false;

	$scope.getArticles = function(){
		var query_string = '?isLike='+$scope.isLike+'&isRead='+$scope.isRead+'&readLater='+$scope.readLater;
		if($scope.selectedCategory) query_string += '&categories='+$scope.selectedCategory;
		if($scope.selectedChannel) query_string += '&channelId='+$scope.selectedChannel;
		//console.log("Query for get article"+query_string);
		$http.get('/curator/articles/query'+query_string).success(function(data) {
			$scope.articleList = data;
		});
	};
	$scope.saveArticle = function(article, updateKeyValue){
		$http.put('/curator/articles/'+article._id, {info:updateKeyValue}).error(function(err) {
			console.log("error saving article "+err);
		});		
	};
	$scope.updateAllChannels = function(){
		$http.post('/curator/channels/update', {}).success(function(data){
			console.log(data);
		});		
	};
	$scope.addArticlePlaceholder = "Add article";
	$scope.addArticle = function(articleUrl){
		$http.post('/curator/channels/articleUrl', {info:{articleUrl:articleUrl}}).success(function(data){
			console.log(data);
			$scope.addArticlePlaceholder = "Article added successfully";
			$timeout(function(){
				$scope.addArticlePlaceholder = "Add article";
			}, 5000);
		}).error(function(err){
			console.log(err);
			$scope.addArticlePlaceholder = "Failed to add article";
			$timeout(function(){
				$scope.addArticlePlaceholder = "Add article";
			}, 5000);			
		});
		$scope.articleUrl = null;
		$scope.addArticlePlaceholder = null;
	};
}]);