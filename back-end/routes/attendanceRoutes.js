const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");

// Mark attendance
router.post("/", attendanceController.markAttendance);

// Get employee attendance records
router.get("/:employeeId", attendanceController.getEmployeeAttendance);

// Generate attendance reports
router.get("/reports", attendanceController.generateReports);

// Update attendance record
router.put("/:id", attendanceController.updateAttendance);

// Delete attendance record
router.delete("/:id", attendanceController.deleteAttendance);

module.exports = router;
