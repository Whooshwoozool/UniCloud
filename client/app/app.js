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

require('./fileslist/list.controller');
require('./fileslist/filemanager.service');
require('./widget/widget');
require('./notificator/notifications');
require('./fileslist/modal/modal');
require('./fileslist/modal/uploadfile.service');
require('./fileslist/modal/editfolder.service');
require('./fileslist/modal/createfolder.service');
require('./fileslist/modal/replacefile.service');
require('./defaultCtrl/default.controller');
require('./login/authentification.service');
require('./login/login.controller');