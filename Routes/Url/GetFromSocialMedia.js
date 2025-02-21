const Url = require('../../Models/Urls');
const AccessLogs = require('../../Models/AccessLogs');

const GetFromSocialMedia = async (req, res) => {
    const { systemAdminId } = req.user;

    try {
        const getSocialMedia = await AccessLogs.find({ userId: systemAdminId });

        const referrerVisits = {};

        getSocialMedia.forEach((data) => {
            const referrer = data.referrer || 'Unknown'; 
            const visits = data.visit || 0;

            if (referrerVisits[referrer]) {
                referrerVisits[referrer] += visits;
            } else {
                referrerVisits[referrer] = visits;
            }
        });

        const response = Object.keys(referrerVisits).map((referrer) => ({
            referrer,
            visits: referrerVisits[referrer]
        }));

        return res.json({ message: 'success', data: response });
    } catch (error) {
        console.error(`Error fetching social media data: ${error.message}`);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = GetFromSocialMedia;
