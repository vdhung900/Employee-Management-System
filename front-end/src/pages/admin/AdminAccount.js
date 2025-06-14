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
  Select
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
  FilterOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Admin_account from '../../services/Admin_account';

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
  const [employeeList, setEmployeeList] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      try {
        const accounts = await Admin_account.getAllAcount();
        // Map dữ liệu trả về từ API sang format cho table, id là số thứ tự
        const users = (accounts || []).map((user, idx) => ({
          key: user._id || idx,
          id: idx + 1, // Số thứ tự
          name: user.employeeId?.fullName || '',
          username: user.username,
          role: user.role,
          status: user.status,
        }));
        setData(users);
        // Lấy danh sách employeeId để chọn khi thêm tài khoản
        // Giả sử có API Admin_account.getAllEmployees()
        if (Admin_account.getAllEmployees) {
          const employees = await Admin_account.getAllEmployees();
          setEmployeeList(employees);
        }
      } catch (error) {
        message.error(error.message || 'Lỗi khi lấy danh sách tài khoản!');
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
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
          overlay={
            <Menu>
              <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => showEditModal(record)}>
                Chỉnh sửa
              </Menu.Item>
              <Menu.Item key="reset" icon={<EditOutlined />} onClick={() => showResetPasswordModal(record)}>
                Reset password
              </Menu.Item>
              <Menu.Item 
                key="delete" 
                icon={<DeleteOutlined />} 
                danger
                onClick={() => showDeleteConfirm(record)}
              >
                Xóa
              </Menu.Item>
            </Menu>
          }
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

  const handleDeleteUser = () => {
    setLoading(true);
    setTimeout(() => {
      setData(prev => prev.filter(user => user.id !== userToDelete.id));
      message.success(`Đã xóa người dùng: ${userToDelete.name}`);
      setLoading(false);
      setDeleteModalVisible(false);
      // Ở đây sẽ cần gọi API để xóa người dùng thực tế
    }, 1000);
  };

  const showEditModal = (user) => {
    setUserToEdit(user);
    form.setFieldsValue(user);
    setEditModalVisible(true);
  };

  const handleEditUser = () => {
    form.validateFields().then(async (values) => {
      setLoading(true);
      try {
        // Gọi API cập nhật tài khoản
        await Admin_account.updateAccount(userToEdit.key, values);
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
        await Admin_account.resetPassword(userToReset.key, { password: values.password });
        message.success('Đặt lại mật khẩu thành công!');
        setResetPasswordModalVisible(false);
      } catch (error) {
        message.error(error.message || 'Lỗi khi đặt lại mật khẩu!');
      } finally {
        setLoading(false);
      }
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
        await Admin_account.createAccount(values);
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
      >
        <Form
          form={form}
          layout="vertical"
          name="editUserForm"
        >
          {/* <Form.Item
            name="name"
            label="Tên người dùng"
            rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
          >
            <Input />
          </Form.Item> */}
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input />
          </Form.Item>
          {/* <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
          >
            <Input />
          </Form.Item> */}
          {/* <Form.Item
            name="department"
            label="Phòng ban"
            rules={[{ required: true, message: 'Vui lòng chọn phòng ban!' }]}
          >
            <Select placeholder="Chọn phòng ban">
              <Select.Option value="IT">IT</Select.Option>
              <Select.Option value="HR">HR</Select.Option>
              <Select.Option value="Finance">Finance</Select.Option>
              <Select.Option value="Marketing">Marketing</Select.Option>
            </Select>
          </Form.Item> */}
          {/* <Form.Item
            name="position"
            label="Chức vụ"
            rules={[{ required: true, message: 'Vui lòng chọn chức vụ!' }]}
          >
            <Select placeholder="Chọn chức vụ">
              <Select.Option value="Manager">Manager</Select.Option>
              <Select.Option value="Team Lead">Team Lead</Select.Option>
              <Select.Option value="Senior Staff">Senior Staff</Select.Option>
              <Select.Option value="Staff">Staff</Select.Option>
              <Select.Option value="Intern">Intern</Select.Option>
            </Select>
          </Form.Item> */}
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
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }, { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' }]}
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
      >
        <Form form={addForm} layout="vertical">
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }, { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="employeeId"
            label="Nhân viên (employeeId)"
            rules={[{ required: true, message: 'Vui lòng chọn nhân viên!' }]}
          >
            <Select
              showSearch
              placeholder="Chọn nhân viên"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {employeeList.map(emp => (
                <Select.Option key={emp._id} value={emp._id}>
                  {emp.fullName} ({emp._id})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
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
