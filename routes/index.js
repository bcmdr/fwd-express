var express = require('express')
var router = express.Router()
const linksSource = require('../links')
const linkController = require('../controllers/linkController')
const listController = require('../controllers/listController')
const { catchErrors } = require('../handlers/errorHandlers')

router.get('/', listController.homePage)
router.get('/lists', catchErrors(listController.getLists))

router.get('/create', listController.createList)
router.post('/create', catchErrors(listController.saveList))

router.get('/:slug', catchErrors(listController.getListBySlug))
router.get('/:slug/add', catchErrors(listController.addLink))
router.post('/:slug/add', catchErrors(listController.saveLink))

// router.get('/~/:shortcutId', linkController.shortcutForward)

// // router.get('/:listId', linkController.listPage)
// // router.get('/:user/:link', function(req, res, next) {
// //   res.redirect(linksSource[req.params.user][req.params.link].url)
// // })

module.exports = router;
