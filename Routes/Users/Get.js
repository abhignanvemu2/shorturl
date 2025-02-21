const Users = require('../../Models/User');

const Get = async (req, res) => {

  try {
    const users = await Users.find();
    res.json(users);

  } catch (error) {
    res.status(500).send(error.message);
  }

}

module.exports = Get;
