const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    target: { type: String, enum: ["all"], required: true },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
