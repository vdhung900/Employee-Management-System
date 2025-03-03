const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    salaryBase: { type: Number, required: true },
    allowances: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    penalty: { type: Number, default: 0 },
    totalIncome: { type: Number },
    paymentDate: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Salary", salarySchema);
