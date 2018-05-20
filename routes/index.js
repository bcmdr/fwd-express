var express = require('express');
var router = express.Router();
const linksSource = require('../links')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'fwd' });
});

router.get('/:user', function (req, res, next) {
  const user = req.params.user
  const links = linksSource[user]
  res.render('user', { user, links })
})

router.get('/:user/:link', function(req, res, next) {
  res.redirect(linksSource[req.params.user][req.params.link].url);
});

module.exports = router;
