const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: ["CREATE", "UPDATE", "DELETE"],
  },
  entityType: {
    type: String,
    required: true,
    enum: ["EMPLOYEE", "DEPARTMENT", "SALARY", "ATTENDANCE", "LEAVE_REQUEST"],
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  details: {
    type: Object,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
module.exports = ActivityLog;
