/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

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

/***/ }),
/* 1 */
/***/ (function(module, exports) {

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

/***/ }),
/* 2 */
/***/ (function(module, exports) {

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

/***/ }),
/* 3 */
/***/ (function(module, exports) {

(function() {
    'use strict';

    angular
        .module('myApp')
        .service('createFolderService', createFolderService);

    createFolderService.$inject = ['$uibModal', 'FileManager', 'Notificator'];
    function createFolderService($uibModal, FileManager, Notificator) {

        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: '../app/fileslist/modal/createfolderModal.html'
        };

        var modalOptions = {
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };

        this.showModal = function (customModalDefaults, customModalOptions) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions);
        };

        this.show = function (customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $uibModalInstance, Notificator, $rootScope) {

                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function (result) {
                        $rootScope.newFName = $scope.newfoldername;
                        FileManager.AddFolder($rootScope.user, JSON.stringify({folder: $scope.newfoldername}))
                            .then(function (res) {
                                $rootScope.$broadcast('newFolder', res);
                                Notificator.success(res.message);
                            }, function (res) {
                                Notificator.error(res);
                            });
                        $uibModalInstance.close(result);
                    };
                    $scope.modalOptions.close = function (result) {
                        $uibModalInstance.dismiss('cancel');
                    };
                }
            }

            return $uibModal.open(tempModalDefaults).result;
        };

    }
})();

/***/ }),
/* 4 */
/***/ (function(module, exports) {

(function() {
    'use strict';

    angular
        .module('myApp')
        .service('editFolderService', editFolderService);

    editFolderService.$inject = ['$uibModal', 'FileManager', 'Notificator'];
    function editFolderService($uibModal, FileManager, Notificator) {

        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: '../app/fileslist/modal/editfolderModal.html'
        };

        var modalOptions = {
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };

        this.showModal = function (customModalDefaults, customModalOptions, obj) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions, obj);
        };

        this.show = function (customModalDefaults, customModalOptions, obj) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $uibModalInstance, Notificator, $rootScope) {

                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function (result) {
                        //$rootScope.newFName = $scope.newfoldername;
                        var info = {
                            obj: obj,
                            newfoldername: $scope.newfoldername
                        };
                        FileManager.UpdateFolder(obj.user, obj._id, JSON.stringify({foldername: $scope.newfoldername}))
                            .then(function (res) {
                                $rootScope.$broadcast('newUpdatedFolder', info);
                                Notificator.success(res);
                            }, function (res) {
                                Notificator.error(res);
                            });
                        $uibModalInstance.close(result);
                    };
                    $scope.modalOptions.close = function (result) {
                        $uibModalInstance.dismiss('cancel');
                    };
                }
            }

            return $uibModal.open(tempModalDefaults).result;
        };

    }
})();

/***/ }),
/* 5 */
/***/ (function(module, exports) {

(function() {
    'use strict';

    angular
        .module('myApp')
        .service('modalService', modalService);

    modalService.$inject = ['$uibModal', 'FileManager', 'Notificator'];
    function modalService($uibModal, FileManager, Notificator) {

        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: '../app/fileslist/modal/modal.html'
        };

        var modalOptions = {
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };

        this.showModal = function (customModalDefaults, customModalOptions, obj) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions, obj);
        };

        this.show = function (customModalDefaults, customModalOptions, obj) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $uibModalInstance, Notificator, $rootScope) {

                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function (result) {
                        $rootScope.newFName = $scope.newfilename;
                        FileManager.UpdateFile(obj.user, obj._id, JSON.stringify({filename: $scope.newfilename, foldername: obj.folder}))
                            .then(function (res) {
                                Notificator.success(res);
                            }, function (res) {
                                Notificator.error(res);
                            });
                        $uibModalInstance.close(result);
                    };
                    $scope.modalOptions.close = function (result) {
                        $uibModalInstance.dismiss('cancel');
                    };
                }
            }

            return $uibModal.open(tempModalDefaults).result;
        };

    }
})();

/***/ }),
/* 6 */
/***/ (function(module, exports) {

(function() {
    'use strict';

    angular
        .module('myApp')
        .service('replaceFileModalService', replaceFileModalService);

    replaceFileModalService.$inject = ['$uibModal', 'FileManager', 'Notificator'];
    function replaceFileModalService($uibModal, FileManager, Notificator) {

        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: '../app/fileslist/modal/replacefileModal.html'
        };

        var modalOptions = {
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };

        this.showModal = function (customModalDefaults, customModalOptions, obj) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions, obj);
        };

        this.show = function (customModalDefaults, customModalOptions, obj) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $uibModalInstance, Notificator, $rootScope) {
                    $scope.foldersL = $rootScope.foldersList;

                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function (result) {
                        var fname = $scope.destinationFodler;

                        if (fname == null) {
                            fname = 'Main';
                        }
                        console.log(obj);
                        FileManager.UpdateFile($rootScope.user, obj._id, JSON.stringify({filename: obj.title, foldername: fname}))
                            .then(function (res) {
                                console.log(res);
                                console.log(fname);
                                $rootScope.$broadcast('newFileDestination', res);
                                //console.log(fd.get('file'));
                                Notificator.success(res.message);
                            }, function (res) {
                                console.log('err');
                                Notificator.error(res);
                            });
                        //logic here

                        /*$rootScope.newFName = $scope.newfilename;
                        FileManager.UpdateFile(obj.user, obj._id, JSON.stringify({filename: $scope.newfilename}))
                            .then(function (res) {
                                Notificator.success(res);
                            }, function (res) {
                                Notificator.error(res);
                            });*/
                        $uibModalInstance.close(result);
                    };
                    $scope.modalOptions.close = function (result) {
                        $uibModalInstance.dismiss('cancel');
                    };
                }
            }

            return $uibModal.open(tempModalDefaults).result;
        };

    }
})();

/***/ }),
/* 7 */
/***/ (function(module, exports) {

(function() {
    'use strict';

    angular
        .module('myApp')
        .service('uploadFileModalService', uploadFileModalService);

    uploadFileModalService.$inject = ['$uibModal', 'FileManager', 'Notificator', 'Upload'];
    function uploadFileModalService($uibModal, FileManager, Notificator, Upload) {

        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: '../app/fileslist/modal/uploadModal.html'
        };

        var modalOptions = {
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };

        this.showModal = function (customModalDefaults, customModalOptions, obj) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions, obj);
        };

        this.show = function (customModalDefaults, customModalOptions, obj) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $uibModalInstance, Notificator, $rootScope) {
                    $scope.foldersL = $rootScope.foldersList;
                    $scope.uploadFile = function ($file, $errFiles) {
                        $scope.uploadfilename = $file;
                        if ($file) {
                            /*file.upload = Upload.upload({
                             url: 'http://localhost:1337/api/users/' + user_name + '/files',
                             data: {file: file}
                             });

                             file.upload.then(function (response) {
                             $timeout(function () {
                             file.result = response.data;
                             });
                             }, function (response) {
                             if (response.status > 0)
                             $scope.errorMsg = response.status + ': ' + response.data;
                             }, function (evt) {
                             file.progress = Math.min(100, parseInt(100.0 *
                             evt.loaded / evt.total));
                             });*/
                            //console.log(file);
                            //console.log('file was successfully selected');
                        }
                    };

                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function (result) {
                        var fname = $scope.destinationFodler;

                        if (fname == null) {
                            fname = 'Main';
                        }
                        
                        var fd = new FormData();
                        fd.append('file', $scope.uploadfilename);

                        FileManager.AddFile($rootScope.user, fd, fname)
                            .then(function (res) {
                                //console.log(res);
                                $rootScope.$broadcast('newUploadedFile', res);
                                //console.log(fd.get('file'));
                                Notificator.success(res.message);
                            }, function (res) {
                                console.log('err');
                                Notificator.error(res);
                            });
                        //logic here

                        /*$rootScope.newFName = $scope.newfilename;
                        FileManager.UpdateFile(obj.user, obj._id, JSON.stringify({filename: $scope.newfilename}))
                            .then(function (res) {
                                Notificator.success(res);
                            }, function (res) {
                                Notificator.error(res);
                            });*/
                        $uibModalInstance.close(result);
                    };
                    $scope.modalOptions.close = function (result) {
                        $uibModalInstance.dismiss('cancel');
                    };
                }
            }

            return $uibModal.open(tempModalDefaults).result;
        };

    }
})();

/***/ }),
/* 8 */
/***/ (function(module, exports) {

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

/***/ }),
/* 9 */
/***/ (function(module, exports) {

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

/***/ }),
/* 10 */
/***/ (function(module, exports) {

(function() {
    'use strict';

    angular.module('myApp')
        .config(notificatorConfig)
        .factory('Notificator', Notificator)
        .run(notificationsRun);

    Notificator.$inject = ['toastr'];
    function Notificator(toastr) {
        return {
            success: function(msg, title) {
                toastr.success(msg, title);
            },
            warning: function(msg, title) {
                toastr.warning(msg, title);
            },
            error: function(msg, title) {
                toastr.error(msg, title);
            },
            info: function(msg, title) {
                toastr.info(msg, title);
            }
        }
    }

    notificationsRun.$inject = ['$rootScope', 'Notificator', '$timeout'];
    function notificationsRun($rootScope, notificator, $timeout) {
        /*$rootScope.$on('$userLoggedIn', function() {
            notificator.success('Hey there!');

            $timeout(function(){
                notificator.info('Welcome to this free angular dashboard seed project,' +
                ' that you may use to bootstrap your next web app!', {
                    timeOut: 10000
                });
            },3000);

            $timeout(function(){
                notificator.info('Btw, feel free to contribute to this project and help us kill the paid templates market ;)', {
                    timeOut: 10000
                });
            },15000)
        });
        $rootScope.$on('$userLoggedOut', function() {
            notificator.success('Logged out successfully');
        });*/
        console.log('notificationsRun works!');
    }

    notificatorConfig.$inject = ['toastrConfig'];
    function notificatorConfig(toastrConfig) {
        angular.extend(toastrConfig, {
            timeOut: 3000
        });
    }

})();


/***/ }),
/* 11 */
/***/ (function(module, exports) {

(function() {
    'use strict';

    angular.module('myApp')
        .directive('widget', widget);

    function widget() {
        function link(scope, $element) {
            $element.addClass('widget');
        }
        return {
            link: link,
            restrict: 'EA'
        };
    }

})();


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

angular.module('myApp', ['toastr', 'ngAnimate', 'ui.bootstrap', 'ngFileUpload', 'ngRoute']);

angular
        .module('myApp')
        .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
        	$routeProvider.when('/list', {
    			templateUrl: './app/templates/list.html'
    		});
    		$routeProvider.when('/login', {
    			templateUrl: './app/templates/login.html'
    		});
    		$routeProvider.when('/list/:foldername', {
    			templateUrl: './app/templates/folder.html'
    		});
        }]);

__webpack_require__(2);
__webpack_require__(1);
__webpack_require__(11);
__webpack_require__(10);
__webpack_require__(5);
__webpack_require__(7);
__webpack_require__(4);
__webpack_require__(3);
__webpack_require__(6);
__webpack_require__(0);
__webpack_require__(8);
__webpack_require__(9);

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmJ1bmRsZS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAxMzBkZDgwMWRhMjJiOTdhYjk3YiIsIndlYnBhY2s6Ly8vLi9kZWZhdWx0Q3RybC9kZWZhdWx0LmNvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vLy4vZmlsZXNsaXN0L2ZpbGVtYW5hZ2VyLnNlcnZpY2UuanMiLCJ3ZWJwYWNrOi8vLy4vZmlsZXNsaXN0L2xpc3QuY29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly8vLi9maWxlc2xpc3QvbW9kYWwvY3JlYXRlZm9sZGVyLnNlcnZpY2UuanMiLCJ3ZWJwYWNrOi8vLy4vZmlsZXNsaXN0L21vZGFsL2VkaXRmb2xkZXIuc2VydmljZS5qcyIsIndlYnBhY2s6Ly8vLi9maWxlc2xpc3QvbW9kYWwvbW9kYWwuanMiLCJ3ZWJwYWNrOi8vLy4vZmlsZXNsaXN0L21vZGFsL3JlcGxhY2VmaWxlLnNlcnZpY2UuanMiLCJ3ZWJwYWNrOi8vLy4vZmlsZXNsaXN0L21vZGFsL3VwbG9hZGZpbGUuc2VydmljZS5qcyIsIndlYnBhY2s6Ly8vLi9sb2dpbi9hdXRoZW50aWZpY2F0aW9uLnNlcnZpY2UuanMiLCJ3ZWJwYWNrOi8vLy4vbG9naW4vbG9naW4uY29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly8vLi9ub3RpZmljYXRvci9ub3RpZmljYXRpb25zLmpzIiwid2VicGFjazovLy8uL3dpZGdldC93aWRnZXQuanMiLCJ3ZWJwYWNrOi8vLy4vYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMTIpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDEzMGRkODAxZGEyMmI5N2FiOTdiIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0J1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdteUFwcCcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0RlZmF1bHRDdHJsJywgRGVmYXVsdEN0cmwpO1xyXG5cclxuICAgIERlZmF1bHRDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJyRsb2NhdGlvbiddO1xyXG5cclxuICAgIGZ1bmN0aW9uIERlZmF1bHRDdHJsKCRzY29wZSwgJHJvb3RTY29wZSwgJGxvY2F0aW9uKXtcclxuICAgIFx0ZnVuY3Rpb24gY2hlY2tMb2NhbFN0b3JhZ2UoKXtcclxuICAgIFx0XHR2YXIgdXNlcmRhdGEgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyZGF0YScpKTtcclxuICAgIFx0XHQvL2NvbnNvbGUubG9nKHVzZXJkYXRhID09IG51bGwpO1xyXG4gICAgXHRcdGlmICh1c2VyZGF0YSA9PSBudWxsKSB7XHJcbiAgICBcdFx0XHRjb25zb2xlLmxvZygndXNlcmRhdGE6ICcgKyB1c2VyZGF0YSk7XHJcbiAgICBcdFx0XHRjb25zb2xlLmxvZyh1c2VyZGF0YSk7XHJcbiAgICBcdFx0XHRjb25zb2xlLmxvZygncm91dGUgdG8gbGlzdCBjYXVzZSB1c2VyZGF0YSA9IG51bGwnKTtcclxuICAgIFx0XHRcdCRzY29wZS5nbygnbG9naW4nKTtcclxuICAgIFx0XHR9IGVsc2V7XHJcbiAgICBcdFx0XHRjb25zb2xlLmxvZygncm91dGUgdG8gbGlzdCcpO1xyXG4gICAgXHRcdFx0Y29uc29sZS5sb2coJ3VzZXJkYXRhOiAnICsgdXNlcmRhdGEpO1xyXG4gICAgXHRcdFx0JHJvb3RTY29wZS51c2VyID0gdXNlcmRhdGEudXNlcm5hbWU7XHJcbiAgICBcdFx0XHQkc2NvcGUuZ28oJ2xpc3QnKTtcclxuICAgIFx0XHR9XHJcbiAgICBcdFx0XHJcbiAgICBcdH1cclxuXHJcbiAgICBcdCRzY29wZS5nbyA9IGZ1bmN0aW9uIGdvKHBhdGgpIHtcclxuICAgIFx0XHQkbG9jYXRpb24ucGF0aChwYXRoKTtcclxuICAgIFx0fTtcclxuICAgIFx0Y2hlY2tMb2NhbFN0b3JhZ2UoKTtcclxuICAgIFx0Ly9jb25zb2xlLmxvZygnZGVmYXVsdCBjb250cm9sbGVyIHdvcmtzJyk7XHJcbiAgICB9XHJcbn0pKCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9kZWZhdWx0Q3RybC9kZWZhdWx0LmNvbnRyb2xsZXIuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0J1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdteUFwcCcpXHJcbiAgICAgICAgLmZhY3RvcnkoJ0ZpbGVNYW5hZ2VyJywgRmlsZU1hbmFnZXIpO1xyXG5cclxuICAgIEZpbGVNYW5hZ2VyLiRpbmplY3QgPSBbJyRodHRwJ107XHJcblxyXG4gICAgZnVuY3Rpb24gRmlsZU1hbmFnZXIoJGh0dHApIHtcclxuICAgICAgICB2YXIgc2VydmljZSA9IHt9O1xyXG5cclxuICAgICAgICAvL2ZvciBmaWxlc1xyXG4gICAgICAgIHNlcnZpY2UuR2V0QWxsRmlsZXMgPSBHZXRBbGxGaWxlcztcclxuICAgICAgICBzZXJ2aWNlLlVwZGF0ZUZpbGUgPSBVcGRhdGVGaWxlO1xyXG4gICAgICAgIHNlcnZpY2UuRGVsZXRlRmlsZSA9IERlbGV0ZUZpbGU7XHJcbiAgICAgICAgc2VydmljZS5BZGRGaWxlID0gQWRkRmlsZTtcclxuXHJcbiAgICAgICAgLy9mb3IgZm9sZGVyc1xyXG4gICAgICAgIHNlcnZpY2UuR2V0QWxsRm9sZGVycyA9IEdldEFsbEZvbGRlcnM7XHJcbiAgICAgICAgc2VydmljZS5VcGRhdGVGb2xkZXIgPSBVcGRhdGVGb2xkZXI7XHJcbiAgICAgICAgc2VydmljZS5EZWxldGVGb2xkZXIgPSBEZWxldGVGb2xkZXI7XHJcbiAgICAgICAgc2VydmljZS5BZGRGb2xkZXIgPSBBZGRGb2xkZXI7XHJcblxyXG4gICAgICAgIHJldHVybiBzZXJ2aWNlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vZm9yIGZpbGVzXHJcbiAgICAgICAgZnVuY3Rpb24gR2V0QWxsRmlsZXModXNlcl9uYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdDoxMzM3L2FwaS91c2Vycy8nICsgdXNlcl9uYW1lICsgJy9maWxlcyc7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQodXJsKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oaGFuZGxlU3VjY2VzcywgaGFuZGxlRXJyb3IoJ0Vycm9yIGdldHRpbmcgYWxsIGZpbGVzJykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBVcGRhdGVGaWxlKHVzZXJfbmFtZSwgZmlsZV9pZCwgZGF0YSkge1xyXG4gICAgICAgICAgICB2YXIgdXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6MTMzNy9hcGkvdXNlcnMvJyArIHVzZXJfbmFtZSArICcvZmlsZXMvJyArIGZpbGVfaWQ7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wdXQodXJsLCBkYXRhKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oaGFuZGxlU3VjY2VzcywgaGFuZGxlRXJyb3IoJ0Vycm9yIHVwZGF0aW5nIGZpbGUnKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBEZWxldGVGaWxlKHVzZXJfbmFtZSwgZmlsZV9pZCkge1xyXG4gICAgICAgICAgICB2YXIgdXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6MTMzNy9hcGkvdXNlcnMvJyArIHVzZXJfbmFtZSArICcvZmlsZXMvJyArIGZpbGVfaWQ7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5kZWxldGUodXJsKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oaGFuZGxlU3VjY2VzcywgaGFuZGxlRXJyb3IoJ0Vycm9yIGRlbGV0aW5nIGZpbGUnKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBBZGRGaWxlKHVzZXJfbmFtZSwgZmlsZSwgZm9sZGVyc25hbWUpIHtcclxuICAgICAgICAgICAgdmFyIHVybCA9ICdodHRwOi8vbG9jYWxob3N0OjEzMzcvYXBpL3VzZXJzLycgKyB1c2VyX25hbWUgKyAnL2ZpbGVzJztcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QodXJsLCBmaWxlLCB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICBcIlgtVGVzdGluZ1wiIDogZm9sZGVyc25hbWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm1SZXF1ZXN0OiBhbmd1bGFyLmlkZW50aXR5XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbihoYW5kbGVTdWNjZXNzMiwgaGFuZGxlRXJyb3IoJ0Vycm9yIHdoaWxlIGFkZCBmaWxlJykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9mb3IgZm9sZGVyc1xyXG4gICAgICAgIGZ1bmN0aW9uIEdldEFsbEZvbGRlcnModXNlcl9uYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdDoxMzM3L2FwaS91c2Vycy8nICsgdXNlcl9uYW1lICsgJy9mb2xkZXJzJztcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCh1cmwpXHJcbiAgICAgICAgICAgICAgICAudGhlbihoYW5kbGVTdWNjZXNzLCBoYW5kbGVFcnJvcignRXJyb3IgZ2V0dGluZyBhbGwgZm9sZGVycycpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gVXBkYXRlRm9sZGVyKHVzZXJfbmFtZSwgZm9sZGVyX2lkLCBkYXRhKSB7XHJcbiAgICAgICAgICAgIHZhciB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdDoxMzM3L2FwaS91c2Vycy8nICsgdXNlcl9uYW1lICsgJy9mb2xkZXJzLycgKyBmb2xkZXJfaWQ7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wdXQodXJsLCBkYXRhKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oaGFuZGxlU3VjY2VzcywgaGFuZGxlRXJyb3IoJ0Vycm9yIHVwZGF0aW5nIGZpbGUnKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBEZWxldGVGb2xkZXIodXNlcl9uYW1lLCBmb2xkZXJfaWQpIHtcclxuICAgICAgICAgICAgdmFyIHVybCA9ICdodHRwOi8vbG9jYWxob3N0OjEzMzcvYXBpL3VzZXJzLycgKyB1c2VyX25hbWUgKyAnL2ZvbGRlcnMvJyArIGZvbGRlcl9pZDtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZSh1cmwpXHJcbiAgICAgICAgICAgICAgICAudGhlbihoYW5kbGVTdWNjZXNzLCBoYW5kbGVFcnJvcignRXJyb3IgZGVsZXRpbmcgZmlsZScpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIEFkZEZvbGRlcih1c2VyX25hbWUsIGZvbGRlcm5hbWUpIHtcclxuICAgICAgICAgICAgdmFyIHVybCA9ICdodHRwOi8vbG9jYWxob3N0OjEzMzcvYXBpL3VzZXJzLycgKyB1c2VyX25hbWUgKyAnL2ZvbGRlcnMnO1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCh1cmwsIGZvbGRlcm5hbWUpXHJcbiAgICAgICAgICAgICAgICAudGhlbihoYW5kbGVTdWNjZXNzLCBoYW5kbGVFcnJvcignRXJyb3Igd2hpbGUgYWRkIGZpbGUnKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL290aGVyIGZ1bmN0aW9uc1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVTdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzLmRhdGE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVTdWNjZXNzMihyZXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5kYXRhO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlRXJyb3IoZXJyb3IpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7bWVzc2FnZTogZXJyb3J9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vZmlsZXNsaXN0L2ZpbGVtYW5hZ2VyLnNlcnZpY2UuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0J1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdteUFwcCcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0ZpbGVzTGlzdCcsIEZpbGVzTGlzdCk7XHJcblxyXG4gICAgRmlsZXNMaXN0LiRpbmplY3QgPSBbXHJcbiAgICAgICAgJyRzY29wZScsXHJcbiAgICAgICAgJyR3aW5kb3cnLFxyXG4gICAgICAgICdGaWxlTWFuYWdlcicsXHJcbiAgICAgICAgJ05vdGlmaWNhdG9yJyxcclxuICAgICAgICAnbW9kYWxTZXJ2aWNlJyxcclxuICAgICAgICAnJHJvb3RTY29wZScsXHJcbiAgICAgICAgJ1VwbG9hZCcsXHJcbiAgICAgICAgJ3VwbG9hZEZpbGVNb2RhbFNlcnZpY2UnLFxyXG4gICAgICAgICdlZGl0Rm9sZGVyU2VydmljZScsXHJcbiAgICAgICAgJ2NyZWF0ZUZvbGRlclNlcnZpY2UnLFxyXG4gICAgICAgICckbG9jYXRpb24nLFxyXG4gICAgICAgICdyZXBsYWNlRmlsZU1vZGFsU2VydmljZSdcclxuICAgIF07XHJcblxyXG4gICAgZnVuY3Rpb24gRmlsZXNMaXN0KCRzY29wZSwgJHdpbmRvdywgRmlsZU1hbmFnZXIsIE5vdGlmaWNhdG9yLCBtb2RhbFNlcnZpY2UsICRyb290U2NvcGUsIFVwbG9hZCwgdXBsb2FkRmlsZU1vZGFsU2VydmljZSwgZWRpdEZvbGRlclNlcnZpY2UsIGNyZWF0ZUZvbGRlclNlcnZpY2UsICRsb2NhdGlvbiwgcmVwbGFjZUZpbGVNb2RhbFNlcnZpY2UpIHtcclxuICAgICAgICAvL3ZhciB1c2VyX25hbWUgPSAnbWhhcmJpc2hlcnInO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCRyb290U2NvcGUudXNlcik7XHJcbiAgICAgICAgJHNjb3BlLm5tID0gJHJvb3RTY29wZS51c2VyO1xyXG4gICAgXHJcbiAgICAgICAgLy9nZXQgZmlsZXNcclxuICAgICAgICBGaWxlTWFuYWdlci5HZXRBbGxGaWxlcygkc2NvcGUubm0pXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5maWxlcyA9IHJlcztcclxuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgTm90aWZpY2F0b3Iuc3VjY2VzcygnRmlsZXMgaGF2ZSBiZWVuIHN1Y2Nlc3NmdWxseSBsb2FkZWQhJyk7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KHJlcy5tZXNzYWdlKTtcclxuICAgICAgICAgICAgfSk7ICAgICAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9tb2tzIGRhdGFcclxuICAgICAgICAvLyAkc2NvcGUuZm9sZGVycyA9IFtcclxuICAgICAgICAvLyAgICAge1xyXG4gICAgICAgIC8vICAgICAgICAgJ3RpdGxlJzogJ2ZvbGRlcjEnLFxyXG4gICAgICAgIC8vICAgICAgICAgJ3VzZXInOiAnbWhhcmJpc2hlcnInXHJcbiAgICAgICAgLy8gICAgIH0sXHJcbiAgICAgICAgLy8gICAgIHtcclxuICAgICAgICAvLyAgICAgICAgICd0aXRsZSc6ICdmb2xkZXIyJyxcclxuICAgICAgICAvLyAgICAgICAgICd1c2VyJzogJ21oYXJiaXNoZXJyJ1xyXG4gICAgICAgIC8vICAgICB9LFxyXG4gICAgICAgIC8vICAgICB7XHJcbiAgICAgICAgLy8gICAgICAgICAndGl0bGUnOiAnZm9sZGVyMycsXHJcbiAgICAgICAgLy8gICAgICAgICAndXNlcic6ICdtaGFyYmlzaGVycidcclxuICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgIC8vIF07XHJcbiAgICAgICAgXHJcbiAgICBcclxuICAgICAgICAvL2RlbGV0ZSBmaWxlXHJcbiAgICAgICAgJHNjb3BlLmRlbGV0ZUZpbGUgPSBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICAgICAgICAgIHZhciBmaWxlX2lkID0gb2JqLl9pZDtcclxuICAgICAgICAgICAgRmlsZU1hbmFnZXIuRGVsZXRlRmlsZSgkc2NvcGUubm0sIGZpbGVfaWQpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgTm90aWZpY2F0b3Iuc3VjY2VzcygnaXQgd29ya3MhIEZpbGUgd2FzIHN1Y2Nlc3NmdWxseSBkZWxldGVkIScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gZmluZEluZGV4KCRzY29wZS5maWxlcywgJ19pZCcsIGZpbGVfaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5maWxlcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vZGVsZXRlICRzY29wZS5maWxlc1tpbmRleF07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5maWxlcyk7XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgTm90aWZpY2F0b3IuZXJyb3IocmVzKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9yZW5hbWUgZmlsZVxyXG4gICAgICAgICRzY29wZS5yZW5hbWVGaWxlID0gZnVuY3Rpb24gKG9iaikge1xyXG4gICAgICAgICAgICB2YXIgZmlsZV9pZCA9IG9iai5faWQ7XHJcbiAgICAgICAgICAgIHZhciBtb2RhbE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICBjbG9zZUJ1dHRvblRleHQ6ICdDYW5jZWwnLFxyXG4gICAgICAgICAgICAgICAgYWN0aW9uQnV0dG9uVGV4dDogJ1JlbmFtZScsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJUZXh0OiBvYmoudGl0bGUsXHJcbiAgICAgICAgICAgICAgICBib2R5VGV4dDogJ0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byByZW5hbWUgdGhpcyBmaWxlPydcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgbW9kYWxTZXJ2aWNlLnNob3dNb2RhbCh7fSwgbW9kYWxPcHRpb25zLCBvYmopLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gZmluZEluZGV4KCRzY29wZS5maWxlcywgJ19pZCcsIGZpbGVfaWQpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmZpbGVzW2luZGV4XS50aXRsZSA9ICRyb290U2NvcGUubmV3Rk5hbWU7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuZmlsZXNbaW5kZXhdLnRpdGxlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy91cGxvYWQgZmlsZVxyXG4gICAgICAgICRzY29wZS51cGxvYWRGaWxlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvL3ZhciBmaWxlX2lkID0gb2JqLl9pZDtcclxuICAgICAgICAgICAgdmFyIG1vZGFsT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIGNsb3NlQnV0dG9uVGV4dDogJ0NhbmNlbCcsXHJcbiAgICAgICAgICAgICAgICBhY3Rpb25CdXR0b25UZXh0OiAnVXBsb2FkJyxcclxuICAgICAgICAgICAgICAgIGhlYWRlclRleHQ6ICdGaWxlIHVwbG9hZGluZycsXHJcbiAgICAgICAgICAgICAgICBib2R5VGV4dDogJ0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byB1cGxvYWQgdGhpcyBmaWxlPydcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdXBsb2FkRmlsZU1vZGFsU2VydmljZS5zaG93TW9kYWwoe30sIG1vZGFsT3B0aW9ucykudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAvL3ZhciBpbmRleCA9IGZpbmRJbmRleCgkc2NvcGUuZmlsZXMsICdfaWQnLCBmaWxlX2lkKTtcclxuICAgICAgICAgICAgICAgIC8vJHNjb3BlLmZpbGVzW2luZGV4XS50aXRsZSA9ICRyb290U2NvcGUubmV3Rk5hbWU7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdpdCB3b3JrcycpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLiRvbignbmV3VXBsb2FkZWRGaWxlJywgZnVuY3Rpb24gKGV2ZW50LCBhcmdzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9iaiA9IGFyZ3MuZmlsZWluZm87XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZpbGVzLnVuc2hpZnQob2JqKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQW5ndWxhcmpzIGNhbGwgZnVuY3Rpb24gb24gcGFnZSBsb2FkXCIpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyAkd2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coXCJBbmd1bGFyanMgY2FsbCBmdW5jdGlvbiBvbiBwYWdlIGxvYWRcIik7XHJcbiAgICAgICAgLy8gICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5yZXBsYWNlRmlsZSA9IGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICAgICAgdmFyIG1vZGFsT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIGNsb3NlQnV0dG9uVGV4dDogJ0NhbmNlbCcsXHJcbiAgICAgICAgICAgICAgICBhY3Rpb25CdXR0b25UZXh0OiAnUmVwbGFjZScsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJUZXh0OiAnRmlsZSByZXBsYWNpbmcnLFxyXG4gICAgICAgICAgICAgICAgYm9keVRleHQ6ICdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcmVwbGFjZSB0aGlzIGZpbGU/J1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXBsYWNlRmlsZU1vZGFsU2VydmljZS5zaG93TW9kYWwoe30sIG1vZGFsT3B0aW9ucywgb2JqKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIC8vdmFyIGluZGV4ID0gZmluZEluZGV4KCRzY29wZS5maWxlcywgJ19pZCcsIGZpbGVfaWQpO1xyXG4gICAgICAgICAgICAgICAgLy8kc2NvcGUuZmlsZXNbaW5kZXhdLnRpdGxlID0gJHJvb3RTY29wZS5uZXdGTmFtZTtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2l0IHdvcmtzJyk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuJG9uKCduZXdGaWxlRGVzdGluYXRpb24nLCBmdW5jdGlvbiAoZXZlbnQsIGFyZ3MpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhcmdzKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgb2JqID0gYXJncy5maWxlaW5mbztcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBmaW5kSW5kZXgoJHNjb3BlLmZpbGVzLCAnX2lkJywgYXJncy5maWxlaW5mby5faWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5maWxlc1tpbmRleF0gPSBhcmdzLmZpbGVpbmZvO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vZ2V0IGZvbGRlcnNcclxuICAgICAgICBGaWxlTWFuYWdlci5HZXRBbGxGb2xkZXJzKCRzY29wZS5ubSlcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmZvbGRlcnMgPSByZXM7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmZvbGRlcnNMaXN0ID0gJHNjb3BlLmZvbGRlcnM7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkcm9vdFNjb3BlLmZvbGRlcnNMaXN0KTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQocmVzLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAkcm9vdFNjb3BlLmZvbGRlcnNMaXN0ID0gJHNjb3BlLmZvbGRlcnM7XHJcblxyXG4gICAgICAgIC8vcmVuYW1lIGZvbGRlclxyXG4gICAgICAgICRzY29wZS5yZW5hbWVGb2xkZXIgPSBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICAgICAgICAgIHZhciBmb2xkZXJfaWQgPSBvYmouX2lkO1xyXG4gICAgICAgICAgICB2YXIgbW9kYWxPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgY2xvc2VCdXR0b25UZXh0OiAnQ2FuY2VsJyxcclxuICAgICAgICAgICAgICAgIGFjdGlvbkJ1dHRvblRleHQ6ICdSZW5hbWUnLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyVGV4dDogb2JqLmZvbGRlcixcclxuICAgICAgICAgICAgICAgIGJvZHlUZXh0OiAnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHJlbmFtZSB0aGlzIGZvbGRlcj8nXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGVkaXRGb2xkZXJTZXJ2aWNlLnNob3dNb2RhbCh7fSwgbW9kYWxPcHRpb25zLCBvYmopLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLiRvbignbmV3VXBkYXRlZEZvbGRlcicsIGZ1bmN0aW9uKGV2ZW50LCBhcmdzKXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhcmdzKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3Rm9sZGVyTmFtZSA9IGFyZ3MubmV3Zm9sZGVybmFtZTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZm9sZGVySWQgPSBhcmdzLm9iai5faWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gZmluZEluZGV4KCRzY29wZS5mb2xkZXJzLCAnX2lkJywgZm9sZGVySWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5mb2xkZXJzW2luZGV4XS5mb2xkZXIgPSBuZXdGb2xkZXJOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5mb2xkZXJzW2luZGV4XS5mb2xkZXIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vZGVsZXRlIGZvbGRlclxyXG4gICAgICAgICRzY29wZS5kZWxldGVGb2xkZXIgPSBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICAgICAgICAgIHZhciBmb2xkZXJfaWQgPSBvYmouX2lkO1xyXG4gICAgICAgICAgICBGaWxlTWFuYWdlci5EZWxldGVGb2xkZXIoJHNjb3BlLm5tLCBmb2xkZXJfaWQpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgTm90aWZpY2F0b3Iuc3VjY2VzcygnaXQgd29ya3MhIEZvbGRlciB3YXMgc3VjY2Vzc2Z1bGx5IGRlbGV0ZWQhJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBmaW5kSW5kZXgoJHNjb3BlLmZvbGRlcnMsICdfaWQnLCBmb2xkZXJfaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5mb2xkZXJzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9kZWxldGUgJHNjb3BlLmZpbGVzW2luZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmZvbGRlcnMpO1xyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIE5vdGlmaWNhdG9yLmVycm9yKHJlcyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvL29wZW4gZm9sZGVyXHJcbiAgICAgICAgJHNjb3BlLm9wZW5Gb2xkZXIgPSBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuZm9sZGVyVG9PcGVuID0gb2JqO1xyXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCggJy9saXN0LycgKyBvYmouZm9sZGVyICk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy9jcmVhdGUgZm9sZGVyXHJcbiAgICAgICAgJHNjb3BlLmNyZWF0ZUZvbGRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy92YXIgZm9sZGVyX2lkID0gb2JqLl9pZDtcclxuICAgICAgICAgICAgdmFyIG1vZGFsT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIGNsb3NlQnV0dG9uVGV4dDogJ0NhbmNlbCcsXHJcbiAgICAgICAgICAgICAgICBhY3Rpb25CdXR0b25UZXh0OiAnQ3JlYXRlJyxcclxuICAgICAgICAgICAgICAgIGhlYWRlclRleHQ6ICdDcmVhdGluZyBhIGZvbGRlcicsXHJcbiAgICAgICAgICAgICAgICBib2R5VGV4dDogJ0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBjcmVhdGUgYSBmb2xkZXI/J1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBjcmVhdGVGb2xkZXJTZXJ2aWNlLnNob3dNb2RhbCh7fSwgbW9kYWxPcHRpb25zKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS4kb24oJ25ld0ZvbGRlcicsIGZ1bmN0aW9uKGV2ZW50LCBhcmdzKXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhcmdzLmZvbGRlcmluZm8uZm9sZGVyKTtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm9sZGVycy51bnNoaWZ0KGFyZ3MuZm9sZGVyaW5mbyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgLy9sb2dvdXRcclxuICAgICAgICAkc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIE5vdGlmaWNhdG9yLnN1Y2Nlc3MoJ0xvZ2dlZCBvdXQgc3VjY2Vzc2Z1bGx5ICEnKTtcclxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJ2xvZ2luJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL2xpbmtzIHRvIG90aGVyIGZvbGRlcnNcclxuICAgICAgICAkc2NvcGUucmVsb2NhdGUgPSBmdW5jdGlvbihwYXRoKXtcclxuICAgICAgICAgICAgdmFyIG9iaiA9IHt9O1xyXG4gICAgICAgICAgICBvYmouZm9sZGVyID0gcGF0aDtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS5mb2xkZXJUb09wZW4gPSBvYmo7XHJcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKHBhdGgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9vdGhlciBmdW5jdGlvbnNcclxuICAgICAgICBmdW5jdGlvbiBmaW5kSW5kZXgoYXJyYXksIGtleSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFycmF5W2ldW2tleV0gPT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59KSgpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vZmlsZXNsaXN0L2xpc3QuY29udHJvbGxlci5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ215QXBwJylcclxuICAgICAgICAuc2VydmljZSgnY3JlYXRlRm9sZGVyU2VydmljZScsIGNyZWF0ZUZvbGRlclNlcnZpY2UpO1xyXG5cclxuICAgIGNyZWF0ZUZvbGRlclNlcnZpY2UuJGluamVjdCA9IFsnJHVpYk1vZGFsJywgJ0ZpbGVNYW5hZ2VyJywgJ05vdGlmaWNhdG9yJ107XHJcbiAgICBmdW5jdGlvbiBjcmVhdGVGb2xkZXJTZXJ2aWNlKCR1aWJNb2RhbCwgRmlsZU1hbmFnZXIsIE5vdGlmaWNhdG9yKSB7XHJcblxyXG4gICAgICAgIHZhciBtb2RhbERlZmF1bHRzID0ge1xyXG4gICAgICAgICAgICBiYWNrZHJvcDogdHJ1ZSxcclxuICAgICAgICAgICAga2V5Ym9hcmQ6IHRydWUsXHJcbiAgICAgICAgICAgIG1vZGFsRmFkZTogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi9hcHAvZmlsZXNsaXN0L21vZGFsL2NyZWF0ZWZvbGRlck1vZGFsLmh0bWwnXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIG1vZGFsT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgY2xvc2VCdXR0b25UZXh0OiAnQ2xvc2UnLFxyXG4gICAgICAgICAgICBhY3Rpb25CdXR0b25UZXh0OiAnT0snLFxyXG4gICAgICAgICAgICBoZWFkZXJUZXh0OiAnUHJvY2VlZD8nLFxyXG4gICAgICAgICAgICBib2R5VGV4dDogJ1BlcmZvcm0gdGhpcyBhY3Rpb24/J1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuc2hvd01vZGFsID0gZnVuY3Rpb24gKGN1c3RvbU1vZGFsRGVmYXVsdHMsIGN1c3RvbU1vZGFsT3B0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAoIWN1c3RvbU1vZGFsRGVmYXVsdHMpIGN1c3RvbU1vZGFsRGVmYXVsdHMgPSB7fTtcclxuICAgICAgICAgICAgY3VzdG9tTW9kYWxEZWZhdWx0cy5iYWNrZHJvcCA9ICdzdGF0aWMnO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zaG93KGN1c3RvbU1vZGFsRGVmYXVsdHMsIGN1c3RvbU1vZGFsT3B0aW9ucyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5zaG93ID0gZnVuY3Rpb24gKGN1c3RvbU1vZGFsRGVmYXVsdHMsIGN1c3RvbU1vZGFsT3B0aW9ucykge1xyXG4gICAgICAgICAgICAvL0NyZWF0ZSB0ZW1wIG9iamVjdHMgdG8gd29yayB3aXRoIHNpbmNlIHdlJ3JlIGluIGEgc2luZ2xldG9uIHNlcnZpY2VcclxuICAgICAgICAgICAgdmFyIHRlbXBNb2RhbERlZmF1bHRzID0ge307XHJcbiAgICAgICAgICAgIHZhciB0ZW1wTW9kYWxPcHRpb25zID0ge307XHJcblxyXG4gICAgICAgICAgICAvL01hcCBhbmd1bGFyLXVpIG1vZGFsIGN1c3RvbSBkZWZhdWx0cyB0byBtb2RhbCBkZWZhdWx0cyBkZWZpbmVkIGluIHNlcnZpY2VcclxuICAgICAgICAgICAgYW5ndWxhci5leHRlbmQodGVtcE1vZGFsRGVmYXVsdHMsIG1vZGFsRGVmYXVsdHMsIGN1c3RvbU1vZGFsRGVmYXVsdHMpO1xyXG5cclxuICAgICAgICAgICAgLy9NYXAgbW9kYWwuaHRtbCAkc2NvcGUgY3VzdG9tIHByb3BlcnRpZXMgdG8gZGVmYXVsdHMgZGVmaW5lZCBpbiBzZXJ2aWNlXHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHRlbXBNb2RhbE9wdGlvbnMsIG1vZGFsT3B0aW9ucywgY3VzdG9tTW9kYWxPcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGVtcE1vZGFsRGVmYXVsdHMuY29udHJvbGxlcikge1xyXG4gICAgICAgICAgICAgICAgdGVtcE1vZGFsRGVmYXVsdHMuY29udHJvbGxlciA9IGZ1bmN0aW9uICgkc2NvcGUsICR1aWJNb2RhbEluc3RhbmNlLCBOb3RpZmljYXRvciwgJHJvb3RTY29wZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubW9kYWxPcHRpb25zID0gdGVtcE1vZGFsT3B0aW9ucztcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubW9kYWxPcHRpb25zLm9rID0gZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLm5ld0ZOYW1lID0gJHNjb3BlLm5ld2ZvbGRlcm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEZpbGVNYW5hZ2VyLkFkZEZvbGRlcigkcm9vdFNjb3BlLnVzZXIsIEpTT04uc3RyaW5naWZ5KHtmb2xkZXI6ICRzY29wZS5uZXdmb2xkZXJuYW1lfSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCduZXdGb2xkZXInLCByZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vdGlmaWNhdG9yLnN1Y2Nlc3MocmVzLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vdGlmaWNhdG9yLmVycm9yKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuY2xvc2UocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5tb2RhbE9wdGlvbnMuY2xvc2UgPSBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiAkdWliTW9kYWwub3Blbih0ZW1wTW9kYWxEZWZhdWx0cykucmVzdWx0O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG59KSgpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vZmlsZXNsaXN0L21vZGFsL2NyZWF0ZWZvbGRlci5zZXJ2aWNlLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnbXlBcHAnKVxyXG4gICAgICAgIC5zZXJ2aWNlKCdlZGl0Rm9sZGVyU2VydmljZScsIGVkaXRGb2xkZXJTZXJ2aWNlKTtcclxuXHJcbiAgICBlZGl0Rm9sZGVyU2VydmljZS4kaW5qZWN0ID0gWyckdWliTW9kYWwnLCAnRmlsZU1hbmFnZXInLCAnTm90aWZpY2F0b3InXTtcclxuICAgIGZ1bmN0aW9uIGVkaXRGb2xkZXJTZXJ2aWNlKCR1aWJNb2RhbCwgRmlsZU1hbmFnZXIsIE5vdGlmaWNhdG9yKSB7XHJcblxyXG4gICAgICAgIHZhciBtb2RhbERlZmF1bHRzID0ge1xyXG4gICAgICAgICAgICBiYWNrZHJvcDogdHJ1ZSxcclxuICAgICAgICAgICAga2V5Ym9hcmQ6IHRydWUsXHJcbiAgICAgICAgICAgIG1vZGFsRmFkZTogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi9hcHAvZmlsZXNsaXN0L21vZGFsL2VkaXRmb2xkZXJNb2RhbC5odG1sJ1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBtb2RhbE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIGNsb3NlQnV0dG9uVGV4dDogJ0Nsb3NlJyxcclxuICAgICAgICAgICAgYWN0aW9uQnV0dG9uVGV4dDogJ09LJyxcclxuICAgICAgICAgICAgaGVhZGVyVGV4dDogJ1Byb2NlZWQ/JyxcclxuICAgICAgICAgICAgYm9keVRleHQ6ICdQZXJmb3JtIHRoaXMgYWN0aW9uPydcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNob3dNb2RhbCA9IGZ1bmN0aW9uIChjdXN0b21Nb2RhbERlZmF1bHRzLCBjdXN0b21Nb2RhbE9wdGlvbnMsIG9iaikge1xyXG4gICAgICAgICAgICBpZiAoIWN1c3RvbU1vZGFsRGVmYXVsdHMpIGN1c3RvbU1vZGFsRGVmYXVsdHMgPSB7fTtcclxuICAgICAgICAgICAgY3VzdG9tTW9kYWxEZWZhdWx0cy5iYWNrZHJvcCA9ICdzdGF0aWMnO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zaG93KGN1c3RvbU1vZGFsRGVmYXVsdHMsIGN1c3RvbU1vZGFsT3B0aW9ucywgb2JqKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNob3cgPSBmdW5jdGlvbiAoY3VzdG9tTW9kYWxEZWZhdWx0cywgY3VzdG9tTW9kYWxPcHRpb25zLCBvYmopIHtcclxuICAgICAgICAgICAgLy9DcmVhdGUgdGVtcCBvYmplY3RzIHRvIHdvcmsgd2l0aCBzaW5jZSB3ZSdyZSBpbiBhIHNpbmdsZXRvbiBzZXJ2aWNlXHJcbiAgICAgICAgICAgIHZhciB0ZW1wTW9kYWxEZWZhdWx0cyA9IHt9O1xyXG4gICAgICAgICAgICB2YXIgdGVtcE1vZGFsT3B0aW9ucyA9IHt9O1xyXG5cclxuICAgICAgICAgICAgLy9NYXAgYW5ndWxhci11aSBtb2RhbCBjdXN0b20gZGVmYXVsdHMgdG8gbW9kYWwgZGVmYXVsdHMgZGVmaW5lZCBpbiBzZXJ2aWNlXHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHRlbXBNb2RhbERlZmF1bHRzLCBtb2RhbERlZmF1bHRzLCBjdXN0b21Nb2RhbERlZmF1bHRzKTtcclxuXHJcbiAgICAgICAgICAgIC8vTWFwIG1vZGFsLmh0bWwgJHNjb3BlIGN1c3RvbSBwcm9wZXJ0aWVzIHRvIGRlZmF1bHRzIGRlZmluZWQgaW4gc2VydmljZVxyXG4gICAgICAgICAgICBhbmd1bGFyLmV4dGVuZCh0ZW1wTW9kYWxPcHRpb25zLCBtb2RhbE9wdGlvbnMsIGN1c3RvbU1vZGFsT3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRlbXBNb2RhbERlZmF1bHRzLmNvbnRyb2xsZXIpIHtcclxuICAgICAgICAgICAgICAgIHRlbXBNb2RhbERlZmF1bHRzLmNvbnRyb2xsZXIgPSBmdW5jdGlvbiAoJHNjb3BlLCAkdWliTW9kYWxJbnN0YW5jZSwgTm90aWZpY2F0b3IsICRyb290U2NvcGUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm1vZGFsT3B0aW9ucyA9IHRlbXBNb2RhbE9wdGlvbnM7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm1vZGFsT3B0aW9ucy5vayA9IGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8kcm9vdFNjb3BlLm5ld0ZOYW1lID0gJHNjb3BlLm5ld2ZvbGRlcm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmZvID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqOiBvYmosXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdmb2xkZXJuYW1lOiAkc2NvcGUubmV3Zm9sZGVybmFtZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBGaWxlTWFuYWdlci5VcGRhdGVGb2xkZXIob2JqLnVzZXIsIG9iai5faWQsIEpTT04uc3RyaW5naWZ5KHtmb2xkZXJuYW1lOiAkc2NvcGUubmV3Zm9sZGVybmFtZX0pKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnbmV3VXBkYXRlZEZvbGRlcicsIGluZm8pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vdGlmaWNhdG9yLnN1Y2Nlc3MocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBOb3RpZmljYXRvci5lcnJvcihyZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubW9kYWxPcHRpb25zLmNsb3NlID0gZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkdWliTW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJHVpYk1vZGFsLm9wZW4odGVtcE1vZGFsRGVmYXVsdHMpLnJlc3VsdDtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxufSkoKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2ZpbGVzbGlzdC9tb2RhbC9lZGl0Zm9sZGVyLnNlcnZpY2UuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdteUFwcCcpXHJcbiAgICAgICAgLnNlcnZpY2UoJ21vZGFsU2VydmljZScsIG1vZGFsU2VydmljZSk7XHJcblxyXG4gICAgbW9kYWxTZXJ2aWNlLiRpbmplY3QgPSBbJyR1aWJNb2RhbCcsICdGaWxlTWFuYWdlcicsICdOb3RpZmljYXRvciddO1xyXG4gICAgZnVuY3Rpb24gbW9kYWxTZXJ2aWNlKCR1aWJNb2RhbCwgRmlsZU1hbmFnZXIsIE5vdGlmaWNhdG9yKSB7XHJcblxyXG4gICAgICAgIHZhciBtb2RhbERlZmF1bHRzID0ge1xyXG4gICAgICAgICAgICBiYWNrZHJvcDogdHJ1ZSxcclxuICAgICAgICAgICAga2V5Ym9hcmQ6IHRydWUsXHJcbiAgICAgICAgICAgIG1vZGFsRmFkZTogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi9hcHAvZmlsZXNsaXN0L21vZGFsL21vZGFsLmh0bWwnXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIG1vZGFsT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgY2xvc2VCdXR0b25UZXh0OiAnQ2xvc2UnLFxyXG4gICAgICAgICAgICBhY3Rpb25CdXR0b25UZXh0OiAnT0snLFxyXG4gICAgICAgICAgICBoZWFkZXJUZXh0OiAnUHJvY2VlZD8nLFxyXG4gICAgICAgICAgICBib2R5VGV4dDogJ1BlcmZvcm0gdGhpcyBhY3Rpb24/J1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuc2hvd01vZGFsID0gZnVuY3Rpb24gKGN1c3RvbU1vZGFsRGVmYXVsdHMsIGN1c3RvbU1vZGFsT3B0aW9ucywgb2JqKSB7XHJcbiAgICAgICAgICAgIGlmICghY3VzdG9tTW9kYWxEZWZhdWx0cykgY3VzdG9tTW9kYWxEZWZhdWx0cyA9IHt9O1xyXG4gICAgICAgICAgICBjdXN0b21Nb2RhbERlZmF1bHRzLmJhY2tkcm9wID0gJ3N0YXRpYyc7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNob3coY3VzdG9tTW9kYWxEZWZhdWx0cywgY3VzdG9tTW9kYWxPcHRpb25zLCBvYmopO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuc2hvdyA9IGZ1bmN0aW9uIChjdXN0b21Nb2RhbERlZmF1bHRzLCBjdXN0b21Nb2RhbE9wdGlvbnMsIG9iaikge1xyXG4gICAgICAgICAgICAvL0NyZWF0ZSB0ZW1wIG9iamVjdHMgdG8gd29yayB3aXRoIHNpbmNlIHdlJ3JlIGluIGEgc2luZ2xldG9uIHNlcnZpY2VcclxuICAgICAgICAgICAgdmFyIHRlbXBNb2RhbERlZmF1bHRzID0ge307XHJcbiAgICAgICAgICAgIHZhciB0ZW1wTW9kYWxPcHRpb25zID0ge307XHJcblxyXG4gICAgICAgICAgICAvL01hcCBhbmd1bGFyLXVpIG1vZGFsIGN1c3RvbSBkZWZhdWx0cyB0byBtb2RhbCBkZWZhdWx0cyBkZWZpbmVkIGluIHNlcnZpY2VcclxuICAgICAgICAgICAgYW5ndWxhci5leHRlbmQodGVtcE1vZGFsRGVmYXVsdHMsIG1vZGFsRGVmYXVsdHMsIGN1c3RvbU1vZGFsRGVmYXVsdHMpO1xyXG5cclxuICAgICAgICAgICAgLy9NYXAgbW9kYWwuaHRtbCAkc2NvcGUgY3VzdG9tIHByb3BlcnRpZXMgdG8gZGVmYXVsdHMgZGVmaW5lZCBpbiBzZXJ2aWNlXHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHRlbXBNb2RhbE9wdGlvbnMsIG1vZGFsT3B0aW9ucywgY3VzdG9tTW9kYWxPcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGVtcE1vZGFsRGVmYXVsdHMuY29udHJvbGxlcikge1xyXG4gICAgICAgICAgICAgICAgdGVtcE1vZGFsRGVmYXVsdHMuY29udHJvbGxlciA9IGZ1bmN0aW9uICgkc2NvcGUsICR1aWJNb2RhbEluc3RhbmNlLCBOb3RpZmljYXRvciwgJHJvb3RTY29wZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubW9kYWxPcHRpb25zID0gdGVtcE1vZGFsT3B0aW9ucztcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubW9kYWxPcHRpb25zLm9rID0gZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLm5ld0ZOYW1lID0gJHNjb3BlLm5ld2ZpbGVuYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBGaWxlTWFuYWdlci5VcGRhdGVGaWxlKG9iai51c2VyLCBvYmouX2lkLCBKU09OLnN0cmluZ2lmeSh7ZmlsZW5hbWU6ICRzY29wZS5uZXdmaWxlbmFtZSwgZm9sZGVybmFtZTogb2JqLmZvbGRlcn0pKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vdGlmaWNhdG9yLnN1Y2Nlc3MocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBOb3RpZmljYXRvci5lcnJvcihyZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubW9kYWxPcHRpb25zLmNsb3NlID0gZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkdWliTW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJHVpYk1vZGFsLm9wZW4odGVtcE1vZGFsRGVmYXVsdHMpLnJlc3VsdDtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxufSkoKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2ZpbGVzbGlzdC9tb2RhbC9tb2RhbC5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ215QXBwJylcclxuICAgICAgICAuc2VydmljZSgncmVwbGFjZUZpbGVNb2RhbFNlcnZpY2UnLCByZXBsYWNlRmlsZU1vZGFsU2VydmljZSk7XHJcblxyXG4gICAgcmVwbGFjZUZpbGVNb2RhbFNlcnZpY2UuJGluamVjdCA9IFsnJHVpYk1vZGFsJywgJ0ZpbGVNYW5hZ2VyJywgJ05vdGlmaWNhdG9yJ107XHJcbiAgICBmdW5jdGlvbiByZXBsYWNlRmlsZU1vZGFsU2VydmljZSgkdWliTW9kYWwsIEZpbGVNYW5hZ2VyLCBOb3RpZmljYXRvcikge1xyXG5cclxuICAgICAgICB2YXIgbW9kYWxEZWZhdWx0cyA9IHtcclxuICAgICAgICAgICAgYmFja2Ryb3A6IHRydWUsXHJcbiAgICAgICAgICAgIGtleWJvYXJkOiB0cnVlLFxyXG4gICAgICAgICAgICBtb2RhbEZhZGU6IHRydWUsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vYXBwL2ZpbGVzbGlzdC9tb2RhbC9yZXBsYWNlZmlsZU1vZGFsLmh0bWwnXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIG1vZGFsT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgY2xvc2VCdXR0b25UZXh0OiAnQ2xvc2UnLFxyXG4gICAgICAgICAgICBhY3Rpb25CdXR0b25UZXh0OiAnT0snLFxyXG4gICAgICAgICAgICBoZWFkZXJUZXh0OiAnUHJvY2VlZD8nLFxyXG4gICAgICAgICAgICBib2R5VGV4dDogJ1BlcmZvcm0gdGhpcyBhY3Rpb24/J1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuc2hvd01vZGFsID0gZnVuY3Rpb24gKGN1c3RvbU1vZGFsRGVmYXVsdHMsIGN1c3RvbU1vZGFsT3B0aW9ucywgb2JqKSB7XHJcbiAgICAgICAgICAgIGlmICghY3VzdG9tTW9kYWxEZWZhdWx0cykgY3VzdG9tTW9kYWxEZWZhdWx0cyA9IHt9O1xyXG4gICAgICAgICAgICBjdXN0b21Nb2RhbERlZmF1bHRzLmJhY2tkcm9wID0gJ3N0YXRpYyc7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNob3coY3VzdG9tTW9kYWxEZWZhdWx0cywgY3VzdG9tTW9kYWxPcHRpb25zLCBvYmopO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuc2hvdyA9IGZ1bmN0aW9uIChjdXN0b21Nb2RhbERlZmF1bHRzLCBjdXN0b21Nb2RhbE9wdGlvbnMsIG9iaikge1xyXG4gICAgICAgICAgICAvL0NyZWF0ZSB0ZW1wIG9iamVjdHMgdG8gd29yayB3aXRoIHNpbmNlIHdlJ3JlIGluIGEgc2luZ2xldG9uIHNlcnZpY2VcclxuICAgICAgICAgICAgdmFyIHRlbXBNb2RhbERlZmF1bHRzID0ge307XHJcbiAgICAgICAgICAgIHZhciB0ZW1wTW9kYWxPcHRpb25zID0ge307XHJcblxyXG4gICAgICAgICAgICAvL01hcCBhbmd1bGFyLXVpIG1vZGFsIGN1c3RvbSBkZWZhdWx0cyB0byBtb2RhbCBkZWZhdWx0cyBkZWZpbmVkIGluIHNlcnZpY2VcclxuICAgICAgICAgICAgYW5ndWxhci5leHRlbmQodGVtcE1vZGFsRGVmYXVsdHMsIG1vZGFsRGVmYXVsdHMsIGN1c3RvbU1vZGFsRGVmYXVsdHMpO1xyXG5cclxuICAgICAgICAgICAgLy9NYXAgbW9kYWwuaHRtbCAkc2NvcGUgY3VzdG9tIHByb3BlcnRpZXMgdG8gZGVmYXVsdHMgZGVmaW5lZCBpbiBzZXJ2aWNlXHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHRlbXBNb2RhbE9wdGlvbnMsIG1vZGFsT3B0aW9ucywgY3VzdG9tTW9kYWxPcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGVtcE1vZGFsRGVmYXVsdHMuY29udHJvbGxlcikge1xyXG4gICAgICAgICAgICAgICAgdGVtcE1vZGFsRGVmYXVsdHMuY29udHJvbGxlciA9IGZ1bmN0aW9uICgkc2NvcGUsICR1aWJNb2RhbEluc3RhbmNlLCBOb3RpZmljYXRvciwgJHJvb3RTY29wZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5mb2xkZXJzTCA9ICRyb290U2NvcGUuZm9sZGVyc0xpc3Q7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5tb2RhbE9wdGlvbnMgPSB0ZW1wTW9kYWxPcHRpb25zO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5tb2RhbE9wdGlvbnMub2sgPSBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmbmFtZSA9ICRzY29wZS5kZXN0aW5hdGlvbkZvZGxlcjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmbmFtZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbmFtZSA9ICdNYWluJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhvYmopO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBGaWxlTWFuYWdlci5VcGRhdGVGaWxlKCRyb290U2NvcGUudXNlciwgb2JqLl9pZCwgSlNPTi5zdHJpbmdpZnkoe2ZpbGVuYW1lOiBvYmoudGl0bGUsIGZvbGRlcm5hbWU6IGZuYW1lfSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhmbmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCduZXdGaWxlRGVzdGluYXRpb24nLCByZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZmQuZ2V0KCdmaWxlJykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vdGlmaWNhdG9yLnN1Y2Nlc3MocmVzLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBOb3RpZmljYXRvci5lcnJvcihyZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vbG9naWMgaGVyZVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyokcm9vdFNjb3BlLm5ld0ZOYW1lID0gJHNjb3BlLm5ld2ZpbGVuYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBGaWxlTWFuYWdlci5VcGRhdGVGaWxlKG9iai51c2VyLCBvYmouX2lkLCBKU09OLnN0cmluZ2lmeSh7ZmlsZW5hbWU6ICRzY29wZS5uZXdmaWxlbmFtZX0pKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vdGlmaWNhdG9yLnN1Y2Nlc3MocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBOb3RpZmljYXRvci5lcnJvcihyZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7Ki9cclxuICAgICAgICAgICAgICAgICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuY2xvc2UocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5tb2RhbE9wdGlvbnMuY2xvc2UgPSBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiAkdWliTW9kYWwub3Blbih0ZW1wTW9kYWxEZWZhdWx0cykucmVzdWx0O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG59KSgpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vZmlsZXNsaXN0L21vZGFsL3JlcGxhY2VmaWxlLnNlcnZpY2UuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdteUFwcCcpXHJcbiAgICAgICAgLnNlcnZpY2UoJ3VwbG9hZEZpbGVNb2RhbFNlcnZpY2UnLCB1cGxvYWRGaWxlTW9kYWxTZXJ2aWNlKTtcclxuXHJcbiAgICB1cGxvYWRGaWxlTW9kYWxTZXJ2aWNlLiRpbmplY3QgPSBbJyR1aWJNb2RhbCcsICdGaWxlTWFuYWdlcicsICdOb3RpZmljYXRvcicsICdVcGxvYWQnXTtcclxuICAgIGZ1bmN0aW9uIHVwbG9hZEZpbGVNb2RhbFNlcnZpY2UoJHVpYk1vZGFsLCBGaWxlTWFuYWdlciwgTm90aWZpY2F0b3IsIFVwbG9hZCkge1xyXG5cclxuICAgICAgICB2YXIgbW9kYWxEZWZhdWx0cyA9IHtcclxuICAgICAgICAgICAgYmFja2Ryb3A6IHRydWUsXHJcbiAgICAgICAgICAgIGtleWJvYXJkOiB0cnVlLFxyXG4gICAgICAgICAgICBtb2RhbEZhZGU6IHRydWUsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vYXBwL2ZpbGVzbGlzdC9tb2RhbC91cGxvYWRNb2RhbC5odG1sJ1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBtb2RhbE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIGNsb3NlQnV0dG9uVGV4dDogJ0Nsb3NlJyxcclxuICAgICAgICAgICAgYWN0aW9uQnV0dG9uVGV4dDogJ09LJyxcclxuICAgICAgICAgICAgaGVhZGVyVGV4dDogJ1Byb2NlZWQ/JyxcclxuICAgICAgICAgICAgYm9keVRleHQ6ICdQZXJmb3JtIHRoaXMgYWN0aW9uPydcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNob3dNb2RhbCA9IGZ1bmN0aW9uIChjdXN0b21Nb2RhbERlZmF1bHRzLCBjdXN0b21Nb2RhbE9wdGlvbnMsIG9iaikge1xyXG4gICAgICAgICAgICBpZiAoIWN1c3RvbU1vZGFsRGVmYXVsdHMpIGN1c3RvbU1vZGFsRGVmYXVsdHMgPSB7fTtcclxuICAgICAgICAgICAgY3VzdG9tTW9kYWxEZWZhdWx0cy5iYWNrZHJvcCA9ICdzdGF0aWMnO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zaG93KGN1c3RvbU1vZGFsRGVmYXVsdHMsIGN1c3RvbU1vZGFsT3B0aW9ucywgb2JqKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNob3cgPSBmdW5jdGlvbiAoY3VzdG9tTW9kYWxEZWZhdWx0cywgY3VzdG9tTW9kYWxPcHRpb25zLCBvYmopIHtcclxuICAgICAgICAgICAgLy9DcmVhdGUgdGVtcCBvYmplY3RzIHRvIHdvcmsgd2l0aCBzaW5jZSB3ZSdyZSBpbiBhIHNpbmdsZXRvbiBzZXJ2aWNlXHJcbiAgICAgICAgICAgIHZhciB0ZW1wTW9kYWxEZWZhdWx0cyA9IHt9O1xyXG4gICAgICAgICAgICB2YXIgdGVtcE1vZGFsT3B0aW9ucyA9IHt9O1xyXG5cclxuICAgICAgICAgICAgLy9NYXAgYW5ndWxhci11aSBtb2RhbCBjdXN0b20gZGVmYXVsdHMgdG8gbW9kYWwgZGVmYXVsdHMgZGVmaW5lZCBpbiBzZXJ2aWNlXHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHRlbXBNb2RhbERlZmF1bHRzLCBtb2RhbERlZmF1bHRzLCBjdXN0b21Nb2RhbERlZmF1bHRzKTtcclxuXHJcbiAgICAgICAgICAgIC8vTWFwIG1vZGFsLmh0bWwgJHNjb3BlIGN1c3RvbSBwcm9wZXJ0aWVzIHRvIGRlZmF1bHRzIGRlZmluZWQgaW4gc2VydmljZVxyXG4gICAgICAgICAgICBhbmd1bGFyLmV4dGVuZCh0ZW1wTW9kYWxPcHRpb25zLCBtb2RhbE9wdGlvbnMsIGN1c3RvbU1vZGFsT3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRlbXBNb2RhbERlZmF1bHRzLmNvbnRyb2xsZXIpIHtcclxuICAgICAgICAgICAgICAgIHRlbXBNb2RhbERlZmF1bHRzLmNvbnRyb2xsZXIgPSBmdW5jdGlvbiAoJHNjb3BlLCAkdWliTW9kYWxJbnN0YW5jZSwgTm90aWZpY2F0b3IsICRyb290U2NvcGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm9sZGVyc0wgPSAkcm9vdFNjb3BlLmZvbGRlcnNMaXN0O1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS51cGxvYWRGaWxlID0gZnVuY3Rpb24gKCRmaWxlLCAkZXJyRmlsZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVwbG9hZGZpbGVuYW1lID0gJGZpbGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkZmlsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLypmaWxlLnVwbG9hZCA9IFVwbG9hZC51cGxvYWQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MTMzNy9hcGkvdXNlcnMvJyArIHVzZXJfbmFtZSArICcvZmlsZXMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtmaWxlOiBmaWxlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlLnVwbG9hZC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlLnJlc3VsdCA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmVycm9yTXNnID0gcmVzcG9uc2Uuc3RhdHVzICsgJzogJyArIHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGUucHJvZ3Jlc3MgPSBNYXRoLm1pbigxMDAsIHBhcnNlSW50KDEwMC4wICpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldnQubG9hZGVkIC8gZXZ0LnRvdGFsKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7Ki9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coZmlsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdmaWxlIHdhcyBzdWNjZXNzZnVsbHkgc2VsZWN0ZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5tb2RhbE9wdGlvbnMgPSB0ZW1wTW9kYWxPcHRpb25zO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5tb2RhbE9wdGlvbnMub2sgPSBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmbmFtZSA9ICRzY29wZS5kZXN0aW5hdGlvbkZvZGxlcjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmbmFtZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbmFtZSA9ICdNYWluJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZkID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZkLmFwcGVuZCgnZmlsZScsICRzY29wZS51cGxvYWRmaWxlbmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBGaWxlTWFuYWdlci5BZGRGaWxlKCRyb290U2NvcGUudXNlciwgZmQsIGZuYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2cocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ25ld1VwbG9hZGVkRmlsZScsIHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhmZC5nZXQoJ2ZpbGUnKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTm90aWZpY2F0b3Iuc3VjY2VzcyhyZXMubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2VycicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vdGlmaWNhdG9yLmVycm9yKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9sb2dpYyBoZXJlXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiRyb290U2NvcGUubmV3Rk5hbWUgPSAkc2NvcGUubmV3ZmlsZW5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEZpbGVNYW5hZ2VyLlVwZGF0ZUZpbGUob2JqLnVzZXIsIG9iai5faWQsIEpTT04uc3RyaW5naWZ5KHtmaWxlbmFtZTogJHNjb3BlLm5ld2ZpbGVuYW1lfSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTm90aWZpY2F0b3Iuc3VjY2VzcyhyZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vdGlmaWNhdG9yLmVycm9yKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTsqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkdWliTW9kYWxJbnN0YW5jZS5jbG9zZShyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm1vZGFsT3B0aW9ucy5jbG9zZSA9IGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuICR1aWJNb2RhbC5vcGVuKHRlbXBNb2RhbERlZmF1bHRzKS5yZXN1bHQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcbn0pKCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9maWxlc2xpc3QvbW9kYWwvdXBsb2FkZmlsZS5zZXJ2aWNlLmpzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCdcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnbXlBcHAnKVxyXG4gICAgICAgIC5mYWN0b3J5KCdBdXRoTWFuYWdlcicsIEF1dGhNYW5hZ2VyKTtcclxuXHJcbiAgICBBdXRoTWFuYWdlci4kaW5qZWN0ID0gWyckaHR0cCddO1xyXG5cclxuICAgIGZ1bmN0aW9uIEF1dGhNYW5hZ2VyKCRodHRwKSB7XHJcbiAgICAgICAgdmFyIHNlcnZpY2UgPSB7fTtcclxuICAgICAgICBzZXJ2aWNlLkdldFVzZXIgPSBHZXRVc2VyO1xyXG5cclxuICAgICAgICByZXR1cm4gc2VydmljZTtcclxuICAgICAgICBcclxuICAgICAgICAvL2ZvciB1c2VyXHJcbiAgICAgICAgZnVuY3Rpb24gR2V0VXNlcih1c2VyZGF0YSkge1xyXG4gICAgICAgICAgICB2YXIgdXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6MTMzNy9hcGkvdXNlcnMnO1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCh1cmwsIHVzZXJkYXRhKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oaGFuZGxlU3VjY2VzcywgaGFuZGxlRXJyb3IpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9vdGhlciBmdW5jdGlvbnNcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlU3VjY2VzcyhyZXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5kYXRhO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlRXJyb3IocmVzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXM7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbG9naW4vYXV0aGVudGlmaWNhdGlvbi5zZXJ2aWNlLmpzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCdcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnbXlBcHAnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBMb2dpbkN0cmwpO1xyXG5cclxuICAgIExvZ2luQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsICckbG9jYXRpb24nLCAnQXV0aE1hbmFnZXInLCAnTm90aWZpY2F0b3InXTtcclxuXHJcbiAgICBmdW5jdGlvbiBMb2dpbkN0cmwoJHNjb3BlLCAkcm9vdFNjb3BlLCAkbG9jYXRpb24sIEF1dGhNYW5hZ2VyLCBOb3RpZmljYXRvcil7XHJcbiAgICBcdCRzY29wZS51c2VyO1xyXG4gICAgICAgICRzY29wZS5mdWxsVXNlckRhdGE7XHJcblxyXG4gICAgICAgICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS51c2VyKTtcclxuICAgICAgICAgICAgQXV0aE1hbmFnZXIuR2V0VXNlcihKU09OLnN0cmluZ2lmeSgkc2NvcGUudXNlcikpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXMpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYocmVzLnVzZXJkYXRhID09PSAndW5kZWZpbmQnKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnJlc3BvbnNlRXJyb3JNc2cgPSByZXMubWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZ1bGxVc2VyRGF0YSA9IHJlcy51c2VyZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXJkYXRhJywgSlNPTi5zdHJpbmdpZnkoJHNjb3BlLnVzZXIpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgTm90aWZpY2F0b3Iuc3VjY2VzcygnSGV5IHRoZXJlLCAnICsgJHNjb3BlLmZ1bGxVc2VyRGF0YS5maXJzdE5hbWUgKyAnICcgKyRzY29wZS5mdWxsVXNlckRhdGEubGFzdE5hbWUgKyAnICEnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS51c2VyID0gJHNjb3BlLnVzZXIudXNlcm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCdsaXN0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzKXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3InKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAvLyRzY29wZS5yZXNwb25zZUVycm9yTXNnID0gJ0luY29ycmVjdCB1c2VybmFtZSBvciBwYXNzd29yZCc7XHJcbiAgICAgICAvLyRzY29wZS5yZXNwb25zZUVycm9yTXNnID0gJyc7XHJcbiAgICB9XHJcbn0pKCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9sb2dpbi9sb2dpbi5jb250cm9sbGVyLmpzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnbXlBcHAnKVxuICAgICAgICAuY29uZmlnKG5vdGlmaWNhdG9yQ29uZmlnKVxuICAgICAgICAuZmFjdG9yeSgnTm90aWZpY2F0b3InLCBOb3RpZmljYXRvcilcbiAgICAgICAgLnJ1bihub3RpZmljYXRpb25zUnVuKTtcblxuICAgIE5vdGlmaWNhdG9yLiRpbmplY3QgPSBbJ3RvYXN0ciddO1xuICAgIGZ1bmN0aW9uIE5vdGlmaWNhdG9yKHRvYXN0cikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24obXNnLCB0aXRsZSkge1xuICAgICAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKG1zZywgdGl0bGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdhcm5pbmc6IGZ1bmN0aW9uKG1zZywgdGl0bGUpIHtcbiAgICAgICAgICAgICAgICB0b2FzdHIud2FybmluZyhtc2csIHRpdGxlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24obXNnLCB0aXRsZSkge1xuICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvcihtc2csIHRpdGxlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbmZvOiBmdW5jdGlvbihtc2csIHRpdGxlKSB7XG4gICAgICAgICAgICAgICAgdG9hc3RyLmluZm8obXNnLCB0aXRsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBub3RpZmljYXRpb25zUnVuLiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAnTm90aWZpY2F0b3InLCAnJHRpbWVvdXQnXTtcbiAgICBmdW5jdGlvbiBub3RpZmljYXRpb25zUnVuKCRyb290U2NvcGUsIG5vdGlmaWNhdG9yLCAkdGltZW91dCkge1xuICAgICAgICAvKiRyb290U2NvcGUuJG9uKCckdXNlckxvZ2dlZEluJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBub3RpZmljYXRvci5zdWNjZXNzKCdIZXkgdGhlcmUhJyk7XG5cbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgbm90aWZpY2F0b3IuaW5mbygnV2VsY29tZSB0byB0aGlzIGZyZWUgYW5ndWxhciBkYXNoYm9hcmQgc2VlZCBwcm9qZWN0LCcgK1xuICAgICAgICAgICAgICAgICcgdGhhdCB5b3UgbWF5IHVzZSB0byBib290c3RyYXAgeW91ciBuZXh0IHdlYiBhcHAhJywge1xuICAgICAgICAgICAgICAgICAgICB0aW1lT3V0OiAxMDAwMFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwzMDAwKTtcblxuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBub3RpZmljYXRvci5pbmZvKCdCdHcsIGZlZWwgZnJlZSB0byBjb250cmlidXRlIHRvIHRoaXMgcHJvamVjdCBhbmQgaGVscCB1cyBraWxsIHRoZSBwYWlkIHRlbXBsYXRlcyBtYXJrZXQgOyknLCB7XG4gICAgICAgICAgICAgICAgICAgIHRpbWVPdXQ6IDEwMDAwXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LDE1MDAwKVxuICAgICAgICB9KTtcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJyR1c2VyTG9nZ2VkT3V0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBub3RpZmljYXRvci5zdWNjZXNzKCdMb2dnZWQgb3V0IHN1Y2Nlc3NmdWxseScpO1xuICAgICAgICB9KTsqL1xuICAgICAgICBjb25zb2xlLmxvZygnbm90aWZpY2F0aW9uc1J1biB3b3JrcyEnKTtcbiAgICB9XG5cbiAgICBub3RpZmljYXRvckNvbmZpZy4kaW5qZWN0ID0gWyd0b2FzdHJDb25maWcnXTtcbiAgICBmdW5jdGlvbiBub3RpZmljYXRvckNvbmZpZyh0b2FzdHJDb25maWcpIHtcbiAgICAgICAgYW5ndWxhci5leHRlbmQodG9hc3RyQ29uZmlnLCB7XG4gICAgICAgICAgICB0aW1lT3V0OiAzMDAwXG4gICAgICAgIH0pO1xuICAgIH1cblxufSkoKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm90aWZpY2F0b3Ivbm90aWZpY2F0aW9ucy5qc1xuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdteUFwcCcpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnd2lkZ2V0Jywgd2lkZ2V0KTtcclxuXHJcbiAgICBmdW5jdGlvbiB3aWRnZXQoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgJGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgJGVsZW1lbnQuYWRkQ2xhc3MoJ3dpZGdldCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxyXG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJ1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG59KSgpO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3dpZGdldC93aWRnZXQuanNcbi8vIG1vZHVsZSBpZCA9IDExXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImFuZ3VsYXIubW9kdWxlKCdteUFwcCcsIFsndG9hc3RyJywgJ25nQW5pbWF0ZScsICd1aS5ib290c3RyYXAnLCAnbmdGaWxlVXBsb2FkJywgJ25nUm91dGUnXSk7XHJcblxyXG5hbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnbXlBcHAnKVxyXG4gICAgICAgIC5jb25maWcoWyckcm91dGVQcm92aWRlcicsICckbG9jYXRpb25Qcm92aWRlcicsIGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcil7XHJcbiAgICAgICAgXHQkcm91dGVQcm92aWRlci53aGVuKCcvbGlzdCcsIHtcclxuICAgIFx0XHRcdHRlbXBsYXRlVXJsOiAnLi9hcHAvdGVtcGxhdGVzL2xpc3QuaHRtbCdcclxuICAgIFx0XHR9KTtcclxuICAgIFx0XHQkcm91dGVQcm92aWRlci53aGVuKCcvbG9naW4nLCB7XHJcbiAgICBcdFx0XHR0ZW1wbGF0ZVVybDogJy4vYXBwL3RlbXBsYXRlcy9sb2dpbi5odG1sJ1xyXG4gICAgXHRcdH0pO1xyXG4gICAgXHRcdCRyb3V0ZVByb3ZpZGVyLndoZW4oJy9saXN0Lzpmb2xkZXJuYW1lJywge1xyXG4gICAgXHRcdFx0dGVtcGxhdGVVcmw6ICcuL2FwcC90ZW1wbGF0ZXMvZm9sZGVyLmh0bWwnXHJcbiAgICBcdFx0fSk7XHJcbiAgICAgICAgfV0pO1xyXG5cclxucmVxdWlyZSgnLi9maWxlc2xpc3QvbGlzdC5jb250cm9sbGVyJyk7XHJcbnJlcXVpcmUoJy4vZmlsZXNsaXN0L2ZpbGVtYW5hZ2VyLnNlcnZpY2UnKTtcclxucmVxdWlyZSgnLi93aWRnZXQvd2lkZ2V0Jyk7XHJcbnJlcXVpcmUoJy4vbm90aWZpY2F0b3Ivbm90aWZpY2F0aW9ucycpO1xyXG5yZXF1aXJlKCcuL2ZpbGVzbGlzdC9tb2RhbC9tb2RhbCcpO1xyXG5yZXF1aXJlKCcuL2ZpbGVzbGlzdC9tb2RhbC91cGxvYWRmaWxlLnNlcnZpY2UnKTtcclxucmVxdWlyZSgnLi9maWxlc2xpc3QvbW9kYWwvZWRpdGZvbGRlci5zZXJ2aWNlJyk7XHJcbnJlcXVpcmUoJy4vZmlsZXNsaXN0L21vZGFsL2NyZWF0ZWZvbGRlci5zZXJ2aWNlJyk7XHJcbnJlcXVpcmUoJy4vZmlsZXNsaXN0L21vZGFsL3JlcGxhY2VmaWxlLnNlcnZpY2UnKTtcclxucmVxdWlyZSgnLi9kZWZhdWx0Q3RybC9kZWZhdWx0LmNvbnRyb2xsZXInKTtcclxucmVxdWlyZSgnLi9sb2dpbi9hdXRoZW50aWZpY2F0aW9uLnNlcnZpY2UnKTtcclxucmVxdWlyZSgnLi9sb2dpbi9sb2dpbi5jb250cm9sbGVyJyk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9hcHAuanNcbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBOzs7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQzFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0EiLCJzb3VyY2VSb290IjoiIn0=