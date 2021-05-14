const { Router } = require('express')
const UserController = require('../controller')
const ensureAuth = require('../../../middlewares/ensureAuth')

const router = Router()
const controller = new UserController()

router.put('/register', controller.register)

router.post('/login', controller.login)

router.post('/update', ensureAuth, controller.update)

router.delete('/delete', ensureAuth, controller.delete)


module.exports = router