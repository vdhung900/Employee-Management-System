const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["present", "absent", "leave"],
      required: true,
    },
    overtimeHours: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
