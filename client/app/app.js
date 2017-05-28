angular.module('myApp', ['toastr', 'ngAnimate', 'ui.bootstrap', 'ngFileUpload']);

require('./fileslist/list.controller.js');
require('./fileslist/filemanager.service.js');
require('./widget/widget');
require('./notificator/notifications');
require('./fileslist/modal/modal');
require('./fileslist/modal/uploadfile.service');