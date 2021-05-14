const cache = require('../config/cache')

module.exports = class RedisCacheProvider {

	constructor() {
		this.state = {
			client: cache
		}
	}

	async save(hash, key, value) {
		await this.client.hset(hash, key, value)
	}

	async get(hash, key) {
		return await this.client.hget(hash, key)
	}

	async getAll(hash) {
		return await this.client.hgetAll(hash)
	}

	async delete(hash, key) {
		await this.client.hdel(hash, key)
	}
}