MyAppControllers.controller('homeCtrl', ['$scope', '$timeout', '$resource', '$location', 
	'appMapperService',
	function($scope, $timeout, $resource, $location, appMapperService) {
		$scope.changeLocation = function(newPath){
			$location.path(newPath);
		};
		$scope.chatInfoList = appMapperService.getChatListForAppHome();
}]);