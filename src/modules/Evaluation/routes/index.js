const { Router } = require('express')
const EvaluationController = require('../controller')
const ensureAuth = require('../../../middlewares/ensureAuth')

const router = Router()
const controller = new EvaluationController()

router.put('/', ensureAuth, controller.create_user_evaluation)

router.get('/user', ensureAuth, controller.get_user_evaluations)

router.get('/movie', ensureAuth, controller.get_movie_evaluations)

router.post('/', ensureAuth, controller.update_user_evaluation)

router.delete('/', ensureAuth, controller.delete_user_evaluation)


module.exports = router