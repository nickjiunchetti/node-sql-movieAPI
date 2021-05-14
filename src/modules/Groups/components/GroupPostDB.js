const { Group, GroupPost } = require('../db')
const { User } = require('../../User/db')

module.exports = class GroupPostDB {
	async createPost(userId, groupId, text) {
		try {
			const group = await Group.findOne({
				where: {
					id: groupId
				},
				include: User
			})

			if (!group) {
				return {
					status: 406,
					data: { message: `GroupId: ${groupId} não encontrado` }
				}
			}

			if (group.restricted === true) {
				const userInGroup = []
				group.users.map((user) => {
					if (user.id === userId) {
						userInGroup.push(user.id)
					}
				})

				if (userInGroup.length === 0) {
					return {
						status: 406,
						data: { message: `UserId: ${userId} não pertence ao GroupId: ${groupId}` }
					}
				}

			}

			const post = await GroupPost.create({
				groupId: groupId,
				ownerId: userId,
				text: text
			})

			return {
				status: 201, data: {
					message: 'Post criado com sucesso',
					post: post
				}
			}

		} catch (error) {
			return {
				status: 406,
				data: {
					message: `Erro ao criar post, verifique os parâmetros de entrada`,
					error: `${error}`
				}
			}
		}
	}

	async deletePost(userId, postId) {
		try {
			const exists = await GroupPost.findOne({
				where: {
					id: postId
				}
			})

			if (!exists) {
				return {
					status: 406,
					data: { message: `PostId: ${postId} não encontrado` }
				}
			}

			if (exists.ownerId != userId) {
				return {
					status: 406,
					data: { message: `PostId: ${postId} não pertence ao userId: ${userId}` }
				}
			}

			await exists.destroy()

			return {
				status: 200, data: {
					message: `Post ${postId} removido com sucesso`
				}
			}

		} catch (error) {
			return {
				status: 406,
				data: {
					message: `Erro ao remover post, verifique os parâmetros de entrada`,
					error: `${error}`
				}
			}
		}
	}
}

