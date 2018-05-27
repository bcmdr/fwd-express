var express = require('express')
var router = express.Router()
const linksSource = require('../links')
const linkController = require('../controllers/linkController')
const listController = require('../controllers/listController')
const { catchErrors } = require('../handlers/errorHandlers')

router.get('/', listController.homePage)

// router.get('/collections', catchErrors(listController.getCollections))
// router.get('/collections/add', listController.addCollection)
// router.post('/collections/add', catchErrors(listController.saveCollection))
// router.get('/collections/:slug', catchErrors(listController.getCollectionBySlug))
// router.get('/collections/:slug/:listSlug', catchErrors(listController.getCollectionBySlug))

router.get('/lists', catchErrors(listController.getLists))
router.get('/lists/add', catchErrors(listController.addList))
router.post('/lists/add', catchErrors(listController.saveList))
router.get('/lists/:slug', catchErrors(listController.getListBySlug))
router.get('/lists/:slug/add', catchErrors(listController.addLinkToList))
router.post('/lists/:slug/add', catchErrors(listController.saveLinkToList))

router.get('/links/add', linkController.addLink)
router.post('/links/add', catchErrors(linkController.saveLink))
router.get('/links/:id', catchErrors(linkController.getLinkById))

// router.get('/~/:shortcutId', linkController.shortcutForward)

// // router.get('/:listId', linkController.listPage)
// // router.get('/:user/:link', function(req, res, next) {
// //   res.redirect(linksSource[req.params.user][req.params.link].url)
// // })

module.exports = router;
