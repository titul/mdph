'use strict';

/**
 * @ngdoc function
 * @name impactApp.controller:VosAttentesAidantCtrl
 * @description
 * # VosAttentesAidantCtrl
 * Controller of the impactApp
 */
angular.module('impactApp')
  .controller('VosAttentesAidantCtrl', function ($scope) {
    $scope.title = 'Vos attentes en tant qu’aidant familial';

    if (angular.isUndefined($scope.sectionModel.attentes)) {
      $scope.sectionModel.attentes = {
        label: $scope.title,
        answers: {}
      };
    }

    $scope.subSectionModel = $scope.sectionModel.attentes.answers;
  });
