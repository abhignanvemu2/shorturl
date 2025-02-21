const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  firstName: { type: String }, // Make optional
  lastName: { type: String },  // Make optional
  email: { type: String, required: true, unique: true },
  avatar: { type: String },
  password: { type: String }, // Make optional since Google users don’t have passwords
  accessToken: { type: String },
  refreshToken: { type: String },
});

module.exports = mongoose.model("googleUser", UserSchema);
