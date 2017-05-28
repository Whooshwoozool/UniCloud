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
                .then(handleSuccess, handleError('Error while add file'));
        }

        function handleSuccess(res) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmJ1bmRsZS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA3OWYxNjcwNTlhNDNiN2EyNzA2MCIsIndlYnBhY2s6Ly8vLi9maWxlc2xpc3QvZmlsZW1hbmFnZXIuc2VydmljZS5qcyIsIndlYnBhY2s6Ly8vLi9maWxlc2xpc3QvbGlzdC5jb250cm9sbGVyLmpzIiwid2VicGFjazovLy8uL2ZpbGVzbGlzdC9tb2RhbC9tb2RhbC5qcyIsIndlYnBhY2s6Ly8vLi9maWxlc2xpc3QvbW9kYWwvdXBsb2FkZmlsZS5zZXJ2aWNlLmpzIiwid2VicGFjazovLy8uL25vdGlmaWNhdG9yL25vdGlmaWNhdGlvbnMuanMiLCJ3ZWJwYWNrOi8vLy4vd2lkZ2V0L3dpZGdldC5qcyIsIndlYnBhY2s6Ly8vLi9hcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA2KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA3OWYxNjcwNTlhNDNiN2EyNzA2MCIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCdcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnbXlBcHAnKVxyXG4gICAgICAgIC5mYWN0b3J5KCdGaWxlTWFuYWdlcicsIEZpbGVNYW5hZ2VyKTtcclxuXHJcbiAgICBGaWxlTWFuYWdlci4kaW5qZWN0ID0gWyckaHR0cCddO1xyXG5cclxuICAgIGZ1bmN0aW9uIEZpbGVNYW5hZ2VyKCRodHRwKSB7XHJcbiAgICAgICAgdmFyIHNlcnZpY2UgPSB7fTtcclxuXHJcbiAgICAgICAgc2VydmljZS5HZXRBbGxGaWxlcyA9IEdldEFsbEZpbGVzO1xyXG4gICAgICAgIHNlcnZpY2UuVXBkYXRlRmlsZSA9IFVwZGF0ZUZpbGU7XHJcbiAgICAgICAgc2VydmljZS5EZWxldGVGaWxlID0gRGVsZXRlRmlsZTtcclxuICAgICAgICBzZXJ2aWNlLkFkZEZpbGUgPSBBZGRGaWxlO1xyXG5cclxuICAgICAgICByZXR1cm4gc2VydmljZTtcclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBHZXRBbGxGaWxlcyh1c2VyX25hbWUpIHtcclxuICAgICAgICAgICAgdmFyIHVybCA9ICdodHRwOi8vbG9jYWxob3N0OjEzMzcvYXBpL3VzZXJzLycgKyB1c2VyX25hbWUgKyAnL2ZpbGVzJztcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCh1cmwpXHJcbiAgICAgICAgICAgICAgICAudGhlbihoYW5kbGVTdWNjZXNzLCBoYW5kbGVFcnJvcignRXJyb3IgZ2V0dGluZyBhbGwgZmlsZXMnKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIFVwZGF0ZUZpbGUodXNlcl9uYW1lLCBmaWxlX2lkLCBkYXRhKSB7XHJcbiAgICAgICAgICAgIHZhciB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdDoxMzM3L2FwaS91c2Vycy8nICsgdXNlcl9uYW1lICsgJy9maWxlcy8nICsgZmlsZV9pZDtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnB1dCh1cmwsIGRhdGEpXHJcbiAgICAgICAgICAgICAgICAudGhlbihoYW5kbGVTdWNjZXNzLCBoYW5kbGVFcnJvcignRXJyb3IgdXBkYXRpbmcgZmlsZScpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIERlbGV0ZUZpbGUodXNlcl9uYW1lLCBmaWxlX2lkKSB7XHJcbiAgICAgICAgICAgIHZhciB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdDoxMzM3L2FwaS91c2Vycy8nICsgdXNlcl9uYW1lICsgJy9maWxlcy8nICsgZmlsZV9pZDtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZSh1cmwpXHJcbiAgICAgICAgICAgICAgICAudGhlbihoYW5kbGVTdWNjZXNzLCBoYW5kbGVFcnJvcignRXJyb3IgZGVsZXRpbmcgZmlsZScpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIEFkZEZpbGUodXNlcl9uYW1lLCBmaWxlLCBmb2xkZXJzbmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgdXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6MTMzNy9hcGkvdXNlcnMvJyArIHVzZXJfbmFtZSArICcvZmlsZXMnO1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCh1cmwsIGZpbGUsIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiWC1UZXN0aW5nXCIgOiBmb2xkZXJzbmFtZVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybVJlcXVlc3Q6IGFuZ3VsYXIuaWRlbnRpdHlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKGhhbmRsZVN1Y2Nlc3MsIGhhbmRsZUVycm9yKCdFcnJvciB3aGlsZSBhZGQgZmlsZScpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXMuZGF0YTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZUVycm9yKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge21lc3NhZ2U6IGVycm9yfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2ZpbGVzbGlzdC9maWxlbWFuYWdlci5zZXJ2aWNlLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCdcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnbXlBcHAnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdGaWxlc0xpc3QnLCBGaWxlc0xpc3QpO1xyXG5cclxuICAgIEZpbGVzTGlzdC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnRmlsZU1hbmFnZXInLCAnTm90aWZpY2F0b3InLCAnbW9kYWxTZXJ2aWNlJywgJyRyb290U2NvcGUnLCAnVXBsb2FkJywgJ3VwbG9hZEZpbGVNb2RhbFNlcnZpY2UnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBGaWxlc0xpc3QoJHNjb3BlLCBGaWxlTWFuYWdlciwgTm90aWZpY2F0b3IsIG1vZGFsU2VydmljZSwgJHJvb3RTY29wZSwgVXBsb2FkLCB1cGxvYWRGaWxlTW9kYWxTZXJ2aWNlKSB7XHJcbiAgICAgICAgdmFyIHVzZXJfbmFtZSA9ICdtaGFyYmlzaGVycic7XHJcbiAgICAgICAgJHJvb3RTY29wZS51c2VyID0gdXNlcl9uYW1lO1xyXG5cclxuICAgICAgICAkc2NvcGUubm0gPSB1c2VyX25hbWU7XHJcbiAgICBcclxuICAgICAgICAvL2dldCBmaWxlc1xyXG4gICAgICAgIEZpbGVNYW5hZ2VyLkdldEFsbEZpbGVzKHVzZXJfbmFtZSlcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmZpbGVzID0gcmVzO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBOb3RpZmljYXRvci5zdWNjZXNzKCdGaWxlcyBoYXZlIGJlZW4gc3VjY2Vzc2Z1bGx5IGxvYWRlZCEnKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQocmVzLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICAvL2dldCBmb2xkZXJzXHJcbiAgICAgICAgLy9tb2tzIGRhdGFcclxuICAgICAgICAkc2NvcGUuZm9sZGVycyA9IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgJ3RpdGxlJzogJ2ZvbGRlcjEnLFxyXG4gICAgICAgICAgICAgICAgJ3VzZXInOiAnbWhhcmJpc2hlcnInXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICd0aXRsZSc6ICdmb2xkZXIyJyxcclxuICAgICAgICAgICAgICAgICd1c2VyJzogJ21oYXJiaXNoZXJyJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAndGl0bGUnOiAnZm9sZGVyMycsXHJcbiAgICAgICAgICAgICAgICAndXNlcic6ICdtaGFyYmlzaGVycidcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgJHJvb3RTY29wZS5mb2xkZXJzTGlzdCA9ICRzY29wZS5mb2xkZXJzO1xyXG4gICAgXHJcbiAgICAgICAgLy9kZWxldGUgZmlsZVxyXG4gICAgICAgICRzY29wZS5kZWxldGVGaWxlID0gZnVuY3Rpb24gKG9iaikge1xyXG4gICAgICAgICAgICB2YXIgZmlsZV9pZCA9IG9iai5faWQ7XHJcbiAgICAgICAgICAgIEZpbGVNYW5hZ2VyLkRlbGV0ZUZpbGUoJHNjb3BlLm5tLCBmaWxlX2lkKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIE5vdGlmaWNhdG9yLnN1Y2Nlc3MoJ2l0IHdvcmtzISBGaWxlIHdhcyBzdWNjZXNzZnVsbHkgZGVsZXRlZCEnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IGZpbmRJbmRleCgkc2NvcGUuZmlsZXMsICdfaWQnLCBmaWxlX2lkKTtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZmlsZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAvL2RlbGV0ZSAkc2NvcGUuZmlsZXNbaW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGluZGV4KTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuZmlsZXMpO1xyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIE5vdGlmaWNhdG9yLmVycm9yKHJlcyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vcmVuYW1lIGZpbGVcclxuICAgICAgICAkc2NvcGUucmVuYW1lRmlsZSA9IGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICAgICAgdmFyIGZpbGVfaWQgPSBvYmouX2lkO1xyXG4gICAgICAgICAgICB2YXIgbW9kYWxPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgY2xvc2VCdXR0b25UZXh0OiAnQ2FuY2VsJyxcclxuICAgICAgICAgICAgICAgIGFjdGlvbkJ1dHRvblRleHQ6ICdSZW5hbWUnLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyVGV4dDogb2JqLnRpdGxlLFxyXG4gICAgICAgICAgICAgICAgYm9keVRleHQ6ICdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcmVuYW1lIHRoaXMgZmlsZT8nXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIG1vZGFsU2VydmljZS5zaG93TW9kYWwoe30sIG1vZGFsT3B0aW9ucywgb2JqKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IGZpbmRJbmRleCgkc2NvcGUuZmlsZXMsICdfaWQnLCBmaWxlX2lkKTtcclxuICAgICAgICAgICAgICAgICRzY29wZS5maWxlc1tpbmRleF0udGl0bGUgPSAkcm9vdFNjb3BlLm5ld0ZOYW1lO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmZpbGVzW2luZGV4XS50aXRsZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vdXBsb2FkIGZpbGVcclxuICAgICAgICAkc2NvcGUudXBsb2FkRmlsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy92YXIgZmlsZV9pZCA9IG9iai5faWQ7XHJcbiAgICAgICAgICAgIHZhciBtb2RhbE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICBjbG9zZUJ1dHRvblRleHQ6ICdDYW5jZWwnLFxyXG4gICAgICAgICAgICAgICAgYWN0aW9uQnV0dG9uVGV4dDogJ1VwbG9hZCcsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJUZXh0OiAnU29tZSBoZWFkZXIgdGV4dCcsXHJcbiAgICAgICAgICAgICAgICBib2R5VGV4dDogJ0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byB1cGxvYWQgdGhpcyBmaWxlPydcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdXBsb2FkRmlsZU1vZGFsU2VydmljZS5zaG93TW9kYWwoe30sIG1vZGFsT3B0aW9ucykudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAvL3ZhciBpbmRleCA9IGZpbmRJbmRleCgkc2NvcGUuZmlsZXMsICdfaWQnLCBmaWxlX2lkKTtcclxuICAgICAgICAgICAgICAgIC8vJHNjb3BlLmZpbGVzW2luZGV4XS50aXRsZSA9ICRyb290U2NvcGUubmV3Rk5hbWU7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaXQgd29ya3MnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBmaW5kSW5kZXgoYXJyYXksIGtleSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFycmF5W2ldW2tleV0gPT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59KSgpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vZmlsZXNsaXN0L2xpc3QuY29udHJvbGxlci5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ215QXBwJylcclxuICAgICAgICAuc2VydmljZSgnbW9kYWxTZXJ2aWNlJywgbW9kYWxTZXJ2aWNlKTtcclxuXHJcbiAgICBtb2RhbFNlcnZpY2UuJGluamVjdCA9IFsnJHVpYk1vZGFsJywgJ0ZpbGVNYW5hZ2VyJywgJ05vdGlmaWNhdG9yJ107XHJcbiAgICBmdW5jdGlvbiBtb2RhbFNlcnZpY2UoJHVpYk1vZGFsLCBGaWxlTWFuYWdlciwgTm90aWZpY2F0b3IpIHtcclxuXHJcbiAgICAgICAgdmFyIG1vZGFsRGVmYXVsdHMgPSB7XHJcbiAgICAgICAgICAgIGJhY2tkcm9wOiB0cnVlLFxyXG4gICAgICAgICAgICBrZXlib2FyZDogdHJ1ZSxcclxuICAgICAgICAgICAgbW9kYWxGYWRlOiB0cnVlLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL2FwcC9maWxlc2xpc3QvbW9kYWwvbW9kYWwuaHRtbCdcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgbW9kYWxPcHRpb25zID0ge1xyXG4gICAgICAgICAgICBjbG9zZUJ1dHRvblRleHQ6ICdDbG9zZScsXHJcbiAgICAgICAgICAgIGFjdGlvbkJ1dHRvblRleHQ6ICdPSycsXHJcbiAgICAgICAgICAgIGhlYWRlclRleHQ6ICdQcm9jZWVkPycsXHJcbiAgICAgICAgICAgIGJvZHlUZXh0OiAnUGVyZm9ybSB0aGlzIGFjdGlvbj8nXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5zaG93TW9kYWwgPSBmdW5jdGlvbiAoY3VzdG9tTW9kYWxEZWZhdWx0cywgY3VzdG9tTW9kYWxPcHRpb25zLCBvYmopIHtcclxuICAgICAgICAgICAgaWYgKCFjdXN0b21Nb2RhbERlZmF1bHRzKSBjdXN0b21Nb2RhbERlZmF1bHRzID0ge307XHJcbiAgICAgICAgICAgIGN1c3RvbU1vZGFsRGVmYXVsdHMuYmFja2Ryb3AgPSAnc3RhdGljJztcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2hvdyhjdXN0b21Nb2RhbERlZmF1bHRzLCBjdXN0b21Nb2RhbE9wdGlvbnMsIG9iaik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5zaG93ID0gZnVuY3Rpb24gKGN1c3RvbU1vZGFsRGVmYXVsdHMsIGN1c3RvbU1vZGFsT3B0aW9ucywgb2JqKSB7XHJcbiAgICAgICAgICAgIC8vQ3JlYXRlIHRlbXAgb2JqZWN0cyB0byB3b3JrIHdpdGggc2luY2Ugd2UncmUgaW4gYSBzaW5nbGV0b24gc2VydmljZVxyXG4gICAgICAgICAgICB2YXIgdGVtcE1vZGFsRGVmYXVsdHMgPSB7fTtcclxuICAgICAgICAgICAgdmFyIHRlbXBNb2RhbE9wdGlvbnMgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIC8vTWFwIGFuZ3VsYXItdWkgbW9kYWwgY3VzdG9tIGRlZmF1bHRzIHRvIG1vZGFsIGRlZmF1bHRzIGRlZmluZWQgaW4gc2VydmljZVxyXG4gICAgICAgICAgICBhbmd1bGFyLmV4dGVuZCh0ZW1wTW9kYWxEZWZhdWx0cywgbW9kYWxEZWZhdWx0cywgY3VzdG9tTW9kYWxEZWZhdWx0cyk7XHJcblxyXG4gICAgICAgICAgICAvL01hcCBtb2RhbC5odG1sICRzY29wZSBjdXN0b20gcHJvcGVydGllcyB0byBkZWZhdWx0cyBkZWZpbmVkIGluIHNlcnZpY2VcclxuICAgICAgICAgICAgYW5ndWxhci5leHRlbmQodGVtcE1vZGFsT3B0aW9ucywgbW9kYWxPcHRpb25zLCBjdXN0b21Nb2RhbE9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0ZW1wTW9kYWxEZWZhdWx0cy5jb250cm9sbGVyKSB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wTW9kYWxEZWZhdWx0cy5jb250cm9sbGVyID0gZnVuY3Rpb24gKCRzY29wZSwgJHVpYk1vZGFsSW5zdGFuY2UsIE5vdGlmaWNhdG9yLCAkcm9vdFNjb3BlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5tb2RhbE9wdGlvbnMgPSB0ZW1wTW9kYWxPcHRpb25zO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5tb2RhbE9wdGlvbnMub2sgPSBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUubmV3Rk5hbWUgPSAkc2NvcGUubmV3ZmlsZW5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEZpbGVNYW5hZ2VyLlVwZGF0ZUZpbGUob2JqLnVzZXIsIG9iai5faWQsIEpTT04uc3RyaW5naWZ5KHtmaWxlbmFtZTogJHNjb3BlLm5ld2ZpbGVuYW1lfSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTm90aWZpY2F0b3Iuc3VjY2VzcyhyZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vdGlmaWNhdG9yLmVycm9yKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuY2xvc2UocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5tb2RhbE9wdGlvbnMuY2xvc2UgPSBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiAkdWliTW9kYWwub3Blbih0ZW1wTW9kYWxEZWZhdWx0cykucmVzdWx0O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG59KSgpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vZmlsZXNsaXN0L21vZGFsL21vZGFsLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnbXlBcHAnKVxyXG4gICAgICAgIC5zZXJ2aWNlKCd1cGxvYWRGaWxlTW9kYWxTZXJ2aWNlJywgdXBsb2FkRmlsZU1vZGFsU2VydmljZSk7XHJcblxyXG4gICAgdXBsb2FkRmlsZU1vZGFsU2VydmljZS4kaW5qZWN0ID0gWyckdWliTW9kYWwnLCAnRmlsZU1hbmFnZXInLCAnTm90aWZpY2F0b3InLCAnVXBsb2FkJ107XHJcbiAgICBmdW5jdGlvbiB1cGxvYWRGaWxlTW9kYWxTZXJ2aWNlKCR1aWJNb2RhbCwgRmlsZU1hbmFnZXIsIE5vdGlmaWNhdG9yLCBVcGxvYWQpIHtcclxuXHJcbiAgICAgICAgdmFyIG1vZGFsRGVmYXVsdHMgPSB7XHJcbiAgICAgICAgICAgIGJhY2tkcm9wOiB0cnVlLFxyXG4gICAgICAgICAgICBrZXlib2FyZDogdHJ1ZSxcclxuICAgICAgICAgICAgbW9kYWxGYWRlOiB0cnVlLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL2FwcC9maWxlc2xpc3QvbW9kYWwvdXBsb2FkTW9kYWwuaHRtbCdcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgbW9kYWxPcHRpb25zID0ge1xyXG4gICAgICAgICAgICBjbG9zZUJ1dHRvblRleHQ6ICdDbG9zZScsXHJcbiAgICAgICAgICAgIGFjdGlvbkJ1dHRvblRleHQ6ICdPSycsXHJcbiAgICAgICAgICAgIGhlYWRlclRleHQ6ICdQcm9jZWVkPycsXHJcbiAgICAgICAgICAgIGJvZHlUZXh0OiAnUGVyZm9ybSB0aGlzIGFjdGlvbj8nXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5zaG93TW9kYWwgPSBmdW5jdGlvbiAoY3VzdG9tTW9kYWxEZWZhdWx0cywgY3VzdG9tTW9kYWxPcHRpb25zLCBvYmopIHtcclxuICAgICAgICAgICAgaWYgKCFjdXN0b21Nb2RhbERlZmF1bHRzKSBjdXN0b21Nb2RhbERlZmF1bHRzID0ge307XHJcbiAgICAgICAgICAgIGN1c3RvbU1vZGFsRGVmYXVsdHMuYmFja2Ryb3AgPSAnc3RhdGljJztcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2hvdyhjdXN0b21Nb2RhbERlZmF1bHRzLCBjdXN0b21Nb2RhbE9wdGlvbnMsIG9iaik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5zaG93ID0gZnVuY3Rpb24gKGN1c3RvbU1vZGFsRGVmYXVsdHMsIGN1c3RvbU1vZGFsT3B0aW9ucywgb2JqKSB7XHJcbiAgICAgICAgICAgIC8vQ3JlYXRlIHRlbXAgb2JqZWN0cyB0byB3b3JrIHdpdGggc2luY2Ugd2UncmUgaW4gYSBzaW5nbGV0b24gc2VydmljZVxyXG4gICAgICAgICAgICB2YXIgdGVtcE1vZGFsRGVmYXVsdHMgPSB7fTtcclxuICAgICAgICAgICAgdmFyIHRlbXBNb2RhbE9wdGlvbnMgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIC8vTWFwIGFuZ3VsYXItdWkgbW9kYWwgY3VzdG9tIGRlZmF1bHRzIHRvIG1vZGFsIGRlZmF1bHRzIGRlZmluZWQgaW4gc2VydmljZVxyXG4gICAgICAgICAgICBhbmd1bGFyLmV4dGVuZCh0ZW1wTW9kYWxEZWZhdWx0cywgbW9kYWxEZWZhdWx0cywgY3VzdG9tTW9kYWxEZWZhdWx0cyk7XHJcblxyXG4gICAgICAgICAgICAvL01hcCBtb2RhbC5odG1sICRzY29wZSBjdXN0b20gcHJvcGVydGllcyB0byBkZWZhdWx0cyBkZWZpbmVkIGluIHNlcnZpY2VcclxuICAgICAgICAgICAgYW5ndWxhci5leHRlbmQodGVtcE1vZGFsT3B0aW9ucywgbW9kYWxPcHRpb25zLCBjdXN0b21Nb2RhbE9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0ZW1wTW9kYWxEZWZhdWx0cy5jb250cm9sbGVyKSB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wTW9kYWxEZWZhdWx0cy5jb250cm9sbGVyID0gZnVuY3Rpb24gKCRzY29wZSwgJHVpYk1vZGFsSW5zdGFuY2UsIE5vdGlmaWNhdG9yLCAkcm9vdFNjb3BlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZvbGRlcnNMID0gJHJvb3RTY29wZS5mb2xkZXJzTGlzdDtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXBsb2FkRmlsZSA9IGZ1bmN0aW9uICgkZmlsZSwgJGVyckZpbGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS51cGxvYWRmaWxlbmFtZSA9ICRmaWxlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJGZpbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qZmlsZS51cGxvYWQgPSBVcGxvYWQudXBsb2FkKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0OjEzMzcvYXBpL3VzZXJzLycgKyB1c2VyX25hbWUgKyAnL2ZpbGVzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7ZmlsZTogZmlsZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZS51cGxvYWQudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZS5yZXN1bHQgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPiAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5lcnJvck1zZyA9IHJlc3BvbnNlLnN0YXR1cyArICc6ICcgKyByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlLnByb2dyZXNzID0gTWF0aC5taW4oMTAwLCBwYXJzZUludCgxMDAuMCAqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZ0LmxvYWRlZCAvIGV2dC50b3RhbCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pOyovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGZpbGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnZmlsZSB3YXMgc3VjY2Vzc2Z1bGx5IHNlbGVjdGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubW9kYWxPcHRpb25zID0gdGVtcE1vZGFsT3B0aW9ucztcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubW9kYWxPcHRpb25zLm9rID0gZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZm5hbWUgPSAnTWFpbic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmZCA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmZC5hcHBlbmQoJ2ZpbGUnLCAkc2NvcGUudXBsb2FkZmlsZW5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUudXBsb2FkZmlsZW5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBGaWxlTWFuYWdlci5BZGRGaWxlKCRyb290U2NvcGUudXNlciwgZmQsIGZuYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZmQuZ2V0KCdmaWxlJykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2xvZ2ljIGhlcmVcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qJHJvb3RTY29wZS5uZXdGTmFtZSA9ICRzY29wZS5uZXdmaWxlbmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgRmlsZU1hbmFnZXIuVXBkYXRlRmlsZShvYmoudXNlciwgb2JqLl9pZCwgSlNPTi5zdHJpbmdpZnkoe2ZpbGVuYW1lOiAkc2NvcGUubmV3ZmlsZW5hbWV9KSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBOb3RpZmljYXRvci5zdWNjZXNzKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTm90aWZpY2F0b3IuZXJyb3IocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pOyovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubW9kYWxPcHRpb25zLmNsb3NlID0gZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkdWliTW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJHVpYk1vZGFsLm9wZW4odGVtcE1vZGFsRGVmYXVsdHMpLnJlc3VsdDtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxufSkoKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2ZpbGVzbGlzdC9tb2RhbC91cGxvYWRmaWxlLnNlcnZpY2UuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdteUFwcCcpXG4gICAgICAgIC5jb25maWcobm90aWZpY2F0b3JDb25maWcpXG4gICAgICAgIC5mYWN0b3J5KCdOb3RpZmljYXRvcicsIE5vdGlmaWNhdG9yKVxuICAgICAgICAucnVuKG5vdGlmaWNhdGlvbnNSdW4pO1xuXG4gICAgTm90aWZpY2F0b3IuJGluamVjdCA9IFsndG9hc3RyJ107XG4gICAgZnVuY3Rpb24gTm90aWZpY2F0b3IodG9hc3RyKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihtc2csIHRpdGxlKSB7XG4gICAgICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MobXNnLCB0aXRsZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgd2FybmluZzogZnVuY3Rpb24obXNnLCB0aXRsZSkge1xuICAgICAgICAgICAgICAgIHRvYXN0ci53YXJuaW5nKG1zZywgdGl0bGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbihtc2csIHRpdGxlKSB7XG4gICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKG1zZywgdGl0bGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGluZm86IGZ1bmN0aW9uKG1zZywgdGl0bGUpIHtcbiAgICAgICAgICAgICAgICB0b2FzdHIuaW5mbyhtc2csIHRpdGxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5vdGlmaWNhdGlvbnNSdW4uJGluamVjdCA9IFsnJHJvb3RTY29wZScsICdOb3RpZmljYXRvcicsICckdGltZW91dCddO1xuICAgIGZ1bmN0aW9uIG5vdGlmaWNhdGlvbnNSdW4oJHJvb3RTY29wZSwgbm90aWZpY2F0b3IsICR0aW1lb3V0KSB7XG4gICAgICAgIC8qJHJvb3RTY29wZS4kb24oJyR1c2VyTG9nZ2VkSW4nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIG5vdGlmaWNhdG9yLnN1Y2Nlc3MoJ0hleSB0aGVyZSEnKTtcblxuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBub3RpZmljYXRvci5pbmZvKCdXZWxjb21lIHRvIHRoaXMgZnJlZSBhbmd1bGFyIGRhc2hib2FyZCBzZWVkIHByb2plY3QsJyArXG4gICAgICAgICAgICAgICAgJyB0aGF0IHlvdSBtYXkgdXNlIHRvIGJvb3RzdHJhcCB5b3VyIG5leHQgd2ViIGFwcCEnLCB7XG4gICAgICAgICAgICAgICAgICAgIHRpbWVPdXQ6IDEwMDAwXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LDMwMDApO1xuXG4gICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIG5vdGlmaWNhdG9yLmluZm8oJ0J0dywgZmVlbCBmcmVlIHRvIGNvbnRyaWJ1dGUgdG8gdGhpcyBwcm9qZWN0IGFuZCBoZWxwIHVzIGtpbGwgdGhlIHBhaWQgdGVtcGxhdGVzIG1hcmtldCA7KScsIHtcbiAgICAgICAgICAgICAgICAgICAgdGltZU91dDogMTAwMDBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sMTUwMDApXG4gICAgICAgIH0pO1xuICAgICAgICAkcm9vdFNjb3BlLiRvbignJHVzZXJMb2dnZWRPdXQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIG5vdGlmaWNhdG9yLnN1Y2Nlc3MoJ0xvZ2dlZCBvdXQgc3VjY2Vzc2Z1bGx5Jyk7XG4gICAgICAgIH0pOyovXG4gICAgICAgIGNvbnNvbGUubG9nKCdub3RpZmljYXRpb25zUnVuIHdvcmtzIScpO1xuICAgIH1cblxuICAgIG5vdGlmaWNhdG9yQ29uZmlnLiRpbmplY3QgPSBbJ3RvYXN0ckNvbmZpZyddO1xuICAgIGZ1bmN0aW9uIG5vdGlmaWNhdG9yQ29uZmlnKHRvYXN0ckNvbmZpZykge1xuICAgICAgICBhbmd1bGFyLmV4dGVuZCh0b2FzdHJDb25maWcsIHtcbiAgICAgICAgICAgIHRpbWVPdXQ6IDMwMDBcbiAgICAgICAgfSk7XG4gICAgfVxuXG59KSgpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub3RpZmljYXRvci9ub3RpZmljYXRpb25zLmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnbXlBcHAnKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ3dpZGdldCcsIHdpZGdldCk7XHJcblxyXG4gICAgZnVuY3Rpb24gd2lkZ2V0KCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsICRlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICRlbGVtZW50LmFkZENsYXNzKCd3aWRnZXQnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbGluazogbGluayxcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQSdcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxufSkoKTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93aWRnZXQvd2lkZ2V0LmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImFuZ3VsYXIubW9kdWxlKCdteUFwcCcsIFsndG9hc3RyJywgJ25nQW5pbWF0ZScsICd1aS5ib290c3RyYXAnLCAnbmdGaWxlVXBsb2FkJ10pO1xyXG5cclxucmVxdWlyZSgnLi9maWxlc2xpc3QvbGlzdC5jb250cm9sbGVyLmpzJyk7XHJcbnJlcXVpcmUoJy4vZmlsZXNsaXN0L2ZpbGVtYW5hZ2VyLnNlcnZpY2UuanMnKTtcclxucmVxdWlyZSgnLi93aWRnZXQvd2lkZ2V0Jyk7XHJcbnJlcXVpcmUoJy4vbm90aWZpY2F0b3Ivbm90aWZpY2F0aW9ucycpO1xyXG5yZXF1aXJlKCcuL2ZpbGVzbGlzdC9tb2RhbC9tb2RhbCcpO1xyXG5yZXF1aXJlKCcuL2ZpbGVzbGlzdC9tb2RhbC91cGxvYWRmaWxlLnNlcnZpY2UnKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2FwcC5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QTs7OztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QSIsInNvdXJjZVJvb3QiOiIifQ==