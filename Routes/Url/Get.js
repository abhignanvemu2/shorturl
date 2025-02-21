const AccessLogs = require('../../Models/AccessLogs');
const Url = require('../../Models/Urls');

const Get = async (req, res) => {
    const { systemAdminId } = req.user;

    try {
        const urls = await Url.find({ userId: systemAdminId });

        if (urls && urls.length > 0) {
            const data = await Promise.all(
                urls.map(async (url) => {
                    const accessLogs = await AccessLogs.aggregate([
                        { $match: { urlId: url._id } }, 
                        { $group: { _id: null, totalVisits: { $sum: "$visit" } } } 
                    ]);

                    const totalVisits = accessLogs.length > 0 ? accessLogs[0].totalVisits : 0;
                    
                    return {
                        url: url.url,
                        shortUrl: url.shortUrl,
                        clicks: totalVisits 
                    };
                })
            );

            return res.json({ message: "success", data: data });
        } else {
            return res.json({ message: "No URLs found", data: [] });
        }

    } catch (error) {
        console.error(`Error fetching URL: ${error.message}`);
        return res.status(500).send('Internal Server Error');
    }
};

module.exports = Get;
