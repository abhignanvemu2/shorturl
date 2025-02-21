const Url = require("../../Models/Urls"); // Importing the Url model
const AccessLog = require("../../Models/AccessLogs"); // Importing the AccessLog model

const GetUserAnalytics = async (request, response) => {
  try {
    const userId = request.user.id;

    // Fetch all URLs created by the user
    const urls = await Url.find({ createdBy: userId }).select("_id");
    if (!urls.length) return response.status(404).json({ message: "No URLs found for this user." });

    const urlIds = urls.map(url => url._id);

    // Date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Aggregation Pipeline
    const aggregationPipeline = [
      { $match: { urlId: { $in: urlIds } } },
      {
        $lookup: {
          from: "devicedetails",
          localField: "_id",
          foreignField: "accessLogId",
          as: "deviceDetails"
        }
      },
      { $unwind: "$deviceDetails" },
      {
        $group: {
          _id: null,
          totalClicks: { $sum: 1 },
          uniqueUsers: { $addToSet: "$accessedBy" },
          clicksByDate: {
            $push: {
              date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
            }
          },
          osType: {
            $push: {
              osName: "$deviceDetails.os",
              accessedBy: "$accessedBy"
            }
          },
          deviceType: {
            $push: {
              device: "$deviceDetails.device",
              accessedBy: "$accessedBy"
            }
          }
        }
      }
    ];

    const result = await AccessLog.aggregate(aggregationPipeline);
    if (!result.length) return response.status(404).json({ message: "No analytics data found for this user." });

    const data = result[0];

    // Process unique users and clicks by OS
    const osAnalytics = {};
    for (const entry of data.osType) {
      const os = entry.osName;
      if (!osAnalytics[os]) osAnalytics[os] = { osName: os, uniqueClicks: 0, uniqueUsers: new Set() };
      osAnalytics[os].uniqueClicks++;
      osAnalytics[os].uniqueUsers.add(entry.accessedBy);
    }

    // Process unique users and clicks by Device Type
    const deviceMapping = { 1: "Desktop", 2: "Mobile", 3: "Tablet" };
    const deviceAnalytics = {};
    for (const entry of data.deviceType) {
      const device = deviceMapping[entry.device] || "Unknown";
      if (!deviceAnalytics[device]) deviceAnalytics[device] = { deviceName: device, uniqueClicks: 0, uniqueUsers: new Set() };
      deviceAnalytics[device].uniqueClicks++;
      deviceAnalytics[device].uniqueUsers.add(entry.accessedBy);
    }

    // Process Clicks by Date
    const clicksByDateMap = {};
    for (const entry of data.clicksByDate) {
      if (!clicksByDateMap[entry.date]) clicksByDateMap[entry.date] = 0;
      clicksByDateMap[entry.date]++;
    }
    const clicksByDate = Object.keys(clicksByDateMap).map(date => ({ date, totalClicks: clicksByDateMap[date] })).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Format Response
    response.status(200).json({
      totalUrls: urls.length,
      totalClicks: data.totalClicks,
      uniqueUsers: data.uniqueUsers.length,
      clicksByDate,
      osType: Object.values(osAnalytics).map(os => ({ ...os, uniqueUsers: os.uniqueUsers.size })),
      deviceType: Object.values(deviceAnalytics).map(device => ({ ...device, uniqueUsers: device.uniqueUsers.size }))
    });

  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

module.exports = GetUserAnalytics;
