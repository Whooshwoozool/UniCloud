(function () {
    'use strict'

    angular
        .module('myApp')
        .controller('FilesList', FilesList);

    FilesList.$inject = [
        '$scope',
        '$window',
        'FileManager',
        'Notificator',
        'modalService',
        '$rootScope',
        'Upload',
        'uploadFileModalService',
        'editFolderService',
        'createFolderService',
        '$location',
        'replaceFileModalService'
    ];

    function FilesList($scope, $window, FileManager, Notificator, modalService, $rootScope, Upload, uploadFileModalService, editFolderService, createFolderService, $location, replaceFileModalService) {
        //var user_name = 'mharbisherr';
        console.log($rootScope.user);
        $scope.nm = $rootScope.user;
    
        //get files
        FileManager.GetAllFiles($scope.nm)
            .then(function (res) {
                $scope.files = res;
                $scope.loaded = true;
                Notificator.success('Files have been successfully loaded!');
            }, function (res) {
                alert(res.message);
            });            
        
        //moks data
        // $scope.folders = [
        //     {
        //         'title': 'folder1',
        //         'user': 'mharbisherr'
        //     },
        //     {
        //         'title': 'folder2',
        //         'user': 'mharbisherr'
        //     },
        //     {
        //         'title': 'folder3',
        //         'user': 'mharbisherr'
        //     }
        // ];
        
    
        //delete file
        $scope.deleteFile = function (obj) {
            var file_id = obj._id;
            FileManager.DeleteFile($scope.nm, file_id)
                .then(function (res) {
                    Notificator.success('it works! File was successfully deleted!');
                    console.log(res);
                    var index = findIndex($scope.files, '_id', file_id);
                    $scope.files.splice(index, 1);
                    //delete $scope.files[index];
                    console.log(index);
                    console.log($scope.files);
                }, function (res) {
                    Notificator.error(res);
                });
        };
        
        //rename file
        $scope.renameFile = function (obj) {
            var file_id = obj._id;
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Rename',
                headerText: obj.title,
                bodyText: 'Are you sure you want to rename this file?'
            };
            modalService.showModal({}, modalOptions, obj).then(function (result) {
                var index = findIndex($scope.files, '_id', file_id);
                $scope.files[index].title = $rootScope.newFName;
                console.log($scope.files[index].title);
            });
        };

        //upload file
        $scope.uploadFile = function () {
            //var file_id = obj._id;
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Upload',
                headerText: 'File uploading',
                bodyText: 'Are you sure you want to upload this file?'
            };
            uploadFileModalService.showModal({}, modalOptions).then(function (result) {
                //var index = findIndex($scope.files, '_id', file_id);
                //$scope.files[index].title = $rootScope.newFName;
                //console.log('it works');
                $scope.$on('newUploadedFile', function (event, args) {
                    var obj = args.fileinfo;
                    $scope.files.unshift(obj);
                });
            });
        };

        $scope.init = function () {
                console.log("Angularjs call function on page load");
            };

        // $window.onload = function() {
        //         console.log("Angularjs call function on page load");
        //     };

        $scope.replaceFile = function (obj) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Replace',
                headerText: 'File replacing',
                bodyText: 'Are you sure you want to replace this file?'
            };
            replaceFileModalService.showModal({}, modalOptions, obj).then(function (result) {
                //var index = findIndex($scope.files, '_id', file_id);
                //$scope.files[index].title = $rootScope.newFName;
                //console.log('it works');
                $scope.$on('newFileDestination', function (event, args) {
                    console.log(args);
                    var obj = args.fileinfo;
                    var index = findIndex($scope.files, '_id', args.fileinfo._id);
                    $scope.files[index] = args.fileinfo;
                });
            });
        };

        //get folders
        FileManager.GetAllFolders($scope.nm)
            .then(function (res) {
                $scope.folders = res;
                $rootScope.foldersList = $scope.folders;
                console.log($rootScope.foldersList);
            }, function (res) {
                alert(res.message);
            });
        $rootScope.foldersList = $scope.folders;

        //rename folder
        $scope.renameFolder = function (obj) {
            var folder_id = obj._id;
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Rename',
                headerText: obj.folder,
                bodyText: 'Are you sure you want to rename this folder?'
            };
            editFolderService.showModal({}, modalOptions, obj).then(function (result) {
                $scope.$on('newUpdatedFolder', function(event, args){
                    console.log(args);
                    var newFolderName = args.newfoldername;
                    var folderId = args.obj._id;
                    var index = findIndex($scope.folders, '_id', folderId);
                    $scope.folders[index].folder = newFolderName;
                    console.log($scope.folders[index].folder);
                });
            });
        };

        //delete folder
        $scope.deleteFolder = function (obj) {
            var folder_id = obj._id;
            FileManager.DeleteFolder($scope.nm, folder_id)
                .then(function (res) {
                    Notificator.success('it works! Folder was successfully deleted!');
                    console.log(res);
                    var index = findIndex($scope.folders, '_id', folder_id);
                    $scope.folders.splice(index, 1);
                    //delete $scope.files[index];
                    console.log(index);
                    console.log($scope.folders);
                }, function (res) {
                    Notificator.error(res);
                });
        };

        //open folder
        $scope.openFolder = function (obj) {
            $rootScope.folderToOpen = obj;
            $location.path( '/list/' + obj.folder );
        };

        //create folder
        $scope.createFolder = function () {
            //var folder_id = obj._id;
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Create',
                headerText: 'Creating a folder',
                bodyText: 'Are you sure you want to create a folder?'
            };
            createFolderService.showModal({}, modalOptions).then(function (result) {
                $scope.$on('newFolder', function(event, args){
                    console.log(args.folderinfo.folder);
                    $scope.folders.unshift(args.folderinfo);
                });
            });
        };
        

        //logout
        $scope.logout = function(){
            localStorage.clear();
            Notificator.success('Logged out successfully !');
            $location.path('login');
        }

        //links to other folders
        $scope.relocate = function(path){
            var obj = {};
            obj.folder = path;
            $rootScope.folderToOpen = obj;
            $location.path(path);
        }

        //other functions
        function findIndex(array, key, value) {
            for (var i = 0; i < array.length; i++) {
                if (array[i][key] == value) {
                    return i;
                }
            }
            return null;
        }

    }
})();