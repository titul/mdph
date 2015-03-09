'use strict';

var express = require('express');
var controller = require('./question.controller');
var router = express.Router();

router.get('/', controller.index);
router.get('/:sectionId', controller.show);

module.exports = router;