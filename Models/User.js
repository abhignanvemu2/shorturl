const mongoose = require('mongoose');
const softDeletePlugin = require('./Plugins/SoftDelete');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  plan: {
    type: Date,
    default: null
  },
  email: {
    type: String,
    required: true
  },
  emailVerified: {
    type: Number,
    enum: [0, 1],
    default: 0, //0 -> Not Verified, 1-> Verified
    required: true
  },
  status: {
    type: Number,
    enum: [0, 1],
    default: 1 // 1 -> Active 0 -> InActive
  },
  password: {
    type: String,
    required: true
  },
  googleId: {  // Add this field for Google login
    type: String,
    default: null
  },
  avatar: {  // Optionally store the Google profile picture
    type: String,
    default: null
  },
  isDeleted: {
    type: Date,
    default: null
  }
}, {
  timestamps: { createdAt: 'createdDate', updatedAt: 'lastUpdate', deletedAt: 'isDeleted' }
});

userSchema.plugin(softDeletePlugin);

const User = mongoose.model('users', userSchema);
module.exports = User;
