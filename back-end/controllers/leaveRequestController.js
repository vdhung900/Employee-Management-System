const LeaveRequest = require("../models/LeaveRequest");
const Employee = require("../models/Employee");
const { validationResult } = require("express-validator");

// Tạo yêu cầu nghỉ phép mới
exports.createLeaveRequest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Kiểm tra nhân viên có tồn tại không
    const employee = await Employee.findById(req.body.employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy nhân viên",
      });
    }

    const leaveRequest = new LeaveRequest({
      ...req.body,
      status: "pending", // Mặc định là pending khi tạo mới
    });
    const savedLeaveRequest = await leaveRequest.save();
    await createActivityLog(
      req.user.userId,
      "CREATE",
      "LEAVE_REQUEST",
      savedLeaveRequest._id,
      "Leave request created successfully",
      { leaveRequestData: savedLeaveRequest }
    );

    res.status(201).json({
      success: true,
      data: leaveRequest,
      message: "Yêu cầu nghỉ phép được tạo thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo yêu cầu nghỉ phép",
      error: error.message,
    });
  }
};

// Lấy danh sách yêu cầu nghỉ phép của nhân viên
exports.getEmployeeLeaveRequests = async (req, res) => {
  try {
    // Kiểm tra nhân viên có tồn tại không
    const employee = await Employee.findById(req.params.employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy nhân viên",
      });
    }

    const leaveRequests = await LeaveRequest.find({
      employeeId: req.params.employeeId,
    })
      .populate("employeeId", "fullName departmentId position")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: leaveRequests,
      message: "Lấy danh sách yêu cầu nghỉ phép thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách yêu cầu nghỉ phép",
      error: error.message,
    });
  }
};

// Lấy thông tin chi tiết yêu cầu nghỉ phép
exports.getLeaveRequestById = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id).populate(
      "employeeId",
      "fullName departmentId position"
    );

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy yêu cầu nghỉ phép",
      });
    }

    res.status(200).json({
      success: true,
      data: leaveRequest,
      message: "Lấy thông tin yêu cầu nghỉ phép thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin yêu cầu nghỉ phép",
      error: error.message,
    });
  }
};

// Cập nhật yêu cầu nghỉ phép
exports.updateLeaveRequest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Kiểm tra yêu cầu nghỉ phép có tồn tại không
    const existingRequest = await LeaveRequest.findById(req.params.id);
    if (!existingRequest) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy yêu cầu nghỉ phép",
      });
    }

    // Nếu đang cập nhật trạng thái
    if (req.body.status && req.body.status !== existingRequest.status) {
      // Nếu chuyển sang trạng thái approved
      if (req.body.status === "approved") {
        // Kiểm tra số ngày nghỉ còn lại
        if (existingRequest.remainingDays <= 0) {
          return res.status(400).json({
            success: false,
            message: "Số ngày nghỉ còn lại không đủ",
          });
        }
      }
    }

    const leaveRequest = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("employeeId", "fullName departmentId position");

    res.status(200).json({
      success: true,
      data: leaveRequest,
      message: "Cập nhật yêu cầu nghỉ phép thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật yêu cầu nghỉ phép",
      error: error.message,
    });
  }
};

// Xóa yêu cầu nghỉ phép
exports.deleteLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id);

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy yêu cầu nghỉ phép",
      });
    }

    // Chỉ cho phép xóa yêu cầu ở trạng thái pending
    if (leaveRequest.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Chỉ có thể xóa yêu cầu nghỉ phép ở trạng thái chờ duyệt",
      });
    }

    await leaveRequest.deleteOne();

    await createActivityLog(
      req.user.userId,
      "DELETE",
      "LEAVE_REQUEST",
      leaveRequest._id,
      "Leave request deleted successfully",
      { leaveRequestData: leaveRequest }
    );

    res.status(200).json({
      success: true,
      message: "Xóa yêu cầu nghỉ phép thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa yêu cầu nghỉ phép",
      error: error.message,
    });
  }
};
