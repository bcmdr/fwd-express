var express = require('express');
var router = express.Router();
const links = require('../links')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'bcmdr-now' });
});

router.get('/:link', function(req, res, next) {
  res.redirect(links[req.params.link]);
});

module.exports = router;
