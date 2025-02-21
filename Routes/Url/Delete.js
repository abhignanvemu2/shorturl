const Url = require("../../Models/Urls");

const Delete = async (req, res) => {
  const { id } = req.query;
  const { systemAdminId } = req.user;
  try {
    if (!id) {
      return res.status(400).json({ message: "Url id is required" });
    }
    await Url.findOneAndUpdate(
      { _id: id, userId: systemAdminId },
      { isDeleted: new Date() }
    );
    return res.status(200).json({ message: "Url deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = Delete;
