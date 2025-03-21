const Salary = require("../models/Salary");

// Tính tổng thu nhập
totalIncome = (salaryBase, allowances, bonus, penalty) => {
  const base = Number(salaryBase) || 0;
  const allow = Number(allowances) || 0;
  const bon = Number(bonus) || 0;
  const pen = Number(penalty) || 0;
  return base + allow + bon - pen;
};

// Lấy bản ghi lương theo ID
exports.getSalaryById = async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id).populate({
      path: "employeeId",
      select: "fullName departmentId",
      populate: {
        path: "departmentId",
        select: "name",
      },
    });

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bản ghi lương",
      });
    }

    res.json({
      success: true,
      data: salary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Lấy tất cả bản ghi lương
exports.getAllSalaries = async (req, res) => {
  try {
    const salaries = await Salary.find().populate({
      path: "employeeId",
      select: "fullName departmentId",
      populate: {
        path: "departmentId",
        select: "name",
      },
    });

    // Lọc bỏ các bản ghi không có thông tin nhân viên
    const validSalaries = salaries.filter((salary) => salary.employeeId);

    res.json({
      success: true,
      data: validSalaries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Thêm mới bản ghi lương
exports.addSalary = async (req, res) => {
  try {
    const { employeeId, salaryBase, allowances, bonus, penalty, paymentDate } =
      req.body;
    const total = totalIncome(salaryBase, allowances, bonus, penalty);

    const salary = new Salary({
      employeeId,
      salaryBase: Number(salaryBase) || 0,
      allowances: Number(allowances) || 0,
      bonus: Number(bonus) || 0,
      penalty: Number(penalty) || 0,
      totalIncome: total,
      paymentDate,
    });

    const savedSalary = await salary.save();
    await createActivityLog(
      req.user.userId,
      "CREATE",
      "SALARY",
      savedSalary._id,
      "Salary created successfully",
      { salaryData: savedSalary }
    );

    res.status(201).json(savedSalary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy bản ghi lương theo employeeId
exports.getSalaryByEmployeeId = async (req, res) => {
  try {
    const salary = await Salary.findOne({ employeeId: req.params.employeeId });
    if (!salary) return res.status(404).json({ message: "Salary not found" });
    res.json(salary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật bản ghi lương
exports.updateSalary = async (req, res) => {
  try {
    const { salaryBase, allowances, bonus, penalty, paymentDate } = req.body;
    const total = totalIncome(salaryBase, allowances, bonus, penalty);

    const salary = await Salary.findByIdAndUpdate(
      req.params.id,
      {
        salaryBase,
        allowances,
        bonus,
        penalty,
        totalIncome: total,
        paymentDate,
      },
      { new: true }
    ).populate({
      path: "employeeId",
      select: "fullName departmentId",
      populate: {
        path: "departmentId",
        select: "name",
      },
    });

    await createActivityLog(
      req.user.userId,
      "UPDATE",
      "SALARY",
      salary._id,
      "Salary updated successfully",
      { salaryData: salary }
    );

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bản ghi lương",
      });
    }

    res.json({
      success: true,
      data: salary,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa bản ghi lương
exports.deleteSalary = async (req, res) => {
  try {
    const salary = await Salary.findByIdAndDelete(req.params.id);
    if (!salary) return res.status(404).json({ message: "Salary not found" });

    await createActivityLog(
      req.user.userId,
      "DELETE",
      "SALARY",
      salary._id,
      "Salary deleted successfully"
    );
    res.json({ message: "Salary deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
