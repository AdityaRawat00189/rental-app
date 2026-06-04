const bullmq = require('bullmq');
const ioredis = require('ioredis');


const redisConnection = new ioredis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
    maxRetriesPerRequest: null,
})

const notificationQueue = new bullmq.Queue('notificationQueue', {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
        type: 'exponential',
        delay: 2000, // 2s → 4s → 8s
        },
        removeOnComplete: { count: 100 }, // keep last 100 completed jobs
        removeOnFail: { count: 500 },     // keep last 500 failed jobs
    },
})

module.exports = { notificationQueue , redisConnection };