import React, { useState, useEffect } from 'react';

import {
    Card,
    Typography,
    Row,
    Col,
    Button,
    Table,
    Input,
    Space,
    Tag,
    Dropdown,
    Modal,
    Form,
    Select,
    DatePicker,
    Upload,
    Avatar,
    Divider,
    Tooltip,
    Tabs,
    Badge,
    Timeline,
    Progress,
    Statistic,
    Spin,
    message
} from 'antd';
import {
    SearchOutlined,
    UserAddOutlined,
    EditOutlined,
    DeleteOutlined,
    MoreOutlined,
    FilterOutlined,
    ExportOutlined,
    ImportOutlined,
    EyeOutlined,
    TeamOutlined,
    IdcardOutlined,
    UploadOutlined,
    DownOutlined,
    FileTextOutlined,
    MailOutlined,
    PhoneOutlined,
    HomeOutlined,
    CalendarOutlined,
    BankOutlined,
    ClockCircleOutlined,
    BarChartOutlined,
    AuditOutlined,
    EnvironmentOutlined,
    LaptopOutlined,
    MobileOutlined,
    ExclamationCircleOutlined,
    InfoCircleOutlined,
    UserOutlined
} from '@ant-design/icons';
import ThreeDContainer from '../../components/3d/ThreeDContainer';
import Hr_ManageEmployee from '../../services/Hr_ManageEmployee';
import Admin_account from '../../services/Admin_account';
import moment from 'moment';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import UploadFileComponent from '../../components/file-list/FileList';
const { Title, Text } = Typography;
const { Option } = Select;

const StaffManagement = () => {
    const isHR = true;
    const isManager = false;

    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalType, setModalType] = useState('add');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState('1');
    const [filterDepartment, setFilterDepartment] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [activityModalVisible, setActivityModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [positions, setPositions] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [salaryCoefficients, setSalaryCoefficients] = useState([]);
    const [fileResponse, setFileResponse] = useState([]);
    const [fileAvatar, setFileAvatar] = useState('');
    const [avatar, setAvatar] = useState('');
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

    const showModal = async (type, employee = null) => {
        setModalType(type);
        if (type === "view" && employee.avatar) {
            const a = await Hr_ManageEmployee.getAvatar(employee.avatar);
            setFileAvatar(a.data);
        }
        setSelectedEmployee(employee);
        setIsModalVisible(true);

        if (type === 'edit' && employee) {
            form.setFieldsValue({
                fullName: employee.fullName,
                employeeId: employee.employeeId,
                email: employee.email,
                phone: employee.phone,
                dob: employee.dob ? moment(employee.dob) : null,
                positionId: employee.positionId?._id,
                departmentId: employee.departmentId?._id,
                joinDate: employee.joinDate ? moment(employee.joinDate) : null,
                resignDate: employee.resignDate ? moment(employee.resignDate) : null,
                salaryCoefficientId: employee.salaryCoefficientId?._id,
                bankAccount: employee.bankAccount,
                bankName: employee.bankName,
                document: employee.document,
                contractId: employee.contractId?._id,
                status: employee.status,
                code: employee.code,
                avatar: employee.avatar,
                address: employee.address,
                gender: employee.gender,
            });
            if (employee.avatar) {
                setFileResponse(employee.avatar ? [{ key: employee.avatar }] : []);

            }
            setAvatar(employee.avatar);
            setFileAvatar(getfileAvatar(employee.avatar));
        } else {
            form.resetFields();
          
        }
    };

    const handleCancel = () => {
        setFileAvatar('');
        setAvatar('');
        setFileResponse([]);
        setIsModalVisible(false);
    };

    const handleFormSubmit = async (values) => {
        console.log('Form submitted:', values);
        try {
            if (modalType === 'edit' && selectedEmployee) {
                console.log('Attempting to update employee:', selectedEmployee._id);
                // Lấy link avatar từ fileResponse nếu có
                if (fileResponse && fileResponse[0]?.key) {
                    values.avatar = fileResponse[0].key;
                }
                // Call the API to update the employee information
                const response = await Hr_ManageEmployee.updateEmployee(selectedEmployee._id, values);
                console.log('API response:', response);
                if (response.success) {
                    const response1 = await Hr_ManageEmployee.getAllEmployee();
                    // Update the local state to reflect changes
                    setEmployees(response1.data);

                    // Close the modal and show success message
                    setFileAvatar('');
                    setAvatar('');
                    setFileResponse([]);
                    setIsModalVisible(false);
                    
                    
                    message.success('Cập nhật thành công');
                } else {
                    console.error('Update failed:', response);
                    message.error('Cập nhật thất bại');
                }
            } else if (modalType === 'add') {
                // Lấy link avatar từ fileResponse nếu có
                if (fileResponse && fileResponse[0]?.key) {
                    values.avatar = fileResponse[0].key;
                }
                // Call the API to add a new employee
                const response = await Hr_ManageEmployee.addEmployee(values);
                console.log('API response:', response);
                if (response.success) {
                    // Refresh the employee list
                    // fetchEmployees();
                    // Close the modal and show success message
                    setFileAvatar('');
                    setAvatar('');
                    setFileResponse([]);
                    setIsModalVisible(false);
                    message.success('Thêm mới thành công');
                } else {
                    console.error('Add failed:', response);
                    message.error('Thêm mới thất bại');
                }
            }
        } catch (error) {
            console.error('Failed to update employee:', error);
            message.error('Có lỗi xảy ra khi cập nhật');
        }
    };

    const handleDepartmentChange = (value) => {
        console.log('Department filter changed to:', value);
        setFilterDepartment(value);
    };

    const handleStatusChange = (value) => {
        console.log('Status filter changed to:', value);
        setFilterStatus(value);
    };
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
            sorter: (a, b) => a.fullName.localeCompare(b.fullName),
            filteredValue: searchText ? [searchText] : null,
            onFilter: (value, record) =>
                record.fullName.toLowerCase().includes(value.toLowerCase()) ||
                record.code.toLowerCase().includes(value.toLowerCase()) ||
                record.positionId?.name.toLowerCase().includes(value.toLowerCase()) ||
                record.departmentId?.name.toLowerCase().includes(value.toLowerCase()) ||
                record.email.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: 'Liên hệ',
            key: 'contact',
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <div><MailOutlined /> {record.email}</div>
                    <div><PhoneOutlined /> {record.phone}</div>
                </Space>
            ),
            filteredValue: null,
        },
        {
            title: 'Phòng ban',
            dataIndex: 'departmentId',
            key: 'departmentId',
            render: (text, record) => record.departmentId?.name,
            filters: departments.map(dept => ({ text: dept.name, value: dept._id })),
            onFilter: (value, record) => record.departmentId?._id === value,
            filteredValue: filterDepartment !== 'all' ? [filterDepartment] : null,
        },
        {
            title: 'Vị trí',
            dataIndex: 'positionId',
            key: 'positionId',
            render: (text, record) => record.positionId?.name,
            // filters: positions.map(pos => ({ text: pos.name, value: pos._id })),
            // onFilter: (value, record) => {
            //     console.log('Filtering by position:', value, 'Record position:', record.positionId?._id);
            //     return record.positionId?._id === value;
            // },
            // filteredValue: null,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {getStatusLabel(status)}
                </Tag>
            ),
            filters: [
                { text: 'Đang làm việc', value: 'active' },
                { text: 'Nghỉ việc', value: 'inactive' },
                { text: 'Nghỉ phép', value: 'leave' },
            ],
            onFilter: (value, record) => {
                console.log('Filtering by status:', value, 'Record status:', record.status);
                return record.status === value;
            },
            filteredValue: filterStatus !== 'all' ? [filterStatus] : null,
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => showModal('view', record)}
                    />
                    {isHR && (
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => showModal('edit', record)}
                        />
                    )}
                    {isManager && (
                        <Button
                            type="text"
                            icon={<InfoCircleOutlined />}
                            onClick={() => showActivityModal(record)}
                        />
                    )}
                </Space>
            ),
            filteredValue: null,
        },
    ];

    const showActivityModal = (employee) => {
        setSelectedEmployee(employee);
        setActivityModalVisible(true);
    };


    const exportToExcel = () => {
        const exportData = employees.map(employee => ({
            'Họ và tên': employee.fullName,
            'Mã nhân viên': employee.code,
            'Email': employee.email,
            'Số điện thoại': employee.phone,
            'địa chỉ': employee.address,
            'Phòng ban': employee.departmentId?.name,
            'Vị trí': employee.positionId?.name,
            'Trạng thái': getStatusLabel(employee.status),
            'Ngày vào làm': employee.joinDate ? moment(employee.joinDate).format('YYYY-MM-DD') : '',
            'Ngày hết hạn hợp đồng': employee.resignDate ? moment(employee.resignDate).format('YYYY-MM-DD') : '',
            'Tài khoản ngân hàng': employee.bankAccount,
            'Tên ngân hàng': employee.bankName,
            'Loại hợp đồng': employee.contractId?.contract_type,
            'Hệ số lương': employee.salaryCoefficientId?.salary_coefficient,
            'Giới tính': employee.gender
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'employee_list.xlsx');
    };

    useEffect(() => {

        const fetchEmployees = async () => {
            setLoading(true);
            try {

                const response = await Hr_ManageEmployee.getAllEmployee();
                setEmployees(response.data);
            } catch (error) {
                console.error('Failed to fetch employees:', error);
            } finally {
                setLoading(false);
            }
        };


        const fetchDepartmentsAndPositions = async () => {
            try {
                const departmentsResponse = await Admin_account.getAllDepartments();
                setDepartments(departmentsResponse.data);

                const salaryCoefficientsResponse = await Hr_ManageEmployee.getAllCoefficients();
                setSalaryCoefficients(salaryCoefficientsResponse.data);

                const contractsResponse = await Hr_ManageEmployee.getAllContracts();
                setContracts(contractsResponse.data);

                const positionsResponse = await Admin_account.getAllPositions();
                setPositions(positionsResponse.data);




            } catch (error) {
                console.error('Failed to fetch departments or positions:', error);
            }
        };

        const fetchContracts = async () => {
            try {
                const contractsResponse = await Hr_ManageEmployee.getAllContracts();
                setContracts(contractsResponse.data);
            } catch (error) {
                console.error('Failed to fetch contracts:', error);
            }
        };

        const fetchAvatar = async () => {
            try {
                if (avatar) {
                    let a = await Hr_ManageEmployee.getAvatar(avatar);
                    setFileAvatar(a.data);
                }

            } catch (error) {
                console.error('Failed to fetch fileAvatar:', error);
            }

        }

        fetchAvatar();
        fetchEmployees();
        fetchDepartmentsAndPositions();
        fetchContracts();
    }, []);


    const getfileAvatar = async (a) => {
        try {
            const respone = await Hr_ManageEmployee.getAvatar(a);
            return respone.data;


        } catch (error) {
            console.error('Failed to fetch fileAvatar:', error);
        }

    }

    // Lọc theo fullName hoặc code
    const filteredEmployees = employees.filter(emp => {
        if (searchText) {
            return emp.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
                emp.code.toLowerCase().includes(searchText.toLowerCase())
        }
        return emp;
    });

    // Khi fileResponse thay đổi (chọn ảnh mới), cập nhật fileAvatar để xem trước
    useEffect(() => {
        const fetchNewAvatar = async () => {
            if (fileResponse && fileResponse[0]?.key) {
                try {
                    const res = await Hr_ManageEmployee.getAvatar(fileResponse[0].key);
                    setFileAvatar(res.data);
                } catch (error) {
                    setFileAvatar('');
                }
            }
        };
        fetchNewAvatar();
    }, [fileResponse]);


    return (
        <ThreeDContainer>
      <div style={{ padding: 24, minHeight: '100vh', background: '#fff' }}>
        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
          <Col span={24}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <TeamOutlined style={{ fontSize: 32, color: '#1976d2' }} />
              <div>
                <Title level={2} style={{ margin: 0, color: '#222', fontWeight: 700, letterSpacing: 1 }}>Quản lý nhân viên</Title>
                <Text type="secondary" style={{ fontSize: 16, color: '#666' }}>
                  Theo dõi, thêm, sửa, xuất danh sách nhân viên trong hệ thống
                </Text>
              </div>
            </div>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card
              bordered={false}
              style={{ borderRadius: 16, boxShadow: '0 4px 24px #0001', padding: 24 }}
            >
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <Input
                  placeholder="Tìm kiếm nhân viên, mã nhân viên..."
                  prefix={<SearchOutlined />}
                  style={{ width: 300, maxWidth: '100%' }}
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  allowClear
                />
                <Space>
                  <Select
                    style={{ width: 180 }}
                    placeholder="Phòng ban"
                    value={filterDepartment}
                    onChange={handleDepartmentChange}
                  >
                    <Option value="all">Tất cả phòng ban</Option>
                    {departments.map(dept => (
                      <Option key={dept._id} value={dept._id}>{dept.name}</Option>
                    ))}
                  </Select>
                  <Select
                    style={{ width: 180 }}
                    placeholder="Trạng thái"
                    value={filterStatus}
                    onChange={handleStatusChange}
                  >
                    <Option value="all">Tất cả trạng thái</Option>
                    <Option value="active">Đang làm việc</Option>
                    <Option value="inactive">Nghỉ việc</Option>
                    <Option value="leave">Nghỉ phép</Option>
                  </Select>
                  <Button icon={<FilterOutlined />}>Lọc</Button>
                  <Button icon={<ExportOutlined />} onClick={exportToExcel}>Export</Button>
                  <Button
                    type="primary"
                    icon={<UserAddOutlined />}
                    onClick={() => showModal('add')}
                  >
                    Thêm nhân viên
                  </Button>
                </Space>
              </div>
              <Table
                dataSource={filteredEmployees}
                columns={columns}
                rowKey="_id"
                size="middle"
                pagination={{
                  defaultPageSize: 10,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '50', '100'],
                  showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} nhân viên`,
                }}
                style={{ borderRadius: 8, background: '#fff' }}
              />
            </Card>
          </Col>
        </Row>
        {/* Modal và các thành phần khác giữ nguyên, chỉ chỉnh lại style nếu cần */}
        {/* ... giữ nguyên phần Modal, Activity Modal ... */}
      </div>
    </ThreeDContainer>
    );
};

export default StaffManagement;
