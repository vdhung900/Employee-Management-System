import React, {useEffect, useState} from "react";
import {Table, Typography, Tag, Space, message} from "antd";
import {
  CoffeeOutlined,
  HeartTwoTone,
  WomanOutlined,
  ManOutlined,
  GiftOutlined,
  HomeOutlined,
  CloudOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";
import {useLoading} from "../../contexts/LoadingContext";
import LeaveBalanceService from "../../services/LeaveBalanceService";

const { Title, Text } = Typography;

// Mock data các loại ngày nghỉ
const leaveTypes = [
  {
    key: "annual",
    name: "Nghỉ phép năm",
    icon: <CoffeeOutlined style={{ color: "#faad14" }} />,
    color: "#faad14",
    total: 12,
    used: 5,
    remaining: 7,
    tag: <Tag color="gold">Phép năm</Tag>,
  },
  {
    key: "sick",
    name: "Nghỉ ốm",
    icon: <HeartTwoTone twoToneColor="#eb2f96" />,
    color: "#eb2f96",
    total: 6,
    used: 2,
    remaining: 4,
    tag: <Tag color="magenta">Ốm</Tag>,
  },
  {
    key: "maternity",
    name: "Nghỉ thai sản",
    icon: <WomanOutlined style={{ color: "#d46b08" }} />,
    color: "#d46b08",
    total: 180,
    used: 60,
    remaining: 120,
    tag: <Tag color="volcano">Thai sản</Tag>,
  },
  {
    key: "paternity",
    name: "Nghỉ vợ sinh con",
    icon: <ManOutlined style={{ color: "#1890ff" }} />,
    color: "#1890ff",
    total: 5,
    used: 1,
    remaining: 4,
    tag: <Tag color="blue">Vợ sinh</Tag>,
  },
  {
    key: "marriage",
    name: "Nghỉ cưới",
    icon: <GiftOutlined style={{ color: "#722ed1" }} />,
    color: "#722ed1",
    total: 3,
    used: 0,
    remaining: 3,
    tag: <Tag color="purple">Cưới</Tag>,
  },
  {
    key: "funeral",
    name: "Nghỉ tang",
    icon: <HomeOutlined style={{ color: "#595959" }} />,
    color: "#595959",
    total: 3,
    used: 0,
    remaining: 3,
    tag: <Tag color="gray">Tang</Tag>,
  },
  {
    key: "unpaid",
    name: "Nghỉ không lương",
    icon: <CloudOutlined style={{ color: "#bfbfbf" }} />,
    color: "#bfbfbf",
    total: 30,
    used: 0,
    remaining: 30,
    tag: <Tag color="default">Không lương</Tag>,
  },
];

const leaveTypeMeta = {
  LEAVE_REQUEST: {
    icon: <CoffeeOutlined style={{ color: "#faad14" }} />,
    color: "#faad14",
    tag: <Tag color="gold">Phép năm</Tag>,
  },
  SICK_LEAVE: {
    icon: <HeartTwoTone twoToneColor="#eb2f96" />,
    color: "#eb2f96",
    tag: <Tag color="magenta">Ốm</Tag>,
  },
  MATERNITY_LEAVE: {
    icon: <WomanOutlined style={{ color: "#d46b08" }} />,
    color: "#d46b08",
    tag: <Tag color="volcano">Thai sản</Tag>,
  },
  PATERNITY_LEAVE: {
    icon: <ManOutlined style={{ color: "#1890ff" }} />,
    color: "#1890ff",
    tag: <Tag color="blue">Vợ sinh</Tag>,
  },
  MARRIAGE_LEAVE: {
    icon: <GiftOutlined style={{ color: "#722ed1" }} />,
    color: "#722ed1",
    tag: <Tag color="purple">Cưới</Tag>,
  },
  FUNERAL_LEAVE: {
    icon: <HomeOutlined style={{ color: "#595959" }} />,
    color: "#595959",
    tag: <Tag color="gray">Tang</Tag>,
  },
  UNPAID_LEAVE: {
    icon: <CloudOutlined style={{ color: "#bfbfbf" }} />,
    color: "#bfbfbf",
    tag: <Tag color="default">Không lương</Tag>,
  },
};

const columns = [
  {
    title: "Loại ngày nghỉ",
    dataIndex: "name",
    key: "name",
    render: (text, record) => {
      const meta = leaveTypeMeta[record.leaveTypeCode] || {};
      return (
        <Space>
          <span style={{ fontSize: 22 }}>{meta.icon || <FieldTimeOutlined style={{ color: '#1976d2' }} />}</span>
          <span style={{ fontWeight: 600 }}>{text}</span>
          {meta.tag}
        </Space>
      );
    },
  },
  {
    title: "Đã dùng",
    dataIndex: "used",
    key: "used",
    render: (used, record) => {
      const meta = leaveTypeMeta[record.leaveTypeCode] || {};
      return <Text strong style={{ color: meta.color || '#1976d2' }}>{used}</Text>;
    },
    align: "center",
  },
  {
    title: "Tổng cộng",
    dataIndex: "totalAllocated",
    key: "totalAllocated",
    align: "center",
  },
  {
    title: "Còn lại",
    dataIndex: "remaining",
    key: "remaining",
    render: (remaining) => (
      <Text type="success" style={{ fontWeight: 500 }}>{remaining}</Text>
    ),
    align: "center",
  },
];

const LeaveBalance = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const {showLoading, hideLoading} = useLoading();

  useEffect(() => {
    loadLeaveBalance()
  }, []);

  const loadLeaveBalance = async () => {
    try{
      showLoading()
      const employee = JSON.parse(localStorage.getItem("employee"));
      const response = await LeaveBalanceService.getLeaveBalanceByEmpId(employee?._id);
      if(response.success){
        setLeaveTypes(response.data)
      }else{
        message.error(response.message || "Không thể tải dữ liệu ngày nghỉ");
      }
    }catch (e) {
      message.error(e.message);
    }finally {
      hideLoading()
    }
  }

  return (
    <div style={{ background: "white", minHeight: "80vh", padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <FieldTimeOutlined style={{ fontSize: 36, color: "#1976d2" }} />
        <div>
          <Title level={2} style={{ margin: 0, color: "#222", fontWeight: 600, letterSpacing: 1 }}>
            Quỹ ngày nghỉ còn lại
          </Title>
          <Text style={{ fontSize: 16, color: "#666" }}>
            Theo dõi số ngày nghỉ còn lại của bạn trong năm
          </Text>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={leaveTypes}
        rowKey="_id"
        pagination={false}
        bordered
        style={{ background: "#fff", borderRadius: 12 }}
      />
    </div>
  );
};

export default LeaveBalance;
