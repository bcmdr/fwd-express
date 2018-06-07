var express = require('express')
var router = express.Router()
const linksSource = require('../links')
const linkController = require('../controllers/linkController')
const listController = require('../controllers/listController')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const { catchErrors } = require('../handlers/errorHandlers')

router.get('/', catchErrors(listController.homePage))

router.get('/lists', catchErrors(listController.getLists))
router.get('/lists/add', authController.isLoggedIn, catchErrors(listController.addList))
router.post('/lists/add', catchErrors(listController.saveList))

router.get('/lists/:slug', catchErrors(listController.getListBySlug))
router.get('/lists/:slug/add', catchErrors(listController.addLinkToList))
router.post('/lists/:slug/add', 
  catchErrors(listController.searchNonUrls),
  // catchErrors(listController.getMetaData),
  catchErrors(listController.saveLinkToList)
)
router.get('/lists/:slug/remove/:postId', catchErrors(listController.removeLinkFromList))

router.get('/login', userController.loginForm)
router.post('/login', authController.login)
router.get('/logout', authController.logout)

router.get('/register', userController.registerForm)

router.post('/register', 
  userController.validateRegister,
  catchErrors(userController.register),
  authController.login
)

router.get('/account', authController.isLoggedIn, userController.account)
router.post('/account', catchErrors(userController.updateAccount))

router.get('/account/forgot', authController.forgotForm)
router.post('/account/forgot', catchErrors(authController.forgot))
router.get('/account/reset/:token', catchErrors(authController.reset))
router.post('/account/reset/:token', 
  authController.confirmedPasswords,
  catchErrors(authController.updatePassword)
)

module.exports = router;
