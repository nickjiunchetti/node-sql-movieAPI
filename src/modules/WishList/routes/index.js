const { Router } = require('express')
const WishListController = require('../controller')
const ensureAuth = require('../../../middlewares/ensureAuth')

const router = Router()
const controller = new WishListController()

router.put('/', ensureAuth, controller.create_wish_list)

router.put('/wish', ensureAuth, controller.create_wish)

router.get('/', ensureAuth, controller.get_wish_list, controller.filter_wishes)

router.get('/user', ensureAuth, controller.get_user_wish_list)

router.get('/all', ensureAuth, controller.get_all_wish_list)

router.delete('/', ensureAuth, controller.delete_wish_list)

router.delete('/wish', ensureAuth, controller.delete_wish)


module.exports = router