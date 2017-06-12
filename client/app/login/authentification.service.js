(function () {
    'use strict'

    angular
        .module('myApp')
        .factory('AuthManager', AuthManager);

    AuthManager.$inject = ['$http'];

    function AuthManager($http) {
        var service = {};
        service.GetUser = GetUser;

        return service;
        
        //for user
        function GetUser(userdata) {
            var url = 'http://localhost:1337/api/users';
            return $http.post(url, userdata)
                .then(handleSuccess, handleError);
        }

        //other functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return res;
        }
    }
})();