const redis = require('ioredis')

const cache = new redis({
	host: process.env.CACHE_HOST || 'localhost',
	port: process.env.CACHE_PORT || 6379,
	password: process.env.CACHE_PASSWORD || '',
	options: {
		enableAutoPipelining: true,
		enableReadyCheck: true
	}
})

module.exports = cache;