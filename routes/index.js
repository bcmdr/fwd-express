var express = require('express')
var router = express.Router()
const listController = require('../controllers/listController')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const { catchErrors } = require('../handlers/errorHandlers')

router.get('/', catchErrors(listController.homePage))

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

router.get('/lists', catchErrors(listController.getLists))
router.get('/lists/new', authController.isLoggedIn, listController.newList)
router.post('/lists/new', 
  authController.isLoggedIn, 
  catchErrors(listController.saveList))
router.get('/lists/remove/:user/:slug',
  catchErrors(listController.getList),
  catchErrors(listController.confirmListOwner),
  catchErrors(listController.removeList)
)

// User Lists
router.get('/:user', catchErrors(listController.getUserLists))

// Give a list to another user
// router.get('/:user/new', authController.isLoggedIn, catchErrors(listController.newUserList))
// router.post('/:user/new', authController.isLoggedIn, catchErrors(listController.saveUserList))

// List Posts
router.get('/:user/:slug', catchErrors(listController.getUserListBySlug))
router.get('/:user/:slug/add', 
  catchErrors(listController.getList),
  catchErrors(listController.confirmListOwner),
  catchErrors(listController.addLinkToList)
)
router.post('/:user/:slug/add', 
  catchErrors(listController.getList),
  catchErrors(listController.confirmListOwner),
  // catchErrors(listController.searchPostDetails),
  catchErrors(listController.getMetaData),
  catchErrors(listController.saveLinkToList)
)
router.get('/:user/:slug/remove/:postId', 
  catchErrors(listController.getList),
  catchErrors(listController.confirmListOwner),
  catchErrors(listController.removeLinkFromList)
)
router.get('/:user/:slug/settings',
  catchErrors(listController.getList),
  catchErrors(listController.confirmListOwner),
  listController.listSettings
)
router.post('/:user/:slug/settings',
  catchErrors(listController.getList),
  catchErrors(listController.confirmListOwner),
  catchErrors(listController.saveListSettings)
)

module.exports = router;
