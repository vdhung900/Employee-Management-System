import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Upload, message, Row, Col, Avatar } from 'antd';
import { UserOutlined, UploadOutlined, LockOutlined } from '@ant-design/icons';
import ChangePasswordModal from './ChangePasswordModal';

const ProfileModal = ({ visible, onCancel, userData, onSave }) => {
  const [form] = Form.useForm();
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        department: userData.department,
        position: userData.position,
      });
    }
  }, [userData, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      onSave({ ...values, avatar });
      message.success('Cập nhật thông tin thành công!');
    } catch (error) {
      message.error('Vui lòng kiểm tra lại thông tin!');
    }
  };

  const handleAvatarChange = (info) => {
    if (info.file.status === 'done') {
      setAvatar(info.file.response.url);
      message.success('Tải ảnh lên thành công!');
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        title="Thông tin cá nhân"
        onCancel={onCancel}
        width={800}
        footer={[
          <Button key="password" type="default" icon={<LockOutlined />} 
            onClick={() => setChangePasswordVisible(true)}>
            Đổi mật khẩu
          </Button>,
          <Button key="cancel" onClick={onCancel}>
            Hủy
          </Button>,
          <Button key="save" type="primary" onClick={handleSave}>
            Lưu thay đổi
          </Button>,
        ]}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Upload
            name="avatar"
            showUploadList={false}
            action="/api/upload"
            onChange={handleAvatarChange}
          >
            <Avatar
              size={100}
              src={avatar || userData?.avatar}
              icon={<UserOutlined />}
              style={{ cursor: 'pointer' }}
            />
            <div style={{ marginTop: 8 }}>
              <Button icon={<UploadOutlined />}>Thay đổi ảnh đại diện</Button>
            </div>
          </Upload>
        </div>

        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="department"
                label="Phòng ban"
              >
                <Input placeholder="Nhập phòng ban" disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="position"
                label="Chức vụ"
              >
                <Input placeholder="Nhập chức vụ" disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="employeeId"
                label="Mã nhân viên"
              >
                <Input placeholder="Mã nhân viên" disabled />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="Địa chỉ"
          >
            <Input.TextArea rows={3} placeholder="Nhập địa chỉ" />
          </Form.Item>
        </Form>
      </Modal>

      <ChangePasswordModal
        visible={changePasswordVisible}
        onCancel={() => setChangePasswordVisible(false)}
        onSave={(values) => {
          console.log('Change password:', values);
          setChangePasswordVisible(false);
          message.success('Đổi mật khẩu thành công!');
        }}
      />
    </>
  );
};

export default ProfileModal; 
