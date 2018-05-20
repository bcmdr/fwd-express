var express = require('express')
var router = express.Router()
const linksSource = require('../links')
const linkController = require('../controllers/linkController')

/* GET home page. */
router.get('/', linkController.homePage)

router.get('/~/:shortcutId', linkController.shortcutForward)

router.get('/:listId', linkController.listPage)

router.get('/:user/:link', function(req, res, next) {
  res.redirect(linksSource[req.params.user][req.params.link].url)
})

module.exports = router;
