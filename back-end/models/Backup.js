const mongoose = require("mongoose");

const backupSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Backup", backupSchema);
