import { Request, Response, NextFunction, RequestHandler } from 'express'
import redisClient from '../config/redis'

interface CacheOptions {
	// Time to live in seconds (how long to keep data in cache)
	ttl?: number
	// Function to generate custom cache key
	keyGenerator?: (req: Request) => string
}

// Default options
const defaultOptions: CacheOptions = {
	ttl: 3600, // Default TTL: 1 hour
	keyGenerator: (req: Request) => {
		// Default key: HTTP method + URL + Query params
		return `${req.method}:${req.originalUrl}:${JSON.stringify(req.query)}`
	},
}

/**
 * Cache middleware factory function
 * @param options Cache configuration options
 */
export const cache = (options: CacheOptions = {}): RequestHandler => {
	// Merge provided options with defaults
	const { ttl, keyGenerator } = {
		...defaultOptions,
		...options,
	}

	return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		// Skip caching for non-GET requests
		if (req.method !== 'GET') {
			return next()
		}

		try {
			// Generate cache key
			const key = keyGenerator ? keyGenerator(req) : `${req.method}:${req.originalUrl}:${JSON.stringify(req.query)}`

			// Try to get data from cache
			const cachedData = await redisClient.get(key)

			if (cachedData) {
				// Log cache hit
				console.log(`Cache hit for key: ${key}`)

				// Parse the cached data
				const data = JSON.parse(cachedData)

				// Return cached response
				res.status(200).json(data)
				return
			}

			// Cache miss - continue to controller
			console.log(`Cache miss for key: ${key}`)

			// Store original res.json function
			const originalJson = res.json

			// Override res.json to intercept the response
			res.json = function (body) {
				// Save response to cache
				redisClient.setEx(key, ttl || 3600, JSON.stringify(body))
					.catch(err => console.error('Error setting cache:', err))

				// Call original json method
				return originalJson.call(this, body)
			}

			next()
		} catch (error) {
			console.error('Cache middleware error:', error)
			// Continue to controller even if caching fails
			next()
		}
	}
}

/**
 * Cache invalidation middleware - clears cache based on patterns
 * @param patterns Array of key patterns to invalidate
 */
export const invalidateCache = (patterns: string[]): RequestHandler => {
	return async (_req: Request, _res: Response, next: NextFunction): Promise<void> => {
		try {
			for (const pattern of patterns) {
				// Find keys matching the pattern
				const keys = await redisClient.keys(pattern)

				if (keys.length > 0) {
					// Delete matching keys
					await redisClient.del(keys)
					console.log(`Invalidated ${keys.length} cache entries matching pattern: ${pattern}`)
				}
			}
			next()
		} catch (error) {
			console.error('Cache invalidation error:', error)
			next()
		}
	}
}