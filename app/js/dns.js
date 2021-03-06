/*
  Copyright 2017, RackN
  Dns controller
*/
(function () {
  angular.module('app')
    .controller('DNSCtrl', [
      '$scope', 'api', '$mdDialog', '$mdMedia',
      function ($scope, api, $mdDialog, $mdMedia) {
        $scope.$emit('title', 'DNS Zones'); // shows up on the top toolbar

        let dns = this;
        this.selected = [];

        $scope.deleteRecords = function (zone) {
          $scope.confirm(event, {
            title: 'Remove Records',
            message: 'Are you sure you want to remove selected records?',
            yesCallback: function () {
              dns.selected.forEach(function (record) {
                record.changetype = 'REMOVE';
                api('/dns/zones/' + zone.name, {
                  method: 'PATCH',
                  data: record
                }).then(api.getHealth, api.getHealth);
              });

              dns.selected = [];
            }
          });
        };

        $scope.add = function (ev, zone) {
          let useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
          $mdDialog.show({
            controller: 'DialogController',
            controllerAs: 'dialog',
            templateUrl: 'views/dialogs/adddnsrecorddialog.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
              zone: zone,
              record: {
                changetype: 'ADD',
                name: '',
                content: '',
                type: ''
              }
            },
            clickOutsideToClose: true,
            fullscreen: useFullScreen
          });
        };
      }
    ]);
})();
