const WishDB = require('../components/WishDB')
const WishListDB = require('../components/WishListDB')
const WishListOperations = require('../components/WishListOperations')

//SOLID - Singles Responsability Principle - Esta classe possuí apenas uma única responsabilidade de receber e executar as requisições relacionadas as wishlists. 
module.exports = class WishListController {
	async create_wish_list(req, res) {
		const userId = req.user.id
		const wishlistName = req.body.wishlistName
		const restricted = req.body.restricted

		const wish_list = await new WishListDB().createWishlist(userId, wishlistName, restricted)

		return res.status(wish_list.status).json(wish_list.data)

	}

	async create_wish(req, res) {
		const userId = req.user.id
		const wishListId = req.body.wishlistId
		const imdbID = req.body.imdbID
		const Title = req.body.Title

		const wish_list = await new WishDB().createWish(userId, wishListId, imdbID, Title)

		return res.status(wish_list.status).json(wish_list.data)
	}

	async get_wish_list(req, res, next) {
		const userId = req.user.id
		const wishlistId = parseInt(req.query.wishListId)
		const wishlistName = req.query.wishlistName
		const filterBy = req.query.filterBy
		const filterParam = req.query.filterParam

		if (filterBy && filterParam) {
			return next()
		}

		const wish_list = await new WishListDB().getWishlist(wishlistId, wishlistName, userId)

		return res.status(wish_list.status).send(wish_list.data)
	}

	async filter_wishes(req, res) {
		const userId = req.user.id
		const wishlistId = parseInt(req.query.wishListId)
		const wishlistName = req.query.wishlistName
		const filterBy = req.query.filterBy
		const filterParam = req.query.filterParam

		const wish_list = await new WishListOperations().filterWishlist(userId, wishlistId, wishlistName, filterBy, filterParam)

		return res.status(wish_list.status).json(wish_list.data)
	}

	async get_user_wish_list(req, res) {
		const userId = req.user.id
		const wishlistName = req.query.wishlistName

		const wish_lists = await new WishListDB().getUserWishlists(userId, wishlistName)

		return res.status(wish_lists.status).json(wish_lists.data)
	}

	async get_all_wish_list(req, res) {
		const userId = req.user.id
		const wishlistName = req.query.wishlistName

		const wish_lists = await new WishListDB().getAllWishlists(userId, wishlistName)

		return res.status(wish_lists.status).json(wish_lists.data)
	}

	async delete_wish(req, res) {
		const userId = req.user.id
		const wishListId = req.query.wishlistId
		const imdbID = req.query.imdbID
		const Title = req.query.Title

		const wishlist = await new WishDB().deleteWish(userId, wishListId, imdbID, Title)

		return res.status(wishlist.status).send(wishlist.data)
	}

	async delete_wish_list(req, res) {
		const userId = req.user.id
		const wishlistId = req.query.wishlistId

		const wishlist = await new WishListDB().deleteWishlist(userId, wishlistId)

		return res.status(wishlist.status).send(wishlist.data)
	}
}