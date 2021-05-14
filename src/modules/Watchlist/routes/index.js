const { Router } = require('express')
const WatchlistController = require('../controller')
const ensureAuth = require('../../../middlewares/ensureAuth')

const router = Router()
const controller = new WatchlistController()

router.put('/', ensureAuth, controller.create_watchlist)

router.put('/movie', ensureAuth, controller.add_movie_to_watchlist)

router.get('/user', ensureAuth, controller.get_user_watchlists)

router.get('/all', ensureAuth, controller.get_all_watchlists)

router.delete('/movie', ensureAuth, controller.delete_movie)

router.delete('/', ensureAuth, controller.delete_watchlist)

module.exports = router