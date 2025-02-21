const User = require('../../Models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
/**
 * Register a new user
 *
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const Post = async (req, res) => {
  try {
    const {email, firstName, lastName, password} = req.body;

    const user = await User.findOne({email: email});

    if (user) {
      return res.status(400).json({message: 'User already exists'});
    }

    const saltRounds = 10;
   const hashPassword = await bcrypt.hash(password, saltRounds);

    // // Generate a JSON Web Token to authenticate the user
    // const token = jwt.sign(
    //   { userId: userData.id, email: userData.email},
    //   process.env.JWT_SECRET,
    //   { expiresIn: '1h' }
    // );
    
    const userData = {
      email,
      firstName,
      lastName,
      password: hashPassword,
    };

    await User.create(userData);

    res.status(201).json({ message: 'Account Created' });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

module.exports = Post;

