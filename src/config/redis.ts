import { createClient } from 'redis'

// Create Redis client
const redisClient = createClient({
	url: process.env.REDIS_URL || 'redis://redis:6379'
})

// Connect to Redis
export const connectRedis = async () => {
	try {
		await redisClient.connect()
		console.log('Redis connected')
	} catch (error) {
		console.error('Redis connection error:', error);
	}
};

// Handle Redis errors
redisClient.on('error', (err) => {
	console.error('Redis error:', err);
});

export default redisClient