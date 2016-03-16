'use strict';

angular.module('impactApp')
  .controller('DepartementCtrl', function($scope, $rootScope, $state, $timeout, Auth, currentMdph) {
    $scope.$emit('event:mdph-changed', currentMdph);

    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.isLoggedIn = Auth.isLoggedIn;

    Auth.isAdminMdph(currentMdph).then(is => {
      $scope.isAdminMdph = is;
    });

    L.mapbox.accessToken = 'pk.eyJ1IjoiaW1wYWN0LW1hcGJveCIsImEiOiJjaWt6bmpqYTUwMDcwd29tNDRpczM2N2pwIn0.Qh9eYg3TMD00z22WzmDXyQ';

    $scope.generateMap = function() {
      var map = L.mapbox.map('map', 'mapbox.streets').setView([currentMdph.coordinates.coordy, currentMdph.coordinates.coordx], 14);

      // Disable drag and zoom handlers.
      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.keyboard.disable();

      // Disable tap handler, if present.
      if (map.tap) {
        map.tap.disable();
      }

      L.mapbox.featureLayer({
        // this feature is in the GeoJSON format: see geojson.org
        // for the full specification
        type: 'Feature',
        geometry: {
          type: 'Point',

          // coordinates here are in longitude, latitude order because
          // x, y is the standard for GeoJSON and many formats
          coordinates: [
            currentMdph.coordinates.coordx,
            currentMdph.coordinates.coordy
          ]
        },
        properties: {
          title: currentMdph.name,
          description: currentMdph.address,
          'marker-size': 'large',
          'marker-color': '#333E54',
          'marker-symbol': 'building'
        }
      }).addTo(map);
    };
  });