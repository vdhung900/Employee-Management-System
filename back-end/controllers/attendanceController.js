const Attendance = require("../models/Attendance");
const { createActivityLog } = require("./activityLogController");

// Mark attendance for an employee
exports.markAttendance = async (req, res) => {
  try {
    const { employeeId, date, status, overtimeHours } = req.body;

    // Kiểm tra xem đã có bản ghi chấm công cho ngày này chưa
    const existingAttendance = await Attendance.findOne({
      employeeId,
      date: new Date(date),
    });

    if (existingAttendance) {
      return res.status(400).json({
        message: "Đã tồn tại bản ghi chấm công cho ngày này",
      });
    }

    const attendance = new Attendance({
      employeeId,
      date,
      status,
      overtimeHours,
    });

    const savedAttendance = await attendance.save();

    console.log(savedAttendance);
    await createActivityLog(
      req.user.userId,
      "CREATE",
      "ATTENDANCE",
      savedAttendance._id.toString(),
      "Attendance created successfully",
      { attendanceData: savedAttendance }
    );

    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get attendance records for an employee
exports.getEmployeeAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const attendances = await Attendance.find({ employeeId }).sort({
      date: -1,
    });
    res.json(attendances);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Generate attendance reports
exports.generateReports = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const reports = await Attendance.find(query)
      .populate("employeeId", "fullName")
      .sort({ date: -1 });

    res.json(reports);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update attendance record
exports.updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const attendance = await Attendance.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!attendance) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy bản ghi chấm công" });
    }

    await createActivityLog(
      req.user.userId,
      "UPDATE",
      "ATTENDANCE",
      attendance._id.toString(),
      "Attendance updated successfully",
      { attendanceData: attendance }
    );

    res.json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete attendance record
exports.deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const attendance = await Attendance.findByIdAndDelete(id);

    if (!attendance) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy bản ghi chấm công" });
    }

    // await createActivityLog(
    //   req.user.userId,
    //   "DELETE",
    //   "ATTENDANCE",
    //   attendance._id,
    //   "Attendance deleted successfully",
    //   { attendanceData: attendance }
    // );

    res.json({ message: "Xóa bản ghi chấm công thành công" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
