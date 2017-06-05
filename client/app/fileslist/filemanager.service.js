(function () {
    'use strict'

    angular
        .module('myApp')
        .factory('FileManager', FileManager);

    FileManager.$inject = ['$http'];

    function FileManager($http) {
        var service = {};

        //for files
        service.GetAllFiles = GetAllFiles;
        service.UpdateFile = UpdateFile;
        service.DeleteFile = DeleteFile;
        service.AddFile = AddFile;

        //for folders
        service.GetAllFolders = GetAllFolders;
        service.UpdateFolder = UpdateFolder;
        service.DeleteFolder = DeleteFolder;
        service.AddFolder = AddFolder;

        return service;
        
        //for files
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

        //for folders
        function GetAllFolders(user_name) {
            var url = 'http://localhost:1337/api/users/' + user_name + '/folders';
            return $http.get(url)
                .then(handleSuccess, handleError('Error getting all folders'));
        }
        
        function UpdateFolder(user_name, folder_id, data) {
            var url = 'http://localhost:1337/api/users/' + user_name + '/folders/' + folder_id;
            return $http.put(url, data)
                .then(handleSuccess, handleError('Error updating file'));
        }

        function DeleteFolder(user_name, folder_id) {
            var url = 'http://localhost:1337/api/users/' + user_name + '/folders/' + folder_id;
            return $http.delete(url)
                .then(handleSuccess, handleError('Error deleting file'));
        }

        function AddFolder(user_name, foldername) {
            var url = 'http://localhost:1337/api/users/' + user_name + '/folders';
            return $http.post(url, foldername)
                .then(handleSuccess, handleError('Error while add file'));
        }

        //other functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleSuccess2(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return {message: error};
            }
        }
    }
})();