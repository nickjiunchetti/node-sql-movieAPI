
const { Wish, WishList } = require('../db')
const MovieAPI = require('../../Movie/components/MovieAPI')
const { Op } = require('sequelize')

module.exports = class WishDB {
	async createWish(userId, wishlistId, imdbID, Title) {
		try {
			const checkList = await WishList.findOne({
				where: {
					[Op.or]:
						[
							{
								id: wishlistId,
								userAuthorId: userId
							},
							{ id: wishlistId }
						]
				}
			})

			if (!checkList) {
				return {
					status: 401,
					data: { message: `Lista wishlistId: ${wishlistId} não encontrada` }
				}
			}

			if (checkList.userAuthorId != userId) {
				return {
					status: 403,
					data: { message: `Lista não pertence ao userId: ${userId}` }
				}
			}


			const getMovie = await new MovieAPI().search(imdbID, Title)

			const exists = await Wish.findOne({
				where: {
					imdbID: getMovie.data.imdbID,
					wishlistId
				}
			})

			if (exists) {
				return {
					status: 406,
					data: { message: `Filme ${getMovie.data.Title} já existe na wishlist.` }
				}
			}

			const wish_res = await Wish.create({
				wishlistId,
				imdbID: getMovie.data.imdbID
			})

			return {
				status: 201,
				data: {
					message: `Filme ${getMovie.data.Title} adicionado com sucesso na wishlist`,
					wish: {
						Title: getMovie.data.Title,
						...wish_res.dataValues
					}
				}
			}
		}

		catch (error) {
			return {
				status: 406,
				data: {
					message: 'Erro ao adicionar o filme a wishlist, verifique os parâmetros de entrada',
					error: `${error}`
				}
			}
		}
	}

	async deleteWish(userId, wishlistId, imdbID, Title) {
		try {
			const checkList = await WishList.findOne({
				where: {
					[Op.or]:
						[
							{
								id: wishlistId,
								userAuthorId: userId
							},
							{ id: wishlistId }
						]
				}
			})

			if (!checkList)
				return {
					status: 401,
					data: { message: `WishlistId: ${wishlistId} não encontrada` }
				}

			if (checkList.userAuthorId != userId)
				return {
					status: 403,
					data: { message: `Wishlist não pertence ao userId: ${userId}` }
				}


			const getMovie = await new MovieAPI().search(imdbID, Title)

			const exists = await Wish.findOne({
				where: {
					imdbID: getMovie.data.imdbID,
					wishlistId
				}
			})

			if (!exists) {
				return {
					status: 406,
					data: { message: `Filme ${getMovie.data.Title} não encontrado na wishlistId: ${wishlistId}` }
				}
			}

			await exists.destroy()
			return {
				status: 200,
				data: { message: `${getMovie.data.Title} removido da wishlist com sucesso.` }
			}
		}

		catch (error) {
			return {
				status: 406,
				data: {
					message: `Erro ao remover o filme da wishlist, verifique os parâmetros de entrada.`,
					error: `${error}`
				}
			}
		}
	}
}

