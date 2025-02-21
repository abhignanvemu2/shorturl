const User = require("../../Models/User");

const Update = async (req, res) => {
  try {
    const { email, firstName, lastName } = req.body;
    const { systemAdminId } = req.user;

   await User.findOneAndUpdate(
      { _id: systemAdminId },
      { email: email, firstName: firstName, lastName: lastName },
      { new: true },
      (err, result) => {
        if (err) {
          return res.status(500).send({ message: err.message });
        } else {
          return res.status(200).send({ message: "User updated successfully" });
        }
      }
    );
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = Update;
