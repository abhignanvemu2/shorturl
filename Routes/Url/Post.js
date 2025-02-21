const moment = require('moment');
const Url = require('../../Models/Urls');
const redisClient = require('../../config/RedisClient');
const { formattedDate } = require('../../Lib');

// Constants for rate limiting
const RATE_LIMIT = 5; // Maximum short URLs allowed per user per hour
const EXPIRATION_TIME = 60 * 60; // 1 hour in seconds

const Post = async (request, response) => {
    try {
        // Extract required data from request
        const { longUrl, topic, customAlias } = request.body;

        const { systemAdminId } = request.user;
        const baseUrl = `${request.protocol}://${request.get('host')}`;

        // Initialize Redis connection if not connected
        if (!redisClient.isOpen) await redisClient.connect();

        // Rate limiting implementation using Redis
        const redisKey = `url_limit:${systemAdminId}`;
        let requestCount = await redisClient.get(redisKey);

        // Check if user has exceeded rate limit
        if (requestCount && requestCount >= RATE_LIMIT) {
            return response.status(429).json({
                message: `Rate limit exceeded. You can create only ${RATE_LIMIT} short URLs per hour.`,
            });
        }

        // Update rate limit counter
        if (requestCount) {
            await redisClient.incr(redisKey);
        } else {
            await redisClient.set(redisKey, 1, { EX: EXPIRATION_TIME });
        }

        // Check if URL already exists for this user
        const findUrl = await Url.findOne({ userId: systemAdminId, longUrl });
        if (findUrl) {
            return response.status(400).json({ message: 'longUrl already exists' });
        }

        // Generate or validate alias
        const { nanoid } = await import('nanoid');
        let alias = customAlias ? customAlias : nanoid(7);

        // Handle custom alias
        if (customAlias) {
            const existingUrl = await Url.findOne({ alias: customAlias });
            if (existingUrl) {
                return response.status(400).json({ message: 'Custom Alias already taken' });
            }
        } 
        // Generate unique alias if no custom alias provided
        else {
            let isUnique = false;
            while (!isUnique) {
                const existingUrl = await Url.findOne({ alias });
                if (!existingUrl) {
                    isUnique = true;
                } else {
                    alias = nanoid(7);
                }
            }
        }

        // Create new URL record
        const newUrl = await Url.create({
            userId: systemAdminId,
            longUrl,
            alias,
            topic,
        });

        // Return success response
        return response.status(200).json({
            message: 'success',
            data: { 
                shortUrl: `${baseUrl}/${newUrl.alias}`, 
                createdAt: formattedDate(newUrl.createdAt )
            },
        });

    } catch (error) {
        return response.status(500).json({ message: error.message });
    }
};

module.exports = Post;
