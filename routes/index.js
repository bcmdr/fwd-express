var express = require('express')
var router = express.Router()
const linksSource = require('../links')
const linkController = require('../controllers/linkController')
const listController = require('../controllers/listController')
const { catchErrors } = require('../handlers/errorHandlers')

router.get('/', catchErrors(listController.homePage))

router.get('/lists', catchErrors(listController.getLists))
router.get('/lists/add', catchErrors(listController.addList))
router.post('/lists/add', catchErrors(listController.saveList))
router.get('/lists/:slug', catchErrors(listController.getListBySlug))

router.get('/lists/:slug/add', catchErrors(listController.addLinkToList))
router.post('/lists/:slug/add', catchErrors(listController.saveLinkToList))

module.exports = router;
