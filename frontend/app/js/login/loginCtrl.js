/* Controllers */
MyAppControllers.controller('loginCtrl', ['$scope', '$timeout', '$resource', '$location', 
  'SessionService', 'mySocket', 'deviceUserInfoService',
    function($scope, $timeout, $resource, $location, SessionService, mySocket, deviceUserInfoService) {
    'use strict';
    $scope.$on('socket:error', function (ev, data) {
       console.log("Connection not succesful");
    });
    $scope.alerts = [];
    /* { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
    { type: 'success', msg: 'Well done! You successfully read this important alert message.' } */
    $scope.showVerifyCode = false;
    $scope.email = null;
    $scope.password = null;
    $scope.verification_code = null;
    $scope.loginMessage = "Not logged in";
    var addAlert = function(alert_message) {
      $scope.alerts.push({msg: alert_message});
      $timeout(function(){
        $scope.alerts.splice(0,1);
      }, 5000);
    };

    $scope.login = function(email, password){
      var outer = this;
      // Equivalent of Login authorisation
      var serverAuth = $resource('api/v1/session/login', {}, 
        { login: {method:'POST', params:{email:email,password:password}} });
      serverAuth.login(function(response){
        //console.log("Login successful: ", response);
        // Validated user object and the corresonding password
        deviceUserInfoService.addUser({id:0, email:email, password:password});
        $location.path( "/home" );
        mySocket.reconnect();
      }, 
      function(err){
        //console.log("Login", JSON.stringify(err));
        addAlert("Login Failed "+err.data.message);
      });
    };
    // If user info is available auto login
    var user = deviceUserInfoService.getUser();
    if(user !== null){
      $scope.login(user.email, user.password);
      //console.log("Auto login with stored info "+JSON.stringify(user));
    }

    $scope.create = function(email, password){
      var outer = this;
      //console.log("Create button clicked", outer.email, outer.password);
      
      // Equivalent of Login authorisation
      $timeout(function(response){
        $scope.showVerifyCode = true;
        addAlert("create trigger");
      }, 10);
      /* var create = $resource('api/user', {}, 
        { login: {method:'POST', params:{email:outer.email,password:outer.password}} });
      create.login(function(response){
        $scope.loginMessage = "User created. Try login.";
        $scope.email = null;
        $scope.password = null;
      }, 
      function(err){
        //console.log("Login", JSON.stringify(err));
        $scope.loginMessage = "User creation failed. "+err.data.message;
      }); */
    };
    $scope.verifyCode = function(verifyCode){
      // Equivalent of Login authorisation
      $timeout(function(response){
        $scope.showVerifyCode = false;
        addAlert("Code verification done");
      }, 10);
    };
  }]);
