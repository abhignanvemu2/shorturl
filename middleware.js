const axios = require("axios");

const authMiddleware = async (req, res, next) => {
    try {
        const accessToken = req.cookies.token; // Extract token from header

        if (!accessToken) {
            return res.status(401).json({ error: "Access token is required" });
        }

        // Validate the token with Google API
        const response = await axios.get(
            `https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`
        );

        if (response.status !== 200) {
            return res.status(401).json({ error: "Invalid access token" });
        }

        req.user = response.data; // Attach user data to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Auth Middleware Error:", error.response?.data || error.message);
        
        return res.status(401).json({ error: "Authentication failed", details: error.response?.data });
    }
};

module.exports = authMiddleware;
