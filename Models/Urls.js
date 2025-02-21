const mongoose = require('mongoose');
const softDeletePlugin = require('./Plugins/SoftDelete');
const Schema = mongoose.Schema;

const urlSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
},
  longUrl: {
    type: String,
    required: true
  },
  alias: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: Number,
    enum: [0, 1],
    default: 1 // 1 -> Active 0 -> InActive
  },
  uniqueClicks: {
    type: Number,
    default: 0,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  topic: {
    type: Number,
    enum: [1, 2, 3],
    required: true //1-> acquisition 2-> activation 3-> retention
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt', deletedAt: 'deletedAt' }
});

urlSchema.plugin(softDeletePlugin);

const Urls = mongoose.model('Urls', urlSchema);
module.exports = Urls;
