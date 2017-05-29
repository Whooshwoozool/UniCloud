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
                        console.log($scope.uploadfilename);
                        FileManager.AddFile($rootScope.user, fd, fname)
                            .then(function (res) {
                                console.log(res);
                                console.log(fd.get('file'));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmJ1bmRsZS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBjZjhmMzMzYjhkMWZmZDAxMmViMiIsIndlYnBhY2s6Ly8vLi9maWxlc2xpc3QvZmlsZW1hbmFnZXIuc2VydmljZS5qcyIsIndlYnBhY2s6Ly8vLi9maWxlc2xpc3QvbGlzdC5jb250cm9sbGVyLmpzIiwid2VicGFjazovLy8uL2ZpbGVzbGlzdC9tb2RhbC9tb2RhbC5qcyIsIndlYnBhY2s6Ly8vLi9maWxlc2xpc3QvbW9kYWwvdXBsb2FkZmlsZS5zZXJ2aWNlLmpzIiwid2VicGFjazovLy8uL25vdGlmaWNhdG9yL25vdGlmaWNhdGlvbnMuanMiLCJ3ZWJwYWNrOi8vLy4vd2lkZ2V0L3dpZGdldC5qcyIsIndlYnBhY2s6Ly8vLi9hcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA2KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBjZjhmMzMzYjhkMWZmZDAxMmViMiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCdcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnbXlBcHAnKVxyXG4gICAgICAgIC5mYWN0b3J5KCdGaWxlTWFuYWdlcicsIEZpbGVNYW5hZ2VyKTtcclxuXHJcbiAgICBGaWxlTWFuYWdlci4kaW5qZWN0ID0gWyckaHR0cCddO1xyXG5cclxuICAgIGZ1bmN0aW9uIEZpbGVNYW5hZ2VyKCRodHRwKSB7XHJcbiAgICAgICAgdmFyIHNlcnZpY2UgPSB7fTtcclxuXHJcbiAgICAgICAgc2VydmljZS5HZXRBbGxGaWxlcyA9IEdldEFsbEZpbGVzO1xyXG4gICAgICAgIHNlcnZpY2UuVXBkYXRlRmlsZSA9IFVwZGF0ZUZpbGU7XHJcbiAgICAgICAgc2VydmljZS5EZWxldGVGaWxlID0gRGVsZXRlRmlsZTtcclxuICAgICAgICBzZXJ2aWNlLkFkZEZpbGUgPSBBZGRGaWxlO1xyXG5cclxuICAgICAgICByZXR1cm4gc2VydmljZTtcclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBHZXRBbGxGaWxlcyh1c2VyX25hbWUpIHtcclxuICAgICAgICAgICAgdmFyIHVybCA9ICdodHRwOi8vbG9jYWxob3N0OjEzMzcvYXBpL3VzZXJzLycgKyB1c2VyX25hbWUgKyAnL2ZpbGVzJztcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCh1cmwpXHJcbiAgICAgICAgICAgICAgICAudGhlbihoYW5kbGVTdWNjZXNzLCBoYW5kbGVFcnJvcignRXJyb3IgZ2V0dGluZyBhbGwgZmlsZXMnKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIFVwZGF0ZUZpbGUodXNlcl9uYW1lLCBmaWxlX2lkLCBkYXRhKSB7XHJcbiAgICAgICAgICAgIHZhciB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdDoxMzM3L2FwaS91c2Vycy8nICsgdXNlcl9uYW1lICsgJy9maWxlcy8nICsgZmlsZV9pZDtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnB1dCh1cmwsIGRhdGEpXHJcbiAgICAgICAgICAgICAgICAudGhlbihoYW5kbGVTdWNjZXNzLCBoYW5kbGVFcnJvcignRXJyb3IgdXBkYXRpbmcgZmlsZScpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIERlbGV0ZUZpbGUodXNlcl9uYW1lLCBmaWxlX2lkKSB7XHJcbiAgICAgICAgICAgIHZhciB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdDoxMzM3L2FwaS91c2Vycy8nICsgdXNlcl9uYW1lICsgJy9maWxlcy8nICsgZmlsZV9pZDtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZSh1cmwpXHJcbiAgICAgICAgICAgICAgICAudGhlbihoYW5kbGVTdWNjZXNzLCBoYW5kbGVFcnJvcignRXJyb3IgZGVsZXRpbmcgZmlsZScpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIEFkZEZpbGUodXNlcl9uYW1lLCBmaWxlLCBmb2xkZXJzbmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgdXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6MTMzNy9hcGkvdXNlcnMvJyArIHVzZXJfbmFtZSArICcvZmlsZXMnO1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCh1cmwsIGZpbGUsIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiWC1UZXN0aW5nXCIgOiBmb2xkZXJzbmFtZVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybVJlcXVlc3Q6IGFuZ3VsYXIuaWRlbnRpdHlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKGhhbmRsZVN1Y2Nlc3MyLCBoYW5kbGVFcnJvcignRXJyb3Igd2hpbGUgYWRkIGZpbGUnKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVTdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzLmRhdGE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVTdWNjZXNzMihyZXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5kYXRhLm1lc3NhZ2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVFcnJvcihlcnJvcikge1xyXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHttZXNzYWdlOiBlcnJvcn07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9maWxlc2xpc3QvZmlsZW1hbmFnZXIuc2VydmljZS5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnXHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ215QXBwJylcclxuICAgICAgICAuY29udHJvbGxlcignRmlsZXNMaXN0JywgRmlsZXNMaXN0KTtcclxuXHJcbiAgICBGaWxlc0xpc3QuJGluamVjdCA9IFsnJHNjb3BlJywgJ0ZpbGVNYW5hZ2VyJywgJ05vdGlmaWNhdG9yJywgJ21vZGFsU2VydmljZScsICckcm9vdFNjb3BlJywgJ1VwbG9hZCcsICd1cGxvYWRGaWxlTW9kYWxTZXJ2aWNlJ107XHJcblxyXG4gICAgZnVuY3Rpb24gRmlsZXNMaXN0KCRzY29wZSwgRmlsZU1hbmFnZXIsIE5vdGlmaWNhdG9yLCBtb2RhbFNlcnZpY2UsICRyb290U2NvcGUsIFVwbG9hZCwgdXBsb2FkRmlsZU1vZGFsU2VydmljZSkge1xyXG4gICAgICAgIHZhciB1c2VyX25hbWUgPSAnbWhhcmJpc2hlcnInO1xyXG4gICAgICAgICRyb290U2NvcGUudXNlciA9IHVzZXJfbmFtZTtcclxuXHJcbiAgICAgICAgJHNjb3BlLm5tID0gdXNlcl9uYW1lO1xyXG4gICAgXHJcbiAgICAgICAgLy9nZXQgZmlsZXNcclxuICAgICAgICBGaWxlTWFuYWdlci5HZXRBbGxGaWxlcyh1c2VyX25hbWUpXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5maWxlcyA9IHJlcztcclxuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgTm90aWZpY2F0b3Iuc3VjY2VzcygnRmlsZXMgaGF2ZSBiZWVuIHN1Y2Nlc3NmdWxseSBsb2FkZWQhJyk7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KHJlcy5tZXNzYWdlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9nZXQgZm9sZGVyc1xyXG4gICAgICAgIC8vbW9rcyBkYXRhXHJcbiAgICAgICAgJHNjb3BlLmZvbGRlcnMgPSBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICd0aXRsZSc6ICdmb2xkZXIxJyxcclxuICAgICAgICAgICAgICAgICd1c2VyJzogJ21oYXJiaXNoZXJyJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAndGl0bGUnOiAnZm9sZGVyMicsXHJcbiAgICAgICAgICAgICAgICAndXNlcic6ICdtaGFyYmlzaGVycidcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgJ3RpdGxlJzogJ2ZvbGRlcjMnLFxyXG4gICAgICAgICAgICAgICAgJ3VzZXInOiAnbWhhcmJpc2hlcnInXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdO1xyXG4gICAgICAgICRyb290U2NvcGUuZm9sZGVyc0xpc3QgPSAkc2NvcGUuZm9sZGVycztcclxuICAgIFxyXG4gICAgICAgIC8vZGVsZXRlIGZpbGVcclxuICAgICAgICAkc2NvcGUuZGVsZXRlRmlsZSA9IGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICAgICAgdmFyIGZpbGVfaWQgPSBvYmouX2lkO1xyXG4gICAgICAgICAgICBGaWxlTWFuYWdlci5EZWxldGVGaWxlKCRzY29wZS5ubSwgZmlsZV9pZClcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBOb3RpZmljYXRvci5zdWNjZXNzKCdpdCB3b3JrcyEgRmlsZSB3YXMgc3VjY2Vzc2Z1bGx5IGRlbGV0ZWQhJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBmaW5kSW5kZXgoJHNjb3BlLmZpbGVzLCAnX2lkJywgZmlsZV9pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZpbGVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9kZWxldGUgJHNjb3BlLmZpbGVzW2luZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmZpbGVzKTtcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBOb3RpZmljYXRvci5lcnJvcihyZXMpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICAvL3JlbmFtZSBmaWxlXHJcbiAgICAgICAgJHNjb3BlLnJlbmFtZUZpbGUgPSBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICAgICAgICAgIHZhciBmaWxlX2lkID0gb2JqLl9pZDtcclxuICAgICAgICAgICAgdmFyIG1vZGFsT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIGNsb3NlQnV0dG9uVGV4dDogJ0NhbmNlbCcsXHJcbiAgICAgICAgICAgICAgICBhY3Rpb25CdXR0b25UZXh0OiAnUmVuYW1lJyxcclxuICAgICAgICAgICAgICAgIGhlYWRlclRleHQ6IG9iai50aXRsZSxcclxuICAgICAgICAgICAgICAgIGJvZHlUZXh0OiAnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHJlbmFtZSB0aGlzIGZpbGU/J1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBtb2RhbFNlcnZpY2Uuc2hvd01vZGFsKHt9LCBtb2RhbE9wdGlvbnMsIG9iaikudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBmaW5kSW5kZXgoJHNjb3BlLmZpbGVzLCAnX2lkJywgZmlsZV9pZCk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmlsZXNbaW5kZXhdLnRpdGxlID0gJHJvb3RTY29wZS5uZXdGTmFtZTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5maWxlc1tpbmRleF0udGl0bGUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvL3VwbG9hZCBmaWxlXHJcbiAgICAgICAgJHNjb3BlLnVwbG9hZEZpbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vdmFyIGZpbGVfaWQgPSBvYmouX2lkO1xyXG4gICAgICAgICAgICB2YXIgbW9kYWxPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgY2xvc2VCdXR0b25UZXh0OiAnQ2FuY2VsJyxcclxuICAgICAgICAgICAgICAgIGFjdGlvbkJ1dHRvblRleHQ6ICdVcGxvYWQnLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyVGV4dDogJ1NvbWUgaGVhZGVyIHRleHQnLFxyXG4gICAgICAgICAgICAgICAgYm9keVRleHQ6ICdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gdXBsb2FkIHRoaXMgZmlsZT8nXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHVwbG9hZEZpbGVNb2RhbFNlcnZpY2Uuc2hvd01vZGFsKHt9LCBtb2RhbE9wdGlvbnMpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgLy92YXIgaW5kZXggPSBmaW5kSW5kZXgoJHNjb3BlLmZpbGVzLCAnX2lkJywgZmlsZV9pZCk7XHJcbiAgICAgICAgICAgICAgICAvLyRzY29wZS5maWxlc1tpbmRleF0udGl0bGUgPSAkcm9vdFNjb3BlLm5ld0ZOYW1lO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2l0IHdvcmtzJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gZmluZEluZGV4KGFycmF5LCBrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChhcnJheVtpXVtrZXldID09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufSkoKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2ZpbGVzbGlzdC9saXN0LmNvbnRyb2xsZXIuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdteUFwcCcpXHJcbiAgICAgICAgLnNlcnZpY2UoJ21vZGFsU2VydmljZScsIG1vZGFsU2VydmljZSk7XHJcblxyXG4gICAgbW9kYWxTZXJ2aWNlLiRpbmplY3QgPSBbJyR1aWJNb2RhbCcsICdGaWxlTWFuYWdlcicsICdOb3RpZmljYXRvciddO1xyXG4gICAgZnVuY3Rpb24gbW9kYWxTZXJ2aWNlKCR1aWJNb2RhbCwgRmlsZU1hbmFnZXIsIE5vdGlmaWNhdG9yKSB7XHJcblxyXG4gICAgICAgIHZhciBtb2RhbERlZmF1bHRzID0ge1xyXG4gICAgICAgICAgICBiYWNrZHJvcDogdHJ1ZSxcclxuICAgICAgICAgICAga2V5Ym9hcmQ6IHRydWUsXHJcbiAgICAgICAgICAgIG1vZGFsRmFkZTogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi9hcHAvZmlsZXNsaXN0L21vZGFsL21vZGFsLmh0bWwnXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIG1vZGFsT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgY2xvc2VCdXR0b25UZXh0OiAnQ2xvc2UnLFxyXG4gICAgICAgICAgICBhY3Rpb25CdXR0b25UZXh0OiAnT0snLFxyXG4gICAgICAgICAgICBoZWFkZXJUZXh0OiAnUHJvY2VlZD8nLFxyXG4gICAgICAgICAgICBib2R5VGV4dDogJ1BlcmZvcm0gdGhpcyBhY3Rpb24/J1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuc2hvd01vZGFsID0gZnVuY3Rpb24gKGN1c3RvbU1vZGFsRGVmYXVsdHMsIGN1c3RvbU1vZGFsT3B0aW9ucywgb2JqKSB7XHJcbiAgICAgICAgICAgIGlmICghY3VzdG9tTW9kYWxEZWZhdWx0cykgY3VzdG9tTW9kYWxEZWZhdWx0cyA9IHt9O1xyXG4gICAgICAgICAgICBjdXN0b21Nb2RhbERlZmF1bHRzLmJhY2tkcm9wID0gJ3N0YXRpYyc7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNob3coY3VzdG9tTW9kYWxEZWZhdWx0cywgY3VzdG9tTW9kYWxPcHRpb25zLCBvYmopO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuc2hvdyA9IGZ1bmN0aW9uIChjdXN0b21Nb2RhbERlZmF1bHRzLCBjdXN0b21Nb2RhbE9wdGlvbnMsIG9iaikge1xyXG4gICAgICAgICAgICAvL0NyZWF0ZSB0ZW1wIG9iamVjdHMgdG8gd29yayB3aXRoIHNpbmNlIHdlJ3JlIGluIGEgc2luZ2xldG9uIHNlcnZpY2VcclxuICAgICAgICAgICAgdmFyIHRlbXBNb2RhbERlZmF1bHRzID0ge307XHJcbiAgICAgICAgICAgIHZhciB0ZW1wTW9kYWxPcHRpb25zID0ge307XHJcblxyXG4gICAgICAgICAgICAvL01hcCBhbmd1bGFyLXVpIG1vZGFsIGN1c3RvbSBkZWZhdWx0cyB0byBtb2RhbCBkZWZhdWx0cyBkZWZpbmVkIGluIHNlcnZpY2VcclxuICAgICAgICAgICAgYW5ndWxhci5leHRlbmQodGVtcE1vZGFsRGVmYXVsdHMsIG1vZGFsRGVmYXVsdHMsIGN1c3RvbU1vZGFsRGVmYXVsdHMpO1xyXG5cclxuICAgICAgICAgICAgLy9NYXAgbW9kYWwuaHRtbCAkc2NvcGUgY3VzdG9tIHByb3BlcnRpZXMgdG8gZGVmYXVsdHMgZGVmaW5lZCBpbiBzZXJ2aWNlXHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHRlbXBNb2RhbE9wdGlvbnMsIG1vZGFsT3B0aW9ucywgY3VzdG9tTW9kYWxPcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGVtcE1vZGFsRGVmYXVsdHMuY29udHJvbGxlcikge1xyXG4gICAgICAgICAgICAgICAgdGVtcE1vZGFsRGVmYXVsdHMuY29udHJvbGxlciA9IGZ1bmN0aW9uICgkc2NvcGUsICR1aWJNb2RhbEluc3RhbmNlLCBOb3RpZmljYXRvciwgJHJvb3RTY29wZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubW9kYWxPcHRpb25zID0gdGVtcE1vZGFsT3B0aW9ucztcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubW9kYWxPcHRpb25zLm9rID0gZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLm5ld0ZOYW1lID0gJHNjb3BlLm5ld2ZpbGVuYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBGaWxlTWFuYWdlci5VcGRhdGVGaWxlKG9iai51c2VyLCBvYmouX2lkLCBKU09OLnN0cmluZ2lmeSh7ZmlsZW5hbWU6ICRzY29wZS5uZXdmaWxlbmFtZX0pKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vdGlmaWNhdG9yLnN1Y2Nlc3MocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBOb3RpZmljYXRvci5lcnJvcihyZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubW9kYWxPcHRpb25zLmNsb3NlID0gZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkdWliTW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJHVpYk1vZGFsLm9wZW4odGVtcE1vZGFsRGVmYXVsdHMpLnJlc3VsdDtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxufSkoKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2ZpbGVzbGlzdC9tb2RhbC9tb2RhbC5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ215QXBwJylcclxuICAgICAgICAuc2VydmljZSgndXBsb2FkRmlsZU1vZGFsU2VydmljZScsIHVwbG9hZEZpbGVNb2RhbFNlcnZpY2UpO1xyXG5cclxuICAgIHVwbG9hZEZpbGVNb2RhbFNlcnZpY2UuJGluamVjdCA9IFsnJHVpYk1vZGFsJywgJ0ZpbGVNYW5hZ2VyJywgJ05vdGlmaWNhdG9yJywgJ1VwbG9hZCddO1xyXG4gICAgZnVuY3Rpb24gdXBsb2FkRmlsZU1vZGFsU2VydmljZSgkdWliTW9kYWwsIEZpbGVNYW5hZ2VyLCBOb3RpZmljYXRvciwgVXBsb2FkKSB7XHJcblxyXG4gICAgICAgIHZhciBtb2RhbERlZmF1bHRzID0ge1xyXG4gICAgICAgICAgICBiYWNrZHJvcDogdHJ1ZSxcclxuICAgICAgICAgICAga2V5Ym9hcmQ6IHRydWUsXHJcbiAgICAgICAgICAgIG1vZGFsRmFkZTogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuLi9hcHAvZmlsZXNsaXN0L21vZGFsL3VwbG9hZE1vZGFsLmh0bWwnXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIG1vZGFsT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgY2xvc2VCdXR0b25UZXh0OiAnQ2xvc2UnLFxyXG4gICAgICAgICAgICBhY3Rpb25CdXR0b25UZXh0OiAnT0snLFxyXG4gICAgICAgICAgICBoZWFkZXJUZXh0OiAnUHJvY2VlZD8nLFxyXG4gICAgICAgICAgICBib2R5VGV4dDogJ1BlcmZvcm0gdGhpcyBhY3Rpb24/J1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuc2hvd01vZGFsID0gZnVuY3Rpb24gKGN1c3RvbU1vZGFsRGVmYXVsdHMsIGN1c3RvbU1vZGFsT3B0aW9ucywgb2JqKSB7XHJcbiAgICAgICAgICAgIGlmICghY3VzdG9tTW9kYWxEZWZhdWx0cykgY3VzdG9tTW9kYWxEZWZhdWx0cyA9IHt9O1xyXG4gICAgICAgICAgICBjdXN0b21Nb2RhbERlZmF1bHRzLmJhY2tkcm9wID0gJ3N0YXRpYyc7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNob3coY3VzdG9tTW9kYWxEZWZhdWx0cywgY3VzdG9tTW9kYWxPcHRpb25zLCBvYmopO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuc2hvdyA9IGZ1bmN0aW9uIChjdXN0b21Nb2RhbERlZmF1bHRzLCBjdXN0b21Nb2RhbE9wdGlvbnMsIG9iaikge1xyXG4gICAgICAgICAgICAvL0NyZWF0ZSB0ZW1wIG9iamVjdHMgdG8gd29yayB3aXRoIHNpbmNlIHdlJ3JlIGluIGEgc2luZ2xldG9uIHNlcnZpY2VcclxuICAgICAgICAgICAgdmFyIHRlbXBNb2RhbERlZmF1bHRzID0ge307XHJcbiAgICAgICAgICAgIHZhciB0ZW1wTW9kYWxPcHRpb25zID0ge307XHJcblxyXG4gICAgICAgICAgICAvL01hcCBhbmd1bGFyLXVpIG1vZGFsIGN1c3RvbSBkZWZhdWx0cyB0byBtb2RhbCBkZWZhdWx0cyBkZWZpbmVkIGluIHNlcnZpY2VcclxuICAgICAgICAgICAgYW5ndWxhci5leHRlbmQodGVtcE1vZGFsRGVmYXVsdHMsIG1vZGFsRGVmYXVsdHMsIGN1c3RvbU1vZGFsRGVmYXVsdHMpO1xyXG5cclxuICAgICAgICAgICAgLy9NYXAgbW9kYWwuaHRtbCAkc2NvcGUgY3VzdG9tIHByb3BlcnRpZXMgdG8gZGVmYXVsdHMgZGVmaW5lZCBpbiBzZXJ2aWNlXHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHRlbXBNb2RhbE9wdGlvbnMsIG1vZGFsT3B0aW9ucywgY3VzdG9tTW9kYWxPcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGVtcE1vZGFsRGVmYXVsdHMuY29udHJvbGxlcikge1xyXG4gICAgICAgICAgICAgICAgdGVtcE1vZGFsRGVmYXVsdHMuY29udHJvbGxlciA9IGZ1bmN0aW9uICgkc2NvcGUsICR1aWJNb2RhbEluc3RhbmNlLCBOb3RpZmljYXRvciwgJHJvb3RTY29wZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5mb2xkZXJzTCA9ICRyb290U2NvcGUuZm9sZGVyc0xpc3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVwbG9hZEZpbGUgPSBmdW5jdGlvbiAoJGZpbGUsICRlcnJGaWxlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBsb2FkZmlsZW5hbWUgPSAkZmlsZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRmaWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKmZpbGUudXBsb2FkID0gVXBsb2FkLnVwbG9hZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDoxMzM3L2FwaS91c2Vycy8nICsgdXNlcl9uYW1lICsgJy9maWxlcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge2ZpbGU6IGZpbGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGUudXBsb2FkLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGUucmVzdWx0ID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID4gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3JNc2cgPSByZXNwb25zZS5zdGF0dXMgKyAnOiAnICsgcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZS5wcm9ncmVzcyA9IE1hdGgubWluKDEwMCwgcGFyc2VJbnQoMTAwLjAgKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2dC5sb2FkZWQgLyBldnQudG90YWwpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTsqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhmaWxlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2ZpbGUgd2FzIHN1Y2Nlc3NmdWxseSBzZWxlY3RlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm1vZGFsT3B0aW9ucyA9IHRlbXBNb2RhbE9wdGlvbnM7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm1vZGFsT3B0aW9ucy5vayA9IGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZuYW1lID0gJ01haW4nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmQgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmQuYXBwZW5kKCdmaWxlJywgJHNjb3BlLnVwbG9hZGZpbGVuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLnVwbG9hZGZpbGVuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgRmlsZU1hbmFnZXIuQWRkRmlsZSgkcm9vdFNjb3BlLnVzZXIsIGZkLCBmbmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGZkLmdldCgnZmlsZScpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9sb2dpYyBoZXJlXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiRyb290U2NvcGUubmV3Rk5hbWUgPSAkc2NvcGUubmV3ZmlsZW5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEZpbGVNYW5hZ2VyLlVwZGF0ZUZpbGUob2JqLnVzZXIsIG9iai5faWQsIEpTT04uc3RyaW5naWZ5KHtmaWxlbmFtZTogJHNjb3BlLm5ld2ZpbGVuYW1lfSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTm90aWZpY2F0b3Iuc3VjY2VzcyhyZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vdGlmaWNhdG9yLmVycm9yKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTsqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkdWliTW9kYWxJbnN0YW5jZS5jbG9zZShyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm1vZGFsT3B0aW9ucy5jbG9zZSA9IGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuICR1aWJNb2RhbC5vcGVuKHRlbXBNb2RhbERlZmF1bHRzKS5yZXN1bHQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcbn0pKCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9maWxlc2xpc3QvbW9kYWwvdXBsb2FkZmlsZS5zZXJ2aWNlLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnbXlBcHAnKVxuICAgICAgICAuY29uZmlnKG5vdGlmaWNhdG9yQ29uZmlnKVxuICAgICAgICAuZmFjdG9yeSgnTm90aWZpY2F0b3InLCBOb3RpZmljYXRvcilcbiAgICAgICAgLnJ1bihub3RpZmljYXRpb25zUnVuKTtcblxuICAgIE5vdGlmaWNhdG9yLiRpbmplY3QgPSBbJ3RvYXN0ciddO1xuICAgIGZ1bmN0aW9uIE5vdGlmaWNhdG9yKHRvYXN0cikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24obXNnLCB0aXRsZSkge1xuICAgICAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKG1zZywgdGl0bGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdhcm5pbmc6IGZ1bmN0aW9uKG1zZywgdGl0bGUpIHtcbiAgICAgICAgICAgICAgICB0b2FzdHIud2FybmluZyhtc2csIHRpdGxlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24obXNnLCB0aXRsZSkge1xuICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvcihtc2csIHRpdGxlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbmZvOiBmdW5jdGlvbihtc2csIHRpdGxlKSB7XG4gICAgICAgICAgICAgICAgdG9hc3RyLmluZm8obXNnLCB0aXRsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBub3RpZmljYXRpb25zUnVuLiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAnTm90aWZpY2F0b3InLCAnJHRpbWVvdXQnXTtcbiAgICBmdW5jdGlvbiBub3RpZmljYXRpb25zUnVuKCRyb290U2NvcGUsIG5vdGlmaWNhdG9yLCAkdGltZW91dCkge1xuICAgICAgICAvKiRyb290U2NvcGUuJG9uKCckdXNlckxvZ2dlZEluJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBub3RpZmljYXRvci5zdWNjZXNzKCdIZXkgdGhlcmUhJyk7XG5cbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgbm90aWZpY2F0b3IuaW5mbygnV2VsY29tZSB0byB0aGlzIGZyZWUgYW5ndWxhciBkYXNoYm9hcmQgc2VlZCBwcm9qZWN0LCcgK1xuICAgICAgICAgICAgICAgICcgdGhhdCB5b3UgbWF5IHVzZSB0byBib290c3RyYXAgeW91ciBuZXh0IHdlYiBhcHAhJywge1xuICAgICAgICAgICAgICAgICAgICB0aW1lT3V0OiAxMDAwMFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwzMDAwKTtcblxuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBub3RpZmljYXRvci5pbmZvKCdCdHcsIGZlZWwgZnJlZSB0byBjb250cmlidXRlIHRvIHRoaXMgcHJvamVjdCBhbmQgaGVscCB1cyBraWxsIHRoZSBwYWlkIHRlbXBsYXRlcyBtYXJrZXQgOyknLCB7XG4gICAgICAgICAgICAgICAgICAgIHRpbWVPdXQ6IDEwMDAwXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LDE1MDAwKVxuICAgICAgICB9KTtcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJyR1c2VyTG9nZ2VkT3V0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBub3RpZmljYXRvci5zdWNjZXNzKCdMb2dnZWQgb3V0IHN1Y2Nlc3NmdWxseScpO1xuICAgICAgICB9KTsqL1xuICAgICAgICBjb25zb2xlLmxvZygnbm90aWZpY2F0aW9uc1J1biB3b3JrcyEnKTtcbiAgICB9XG5cbiAgICBub3RpZmljYXRvckNvbmZpZy4kaW5qZWN0ID0gWyd0b2FzdHJDb25maWcnXTtcbiAgICBmdW5jdGlvbiBub3RpZmljYXRvckNvbmZpZyh0b2FzdHJDb25maWcpIHtcbiAgICAgICAgYW5ndWxhci5leHRlbmQodG9hc3RyQ29uZmlnLCB7XG4gICAgICAgICAgICB0aW1lT3V0OiAzMDAwXG4gICAgICAgIH0pO1xuICAgIH1cblxufSkoKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm90aWZpY2F0b3Ivbm90aWZpY2F0aW9ucy5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ215QXBwJylcclxuICAgICAgICAuZGlyZWN0aXZlKCd3aWRnZXQnLCB3aWRnZXQpO1xyXG5cclxuICAgIGZ1bmN0aW9uIHdpZGdldCgpIHtcclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCAkZWxlbWVudCkge1xyXG4gICAgICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygnd2lkZ2V0Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGxpbms6IGxpbmssXHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbn0pKCk7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd2lkZ2V0L3dpZGdldC5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJhbmd1bGFyLm1vZHVsZSgnbXlBcHAnLCBbJ3RvYXN0cicsICduZ0FuaW1hdGUnLCAndWkuYm9vdHN0cmFwJywgJ25nRmlsZVVwbG9hZCddKTtcclxuXHJcbnJlcXVpcmUoJy4vZmlsZXNsaXN0L2xpc3QuY29udHJvbGxlci5qcycpO1xyXG5yZXF1aXJlKCcuL2ZpbGVzbGlzdC9maWxlbWFuYWdlci5zZXJ2aWNlLmpzJyk7XHJcbnJlcXVpcmUoJy4vd2lkZ2V0L3dpZGdldCcpO1xyXG5yZXF1aXJlKCcuL25vdGlmaWNhdG9yL25vdGlmaWNhdGlvbnMnKTtcclxucmVxdWlyZSgnLi9maWxlc2xpc3QvbW9kYWwvbW9kYWwnKTtcclxucmVxdWlyZSgnLi9maWxlc2xpc3QvbW9kYWwvdXBsb2FkZmlsZS5zZXJ2aWNlJyk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9hcHAuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0E7Ozs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QSIsInNvdXJjZVJvb3QiOiIifQ==