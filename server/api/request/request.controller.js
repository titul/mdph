'use strict';

var _ = require('lodash');
var path = require('path');
var auth = require('../../auth/auth.service');
var config = require('../../config/environment');
var Request = require('./request.model');
var User = require('../user/user.model');


/**
 * Get list of requests
 */
exports.index = function(req, res) {
  if (req.query) {
    var search = {};
    if (req.query.opened) {
      search.opened = req.query.opened;
    }
    if (req.query.evaluator) {
      if (req.query.evaluator === 'null') {
        search.evaluator = undefined;
      } else {
        search.evaluator = req.query.evaluator;
      }
    }

    search.mdph =  req.user.mdph;
    Request.find(search)
      .select('shortId user mdph steps requestStatus updatedAt')
      .populate('user mdph', '-password -salt')
      .exec(function(err, requests) {
        if(err) return res.send(500, err);
        res.json(200, requests);
      });
  } else {
    Request.find({mdph: req.user.mdph}).exec(function(err, requests) {
      if(err) return res.send(500, err);
      res.json(200, requests);
    });
  }
};

// Get a single request
exports.show = function(req, res, next) {
  Request.findOne({
    shortId: req.params.shortId
  })
  .populate('user mdph', '-password -salt')
  .exec(function(err, request) {
    if(err) { return next(err); }
    if(!request) { return res.send(404); }
    return res.json(request);
  });
};

// Get a single request
exports.showPartenaire = function(req, res, next) {
  Request.findOne({
    shortId: req.params.shortId
  })
  .populate('user mdph', '-password -salt')
  .exec(function(err, request) {
    if(err) { return next(err); }
    if(!request) { return res.send(404); }
    return res.json(request);
  });
};

// Deletes a request from the DB.
exports.destroy = function(req, res) {
  Request.findOne({shortId: req.params.shortId}, function (err, request) {
    if(err) { return handleError(res, err); }
    if(!request) { return res.send(404); }
    request.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

/**
 * Get user requests
 */
exports.showUserRequests = function(req, res, next) {
  Request.find({
    user: req.user._id
  })
  .populate('mdph -formAnswers')
  .sort('-updatedAt')
  .exec(function(err, requests) {
    if (err) return next(err);
    if (!requests) return res.json(401);
    res.json(200, requests);
  });
};

/**
 * Update request
 */
exports.update = function(req, res, next) {
  if (req.body.user) {
    req.body.user = req.body.user._id;
  }
  if (req.body.mdph) {
    req.body.mdph = req.body.mdph._id;
  }
  if (req.body.evaluator) {
    req.body.evaluator = req.body.evaluator._id;
  }

  Request.findOne({shortId: req.params.shortId}, function (err, request) {
    request.set(req.body).save(function(err, data) {
      if(err) return res.send(500, err);
      return res.send(200, data);
    });
  });
};

/**
 * Save request
 */
exports.save = function(req, res, next) {
  var request = new Request();

  request.opened = true;
  request.user = req.user._id;
  request.updatedAt = new Date();
  request.formAnswers = req.body.formAnswers;
  request.mdph = req.body.mdph._id;
  request.steps = req.body.steps;
  request.renouvellement = req.body.renouvellement;

  request.save(function(err, data) {
    if(err) return res.send(500, err);
    return res.send(200, data);
  });
};

/**
 * File upload
 * Exemple de req.body
 *  step: 'complementaire',
 *  partenaire: partenaire
 */
exports.saveDocument = function (req, res, next) {
    Request.findOne({shortId: req.params.shortId}, function (err, request) {
      if (err) return next(err);
      var formStep = _.find(request.steps, {name: req.body.step});
      var formStepDocument = _.find(formStep.files, {name: req.body.name});
      formStepDocument.path = path.basename(req.files.file.path);
      formStepDocument.state = 'telecharge';
      if (req.body.partenaire) {
          formStepDocument.partenaire = req.body.partenaire;
        }

      request.save(function(err) {
        if (err) {return handleError(res, err); }
        if (req.body.partenaire) {
          console.log('Partenaire: ', req.body.partenaire);
          // Do something with partenaire
        }
        res.send(request);
      });
    });
};

exports.updateDocumentState = function (req, res, next) {
  Request.findOne({shortId: req.params.shortId}, function (err, request) {
     if (err) return next(err);

     var formStep = _.find(request.steps, {name: req.body.stepName});
     var formStepDocument = _.find(formStep.files, {name: req.body.fileName});

     formStepDocument.state = req.body.state;

     request.save(function(err) {
       if (err) {return handleError(res, err); }
     });

     res.send(formStepDocument.state);
   });
};

exports.updateStep = function (req, res, next) {
  var stepName = req.body.step;
  var stateName = req.body.state;
  var files = req.body.files;

  Request.findOne({shortId: req.params.shortId}, function (err, request) {
    if (err) { return handleError(res, err); }
    if(!request) { return res.send(404); }

    var formStep = _.find(request.steps, {name: stepName});
    formStep.state = stateName;
    if (files && files.length > 0) {
      formStep.files = files;
    }

    request.save(function(err) {
      if (err) {return handleError(res, err); }
    });

    res.send(formStep);
  });
};

exports.saveStep = function (req, res, next) {
  var stepName = req.body.step;
  var stateName = req.body.state;
  var files = req.body.files;

  Request.findOne({shortId: req.params.shortId}, function (err, request) {
    if (err) { return handleError(res, err); }
    if(!request) { return res.send(404); }

    var formStep = {
      name: stepName,
      state: stateName,
      files: files
    };
    request.steps.push(formStep);

    request.save(function(err) {
      if (err) {return handleError(res, err); }
      res.send(formStep);
    });
  });
};

exports.saveRequestStatus = function (req, res, next) {
  var requestStatusName = req.body.requestStatus;

  Request.findOne({shortId: req.params.shortId}, function (err, request) {
    if (err) { return handleError(res, err); }
    if(!request) { return res.send(404); }

    var newRequestStatus = requestStatusName;

    request.requestStatus = newRequestStatus ;

    request.save(function(err) {
      if (err) {return handleError(res, err); }
      res.send(newRequestStatus);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
