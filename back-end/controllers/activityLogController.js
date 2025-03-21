const ActivityLog = require("../models/ActivityLog");

// Tạo activity log mới
const createActivityLog = async (
  userId,
  action,
  entityType,
  entityId,
  description,
  details
) => {
  try {
    const log = new ActivityLog({
      userId,
      action,
      entityType,
      entityId,
      description,
      details,
    });
    await log.save();
    return log;
  } catch (error) {
    console.error("Error creating activity log:", error);
    throw error;
  }
};

// Lấy lịch sử hoạt động của một user
const getUserActivities = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const activities = await ActivityLog.find({ userId })
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("userId", "username email");

    const total = await ActivityLog.countDocuments({ userId });

    res.json({
      activities,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalItems: total,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching activity logs", error: error.message });
  }
};

// Lấy tất cả lịch sử hoạt động
const getAllActivities = async (req, res) => {
  try {
    const { page = 1, limit = 10, entityType } = req.query;

    const query = entityType ? { entityType } : {};

    const activities = await ActivityLog.find(query)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("userId", "username email");

    const total = await ActivityLog.countDocuments(query);

    res.json({
      activities,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalItems: total,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching activity logs", error: error.message });
  }
};

module.exports = {
  createActivityLog,
  getUserActivities,
  getAllActivities,
};
