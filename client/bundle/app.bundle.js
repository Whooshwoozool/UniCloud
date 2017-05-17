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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
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
            return $http.put(url)
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

    FilesList.$inject = ['$scope', 'FileManager', 'Notificator'];

    function FilesList($scope, FileManager, Notificator) {
        var user_name = 'cpeterffyx';

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
        }

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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

angular.module('myApp', ['toastr']);

__webpack_require__(1);
__webpack_require__(0);
__webpack_require__(2);
__webpack_require__(4);

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


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmJ1bmRsZS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBhMGE5MGZlOGE4ZDRkZTcyZDMxMiIsIndlYnBhY2s6Ly8vLi9maWxlc2xpc3QvZmlsZW1hbmFnZXIuc2VydmljZS5qcyIsIndlYnBhY2s6Ly8vLi9maWxlc2xpc3QvbGlzdC5jb250cm9sbGVyLmpzIiwid2VicGFjazovLy8uL3dpZGdldC93aWRnZXQuanMiLCJ3ZWJwYWNrOi8vLy4vYXBwLmpzIiwid2VicGFjazovLy8uL25vdGlmaWNhdG9yL25vdGlmaWNhdGlvbnMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAzKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBhMGE5MGZlOGE4ZDRkZTcyZDMxMiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCdcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnbXlBcHAnKVxyXG4gICAgICAgIC5mYWN0b3J5KCdGaWxlTWFuYWdlcicsIEZpbGVNYW5hZ2VyKTtcclxuXHJcbiAgICBGaWxlTWFuYWdlci4kaW5qZWN0ID0gWyckaHR0cCddO1xyXG5cclxuICAgIGZ1bmN0aW9uIEZpbGVNYW5hZ2VyKCRodHRwKSB7XHJcbiAgICAgICAgdmFyIHNlcnZpY2UgPSB7fTtcclxuXHJcbiAgICAgICAgc2VydmljZS5HZXRBbGxGaWxlcyA9IEdldEFsbEZpbGVzO1xyXG4gICAgICAgIHNlcnZpY2UuVXBkYXRlRmlsZSA9IFVwZGF0ZUZpbGU7XHJcbiAgICAgICAgc2VydmljZS5EZWxldGVGaWxlID0gRGVsZXRlRmlsZTtcclxuICAgICAgICBzZXJ2aWNlLkFkZEZpbGUgPSBBZGRGaWxlO1xyXG5cclxuICAgICAgICByZXR1cm4gc2VydmljZTtcclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiBHZXRBbGxGaWxlcyh1c2VyX25hbWUpIHtcclxuICAgICAgICAgICAgdmFyIHVybCA9ICdodHRwOi8vbG9jYWxob3N0OjEzMzcvYXBpL3VzZXJzLycgKyB1c2VyX25hbWUgKyAnL2ZpbGVzJztcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCh1cmwpXHJcbiAgICAgICAgICAgICAgICAudGhlbihoYW5kbGVTdWNjZXNzLCBoYW5kbGVFcnJvcignRXJyb3IgZ2V0dGluZyBhbGwgZmlsZXMnKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIFVwZGF0ZUZpbGUodXNlcl9uYW1lLCBmaWxlX2lkLCBkYXRhKSB7XHJcbiAgICAgICAgICAgIHZhciB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdDoxMzM3L2FwaS91c2Vycy8nICsgdXNlcl9uYW1lICsgJy9maWxlcy8nICsgZmlsZV9pZDtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnB1dCh1cmwpXHJcbiAgICAgICAgICAgICAgICAudGhlbihoYW5kbGVTdWNjZXNzLCBoYW5kbGVFcnJvcignRXJyb3IgdXBkYXRpbmcgZmlsZScpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIERlbGV0ZUZpbGUodXNlcl9uYW1lLCBmaWxlX2lkKSB7XHJcbiAgICAgICAgICAgIHZhciB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdDoxMzM3L2FwaS91c2Vycy8nICsgdXNlcl9uYW1lICsgJy9maWxlcy8nICsgZmlsZV9pZDtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZSh1cmwpXHJcbiAgICAgICAgICAgICAgICAudGhlbihoYW5kbGVTdWNjZXNzLCBoYW5kbGVFcnJvcignRXJyb3IgZGVsZXRpbmcgZmlsZScpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIEFkZEZpbGUodXNlcl9uYW1lLCBkYXRhKSB7XHJcbiAgICAgICAgICAgIHZhciB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdDoxMzM3L2FwaS91c2Vycy8nICsgdXNlcl9uYW1lICsgJy9maWxlcyc7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KHVybClcclxuICAgICAgICAgICAgICAgIC50aGVuKGhhbmRsZVN1Y2Nlc3MsIGhhbmRsZUVycm9yKCdFcnJvciBkZWxldGluZyBmaWxlJykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlU3VjY2VzcyhyZXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5kYXRhO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlRXJyb3IoZXJyb3IpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7bWVzc2FnZTogZXJyb3J9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vZmlsZXNsaXN0L2ZpbGVtYW5hZ2VyLnNlcnZpY2UuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0J1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdteUFwcCcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0ZpbGVzTGlzdCcsIEZpbGVzTGlzdCk7XHJcblxyXG4gICAgRmlsZXNMaXN0LiRpbmplY3QgPSBbJyRzY29wZScsICdGaWxlTWFuYWdlcicsICdOb3RpZmljYXRvciddO1xyXG5cclxuICAgIGZ1bmN0aW9uIEZpbGVzTGlzdCgkc2NvcGUsIEZpbGVNYW5hZ2VyLCBOb3RpZmljYXRvcikge1xyXG4gICAgICAgIHZhciB1c2VyX25hbWUgPSAnY3BldGVyZmZ5eCc7XHJcblxyXG4gICAgICAgICRzY29wZS5ubSA9IHVzZXJfbmFtZTtcclxuXHJcbiAgICAgICAgRmlsZU1hbmFnZXIuR2V0QWxsRmlsZXModXNlcl9uYW1lKVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmlsZXMgPSByZXM7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIE5vdGlmaWNhdG9yLnN1Y2Nlc3MoJ0ZpbGVzIGhhdmUgYmVlbiBzdWNjZXNzZnVsbHkgbG9hZGVkIScpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydChyZXMubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkc2NvcGUuZGVsZXRlRmlsZSA9IGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICAgICAgdmFyIGZpbGVfaWQgPSBvYmouX2lkO1xyXG4gICAgICAgICAgICBGaWxlTWFuYWdlci5EZWxldGVGaWxlKCRzY29wZS5ubSwgZmlsZV9pZClcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBOb3RpZmljYXRvci5zdWNjZXNzKCdpdCB3b3JrcyEgRmlsZSB3YXMgc3VjY2Vzc2Z1bGx5IGRlbGV0ZWQhJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBmaW5kSW5kZXgoJHNjb3BlLmZpbGVzLCAnX2lkJywgZmlsZV9pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZpbGVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9kZWxldGUgJHNjb3BlLmZpbGVzW2luZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmZpbGVzKTtcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBOb3RpZmljYXRvci5lcnJvcihyZXMpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBmaW5kSW5kZXgoYXJyYXksIGtleSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFycmF5W2ldW2tleV0gPT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59KSgpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vZmlsZXNsaXN0L2xpc3QuY29udHJvbGxlci5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ215QXBwJylcclxuICAgICAgICAuZGlyZWN0aXZlKCd3aWRnZXQnLCB3aWRnZXQpO1xyXG5cclxuICAgIGZ1bmN0aW9uIHdpZGdldCgpIHtcclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCAkZWxlbWVudCkge1xyXG4gICAgICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygnd2lkZ2V0Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGxpbms6IGxpbmssXHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbn0pKCk7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd2lkZ2V0L3dpZGdldC5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJhbmd1bGFyLm1vZHVsZSgnbXlBcHAnLCBbJ3RvYXN0ciddKTtcclxuXHJcbnJlcXVpcmUoJy4vZmlsZXNsaXN0L2xpc3QuY29udHJvbGxlci5qcycpO1xyXG5yZXF1aXJlKCcuL2ZpbGVzbGlzdC9maWxlbWFuYWdlci5zZXJ2aWNlLmpzJyk7XHJcbnJlcXVpcmUoJy4vd2lkZ2V0L3dpZGdldCcpO1xyXG5yZXF1aXJlKCcuL25vdGlmaWNhdG9yL25vdGlmaWNhdGlvbnMnKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2FwcC5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ215QXBwJylcbiAgICAgICAgLmNvbmZpZyhub3RpZmljYXRvckNvbmZpZylcbiAgICAgICAgLmZhY3RvcnkoJ05vdGlmaWNhdG9yJywgTm90aWZpY2F0b3IpXG4gICAgICAgIC5ydW4obm90aWZpY2F0aW9uc1J1bik7XG5cbiAgICBOb3RpZmljYXRvci4kaW5qZWN0ID0gWyd0b2FzdHInXTtcbiAgICBmdW5jdGlvbiBOb3RpZmljYXRvcih0b2FzdHIpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKG1zZywgdGl0bGUpIHtcbiAgICAgICAgICAgICAgICB0b2FzdHIuc3VjY2Vzcyhtc2csIHRpdGxlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3YXJuaW5nOiBmdW5jdGlvbihtc2csIHRpdGxlKSB7XG4gICAgICAgICAgICAgICAgdG9hc3RyLndhcm5pbmcobXNnLCB0aXRsZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKG1zZywgdGl0bGUpIHtcbiAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IobXNnLCB0aXRsZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5mbzogZnVuY3Rpb24obXNnLCB0aXRsZSkge1xuICAgICAgICAgICAgICAgIHRvYXN0ci5pbmZvKG1zZywgdGl0bGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbm90aWZpY2F0aW9uc1J1bi4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJywgJ05vdGlmaWNhdG9yJywgJyR0aW1lb3V0J107XG4gICAgZnVuY3Rpb24gbm90aWZpY2F0aW9uc1J1bigkcm9vdFNjb3BlLCBub3RpZmljYXRvciwgJHRpbWVvdXQpIHtcbiAgICAgICAgLyokcm9vdFNjb3BlLiRvbignJHVzZXJMb2dnZWRJbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbm90aWZpY2F0b3Iuc3VjY2VzcygnSGV5IHRoZXJlIScpO1xuXG4gICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIG5vdGlmaWNhdG9yLmluZm8oJ1dlbGNvbWUgdG8gdGhpcyBmcmVlIGFuZ3VsYXIgZGFzaGJvYXJkIHNlZWQgcHJvamVjdCwnICtcbiAgICAgICAgICAgICAgICAnIHRoYXQgeW91IG1heSB1c2UgdG8gYm9vdHN0cmFwIHlvdXIgbmV4dCB3ZWIgYXBwIScsIHtcbiAgICAgICAgICAgICAgICAgICAgdGltZU91dDogMTAwMDBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sMzAwMCk7XG5cbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgbm90aWZpY2F0b3IuaW5mbygnQnR3LCBmZWVsIGZyZWUgdG8gY29udHJpYnV0ZSB0byB0aGlzIHByb2plY3QgYW5kIGhlbHAgdXMga2lsbCB0aGUgcGFpZCB0ZW1wbGF0ZXMgbWFya2V0IDspJywge1xuICAgICAgICAgICAgICAgICAgICB0aW1lT3V0OiAxMDAwMFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwxNTAwMClcbiAgICAgICAgfSk7XG4gICAgICAgICRyb290U2NvcGUuJG9uKCckdXNlckxvZ2dlZE91dCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbm90aWZpY2F0b3Iuc3VjY2VzcygnTG9nZ2VkIG91dCBzdWNjZXNzZnVsbHknKTtcbiAgICAgICAgfSk7Ki9cbiAgICAgICAgY29uc29sZS5sb2coJ25vdGlmaWNhdGlvbnNSdW4gd29ya3MhJyk7XG4gICAgfVxuXG4gICAgbm90aWZpY2F0b3JDb25maWcuJGluamVjdCA9IFsndG9hc3RyQ29uZmlnJ107XG4gICAgZnVuY3Rpb24gbm90aWZpY2F0b3JDb25maWcodG9hc3RyQ29uZmlnKSB7XG4gICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHRvYXN0ckNvbmZpZywge1xuICAgICAgICAgICAgdGltZU91dDogMzAwMFxuICAgICAgICB9KTtcbiAgICB9XG5cbn0pKCk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vdGlmaWNhdG9yL25vdGlmaWNhdGlvbnMuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0E7Ozs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBIiwic291cmNlUm9vdCI6IiJ9