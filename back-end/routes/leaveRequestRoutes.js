const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const leaveRequestController = require("../controllers/leaveRequestController");

// Validation middleware
const validateLeaveRequest = [
  body("employeeId").isMongoId().withMessage("ID nhân viên không hợp lệ"),
  body("type")
    .isIn(["annual", "sick", "unpaid"])
    .withMessage("Loại nghỉ phép không hợp lệ"),
  body("startDate").isISO8601().withMessage("Ngày bắt đầu không hợp lệ"),
  body("endDate").isISO8601().withMessage("Ngày kết thúc không hợp lệ"),
  body("status")
    .isIn(["pending", "approved", "rejected"])
    .withMessage("Trạng thái không hợp lệ"),
];

// Routes
router.post(
  "/",
  validateLeaveRequest,
  leaveRequestController.createLeaveRequest
);
router.get(
  "/employee/:employeeId",
  leaveRequestController.getEmployeeLeaveRequests
);
router.get("/", leaveRequestController.getAllLeaveRequests);
router.get("/:id", leaveRequestController.getLeaveRequestById);
router.put("/:id", leaveRequestController.updateLeaveRequest);
router.delete("/:id", leaveRequestController.deleteLeaveRequest);

module.exports = router;
