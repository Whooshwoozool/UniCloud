(function () {
    'use strict'

    angular
        .module('myApp')
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['$scope', '$rootScope', '$location', 'AuthManager', 'Notificator'];

    function LoginCtrl($scope, $rootScope, $location, AuthManager, Notificator){
    	$scope.user;
        $scope.fullUserData;

        $scope.login = function(){
            console.log($scope.user);
            AuthManager.GetUser(JSON.stringify($scope.user))
                .then(function(res){
                    console.log(res);
                    if(res.userdata === 'undefind'){
                        $scope.responseErrorMsg = res.message;
                    }else{
                        $scope.fullUserData = res.userdata;
                        localStorage.setItem('userdata', JSON.stringify($scope.user));
                        Notificator.success('Hey there, ' + $scope.fullUserData.firstName + ' ' +$scope.fullUserData.lastName + ' !');
                        $rootScope.user = $scope.user.username;
                        $location.path('list');
                    }
                }, function(res){
                    console.log('error');
                });
        }

       //$scope.responseErrorMsg = 'Incorrect username or password';
       //$scope.responseErrorMsg = '';
    }
})();