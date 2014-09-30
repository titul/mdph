'use strict';

angular.module('impactApp')
  .factory('FormService', function FormService(isAdult, $sessionStorage, $http, $state, $window) {
    return {
      /**
      * Appels API
      */

      getCurrentForm: function() {
        return $http.get('/api/forms/mine').then(function(result) {
          return result.data;
        }).catch( function() {
          return null;
        });
      },

      getAllForms: function() {
        return $http.get('/api/forms').then(function(forms) {
          return forms.data;
        });
      },

      saveCurrentForm: function() {
        $http.put('/api/forms/mine', $sessionStorage.formAnswers)
        .success(function() {
          $state.go('demande');
        })
        .error(function() {
          $window.alert('Vous avez déjà enregistré un questionnaire sur ce compte. Le questionnaire courant sera perdu.');
          $state.go('demande');
        });
      },

      saveStep: function(form, step, next) {
        $http.put('/api/forms/' + form._id, {step: step})
        .success(function() {
          next(step);
        });
      },

      /**
      * Utilitaires
      */

      getRepresentant: function(answers) {
        if (angular.isUndefined(answers.contexte)) {
          return null;
        }
        return answers.contexte.demandeur;
      },

      getName: function(answers) {
        var representant = this.getRepresentant(answers);
        if (angular.isUndefined(representant) || angular.isUndefined(representant.prenom)) {
          return 'la personne';
        }
        return representant.prenom;
      },

      estMasculin: function(answers) {
        var representant = this.getRepresentant(answers);
        if (angular.isUndefined(representant)) {
          return false;
        }
        return representant.sexe === 'masculin';
      },

      getPronoun: function(answers, capitalize) {
        if (capitalize) {
          return this.estMasculin(answers) ? 'Il' : 'Elle';
        }
        return this.estMasculin(answers) ? 'il' : 'elle';
      },

      getPronounTonic: function(answers) {
        return this.estMasculin(answers) ? 'lui' : 'elle';
      },

      estRepresentant: function(answers) {
        if (angular.isUndefined(answers.contexte)) {
          return false;
        }
        return answers.contexte.estRepresentant;
      },

      isAdult: function(answers) {
        return isAdult(answers.contexte);
      },

      updatedAt: function(form) {
        return moment(form.updatedAt).fromNow();
      },

      estRenouvellement: function(formAnswers) {
        return formAnswers.contexte && !formAnswers.contexte.nouveauDossier;
      },

      getRenouvellementDroits: function(form) {
        if (form && form.vie) {
          return form.vie.mesPrestations;
        }

        return undefined;
      }
    };
  });
