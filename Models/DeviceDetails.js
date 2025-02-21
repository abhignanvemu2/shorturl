const mongoose = require("mongoose");
const softDeletePlugin = require("./Plugins/SoftDelete");
const Schema = mongoose.Schema;

const DeviceDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    urlId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    accessLogId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    device: {
      type: Number,
      required: true,
      default: 1, // 1 -> Desktop 2 -> Mobile 3-> Tablet
    },
    os: {
      type: String,
      required: true,
    },
    engine: {
      type: String,
      required: true,
    },
    browser: {
      type: String,
      required: true,
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

DeviceDetailsSchema.plugin(softDeletePlugin);

const DeviceDetails = mongoose.model("deviceDetails", DeviceDetailsSchema);
module.exports = DeviceDetails;
