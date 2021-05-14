const express = require('express')
const routes = express.Router()

const movieRouter = require('../modules/Movie/routes')
const userRouter = require('../modules/User/routes')
const wishListRouter = require('../modules/WishList/routes')
const evaluationRouter = require('../modules/Evaluation/routes')
const groupsRouter = require('../modules/Groups/routes')
const watchRouter = require('../modules/Watchlist/routes')

//SOLID - Interface Segregation Principle - Multiplas interfaces para o cliente são melhores do que uma interface única e complexa.

routes.use('/movie', movieRouter)

routes.use('/user', userRouter)

routes.use('/wishlist', wishListRouter)

routes.use('/evaluation', evaluationRouter)

routes.use('/group', groupsRouter)

routes.use('/watch', watchRouter)


module.exports = routes