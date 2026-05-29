const redisClient = require('../config/redis');

// Implementing a bucket-based rate limiter using Redis
const rateLimit = ({ capacity, refillRate }) => {
    return async (req, res, next) => {
        try {
            const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip;

            const bucketKey = `rate_limit:${ip}`;

            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

            // Get the current bucket state from Redis
            let bucket = await redisClient.get(bucketKey);
            bucket = bucket ? JSON.parse(bucket) : {
                tokens: capacity,
                lastRefill: currentTime
            }

            // Refill tokens based on elapsed time
            const elapsedTime = currentTime - bucket.lastRefill;
            const refill = Math.floor(elapsedTime * refillRate);

            bucket.tokens = Math.min(capacity, bucket.tokens + refill);
            bucket.lastRefill = currentTime;

            if(bucket.tokens < 1) {
                return res.status(429).json({
                    status: 'fail',
                    message: 'Too many requests'
                });
            }

            // Consume a token
            bucket.tokens -= 1;

            await redisClient.set(
                bucketKey,
                JSON.stringify(bucket),
                {
                    EX: Math.ceil(capacity / refillRate)
                }
            );

            res.setHeader(
                'X-RateLimit-Remaining',
                Math.floor(bucket.tokens)
            );

            next();
        }
        catch (error) {
            console.error(error);

            // In case of Redis errors, allow the request to proceed (fail-open)
            next();
        }
    }
}

module.exports = { rateLimit };