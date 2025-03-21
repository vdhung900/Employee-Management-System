const Employee = require("../models/Employee");
const Department = require("../models/Department");
const fs = require("fs").promises;
const path = require("path");

// Tạo thư mục backups nếu chưa tồn tại
const createBackupDir = async () => {
  const backupDir = path.join(__dirname, "../backups");
  try {
    await fs.access(backupDir);
  } catch (error) {
    await fs.mkdir(backupDir);
  }
  return backupDir;
};

// Sao lưu dữ liệu
const backupData = async (req, res) => {
  try {
    const backupDir = await createBackupDir();
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupFileName = `backup-${timestamp}.json`;
    const backupPath = path.join(backupDir, backupFileName);

    // Thu thập dữ liệu từ các collection
    const employees = await Employee.find({});
    const departments = await Department.find({});

    const backupData = {
      timestamp,
      employees,
      departments,
    };

    // Ghi file backup
    await fs.writeFile(backupPath, JSON.stringify(backupData, null, 2));

    res.json({
      message: "Backup created successfully",
      backupFile: backupFileName,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating backup", error: error.message });
  }
};

// Lấy danh sách các file backup
const getBackupFiles = async (req, res) => {
  try {
    const backupDir = await createBackupDir();
    const files = await fs.readdir(backupDir);
    const backupFiles = files.filter(
      (file) => file.startsWith("backup-") && file.endsWith(".json")
    );

    const fileDetails = await Promise.all(
      backupFiles.map(async (file) => {
        const stats = await fs.stat(path.join(backupDir, file));
        return {
          filename: file,
          createdAt: stats.birthtime,
          size: stats.size,
        };
      })
    );

    res.json(fileDetails);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting backup files", error: error.message });
  }
};

// Phục hồi dữ liệu từ file backup
const restoreData = async (req, res) => {
  try {
    const { filename } = req.params;
    const backupDir = await createBackupDir();
    const backupPath = path.join(backupDir, filename);

    // Đọc file backup
    const backupContent = await fs.readFile(backupPath, "utf-8");
    const backupData = JSON.parse(backupContent);

    // Xóa dữ liệu hiện tại
    await Employee.deleteMany({});
    await Department.deleteMany({});

    // Phục hồi dữ liệu
    await Employee.insertMany(backupData.employees);
    await Department.insertMany(backupData.departments);

    res.json({ message: "Data restored successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error restoring data", error: error.message });
  }
};

// Xóa file backup
const deleteBackup = async (req, res) => {
  try {
    const { filename } = req.params;
    const backupDir = await createBackupDir();
    const backupPath = path.join(backupDir, filename);

    await fs.unlink(backupPath);
    res.json({ message: "Backup file deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting backup file", error: error.message });
  }
};

module.exports = {
  backupData,
  getBackupFiles,
  restoreData,
  deleteBackup,
};
