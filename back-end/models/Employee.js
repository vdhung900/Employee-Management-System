const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    address: { type: String },
    phone: { type: String },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    position: { type: String },
    salaryBase: { type: Number, required: true },
    currentAllowances: { type: Number, default: 0 },
    currentBonus: { type: Number, default: 0 },
    currentPenalty: { type: Number, default: 0 },
    currentTotalIncome: { type: Number },
    startDate: { type: Date, required: true },
    avatar: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
