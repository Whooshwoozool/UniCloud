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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
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
            var url = 'http://localhost:1337/api/users/' + user_name + '/files/' + file_id;
            return $http.put(url, data)
                .then(handleSuccess, handleError('Error updating file'));
        }

        function DeleteFolder(user_name, folder_id) {
            var url = 'http://localhost:1337/api/users/' + user_name + '/files/' + file_id;
            return $http.delete(url)
                .then(handleSuccess, handleError('Error deleting file'));
        }

        function AddFolder(user_name, foldersname) {
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

    FilesList.$inject = ['$scope', 'FileManager', 'Notificator', 'modalService', '$rootScope', 'Upload', 'uploadFileModalService'];

    function FilesList($scope, FileManager, Notificator, modalService, $rootScope, Upload, uploadFileModalService) {
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
        
        //get folders
        //moks data
        $scope.folders = [
            {
                'title': 'folder1',
                'user': 'mharbisherr'
            },
            {
                'title': 'folder2',
                'user': 'mharbisherr'
            },
            {
                'title': 'folder3',
                'user': 'mharbisherr'
            }
        ];
        $rootScope.foldersList = $scope.folders;
    
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
                headerText: 'Some header text',
                bodyText: 'Are you sure you want to upload this file?'
            };
            uploadFileModalService.showModal({}, modalOptions).then(function (result) {
                //var index = findIndex($scope.files, '_id', file_id);
                //$scope.files[index].title = $rootScope.newFName;
                console.log('it works');
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
                        FileManager.UpdateFile(obj.user, obj._id, JSON.stringify({filename: $scope.newfilename}))
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
/* 3 */
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
                        var fname = 'Main';
                        var fd = new FormData();
                        fd.append('file', $scope.uploadfilename);

                        FileManager.AddFile($rootScope.user, fd, fname)
                            .then(function (res) {
                                console.log(res);
                                //console.log(res);
                                //console.log(fd.get('file'));
                            }, function (res) {
                                console.log('err');
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
/* 4 */
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
/* 5 */
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

angular.module('myApp', ['toastr', 'ngAnimate', 'ui.bootstrap', 'ngFileUpload']);

__webpack_require__(1);
__webpack_require__(0);
__webpack_require__(5);
__webpack_require__(4);
__webpack_require__(2);
__webpack_require__(3);

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmJ1bmRsZS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBiZDAxZDRjMTYzZTY3ZWU1OGI2NSIsIndlYnBhY2s6Ly8vLi9maWxlc2xpc3QvZmlsZW1hbmFnZXIuc2VydmljZS5qcyIsIndlYnBhY2s6Ly8vLi9maWxlc2xpc3QvbGlzdC5jb250cm9sbGVyLmpzIiwid2VicGFjazovLy8uL2ZpbGVzbGlzdC9tb2RhbC9tb2RhbC5qcyIsIndlYnBhY2s6Ly8vLi9maWxlc2xpc3QvbW9kYWwvdXBsb2FkZmlsZS5zZXJ2aWNlLmpzIiwid2VicGFjazovLy8uL25vdGlmaWNhdG9yL25vdGlmaWNhdGlvbnMuanMiLCJ3ZWJwYWNrOi8vLy4vd2lkZ2V0L3dpZGdldC5qcyIsIndlYnBhY2s6Ly8vLi9hcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA2KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBiZDAxZDRjMTYzZTY3ZWU1OGI2NSIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnXG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ215QXBwJylcbiAgICAgICAgLmZhY3RvcnkoJ0ZpbGVNYW5hZ2VyJywgRmlsZU1hbmFnZXIpO1xuXG4gICAgRmlsZU1hbmFnZXIuJGluamVjdCA9IFsnJGh0dHAnXTtcblxuICAgIGZ1bmN0aW9uIEZpbGVNYW5hZ2VyKCRodHRwKSB7XG4gICAgICAgIHZhciBzZXJ2aWNlID0ge307XG5cbiAgICAgICAgLy9mb3IgZmlsZXNcbiAgICAgICAgc2VydmljZS5HZXRBbGxGaWxlcyA9IEdldEFsbEZpbGVzO1xuICAgICAgICBzZXJ2aWNlLlVwZGF0ZUZpbGUgPSBVcGRhdGVGaWxlO1xuICAgICAgICBzZXJ2aWNlLkRlbGV0ZUZpbGUgPSBEZWxldGVGaWxlO1xuICAgICAgICBzZXJ2aWNlLkFkZEZpbGUgPSBBZGRGaWxlO1xuXG4gICAgICAgIC8vZm9yIGZvbGRlcnNcblxuICAgICAgICByZXR1cm4gc2VydmljZTtcbiAgICAgICAgXG4gICAgICAgIC8vZm9yIGZpbGVzXG4gICAgICAgIGZ1bmN0aW9uIEdldEFsbEZpbGVzKHVzZXJfbmFtZSkge1xuICAgICAgICAgICAgdmFyIHVybCA9ICdodHRwOi8vbG9jYWxob3N0OjEzMzcvYXBpL3VzZXJzLycgKyB1c2VyX25hbWUgKyAnL2ZpbGVzJztcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQodXJsKVxuICAgICAgICAgICAgICAgIC50aGVuKGhhbmRsZVN1Y2Nlc3MsIGhhbmRsZUVycm9yKCdFcnJvciBnZXR0aW5nIGFsbCBmaWxlcycpKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgZnVuY3Rpb24gVXBkYXRlRmlsZSh1c2VyX25hbWUsIGZpbGVfaWQsIGRhdGEpIHtcbiAgICAgICAgICAgIHZhciB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdDoxMzM3L2FwaS91c2Vycy8nICsgdXNlcl9uYW1lICsgJy9maWxlcy8nICsgZmlsZV9pZDtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wdXQodXJsLCBkYXRhKVxuICAgICAgICAgICAgICAgIC50aGVuKGhhbmRsZVN1Y2Nlc3MsIGhhbmRsZUVycm9yKCdFcnJvciB1cGRhdGluZyBmaWxlJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gRGVsZXRlRmlsZSh1c2VyX25hbWUsIGZpbGVfaWQpIHtcbiAgICAgICAgICAgIHZhciB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdDoxMzM3L2FwaS91c2Vycy8nICsgdXNlcl9uYW1lICsgJy9maWxlcy8nICsgZmlsZV9pZDtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5kZWxldGUodXJsKVxuICAgICAgICAgICAgICAgIC50aGVuKGhhbmRsZVN1Y2Nlc3MsIGhhbmRsZUVycm9yKCdFcnJvciBkZWxldGluZyBmaWxlJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gQWRkRmlsZSh1c2VyX25hbWUsIGZpbGUsIGZvbGRlcnNuYW1lKSB7XG4gICAgICAgICAgICB2YXIgdXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6MTMzNy9hcGkvdXNlcnMvJyArIHVzZXJfbmFtZSArICcvZmlsZXMnO1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QodXJsLCBmaWxlLCB7XG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICBcIlgtVGVzdGluZ1wiIDogZm9sZGVyc25hbWVcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybVJlcXVlc3Q6IGFuZ3VsYXIuaWRlbnRpdHlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oaGFuZGxlU3VjY2VzczIsIGhhbmRsZUVycm9yKCdFcnJvciB3aGlsZSBhZGQgZmlsZScpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vZm9yIGZvbGRlcnNcbiAgICAgICAgZnVuY3Rpb24gR2V0QWxsRm9sZGVycyh1c2VyX25hbWUpIHtcbiAgICAgICAgICAgIHZhciB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdDoxMzM3L2FwaS91c2Vycy8nICsgdXNlcl9uYW1lICsgJy9mb2xkZXJzJztcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQodXJsKVxuICAgICAgICAgICAgICAgIC50aGVuKGhhbmRsZVN1Y2Nlc3MsIGhhbmRsZUVycm9yKCdFcnJvciBnZXR0aW5nIGFsbCBmb2xkZXJzJykpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBmdW5jdGlvbiBVcGRhdGVGb2xkZXIodXNlcl9uYW1lLCBmb2xkZXJfaWQsIGRhdGEpIHtcbiAgICAgICAgICAgIHZhciB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdDoxMzM3L2FwaS91c2Vycy8nICsgdXNlcl9uYW1lICsgJy9maWxlcy8nICsgZmlsZV9pZDtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wdXQodXJsLCBkYXRhKVxuICAgICAgICAgICAgICAgIC50aGVuKGhhbmRsZVN1Y2Nlc3MsIGhhbmRsZUVycm9yKCdFcnJvciB1cGRhdGluZyBmaWxlJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gRGVsZXRlRm9sZGVyKHVzZXJfbmFtZSwgZm9sZGVyX2lkKSB7XG4gICAgICAgICAgICB2YXIgdXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6MTMzNy9hcGkvdXNlcnMvJyArIHVzZXJfbmFtZSArICcvZmlsZXMvJyArIGZpbGVfaWQ7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKHVybClcbiAgICAgICAgICAgICAgICAudGhlbihoYW5kbGVTdWNjZXNzLCBoYW5kbGVFcnJvcignRXJyb3IgZGVsZXRpbmcgZmlsZScpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIEFkZEZvbGRlcih1c2VyX25hbWUsIGZvbGRlcnNuYW1lKSB7XG4gICAgICAgICAgICB2YXIgdXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6MTMzNy9hcGkvdXNlcnMvJyArIHVzZXJfbmFtZSArICcvZmlsZXMnO1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QodXJsLCBmaWxlLCB7XG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICBcIlgtVGVzdGluZ1wiIDogZm9sZGVyc25hbWVcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybVJlcXVlc3Q6IGFuZ3VsYXIuaWRlbnRpdHlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oaGFuZGxlU3VjY2VzczIsIGhhbmRsZUVycm9yKCdFcnJvciB3aGlsZSBhZGQgZmlsZScpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vb3RoZXIgZnVuY3Rpb25zXG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlU3VjY2VzcyhyZXMpIHtcbiAgICAgICAgICAgIHJldHVybiByZXMuZGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVN1Y2Nlc3MyKHJlcykge1xuICAgICAgICAgICAgcmV0dXJuIHJlcy5kYXRhO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlRXJyb3IoZXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHttZXNzYWdlOiBlcnJvcn07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KSgpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vZmlsZXNsaXN0L2ZpbGVtYW5hZ2VyLnNlcnZpY2UuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCdcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnbXlBcHAnKVxuICAgICAgICAuY29udHJvbGxlcignRmlsZXNMaXN0JywgRmlsZXNMaXN0KTtcblxuICAgIEZpbGVzTGlzdC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnRmlsZU1hbmFnZXInLCAnTm90aWZpY2F0b3InLCAnbW9kYWxTZXJ2aWNlJywgJyRyb290U2NvcGUnLCAnVXBsb2FkJywgJ3VwbG9hZEZpbGVNb2RhbFNlcnZpY2UnXTtcblxuICAgIGZ1bmN0aW9uIEZpbGVzTGlzdCgkc2NvcGUsIEZpbGVNYW5hZ2VyLCBOb3RpZmljYXRvciwgbW9kYWxTZXJ2aWNlLCAkcm9vdFNjb3BlLCBVcGxvYWQsIHVwbG9hZEZpbGVNb2RhbFNlcnZpY2UpIHtcbiAgICAgICAgdmFyIHVzZXJfbmFtZSA9ICdtaGFyYmlzaGVycic7XG4gICAgICAgICRyb290U2NvcGUudXNlciA9IHVzZXJfbmFtZTtcblxuICAgICAgICAkc2NvcGUubm0gPSB1c2VyX25hbWU7XG4gICAgXG4gICAgICAgIC8vZ2V0IGZpbGVzXG4gICAgICAgIEZpbGVNYW5hZ2VyLkdldEFsbEZpbGVzKHVzZXJfbmFtZSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmlsZXMgPSByZXM7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgTm90aWZpY2F0b3Iuc3VjY2VzcygnRmlsZXMgaGF2ZSBiZWVuIHN1Y2Nlc3NmdWxseSBsb2FkZWQhJyk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQocmVzLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAvL2dldCBmb2xkZXJzXG4gICAgICAgIC8vbW9rcyBkYXRhXG4gICAgICAgICRzY29wZS5mb2xkZXJzID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICd0aXRsZSc6ICdmb2xkZXIxJyxcbiAgICAgICAgICAgICAgICAndXNlcic6ICdtaGFyYmlzaGVycidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ3RpdGxlJzogJ2ZvbGRlcjInLFxuICAgICAgICAgICAgICAgICd1c2VyJzogJ21oYXJiaXNoZXJyJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAndGl0bGUnOiAnZm9sZGVyMycsXG4gICAgICAgICAgICAgICAgJ3VzZXInOiAnbWhhcmJpc2hlcnInXG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgICAgICRyb290U2NvcGUuZm9sZGVyc0xpc3QgPSAkc2NvcGUuZm9sZGVycztcbiAgICBcbiAgICAgICAgLy9kZWxldGUgZmlsZVxuICAgICAgICAkc2NvcGUuZGVsZXRlRmlsZSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgIHZhciBmaWxlX2lkID0gb2JqLl9pZDtcbiAgICAgICAgICAgIEZpbGVNYW5hZ2VyLkRlbGV0ZUZpbGUoJHNjb3BlLm5tLCBmaWxlX2lkKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgTm90aWZpY2F0b3Iuc3VjY2VzcygnaXQgd29ya3MhIEZpbGUgd2FzIHN1Y2Nlc3NmdWxseSBkZWxldGVkIScpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBmaW5kSW5kZXgoJHNjb3BlLmZpbGVzLCAnX2lkJywgZmlsZV9pZCk7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5maWxlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICAvL2RlbGV0ZSAkc2NvcGUuZmlsZXNbaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5maWxlcyk7XG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICBOb3RpZmljYXRvci5lcnJvcihyZXMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgLy9yZW5hbWUgZmlsZVxuICAgICAgICAkc2NvcGUucmVuYW1lRmlsZSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgIHZhciBmaWxlX2lkID0gb2JqLl9pZDtcbiAgICAgICAgICAgIHZhciBtb2RhbE9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgY2xvc2VCdXR0b25UZXh0OiAnQ2FuY2VsJyxcbiAgICAgICAgICAgICAgICBhY3Rpb25CdXR0b25UZXh0OiAnUmVuYW1lJyxcbiAgICAgICAgICAgICAgICBoZWFkZXJUZXh0OiBvYmoudGl0bGUsXG4gICAgICAgICAgICAgICAgYm9keVRleHQ6ICdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcmVuYW1lIHRoaXMgZmlsZT8nXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbW9kYWxTZXJ2aWNlLnNob3dNb2RhbCh7fSwgbW9kYWxPcHRpb25zLCBvYmopLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IGZpbmRJbmRleCgkc2NvcGUuZmlsZXMsICdfaWQnLCBmaWxlX2lkKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmlsZXNbaW5kZXhdLnRpdGxlID0gJHJvb3RTY29wZS5uZXdGTmFtZTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuZmlsZXNbaW5kZXhdLnRpdGxlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vdXBsb2FkIGZpbGVcbiAgICAgICAgJHNjb3BlLnVwbG9hZEZpbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvL3ZhciBmaWxlX2lkID0gb2JqLl9pZDtcbiAgICAgICAgICAgIHZhciBtb2RhbE9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgY2xvc2VCdXR0b25UZXh0OiAnQ2FuY2VsJyxcbiAgICAgICAgICAgICAgICBhY3Rpb25CdXR0b25UZXh0OiAnVXBsb2FkJyxcbiAgICAgICAgICAgICAgICBoZWFkZXJUZXh0OiAnU29tZSBoZWFkZXIgdGV4dCcsXG4gICAgICAgICAgICAgICAgYm9keVRleHQ6ICdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gdXBsb2FkIHRoaXMgZmlsZT8nXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdXBsb2FkRmlsZU1vZGFsU2VydmljZS5zaG93TW9kYWwoe30sIG1vZGFsT3B0aW9ucykudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgLy92YXIgaW5kZXggPSBmaW5kSW5kZXgoJHNjb3BlLmZpbGVzLCAnX2lkJywgZmlsZV9pZCk7XG4gICAgICAgICAgICAgICAgLy8kc2NvcGUuZmlsZXNbaW5kZXhdLnRpdGxlID0gJHJvb3RTY29wZS5uZXdGTmFtZTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaXQgd29ya3MnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgZnVuY3Rpb24gZmluZEluZGV4KGFycmF5LCBrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFycmF5W2ldW2tleV0gPT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgIH1cbn0pKCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9maWxlc2xpc3QvbGlzdC5jb250cm9sbGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ215QXBwJylcbiAgICAgICAgLnNlcnZpY2UoJ21vZGFsU2VydmljZScsIG1vZGFsU2VydmljZSk7XG5cbiAgICBtb2RhbFNlcnZpY2UuJGluamVjdCA9IFsnJHVpYk1vZGFsJywgJ0ZpbGVNYW5hZ2VyJywgJ05vdGlmaWNhdG9yJ107XG4gICAgZnVuY3Rpb24gbW9kYWxTZXJ2aWNlKCR1aWJNb2RhbCwgRmlsZU1hbmFnZXIsIE5vdGlmaWNhdG9yKSB7XG5cbiAgICAgICAgdmFyIG1vZGFsRGVmYXVsdHMgPSB7XG4gICAgICAgICAgICBiYWNrZHJvcDogdHJ1ZSxcbiAgICAgICAgICAgIGtleWJvYXJkOiB0cnVlLFxuICAgICAgICAgICAgbW9kYWxGYWRlOiB0cnVlLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi9hcHAvZmlsZXNsaXN0L21vZGFsL21vZGFsLmh0bWwnXG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIG1vZGFsT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGNsb3NlQnV0dG9uVGV4dDogJ0Nsb3NlJyxcbiAgICAgICAgICAgIGFjdGlvbkJ1dHRvblRleHQ6ICdPSycsXG4gICAgICAgICAgICBoZWFkZXJUZXh0OiAnUHJvY2VlZD8nLFxuICAgICAgICAgICAgYm9keVRleHQ6ICdQZXJmb3JtIHRoaXMgYWN0aW9uPydcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnNob3dNb2RhbCA9IGZ1bmN0aW9uIChjdXN0b21Nb2RhbERlZmF1bHRzLCBjdXN0b21Nb2RhbE9wdGlvbnMsIG9iaikge1xuICAgICAgICAgICAgaWYgKCFjdXN0b21Nb2RhbERlZmF1bHRzKSBjdXN0b21Nb2RhbERlZmF1bHRzID0ge307XG4gICAgICAgICAgICBjdXN0b21Nb2RhbERlZmF1bHRzLmJhY2tkcm9wID0gJ3N0YXRpYyc7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zaG93KGN1c3RvbU1vZGFsRGVmYXVsdHMsIGN1c3RvbU1vZGFsT3B0aW9ucywgb2JqKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnNob3cgPSBmdW5jdGlvbiAoY3VzdG9tTW9kYWxEZWZhdWx0cywgY3VzdG9tTW9kYWxPcHRpb25zLCBvYmopIHtcbiAgICAgICAgICAgIC8vQ3JlYXRlIHRlbXAgb2JqZWN0cyB0byB3b3JrIHdpdGggc2luY2Ugd2UncmUgaW4gYSBzaW5nbGV0b24gc2VydmljZVxuICAgICAgICAgICAgdmFyIHRlbXBNb2RhbERlZmF1bHRzID0ge307XG4gICAgICAgICAgICB2YXIgdGVtcE1vZGFsT3B0aW9ucyA9IHt9O1xuXG4gICAgICAgICAgICAvL01hcCBhbmd1bGFyLXVpIG1vZGFsIGN1c3RvbSBkZWZhdWx0cyB0byBtb2RhbCBkZWZhdWx0cyBkZWZpbmVkIGluIHNlcnZpY2VcbiAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHRlbXBNb2RhbERlZmF1bHRzLCBtb2RhbERlZmF1bHRzLCBjdXN0b21Nb2RhbERlZmF1bHRzKTtcblxuICAgICAgICAgICAgLy9NYXAgbW9kYWwuaHRtbCAkc2NvcGUgY3VzdG9tIHByb3BlcnRpZXMgdG8gZGVmYXVsdHMgZGVmaW5lZCBpbiBzZXJ2aWNlXG4gICAgICAgICAgICBhbmd1bGFyLmV4dGVuZCh0ZW1wTW9kYWxPcHRpb25zLCBtb2RhbE9wdGlvbnMsIGN1c3RvbU1vZGFsT3B0aW9ucyk7XG5cbiAgICAgICAgICAgIGlmICghdGVtcE1vZGFsRGVmYXVsdHMuY29udHJvbGxlcikge1xuICAgICAgICAgICAgICAgIHRlbXBNb2RhbERlZmF1bHRzLmNvbnRyb2xsZXIgPSBmdW5jdGlvbiAoJHNjb3BlLCAkdWliTW9kYWxJbnN0YW5jZSwgTm90aWZpY2F0b3IsICRyb290U2NvcGUpIHtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubW9kYWxPcHRpb25zID0gdGVtcE1vZGFsT3B0aW9ucztcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm1vZGFsT3B0aW9ucy5vayA9IGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUubmV3Rk5hbWUgPSAkc2NvcGUubmV3ZmlsZW5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBGaWxlTWFuYWdlci5VcGRhdGVGaWxlKG9iai51c2VyLCBvYmouX2lkLCBKU09OLnN0cmluZ2lmeSh7ZmlsZW5hbWU6ICRzY29wZS5uZXdmaWxlbmFtZX0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTm90aWZpY2F0b3Iuc3VjY2VzcyhyZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTm90aWZpY2F0b3IuZXJyb3IocmVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5tb2RhbE9wdGlvbnMuY2xvc2UgPSBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdWliTW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAkdWliTW9kYWwub3Blbih0ZW1wTW9kYWxEZWZhdWx0cykucmVzdWx0O1xuICAgICAgICB9O1xuXG4gICAgfVxufSkoKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2ZpbGVzbGlzdC9tb2RhbC9tb2RhbC5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdteUFwcCcpXG4gICAgICAgIC5zZXJ2aWNlKCd1cGxvYWRGaWxlTW9kYWxTZXJ2aWNlJywgdXBsb2FkRmlsZU1vZGFsU2VydmljZSk7XG5cbiAgICB1cGxvYWRGaWxlTW9kYWxTZXJ2aWNlLiRpbmplY3QgPSBbJyR1aWJNb2RhbCcsICdGaWxlTWFuYWdlcicsICdOb3RpZmljYXRvcicsICdVcGxvYWQnXTtcbiAgICBmdW5jdGlvbiB1cGxvYWRGaWxlTW9kYWxTZXJ2aWNlKCR1aWJNb2RhbCwgRmlsZU1hbmFnZXIsIE5vdGlmaWNhdG9yLCBVcGxvYWQpIHtcblxuICAgICAgICB2YXIgbW9kYWxEZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIGJhY2tkcm9wOiB0cnVlLFxuICAgICAgICAgICAga2V5Ym9hcmQ6IHRydWUsXG4gICAgICAgICAgICBtb2RhbEZhZGU6IHRydWUsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL2FwcC9maWxlc2xpc3QvbW9kYWwvdXBsb2FkTW9kYWwuaHRtbCdcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgbW9kYWxPcHRpb25zID0ge1xuICAgICAgICAgICAgY2xvc2VCdXR0b25UZXh0OiAnQ2xvc2UnLFxuICAgICAgICAgICAgYWN0aW9uQnV0dG9uVGV4dDogJ09LJyxcbiAgICAgICAgICAgIGhlYWRlclRleHQ6ICdQcm9jZWVkPycsXG4gICAgICAgICAgICBib2R5VGV4dDogJ1BlcmZvcm0gdGhpcyBhY3Rpb24/J1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuc2hvd01vZGFsID0gZnVuY3Rpb24gKGN1c3RvbU1vZGFsRGVmYXVsdHMsIGN1c3RvbU1vZGFsT3B0aW9ucywgb2JqKSB7XG4gICAgICAgICAgICBpZiAoIWN1c3RvbU1vZGFsRGVmYXVsdHMpIGN1c3RvbU1vZGFsRGVmYXVsdHMgPSB7fTtcbiAgICAgICAgICAgIGN1c3RvbU1vZGFsRGVmYXVsdHMuYmFja2Ryb3AgPSAnc3RhdGljJztcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNob3coY3VzdG9tTW9kYWxEZWZhdWx0cywgY3VzdG9tTW9kYWxPcHRpb25zLCBvYmopO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuc2hvdyA9IGZ1bmN0aW9uIChjdXN0b21Nb2RhbERlZmF1bHRzLCBjdXN0b21Nb2RhbE9wdGlvbnMsIG9iaikge1xuICAgICAgICAgICAgLy9DcmVhdGUgdGVtcCBvYmplY3RzIHRvIHdvcmsgd2l0aCBzaW5jZSB3ZSdyZSBpbiBhIHNpbmdsZXRvbiBzZXJ2aWNlXG4gICAgICAgICAgICB2YXIgdGVtcE1vZGFsRGVmYXVsdHMgPSB7fTtcbiAgICAgICAgICAgIHZhciB0ZW1wTW9kYWxPcHRpb25zID0ge307XG5cbiAgICAgICAgICAgIC8vTWFwIGFuZ3VsYXItdWkgbW9kYWwgY3VzdG9tIGRlZmF1bHRzIHRvIG1vZGFsIGRlZmF1bHRzIGRlZmluZWQgaW4gc2VydmljZVxuICAgICAgICAgICAgYW5ndWxhci5leHRlbmQodGVtcE1vZGFsRGVmYXVsdHMsIG1vZGFsRGVmYXVsdHMsIGN1c3RvbU1vZGFsRGVmYXVsdHMpO1xuXG4gICAgICAgICAgICAvL01hcCBtb2RhbC5odG1sICRzY29wZSBjdXN0b20gcHJvcGVydGllcyB0byBkZWZhdWx0cyBkZWZpbmVkIGluIHNlcnZpY2VcbiAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHRlbXBNb2RhbE9wdGlvbnMsIG1vZGFsT3B0aW9ucywgY3VzdG9tTW9kYWxPcHRpb25zKTtcblxuICAgICAgICAgICAgaWYgKCF0ZW1wTW9kYWxEZWZhdWx0cy5jb250cm9sbGVyKSB7XG4gICAgICAgICAgICAgICAgdGVtcE1vZGFsRGVmYXVsdHMuY29udHJvbGxlciA9IGZ1bmN0aW9uICgkc2NvcGUsICR1aWJNb2RhbEluc3RhbmNlLCBOb3RpZmljYXRvciwgJHJvb3RTY29wZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm9sZGVyc0wgPSAkcm9vdFNjb3BlLmZvbGRlcnNMaXN0O1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBsb2FkRmlsZSA9IGZ1bmN0aW9uICgkZmlsZSwgJGVyckZpbGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBsb2FkZmlsZW5hbWUgPSAkZmlsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkZmlsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qZmlsZS51cGxvYWQgPSBVcGxvYWQudXBsb2FkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDoxMzM3L2FwaS91c2Vycy8nICsgdXNlcl9uYW1lICsgJy9maWxlcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtmaWxlOiBmaWxlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlLnVwbG9hZC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGUucmVzdWx0ID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID4gMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmVycm9yTXNnID0gcmVzcG9uc2Uuc3RhdHVzICsgJzogJyArIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZS5wcm9ncmVzcyA9IE1hdGgubWluKDEwMCwgcGFyc2VJbnQoMTAwLjAgKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldnQubG9hZGVkIC8gZXZ0LnRvdGFsKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pOyovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdmaWxlIHdhcyBzdWNjZXNzZnVsbHkgc2VsZWN0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubW9kYWxPcHRpb25zID0gdGVtcE1vZGFsT3B0aW9ucztcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm1vZGFsT3B0aW9ucy5vayA9IGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmbmFtZSA9ICdNYWluJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmZCA9IG5ldyBGb3JtRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZmQuYXBwZW5kKCdmaWxlJywgJHNjb3BlLnVwbG9hZGZpbGVuYW1lKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgRmlsZU1hbmFnZXIuQWRkRmlsZSgkcm9vdFNjb3BlLnVzZXIsIGZkLCBmbmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhmZC5nZXQoJ2ZpbGUnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2xvZ2ljIGhlcmVcblxuICAgICAgICAgICAgICAgICAgICAgICAgLyokcm9vdFNjb3BlLm5ld0ZOYW1lID0gJHNjb3BlLm5ld2ZpbGVuYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgRmlsZU1hbmFnZXIuVXBkYXRlRmlsZShvYmoudXNlciwgb2JqLl9pZCwgSlNPTi5zdHJpbmdpZnkoe2ZpbGVuYW1lOiAkc2NvcGUubmV3ZmlsZW5hbWV9KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vdGlmaWNhdG9yLnN1Y2Nlc3MocmVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vdGlmaWNhdG9yLmVycm9yKHJlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7Ki9cbiAgICAgICAgICAgICAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5tb2RhbE9wdGlvbnMuY2xvc2UgPSBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdWliTW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAkdWliTW9kYWwub3Blbih0ZW1wTW9kYWxEZWZhdWx0cykucmVzdWx0O1xuICAgICAgICB9O1xuXG4gICAgfVxufSkoKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2ZpbGVzbGlzdC9tb2RhbC91cGxvYWRmaWxlLnNlcnZpY2UuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdteUFwcCcpXG4gICAgICAgIC5jb25maWcobm90aWZpY2F0b3JDb25maWcpXG4gICAgICAgIC5mYWN0b3J5KCdOb3RpZmljYXRvcicsIE5vdGlmaWNhdG9yKVxuICAgICAgICAucnVuKG5vdGlmaWNhdGlvbnNSdW4pO1xuXG4gICAgTm90aWZpY2F0b3IuJGluamVjdCA9IFsndG9hc3RyJ107XG4gICAgZnVuY3Rpb24gTm90aWZpY2F0b3IodG9hc3RyKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihtc2csIHRpdGxlKSB7XG4gICAgICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MobXNnLCB0aXRsZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgd2FybmluZzogZnVuY3Rpb24obXNnLCB0aXRsZSkge1xuICAgICAgICAgICAgICAgIHRvYXN0ci53YXJuaW5nKG1zZywgdGl0bGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbihtc2csIHRpdGxlKSB7XG4gICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKG1zZywgdGl0bGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGluZm86IGZ1bmN0aW9uKG1zZywgdGl0bGUpIHtcbiAgICAgICAgICAgICAgICB0b2FzdHIuaW5mbyhtc2csIHRpdGxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5vdGlmaWNhdGlvbnNSdW4uJGluamVjdCA9IFsnJHJvb3RTY29wZScsICdOb3RpZmljYXRvcicsICckdGltZW91dCddO1xuICAgIGZ1bmN0aW9uIG5vdGlmaWNhdGlvbnNSdW4oJHJvb3RTY29wZSwgbm90aWZpY2F0b3IsICR0aW1lb3V0KSB7XG4gICAgICAgIC8qJHJvb3RTY29wZS4kb24oJyR1c2VyTG9nZ2VkSW4nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIG5vdGlmaWNhdG9yLnN1Y2Nlc3MoJ0hleSB0aGVyZSEnKTtcblxuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBub3RpZmljYXRvci5pbmZvKCdXZWxjb21lIHRvIHRoaXMgZnJlZSBhbmd1bGFyIGRhc2hib2FyZCBzZWVkIHByb2plY3QsJyArXG4gICAgICAgICAgICAgICAgJyB0aGF0IHlvdSBtYXkgdXNlIHRvIGJvb3RzdHJhcCB5b3VyIG5leHQgd2ViIGFwcCEnLCB7XG4gICAgICAgICAgICAgICAgICAgIHRpbWVPdXQ6IDEwMDAwXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LDMwMDApO1xuXG4gICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIG5vdGlmaWNhdG9yLmluZm8oJ0J0dywgZmVlbCBmcmVlIHRvIGNvbnRyaWJ1dGUgdG8gdGhpcyBwcm9qZWN0IGFuZCBoZWxwIHVzIGtpbGwgdGhlIHBhaWQgdGVtcGxhdGVzIG1hcmtldCA7KScsIHtcbiAgICAgICAgICAgICAgICAgICAgdGltZU91dDogMTAwMDBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sMTUwMDApXG4gICAgICAgIH0pO1xuICAgICAgICAkcm9vdFNjb3BlLiRvbignJHVzZXJMb2dnZWRPdXQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIG5vdGlmaWNhdG9yLnN1Y2Nlc3MoJ0xvZ2dlZCBvdXQgc3VjY2Vzc2Z1bGx5Jyk7XG4gICAgICAgIH0pOyovXG4gICAgICAgIGNvbnNvbGUubG9nKCdub3RpZmljYXRpb25zUnVuIHdvcmtzIScpO1xuICAgIH1cblxuICAgIG5vdGlmaWNhdG9yQ29uZmlnLiRpbmplY3QgPSBbJ3RvYXN0ckNvbmZpZyddO1xuICAgIGZ1bmN0aW9uIG5vdGlmaWNhdG9yQ29uZmlnKHRvYXN0ckNvbmZpZykge1xuICAgICAgICBhbmd1bGFyLmV4dGVuZCh0b2FzdHJDb25maWcsIHtcbiAgICAgICAgICAgIHRpbWVPdXQ6IDMwMDBcbiAgICAgICAgfSk7XG4gICAgfVxuXG59KSgpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub3RpZmljYXRvci9ub3RpZmljYXRpb25zLmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnbXlBcHAnKVxuICAgICAgICAuZGlyZWN0aXZlKCd3aWRnZXQnLCB3aWRnZXQpO1xuXG4gICAgZnVuY3Rpb24gd2lkZ2V0KCkge1xuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCAkZWxlbWVudCkge1xuICAgICAgICAgICAgJGVsZW1lbnQuYWRkQ2xhc3MoJ3dpZGdldCcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQSdcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3dpZGdldC93aWRnZXQuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiYW5ndWxhci5tb2R1bGUoJ215QXBwJywgWyd0b2FzdHInLCAnbmdBbmltYXRlJywgJ3VpLmJvb3RzdHJhcCcsICduZ0ZpbGVVcGxvYWQnXSk7XG5cbnJlcXVpcmUoJy4vZmlsZXNsaXN0L2xpc3QuY29udHJvbGxlci5qcycpO1xucmVxdWlyZSgnLi9maWxlc2xpc3QvZmlsZW1hbmFnZXIuc2VydmljZS5qcycpO1xucmVxdWlyZSgnLi93aWRnZXQvd2lkZ2V0Jyk7XG5yZXF1aXJlKCcuL25vdGlmaWNhdG9yL25vdGlmaWNhdGlvbnMnKTtcbnJlcXVpcmUoJy4vZmlsZXNsaXN0L21vZGFsL21vZGFsJyk7XG5yZXF1aXJlKCcuL2ZpbGVzbGlzdC9tb2RhbC91cGxvYWRmaWxlLnNlcnZpY2UnKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2FwcC5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QTs7OztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUN2R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QSIsInNvdXJjZVJvb3QiOiIifQ==