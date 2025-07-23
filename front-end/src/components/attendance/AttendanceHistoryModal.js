import React, { useState, useEffect } from "react";
import {
  Modal,
  Table,
  Button,
  DatePicker,
  Select,
  Space,
  Typography,
  Row,
  Col,
  Badge,
  Statistic,
  Card,
  Spin,
  Empty,
  message,
  Tag,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  FieldTimeOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import AttendanceService from "../../services/AttendanceService";

const { Title, Text } = Typography;
const { Option } = Select;

dayjs.locale("vi");

const AttendanceHistoryModal = ({ visible, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [viewType, setViewType] = useState("month"); // 'week' or 'month'
  const [statistics, setStatistics] = useState({
    totalDays: 0,
    presentDays: 0,
    lateDays: 0,
    absentDays: 0,
    totalHours: 0,
  });

  useEffect(() => {
    if (visible) {
      fetchAttendanceData();
    }
  }, [visible, currentMonth, viewType]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      let response;

      if (viewType === "month") {
        response = await AttendanceService.getMonthlyAttendance(
          currentMonth.year(),
          currentMonth.month() + 1
        );
      } else {
        // Tuần hiện tại
        const weekStart = currentMonth.startOf("week").format("YYYY-MM-DD");
        response = await AttendanceService.getWeeklyAttendance(weekStart);
      }

      if (response.success) {
        setAttendanceData(response.data || []);
        calculateStatistics(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      message.error("Không thể tải dữ liệu điểm danh");
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (data) => {
    const stats = {
      totalDays: data.length,
      presentDays: 0,
      lateDays: 0,
      absentDays: 0,
      totalHours: 0,
    };

    data.forEach((record) => {
      if (record.firstCheckIn && record.lastCheckOut) {
        stats.presentDays++;
        if (record.isLate) {
          stats.lateDays++;
        }
        if (record.totalWorkingHours) {
          stats.totalHours += record.totalWorkingHours;
        }
      } else {
        stats.absentDays++;
      }
    });

    setStatistics(stats);
  };

  const formatTime = (dateString) => {
    if (!dateString) return "-";
    return dayjs(dateString).format("HH:mm");
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  const formatHours = (hours) => {
    if (!hours) return "-";
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h${m.toString().padStart(2, "0")}m`;
  };

  const getStatusBadge = (record) => {
    if (!record.firstCheckIn) {
      return <Badge status="error" text="Vắng mặt" />;
    }
    if (record.isLate) {
      return <Badge status="warning" text="Đi muộn" />;
    }
    return <Badge status="success" text="Đúng giờ" />;
  };

  const goToPrevious = () => {
    if (viewType === "month") {
      setCurrentMonth(currentMonth.subtract(1, "month"));
    } else {
      setCurrentMonth(currentMonth.subtract(1, "week"));
    }
  };

  const goToNext = () => {
    if (viewType === "month") {
      setCurrentMonth(currentMonth.add(1, "month"));
    } else {
      setCurrentMonth(currentMonth.add(1, "week"));
    }
  };

  const columns = [
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      render: (date) => (
        <div>
          <div>{formatDate(date)}</div>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {dayjs(date).format("dddd")}
          </Text>
        </div>
      ),
      width: 120,
    },
    {
      title: "Giờ vào",
      dataIndex: "firstCheckIn",
      key: "firstCheckIn",
      render: (time, record) => (
        <Text style={{ color: record.isLate ? "#ff4d4f" : "#52c41a" }}>
          {formatTime(time)}
        </Text>
      ),
      width: 80,
    },
    {
      title: "Giờ ra",
      dataIndex: "lastCheckOut",
      key: "lastCheckOut",
      render: formatTime,
      width: 80,
    },
    {
      title: "Tổng giờ",
      dataIndex: "totalWorkingHours",
      key: "totalWorkingHours",
      render: formatHours,
      width: 100,
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => getStatusBadge(record),
      width: 120,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (note) => note || "-",
    },
  ];

  const getTitle = () => {
    if (viewType === "month") {
      return `Lịch sử điểm danh - ${currentMonth.format("MMMM YYYY")}`;
    }
    return `Lịch sử điểm danh - Tuần ${currentMonth.format(
      "DD/MM"
    )} - ${currentMonth.endOf("week").format("DD/MM/YYYY")}`;
  };

  return (
    <Modal
      title={
        <div
          style={{
            paddingTop: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>{getTitle()}</span>
          <Space>
            <Select value={viewType} onChange={setViewType} style={{ width: 120 }}>
              <Option value="week">Tuần</Option>
              <Option value="month">Tháng</Option>
            </Select>
          </Space>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col>
            <Button icon={<LeftOutlined />} onClick={goToPrevious} size="small" />
          </Col>
          <Col flex={1} style={{ textAlign: "center" }}>
            <Title level={4} style={{ margin: 0 }}>
              {viewType === "month"
                ? currentMonth.format("MMMM YYYY")
                : `Tuần ${currentMonth.format("DD/MM")} - ${currentMonth
                    .endOf("week")
                    .format("DD/MM/YYYY")}`}
            </Title>
          </Col>
          <Col>
            <Button
              icon={<RightOutlined />}
              onClick={goToNext}
              size="small"
              disabled={currentMonth.isAfter(dayjs(), viewType)}
            />
          </Col>
        </Row>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Tổng ngày"
              value={statistics.totalDays}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Đi làm"
              value={statistics.presentDays}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Đi muộn"
              value={statistics.lateDays}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Tổng giờ"
              value={formatHours(statistics.totalHours)}
              prefix={<FieldTimeOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      <Spin spinning={loading}>
        {attendanceData.length === 0 && !loading ? (
          <Empty description="Không có dữ liệu điểm danh" />
        ) : (
          <Table
            dataSource={attendanceData}
            columns={columns}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              showQuickJumper: true,
            }}
            size="small"
          />
        )}
      </Spin>
    </Modal>
  );
};

export default AttendanceHistoryModal;
