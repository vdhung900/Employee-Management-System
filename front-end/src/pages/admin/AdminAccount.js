import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Card,
  Tag,
  Dropdown,
  Menu,
  Typography,
  Breadcrumb,
  Row,
  Col,
  Modal,
  message,
  Form,
  Select,
  Divider,
  DatePicker
} from 'antd';
import {
  UserOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  ExportOutlined,
  ImportOutlined,
  FilterOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  EyeOutlined,
  EnvironmentOutlined,
  FileImageOutlined,
  IdcardOutlined,
  TeamOutlined,
  CalendarOutlined,
  ManOutlined,
  ApartmentOutlined,
  CrownOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Admin_account from '../../services/Admin_account';
import RolePermissionService from '../../services/RolePermissionService';

import moment from 'moment';
import Employee_profile from '../../services/Employee_profile';
import UploadFileComponent from '../../components/file-list/FileList';

const { Title, Text } = Typography;

const AdminAccount = () => {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [resetPasswordModalVisible, setResetPasswordModalVisible] = useState(false);
  const [userToReset, setUserToReset] = useState(null);
  const [resetPasswordForm] = Form.useForm();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addForm] = Form.useForm();
  const [roles, setRoles] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '30', '40'],
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bản ghi`
  });
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [accountDetails, setAccountDetails] = useState(null);
  const [fileResponse, setFileResponse] = useState([]);
  const [urlImage, setUrlImage] = useState('');

  const rolesList = async () => {
    const role = await Admin_account.getAllRoles();
    setRoles(role.data);
  }

  useEffect(() => {
    if (fileResponse[0]?.key) {
      const data = async () => {
        const data = await Employee_profile.updatefileimage(fileResponse[0]?.key);
        setUrlImage(data.data);
      }
      data();
    }
    rolesList();
  }, []);

  const fetchData = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      const response = await Admin_account.getAllAcount({ page, size });
      const users = (response.data || []).map((user, idx) => ({
        key: user._id || idx,
        id: idx + 1,
        name: user.employeeId?.fullName || '',
        username: user.username,
        role: user.role?._id || '',
        status: user.status,
      }));
      setData(users);
      setPagination(prev => ({
        ...prev,
        current: page,
        pageSize: size,
        total: response.totalElements || 0
      }));
    } catch (error) {
      message.error(error.message || 'Lỗi khi lấy dữ liệu!');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    fetchData(pagination.current, pagination.pageSize);
  };

  useEffect(() => {


    fetchData();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Tên người dùng',
      dataIndex: 'name',
      key: 'name',

    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: role => {
        let color = '';
        let text = '';

        switch (role) {
          case '685442fcf95cad5e7842df55':
            color = 'red';
            text = 'Quản trị viên';
            break;
          case '685445592f1f5bf10e7a4168':
            color = 'blue';
            text = 'Quản lý';
            break;
          case '685445892f1f5bf10e7a417b':
            color = 'purple';
            text = 'Quản lý nhân sự';
            break;
          default:
            color = 'green';
            text = 'Nhân viên';
        }

        return <Tag color={color}>{text}</Tag>;
      },
      filters: roles.map(role => ({ text: role.name, value: role._id })),
      onFilter: (value, record) => record.role === value,

    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        const color = status === 'active' ? 'success' : 'default';
        const text = status === 'active' ? 'Đang hoạt động' : 'Vô hiệu hóa';
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: 'Đang hoạt động', value: 'active' },
        { text: 'Vô hiệu hóa', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'edit',
                icon: <EditOutlined />,
                label: 'Chỉnh sửa',
                onClick: () => showEditModal(record)
              },
              {
                key: 'reset',
                icon: <LockOutlined />,
                label: 'Reset password',
                onClick: () => showResetPasswordModal(record)
              },
              {
                key: 'view',
                icon: <EyeOutlined />,
                label: 'Xem chi tiết',
                onClick: () => showDetailModal(record)
              },
            ]
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
    },
  ];


  const showEditModal = async (user) => {
    const accountDetail = await Admin_account.getAccountById(user.key);
    setUserToEdit(accountDetail.data);
    form.setFieldsValue({
      status: accountDetail.data.status,
      role: accountDetail.data.role?.name,
      fullName: accountDetail.data.employeeId.fullName,
      email: accountDetail.data.employeeId.email,
      phone: accountDetail.data.employeeId.phone,
      dob: accountDetail.data.employeeId.dob ? moment(accountDetail.data.employeeId.dob) : null,
      gender: accountDetail.data.employeeId.gender,
      address: accountDetail.data.employeeId.address,
      // avatar: accountDetail.data.employeeId.avatar,
    });
    setFileResponse(accountDetail.data.employeeId.avatar);
    setEditModalVisible(true);
  };

  const handleEditUser = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      // Prepare data for update
      const accountData = {};
      if (values.status !== userToEdit.status) accountData.status = values.status;
      if (values.role !== userToEdit.role.name) accountData.role = values.role;
      if (values.fullName !== userToEdit.employeeId.fullName) accountData.fullName = values.fullName;
      if (values.email !== userToEdit.employeeId.email) accountData.email = values.email;
      if (values.phone !== userToEdit.employeeId.phone) accountData.phone = values.phone;
      if (values.dob && values.dob !== userToEdit.employeeId.dob) {
        // Nếu là moment object thì chuyển về ISO string
        accountData.dob = values.dob ? moment(values.dob).format('YYYY-MM-DD') : null;
      }
      if (values.gender !== userToEdit.employeeId.gender) accountData.gender = values.gender;
      if (values.address !== userToEdit.employeeId.address) accountData.address = values.address;
      // if (values.avatar !== userToEdit.employeeId.avatar) accountData.avatar = values.avatar;
      // Call API to update account
      const response = await Admin_account.updateAccount(userToEdit._id, accountData);
      if (response.success) {
        message.success('Đã cập nhật người dùng thành công!');
        const accounts = await Admin_account.getAllAcount();
        const users = (accounts.data || []).map((user, idx) => ({
          key: user._id || idx,
          id: idx + 1,
          name: user.employeeId?.fullName || '',
          username: user.username,
          role: user.role?._id || '',
          status: user.status,
        }));
        setData(users);
        setEditModalVisible(false);
      }
    } catch (error) {
      message.error(error.message || 'Lỗi khi cập nhật người dùng!');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };


  const fileInputRef = React.useRef();

  const handleImportExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const dataExcel = XLSX.utils.sheet_to_json(ws, { header: 1 });
      // dataExcel là mảng các dòng, dòng đầu là header
      const [header, ...rows] = dataExcel;
      if (!header || header.length < 6) {
        message.error('File Excel không đúng định dạng!');
        return;
      }
      // map từng dòng thành object
      const newUsers = rows
        .filter(row => row.length >= 6)
        .map((row, idx) => ({
          key: `excel-${Date.now()}-${idx}`,
          id: data.length + idx + 1,
          name: row[0] || '',
          username: row[1] || '',

          role: row[5] || 'employee',
          status: row[6] || 'active',
        }));
      setData(prev => [...prev, ...newUsers]);
      message.success('Nhập dữ liệu từ Excel thành công!');
    };
    reader.readAsBinaryString(file);
    // reset input để có thể chọn lại cùng 1 file
    e.target.value = '';
  };

  const handleExportExcel = () => {
    // Chuẩn bị dữ liệu xuất
    const exportData = data.map(user => ([
      user.name,
      user.username,
      user.email,
      user.phone,
      user.dob,
      user.gender,
      user.role.name,
      user.status,
      user.address,
      // user.avatar
    ]));
    const ws = XLSX.utils.aoa_to_sheet([
      ['Tên', 'Tên đăng nhập', 'Vai trò', 'Trạng thái'],
      ...exportData
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Accounts');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'accounts.xlsx');
  };

  const showResetPasswordModal = (user) => {
    setUserToReset(user);
    setResetPasswordModalVisible(true);
    resetPasswordForm.resetFields();
  };

  const handleResetPassword = () => {
    resetPasswordForm.validateFields().then(async (values) => {
      setLoading(true);
      try {
        const response = await Admin_account.resetPassword(userToReset.key, { password: values.password });
        if (response) {
          message.success('Đặt lại mật khẩu thành công!');
          setResetPasswordModalVisible(false);
        }
      } catch (error) {
        console.error('Reset password error:', error);
        message.error(error.response?.data?.message || 'Lỗi khi đặt lại mật khẩu!');
      } finally {
        setLoading(false);
      }
    }).catch(error => {
      console.error('Form validation error:', error);
      message.error('Vui lòng kiểm tra lại thông tin!');
    });
  };



  // Thay đổi: Lọc dữ liệu trực tiếp khi searchText thay đổi
  const filteredData = data.filter(record => {
    const search = searchText.trim().toLowerCase();
    return (
      record.name.toLowerCase().includes(search) ||
      record.username.toLowerCase().includes(search)
    );
  });

  const showAddModal = () => {
    setAddModalVisible(true);
    addForm.resetFields();
  };

  const handleAddUser = async () => {
    try {
      await addForm.validateFields().then(async (values) => {
        setLoading(true);
        // Chuyển đổi dữ liệu trước khi gửi lên server
        const response = await Admin_account.createAccount(values);
        if (response.success) {
          message.success('Thêm tài khoản thành công!');
        }
        setAddModalVisible(false);
        // Reload lại danh sách tài khoản
        const accounts = await Admin_account.getAllAcount();
        const users = (accounts.data || []).map((user, idx) => ({
          key: user._id || idx,
          id: idx + 1,
          name: user.employeeId?.fullName || '',
          username: user.username,
          role: user.role?._id || '',
          status: user.status,
        }));
        setData(users);
      });
    } catch (error) {
      message.error(error.message || 'Lỗi khi thêm tài khoản!');
    } finally {
      setFileResponse([])
      setLoading(false);
    }

  };

  const showDetailModal = async (user) => {
    try {
      const accountDetail = await Admin_account.getAccountById(user.key);
      setAccountDetails(accountDetail.data);
      setDetailModalVisible(true);
    } catch (error) {
      message.error('Không thể lấy thông tin chi tiết tài khoản!');
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-users-page">


      <Card
        title={
          <Title level={4} className="green-gradient-text" style={{ margin: 0 }}>
            <UserOutlined style={{ marginRight: 8 }} />
            Danh sách người dùng
          </Title>
        }
        className="card-green-theme"
        style={{ borderRadius: '12px', overflow: 'hidden' }}
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} md={8}>
            <Input
              placeholder="Tìm kiếm người dùng..."
              prefix={<SearchOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onPressEnter={() => handleSearch(searchText)}
              style={{ borderRadius: '8px' }}
              allowClear
            />
          </Col>
          <Col xs={24} md={16}>
            <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                icon={<FilterOutlined />}
                style={{ borderRadius: '8px' }}
              >
                Lọc
              </Button>
              <Button
                icon={<ImportOutlined />}
                style={{ borderRadius: '8px' }}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                Nhập từ Excel
              </Button>
              <Button
                icon={<ExportOutlined />}
                style={{ borderRadius: '8px' }}
                onClick={handleExportExcel}
              >
                Xuất ra Excel
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className="btn-green-theme"
                style={{ borderRadius: '8px' }}
                onClick={showAddModal}
              >
                Thêm người dùng
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: keys => setSelectedRowKeys(keys),
            selections: [
              Table.SELECTION_ALL,
              Table.SELECTION_INVERT,
              Table.SELECTION_NONE,

            ]
          }}
          columns={columns}
          dataSource={filteredData}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          style={{ borderRadius: '8px', overflow: 'hidden' }}
          className="modern-table"
        />
      </Card>

      <Modal
        title="Chỉnh sửa người dùng"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleEditUser}
        okText="Lưu"
        cancelText="Hủy"
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={24}>
              <Title level={5}>Thông tin tài khoản</Title>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Select.Option value="active">Đang hoạt động</Select.Option>
                  <Select.Option value="inactive">Vô hiệu hóa</Select.Option>
                </Select>
              </Form.Item>


            </Col>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Vai trò"
                rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
              >
                <Select placeholder="Chọn vai trò">
                  {roles.map(role => (
                    <Select.Option key={role._id} value={role._id}>
                      {role.name}
                    </Select.Option>
                  ))}

                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Row gutter={16}>
            <Col span={24}>
              <Title level={5}>Thông tin cá nhân</Title>
            </Col>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Họ và tên"
              >
                <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
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
                <Input prefix={<MailOutlined />} placeholder="Nhập email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
                ]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dob"
                label="Ngày sinh"
              >
               <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="Giới tính"
              >
                <Select placeholder="Chọn giới tính">
                  <Select.Option value="male">Nam</Select.Option>
                  <Select.Option value="female">Nữ</Select.Option>
                  <Select.Option value="other">Khác</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="address"
                label="Địa chỉ"
              >
                <Input prefix={<EnvironmentOutlined />} placeholder="Nhập địa chỉ" />
              </Form.Item>
            </Col>
            {/* <Col span={12}>
              <Form.Item
                name="avatar"
                label="Ảnh đại diện"
              >
                <Input prefix={<FileImageOutlined />} placeholder="Nhập đường dẫn ảnh" />
              </Form.Item>
            </Col> */}
          </Row>


          <Divider />


        </Form>
      </Modal>

      <Modal
        title="Đặt lại mật khẩu"
        open={resetPasswordModalVisible}
        onCancel={() => setResetPasswordModalVisible(false)}
        onOk={handleResetPassword}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={resetPasswordForm} layout="vertical">
          <Form.Item
            name="password"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
              { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' }
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={<Title level={3} style={{ marginBottom: '0', letterSpacing: '0.5px' }}>Thông tin chi tiết tài khoản</Title>}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={700}
      >
        {accountDetails && (
          <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', padding: '16px' }}>
            <Row gutter={[16, 16]} align="middle" style={{ marginBottom: '16px' }}>
              <Col span={4} style={{ textAlign: 'center' }}>
                <UserOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
              </Col>
              <Col span={20}>
                <Title level={3} style={{ marginBottom: 8, letterSpacing: '0.5px' }}>{accountDetails.employeeId.fullName}</Title>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                  <IdcardOutlined style={{ marginRight: 6, color: '#52c41a' }} />
                  <Text type="secondary" style={{ letterSpacing: '0.5px' }}>Mã nhân viên: <b>{accountDetails.employeeId.code}</b></Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                  <TeamOutlined style={{ marginRight: 6, color: '#722ed1' }} />
                  <Text type="secondary" style={{ letterSpacing: '0.5px' }}>Vai trò: <Tag color="geekblue" style={{ fontWeight: 500 }}>{accountDetails.role.name}</Tag></Text>
                </div>
              </Col>
            </Row>
            <Divider style={{ margin: '16px 0' }}>Thông tin chi tiết</Divider>
            <Row gutter={[16, 16]}>
              <Col span={12} style={{ backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '8px' }}>
                <Title level={5} style={{ marginBottom: 12 }}>Thông tin cá nhân</Title>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                  <MailOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                  <span><b>Email:</b> {accountDetails.employeeId.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                  <PhoneOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                  <span><b>Số điện thoại:</b> {accountDetails.employeeId.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                  <CalendarOutlined style={{ marginRight: 8, color: '#faad14' }} />
                  <span><b>Ngày sinh:</b> {accountDetails.employeeId.dob ? moment(accountDetails.employeeId.dob).format('DD/MM/YYYY') : 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                  <ManOutlined style={{ marginRight: 8, color: '#eb2f96' }} />
                  <span><b>Giới tính:</b> {accountDetails.employeeId.gender}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                  <EnvironmentOutlined style={{ marginRight: 8, color: '#13c2c2' }} />
                  <span><b>Địa chỉ:</b> {accountDetails.employeeId.address || 'N/A'}</span>
                </div>
              </Col>
              <Col span={12} style={{ backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '8px' }}>
                <Title level={5} style={{ marginBottom: 12 }}>Thông tin công việc</Title>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                  <ApartmentOutlined style={{ marginRight: 8, color: '#fa541c' }} />
                  <span><b>Phòng ban:</b> {accountDetails.employeeId.departmentId?.name || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                  <CrownOutlined style={{ marginRight: 8, color: '#fadb14' }} />
                  <span><b>Chức vụ:</b> {accountDetails.employeeId.positionId?.name || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                  <SafetyCertificateOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                  <span><b>Trạng thái:</b> {accountDetails.status === 'active' ? <Tag color="green">Đang hoạt động</Tag> : <Tag color="red">Vô hiệu hóa</Tag>}</span>
                </div>
              </Col>
            </Row>
          </Card>
        )}
      </Modal>

      <Modal
        title="Thêm tài khoản mới"
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onOk={handleAddUser}
        okText="Thêm"
        cancelText="Hủy"
        width={800}
      >
        <Form form={addForm} layout="vertical">
          <Row gutter={16}>
            <Col span={24}>
              <Title level={5}>Thông tin tài khoản</Title>
            </Col>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Vai trò"
                rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
              >
                <Select placeholder="Chọn vai trò">
                  {roles.map(role => (
                    <Select.Option key={role._id} value={role._id}>
                      {role.name}
                    </Select.Option>
                  ))}
                </Select>

              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Select.Option value="active">Đang hoạt động</Select.Option>
                  <Select.Option value="inactive">Vô hiệu hóa</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Divider />
          <Row gutter={16}>
            <Col span={24}>
              <Title level={5}>Thông tin cá nhân</Title>
            </Col>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
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
                <Input prefix={<MailOutlined />} placeholder="Nhập email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
                ]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dob"
                label="Ngày sinh"
              >
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="Chọn ngày sinh"
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="Giới tính"
              >
                <Select placeholder="Chọn giới tính">
                  <Select.Option value="male">Nam</Select.Option>
                  <Select.Option value="female">Nữ</Select.Option>
                  <Select.Option value="other">Khác</Select.Option>
                </Select>
              </Form.Item>
            </Col>

          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="address"
                label="Địa chỉ"
              >
                <Input prefix={<EnvironmentOutlined />} placeholder="Nhập địa chỉ" />
              </Form.Item>
            </Col>
            {/* <Col span={12}>
              <Form.Item
                name="avatar"
                label="Ảnh đại diện"
              >

                <UploadFileComponent uploadFileSuccess={setFileResponse} isSingle={true} files={fileResponse} />
                {urlImage && <img src={urlImage} alt="Avatar" style={{ width: '100%', borderRadius: '50%' }} />}

              </Form.Item>
            </Col> */}
          </Row>
          <Divider />
        </Form>
      </Modal>

      <input
        type="file"
        accept=".xlsx,.xls"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleImportExcel}
      />
    </div>
  );
};

export default AdminAccount; 