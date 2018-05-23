var express = require('express')
var router = express.Router()
const linksSource = require('../links')
const linkController = require('../controllers/linkController')
const listController = require('../controllers/listController')
const { catchErrors } = require('../handlers/errorHandlers')

router.get('/', listController.homePage)
router.get('/lists', catchErrors(listController.getLists))

// router.get('/create', listController.createList)
// router.post('/create', catchErrors(listController.saveList))

router.get('/collections/add', listController.addCollection)
router.post('/collections/add', catchErrors(listController.saveCollection))

router.get('/collections/:slug', catchErrors(listController.getCollectionBySlug))
router.get('/collections/:slug/:listSlug', catchErrors(listController.getCollectionBySlug))

router.get('/lists/add', catchErrors(listController.addList))
router.post('/lists/add', catchErrors(listController.saveList))
router.get('/lists/:slug', catchErrors(listController.getListBySlug))
router.post('/lists/:slug/add', catchErrors(listController.saveItem))

// router.get('/~/:shortcutId', linkController.shortcutForward)

// // router.get('/:listId', linkController.listPage)
// // router.get('/:user/:link', function(req, res, next) {
// //   res.redirect(linksSource[req.params.user][req.params.link].url)
// // })

module.exports = router;
