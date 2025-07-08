import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { LockOutlined, ExclamationCircleOutlined } from '@ant-design/icons'; // Thêm icon cảnh báo
import Employee_profile from '../../services/Employee_profile';

const ChangePasswordModal = ({ visible, onCancel, onSave }) => {
  const [form] = Form.useForm();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading cho nút

  const loadData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        // Có thể chuyển hướng đến trang đăng nhập hoặc hiển thị thông báo lỗi nghiêm trọng
        message.error("Phiên đăng nhập đã hết hạn hoặc bạn chưa đăng nhập.");
        onCancel(); // Đóng modal nếu không có thông tin người dùng
        throw new Error("Bạn chưa đăng nhập !!!");
      }
      const response = await Employee_profile.getEmployeeProfile(user.employeeId);
      if (response.success) {
        setUserData(response.data);
      } else {
        message.error('Không thể tải thông tin người dùng. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      message.error(error.message || 'Đã xảy ra lỗi khi tải dữ liệu người dùng.');
    }
  }

  useEffect(() => {
    // Chỉ tải dữ liệu nếu modal hiển thị và userData chưa được tải
    if (visible && !userData) {
      loadData();
    }
    // Đặt lại các trường form khi modal đóng
    if (!visible) {
      form.resetFields();
    }
  }, [visible, userData, form]);

  const handleSave = async () => {
    setLoading(true); // Bắt đầu loading
    try {
      const values = await form.validateFields(); // Xác thực các trường của form

      if (!userData || !userData.code) { // Đảm bảo dùng 'code' nếu đó là trường bạn dùng để lấy account
        message.error('Không tìm thấy thông tin tài khoản để thay đổi mật khẩu.');
        return;
      }

      // Lấy thông tin tài khoản để xác minh mật khẩu hiện tại
      const getAccountResponse = await Employee_profile.getAccount(userData.code);

      if (getAccountResponse.success) {
        // Kiểm tra mật khẩu hiện tại
        if (getAccountResponse.data.password === values.currentPassword) {
          // Nếu mật khẩu hiện tại khớp, tiến hành đổi mật khẩu
          const resetPasswordResponse = await Employee_profile.resetPassword(getAccountResponse.data._id, values);
          if (resetPasswordResponse.success) {
            form.resetFields(); // Đặt lại form sau khi đổi mật khẩu thành công
            onCancel(); // Đóng modal
            if (onSave) {
              onSave(); // Gọi onSave nếu được cung cấp từ component cha
            }
          } else {
            message.error(resetPasswordResponse.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.');
          }
        } else {
          message.error('Mật khẩu hiện tại không chính xác. Vui lòng kiểm tra lại.');
        }
      } else {
        message.error(getAccountResponse.message || 'Không thể lấy thông tin tài khoản để xác minh.');
      }
    } catch (error) {
      if (error.errorFields) { // Lỗi xác thực của Ant Design Form
        message.error({
          content: 'Vui lòng kiểm tra lại các trường nhập liệu bị thiếu hoặc không hợp lệ.',
          icon: <ExclamationCircleOutlined />,
        });
      } else {
        console.error('Lỗi xác thực hoặc gọi API:', error);
        message.error('Đã có lỗi xảy ra trong quá trình đổi mật khẩu. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false); // Dừng loading bất kể thành công hay thất bại
    }
  };

  return (
    <Modal
      visible={visible}
      title={<span style={{ fontWeight: 'bold' }}>Đổi mật khẩu</span>} // Làm đậm tiêu đề
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={loading}> {/* Vô hiệu hóa khi đang loading */}
          Hủy
        </Button>,
        <Button key="save" type="primary" onClick={handleSave} loading={loading}>
          Đổi mật khẩu
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="currentPassword"
          label="Mật khẩu hiện tại"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu hiện tại của bạn!' },
            { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự.' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Nhập mật khẩu hiện tại của bạn"
            size="large" // Tăng kích thước input
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu mới"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu mới của bạn!' },
            { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự.' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Nhập mật khẩu mới của bạn"
            size="large" // Tăng kích thước input
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu mới"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu mới của bạn!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp.'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Xác nhận mật khẩu mới của bạn"
            size="large" // Tăng kích thước input
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;