const Url = require("../../Models/Urls");
const AccessLogs = require("../../Models/AccessLogs");

const Compare = async (req, res) => {
  try {
    const { systemAdminId } = req.user;
    const { id } = req.params;
    const url = await Url.findOne({ _id: id, userId: systemAdminId });

    if(!url){
      return res.status(404).send({message: "Url not found"});
    }

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

    res.status(200).send({ message: "success", data: data });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

module.exports = Compare;
