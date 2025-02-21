const Url = require("../Models/Urls");
const AccessLogs = require("../Models/AccessLogs");
const { getLocationDataFromRequest, getDomainName } = require("../Lib/Request");
const DeviceDetails = require("../Models/DeviceDetails");

const RedirectUrl = async (req, res) => {
  try {
    const shortUrl = req.params.shortUrl;
    const deviceDetails = req.deviceDetails;
    const referrer = req.get("referer") ? getDomainName(req.get("referer")) : "Direct";
    const { accessedBy, location } = await getLocationDataFromRequest(req);
    const result = await Url.findOne({ alias: shortUrl });
    if (!result) return res.status(404).json({ message: "Url not found" });

    result.clicks += 1;
    await result.save();
    
    const existingAccessLog = await AccessLogs.findOne({ urlId: result._id, accessedBy: accessedBy });
    if(existingAccessLog){
      existingAccessLog.visit += 1;
      existingAccessLog.save();
    }
    
    if (!existingAccessLog) {
      result.uniqueClicks += 1;
      await result.save();
      const accessLog = await AccessLogs.create({
        userId: result.userId,
        urlId: result._id,
        accessedBy,
        city: location?.city,
        region: location?.region,
        country: location?.country,
        latitude: location?.latitude,
        longitude: location?.longitude,
        referrer,
        visit: 1,
      });

      const getDeviceType = (type) => (type === "tablet" ? 3 : type === "mobile" ? 2 : 1);

      await DeviceDetails.create({
        userId: result.userId,
        urlId: result._id,
        accessLogId: accessLog._id,
        os: deviceDetails.os.name ?? "unknown",
        device: getDeviceType(deviceDetails.device.type),
        engine: deviceDetails.engine.name ?? "unknown",
        browser: deviceDetails.browser.name ?? "unknown",
      });
    }
    return res.redirect(result.longUrl);
  } catch (error) {
    console.error("Error in RedirectUrl:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = RedirectUrl;
