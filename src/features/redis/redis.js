import { Redis } from '@upstash/redis'
export const redisClient = Redis.fromEnv()


// const redisClient = new Redis({
//   url: 'https://curious-mallard-35220.upstash.io',
//   token: '********',
// })