const { Router } = require('express')
const MovieController = require('../controller')

const router = Router();
const controller = new MovieController()

router.get('/', controller.find_movie)


module.exports = router;