const bcrypt = require('bcrypt');
const { container } = require('../../Config/Db');

const GetOne = async (req, res) => {
  try {
  
    res.json("its working");
  } catch (error) {
    res.status(500).send(error.message);
  }
}

module.exports = GetOne;
