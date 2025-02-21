const mongoose = require("mongoose");
const softDeletePlugin = require("./Plugins/SoftDelete");
const Schema = mongoose.Schema;

const accessLogSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
    },
    urlId: {
      type: Schema.Types.ObjectId,
    },
    referrer:{
      type: String,
      default: null,
    },
    accessedBy: {
      type: String,
      default: null,
    },
    visit: {
      type: Number,
      default: 1,
    },
    city: {
      type: String,
      default: null,
    },
    region: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

accessLogSchema.plugin(softDeletePlugin);

const AccessLogs = mongoose.model("accessLogs", accessLogSchema);
module.exports = AccessLogs;
