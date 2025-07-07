
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message, Row, Col, Avatar, DatePicker, Typography, Spin, Space, Select } from 'antd';
import {
  UserOutlined, LockOutlined, SaveOutlined, CheckCircleOutlined, ExclamationCircleOutlined,
  MailOutlined, PhoneOutlined, HomeOutlined, CalendarOutlined, SolutionOutlined, BankOutlined,
  TeamOutlined, IdcardOutlined, DollarOutlined, ClockCircleOutlined, PushpinOutlined, NumberOutlined
} from '@ant-design/icons'; // Bỏ UploadOutlined
import ChangePasswordModal from './ChangePasswordModal';
import Employee_profile from '../../services/Employee_profile';
import Hr_ManageEmployee from '../../services/Hr_ManageEmployee';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;

const ProfileModal = ({ visible, onCancel, onSave }) => {
  const [form] = Form.useForm();
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [fileAvatar, setFileAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  // Loại bỏ avatarLoading vì không còn chức năng upload
  // const [avatarLoading, setAvatarLoading] = useState(false); 

  // --- Tải dữ liệu hồ sơ ban đầu ---
  const loadProfileData = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.employeeId) {
        message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        onCancel();
        return;
      }
      const response = await Employee_profile.getEmployeeProfile(user.employeeId);
      if (response.success) {
        setUserData(response.data);
        if (response.data.avatar) {
          const avatarResponse = await Hr_ManageEmployee.getAvatar(response.data.avatar);
          if (avatarResponse.data) {
            setFileAvatar(avatarResponse.data);
          } else {
            setFileAvatar(null);
          }
        } else {
          setFileAvatar(null);
        }
      } else {
        message.error('Không thể tải thông tin hồ sơ. Vui lòng thử lại.');
        onCancel();
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu hồ sơ:', error);
      message.error(error.message || 'Đã xảy ra lỗi khi tải thông tin cá nhân.');
      onCancel();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      loadProfileData();
    } else {
      form.resetFields();
      setUserData(null);
      setFileAvatar(null);
    }
  }, [visible, form]);

  // --- Khởi tạo giá trị cho Form ---
  useEffect(() => {
    if (userData) {
      const safeMoment = (dateString) => {
        if (!dateString) return null;
        const m = moment(dateString);
        return m.isValid() ? m : null;
      };

      form.setFieldsValue({
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        code: userData.code,
        gender: userData.gender,
        dob: safeMoment(userData.dob),
        avatar: userData.avatar,
        bankAccount: userData.bankAccount,
        bankName: userData.bankName,
        department: userData.departmentId ? userData.departmentId.name : 'N/A',
        position: userData.positionId ? userData.positionId.name : 'N/A',
        joinDate: safeMoment(userData.joinDate),
        resignDate: safeMoment(userData.resignDate),
        salary_Base: userData.salaryCoefficientId && userData.salaryCoefficientId.salary_rankId
          ? (userData.salaryCoefficientId.salary_coefficient * userData.salaryCoefficientId.salary_rankId.salary_base).toLocaleString('vi-VN') + ' VNĐ'
          : 'N/A',
      });
    }
  }, [userData, form]);

  // --- Xử lý lưu thông tin ---
  const handleSave = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields([
        'fullName', 'email', 'phone', 'address', 'gender', 'dob', 'bankAccount', 'bankName'
      ]);

      const dataToUpdate = {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        address: values.address,
        gender: values.gender,
        dob: values.dob ? values.dob.format('YYYY-MM-DD') : null,
        bankAccount: values.bankAccount,
        bankName: values.bankName,
        avatar: userData.avatar, // Giữ nguyên avatar hiện có, không cho phép upload mới
      };

      const response = await Employee_profile.updateEmployeeProfile(userData._id, dataToUpdate);
      if (response.success) {
        // message.success({ content: 'Cập nhật thông tin thành công!', icon: <CheckCircleOutlined /> });
        setUserData(response.data);
        if (onSave) onSave();
      } else {
        message.error(response.message || 'Cập nhật thông tin thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      if (error.errorFields) {
        message.error({ content: 'Vui lòng kiểm tra lại các trường nhập liệu bị thiếu hoặc không hợp lệ.', icon: <ExclamationCircleOutlined /> });
      } else {
        console.error('Lỗi khi lưu thông tin:', error);
        message.error('Đã xảy ra lỗi khi lưu thông tin cá nhân. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Xử lý tải lên ảnh đại diện (Đã loại bỏ) ---
  // const handleAvatarUpload = async (info) => {
  //   if (info.file.status === 'uploading') {
  //     setAvatarLoading(true);
  //     return;
  //   }
  //   if (info.file.status === 'done') {
  //     const newAvatarUrl = info.file.response.url;
  //     setUserData(prev => ({ ...prev, avatar: newAvatarUrl }));
  //     setFileAvatar(newAvatarUrl);
  //     message.success(`${info.file.name} đã được tải lên thành công.`);
  //     setAvatarLoading(false);
  //   } else if (info.file.status === 'error') {
  //     message.error(`${info.file.name} tải lên thất bại.`);
  //     setAvatarLoading(false);
  //   }
  // };

  // --- Hiển thị loading spinner khi tải dữ liệu ---
  if (loading && !userData) {
    return (
      <Modal
        visible={visible}
        title="Thông tin cá nhân"
        onCancel={onCancel}
        width={800}
        footer={[]}
        closable={false}
      >
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" tip="Đang tải thông tin..." />
        </div>
      </Modal>
    );
  }

  // --- Render Modal chính ---
  return (
    <>
      <Modal
        visible={visible}
        title={<Title level={4} style={{ margin: 0, color: '#1890ff' }}>Thông tin cá nhân</Title>}
        onCancel={onCancel}
        width={800}
        footer={
          <Space>
            <Button key="password" type="default" icon={<LockOutlined />} onClick={() => setChangePasswordVisible(true)}>
              Đổi mật khẩu
            </Button>
            <Button key="cancel" onClick={onCancel}>
              Hủy
            </Button>
            <Button key="save" type="primary" onClick={handleSave} loading={loading} icon={<SaveOutlined />}>
              Lưu thay đổi
            </Button>
          </Space>
        }
      >
        {/* Phần ảnh đại diện người dùng (không còn Upload) */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          {/* Chỉ hiển thị Avatar, bỏ thẻ Upload bao ngoài */}
          <Avatar
            size={100}
            src={fileAvatar || (userData?.gender === 'Nam' ? '/images/male-avatar.png' : '/images/female-avatar.png')}
            icon={<UserOutlined />}
            style={{ border: '2px solid #1890ff' }} // Giữ nguyên viền màu xanh
          />
          {/* Loại bỏ biểu tượng overlay cho trạng thái tải lên */}
          {/* <div style={{ position: 'absolute', bottom: 0, right: 0, background: 'rgba(24, 144, 255, 0.7)', borderRadius: '50%', padding: '5px' }}>
            {avatarLoading ? <Spin size="small" /> : <UploadOutlined style={{ color: '#fff' }} />}
          </div> */}
          <Title level={5} style={{ marginTop: 10, color: '#333' }}>{userData?.fullName || 'Tên nhân viên'}</Title>
          <Text type="secondary" style={{ color: '#666' }}>Mã nhân viên: {userData?.code || 'N/A'}</Text>
        </div>

        {/* Form thông tin hồ sơ */}
        <Form
          form={form}
          layout="vertical"
        >
          {/* Thông tin cá nhân - Luôn có thể chỉnh sửa */}
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label={<span style={{ color: '#595959' }}><UserOutlined style={{ marginRight: 8, color: '#1890ff' }} />Họ và tên</span>}
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input placeholder="Nhập họ và tên" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label={<span style={{ color: '#595959' }}><MailOutlined style={{ marginRight: 8, color: '#1890ff' }} />Email</span>}
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input placeholder="Nhập email" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label={<span style={{ color: '#595959' }}><PhoneOutlined style={{ marginRight: 8, color: '#1890ff' }} />Số điện thoại</span>}
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
              >
                <Input placeholder="Nhập số điện thoại" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gender"
                label={<span style={{ color: '#595959' }}><SolutionOutlined style={{ marginRight: 8, color: '#1890ff' }} />Giới tính</span>}
              >
                <Select placeholder="Chọn giới tính" size="large">
                  <Option value="Nam">Nam</Option>
                  <Option value="Nữ">Nữ</Option>
                  <Option value="Khác">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="dob"
                label={<span style={{ color: '#595959' }}><CalendarOutlined style={{ marginRight: 8, color: '#1890ff' }} />Ngày sinh</span>}
                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
              >
                <DatePicker placeholder="Chọn ngày sinh" format="DD-MM-YYYY" style={{ width: '100%' }} size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="address"
                label={<span style={{ color: '#595959' }}><HomeOutlined style={{ marginRight: 8, color: '#1890ff' }} />Địa chỉ</span>}
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
              >
                <Input.TextArea rows={2} placeholder="Nhập địa chỉ" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="bankAccount"
                label={<span style={{ color: '#595959' }}><BankOutlined style={{ marginRight: 8, color: '#1890ff' }} />Tài khoản ngân hàng</span>}
                rules={[{ required: true, message: 'Vui lòng nhập tài khoản ngân hàng!' }]}
              >
                <Input placeholder="Tài khoản ngân hàng" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="bankName"
                label={<span style={{ color: '#595959' }}><BankOutlined style={{ marginRight: 8, color: '#1890ff' }} />Tên ngân hàng</span>}
                rules={[{ required: true, message: 'Vui lòng nhập tên ngân hàng!' }]}
              >
                <Input placeholder="Tên ngân hàng" size="large" />
              </Form.Item>
            </Col>
          </Row>

          {/* --- Thông tin công việc - Luôn chỉ đọc và hiển thị đầy đủ --- */}
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="department"
                label={<span style={{ color: '#595959' }}><TeamOutlined style={{ marginRight: 8, color: '#69c0ff' }} />Phòng ban</span>}
              >
                <Input placeholder="Phòng ban" disabled size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="position"
                label={<span style={{ color: '#595959' }}><IdcardOutlined style={{ marginRight: 8, color: '#69c0ff' }} />Chức vụ</span>}
              >
                <Input placeholder="Chức vụ" disabled size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="joinDate"
                label={<span style={{ color: '#595959' }}><ClockCircleOutlined style={{ marginRight: 8, color: '#69c0ff' }} />Ngày vào làm</span>}
              >
                <DatePicker placeholder="Ngày vào làm" disabled format="DD-MM-YYYY" style={{ width: '100%' }} size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="resignDate"
                label={<span style={{ color: '#595959' }}><PushpinOutlined style={{ marginRight: 8, color: '#69c0ff' }} />Ngày nghỉ làm</span>}
              >
                <DatePicker placeholder="Ngày nghỉ làm" disabled format="DD-MM-YYYY" style={{ width: '100%' }} size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="salary_Base"
                label={<span style={{ color: '#595959' }}><DollarOutlined style={{ marginRight: 8, color: '#69c0ff' }} />Lương cơ bản</span>}
              >
                <Input placeholder="Lương cơ bản" disabled size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label={<span style={{ color: '#595959' }}><NumberOutlined style={{ marginRight: 8, color: '#69c0ff' }} />Mã nhân viên</span>}
              >
                <Input placeholder="Mã nhân viên" disabled size="large" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Modal đổi mật khẩu */}
      <ChangePasswordModal
        visible={changePasswordVisible}
        onCancel={() => setChangePasswordVisible(false)}
        onSave={() => {
          message.success('Mật khẩu đã được đổi thành công! Vui lòng đăng nhập lại.');
          setChangePasswordVisible(false);
        }}
      />
    </>
  );
};

export default ProfileModal;