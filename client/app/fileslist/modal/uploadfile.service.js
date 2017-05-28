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