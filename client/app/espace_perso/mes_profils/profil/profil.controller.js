'use strict';

angular.module('impactApp').controller('ProfilCtrl', function($scope, $state, User, ProfileService, RequestResource, currentUser, profile, requests, toastr, $anchorScroll) {
  $scope.profile = profile;
  $scope.estAdulte = ProfileService.estAdulte(profile);
  $scope.requests = requests;

  var hasSubmitted = false;

  $scope.nouvelleDemande = function() {
    hasSubmitted = false;
    var missingSections = ProfileService.getMissingSection(profile);
    if (missingSections.length > 0) {
      var oldOffSet = $anchorScroll.yOffset;
      $anchorScroll.yOffset = 20;
      $anchorScroll(missingSections[0]);
      $anchorScroll.yOffset = oldOffSet;
      toastr.error('Vous n\'avez pas fini de remplir les parties obligatoires de ce profil.', 'Erreur de la création de la demande');
      hasSubmitted = true;
      missingSections.forEach(function(sectionId) {
        $scope.options[sectionId].error = true;
      });
    } else {
      var formAnswers = _.pick(profile, 'identites', 'vie_quotidienne', 'vie_scolaire', 'vie_au_travail', 'aidant', 'situations_particulieres');
      new RequestResource({profile: profile._id, user: currentUser._id, formAnswers: formAnswers}).$save(function(saved) {
        $scope.requests.push(saved);
        $state.go('.demande', {shortId: saved.shortId});
      });
    }
  };

  $scope.options = {
    beneficiaire: {
      title: 'Bénéficiaire',
      content: 'Identité de la personne concernée par la demande.',
      icon: 'fa-user',
      model: 'identites.beneficiaire',
      mandatory: true,
      action: {
        sref: 'espace_perso.mes_profils.profil.beneficiaire'
      }
    },

    autorite: {
      title: 'Autorité parentale',
      content: 'Autorité parentale ou délégation d\'autorité.',
      icon: 'fa-users',
      model: 'identites.autorite',
      mandatory: !$scope.estAdulte,
      action: {
        sref: 'espace_perso.mes_profils.profil.autorite'
      }
    },

    autre: {
      title: 'Personne vous aidant dans cette démarche',
      model: 'identites.autre',
      icon: 'fa-users',
      action: {
        sref: 'espace_perso.mes_profils.profil.autre'
      }
    },

    vieQuotidienne: {
      title: 'Vie quotidienne',
      model: 'vie_quotidienne',
      icon: 'fa-home',
      mandatory: true,
      action: {
        sref: 'espace_perso.mes_profils.profil.vie_quotidienne'
      }
    },

    vieScolaire: {
      title: 'Vie scolaire',
      model: 'vie_scolaire',
      icon: 'fa-university',
      action: {
        sref: 'espace_perso.mes_profils.profil.vie_scolaire'
      }
    },

    vieTravail: {
      title: 'Vie au travail',
      model: 'vie_au_travail',
      icon: 'fa-industry',
      action: {
        sref: 'espace_perso.mes_profils.profil.vie_au_travail'
      }
    },

    aidant: {
      title: 'Vie de votre aidant familial',
      icon: 'fa-male',
      model: 'aidant',
      action: {
        sref: 'espace_perso.mes_profils.profil.aidant.situation.nom_aidant'
      }
    },
    particulieres: {
      title: 'Situations particulières',
      content: 'Si vous vous trouvez dans une situation nécessitant une attention particulière.',
      model: 'situations_particulieres',
      icon: 'fa-warning',
      action: {
        sref: 'espace_perso.mes_profils.profil.situations_particulieres'
      }
    }
  };
});