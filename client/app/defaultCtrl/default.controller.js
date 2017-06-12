(function () {
    'use strict'

    angular
        .module('myApp')
        .controller('DefaultCtrl', DefaultCtrl);

    DefaultCtrl.$inject = ['$scope', '$rootScope', '$location'];

    function DefaultCtrl($scope, $rootScope, $location){
    	function checkLocalStorage(){
    		var userdata = JSON.parse(localStorage.getItem('userdata'));
    		//console.log(userdata == null);
    		if (userdata == null) {
    			console.log('userdata: ' + userdata);
    			console.log(userdata);
    			console.log('route to list cause userdata = null');
    			$scope.go('login');
    		} else{
    			console.log('route to list');
    			console.log('userdata: ' + userdata);
    			$rootScope.user = userdata.username;
    			$scope.go('list');
    		}
    		
    	}

    	$scope.go = function go(path) {
    		$location.path(path);
    	};
    	checkLocalStorage();
    	//console.log('default controller works');
    }
})();