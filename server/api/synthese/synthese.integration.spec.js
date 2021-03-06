'use strict';

import Synthese from './synthese.model';

import { startServer } from '../../../test/utils/server';
import { populate } from '../../../test/utils/seed';

describe('Synthese Integration', function() {
  let api;
  let server;
  var tokenAdminMdph;

  before(done => {
    startServer((result) => {
      server = result.server;
      api = result.api;

      populate((result) => {
        tokenAdminMdph = result.tokenAdminMdph;
        done();
      });
    });
  });

  after(done => {
    Synthese.remove().exec();
    server.close();
    done();
  });

  describe('Get single Synthese', function() {
      beforeEach(done => {
        var newSynthese = new Synthese({
          _id: '5965d1cfa631dd020ce132a4',
          lastname: 'nom',
          firstname: 'prenom',
          birthdate: '01/01/2000',
          mdph: 'test',
          geva: ''
        });

        Synthese.create(newSynthese,done);
      });

      afterEach(done => {
        Synthese.remove().then(() => done());
      });

      it('should get the specified populated synthese', done => {
        var gettedSynthese;

        api
          .get(`/api/syntheses/5965d1cfa631dd020ce132a4?access_token=${tokenAdminMdph}`)
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }

            gettedSynthese = res.body;
            gettedSynthese.should.have.property('lastname');
            gettedSynthese.should.have.property('firstname');
            gettedSynthese.should.have.property('birthdate');
            gettedSynthese.should.have.property('mdph');
            gettedSynthese.should.have.property('geva');
            done();
          });
      });
    });

  describe('Get all Synthese of MDPH', function() {
      beforeEach(done => {
        var firstSynthese = new Synthese({
          _id: '5965d1cfa631dd020ce132a4',
          lastname: 'nom',
          firstname: 'prenom',
          birthdate: '01/01/2000',
          mdph: 'test',
          geva: ''
        });

        Synthese.create(firstSynthese);

        var secondSynthese = new Synthese({
           _id: '5065d1cfa631dd020ce132a4',
          lastname: 'nom',
          firstname: 'prenom',
          birthdate: '01/01/2001',
          mdph: 'test',
          geva: ''
        });

        Synthese.create(secondSynthese);

        done();
      });

      afterEach(done => {
        Synthese.remove().then(() => done());
      });

      it('should get the specified populated syntheses', done => {
        var gettedSynthese;

        api
          .get(`/api/syntheses?access_token=${tokenAdminMdph}&mdphId=test`)
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }

            gettedSynthese = res.body[0];
            gettedSynthese.should.have.property('lastname');
            gettedSynthese.should.have.property('firstname');
            gettedSynthese.should.have.property('birthdate');
            gettedSynthese.should.have.property('mdph');
            gettedSynthese.should.have.property('geva');

            gettedSynthese = res.body[1];
            gettedSynthese.should.have.property('lastname');
            gettedSynthese.should.have.property('firstname');
            gettedSynthese.should.have.property('birthdate');
            gettedSynthese.should.have.property('mdph');
            gettedSynthese.should.have.property('geva');

            done();
          });
      });
    });

    describe.only('create synthese', function() {

      afterEach(done => {
        Synthese.remove().then(() => done());
      });

      it('should respond with the new synthese', done => {
        var createdSynthese;

        var syntheseToCreate = new Synthese({
          lastname: 'nom',
          firstname: 'prenom',
          birthdate: '01/01/2000',
          mdph: 'test',
          geva: '#P0uet'
        });

        api
          .post(`/api/syntheses?access_token=${tokenAdminMdph}`)
          .send(syntheseToCreate)
          .expect(201)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }

            createdSynthese = res.body;
            createdSynthese.mdph.should.equal(syntheseToCreate.mdph);
            createdSynthese.lastname.should.equal(syntheseToCreate.lastname);
            createdSynthese.firstname.should.equal(syntheseToCreate.firstname);
             createdSynthese.birthdate.should.equal(syntheseToCreate.birthdate);
            createdSynthese.geva.should.equal(syntheseToCreate.geva);

            done();
          });
      });

    });

    describe('update synthese', function() {

      beforeEach(done => {
        var newSynthese = new Synthese({
          _id: '5965d1cfa631dd020ce132a4',
          lastname: 'nom',
          firstname: 'prenom',
          birthdate: '01/01/2000',
          mdph: 'test',
          geva: ''
        });

        Synthese.create(newSynthese,done);
      });

      afterEach(done => {
        Synthese.remove().then(() => done());
      });

      it('should respond with the updated thing', done => {
        var updatedSynthese;
        api
          .put(`/api/syntheses/5965d1cfa631dd020ce132a4?access_token=${tokenAdminMdph}`)
          .send({geva: 'Fl1cFl@c', lastname: 'nouveau_nom'})
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }

            updatedSynthese = res.body;
            updatedSynthese.geva.should.equal('Fl1cFl@c');
            updatedSynthese.lastname.should.equal('nouveau_nom');

            done();
          });
      });
    });
});

