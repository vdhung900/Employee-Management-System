import { Badge, Empty, Spin, Table, Typography } from "antd";
import dayjs from "dayjs";

const AttendanceTable = ({
  loading,
  attendanceData,
  showPagination = true,
  showNoteColumn = true,
}) => {
  const { Text } = Typography;

  const formatTime = (dateString) => {
    if (!dateString) return "-";
    return dayjs(dateString).format("HH:mm");
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).format("DD/MM/YYYY");
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

  const formatHours = (hours) => {
    if (!hours) return "-";
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h${m.toString().padStart(2, "0")}m`;
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
        <Text style={{ color: record.isLate ? "#ff4d4f" : "#52c41a" }}>{formatTime(time)}</Text>
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
      hidden: !showNoteColumn, //In props
      render: (note) => note || "-",
    },
  ];

  return (
    <Spin spinning={loading}>
      {attendanceData.length === 0 && !loading ? (
        <Empty description="Không có dữ liệu điểm danh" />
      ) : (
        <Table
          dataSource={attendanceData}
          columns={columns}
          rowKey="_id"
          pagination={
            showPagination //In props
              ? {
                  showSizeChanger: showPagination,
                  showQuickJumper: true,
                }
              : false
          }
          size="small"
        />
      )}
    </Spin>
  );
};

export default AttendanceTable;
