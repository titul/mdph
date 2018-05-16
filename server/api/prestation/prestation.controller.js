'use strict';

import Promise from 'bluebird';
import {indexBy} from 'lodash';
import prestations from './prestations.json';

export function index(req, res) {
  return res.json(prestations);
}

export function populateAndSortPrestations(request) {
  return new Promise(resolve => {
    if (!request) {
      return resolve(null);
    }

    if (request.constructor.name === 'model') {
      request = request.toObject();
    }


    if(request.prestations && request.prestations.length > 0){

      let prestationsByCode = indexBy(request.prestations, 'code');
      request.detailPrestations = prestations
        .filter(current => prestationsByCode[current.id])
        .map(function(value) {
          if (prestationsByCode[value.id].precision !== undefined) {
            value.precision = prestationsByCode[value.id].precision;
          }
          return value;
        });
    }

    resolve(request);
  });
}
