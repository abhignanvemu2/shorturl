const Url = require("../../Models/Urls");

const CheckAvailability = async (req, res) => {
  try {
    const { shortUrl } = req.body;

    const findUrl = await Url.findOne({ shortUrl: shortUrl });

    if (findUrl) {
      return res.status(400).json({ message: "shortUrl Already Registered" });
    }

    return res.status(200).json({ message: "ShortUrl Available" });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

module.exports =  CheckAvailability 