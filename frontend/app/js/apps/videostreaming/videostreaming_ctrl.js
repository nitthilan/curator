MyAppControllers.controller('videostreaming_ctrl', [ '$scope','$http','$timeout', '$filter', function($scope, $http, $timeout, $filter) {
	$scope.video_src = "tbd/output1.webm";

	var switchvideo = function(){
		var temp = $scope.video_src;
		$scope.video_src = next_video;
		next_video = temp;
		$timeout(switchvideo, 1000);
	};
	var next_video = "tbd/output.webm";
	$timeout(switchvideo, 1000);
}]);