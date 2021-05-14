const { WishList, Wish } = require('../db')
const MovieAPI = require('../../Movie/components/MovieAPI')
const { Op } = require('sequelize')

//SOLID - Open-Closed Principle - Esta entidade é facilmente extendida, para adicionar mais campos na tabela e nas requisições, sem precisar modificar as logicas atuais
module.exports = class WishListDB {
	async createWishlist(userId, wishlistName, restricted) {
		try {
			if (!wishlistName) {
				return {
					status: 401,
					data: { message: 'Insira um nome para a wishlist' }
				}
			}

			const exists = await WishList.findOne({
				where: {
					userAuthorId: userId,
					name: wishlistName
				}
			})

			if (exists) {
				return {
					status: 406,
					data: { message: `Usuário ja possuí uma lista com o nome ${wishlistName}` }
				}
			}

			const wish_list = await WishList.create({
				name: wishlistName,
				userAuthorId: userId,
				restricted: restricted
			})

			return {
				status: 201, data: {
					message: 'Wishlist criada com sucesso',
					list: {
						id: wish_list.id,
						name: wishlistName,
						restricted: restricted || true
					}
				}
			}

		} catch (error) {
			return {
				status: 406,
				data: {
					message: `Erro ao criar wishlist, verifique os parâmetros de entrada`,
					error: `${error}`
				}
			}
		}
	}

	async getWishlist(wishlistId, wishlistName, userId) {
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

			const answer_data = {
				...wish_list.dataValues, wishes: await Promise.all(wish_list.wishes.map(async (wish) => (await new MovieAPI().search(wish.imdbID))))
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
					message: 'Erro ao retornar wishlist, verifique os parâmetros de entrada',
					error: `${error}`
				}
			}
		}
	}

	async getUserWishlists(userId, wishlistName) {
		try {
			const wishlists = await WishList.findAll({
				where: {
					[Op.and]:
						[
							{ userAuthorId: userId || '' },
							{ name: { [Op.like]: `%${wishlistName || ''}%` } }
						]
				},
				include: [{
					model: Wish,
					required: false,
				}]
			})

			if (wishlists.length === 0) {
				return {
					status: 406,
					data: { message: `Nenhuma lista ${wishlistName ? 'que contém ' + wishlistName : ''} encontrada para o userId ${userId}` }
				}
			}

			const answer_data = await Promise.all(wishlists.map(async (wishList) => ({
				...wishList.dataValues, wishes: await Promise.all(wishList.wishes.map(async (wish) => (
					await new MovieAPI().search(wish.imdbID)
				)))
			})))

			return {
				status: 200,
				data: answer_data
			}
		}

		catch (error) {
			return {
				status: 406,
				data: {
					message: `Erro ao retornar wishlists do userId ${userId}, verifique os parâmetros de entrada`,
					error: `${error}`
				}
			}
		}
	}

	async getAllWishlists(userId, wishlistName) {
		try {
			const wishlists = await WishList.findAll({
				where: {
					[Op.and]:
						[
							{ name: { [Op.like]: `%${wishlistName || ''}%` } },
							{
								[Op.or]:
									[
										{ userAuthorId: userId || '' },
										{ restricted: false }
									]
							}
						]
				},
				include: [{
					model: Wish,
					required: false,
				}]
			})

			if (wishlists.length === 0) {
				return {
					status: 406,
					data: { message: `Nenhuma lista ${wishlistName ? 'que contém ' + wishlistName : ''} encontrada` }
				}
			}

			const answer_data = await Promise.all(wishlists.map(async (wishList) => ({
				...wishList.dataValues, wishes: await Promise.all(wishList.wishes.map(async (wish) => (
					await new MovieAPI().search(wish.imdbID)
				)))
			})))

			return {
				status: 200,
				data: answer_data
			}
		}

		catch (error) {
			return {
				status: 406,
				data: {
					message: 'Erro ao retornar wishlists, verifique os parâmetros de entrada',
					error: `${error}`
				}
			}
		}
	}

	async deleteWishlist(userId, wishlistId) {
		try {
			const exists = await WishList.findOne({
				where: {
					[Op.or]:
						[
							{
								[Op.and]:
									[
										{ id: wishlistId || '' },
										{ userAuthorId: userId }
									]
							},
							{ id: wishlistId || '' }
						]
				},
			})

			if (!exists) {
				return {
					status: 406,
					data: { message: `WishlistsId: ${wishlistId} não encontrada` }
				}
			}

			if (exists.userAuthorId != userId) {
				return {
					status: 403,
					data: { message: `WishlistId: ${wishlistId} não pertence ao userId: ${userId}` }
				}
			}

			await exists.destroy()
			return { status: 200, data: { message: `Wishlist ${exists.name} removida com sucesso` } }
		}

		catch (error) {
			return {
				status: 406,
				data: {
					message: `Erro ao remover wishlist id: ${wishlistId}, verifique os parâmetros de entrada.`,
					error: `${error}`
				}
			}
		}
	}
}

