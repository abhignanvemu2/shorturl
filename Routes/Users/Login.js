const User = require('../../Models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Handles user login
 *
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Promise<void>}
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ message: 'Invalid Email or password' });
  }

  // Check if password is valid
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid Email or password' });
  }

  // Generate authentication token
  const token = jwt.sign(
    { systemAdminId: user._id, email: user.email},
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  // Set authentication cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    maxAge: 3600000,
    sameSite: 'Strict',
  });

  // Return success response
  res.status(200).json({ message: 'Login successful', token: token });
};

/**
 * Exports the login function
 *
 * @type {Function}
 */
module.exports = login;

