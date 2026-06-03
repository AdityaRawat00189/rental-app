const bullmq = require('bullmq');
const ioredis = require('ioredis');


const redisConnection = new ioredis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
    maxRetriesPerRequest: null,
})

const notificationQueue = new bullmq.Queue('notificationQueue', {
    connection: redisConnection,
})

module.exports = { notificationQueue , redisConnection };