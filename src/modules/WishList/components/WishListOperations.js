const { Wish, WishList } = require('../db')
const MovieAPI = require('../../Movie/components/MovieAPI')
const { Op } = require('sequelize')

module.exports = class WishListOperations {

	async filterWishlist(userId, wishlistId, wishlistName, filterBy, filterParam) {
		try {
			if (!wishlistId && !wishlistName) {
				return {
					status: 401,
					data: { message: 'Insira um nome ou id de uma wishlist' }
				}
			}

			const wish_list = await WishList.findOne({
				where: {
					[Op.or]:
						[
							{
								[Op.and]:
									[
										{
											[Op.or]:
												[
													{ id: wishlistId || '' },
													{ name: { [Op.like]: `%${wishlistName}%` } }
												]
										},
										{ userAuthorId: userId }
									]
							},
							{ id: wishlistId || '' }
						]
				},
				include: [{
					model: Wish,
					required: false,
				}]
			})

			if (!wish_list)
				return {
					status: 401,
					data: { message: `Lista${wishlistName ? ' ' + wishlistName : ''} ${wishlistId ? 'wishlistId: ' + wishlistId + ' ' : ''}não encontrada.` }
				}

			if (wish_list.userAuthorId != userId) {
				return {
					status: 403,
					data: { message: `Lista ${wish_list.name + ' wishlistId: ' + wishlistId} não pertence ao userId: ${userId}.` }
				}
			}

			const getMovies = await Promise.all(wish_list.wishes.map(async (wish) => (await new MovieAPI().search(wish.imdbID))))
			const answer_data = {
				...wish_list.dataValues,
				wishes: getMovies.filter((movie) => String(movie.data[`${filterBy}`]).includes(`${filterParam}`))
			}

			if (answer_data.wishes.length === 0) {
				return {
					status: 406,
					data: { message: `Nenhum filme com ${filterBy} ${filterParam} encontrado` }
				}
			}

			return {
				status: 200,
				data: answer_data
			}
		}
		catch (error) {
			return {
				status: 406,
				data: {
					message: 'Erro ao retornar wishlist, verifique os parâmetros de entrada e tente novamente',
					error: `${error}`
				}
			}
		}
	}
}

