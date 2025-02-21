const Url = require("../../Models/Urls"); // Importing the Url model to query URL data

const GetAnalysisByTopic = async (request, response) => {
  try {
    const { topic } = request.params; // Extracting the topic parameter from the request URL
    const urls = await Url.find({ topic }); // Finding all URLs by their topic
    if (urls.length == 0) return response.status(404).send({ message: "No URLs found for this topic" }); // If no URLs found, return 404

    // Calculate date 7 days ago from today
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Aggregation pipeline for MongoDB
    const aggregationPipeline = [
      { $match: { topic: parseInt(topic) } },
      { 
        $lookup: { 
          from: 'accesslogs',
          localField: '_id',
          foreignField: 'urlId',
          as: 'accessLogs'
        }
      },
      { $unwind: '$accessLogs' },
      { 
        $match: { 
          'accessLogs.createdAt': { $gte: sevenDaysAgo }
        }
      },
      { 
        $lookup: { 
          from: 'devicedetails',
          localField: 'accessLogs._id',
          foreignField: 'accessLogId',
          as: 'deviceDetails'
        }
      },
      { $unwind: { path: '$deviceDetails', preserveNullAndEmptyArrays: true } },
      { $addFields: { date: { $dateToString: { format: "%Y-%m-%d", date: "$accessLogs.createdAt" } } } },
      {
        $group: {
          _id: "$_id",
          clicksByDate: { $push: "$date" },
          osType: { $push: "$deviceDetails.os" },
          deviceType: { $push: "$deviceDetails.device" },
          uniqueUsers: { $addToSet: "$accessLogs.accessedBy" }
        }
      }
    ];

    const result = await Url.aggregate(aggregationPipeline);
    if (result.length == 0) return response.status(404).send({ message: "No data found for this topic" });

    const totalUniqueClicks = urls.reduce((sum, url) => sum + url.uniqueClicks, 0);

    // Prepare the response data
    const analytics = {
      totalClicks: 0,
      uniqueUsers: 0,
      clicksByDate: [],
      urls: []
    };
    const baseUrl = `${request.protocol}://${request.get('host')}`;

    // Helper function to merge clicks by date
    const mergeClicksByDate = (clicksByDate) => {
      return clicksByDate.reduce((acc, date) => {
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
    };

    for (let url of urls) {
      const analyticsData = result.find(r => r._id.toString() == url._id.toString());

      if (analyticsData) {
        analytics.totalClicks += url.clicks;
        analytics.uniqueUsers = totalUniqueClicks;

        // Merge clicksByDate
        const mergedClicks = mergeClicksByDate(analyticsData.clicksByDate);
        Object.entries(mergedClicks).forEach(([date, clicks]) => {
          const existing = analytics.clicksByDate.find(item => item.date === date);
          if (existing) {
            existing.clicks += clicks;
          } else {
            analytics.clicksByDate.push({ date, clicks });
          }
        });

        analytics.urls.push({
          shortUrl: `${baseUrl}/${url.alias}`,
          totalClicks: url.clicks ?? 0,
          uniqueUsers: url.uniqueClicks ?? 0,
          clicksByDate: Object.entries(mergedClicks).map(([date, clicks]) => ({ date, clicks }))
        });
      } else {
        analytics.urls.push({
          shortUrl: `${baseUrl}/${url.alias}`,
          totalClicks: url.clicks || 0,
          uniqueUsers: url.uniqueClicks || 0,
          clicksByDate: []
        });
      }
    }

    response.status(200).json(analytics);
  } catch (error) {
    response.status(500).send(error.message);
  }
};

module.exports = GetAnalysisByTopic;
