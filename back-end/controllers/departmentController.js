const Department = require("../models/Department");
const Employee = require("../models/Employee");
const { validationResult } = require("express-validator");

// Create a new department
exports.createDepartment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const department = new Department(req.body);
    await department.save();

    res.status(201).json({
      success: true,
      data: department,
      message: "Department created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating department",
      error: error.message,
    });
  }
};

// Get all departments
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate("employeeIds");

    res.status(200).json({
      success: true,
      data: departments,
      message: "Departments retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving departments",
      error: error.message,
    });
  }
};

// Get department by ID
exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate(
      "employeeIds"
    );

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    res.status(200).json({
      success: true,
      data: department,
      message: "Department retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving department",
      error: error.message,
    });
  }
};

// Update department
exports.updateDepartment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    res.status(200).json({
      success: true,
      data: department,
      message: "Department updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating department",
      error: error.message,
    });
  }
};

// Delete department
exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    // Update all employees in this department to remove department reference
    await Employee.updateMany(
      { departmentId: department._id },
      { $unset: { departmentId: "" } }
    );

    await department.deleteOne();

    res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting department",
      error: error.message,
    });
  }
};

// Add employee to department
exports.addEmployeeToDepartment = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const departmentId = req.params.id;

    // Check if employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // If departmentId is null, we're removing the employee from their current department
    if (!departmentId) {
      if (employee.departmentId) {
        // Remove employee from current department
        await Department.findByIdAndUpdate(employee.departmentId, {
          $pull: { employeeIds: employeeId },
        });

        // Update employee's department to null
        employee.departmentId = null;
        await employee.save();

        return res.status(200).json({
          success: true,
          message: "Employee removed from department successfully",
          data: { employee },
        });
      }
      return res.status(400).json({
        success: false,
        message: "Employee is not assigned to any department",
      });
    }

    // Check if department exists
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    // Check if employee is already in this department
    if (
      employee.departmentId &&
      employee.departmentId.toString() === departmentId
    ) {
      return res.status(400).json({
        success: false,
        message: "Employee is already in this department",
      });
    }

    // If employee is in another department, remove from that department
    if (employee.departmentId) {
      await Department.findByIdAndUpdate(employee.departmentId, {
        $pull: { employeeIds: employeeId },
      });
    }

    // Add employee to department
    if (!department.employeeIds.includes(employeeId)) {
      department.employeeIds.push(employeeId);
      await department.save();
    }

    // Update employee's department
    employee.departmentId = departmentId;
    await employee.save();

    res.status(200).json({
      success: true,
      message: "Employee added to department successfully",
      data: {
        department: await department.populate("employeeIds"),
        employee,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error managing employee department assignment",
      error: error.message,
    });
  }
};

// Remove employee from department
exports.removeEmployeeFromDepartment = async (req, res) => {
  try {
    const { employeeId } = req.body;

    // Check if employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Check if employee is in a department
    if (!employee.departmentId) {
      return res.status(400).json({
        success: false,
        message: "Employee is not assigned to any department",
      });
    }

    // Get current department
    const department = await Department.findById(employee.departmentId);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    // Remove employee from department's employeeIds array
    department.employeeIds = department.employeeIds.filter(
      (id) => id.toString() !== employeeId
    );
    await department.save();

    // Remove department reference from employee
    employee.departmentId = null;
    await employee.save();

    res.status(200).json({
      success: true,
      message: "Employee removed from department successfully",
      data: { employee },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error removing employee from department",
      error: error.message,
    });
  }
};
