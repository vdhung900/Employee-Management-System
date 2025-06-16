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
  PhoneOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Admin_account from '../../services/Admin_account';
import moment from 'moment';

const { Title, Text } = Typography;

const AdminAccount = () => {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [resetPasswordModalVisible, setResetPasswordModalVisible] = useState(false);
  const [userToReset, setUserToReset] = useState(null);
  const [resetPasswordForm] = Form.useForm();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addForm] = Form.useForm();
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [accounts, departmentsData, positionsData] = await Promise.all([
          Admin_account.getAllAcount(),
          Admin_account.getAllDepartments(),
          Admin_account.getAllPositions()
        ]);
        
        // Map dữ liệu trả về từ API sang format cho table
        const users = (accounts || []).map((user, idx) => ({
          key: user._id || idx,
          id: idx + 1,
          name: user.employeeId?.fullName || '',
          username: user.username,
          role: user.role,
          status: user.status,
        }));
        setData(users);
        setDepartments(departmentsData || []);
        setPositions(positionsData || []);
      } catch (error) {
        message.error(error.message || 'Lỗi khi lấy dữ liệu!');
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      render: (text, record) => record.id,
    },
    {
      title: 'Tên người dùng',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <Link to={`/admin/users/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username',
    },
    // {
    //   title: 'Email',
    //   dataIndex: 'email',
    //   key: 'email',
    // },
    // {
    //   title: 'Phòng ban',
    //   dataIndex: 'department',
    //   key: 'department',
    //   filters: [
    //     { text: 'IT', value: 'IT' },
    //     { text: 'HR', value: 'HR' },
    //     { text: 'Finance', value: 'Finance' },
    //     { text: 'Marketing', value: 'Marketing' },
    //   ],
    //   onFilter: (value, record) => record.department === value,
    // },
    // {
    //   title: 'Chức vụ',
    //   dataIndex: 'position',
    //   key: 'position',
    // },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: role => {
        let color = '';
        let text = '';
        
        switch (role) {
          case 'admin':
            color = 'red';
            text = 'Quản trị viên';
            break;
          case 'manager':
            color = 'blue';
            text = 'Quản lý';
            break;
          default:
            color = 'green';
            text = 'Nhân viên';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: 'Quản trị viên', value: 'admin' },
        { text: 'Quản lý', value: 'manager' },
        { text: 'Nhân viên', value: 'employee' },
      ],
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
                icon: <EditOutlined />,
                label: 'Reset password',
                onClick: () => showResetPasswordModal(record)
              },
              {
                key: 'delete',
                icon: <DeleteOutlined />,
                label: 'Xóa',
                danger: true,
                onClick: () => showDeleteConfirm(record)
              }
            ]
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const showDeleteConfirm = (user) => {
    setUserToDelete(user);
    setDeleteModalVisible(true);
  };

  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      await Admin_account.deleteAccount(userToDelete.key);
      message.success(`Đã xóa người dùng: ${userToDelete.name}`);
      setDeleteModalVisible(false);
      // Reload lại danh sách tài khoản
      const accounts = await Admin_account.getAllAcount();
      const users = (accounts || []).map((user, idx) => ({
        key: user._id || idx,
        id: idx + 1,
        name: user.employeeId?.fullName || '',
        username: user.username,
        role: user.role,
        status: user.status,
      }));
      setData(users);
    } catch (error) {
      message.error(error.message || 'Lỗi khi xóa người dùng!');
    } finally {
      setLoading(false);
    }
  };

  const showEditModal = async (user) => {
    setUserToEdit(user);
    try {
      // Lấy thông tin chi tiết của tài khoản
      const accountDetail = await Admin_account.getAccountById(user.key);
      if (accountDetail) {
        // Chuẩn bị dữ liệu cho form
        const formData = {
          _id: accountDetail._id,
          username: accountDetail.username,
          role: accountDetail.role,
          status: accountDetail.status,
          // Thông tin nhân viên
          fullName: accountDetail.employeeId?.fullName,
          email: accountDetail.employeeId?.email,
          phone: accountDetail.employeeId?.phone,
          dob: accountDetail.employeeId?.dob ? moment(accountDetail.employeeId.dob) : null,
          gender: accountDetail.employeeId?.gender,
          departmentId: accountDetail.employeeId?.departmentId,
          positionId: accountDetail.employeeId?.positionId,
          joinDate: accountDetail.employeeId?.joinDate ? moment(accountDetail.employeeId.joinDate) : null,
          bankAccount: accountDetail.employeeId?.bankAccount,
          bankName: accountDetail.employeeId?.bankName
        };
        form.setFieldsValue(formData);
      }
    } catch (error) {
      message.error('Không thể lấy thông tin chi tiết tài khoản!');
      console.error('Error fetching account details:', error);
    }
    setEditModalVisible(true);
  };

  const handleEditUser = () => {
    form.validateFields().then(async (values) => {
      setLoading(true);
      try {
        // Chuyển đổi dữ liệu trước khi gửi lên server
        const accountData = {
          ...values,
          departmentId: values.departmentId ? values.departmentId : null,
          positionId: values.positionId ? values.positionId : null
        };

        // Gọi API cập nhật tài khoản
        await Admin_account.updateAccount(userToEdit.key, accountData);
        message.success('Đã cập nhật người dùng thành công!');
        setEditModalVisible(false);
        // Reload lại danh sách tài khoản
        const accounts = await Admin_account.getAllAcount();
        const users = (accounts || []).map((user, idx) => ({
          key: user._id || idx,
          id: idx + 1,
          name: user.employeeId?.fullName || '',
          username: user.username,
          role: user.role,
          status: user.status,
        }));
        setData(users);
      } catch (error) {
        message.error(error.message || 'Lỗi khi cập nhật người dùng!');
      } finally {
        setLoading(false);
      }
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Vui lòng chọn ít nhất một người dùng để xóa');
      return;
    }
    Modal.confirm({
      title: 'Xóa người dùng',
      content: `Bạn có chắc chắn muốn xóa ${selectedRowKeys.length} người dùng đã chọn?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        setData(prev => prev.filter(user => !selectedRowKeys.includes(user.key)));
        message.success(`Đã xóa ${selectedRowKeys.length} người dùng`);
        setSelectedRowKeys([]);
      },
    });
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
        //   email: row[2] || '',
        //   department: row[3] || '',
        //   position: row[4] || '',
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
    //   user.department,
    //   user.position,
      user.role,
      user.status
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

  const handleAddUser = () => {
    addForm.validateFields().then(async (values) => {
      setLoading(true);
      try {
        // Chuyển đổi dữ liệu trước khi gửi lên server
        const accountData = {
          ...values,
          departmentId: values.departmentId ? values.departmentId : null,
          positionId: values.positionId ? values.positionId : null
        };

        await Admin_account.createAccount(accountData);
        message.success('Thêm tài khoản thành công!');
        setAddModalVisible(false);
        // Reload lại danh sách tài khoản
        const accounts = await Admin_account.getAllAcount();
        const users = (accounts || []).map((user, idx) => ({
          key: user._id || idx,
          id: idx + 1,
          name: user.employeeId?.fullName || '',
          username: user.username,
          role: user.role,
          status: user.status,
        }));
        setData(users);
      } catch (error) {
        message.error(error.message || 'Lỗi khi thêm tài khoản!');
      } finally {
        setLoading(false);
      }
    });
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
              {
                key: 'delete-selected',
                text: 'Xóa đã chọn',
                onSelect: () => {
                  if (selectedRowKeys.length > 0) {
                    handleBulkDelete();
                  } else {
                    message.warning('Vui lòng chọn ít nhất một người dùng');
                  }
                }
              }
            ]
          }}
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 10 }}
          loading={loading}
          style={{ borderRadius: '8px', overflow: 'hidden' }}
          className="modern-table"
        />
      </Card>

      <Modal
        title="Xác nhận xóa người dùng"
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onOk={handleDeleteUser}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa người dùng {userToDelete?.name}?</p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>

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
          name="editUserForm"
        >
          <Row gutter={16}>
            <Col span={24}>
              <Title level={5}>Thông tin tài khoản</Title>
            </Col>
            <Col span={12}>
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
                <Input prefix={<UserOutlined />} placeholder="Nhập tên đăng nhập" />
          </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Vai trò"
                rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
              >
                <Select placeholder="Chọn vai trò">
                  <Select.Option value="admin">Quản trị viên</Select.Option>
                  <Select.Option value="manager">Quản lý</Select.Option>
                  <Select.Option value="staff">Nhân viên</Select.Option>
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

          <Divider />

          <Row gutter={16}>
            <Col span={24}>
              <Title level={5}>Thông tin công việc</Title>
            </Col>
            <Col span={12}>
              <Form.Item
                name="departmentId"
            label="Phòng ban"
              >
                <Select 
                  placeholder="Chọn phòng ban"
                  allowClear
                  showSearch
                  optionFilterProp="children"
                >
                  {departments.map(dept => (
                    <Select.Option key={dept._id} value={dept._id}>
                      {dept.name}
                    </Select.Option>
                  ))}
            </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="positionId"
            label="Chức vụ"
              >
                <Select 
                  placeholder="Chọn chức vụ"
                  allowClear
                  showSearch
                  optionFilterProp="children"
                >
                  {positions.map(pos => (
                    <Select.Option key={pos._id} value={pos._id}>
                      {pos.name}
                    </Select.Option>
                  ))}
            </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
          <Form.Item
                name="joinDate"
                label="Ngày vào làm"
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  placeholder="Chọn ngày vào làm"
                  format="DD/MM/YYYY"
                />
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
              <Title level={5}>Thông tin ngân hàng</Title>
            </Col>
            <Col span={12}>
              <Form.Item
                name="bankAccount"
                label="Số tài khoản"
              >
                <Input placeholder="Nhập số tài khoản" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="bankName"
                label="Tên ngân hàng"
              >
                <Input placeholder="Nhập tên ngân hàng" />
              </Form.Item>
            </Col>
          </Row>
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
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
                <Input prefix={<UserOutlined />} placeholder="Nhập tên đăng nhập" />
          </Form.Item>
            </Col>
            <Col span={12}>
          <Form.Item
            name="password"
            label="Mật khẩu"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' }, 
                  { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' }
                ]}
          >
                <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
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

          <Divider />

          <Row gutter={16}>
            <Col span={24}>
              <Title level={5}>Thông tin công việc</Title>
            </Col>
            <Col span={12}>
              <Form.Item
                name="departmentId"
                label="Phòng ban"
          >
            <Select
                  placeholder="Chọn phòng ban"
                  allowClear
              showSearch
              optionFilterProp="children"
                >
                  {departments.map(dept => (
                    <Select.Option key={dept._id} value={dept._id}>
                      {dept.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="positionId"
                label="Chức vụ"
              >
                <Select 
                  placeholder="Chọn chức vụ"
                  allowClear
                  showSearch
                  optionFilterProp="children"
                >
                  {positions.map(pos => (
                    <Select.Option key={pos._id} value={pos._id}>
                      {pos.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="joinDate"
                label="Ngày vào làm"
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  placeholder="Chọn ngày vào làm"
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
          >
            <Select placeholder="Chọn vai trò">
              <Select.Option value="admin">Quản trị viên</Select.Option>
              <Select.Option value="manager">Quản lý</Select.Option>
              <Select.Option value="staff">Nhân viên</Select.Option>
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
              <Title level={5}>Thông tin ngân hàng</Title>
            </Col>
            <Col span={12}>
              <Form.Item
                name="bankAccount"
                label="Số tài khoản"
              >
                <Input placeholder="Nhập số tài khoản" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="bankName"
                label="Tên ngân hàng"
              >
                <Input placeholder="Nhập tên ngân hàng" />
              </Form.Item>
            </Col>
          </Row>
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
