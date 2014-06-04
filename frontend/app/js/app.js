
window.routes =
{
  "/login": {
    templateUrl: 'partials/login.html', 
    controller: 'loginCtrl', 
    requireLogin: false
  },
  "/home": {
    templateUrl: 'partials/home.html', 
    controller: 'homeCtrl', 
    requireLogin: true
  },
  "/add_friend": {
    templateUrl: 'partials/add_friend.html', 
    controller: 'addFriendCtrl', 
    requireLogin: true
  },
  "/create_group": {
    templateUrl: 'partials/create_group.html', 
    controller: 'createGroupCtrl', 
    requireLogin: true
  },
  "/chat": {
    templateUrl: 'partials/chat.html', 
    controller: 'chatCtrl', 
    requireLogin: true
  },
  "/curator": {
    templateUrl: 'js/apps/curator/channel_view.html', 
    controller: 'channelCtrl', 
    requireLogin: true
  },
  "/article": {
    templateUrl: 'js/apps/curator/article_view.html', 
    controller: 'articleCtrl', 
    requireLogin: true
  },
  "/notes": {
    templateUrl: 'js/apps/notes/notes_view.html', 
    controller: 'notesCtrl', 
    requireLogin: true
  },
  "/videostreaming": {
    templateUrl: 'js/apps/videostreaming/videostreaming_view.html', 
    controller: 'videostreaming_ctrl', 
    requireLogin: true
  }
};
// Declare app level module which depends on filters, and services
var MyApp = angular.module('myApp', ['btford.socket-io', 'myApp.services', 'myApp.directives', 
                            'myApp.controllers', 'ngRoute', 'ngResource', 'ngSanitize', 
                            'ui.bootstrap', 'LocalStorageModule', 'ui.select2','monospaced.elastic', 'ui.utils',
                            'flow']).
factory('mySocket', ['socketFactory', function (socketFactory) {
  var socket = socketFactory();
  socket.forward('error');

  //console.log("Running socket");
  return socket;
}]);
var MyAppControllers = angular.module('myApp.controllers', []);
var MyAppServices = angular.module('myApp.services',[]);



MyApp
.config(['$routeProvider','localStorageServiceProvider', 
  function($routeProvider, localStorageServiceProvider) {
  for(var path in window.routes){
    $routeProvider.when(path, window.routes[path]);
  }
  $routeProvider.otherwise({redirectTo: '/login'});
  // Set a prefix for this application key values
  localStorageServiceProvider.setPrefix('collab');
}])
.run(['$rootScope','$location', 'SessionService',function($rootScope, $location, SessionService){
  /* if(!SessionService.getUserAuthenticated()){
    $location.path('/login');
  } */
  $rootScope.$on("$locationChangeStart", function(event, next, current) {
    for(var i in window.routes) {
      if(next.indexOf(i) != -1) {
        if(window.routes[i].requireLogin && !SessionService.getUserAuthenticated()) {
          alert("You need to be authenticated to see this page!");
          event.preventDefault();
        }
      }
    }
  });
}]);

