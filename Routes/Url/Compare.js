
const Url = require("../../Models/Urls");
const AccessLogs = require("../../Models/AccessLogs");

const GetOne = async (req, res) => {
  try {
    const { systemAdminId } = req.user;
    const { ids } = req.body; 

    if (!ids || !ids.length) {
      return res.status(400).send({ message: "No ids provided" });
    }

    const urls = await Url.find({ _id: { $in: ids }, userId: systemAdminId });

    if (!urls.length) {
      return res.status(404).send({ message: "No URLs found" });
    }

    let aggregatedResults = [];

    for (const url of urls) {
      const accessLogs = await AccessLogs.find({ urlId: url._id }, 'referrer visit');

      const aggregatedData = accessLogs.reduce((acc, accessLog) => {
        const referrer = accessLog.referrer;
        const visit = accessLog.visit;

        if (acc[referrer]) {
          acc[referrer] += visit;
        } else {
          acc[referrer] = visit;
        }

        return acc;
      }, {});

      const data = Object.entries(aggregatedData).map(([referrer, visit]) => ({
        referrer,
        visit
      }));

      aggregatedResults.push({
        urlId: url._id,
        data: data
      });
    }

    res.status(200).send({ message: "success", results: aggregatedResults });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

module.exports = GetOne;