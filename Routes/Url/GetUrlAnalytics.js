const Url = require("../../Models/Urls"); // Importing the Url model to query URL data

// Handler function for getting URL analytics
const GetUrlAnalytics = async (request, response) => {
  try {
    const { alias } = request.params; // Extracting the alias parameter from the request URL
    const url = await Url.findOne({ alias }); // Finding the URL document by its alias
    if (!url) return response.status(404).send({ message: "URL not found" }); // If URL not found, return 404

    // Calculate date 7 days ago from today
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); // Setting the date 7 days before today

    // Aggregation pipeline for MongoDB
    const aggregationPipeline = [
      { $match: { _id: url._id } }, // Matching the URL document by its ID
      { 
        $lookup: { 
          from: 'accesslogs', // Joining the 'accesslogs' collection
          localField: '_id', // Matching _id of URL document
          foreignField: 'urlId', // Matching urlId in access logs
          as: 'accessLogs' // Storing the matched access logs in 'accessLogs' field
        }
      },
      { $unwind: '$accessLogs' }, // Unwinding the accessLogs array to deal with individual log records
      // Only include logs from the last 7 days
      { 
        $match: { 
          'accessLogs.createdAt': { $gte: sevenDaysAgo } // Filtering logs created after 7 days ago
        }
      },
      { 
        $lookup: { 
          from: 'devicedetails', // Joining the 'devicedetails' collection
          localField: 'accessLogs._id', // Matching access log's ID
          foreignField: 'accessLogId', // Matching accessLogId in the device details
          as: 'deviceDetails' // Storing matched device details in 'deviceDetails' field
        } 
      },
      { $unwind: { path: '$deviceDetails', preserveNullAndEmptyArrays: true } }, // Unwinding device details (can be empty)
      // Adding a new field 'date' formatted as 'YYYY-MM-DD' from access log creation date
      { $addFields: { date: { $dateToString: { format: "%Y-%m-%d", date: "$accessLogs.createdAt" } } } },
      {
        $group: {
          _id: "$_id", // Grouping by URL ID
          clicksByDate: { $push: "$date" }, // Aggregating dates into 'clicksByDate' array
          osType: { $push: "$deviceDetails.os" }, // Aggregating OS types in 'osType' array
          deviceType: { $push: "$deviceDetails.device" }, // Aggregating device types in 'deviceType' array
          uniqueUsers: { $addToSet: "$accessLogs.userId" }, // Collecting unique users by their userId
        }
      },
      {
        $project: {
          // Projecting the analytics data
          clicksByDate: {
            $map: {
              input: { $setUnion: ["$clicksByDate", "$clicksByDate"] }, // Ensuring unique dates
              as: "date",
              in: {
                date: "$$date",
                clicks: { // Counting clicks for each unique date
                  $size: {
                    $filter: {
                      input: "$clicksByDate",
                      as: "d",
                      cond: { $eq: ["$$d", "$$date"] }
                    }
                  }
                }
              }
            }
          },
          osType: {
            // Aggregating OS types and clicks per OS
            $map: {
              input: { $setIntersection: ["$osType", "$osType"] },
              as: "os",
              in: {
                osName: "$$os",
                clicks: {
                  $size: {
                    $filter: {
                      input: "$osType",
                      as: "o",
                      cond: { $eq: ["$$o", "$$os"] }
                    }
                  }
                }
              }
            }
          },
          deviceType: {
            // Aggregating device types and clicks per device
            $map: {
              input: [1, 2, 3], // 1: Desktop, 2: Mobile, 3: Tablet
              as: "type",
              in: {
                deviceName: {
                  $switch: {
                    branches: [
                      { case: { $eq: ["$$type", 1] }, then: "Desktop" },
                      { case: { $eq: ["$$type", 2] }, then: "Mobile" },
                      { case: { $eq: ["$$type", 3] }, then: "Tablet" }
                    ],
                    default: "Unknown"
                  }
                },
                clicks: { // Counting clicks for each device type
                  $size: {
                    $filter: {
                      input: "$deviceType",
                      as: "d",
                      cond: { $eq: ["$$d", "$$type"] }
                    }
                  }
                }
              }
            }
          }
        }
      }
    ];

    // Running the aggregation pipeline on the URL collection
    const result = await Url.aggregate(aggregationPipeline);
    if (result.length === 0) return response.status(404).send({ message: "No data found for this URL" }); // No data found for the URL

    // Extracting the result from the aggregation and adding additional stats from the URL model
    const analytics = result[0];
    analytics.totalClicks = url.clicks;  // Adding the total click count from the URL model
    analytics.uniqueClicks = url.uniqueClicks;  // Adding unique click count from the URL model

    response.status(200).json(analytics); // Returning the analytics data in the response
  } catch (error) {
    response.status(500).send(error.message); // Handling any errors and sending a 500 status
  }
};

module.exports = GetUrlAnalytics; // Exporting the function to be used in routes
