const { Router } = require('express')
const GroupsController = require('../controller')
const ensureAuth = require('../../../middlewares/ensureAuth')

const router = Router()
const controller = new GroupsController()

router.put('/', ensureAuth, controller.create_group)

router.put('/user', ensureAuth, controller.add_user)

router.put('/post', ensureAuth, controller.create_post)

router.get('/user', ensureAuth, controller.get_user_groups)

router.get('/all', ensureAuth, controller.get_all_groups)

router.post('/', ensureAuth, controller.update_group)

router.delete('/user', ensureAuth, controller.delete_user)

router.delete('/post', ensureAuth, controller.delete_post)

router.delete('/', ensureAuth, controller.delete_group)


module.exports = router