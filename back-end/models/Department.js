const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    employeeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", departmentSchema);
