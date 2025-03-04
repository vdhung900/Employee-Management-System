const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "employee"], required: true },
    //comment for testing register and login and protected route, remove later
    // employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
