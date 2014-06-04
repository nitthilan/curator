MyAppControllers.controller('notesCtrl', [ '$scope','$http','$timeout', '$filter', function($scope, $http, $timeout, $filter) {

	$scope.notesList = [];
	$http.get('/curator/notes').success(function(data) {
		$scope.notesList = data;
	});
	$scope.activeNotesList = [];
	
	function simpleKeys (original, depth) {
      return Object.keys(original).reduce(function (obj, key) {
		if(depth) obj[key] = typeof original[key] === 'object' ? simpleKeys(original[key], depth--) : original[key];
        else obj[key] = typeof original[key] === 'object' ? '{ ... }' : original[key];
        return obj;
      }, {});
    }

	$scope.createNotePlaceHolder = "note name";
	$scope.createNote = function(newNote){
		$http.post('/curator/notes', {info:{title:newNote}}).success(function(postData){
			//console.log(postData);
			$scope.createNotePlaceHolder = "note created";
			$timeout(function(){ 
				$scope.createNotePlaceHolder = "note name";
			}, 5000);
			if($scope.activeNotesList.indexOf(postData) == -1){
				$scope.activeNotesList.push(postData);
			}
			$scope.notesList.push(postData);
		}).error(function(err){
			console.log(err);
			$scope.createNotePlaceHolder = "note not created";
			$timeout(function(){
				$scope.createNotePlaceHolder = "note name";
			}, 5000);			
		});
		$scope.newNote = null;
		$scope.createNotePlaceHolder = null;
	};
	$scope.addNote = function(selectedNoteId){
		$http.get('/curator/notes/'+selectedNoteId).success(function(getData) {
			getData.dataSaved = true;
			//console.log(getData);
			var checkTextAvailable = $filter('filter')($scope.activeNotesList, selectedNoteId);
			if(checkTextAvailable.length === 0){
				$scope.activeNotesList.push(getData);				
			}
		});
		$scope.selectedNoteId = null;
	};
	$scope.removeNote = function(note){
		saveNote(note);
		var index = $scope.activeNotesList.indexOf(note);
		if(index != -1){
			$scope.activeNotesList.splice(index,1);
		}
	};
	$scope.tabCallBack = function($event, note){
		//console.log($event);
		$event.preventDefault();
		note.dataSaved = false;

		var targetElement = $event.target;
		var val = targetElement.value,
			start = targetElement.selectionStart,
			end = targetElement.selectionEnd;
		note.description = val.substring(0, start) + '\t' + val.substring(end);
		//$event.target.selectionStart = targetElement.selectionEnd = start + 1;
		// make it a event so that it happens after the ngmodel[note] update event happens
		$timeout(function(){
			//console.log('#'+note.title);
			var el = $('#'+note.title).get(0);
			el.selectionStart = el.selectionEnd = start + 1;
			
			$scope.createNotePlaceHolder = "note name";
		}, 30);
		
		//console.log(targetElement.selectionStart+" "+targetElement.selectionEnd);
		//note.description += "\t";
	};
	var saveNote = function(note){
		if(!note.dataSaved){
			$http.put('/curator/notes/'+note._id,{info:{description:note.description}}).success(function(data) {
				//console.log("notes saved "+data);
				note.dataSaved = true;
			});
		}
	};
	$scope.saveCallBack = function($event, note){
		//console.log("Fired ctrl-space");
		$event.preventDefault();
		saveNote(note);
	};
	$scope.deselected = function(note){
		saveNote(note);
	};
	$scope.changeCallBack = function(note){
		note.dataSaved = false;
		//console.log("Fired ng change");
	};
}]);