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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
/* 1 */
/***/ (function(module, exports) {

(function () {
    'use strict'

    angular
        .module('myApp')
        .controller('FilesList', FilesList);

    FilesList.$inject = [
        '$scope',
        'FileManager',
        'Notificator',
        'modalService',
        '$rootScope',
        'Upload',
        'uploadFileModalService',
        'editFolderService',
        'createFolderService'
    ];

    function FilesList($scope, FileManager, Notificator, modalService, $rootScope, Upload, uploadFileModalService, editFolderService, createFolderService) {
        var user_name = 'mharbisherr';
        $rootScope.user = user_name;

        $scope.nm = user_name;
    
        //get files
        FileManager.GetAllFiles(user_name)
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

        //get folders
        FileManager.GetAllFolders(user_name)
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
/* 2 */
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
/* 3 */
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
/* 4 */
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
/* 5 */
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
/* 6 */
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

angular.module('myApp', ['toastr', 'ngAnimate', 'ui.bootstrap', 'ngFileUpload']);

__webpack_require__(1);
__webpack_require__(0);
__webpack_require__(6);
__webpack_require__(5);
__webpack_require__(3);
__webpack_require__(4);
__webpack_require__(2);
__webpack_require__(8);

/***/ }),
/* 8 */
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

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmJ1bmRsZS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBjYWNlYmY1ZmJjZTdkYWFmOTQ5YSIsIndlYnBhY2s6Ly8vLi9maWxlc2xpc3QvZmlsZW1hbmFnZXIuc2VydmljZS5qcyIsIndlYnBhY2s6Ly8vLi9maWxlc2xpc3QvbGlzdC5jb250cm9sbGVyLmpzIiwid2VicGFjazovLy8uL2ZpbGVzbGlzdC9tb2RhbC9lZGl0Zm9sZGVyLnNlcnZpY2UuanMiLCJ3ZWJwYWNrOi8vLy4vZmlsZXNsaXN0L21vZGFsL21vZGFsLmpzIiwid2VicGFjazovLy8uL2ZpbGVzbGlzdC9tb2RhbC91cGxvYWRmaWxlLnNlcnZpY2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm90aWZpY2F0b3Ivbm90aWZpY2F0aW9ucy5qcyIsIndlYnBhY2s6Ly8vLi93aWRnZXQvd2lkZ2V0LmpzIiwid2VicGFjazovLy8uL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9maWxlc2xpc3QvbW9kYWwvY3JlYXRlZm9sZGVyLnNlcnZpY2UuanMiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA3KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBjYWNlYmY1ZmJjZTdkYWFmOTQ5YSIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCdcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnbXlBcHAnKVxyXG4gICAgICAgIC5mYWN0b3J5KCdGaWxlTWFuYWdlcicsIEZpbGVNYW5hZ2VyKTtcclxuXHJcbiAgICBGaWxlTWFuYWdlci4kaW5qZWN0ID0gWyckaHR0cCddO1xyXG5cclxuICAgIGZ1bmN0aW9uIEZpbGVNYW5hZ2VyKCRodHRwKSB7XHJcbiAgICAgICAgdmFyIHNlcnZpY2UgPSB7fTtcclxuXHJcbiAgICAgICAgLy9mb3IgZmlsZXNcclxuICAgICAgICBzZXJ2aWNlLkdldEFsbEZpbGVzID0gR2V0QWxsRmlsZXM7XHJcbiAgICAgICAgc2VydmljZS5VcGRhdGVGaWxlID0gVXBkYXRlRmlsZTtcclxuICAgICAgICBzZXJ2aWNlLkRlbGV0ZUZpbGUgPSBEZWxldGVGaWxlO1xyXG4gICAgICAgIHNlcnZpY2UuQWRkRmlsZSA9IEFkZEZpbGU7XHJcblxyXG4gICAgICAgIC8vZm9yIGZvbGRlcnNcclxuICAgICAgICBzZXJ2aWNlLkdldEFsbEZvbGRlcnMgPSBHZXRBbGxGb2xkZXJzO1xyXG4gICAgICAgIHNlcnZpY2UuVXBkYXRlRm9sZGVyID0gVXBkYXRlRm9sZGVyO1xyXG4gICAgICAgIHNlcnZpY2UuRGVsZXRlRm9sZGVyID0gRGVsZXRlRm9sZGVyO1xyXG4gICAgICAgIHNlcnZpY2UuQWRkRm9sZGVyID0gQWRkRm9sZGVyO1xyXG5cclxuICAgICAgICByZXR1cm4gc2VydmljZTtcclxuICAgICAgICBcclxuICAgICAgICAvL2ZvciBmaWxlc1xyXG4gICAgICAgIGZ1bmN0aW9uIEdldEFsbEZpbGVzKHVzZXJfbmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgdXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6MTMzNy9hcGkvdXNlcnMvJyArIHVzZXJfbmFtZSArICcvZmlsZXMnO1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHVybClcclxuICAgICAgICAgICAgICAgIC50aGVuKGhhbmRsZVN1Y2Nlc3MsIGhhbmRsZUVycm9yKCdFcnJvciBnZXR0aW5nIGFsbCBmaWxlcycpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gVXBkYXRlRmlsZSh1c2VyX25hbWUsIGZpbGVfaWQsIGRhdGEpIHtcclxuICAgICAgICAgICAgdmFyIHVybCA9ICdodHRwOi8vbG9jYWxob3N0OjEzMzcvYXBpL3VzZXJzLycgKyB1c2VyX25hbWUgKyAnL2ZpbGVzLycgKyBmaWxlX2lkO1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KHVybCwgZGF0YSlcclxuICAgICAgICAgICAgICAgIC50aGVuKGhhbmRsZVN1Y2Nlc3MsIGhhbmRsZUVycm9yKCdFcnJvciB1cGRhdGluZyBmaWxlJykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gRGVsZXRlRmlsZSh1c2VyX25hbWUsIGZpbGVfaWQpIHtcclxuICAgICAgICAgICAgdmFyIHVybCA9ICdodHRwOi8vbG9jYWxob3N0OjEzMzcvYXBpL3VzZXJzLycgKyB1c2VyX25hbWUgKyAnL2ZpbGVzLycgKyBmaWxlX2lkO1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKHVybClcclxuICAgICAgICAgICAgICAgIC50aGVuKGhhbmRsZVN1Y2Nlc3MsIGhhbmRsZUVycm9yKCdFcnJvciBkZWxldGluZyBmaWxlJykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gQWRkRmlsZSh1c2VyX25hbWUsIGZpbGUsIGZvbGRlcnNuYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdDoxMzM3L2FwaS91c2Vycy8nICsgdXNlcl9uYW1lICsgJy9maWxlcyc7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KHVybCwgZmlsZSwge1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJYLVRlc3RpbmdcIiA6IGZvbGRlcnNuYW1lXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtUmVxdWVzdDogYW5ndWxhci5pZGVudGl0eVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oaGFuZGxlU3VjY2VzczIsIGhhbmRsZUVycm9yKCdFcnJvciB3aGlsZSBhZGQgZmlsZScpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vZm9yIGZvbGRlcnNcclxuICAgICAgICBmdW5jdGlvbiBHZXRBbGxGb2xkZXJzKHVzZXJfbmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgdXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6MTMzNy9hcGkvdXNlcnMvJyArIHVzZXJfbmFtZSArICcvZm9sZGVycyc7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQodXJsKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oaGFuZGxlU3VjY2VzcywgaGFuZGxlRXJyb3IoJ0Vycm9yIGdldHRpbmcgYWxsIGZvbGRlcnMnKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIFVwZGF0ZUZvbGRlcih1c2VyX25hbWUsIGZvbGRlcl9pZCwgZGF0YSkge1xyXG4gICAgICAgICAgICB2YXIgdXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6MTMzNy9hcGkvdXNlcnMvJyArIHVzZXJfbmFtZSArICcvZm9sZGVycy8nICsgZm9sZGVyX2lkO1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KHVybCwgZGF0YSlcclxuICAgICAgICAgICAgICAgIC50aGVuKGhhbmRsZVN1Y2Nlc3MsIGhhbmRsZUVycm9yKCdFcnJvciB1cGRhdGluZyBmaWxlJykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gRGVsZXRlRm9sZGVyKHVzZXJfbmFtZSwgZm9sZGVyX2lkKSB7XHJcbiAgICAgICAgICAgIHZhciB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdDoxMzM3L2FwaS91c2Vycy8nICsgdXNlcl9uYW1lICsgJy9mb2xkZXJzLycgKyBmb2xkZXJfaWQ7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5kZWxldGUodXJsKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oaGFuZGxlU3VjY2VzcywgaGFuZGxlRXJyb3IoJ0Vycm9yIGRlbGV0aW5nIGZpbGUnKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBBZGRGb2xkZXIodXNlcl9uYW1lLCBmb2xkZXJuYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdDoxMzM3L2FwaS91c2Vycy8nICsgdXNlcl9uYW1lICsgJy9mb2xkZXJzJztcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QodXJsLCBmb2xkZXJuYW1lKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oaGFuZGxlU3VjY2VzcywgaGFuZGxlRXJyb3IoJ0Vycm9yIHdoaWxlIGFkZCBmaWxlJykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9vdGhlciBmdW5jdGlvbnNcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlU3VjY2VzcyhyZXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5kYXRhO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlU3VjY2VzczIocmVzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXMuZGF0YTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZUVycm9yKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge21lc3NhZ2U6IGVycm9yfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2ZpbGVzbGlzdC9maWxlbWFuYWdlci5zZXJ2aWNlLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCdcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnbXlBcHAnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdGaWxlc0xpc3QnLCBGaWxlc0xpc3QpO1xyXG5cclxuICAgIEZpbGVzTGlzdC4kaW5qZWN0ID0gW1xyXG4gICAgICAgICckc2NvcGUnLFxyXG4gICAgICAgICdGaWxlTWFuYWdlcicsXHJcbiAgICAgICAgJ05vdGlmaWNhdG9yJyxcclxuICAgICAgICAnbW9kYWxTZXJ2aWNlJyxcclxuICAgICAgICAnJHJvb3RTY29wZScsXHJcbiAgICAgICAgJ1VwbG9hZCcsXHJcbiAgICAgICAgJ3VwbG9hZEZpbGVNb2RhbFNlcnZpY2UnLFxyXG4gICAgICAgICdlZGl0Rm9sZGVyU2VydmljZScsXHJcbiAgICAgICAgJ2NyZWF0ZUZvbGRlclNlcnZpY2UnXHJcbiAgICBdO1xyXG5cclxuICAgIGZ1bmN0aW9uIEZpbGVzTGlzdCgkc2NvcGUsIEZpbGVNYW5hZ2VyLCBOb3RpZmljYXRvciwgbW9kYWxTZXJ2aWNlLCAkcm9vdFNjb3BlLCBVcGxvYWQsIHVwbG9hZEZpbGVNb2RhbFNlcnZpY2UsIGVkaXRGb2xkZXJTZXJ2aWNlLCBjcmVhdGVGb2xkZXJTZXJ2aWNlKSB7XHJcbiAgICAgICAgdmFyIHVzZXJfbmFtZSA9ICdtaGFyYmlzaGVycic7XHJcbiAgICAgICAgJHJvb3RTY29wZS51c2VyID0gdXNlcl9uYW1lO1xyXG5cclxuICAgICAgICAkc2NvcGUubm0gPSB1c2VyX25hbWU7XHJcbiAgICBcclxuICAgICAgICAvL2dldCBmaWxlc1xyXG4gICAgICAgIEZpbGVNYW5hZ2VyLkdldEFsbEZpbGVzKHVzZXJfbmFtZSlcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmZpbGVzID0gcmVzO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBOb3RpZmljYXRvci5zdWNjZXNzKCdGaWxlcyBoYXZlIGJlZW4gc3VjY2Vzc2Z1bGx5IGxvYWRlZCEnKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQocmVzLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9KTsgICAgICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICAvL21va3MgZGF0YVxyXG4gICAgICAgIC8vICRzY29wZS5mb2xkZXJzID0gW1xyXG4gICAgICAgIC8vICAgICB7XHJcbiAgICAgICAgLy8gICAgICAgICAndGl0bGUnOiAnZm9sZGVyMScsXHJcbiAgICAgICAgLy8gICAgICAgICAndXNlcic6ICdtaGFyYmlzaGVycidcclxuICAgICAgICAvLyAgICAgfSxcclxuICAgICAgICAvLyAgICAge1xyXG4gICAgICAgIC8vICAgICAgICAgJ3RpdGxlJzogJ2ZvbGRlcjInLFxyXG4gICAgICAgIC8vICAgICAgICAgJ3VzZXInOiAnbWhhcmJpc2hlcnInXHJcbiAgICAgICAgLy8gICAgIH0sXHJcbiAgICAgICAgLy8gICAgIHtcclxuICAgICAgICAvLyAgICAgICAgICd0aXRsZSc6ICdmb2xkZXIzJyxcclxuICAgICAgICAvLyAgICAgICAgICd1c2VyJzogJ21oYXJiaXNoZXJyJ1xyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gXTtcclxuICAgICAgICBcclxuICAgIFxyXG4gICAgICAgIC8vZGVsZXRlIGZpbGVcclxuICAgICAgICAkc2NvcGUuZGVsZXRlRmlsZSA9IGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICAgICAgdmFyIGZpbGVfaWQgPSBvYmouX2lkO1xyXG4gICAgICAgICAgICBGaWxlTWFuYWdlci5EZWxldGVGaWxlKCRzY29wZS5ubSwgZmlsZV9pZClcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBOb3RpZmljYXRvci5zdWNjZXNzKCdpdCB3b3JrcyEgRmlsZSB3YXMgc3VjY2Vzc2Z1bGx5IGRlbGV0ZWQhJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBmaW5kSW5kZXgoJHNjb3BlLmZpbGVzLCAnX2lkJywgZmlsZV9pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZpbGVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9kZWxldGUgJHNjb3BlLmZpbGVzW2luZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmZpbGVzKTtcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBOb3RpZmljYXRvci5lcnJvcihyZXMpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICAvL3JlbmFtZSBmaWxlXHJcbiAgICAgICAgJHNjb3BlLnJlbmFtZUZpbGUgPSBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICAgICAgICAgIHZhciBmaWxlX2lkID0gb2JqLl9pZDtcclxuICAgICAgICAgICAgdmFyIG1vZGFsT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIGNsb3NlQnV0dG9uVGV4dDogJ0NhbmNlbCcsXHJcbiAgICAgICAgICAgICAgICBhY3Rpb25CdXR0b25UZXh0OiAnUmVuYW1lJyxcclxuICAgICAgICAgICAgICAgIGhlYWRlclRleHQ6IG9iai50aXRsZSxcclxuICAgICAgICAgICAgICAgIGJvZHlUZXh0OiAnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHJlbmFtZSB0aGlzIGZpbGU/J1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBtb2RhbFNlcnZpY2Uuc2hvd01vZGFsKHt9LCBtb2RhbE9wdGlvbnMsIG9iaikudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBmaW5kSW5kZXgoJHNjb3BlLmZpbGVzLCAnX2lkJywgZmlsZV9pZCk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmlsZXNbaW5kZXhdLnRpdGxlID0gJHJvb3RTY29wZS5uZXdGTmFtZTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5maWxlc1tpbmRleF0udGl0bGUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvL3VwbG9hZCBmaWxlXHJcbiAgICAgICAgJHNjb3BlLnVwbG9hZEZpbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vdmFyIGZpbGVfaWQgPSBvYmouX2lkO1xyXG4gICAgICAgICAgICB2YXIgbW9kYWxPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgY2xvc2VCdXR0b25UZXh0OiAnQ2FuY2VsJyxcclxuICAgICAgICAgICAgICAgIGFjdGlvbkJ1dHRvblRleHQ6ICdVcGxvYWQnLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyVGV4dDogJ0ZpbGUgdXBsb2FkaW5nJyxcclxuICAgICAgICAgICAgICAgIGJvZHlUZXh0OiAnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHVwbG9hZCB0aGlzIGZpbGU/J1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB1cGxvYWRGaWxlTW9kYWxTZXJ2aWNlLnNob3dNb2RhbCh7fSwgbW9kYWxPcHRpb25zKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIC8vdmFyIGluZGV4ID0gZmluZEluZGV4KCRzY29wZS5maWxlcywgJ19pZCcsIGZpbGVfaWQpO1xyXG4gICAgICAgICAgICAgICAgLy8kc2NvcGUuZmlsZXNbaW5kZXhdLnRpdGxlID0gJHJvb3RTY29wZS5uZXdGTmFtZTtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2l0IHdvcmtzJyk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuJG9uKCduZXdVcGxvYWRlZEZpbGUnLCBmdW5jdGlvbiAoZXZlbnQsIGFyZ3MpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgb2JqID0gYXJncy5maWxlaW5mbztcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZmlsZXMudW5zaGlmdChvYmopO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vZ2V0IGZvbGRlcnNcclxuICAgICAgICBGaWxlTWFuYWdlci5HZXRBbGxGb2xkZXJzKHVzZXJfbmFtZSlcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmZvbGRlcnMgPSByZXM7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmZvbGRlcnNMaXN0ID0gJHNjb3BlLmZvbGRlcnM7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkcm9vdFNjb3BlLmZvbGRlcnNMaXN0KTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQocmVzLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAkcm9vdFNjb3BlLmZvbGRlcnNMaXN0ID0gJHNjb3BlLmZvbGRlcnM7XHJcblxyXG4gICAgICAgIC8vcmVuYW1lIGZvbGRlclxyXG4gICAgICAgICRzY29wZS5yZW5hbWVGb2xkZXIgPSBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICAgICAgICAgIHZhciBmb2xkZXJfaWQgPSBvYmouX2lkO1xyXG4gICAgICAgICAgICB2YXIgbW9kYWxPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgY2xvc2VCdXR0b25UZXh0OiAnQ2FuY2VsJyxcclxuICAgICAgICAgICAgICAgIGFjdGlvbkJ1dHRvblRleHQ6ICdSZW5hbWUnLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyVGV4dDogb2JqLmZvbGRlcixcclxuICAgICAgICAgICAgICAgIGJvZHlUZXh0OiAnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHJlbmFtZSB0aGlzIGZvbGRlcj8nXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGVkaXRGb2xkZXJTZXJ2aWNlLnNob3dNb2RhbCh7fSwgbW9kYWxPcHRpb25zLCBvYmopLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLiRvbignbmV3VXBkYXRlZEZvbGRlcicsIGZ1bmN0aW9uKGV2ZW50LCBhcmdzKXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhcmdzKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3Rm9sZGVyTmFtZSA9IGFyZ3MubmV3Zm9sZGVybmFtZTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZm9sZGVySWQgPSBhcmdzLm9iai5faWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gZmluZEluZGV4KCRzY29wZS5mb2xkZXJzLCAnX2lkJywgZm9sZGVySWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5mb2xkZXJzW2luZGV4XS5mb2xkZXIgPSBuZXdGb2xkZXJOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5mb2xkZXJzW2luZGV4XS5mb2xkZXIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vZGVsZXRlIGZvbGRlclxyXG4gICAgICAgICRzY29wZS5kZWxldGVGb2xkZXIgPSBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICAgICAgICAgIHZhciBmb2xkZXJfaWQgPSBvYmouX2lkO1xyXG4gICAgICAgICAgICBGaWxlTWFuYWdlci5EZWxldGVGb2xkZXIoJHNjb3BlLm5tLCBmb2xkZXJfaWQpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgTm90aWZpY2F0b3Iuc3VjY2VzcygnaXQgd29ya3MhIEZvbGRlciB3YXMgc3VjY2Vzc2Z1bGx5IGRlbGV0ZWQhJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBmaW5kSW5kZXgoJHNjb3BlLmZvbGRlcnMsICdfaWQnLCBmb2xkZXJfaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5mb2xkZXJzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9kZWxldGUgJHNjb3BlLmZpbGVzW2luZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmZvbGRlcnMpO1xyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIE5vdGlmaWNhdG9yLmVycm9yKHJlcyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvL2NyZWF0ZSBmb2xkZXJcclxuICAgICAgICAkc2NvcGUuY3JlYXRlRm9sZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvL3ZhciBmb2xkZXJfaWQgPSBvYmouX2lkO1xyXG4gICAgICAgICAgICB2YXIgbW9kYWxPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgY2xvc2VCdXR0b25UZXh0OiAnQ2FuY2VsJyxcclxuICAgICAgICAgICAgICAgIGFjdGlvbkJ1dHRvblRleHQ6ICdDcmVhdGUnLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyVGV4dDogJ0NyZWF0aW5nIGEgZm9sZGVyJyxcclxuICAgICAgICAgICAgICAgIGJvZHlUZXh0OiAnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGNyZWF0ZSBhIGZvbGRlcj8nXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGNyZWF0ZUZvbGRlclNlcnZpY2Uuc2hvd01vZGFsKHt9LCBtb2RhbE9wdGlvbnMpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLiRvbignbmV3Rm9sZGVyJywgZnVuY3Rpb24oZXZlbnQsIGFyZ3Mpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGFyZ3MuZm9sZGVyaW5mby5mb2xkZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5mb2xkZXJzLnVuc2hpZnQoYXJncy5mb2xkZXJpbmZvKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGZpbmRJbmRleChhcnJheSwga2V5LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXJyYXlbaV1ba2V5XSA9PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn0pKCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9maWxlc2xpc3QvbGlzdC5jb250cm9sbGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnbXlBcHAnKVxyXG4gICAgICAgIC5zZXJ2aWNlKCdlZGl0Rm9sZGVyU2VydmljZScsIGVkaXRGb2xkZXJTZXJ2aWNlKTtcclxuXHJcbiAgICBlZGl0Rm9sZGVyU2VydmljZS4kaW5qZWN0ID0gWyckdWliTW9kYWwnLCAnRmlsZU1hbmFnZXInLCAnTm90aWZpY2F0b3InXTtcclxuICAgIGZ1bmN0aW9uIGVkaXRGb2xkZXJTZXJ2aWNlKCR1aWJNb2RhbCwgRmlsZU1hbmFnZXIsIE5vdGlmaWNhdG9yKSB7XHJcblxyXG4gICAgICAgIHZhciBtb2RhbERlZmF1bHRzID0ge1xyXG4gICAgICAgICAgICBiYWNrZHJvcDogdHJ1ZSxcclxuICAgICAgICAgICAga2V5Ym9hcmQ6IHRydWUsXHJcbiAgICAgICAgICAgIG1vZGFsRmFkZTogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi9hcHAvZmlsZXNsaXN0L21vZGFsL2VkaXRmb2xkZXJNb2RhbC5odG1sJ1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBtb2RhbE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIGNsb3NlQnV0dG9uVGV4dDogJ0Nsb3NlJyxcclxuICAgICAgICAgICAgYWN0aW9uQnV0dG9uVGV4dDogJ09LJyxcclxuICAgICAgICAgICAgaGVhZGVyVGV4dDogJ1Byb2NlZWQ/JyxcclxuICAgICAgICAgICAgYm9keVRleHQ6ICdQZXJmb3JtIHRoaXMgYWN0aW9uPydcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNob3dNb2RhbCA9IGZ1bmN0aW9uIChjdXN0b21Nb2RhbERlZmF1bHRzLCBjdXN0b21Nb2RhbE9wdGlvbnMsIG9iaikge1xyXG4gICAgICAgICAgICBpZiAoIWN1c3RvbU1vZGFsRGVmYXVsdHMpIGN1c3RvbU1vZGFsRGVmYXVsdHMgPSB7fTtcclxuICAgICAgICAgICAgY3VzdG9tTW9kYWxEZWZhdWx0cy5iYWNrZHJvcCA9ICdzdGF0aWMnO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zaG93KGN1c3RvbU1vZGFsRGVmYXVsdHMsIGN1c3RvbU1vZGFsT3B0aW9ucywgb2JqKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNob3cgPSBmdW5jdGlvbiAoY3VzdG9tTW9kYWxEZWZhdWx0cywgY3VzdG9tTW9kYWxPcHRpb25zLCBvYmopIHtcclxuICAgICAgICAgICAgLy9DcmVhdGUgdGVtcCBvYmplY3RzIHRvIHdvcmsgd2l0aCBzaW5jZSB3ZSdyZSBpbiBhIHNpbmdsZXRvbiBzZXJ2aWNlXHJcbiAgICAgICAgICAgIHZhciB0ZW1wTW9kYWxEZWZhdWx0cyA9IHt9O1xyXG4gICAgICAgICAgICB2YXIgdGVtcE1vZGFsT3B0aW9ucyA9IHt9O1xyXG5cclxuICAgICAgICAgICAgLy9NYXAgYW5ndWxhci11aSBtb2RhbCBjdXN0b20gZGVmYXVsdHMgdG8gbW9kYWwgZGVmYXVsdHMgZGVmaW5lZCBpbiBzZXJ2aWNlXHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHRlbXBNb2RhbERlZmF1bHRzLCBtb2RhbERlZmF1bHRzLCBjdXN0b21Nb2RhbERlZmF1bHRzKTtcclxuXHJcbiAgICAgICAgICAgIC8vTWFwIG1vZGFsLmh0bWwgJHNjb3BlIGN1c3RvbSBwcm9wZXJ0aWVzIHRvIGRlZmF1bHRzIGRlZmluZWQgaW4gc2VydmljZVxyXG4gICAgICAgICAgICBhbmd1bGFyLmV4dGVuZCh0ZW1wTW9kYWxPcHRpb25zLCBtb2RhbE9wdGlvbnMsIGN1c3RvbU1vZGFsT3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRlbXBNb2RhbERlZmF1bHRzLmNvbnRyb2xsZXIpIHtcclxuICAgICAgICAgICAgICAgIHRlbXBNb2RhbERlZmF1bHRzLmNvbnRyb2xsZXIgPSBmdW5jdGlvbiAoJHNjb3BlLCAkdWliTW9kYWxJbnN0YW5jZSwgTm90aWZpY2F0b3IsICRyb290U2NvcGUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm1vZGFsT3B0aW9ucyA9IHRlbXBNb2RhbE9wdGlvbnM7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm1vZGFsT3B0aW9ucy5vayA9IGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8kcm9vdFNjb3BlLm5ld0ZOYW1lID0gJHNjb3BlLm5ld2ZvbGRlcm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmZvID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqOiBvYmosXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdmb2xkZXJuYW1lOiAkc2NvcGUubmV3Zm9sZGVybmFtZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBGaWxlTWFuYWdlci5VcGRhdGVGb2xkZXIob2JqLnVzZXIsIG9iai5faWQsIEpTT04uc3RyaW5naWZ5KHtmb2xkZXJuYW1lOiAkc2NvcGUubmV3Zm9sZGVybmFtZX0pKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnbmV3VXBkYXRlZEZvbGRlcicsIGluZm8pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vdGlmaWNhdG9yLnN1Y2Nlc3MocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBOb3RpZmljYXRvci5lcnJvcihyZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubW9kYWxPcHRpb25zLmNsb3NlID0gZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkdWliTW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJHVpYk1vZGFsLm9wZW4odGVtcE1vZGFsRGVmYXVsdHMpLnJlc3VsdDtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxufSkoKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2ZpbGVzbGlzdC9tb2RhbC9lZGl0Zm9sZGVyLnNlcnZpY2UuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdteUFwcCcpXHJcbiAgICAgICAgLnNlcnZpY2UoJ21vZGFsU2VydmljZScsIG1vZGFsU2VydmljZSk7XHJcblxyXG4gICAgbW9kYWxTZXJ2aWNlLiRpbmplY3QgPSBbJyR1aWJNb2RhbCcsICdGaWxlTWFuYWdlcicsICdOb3RpZmljYXRvciddO1xyXG4gICAgZnVuY3Rpb24gbW9kYWxTZXJ2aWNlKCR1aWJNb2RhbCwgRmlsZU1hbmFnZXIsIE5vdGlmaWNhdG9yKSB7XHJcblxyXG4gICAgICAgIHZhciBtb2RhbERlZmF1bHRzID0ge1xyXG4gICAgICAgICAgICBiYWNrZHJvcDogdHJ1ZSxcclxuICAgICAgICAgICAga2V5Ym9hcmQ6IHRydWUsXHJcbiAgICAgICAgICAgIG1vZGFsRmFkZTogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi9hcHAvZmlsZXNsaXN0L21vZGFsL21vZGFsLmh0bWwnXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIG1vZGFsT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgY2xvc2VCdXR0b25UZXh0OiAnQ2xvc2UnLFxyXG4gICAgICAgICAgICBhY3Rpb25CdXR0b25UZXh0OiAnT0snLFxyXG4gICAgICAgICAgICBoZWFkZXJUZXh0OiAnUHJvY2VlZD8nLFxyXG4gICAgICAgICAgICBib2R5VGV4dDogJ1BlcmZvcm0gdGhpcyBhY3Rpb24/J1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuc2hvd01vZGFsID0gZnVuY3Rpb24gKGN1c3RvbU1vZGFsRGVmYXVsdHMsIGN1c3RvbU1vZGFsT3B0aW9ucywgb2JqKSB7XHJcbiAgICAgICAgICAgIGlmICghY3VzdG9tTW9kYWxEZWZhdWx0cykgY3VzdG9tTW9kYWxEZWZhdWx0cyA9IHt9O1xyXG4gICAgICAgICAgICBjdXN0b21Nb2RhbERlZmF1bHRzLmJhY2tkcm9wID0gJ3N0YXRpYyc7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNob3coY3VzdG9tTW9kYWxEZWZhdWx0cywgY3VzdG9tTW9kYWxPcHRpb25zLCBvYmopO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuc2hvdyA9IGZ1bmN0aW9uIChjdXN0b21Nb2RhbERlZmF1bHRzLCBjdXN0b21Nb2RhbE9wdGlvbnMsIG9iaikge1xyXG4gICAgICAgICAgICAvL0NyZWF0ZSB0ZW1wIG9iamVjdHMgdG8gd29yayB3aXRoIHNpbmNlIHdlJ3JlIGluIGEgc2luZ2xldG9uIHNlcnZpY2VcclxuICAgICAgICAgICAgdmFyIHRlbXBNb2RhbERlZmF1bHRzID0ge307XHJcbiAgICAgICAgICAgIHZhciB0ZW1wTW9kYWxPcHRpb25zID0ge307XHJcblxyXG4gICAgICAgICAgICAvL01hcCBhbmd1bGFyLXVpIG1vZGFsIGN1c3RvbSBkZWZhdWx0cyB0byBtb2RhbCBkZWZhdWx0cyBkZWZpbmVkIGluIHNlcnZpY2VcclxuICAgICAgICAgICAgYW5ndWxhci5leHRlbmQodGVtcE1vZGFsRGVmYXVsdHMsIG1vZGFsRGVmYXVsdHMsIGN1c3RvbU1vZGFsRGVmYXVsdHMpO1xyXG5cclxuICAgICAgICAgICAgLy9NYXAgbW9kYWwuaHRtbCAkc2NvcGUgY3VzdG9tIHByb3BlcnRpZXMgdG8gZGVmYXVsdHMgZGVmaW5lZCBpbiBzZXJ2aWNlXHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHRlbXBNb2RhbE9wdGlvbnMsIG1vZGFsT3B0aW9ucywgY3VzdG9tTW9kYWxPcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGVtcE1vZGFsRGVmYXVsdHMuY29udHJvbGxlcikge1xyXG4gICAgICAgICAgICAgICAgdGVtcE1vZGFsRGVmYXVsdHMuY29udHJvbGxlciA9IGZ1bmN0aW9uICgkc2NvcGUsICR1aWJNb2RhbEluc3RhbmNlLCBOb3RpZmljYXRvciwgJHJvb3RTY29wZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubW9kYWxPcHRpb25zID0gdGVtcE1vZGFsT3B0aW9ucztcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubW9kYWxPcHRpb25zLm9rID0gZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLm5ld0ZOYW1lID0gJHNjb3BlLm5ld2ZpbGVuYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBGaWxlTWFuYWdlci5VcGRhdGVGaWxlKG9iai51c2VyLCBvYmouX2lkLCBKU09OLnN0cmluZ2lmeSh7ZmlsZW5hbWU6ICRzY29wZS5uZXdmaWxlbmFtZSwgZm9sZGVybmFtZTogb2JqLmZvbGRlcn0pKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vdGlmaWNhdG9yLnN1Y2Nlc3MocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBOb3RpZmljYXRvci5lcnJvcihyZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubW9kYWxPcHRpb25zLmNsb3NlID0gZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkdWliTW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJHVpYk1vZGFsLm9wZW4odGVtcE1vZGFsRGVmYXVsdHMpLnJlc3VsdDtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxufSkoKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2ZpbGVzbGlzdC9tb2RhbC9tb2RhbC5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ215QXBwJylcclxuICAgICAgICAuc2VydmljZSgndXBsb2FkRmlsZU1vZGFsU2VydmljZScsIHVwbG9hZEZpbGVNb2RhbFNlcnZpY2UpO1xyXG5cclxuICAgIHVwbG9hZEZpbGVNb2RhbFNlcnZpY2UuJGluamVjdCA9IFsnJHVpYk1vZGFsJywgJ0ZpbGVNYW5hZ2VyJywgJ05vdGlmaWNhdG9yJywgJ1VwbG9hZCddO1xyXG4gICAgZnVuY3Rpb24gdXBsb2FkRmlsZU1vZGFsU2VydmljZSgkdWliTW9kYWwsIEZpbGVNYW5hZ2VyLCBOb3RpZmljYXRvciwgVXBsb2FkKSB7XHJcblxyXG4gICAgICAgIHZhciBtb2RhbERlZmF1bHRzID0ge1xyXG4gICAgICAgICAgICBiYWNrZHJvcDogdHJ1ZSxcclxuICAgICAgICAgICAga2V5Ym9hcmQ6IHRydWUsXHJcbiAgICAgICAgICAgIG1vZGFsRmFkZTogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi9hcHAvZmlsZXNsaXN0L21vZGFsL3VwbG9hZE1vZGFsLmh0bWwnXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIG1vZGFsT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgY2xvc2VCdXR0b25UZXh0OiAnQ2xvc2UnLFxyXG4gICAgICAgICAgICBhY3Rpb25CdXR0b25UZXh0OiAnT0snLFxyXG4gICAgICAgICAgICBoZWFkZXJUZXh0OiAnUHJvY2VlZD8nLFxyXG4gICAgICAgICAgICBib2R5VGV4dDogJ1BlcmZvcm0gdGhpcyBhY3Rpb24/J1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuc2hvd01vZGFsID0gZnVuY3Rpb24gKGN1c3RvbU1vZGFsRGVmYXVsdHMsIGN1c3RvbU1vZGFsT3B0aW9ucywgb2JqKSB7XHJcbiAgICAgICAgICAgIGlmICghY3VzdG9tTW9kYWxEZWZhdWx0cykgY3VzdG9tTW9kYWxEZWZhdWx0cyA9IHt9O1xyXG4gICAgICAgICAgICBjdXN0b21Nb2RhbERlZmF1bHRzLmJhY2tkcm9wID0gJ3N0YXRpYyc7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNob3coY3VzdG9tTW9kYWxEZWZhdWx0cywgY3VzdG9tTW9kYWxPcHRpb25zLCBvYmopO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuc2hvdyA9IGZ1bmN0aW9uIChjdXN0b21Nb2RhbERlZmF1bHRzLCBjdXN0b21Nb2RhbE9wdGlvbnMsIG9iaikge1xyXG4gICAgICAgICAgICAvL0NyZWF0ZSB0ZW1wIG9iamVjdHMgdG8gd29yayB3aXRoIHNpbmNlIHdlJ3JlIGluIGEgc2luZ2xldG9uIHNlcnZpY2VcclxuICAgICAgICAgICAgdmFyIHRlbXBNb2RhbERlZmF1bHRzID0ge307XHJcbiAgICAgICAgICAgIHZhciB0ZW1wTW9kYWxPcHRpb25zID0ge307XHJcblxyXG4gICAgICAgICAgICAvL01hcCBhbmd1bGFyLXVpIG1vZGFsIGN1c3RvbSBkZWZhdWx0cyB0byBtb2RhbCBkZWZhdWx0cyBkZWZpbmVkIGluIHNlcnZpY2VcclxuICAgICAgICAgICAgYW5ndWxhci5leHRlbmQodGVtcE1vZGFsRGVmYXVsdHMsIG1vZGFsRGVmYXVsdHMsIGN1c3RvbU1vZGFsRGVmYXVsdHMpO1xyXG5cclxuICAgICAgICAgICAgLy9NYXAgbW9kYWwuaHRtbCAkc2NvcGUgY3VzdG9tIHByb3BlcnRpZXMgdG8gZGVmYXVsdHMgZGVmaW5lZCBpbiBzZXJ2aWNlXHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHRlbXBNb2RhbE9wdGlvbnMsIG1vZGFsT3B0aW9ucywgY3VzdG9tTW9kYWxPcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGVtcE1vZGFsRGVmYXVsdHMuY29udHJvbGxlcikge1xyXG4gICAgICAgICAgICAgICAgdGVtcE1vZGFsRGVmYXVsdHMuY29udHJvbGxlciA9IGZ1bmN0aW9uICgkc2NvcGUsICR1aWJNb2RhbEluc3RhbmNlLCBOb3RpZmljYXRvciwgJHJvb3RTY29wZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5mb2xkZXJzTCA9ICRyb290U2NvcGUuZm9sZGVyc0xpc3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVwbG9hZEZpbGUgPSBmdW5jdGlvbiAoJGZpbGUsICRlcnJGaWxlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBsb2FkZmlsZW5hbWUgPSAkZmlsZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRmaWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKmZpbGUudXBsb2FkID0gVXBsb2FkLnVwbG9hZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDoxMzM3L2FwaS91c2Vycy8nICsgdXNlcl9uYW1lICsgJy9maWxlcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge2ZpbGU6IGZpbGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGUudXBsb2FkLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGUucmVzdWx0ID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID4gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3JNc2cgPSByZXNwb25zZS5zdGF0dXMgKyAnOiAnICsgcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZS5wcm9ncmVzcyA9IE1hdGgubWluKDEwMCwgcGFyc2VJbnQoMTAwLjAgKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2dC5sb2FkZWQgLyBldnQudG90YWwpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTsqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhmaWxlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2ZpbGUgd2FzIHN1Y2Nlc3NmdWxseSBzZWxlY3RlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm1vZGFsT3B0aW9ucyA9IHRlbXBNb2RhbE9wdGlvbnM7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm1vZGFsT3B0aW9ucy5vayA9IGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZuYW1lID0gJHNjb3BlLmRlc3RpbmF0aW9uRm9kbGVyO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZuYW1lID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZuYW1lID0gJ01haW4nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmQgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmQuYXBwZW5kKCdmaWxlJywgJHNjb3BlLnVwbG9hZGZpbGVuYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEZpbGVNYW5hZ2VyLkFkZEZpbGUoJHJvb3RTY29wZS51c2VyLCBmZCwgZm5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhyZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnbmV3VXBsb2FkZWRGaWxlJywgcmVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGZkLmdldCgnZmlsZScpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBOb3RpZmljYXRvci5zdWNjZXNzKHJlcy5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTm90aWZpY2F0b3IuZXJyb3IocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2xvZ2ljIGhlcmVcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qJHJvb3RTY29wZS5uZXdGTmFtZSA9ICRzY29wZS5uZXdmaWxlbmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgRmlsZU1hbmFnZXIuVXBkYXRlRmlsZShvYmoudXNlciwgb2JqLl9pZCwgSlNPTi5zdHJpbmdpZnkoe2ZpbGVuYW1lOiAkc2NvcGUubmV3ZmlsZW5hbWV9KSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBOb3RpZmljYXRvci5zdWNjZXNzKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTm90aWZpY2F0b3IuZXJyb3IocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pOyovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubW9kYWxPcHRpb25zLmNsb3NlID0gZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkdWliTW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJHVpYk1vZGFsLm9wZW4odGVtcE1vZGFsRGVmYXVsdHMpLnJlc3VsdDtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxufSkoKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2ZpbGVzbGlzdC9tb2RhbC91cGxvYWRmaWxlLnNlcnZpY2UuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdteUFwcCcpXG4gICAgICAgIC5jb25maWcobm90aWZpY2F0b3JDb25maWcpXG4gICAgICAgIC5mYWN0b3J5KCdOb3RpZmljYXRvcicsIE5vdGlmaWNhdG9yKVxuICAgICAgICAucnVuKG5vdGlmaWNhdGlvbnNSdW4pO1xuXG4gICAgTm90aWZpY2F0b3IuJGluamVjdCA9IFsndG9hc3RyJ107XG4gICAgZnVuY3Rpb24gTm90aWZpY2F0b3IodG9hc3RyKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihtc2csIHRpdGxlKSB7XG4gICAgICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MobXNnLCB0aXRsZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgd2FybmluZzogZnVuY3Rpb24obXNnLCB0aXRsZSkge1xuICAgICAgICAgICAgICAgIHRvYXN0ci53YXJuaW5nKG1zZywgdGl0bGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbihtc2csIHRpdGxlKSB7XG4gICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKG1zZywgdGl0bGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGluZm86IGZ1bmN0aW9uKG1zZywgdGl0bGUpIHtcbiAgICAgICAgICAgICAgICB0b2FzdHIuaW5mbyhtc2csIHRpdGxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5vdGlmaWNhdGlvbnNSdW4uJGluamVjdCA9IFsnJHJvb3RTY29wZScsICdOb3RpZmljYXRvcicsICckdGltZW91dCddO1xuICAgIGZ1bmN0aW9uIG5vdGlmaWNhdGlvbnNSdW4oJHJvb3RTY29wZSwgbm90aWZpY2F0b3IsICR0aW1lb3V0KSB7XG4gICAgICAgIC8qJHJvb3RTY29wZS4kb24oJyR1c2VyTG9nZ2VkSW4nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIG5vdGlmaWNhdG9yLnN1Y2Nlc3MoJ0hleSB0aGVyZSEnKTtcblxuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBub3RpZmljYXRvci5pbmZvKCdXZWxjb21lIHRvIHRoaXMgZnJlZSBhbmd1bGFyIGRhc2hib2FyZCBzZWVkIHByb2plY3QsJyArXG4gICAgICAgICAgICAgICAgJyB0aGF0IHlvdSBtYXkgdXNlIHRvIGJvb3RzdHJhcCB5b3VyIG5leHQgd2ViIGFwcCEnLCB7XG4gICAgICAgICAgICAgICAgICAgIHRpbWVPdXQ6IDEwMDAwXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LDMwMDApO1xuXG4gICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIG5vdGlmaWNhdG9yLmluZm8oJ0J0dywgZmVlbCBmcmVlIHRvIGNvbnRyaWJ1dGUgdG8gdGhpcyBwcm9qZWN0IGFuZCBoZWxwIHVzIGtpbGwgdGhlIHBhaWQgdGVtcGxhdGVzIG1hcmtldCA7KScsIHtcbiAgICAgICAgICAgICAgICAgICAgdGltZU91dDogMTAwMDBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sMTUwMDApXG4gICAgICAgIH0pO1xuICAgICAgICAkcm9vdFNjb3BlLiRvbignJHVzZXJMb2dnZWRPdXQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIG5vdGlmaWNhdG9yLnN1Y2Nlc3MoJ0xvZ2dlZCBvdXQgc3VjY2Vzc2Z1bGx5Jyk7XG4gICAgICAgIH0pOyovXG4gICAgICAgIGNvbnNvbGUubG9nKCdub3RpZmljYXRpb25zUnVuIHdvcmtzIScpO1xuICAgIH1cblxuICAgIG5vdGlmaWNhdG9yQ29uZmlnLiRpbmplY3QgPSBbJ3RvYXN0ckNvbmZpZyddO1xuICAgIGZ1bmN0aW9uIG5vdGlmaWNhdG9yQ29uZmlnKHRvYXN0ckNvbmZpZykge1xuICAgICAgICBhbmd1bGFyLmV4dGVuZCh0b2FzdHJDb25maWcsIHtcbiAgICAgICAgICAgIHRpbWVPdXQ6IDMwMDBcbiAgICAgICAgfSk7XG4gICAgfVxuXG59KSgpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub3RpZmljYXRvci9ub3RpZmljYXRpb25zLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnbXlBcHAnKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ3dpZGdldCcsIHdpZGdldCk7XHJcblxyXG4gICAgZnVuY3Rpb24gd2lkZ2V0KCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsICRlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICRlbGVtZW50LmFkZENsYXNzKCd3aWRnZXQnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbGluazogbGluayxcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQSdcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxufSkoKTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93aWRnZXQvd2lkZ2V0LmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImFuZ3VsYXIubW9kdWxlKCdteUFwcCcsIFsndG9hc3RyJywgJ25nQW5pbWF0ZScsICd1aS5ib290c3RyYXAnLCAnbmdGaWxlVXBsb2FkJ10pO1xyXG5cclxucmVxdWlyZSgnLi9maWxlc2xpc3QvbGlzdC5jb250cm9sbGVyLmpzJyk7XHJcbnJlcXVpcmUoJy4vZmlsZXNsaXN0L2ZpbGVtYW5hZ2VyLnNlcnZpY2UuanMnKTtcclxucmVxdWlyZSgnLi93aWRnZXQvd2lkZ2V0Jyk7XHJcbnJlcXVpcmUoJy4vbm90aWZpY2F0b3Ivbm90aWZpY2F0aW9ucycpO1xyXG5yZXF1aXJlKCcuL2ZpbGVzbGlzdC9tb2RhbC9tb2RhbCcpO1xyXG5yZXF1aXJlKCcuL2ZpbGVzbGlzdC9tb2RhbC91cGxvYWRmaWxlLnNlcnZpY2UnKTtcclxucmVxdWlyZSgnLi9maWxlc2xpc3QvbW9kYWwvZWRpdGZvbGRlci5zZXJ2aWNlJyk7XHJcbnJlcXVpcmUoJy4vZmlsZXNsaXN0L21vZGFsL2NyZWF0ZWZvbGRlci5zZXJ2aWNlLmpzJyk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9hcHAuanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdteUFwcCcpXHJcbiAgICAgICAgLnNlcnZpY2UoJ2NyZWF0ZUZvbGRlclNlcnZpY2UnLCBjcmVhdGVGb2xkZXJTZXJ2aWNlKTtcclxuXHJcbiAgICBjcmVhdGVGb2xkZXJTZXJ2aWNlLiRpbmplY3QgPSBbJyR1aWJNb2RhbCcsICdGaWxlTWFuYWdlcicsICdOb3RpZmljYXRvciddO1xyXG4gICAgZnVuY3Rpb24gY3JlYXRlRm9sZGVyU2VydmljZSgkdWliTW9kYWwsIEZpbGVNYW5hZ2VyLCBOb3RpZmljYXRvcikge1xyXG5cclxuICAgICAgICB2YXIgbW9kYWxEZWZhdWx0cyA9IHtcclxuICAgICAgICAgICAgYmFja2Ryb3A6IHRydWUsXHJcbiAgICAgICAgICAgIGtleWJvYXJkOiB0cnVlLFxyXG4gICAgICAgICAgICBtb2RhbEZhZGU6IHRydWUsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vYXBwL2ZpbGVzbGlzdC9tb2RhbC9jcmVhdGVmb2xkZXJNb2RhbC5odG1sJ1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBtb2RhbE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIGNsb3NlQnV0dG9uVGV4dDogJ0Nsb3NlJyxcclxuICAgICAgICAgICAgYWN0aW9uQnV0dG9uVGV4dDogJ09LJyxcclxuICAgICAgICAgICAgaGVhZGVyVGV4dDogJ1Byb2NlZWQ/JyxcclxuICAgICAgICAgICAgYm9keVRleHQ6ICdQZXJmb3JtIHRoaXMgYWN0aW9uPydcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNob3dNb2RhbCA9IGZ1bmN0aW9uIChjdXN0b21Nb2RhbERlZmF1bHRzLCBjdXN0b21Nb2RhbE9wdGlvbnMpIHtcclxuICAgICAgICAgICAgaWYgKCFjdXN0b21Nb2RhbERlZmF1bHRzKSBjdXN0b21Nb2RhbERlZmF1bHRzID0ge307XHJcbiAgICAgICAgICAgIGN1c3RvbU1vZGFsRGVmYXVsdHMuYmFja2Ryb3AgPSAnc3RhdGljJztcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2hvdyhjdXN0b21Nb2RhbERlZmF1bHRzLCBjdXN0b21Nb2RhbE9wdGlvbnMpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuc2hvdyA9IGZ1bmN0aW9uIChjdXN0b21Nb2RhbERlZmF1bHRzLCBjdXN0b21Nb2RhbE9wdGlvbnMpIHtcclxuICAgICAgICAgICAgLy9DcmVhdGUgdGVtcCBvYmplY3RzIHRvIHdvcmsgd2l0aCBzaW5jZSB3ZSdyZSBpbiBhIHNpbmdsZXRvbiBzZXJ2aWNlXHJcbiAgICAgICAgICAgIHZhciB0ZW1wTW9kYWxEZWZhdWx0cyA9IHt9O1xyXG4gICAgICAgICAgICB2YXIgdGVtcE1vZGFsT3B0aW9ucyA9IHt9O1xyXG5cclxuICAgICAgICAgICAgLy9NYXAgYW5ndWxhci11aSBtb2RhbCBjdXN0b20gZGVmYXVsdHMgdG8gbW9kYWwgZGVmYXVsdHMgZGVmaW5lZCBpbiBzZXJ2aWNlXHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHRlbXBNb2RhbERlZmF1bHRzLCBtb2RhbERlZmF1bHRzLCBjdXN0b21Nb2RhbERlZmF1bHRzKTtcclxuXHJcbiAgICAgICAgICAgIC8vTWFwIG1vZGFsLmh0bWwgJHNjb3BlIGN1c3RvbSBwcm9wZXJ0aWVzIHRvIGRlZmF1bHRzIGRlZmluZWQgaW4gc2VydmljZVxyXG4gICAgICAgICAgICBhbmd1bGFyLmV4dGVuZCh0ZW1wTW9kYWxPcHRpb25zLCBtb2RhbE9wdGlvbnMsIGN1c3RvbU1vZGFsT3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRlbXBNb2RhbERlZmF1bHRzLmNvbnRyb2xsZXIpIHtcclxuICAgICAgICAgICAgICAgIHRlbXBNb2RhbERlZmF1bHRzLmNvbnRyb2xsZXIgPSBmdW5jdGlvbiAoJHNjb3BlLCAkdWliTW9kYWxJbnN0YW5jZSwgTm90aWZpY2F0b3IsICRyb290U2NvcGUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm1vZGFsT3B0aW9ucyA9IHRlbXBNb2RhbE9wdGlvbnM7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm1vZGFsT3B0aW9ucy5vayA9IGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS5uZXdGTmFtZSA9ICRzY29wZS5uZXdmb2xkZXJuYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBGaWxlTWFuYWdlci5BZGRGb2xkZXIoJHJvb3RTY29wZS51c2VyLCBKU09OLnN0cmluZ2lmeSh7Zm9sZGVyOiAkc2NvcGUubmV3Zm9sZGVybmFtZX0pKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnbmV3Rm9sZGVyJywgcmVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBOb3RpZmljYXRvci5zdWNjZXNzKHJlcy5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBOb3RpZmljYXRvci5lcnJvcihyZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubW9kYWxPcHRpb25zLmNsb3NlID0gZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkdWliTW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJHVpYk1vZGFsLm9wZW4odGVtcE1vZGFsRGVmYXVsdHMpLnJlc3VsdDtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxufSkoKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2ZpbGVzbGlzdC9tb2RhbC9jcmVhdGVmb2xkZXIuc2VydmljZS5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QTs7OztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUNyTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDOUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QSIsInNvdXJjZVJvb3QiOiIifQ==