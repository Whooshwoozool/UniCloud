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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
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

        function AddFile(user_name, data) {
            var url = 'http://localhost:1337/api/users/' + user_name + '/files';
            return $http.post(url)
                .then(handleSuccess, handleError('Error deleting file'));
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

    FilesList.$inject = ['$scope', 'FileManager', 'Notificator', 'modalService', '$rootScope'];

    function FilesList($scope, FileManager, Notificator, modalService, $rootScope) {
        var user_name = 'mharbisherr';

        $scope.nm = user_name;

        FileManager.GetAllFiles(user_name)
            .then(function (res) {
                $scope.files = res;
                $scope.loaded = true;
                Notificator.success('Files have been successfully loaded!');
            }, function (res) {
                alert(res.message);
            });

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
        
        $scope.renameFile = function (obj) {
            var file_id = obj._id;
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Rename',
                headerText: obj.title + '.' +obj.extention,
                bodyText: 'Are you sure you want to rename this file?'
            };
            modalService.showModal({}, modalOptions, obj).then(function (result) {
                var index = findIndex($scope.files, '_id', file_id);
                $scope.files[index].title = $rootScope.newFName;
                console.log($scope.files[index].title);
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
/* 4 */
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

angular.module('myApp', ['toastr', 'ngAnimate', 'ui.bootstrap']);

__webpack_require__(1);
__webpack_require__(0);
__webpack_require__(4);
__webpack_require__(3);
__webpack_require__(2);

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmJ1bmRsZS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBjZTU1YzEyNGNmZjVhOGRhNmRiNSIsIndlYnBhY2s6Ly8vLi9maWxlc2xpc3QvZmlsZW1hbmFnZXIuc2VydmljZS5qcyIsIndlYnBhY2s6Ly8vLi9maWxlc2xpc3QvbGlzdC5jb250cm9sbGVyLmpzIiwid2VicGFjazovLy8uL2ZpbGVzbGlzdC9tb2RhbC9tb2RhbC5qcyIsIndlYnBhY2s6Ly8vLi9ub3RpZmljYXRvci9ub3RpZmljYXRpb25zLmpzIiwid2VicGFjazovLy8uL3dpZGdldC93aWRnZXQuanMiLCJ3ZWJwYWNrOi8vLy4vYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgY2U1NWMxMjRjZmY1YThkYTZkYjUiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnXHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ215QXBwJylcclxuICAgICAgICAuZmFjdG9yeSgnRmlsZU1hbmFnZXInLCBGaWxlTWFuYWdlcik7XHJcblxyXG4gICAgRmlsZU1hbmFnZXIuJGluamVjdCA9IFsnJGh0dHAnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBGaWxlTWFuYWdlcigkaHR0cCkge1xyXG4gICAgICAgIHZhciBzZXJ2aWNlID0ge307XHJcblxyXG4gICAgICAgIHNlcnZpY2UuR2V0QWxsRmlsZXMgPSBHZXRBbGxGaWxlcztcclxuICAgICAgICBzZXJ2aWNlLlVwZGF0ZUZpbGUgPSBVcGRhdGVGaWxlO1xyXG4gICAgICAgIHNlcnZpY2UuRGVsZXRlRmlsZSA9IERlbGV0ZUZpbGU7XHJcbiAgICAgICAgc2VydmljZS5BZGRGaWxlID0gQWRkRmlsZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNlcnZpY2U7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gR2V0QWxsRmlsZXModXNlcl9uYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdDoxMzM3L2FwaS91c2Vycy8nICsgdXNlcl9uYW1lICsgJy9maWxlcyc7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQodXJsKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oaGFuZGxlU3VjY2VzcywgaGFuZGxlRXJyb3IoJ0Vycm9yIGdldHRpbmcgYWxsIGZpbGVzJykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBVcGRhdGVGaWxlKHVzZXJfbmFtZSwgZmlsZV9pZCwgZGF0YSkge1xyXG4gICAgICAgICAgICB2YXIgdXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6MTMzNy9hcGkvdXNlcnMvJyArIHVzZXJfbmFtZSArICcvZmlsZXMvJyArIGZpbGVfaWQ7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wdXQodXJsLCBkYXRhKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oaGFuZGxlU3VjY2VzcywgaGFuZGxlRXJyb3IoJ0Vycm9yIHVwZGF0aW5nIGZpbGUnKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBEZWxldGVGaWxlKHVzZXJfbmFtZSwgZmlsZV9pZCkge1xyXG4gICAgICAgICAgICB2YXIgdXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6MTMzNy9hcGkvdXNlcnMvJyArIHVzZXJfbmFtZSArICcvZmlsZXMvJyArIGZpbGVfaWQ7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5kZWxldGUodXJsKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oaGFuZGxlU3VjY2VzcywgaGFuZGxlRXJyb3IoJ0Vycm9yIGRlbGV0aW5nIGZpbGUnKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBBZGRGaWxlKHVzZXJfbmFtZSwgZGF0YSkge1xyXG4gICAgICAgICAgICB2YXIgdXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6MTMzNy9hcGkvdXNlcnMvJyArIHVzZXJfbmFtZSArICcvZmlsZXMnO1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCh1cmwpXHJcbiAgICAgICAgICAgICAgICAudGhlbihoYW5kbGVTdWNjZXNzLCBoYW5kbGVFcnJvcignRXJyb3IgZGVsZXRpbmcgZmlsZScpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXMuZGF0YTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZUVycm9yKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge21lc3NhZ2U6IGVycm9yfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2ZpbGVzbGlzdC9maWxlbWFuYWdlci5zZXJ2aWNlLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCdcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnbXlBcHAnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdGaWxlc0xpc3QnLCBGaWxlc0xpc3QpO1xyXG5cclxuICAgIEZpbGVzTGlzdC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnRmlsZU1hbmFnZXInLCAnTm90aWZpY2F0b3InLCAnbW9kYWxTZXJ2aWNlJywgJyRyb290U2NvcGUnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBGaWxlc0xpc3QoJHNjb3BlLCBGaWxlTWFuYWdlciwgTm90aWZpY2F0b3IsIG1vZGFsU2VydmljZSwgJHJvb3RTY29wZSkge1xyXG4gICAgICAgIHZhciB1c2VyX25hbWUgPSAnbWhhcmJpc2hlcnInO1xyXG5cclxuICAgICAgICAkc2NvcGUubm0gPSB1c2VyX25hbWU7XHJcblxyXG4gICAgICAgIEZpbGVNYW5hZ2VyLkdldEFsbEZpbGVzKHVzZXJfbmFtZSlcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmZpbGVzID0gcmVzO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBOb3RpZmljYXRvci5zdWNjZXNzKCdGaWxlcyBoYXZlIGJlZW4gc3VjY2Vzc2Z1bGx5IGxvYWRlZCEnKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQocmVzLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmRlbGV0ZUZpbGUgPSBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICAgICAgICAgIHZhciBmaWxlX2lkID0gb2JqLl9pZDtcclxuICAgICAgICAgICAgRmlsZU1hbmFnZXIuRGVsZXRlRmlsZSgkc2NvcGUubm0sIGZpbGVfaWQpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgTm90aWZpY2F0b3Iuc3VjY2VzcygnaXQgd29ya3MhIEZpbGUgd2FzIHN1Y2Nlc3NmdWxseSBkZWxldGVkIScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gZmluZEluZGV4KCRzY29wZS5maWxlcywgJ19pZCcsIGZpbGVfaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5maWxlcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vZGVsZXRlICRzY29wZS5maWxlc1tpbmRleF07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5maWxlcyk7XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgTm90aWZpY2F0b3IuZXJyb3IocmVzKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgJHNjb3BlLnJlbmFtZUZpbGUgPSBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICAgICAgICAgIHZhciBmaWxlX2lkID0gb2JqLl9pZDtcclxuICAgICAgICAgICAgdmFyIG1vZGFsT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIGNsb3NlQnV0dG9uVGV4dDogJ0NhbmNlbCcsXHJcbiAgICAgICAgICAgICAgICBhY3Rpb25CdXR0b25UZXh0OiAnUmVuYW1lJyxcclxuICAgICAgICAgICAgICAgIGhlYWRlclRleHQ6IG9iai50aXRsZSArICcuJyArb2JqLmV4dGVudGlvbixcclxuICAgICAgICAgICAgICAgIGJvZHlUZXh0OiAnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHJlbmFtZSB0aGlzIGZpbGU/J1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBtb2RhbFNlcnZpY2Uuc2hvd01vZGFsKHt9LCBtb2RhbE9wdGlvbnMsIG9iaikudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBmaW5kSW5kZXgoJHNjb3BlLmZpbGVzLCAnX2lkJywgZmlsZV9pZCk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmlsZXNbaW5kZXhdLnRpdGxlID0gJHJvb3RTY29wZS5uZXdGTmFtZTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5maWxlc1tpbmRleF0udGl0bGUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBmaW5kSW5kZXgoYXJyYXksIGtleSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFycmF5W2ldW2tleV0gPT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59KSgpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vZmlsZXNsaXN0L2xpc3QuY29udHJvbGxlci5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ215QXBwJylcclxuICAgICAgICAuc2VydmljZSgnbW9kYWxTZXJ2aWNlJywgbW9kYWxTZXJ2aWNlKTtcclxuXHJcbiAgICBtb2RhbFNlcnZpY2UuJGluamVjdCA9IFsnJHVpYk1vZGFsJywgJ0ZpbGVNYW5hZ2VyJywgJ05vdGlmaWNhdG9yJ107XHJcbiAgICBmdW5jdGlvbiBtb2RhbFNlcnZpY2UoJHVpYk1vZGFsLCBGaWxlTWFuYWdlciwgTm90aWZpY2F0b3IpIHtcclxuXHJcbiAgICAgICAgdmFyIG1vZGFsRGVmYXVsdHMgPSB7XHJcbiAgICAgICAgICAgIGJhY2tkcm9wOiB0cnVlLFxyXG4gICAgICAgICAgICBrZXlib2FyZDogdHJ1ZSxcclxuICAgICAgICAgICAgbW9kYWxGYWRlOiB0cnVlLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4uL2FwcC9maWxlc2xpc3QvbW9kYWwvbW9kYWwuaHRtbCdcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgbW9kYWxPcHRpb25zID0ge1xyXG4gICAgICAgICAgICBjbG9zZUJ1dHRvblRleHQ6ICdDbG9zZScsXHJcbiAgICAgICAgICAgIGFjdGlvbkJ1dHRvblRleHQ6ICdPSycsXHJcbiAgICAgICAgICAgIGhlYWRlclRleHQ6ICdQcm9jZWVkPycsXHJcbiAgICAgICAgICAgIGJvZHlUZXh0OiAnUGVyZm9ybSB0aGlzIGFjdGlvbj8nXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5zaG93TW9kYWwgPSBmdW5jdGlvbiAoY3VzdG9tTW9kYWxEZWZhdWx0cywgY3VzdG9tTW9kYWxPcHRpb25zLCBvYmopIHtcclxuICAgICAgICAgICAgaWYgKCFjdXN0b21Nb2RhbERlZmF1bHRzKSBjdXN0b21Nb2RhbERlZmF1bHRzID0ge307XHJcbiAgICAgICAgICAgIGN1c3RvbU1vZGFsRGVmYXVsdHMuYmFja2Ryb3AgPSAnc3RhdGljJztcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2hvdyhjdXN0b21Nb2RhbERlZmF1bHRzLCBjdXN0b21Nb2RhbE9wdGlvbnMsIG9iaik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5zaG93ID0gZnVuY3Rpb24gKGN1c3RvbU1vZGFsRGVmYXVsdHMsIGN1c3RvbU1vZGFsT3B0aW9ucywgb2JqKSB7XHJcbiAgICAgICAgICAgIC8vQ3JlYXRlIHRlbXAgb2JqZWN0cyB0byB3b3JrIHdpdGggc2luY2Ugd2UncmUgaW4gYSBzaW5nbGV0b24gc2VydmljZVxyXG4gICAgICAgICAgICB2YXIgdGVtcE1vZGFsRGVmYXVsdHMgPSB7fTtcclxuICAgICAgICAgICAgdmFyIHRlbXBNb2RhbE9wdGlvbnMgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIC8vTWFwIGFuZ3VsYXItdWkgbW9kYWwgY3VzdG9tIGRlZmF1bHRzIHRvIG1vZGFsIGRlZmF1bHRzIGRlZmluZWQgaW4gc2VydmljZVxyXG4gICAgICAgICAgICBhbmd1bGFyLmV4dGVuZCh0ZW1wTW9kYWxEZWZhdWx0cywgbW9kYWxEZWZhdWx0cywgY3VzdG9tTW9kYWxEZWZhdWx0cyk7XHJcblxyXG4gICAgICAgICAgICAvL01hcCBtb2RhbC5odG1sICRzY29wZSBjdXN0b20gcHJvcGVydGllcyB0byBkZWZhdWx0cyBkZWZpbmVkIGluIHNlcnZpY2VcclxuICAgICAgICAgICAgYW5ndWxhci5leHRlbmQodGVtcE1vZGFsT3B0aW9ucywgbW9kYWxPcHRpb25zLCBjdXN0b21Nb2RhbE9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0ZW1wTW9kYWxEZWZhdWx0cy5jb250cm9sbGVyKSB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wTW9kYWxEZWZhdWx0cy5jb250cm9sbGVyID0gZnVuY3Rpb24gKCRzY29wZSwgJHVpYk1vZGFsSW5zdGFuY2UsIE5vdGlmaWNhdG9yLCAkcm9vdFNjb3BlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5tb2RhbE9wdGlvbnMgPSB0ZW1wTW9kYWxPcHRpb25zO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5tb2RhbE9wdGlvbnMub2sgPSBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUubmV3Rk5hbWUgPSAkc2NvcGUubmV3ZmlsZW5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEZpbGVNYW5hZ2VyLlVwZGF0ZUZpbGUob2JqLnVzZXIsIG9iai5faWQsIEpTT04uc3RyaW5naWZ5KHtmaWxlbmFtZTogJHNjb3BlLm5ld2ZpbGVuYW1lfSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTm90aWZpY2F0b3Iuc3VjY2VzcyhyZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vdGlmaWNhdG9yLmVycm9yKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuY2xvc2UocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5tb2RhbE9wdGlvbnMuY2xvc2UgPSBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiAkdWliTW9kYWwub3Blbih0ZW1wTW9kYWxEZWZhdWx0cykucmVzdWx0O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG59KSgpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vZmlsZXNsaXN0L21vZGFsL21vZGFsLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnbXlBcHAnKVxuICAgICAgICAuY29uZmlnKG5vdGlmaWNhdG9yQ29uZmlnKVxuICAgICAgICAuZmFjdG9yeSgnTm90aWZpY2F0b3InLCBOb3RpZmljYXRvcilcbiAgICAgICAgLnJ1bihub3RpZmljYXRpb25zUnVuKTtcblxuICAgIE5vdGlmaWNhdG9yLiRpbmplY3QgPSBbJ3RvYXN0ciddO1xuICAgIGZ1bmN0aW9uIE5vdGlmaWNhdG9yKHRvYXN0cikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24obXNnLCB0aXRsZSkge1xuICAgICAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKG1zZywgdGl0bGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdhcm5pbmc6IGZ1bmN0aW9uKG1zZywgdGl0bGUpIHtcbiAgICAgICAgICAgICAgICB0b2FzdHIud2FybmluZyhtc2csIHRpdGxlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24obXNnLCB0aXRsZSkge1xuICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvcihtc2csIHRpdGxlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbmZvOiBmdW5jdGlvbihtc2csIHRpdGxlKSB7XG4gICAgICAgICAgICAgICAgdG9hc3RyLmluZm8obXNnLCB0aXRsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBub3RpZmljYXRpb25zUnVuLiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAnTm90aWZpY2F0b3InLCAnJHRpbWVvdXQnXTtcbiAgICBmdW5jdGlvbiBub3RpZmljYXRpb25zUnVuKCRyb290U2NvcGUsIG5vdGlmaWNhdG9yLCAkdGltZW91dCkge1xuICAgICAgICAvKiRyb290U2NvcGUuJG9uKCckdXNlckxvZ2dlZEluJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBub3RpZmljYXRvci5zdWNjZXNzKCdIZXkgdGhlcmUhJyk7XG5cbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgbm90aWZpY2F0b3IuaW5mbygnV2VsY29tZSB0byB0aGlzIGZyZWUgYW5ndWxhciBkYXNoYm9hcmQgc2VlZCBwcm9qZWN0LCcgK1xuICAgICAgICAgICAgICAgICcgdGhhdCB5b3UgbWF5IHVzZSB0byBib290c3RyYXAgeW91ciBuZXh0IHdlYiBhcHAhJywge1xuICAgICAgICAgICAgICAgICAgICB0aW1lT3V0OiAxMDAwMFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwzMDAwKTtcblxuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBub3RpZmljYXRvci5pbmZvKCdCdHcsIGZlZWwgZnJlZSB0byBjb250cmlidXRlIHRvIHRoaXMgcHJvamVjdCBhbmQgaGVscCB1cyBraWxsIHRoZSBwYWlkIHRlbXBsYXRlcyBtYXJrZXQgOyknLCB7XG4gICAgICAgICAgICAgICAgICAgIHRpbWVPdXQ6IDEwMDAwXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LDE1MDAwKVxuICAgICAgICB9KTtcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJyR1c2VyTG9nZ2VkT3V0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBub3RpZmljYXRvci5zdWNjZXNzKCdMb2dnZWQgb3V0IHN1Y2Nlc3NmdWxseScpO1xuICAgICAgICB9KTsqL1xuICAgICAgICBjb25zb2xlLmxvZygnbm90aWZpY2F0aW9uc1J1biB3b3JrcyEnKTtcbiAgICB9XG5cbiAgICBub3RpZmljYXRvckNvbmZpZy4kaW5qZWN0ID0gWyd0b2FzdHJDb25maWcnXTtcbiAgICBmdW5jdGlvbiBub3RpZmljYXRvckNvbmZpZyh0b2FzdHJDb25maWcpIHtcbiAgICAgICAgYW5ndWxhci5leHRlbmQodG9hc3RyQ29uZmlnLCB7XG4gICAgICAgICAgICB0aW1lT3V0OiAzMDAwXG4gICAgICAgIH0pO1xuICAgIH1cblxufSkoKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm90aWZpY2F0b3Ivbm90aWZpY2F0aW9ucy5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ215QXBwJylcclxuICAgICAgICAuZGlyZWN0aXZlKCd3aWRnZXQnLCB3aWRnZXQpO1xyXG5cclxuICAgIGZ1bmN0aW9uIHdpZGdldCgpIHtcclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCAkZWxlbWVudCkge1xyXG4gICAgICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygnd2lkZ2V0Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGxpbms6IGxpbmssXHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbn0pKCk7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd2lkZ2V0L3dpZGdldC5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJhbmd1bGFyLm1vZHVsZSgnbXlBcHAnLCBbJ3RvYXN0cicsICduZ0FuaW1hdGUnLCAndWkuYm9vdHN0cmFwJ10pO1xyXG5cclxucmVxdWlyZSgnLi9maWxlc2xpc3QvbGlzdC5jb250cm9sbGVyLmpzJyk7XHJcbnJlcXVpcmUoJy4vZmlsZXNsaXN0L2ZpbGVtYW5hZ2VyLnNlcnZpY2UuanMnKTtcclxucmVxdWlyZSgnLi93aWRnZXQvd2lkZ2V0Jyk7XHJcbnJlcXVpcmUoJy4vbm90aWZpY2F0b3Ivbm90aWZpY2F0aW9ucycpO1xyXG5yZXF1aXJlKCcuL2ZpbGVzbGlzdC9tb2RhbC9tb2RhbCcpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYXBwLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBOzs7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QSIsInNvdXJjZVJvb3QiOiIifQ==