import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Typography,
  Breadcrumb,
  Row,
  Col,
  Space,
  Divider,
  message,
  Upload,
  Avatar
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  IdcardOutlined,
  BankOutlined,
  TeamOutlined,
  UploadOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

const AdminUserAdd = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();

  const onFinish = (values) => {
    setLoading(true);
    
    // Xử lý thêm người dùng
    console.log('Received values:', values);
    
    // Giả lập gọi API
    setTimeout(() => {
      message.success('Thêm người dùng thành công!');
      setLoading(false);
      navigate('/admin/users');
    }, 1500);
  };

  const handleAvatarChange = (info) => {
    if (info.file.status === 'done') {
      // Xử lý avatar sau khi upload
      const imageUrl = URL.createObjectURL(info.file.originFileObj);
      setAvatar(imageUrl);
      message.success('Upload ảnh đại diện thành công!');
    }
  };

  return (
    <div className="admin-user-add-page">
      

      <Card bordered={false} style={{ padding: 24 }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={4} style={{ margin: 0 }}>
              <UserOutlined style={{ marginRight: 8 }} />Thêm người dùng mới
            </Title>
          </Col>
          <Col>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/admin/admin_account')}
            >
              Quay lại
            </Button>
          </Col>
        </Row>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            status: 'active',
            role: 'employee',
          }}
        >
          <Row gutter={24}>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <Avatar
                  size={120}
                  icon={<UserOutlined />}
                  src={avatar}
                  style={{ marginBottom: 16 }}
                />
                <Upload
                  name="avatar"
                  listType="picture"
                  showUploadList={false}
                  action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                  onChange={handleAvatarChange}
                >
                  <Button icon={<UploadOutlined />}>Tải lên ảnh đại diện</Button>
                </Upload>
              </div>
            </Col>
            
            <Col span={18}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Họ và tên"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    label="Tên đăng nhập"
                    name="username"
                    rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email!' },
                      { type: 'email', message: 'Email không hợp lệ!' }
                    ]}
                  >
                    <Input prefix={<MailOutlined />} placeholder="Email" />
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                  >
                    <Input placeholder="Số điện thoại" />
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                  >
                    <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    label="Xác nhận mật khẩu"
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                      { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Hai mật khẩu không khớp!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" />
                  </Form.Item>
                </Col>
              </Row>
              
              <Divider orientation="left">Thông tin công việc</Divider>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Phòng ban"
                    name="department"
                    rules={[{ required: true, message: 'Vui lòng chọn phòng ban!' }]}
                  >
                    <Select placeholder="Chọn phòng ban" prefix={<BankOutlined />}>
                      <Option value="IT">IT</Option>
                      <Option value="HR">HR</Option>
                      <Option value="Finance">Finance</Option>
                      <Option value="Marketing">Marketing</Option>
                      <Option value="Operations">Operations</Option>
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    label="Chức vụ"
                    name="position"
                    rules={[{ required: true, message: 'Vui lòng chọn chức vụ!' }]}
                  >
                    <Select placeholder="Chọn chức vụ" prefix={<IdcardOutlined />}>
                      <Option value="Manager">Manager</Option>
                      <Option value="Team Lead">Team Lead</Option>
                      <Option value="Senior Staff">Senior Staff</Option>
                      <Option value="Staff">Staff</Option>
                      <Option value="Intern">Intern</Option>
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    label="Vai trò"
                    name="role"
                    rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                  >
                    <Select placeholder="Chọn vai trò" prefix={<TeamOutlined />}>
                      <Option value="admin">Quản trị viên</Option>
                      <Option value="manager">Quản lý</Option>
                      <Option value="employee">Nhân viên</Option>
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    label="Trạng thái"
                    name="status"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                  >
                    <Select placeholder="Chọn trạng thái">
                      <Option value="active">Đang hoạt động</Option>
                      <Option value="inactive">Vô hiệu hóa</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          
          <Divider />
          
          <Row justify="end">
            <Space>
              <Button onClick={() => navigate('/admin/users')}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Thêm người dùng
              </Button>
            </Space>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default AdminUserAdd; 
