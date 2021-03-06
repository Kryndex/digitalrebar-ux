/*
  Copyright 2017, RackN
  Capabilities Controller
*/
(function () {
  angular.module('app')
  .controller('CapabilitiesCtrl', [
    '$scope', 'api', '$mdMedia', '$mdDialog',
    function ($scope, api, $mdMedia, $mdDialog) {
      $scope.$emit('title', 'Capabilities'); // shows up on the top toolbar

      $scope.updateCapability = function(cap) {
        console.debug({includes: cap.includes});
        api('/api/v2/capabilities/'+ cap.id, {
          method: 'PUT',
          data: {'includes': cap.includes}
        }).then(api.getHealth, api.getHealth);
      };

      $scope.deleteCapability = function(cap) {
        $scope.confirm(event, {
          title: 'Delete Capability',
          message: 'Are you sure you want to delete ' +
            cap.name + ' capability?',
          yesCallback: function () {
            api('/api/v2/capabilities/' + cap.id, {
              method: 'DELETE'
            }).then(function () {
              api.toast('Deleted ' + cap.name + ' capability');
              api.getHealth();
            }, function (err) {
              api.toast('Error Deleted Capability', 'capability', err.data);
            });
          }
        });
      };

      $scope.rawCapabilities = function(current) {
        let raw = [];
        for (let i in $scope._capabilities) {
          if (!current.includes($scope._capabilities[i].name))
            raw.push($scope._capabilities[i].name);
        }
        return raw;
      };

      $scope.createCapabilityPrompt = function (ev) {
        $mdDialog.show({
          controller: 'DialogController',
          controllerAs: 'dialog',
          templateUrl: 'views/dialogs/addcapabilitydialog.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          locals: {
            editing: false
          },
          clickOutsideToClose: true,
          fullscreen: false
        });
      };
    }
  ])
  .filter('groupsonly', function(){
    return function(cap) {
      let filter = [];
      for (let i in cap) {
        if (cap[i].source === 'dr-groups' | cap[i].source === 'user-defined')
          filter.push(cap[i]);
      }
      return filter;
    };
  });
})();
