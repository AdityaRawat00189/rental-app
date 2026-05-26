const { createClient } = require('redis');

console.log("LOG: Attempting to connect to Redis at:", process.env.REDIS_URL || 'redis://127.0.0.1:6379');

const redisClient = createClient({
    url : process.env.REDIS_URL || 'redis://127.0.0.1:6379'
})

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Connected to Redis'));

(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error('Error connecting to Redis:', err);
    }
})();

module.exports = redisClient;