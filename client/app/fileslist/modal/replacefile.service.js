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