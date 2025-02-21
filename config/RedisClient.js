const redis = require("redis");
const dotenv = require("dotenv"); 

dotenv.config(); // Load environment variables from .env file

const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
  });
  

redisClient.on("error", (err) => console.error("Redis Error:", err));
redisClient.on('connect', () => console.log('Redis connected!'));

module.exports = redisClient;
