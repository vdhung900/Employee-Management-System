import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Spin,
  message,
  Avatar,
  Tag,
  Modal,
  Table,
  Space,
  Row,
  Col,
  Divider,
  Button,
} from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
  IdcardOutlined,
  BankOutlined,
  BarChartOutlined,
  UserAddOutlined,
  EyeOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import StatisticsService from "../../services/StatisticsService";
import moment from 'moment';
import EmployeeProfile from "../../services/EmployeeProfile";

const { Title, Text } = Typography;

const COLORS = ["#1890ff", "#52c41a", "#faad14", "#eb2f96", "#722ed1", "#13c2c2", "#f5222d", "#fa541c"];

const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'success';
    case 'inactive': return 'error';
    case 'leave': return 'warning';
    default: return 'default';
  }
};
const getStatusLabel = (status) => {
  switch (status) {
    case 'active': return 'Đang làm việc';
    case 'inactive': return 'Nghỉ việc';
    case 'leave': return 'Nghỉ phép';
    default: return 'Không xác định';
  }
};

const TeamManagement = () => {
    const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);

    useEffect(() => {
    const fetchTeamMembers = async () => {
        setLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await EmployeeProfile.getEmployeeProfile(user.employeeId);
        const departmentId = response.data?.departmentId?._id;
        setDepartmentName(response.data?.departmentId?.name || "");
        if (!departmentId) {
          message.error("Không tìm thấy phòng ban của bạn!");
            setLoading(false);
          return;
        }
        const res = await StatisticsService.getEmployeesByDepartment(departmentId);
        setMembers(res.data || []);
      } catch (err) {
        message.error("Lỗi khi lấy danh sách thành viên đội nhóm");
      }
      setLoading(false);
    };
    fetchTeamMembers();
  }, []);

    const columns = [
        {
      title: 'Nhân viên',
      dataIndex: 'fullName',
      key: 'fullName',
            render: (text, record) => (
                <Space>
          <Avatar style={{ backgroundColor: '#722ed1' }}>{record.fullName.charAt(0)}</Avatar>
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.fullName}</div>
            <Text type="secondary">{record.code}</Text>
          </div>
                </Space>
            ),
        },
        {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => <span><MailOutlined /> {text}</span>,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => <span><PhoneOutlined /> {text}</span>,
    },
    {
      title: 'Vị trí',
      dataIndex: 'positionId',
      key: 'positionId',
      render: (pos, record) => record.positionId?.name || record.position || 'Chưa rõ',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                        <Button
                            type="text"
          icon={<EyeOutlined />}
          onClick={() => { setSelectedMember(record); setDetailVisible(true); }}
        >
          Xem chi tiết
        </Button>
            ),
        },
    ];

    return (
    <div style={{ padding: 24, minHeight: "100vh" }}>
      <Title level={2} style={{ textAlign: "left", color: "#1976d2", marginBottom: 32, letterSpacing: 1 }}>
        <UserAddOutlined style={{ marginRight: 12, color: '#1976d2' }} />
        Quản lý đội nhóm phòng ban {departmentName}
            </Title>
      <Spin spinning={loading}>
        <Card title="Danh sách thành viên trong phòng ban" style={{ padding: 24 }}>
                <Table
            dataSource={members}
                    columns={columns}
            rowKey="_id"
                    pagination={{
              defaultPageSize: 10,
                        showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} thành viên`,
                    }}
                />
            </Card>
            <Modal
          title={selectedMember?.fullName}
          open={detailVisible}
          onCancel={() => setDetailVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailVisible(false)}>
              Đóng
            </Button>
          ]}
          width={800}
        >
          {selectedMember && (
            <div style={{ padding: '24px', background: '#f4f6fa', borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
              <Row gutter={[16, 16]} justify="center">
                <Col span={24} style={{ textAlign: 'center', marginBottom: 16 }}>
                  <Avatar
                    size={100}
                    style={{
                      backgroundColor: COLORS[selectedMember.fullName.charCodeAt(0) % COLORS.length],
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: 40,
                      marginBottom: '12px',
                      border: '3px solid #fff',
                      boxShadow: '0 2px 8px #eee'
                    }}
                  >
                    {selectedMember.fullName.charAt(0)}
                  </Avatar>
                  <Title level={2} style={{ marginTop: 12, marginBottom: 0, color: '#2d2d2d', fontWeight: 700 }}>
                    {selectedMember.fullName}
                  </Title>
                  <Text type="secondary" style={{ fontSize: '18px', color: '#722ed1', fontWeight: 500 }}>{selectedMember.positionId?.name}</Text>
                </Col>
              </Row>
              <Divider orientation="left" style={{ color: '#722ed1', fontWeight: 'bold', fontSize: 18 }}>
                <IdcardOutlined style={{ color: '#722ed1', marginRight: 8 }} />Thông tin cá nhân
              </Divider>
              <Card style={{ marginBottom: 16, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }} bordered={false}>
                <Row gutter={[16, 16]}>
                  <Col span={12}><Text strong><IdcardOutlined /> Mã nhân viên:</Text> {selectedMember.code}</Col>
                  <Col span={12}><Text strong><Tag color={getStatusColor(selectedMember.status)}>{getStatusLabel(selectedMember.status)}</Tag></Text></Col>
                  <Col span={12}><Text strong><UserAddOutlined /> Giới tính:</Text> {selectedMember.gender === 'male' ? 'Nam' : selectedMember.gender === 'female' ? 'Nữ' : 'Khác'}</Col>
                  <Col span={12}><Text strong><HomeOutlined /> Địa chỉ:</Text> {selectedMember.address}</Col>
                  <Col span={12}><Text strong><CalendarOutlined /> Ngày sinh:</Text> {selectedMember.dob ? moment(selectedMember.dob).format('DD-MM-YYYY') : ''}</Col>
                </Row>
              </Card>
              <Divider orientation="left" style={{ color: '#1890ff', fontWeight: 'bold', fontSize: 18 }}>
                <BarChartOutlined style={{ color: '#1890ff', marginRight: 8 }} />Thông tin công việc
              </Divider>
              <Card style={{ marginBottom: 16, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }} bordered={false}>
                <Row gutter={[16, 16]}>
                  <Col span={12}><Text strong><BankOutlined /> Phòng ban:</Text> {departmentName}</Col>
                  <Col span={12}><Text strong><IdcardOutlined /> Vị trí:</Text> {selectedMember.positionId?.name || selectedMember.position || "Chưa rõ"}</Col>
                  <Col span={12}><Text strong><CalendarOutlined /> Ngày vào làm:</Text> {selectedMember.joinDate ? moment(selectedMember.joinDate).format('YYYY-MM-DD') : ''}</Col>
                  <Col span={12}><Text strong><CalendarOutlined /> Ngày hết hạn hợp đồng:</Text> {selectedMember.resignDate ? moment(selectedMember.resignDate).format('YYYY-MM-DD') : ''}</Col>
                  <Col span={12}><Text strong><FileTextOutlined /> Loại hợp đồng:</Text> {selectedMember.contractId?.contract_type}</Col>
                  <Col span={12}><Text strong><BarChartOutlined /> Hệ số lương:</Text> {selectedMember.salaryCoefficientId?.salary_coefficient}</Col>
                </Row>
              </Card>
              <Divider orientation="left" style={{ color: '#13c2c2', fontWeight: 'bold', fontSize: 18 }}>
                <MailOutlined style={{ color: '#13c2c2', marginRight: 8 }} />Thông tin liên hệ
              </Divider>
              <Card style={{ marginBottom: 16, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }} bordered={false}>
                <Row gutter={[16, 16]}>
                  <Col span={12}><Text strong><MailOutlined /> Email:</Text> {selectedMember.email}</Col>
                  <Col span={12}><Text strong><PhoneOutlined /> Số điện thoại:</Text> {selectedMember.phone}</Col>
                </Row>
              </Card>
              <Divider orientation="left" style={{ color: '#faad14', fontWeight: 'bold', fontSize: 18 }}>
                <BankOutlined style={{ color: '#faad14', marginRight: 8 }} />Thông tin tài khoản
              </Divider>
              <Card style={{ background: '#fffbe6', borderRadius: 8, boxShadow: '0 2px 8px #eee' }} bordered={false}>
                <Row gutter={[16, 16]}>
                  <Col span={12}><Text strong><BankOutlined /> Tài khoản ngân hàng:</Text> {selectedMember.bankAccount}</Col>
                  <Col span={12}><Text strong><BankOutlined /> Tên ngân hàng:</Text> {selectedMember.bankName}</Col>
                </Row>
              </Card>
              
            </div>
          )}
            </Modal>
      </Spin>
        </div>
    );
};

export default TeamManagement;
