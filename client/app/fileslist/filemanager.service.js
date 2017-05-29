(function () {
    'use strict'

    angular
        .module('myApp')
        .factory('FileManager', FileManager);

    FileManager.$inject = ['$http'];

    function FileManager($http) {
        var service = {};

        service.GetAllFiles = GetAllFiles;
        service.UpdateFile = UpdateFile;
        service.DeleteFile = DeleteFile;
        service.AddFile = AddFile;

        return service;
        
        function GetAllFiles(user_name) {
            var url = 'http://localhost:1337/api/users/' + user_name + '/files';
            return $http.get(url)
                .then(handleSuccess, handleError('Error getting all files'));
        }
        
        function UpdateFile(user_name, file_id, data) {
            var url = 'http://localhost:1337/api/users/' + user_name + '/files/' + file_id;
            return $http.put(url, data)
                .then(handleSuccess, handleError('Error updating file'));
        }

        function DeleteFile(user_name, file_id) {
            var url = 'http://localhost:1337/api/users/' + user_name + '/files/' + file_id;
            return $http.delete(url)
                .then(handleSuccess, handleError('Error deleting file'));
        }

        function AddFile(user_name, file, foldersname) {
            var url = 'http://localhost:1337/api/users/' + user_name + '/files';
            return $http.post(url, file, {
                headers: {
                    'Content-Type': undefined,
                    "X-Testing" : foldersname
                },
                transformRequest: angular.identity
            })
                .then(handleSuccess2, handleError('Error while add file'));
        }

        function handleSuccess(res) {
            return res.data;
        }

        function handleSuccess2(res) {
            return res.data.message;
        }

        function handleError(error) {
            return function () {
                return {message: error};
            }
        }
    }
})();