import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Typography,
  Calendar,
  Badge,
  Statistic,
  Timeline,
  Button,
  Card,
  Space,
  Tooltip,
  message,
  Modal,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  FieldTimeOutlined,
  CoffeeOutlined,
  BellOutlined,
  UserOutlined,
  TeamOutlined,
  LogoutOutlined,
  LoginOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import ThreeDCard from "../../components/3d/ThreeDCard";
import ThreeDButton from "../../components/3d/ThreeDButton";
import ThreeDStatCard from "../../components/3d/ThreeDStatCard";
import ThreeDContainer from "../../components/3d/ThreeDContainer";
import AttendanceHistoryModal from "../../components/attendance/AttendanceHistoryModal";
import { getCurrentUser } from "../../utils/auth";
import AttendanceService from "../../services/AttendanceService";

const { Title, Text } = Typography;

const EmployeeDashboard = () => {
  const [currentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [weeklyAttendance, setWeeklyAttendance] = useState([]);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const user = getCurrentUser();

  useEffect(() => {
    fetchTodayAttendance();
    fetchWeeklyAttendance();
  }, []);

  // Lấy thông tin điểm danh hôm nay
  const fetchTodayAttendance = async () => {
    try {
      setLoading(true);
      const response = await AttendanceService.getTodayAttendance();
      if (response.success && response.data) {
        setTodayAttendance(response.data);
        setIsCheckedIn(true);
      } else {
        setIsCheckedIn(false);
        setTodayAttendance(null);
      }
    } catch (error) {
      console.log("Chưa điểm danh hôm nay");
      setIsCheckedIn(false);
      setTodayAttendance(null);
    } finally {
      setLoading(false);
    }
  };

  // Lấy dữ liệu điểm danh tuần hiện tại
  const fetchWeeklyAttendance = async () => {
    try {
      const response = await AttendanceService.getWeeklyAttendance();

      if (!response.success) {
        console.log(" getWeeklyAttendance failed");
        return;
      }

      const attendances = response.data;

      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Chủ nhật

      // const endOfWeek = new Date(startOfWeek);
      // endOfWeek.setDate(startOfWeek.getDate() + 6); // Thứ 7

      //Not Saturday & Sunday
      const weeklyAttendance = [];
      for (let i = 1; i < 6; i++) {
        const tmpDate = new Date();
        tmpDate.setDate(startOfWeek.getDate() + i);
        const tmpDateString = tmpDate.toISOString();

        const record = attendances.find(
          (a) => a.date.slice(0, 10) === tmpDateString.slice(0, 10)
        );

        weeklyAttendance.push(
          record
            ? record
            : {
                date: tmpDateString,
              }
        );
      }

      setWeeklyAttendance(weeklyAttendance);
    } catch (error) {
      console.log("Không thể tải dữ liệu tuần hiện tại");
    }
  };

  // Xử lý check-in
  const handleCheckIn = async () => {
    try {
      setLoading(true);
      const response = await AttendanceService.checkIn();
      if (response.success) {
        message.success("Điểm danh thành công!");
        await fetchTodayAttendance();
      }
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi điểm danh");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý check-out với modal xác nhận
  const handleCheckOut = () => {
    Modal.confirm({
      title: "Xác nhận check-out",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn có chắc chắn muốn checkout không?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          setLoading(true);
          const response = await AttendanceService.checkOut();
          if (response.success) {
            message.success("Check-out thành công!");
            await fetchTodayAttendance();
          }
        } catch (error) {
          message.error(error.message || "Có lỗi xảy ra khi check-out");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Format thời gian
  const formatTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  //Kiểm tra ngày tương lai
  const isFutureDate = (dateString) => {
    const now = new Date();
    return dateString.slice(0, 10) > now.toISOString().slice(0, 10);
  };

  // Tính giờ dự kiến check-out (8 tiếng sau check-in)
  const getExpectedCheckOut = () => {
    if (!todayAttendance?.firstCheckIn) return "-";
    const checkInTime = new Date(todayAttendance.firstCheckIn);
    const expectedCheckOut = new Date(
      checkInTime.getTime() + 8 * 60 * 60 * 1000
    );
    return expectedCheckOut.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Mock data for employee stats
  const stats = [
    {
      title: "Số ngày đi làm",
      value: 22,
      suffix: "/23",
      icon: <CheckCircleOutlined />,
      color: "#52c41a",
    },
    {
      title: "Đi làm muộn",
      value: 2,
      suffix: " lần",
      icon: <ClockCircleOutlined />,
      color: "#faad14",
    },
    {
      title: "Nghỉ phép",
      value: 1,
      suffix: "/3",
      icon: <CoffeeOutlined />,
      color: "#1890ff",
    },
    {
      title: "Tổng giờ làm",
      value: 176,
      suffix: "h",
      icon: <FieldTimeOutlined />,
      color: "#722ed1",
    },
  ];

  // Mock data for calendar
  const getListData = (value) => {
    const day = value.date();
    const month = value.month();

    // Giả lập dữ liệu cho tháng hiện tại
    if (month === currentDate.getMonth()) {
      if (day === 1) {
        return [{ type: "success", content: "Đi làm đúng giờ" }];
      }
      if (day === 5) {
        return [{ type: "warning", content: "Đi làm muộn 15 phút" }];
      }
      if (day === 12) {
        return [{ type: "error", content: "Nghỉ phép" }];
      }
      if (day === 18) {
        return [{ type: "warning", content: "Đi làm muộn 10 phút" }];
      }
      if (
        day < currentDate.getDate() &&
        ![1, 5, 12, 18].includes(day) &&
        ![0, 6].includes(value.day())
      ) {
        return [{ type: "success", content: "Đi làm đúng giờ" }];
      }
    }
    return [];
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {listData.map((item, index) => (
          <li key={index}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  // Mock shift schedule
  const shifts = [
    { day: "Thứ 2", hours: "08:00 - 17:00", type: "Ca hành chính" },
    { day: "Thứ 3", hours: "08:00 - 17:00", type: "Ca hành chính" },
    { day: "Thứ 4", hours: "08:00 - 17:00", type: "Ca hành chính" },
    { day: "Thứ 5", hours: "08:00 - 17:00", type: "Ca hành chính" },
    { day: "Thứ 6", hours: "08:00 - 17:00", type: "Ca hành chính" },
    { day: "Thứ 7", hours: "-", type: "Nghỉ" },
    { day: "Chủ nhật", hours: "-", type: "Nghỉ" },
  ];

  // Thông báo công việc
  const notifications = [
    {
      time: "10:00",
      content: "Cuộc họp báo cáo tiến độ dự án A",
      color: "#1890ff",
    },
    { time: "14:30", content: "Đào tạo nhân viên mới", color: "#52c41a" },
    { time: "16:00", content: "Deadline nộp báo cáo tuần", color: "#ff4d4f" },
  ];

  return (
    <ThreeDContainer>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <div
            className="welcome-section glass-effect"
            style={{
              padding: "24px",
              marginBottom: "24px",
              borderRadius: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
              background:
                "linear-gradient(135deg, rgba(24, 144, 255, 0.1), rgba(24, 144, 255, 0.05))",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(24, 144, 255, 0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "24px 0",
              }}
            >
              <UserOutlined
                style={{ fontSize: 32, color: "#1890ff", marginRight: 12 }}
              />
              <Title level={3} style={{ margin: 0, fontWeight: "700" }}>
                <span className="blue-gradient-text">
                  Chào, {user?.name || "Nhân viên"}!
                </span>
              </Title>
            </div>
            <Text style={{ fontSize: "16px", color: "rgba(0, 0, 0, 0.65)" }}>
              Hôm nay:{" "}
              {currentDate.toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
            <ThreeDButton
              type="primary"
              icon={<FieldTimeOutlined />}
              className="btn-blue-theme"
              loading={loading}
              onClick={
                !isCheckedIn
                  ? handleCheckIn
                  : !todayAttendance?.lastCheckOut
                  ? handleCheckOut
                  : undefined
              }
              disabled={todayAttendance?.lastCheckOut}
            >
              {!isCheckedIn
                ? "Check-in"
                : !todayAttendance?.lastCheckOut
                ? "Check-out"
                : "Hoàn thành"}
            </ThreeDButton>
          </div>
        </Col>

        {/* Stats Cards */}
        {stats.map((stat, index) => (
          <Col key={index} xs={24} sm={12} lg={6}>
            <ThreeDStatCard
              title={stat.title}
              value={stat.value}
              suffix={stat.suffix}
              icon={stat.icon}
              color={stat.color}
              style={{ borderTop: `3px solid ${stat.color}` }}
            />
          </Col>
        ))}

        {/* Check-in Card */}
        <Col xs={24} lg={8}>
          <ThreeDCard title="Điểm danh hôm nay" className="card-blue-theme">
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <Statistic
                title="Trạng thái hiện tại"
                value={
                  isCheckedIn
                    ? todayAttendance?.lastCheckOut
                      ? "Đã check-out"
                      : "Đã check-in"
                    : "Chưa điểm danh"
                }
                valueStyle={{
                  color: isCheckedIn
                    ? todayAttendance?.lastCheckOut
                      ? "#722ed1"
                      : "#52c41a"
                    : "#ff4d4f",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
                prefix={
                  isCheckedIn ? (
                    todayAttendance?.lastCheckOut ? (
                      <LogoutOutlined />
                    ) : (
                      <CheckCircleOutlined />
                    )
                  ) : (
                    <ClockCircleOutlined />
                  )
                }
              />
              <div style={{ margin: "24px 0" }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic
                      title="Giờ vào"
                      value={formatTime(todayAttendance?.firstCheckIn)}
                      valueStyle={{ color: "#1890ff" }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title={
                        todayAttendance?.lastCheckOut
                          ? "Giờ ra"
                          : "Giờ ra (dự kiến)"
                      }
                      value={
                        todayAttendance?.lastCheckOut
                          ? formatTime(todayAttendance.lastCheckOut)
                          : getExpectedCheckOut()
                      }
                      valueStyle={{ color: "#ff4d4f" }}
                    />
                  </Col>
                </Row>
              </div>
              <Space>
                {!isCheckedIn ? (
                  <ThreeDButton
                    type="primary"
                    icon={<LoginOutlined />}
                    className="btn-blue-theme"
                    loading={loading}
                    onClick={handleCheckIn}
                  >
                    Check-in
                  </ThreeDButton>
                ) : !todayAttendance?.lastCheckOut ? (
                  <ThreeDButton
                    type="primary"
                    icon={<LogoutOutlined />}
                    className="btn-blue-theme"
                    loading={loading}
                    onClick={handleCheckOut}
                  >
                    Check-out
                  </ThreeDButton>
                ) : (
                  <ThreeDButton
                    type="default"
                    icon={<CheckCircleOutlined />}
                    disabled
                  >
                    Hoàn thành
                  </ThreeDButton>
                )}
                {/*<ThreeDButton icon={<CoffeeOutlined />}>Đăng ký nghỉ phép</ThreeDButton>*/}
              </Space>
            </div>
          </ThreeDCard>
        </Col>

        {/* Shift Schedule Card */}
        <Col xs={24} lg={16}>
          <ThreeDCard
            title="Lịch làm việc tuần này"
            extra={<CalendarOutlined style={{ color: "#1890ff" }} />}
            className="card-blue-theme"
          >
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        padding: "12px 8px",
                        borderBottom: "1px solid #f0f0f0",
                        textAlign: "left",
                      }}
                    >
                      Ngày
                    </th>
                    <th
                      style={{
                        padding: "12px 8px",
                        borderBottom: "1px solid #f0f0f0",
                        textAlign: "left",
                      }}
                    >
                      Giờ làm
                    </th>
                    <th
                      style={{
                        padding: "12px 8px",
                        borderBottom: "1px solid #f0f0f0",
                        textAlign: "left",
                      }}
                    >
                      Loại ca
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shifts.map((shift, index) => (
                    <tr key={index}>
                      <td
                        style={{
                          padding: "12px 8px",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        {shift.day}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          borderBottom: "1px solid #f0f0f0",
                          color: shift.hours === "-" ? "#bfbfbf" : "inherit",
                        }}
                      >
                        {shift.hours}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        {shift.type === "Nghỉ" ? (
                          <Badge status="default" text="Nghỉ" />
                        ) : (
                          <Badge status="processing" text={shift.type} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ThreeDCard>
        </Col>

        {/* Attendance History */}
        <Col xs={24} lg={12}>
          <ThreeDCard
            title="Lịch sử điểm danh - Tuần hiện tại"
            extra={
              <Space>
                <CalendarOutlined style={{ color: "#1890ff" }} />
                <ThreeDButton
                  type="link"
                  style={{ color: "#1890ff" }}
                  onClick={() => setHistoryModalVisible(true)}
                >
                  Xem tất cả
                </ThreeDButton>
              </Space>
            }
            className="card-blue-theme"
          >
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        padding: "12px 8px",
                        borderBottom: "1px solid #f0f0f0",
                        textAlign: "left",
                      }}
                    >
                      Ngày
                    </th>
                    <th
                      style={{
                        padding: "12px 8px",
                        borderBottom: "1px solid #f0f0f0",
                        textAlign: "left",
                      }}
                    >
                      Check-in
                    </th>
                    <th
                      style={{
                        padding: "12px 8px",
                        borderBottom: "1px solid #f0f0f0",
                        textAlign: "left",
                      }}
                    >
                      Check-out
                    </th>
                    <th
                      style={{
                        padding: "12px 8px",
                        borderBottom: "1px solid #f0f0f0",
                        textAlign: "left",
                      }}
                    >
                      Tổng giờ
                    </th>
                    <th
                      style={{
                        padding: "12px 8px",
                        borderBottom: "1px solid #f0f0f0",
                        textAlign: "left",
                      }}
                    >
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyAttendance.length > 0 ? (
                    weeklyAttendance.map((record, index) => (
                      <tr key={index}>
                        <td
                          style={{
                            padding: "12px 8px",
                            borderBottom: "1px solid #f0f0f0",
                          }}
                        >
                          {new Date(record.date).toLocaleDateString("vi-VN")}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            borderBottom: "1px solid #f0f0f0",
                            color: !record.firstCheckIn
                              ? "#bfbfbf"
                              : record.isLate
                              ? "#ff4d4f"
                              : "#52c41a",
                          }}
                        >
                          {record.firstCheckIn
                            ? new Date(record.firstCheckIn).toLocaleTimeString(
                                "vi-VN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : "-"}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            borderBottom: "1px solid #f0f0f0",
                            color: !record.lastCheckOut ? "#bfbfbf" : "inherit",
                          }}
                        >
                          {record.lastCheckOut
                            ? new Date(record.lastCheckOut).toLocaleTimeString(
                                "vi-VN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : "-"}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            borderBottom: "1px solid #f0f0f0",
                            color: !record.totalWorkingHours
                              ? "#bfbfbf"
                              : "inherit",
                          }}
                        >
                          {record.totalWorkingHours
                            ? `${Math.floor(
                                record.totalWorkingHours
                              )}h${Math.round(
                                (record.totalWorkingHours % 1) * 60
                              )
                                .toString()
                                .padStart(2, "0")}m`
                            : "-"}
                        </td>
                        <td
                          style={{
                            padding: "12px 8px",
                            borderBottom: "1px solid #f0f0f0",
                          }}
                        >
                          {isFutureDate(record.date) ? (
                            <Badge status="default" text="Tương lai" />
                          ) : !record.firstCheckIn ? (
                            <Badge status="error" text="Vắng mặt" />
                          ) : record.isLate ? (
                            <Badge status="warning" text="Đi muộn" />
                          ) : (
                            <Badge status="success" text="Đúng giờ" />
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        style={{
                          padding: "20px",
                          textAlign: "center",
                          color: "#bfbfbf",
                        }}
                      >
                        Chưa có dữ liệu điểm danh tuần này
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </ThreeDCard>
        </Col>

        {/* Notifications */}
        <Col xs={24} lg={12}>
          <ThreeDCard
            title="Lịch trình hôm nay"
            extra={<BellOutlined style={{ color: "#1890ff" }} />}
            className="card-blue-theme"
          >
            <Timeline
              mode="left"
              items={notifications.map((item) => ({
                color: item.color,
                label: item.time,
                children: item.content,
              }))}
            />
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <ThreeDButton
                type="primary"
                icon={<TeamOutlined />}
                className="btn-blue-theme"
              >
                Xem lịch phòng ban
              </ThreeDButton>
            </div>
          </ThreeDCard>
        </Col>
      </Row>

      {/* Attendance History Modal */}
      <AttendanceHistoryModal
        visible={historyModalVisible}
        onClose={() => setHistoryModalVisible(false)}
      />
    </ThreeDContainer>
  );
};

export default EmployeeDashboard;
