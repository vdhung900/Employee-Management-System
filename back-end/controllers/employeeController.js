const Employee = require("../models/Employee");
const Department = require("../models/Department");
const { validationResult } = require("express-validator");
const { createActivityLog } = require("./activityLogController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Cấu hình multer để lưu file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Tạo thư mục uploads trong backend
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload an image."), false);
    }
  },
}).single("avatar");

// Create a new employee
exports.createEmployee = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      const employeeData = req.body;
      if (req.file) {
        employeeData.avatar = `uploads/${req.file.filename}`;
      }

      const employee = new Employee(employeeData);
      const savedEmployee = await employee.save();

      await createActivityLog(
        req.user.userId,
        "CREATE",
        "EMPLOYEE",
        savedEmployee._id,
        "Employee created successfully",
        { employeeData: savedEmployee }
      );

      res.status(201).json({
        success: true,
        data: employee,
        message: "Employee created successfully",
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating employee",
      error: error.message,
    });
  }
};

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate("departmentId");

    res.status(200).json({
      success: true,
      data: employees,
      message: "Employees retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving employees",
      error: error.message,
    });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate(
      "departmentId"
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
      message: "Employee retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving employee",
      error: error.message,
    });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      // Tìm employee hiện tại
      const currentEmployee = await Employee.findById(req.params.id);
      if (!currentEmployee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }

      // Chuẩn bị dữ liệu cập nhật
      const updateData = {
        ...req.body,
        salaryBase: Number(req.body.salaryBase),
        currentAllowances: Number(req.body.currentAllowances || 0),
        currentBonus: Number(req.body.currentBonus || 0),
        currentPenalty: Number(req.body.currentPenalty || 0),
      };

      // Nếu có file ảnh mới được upload
      if (req.file) {
        // Xóa file ảnh cũ nếu tồn tại
        if (currentEmployee.avatar) {
          const oldAvatarPath = path.join(
            __dirname,
            "..",
            currentEmployee.avatar
          );
          if (fs.existsSync(oldAvatarPath)) {
            fs.unlinkSync(oldAvatarPath);
          }
        }
        updateData.avatar = `uploads/${req.file.filename}`;
      }

      // Cập nhật employee
      const updatedEmployee = await Employee.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      ).populate("departmentId");

      await createActivityLog(
        req.user.userId,
        "UPDATE",
        "EMPLOYEE",
        updatedEmployee._id,
        "Employee updated successfully",
        { employeeData: updatedEmployee }
      );

      res.status(200).json({
        success: true,
        data: updatedEmployee,
        message: "Employee updated successfully",
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating employee",
      error: error.message,
    });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    await createActivityLog(
      req.user.userId,
      "DELETE",
      "EMPLOYEE",
      employee._id,
      "Employee deleted successfully",
      { employeeData: employee }
    );

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting employee",
      error: error.message,
    });
  }
};
