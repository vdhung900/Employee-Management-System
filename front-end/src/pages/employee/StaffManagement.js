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
        <div style={{ padding: '24px' }}>
            <Card
                variant="outlined"
                styles={{
                    header: {
                        background: '#fafafa',
                        borderBottom: '1px solid #f0f0f0'
                    },
                    body: {
                        padding: '24px'
                    }
                }}
                title={
                    <Space>
                        <TeamOutlined />
                        <Title level={4} style={{ margin: 0 }}>Quản lý nhân viên</Title>
                    </Space>
                }
            >
                <Spin spinning={loading}>
                    <ThreeDContainer>
                        <Tabs
                            activeKey={activeTab}
                            onChange={setActiveTab}
                            items={[
                                {
                                    key: '1',
                                    label: <span><TeamOutlined /> Tất cả nhân viên</span>,
                                    children: (
                                        <Card>
                                            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                                                <Space>
                                                    <Input
                                                        placeholder="Tìm kiếm nhân viên, mã nhân viên..."
                                                        prefix={<SearchOutlined />}
                                                        style={{ width: 300 }}
                                                        value={searchText}
                                                        onChange={e => setSearchText(e.target.value)}
                                                        allowClear
                                                    />
                                                    <Select
                                                        style={{ width: 200 }}
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
                                                        style={{ width: 200 }}
                                                        placeholder="Trạng thái"
                                                        value={filterStatus}
                                                        onChange={handleStatusChange}
                                                    >
                                                        <Option value="all">Tất cả trạng thái</Option>
                                                        <Option value="active">Đang làm việc</Option>
                                                        <Option value="inactive">Nghỉ việc</Option>
                                                        <Option value="leave">Nghỉ phép</Option>
                                                    </Select>
                                                </Space>
                                                <Space>
                                                    {isHR && (
                                                        <>
                                                            <Button icon={<FilterOutlined />}>Lọc</Button>
                                                            <Button icon={<ExportOutlined />} onClick={exportToExcel}>Export</Button>
                                                        </>
                                                    )}
                                                </Space>
                                            </div>
                                            <Table
                                                dataSource={filteredEmployees}
                                                columns={columns}
                                                rowKey="id"
                                                pagination={{
                                                    defaultPageSize: 10,
                                                    showSizeChanger: true,
                                                    pageSizeOptions: ['10', '20', '50', '100'],
                                                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} nhân viên`,
                                                }}
                                            />
                                        </Card>
                                    )
                                }
                                ,
                                // isHR && {
                                //     key: '2',
                                //     label: <span><IdcardOutlined /> Hợp đồng</span>,
                                //     children: (
                                //         <Card>
                                //             <Text>Quản lý hợp đồng lao động</Text>
                                //         </Card>
                                //     )
                                // },
                                // isHR && {
                                //     key: '3',
                                //     label: <span><FileTextOutlined /> Báo cáo</span>,
                                //     children: (
                                //         <Card>
                                //             <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                                //                 <Space>
                                //                     <Input
                                //                         placeholder="Tìm kiếm nhân viên, ID, phòng ban..."
                                //                         prefix={<SearchOutlined />}
                                //                         style={{ width: 300 }}
                                //                         value={searchText}
                                //                         onChange={e => setSearchText(e.target.value)}
                                //                         allowClear
                                //                     />
                                //                     <Select
                                //                         style={{ width: 200 }}
                                //                         placeholder="Phòng ban"
                                //                         value={filterDepartment}
                                //                         onChange={setFilterDepartment}
                                //                     >
                                //                         <Option value="all">Tất cả phòng ban</Option>
                                //                         {departments.map(dept => (
                                //                             <Option key={dept._id} value={dept._id}>{dept.name}</Option>
                                //                         ))}
                                //                     </Select>
                                //                     <Select
                                //                         style={{ width: 200 }}
                                //                         placeholder="Trạng thái"
                                //                         value={filterStatus}
                                //                         onChange={setFilterStatus}
                                //                     >
                                //                         <Option value="all">Tất cả trạng thái</Option>
                                //                         <Option value="active">Đang làm việc</Option>
                                //                         <Option value="inactive">Nghỉ việc</Option>
                                //                         <Option value="leave">Nghỉ phép</Option>
                                //                     </Select>
                                //                 </Space>
                                //                 <Space>
                                //                     {isHR && (
                                //                         <>
                                //                             <Button icon={<FilterOutlined />}>Lọc</Button>
                                //                             <Button icon={<ExportOutlined />}>Export</Button>
                                //                             <Button
                                //                                 type="primary"
                                //                                 icon={<UserAddOutlined />}
                                //                                 onClick={() => showModal('add')}
                                //                             >
                                //                                 Thêm nhân viên
                                //                             </Button>
                                //                         </>
                                //                     )}
                                //                 </Space>
                                //             </div>
                                //             <Table
                                //                 dataSource={filteredEmployees}
                                //                 columns={columns}
                                //                 rowKey="id"
                                //                 pagination={{
                                //                     defaultPageSize: 10,
                                //                     showSizeChanger: true,
                                //                     pageSizeOptions: ['10', '20', '50', '100'],
                                //                     showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} nhân viên`,
                                //                 }}
                                //             />
                                //         </Card>
                                //     )

                                // },
                                isManager && {
                                    key: '4',
                                    label: <span><BarChartOutlined /> Hiệu suất</span>,
                                    children: (
                                        <Card>
                                            <Text>Phân tích hiệu suất nhân viên</Text>
                                        </Card>
                                    )
                                }

                            ].filter(Boolean)}
                        />
                    </ThreeDContainer>

                    {/* Employee Details Modal */}
                    <Modal
                        title={modalType === 'view' ? 'Chi tiết nhân viên' : modalType === 'edit' ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
                        open={isModalVisible}
                        onCancel={handleCancel}
                        footer={modalType === 'view' ? [
                            <Button key="close" onClick={handleCancel}>
                                Đóng
                            </Button>
                        ] : [
                            <Button key="cancel" onClick={handleCancel}>
                                Hủy
                            </Button>,
                            <Button key="submit" type="primary" onClick={() => form.submit()}>
                                {modalType === 'edit' ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        ]}
                        width={800}
                    >
                        {modalType === 'view' ? (
                            selectedEmployee && (
                                <div style={{ padding: '24px', background: '#f4f6fa', borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                                    <Row gutter={[16, 16]} justify="center">
                                        <Col span={24} style={{ textAlign: 'center', marginBottom: 16 }}>
                                            <Avatar
                                                size={100}
                                                style={{ backgroundColor: '#fff', border: '3px solidrgb(205, 190, 225)', marginBottom: '12px' }}
                                                src={fileAvatar}
                                            >
                                                {!selectedEmployee.avatar && selectedEmployee.fullName.charAt(0)}
                                            </Avatar>

                                            <Title level={2} style={{ marginTop: 12, marginBottom: 0, color: '#2d2d2d', fontWeight: 700 }}>
                                                {selectedEmployee.fullName}
                                            </Title>
                                            <Text type="secondary" style={{ fontSize: '18px', color: '#722ed1', fontWeight: 500 }}>{selectedEmployee.positionId?.name}</Text>
                                        </Col>
                                    </Row>

                                    <Divider orientation="left" style={{ color: '#722ed1', fontWeight: 'bold', fontSize: 18 }}>
                                        <IdcardOutlined style={{ color: '#722ed1', marginRight: 8 }} />Thông tin cá nhân
                                    </Divider>
                                    <Card style={{ marginBottom: 16, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }} bordered={false}>
                                        <Row gutter={[16, 16]}>
                                            <Col span={12}><Text strong><IdcardOutlined /> Mã nhân viên:</Text> {selectedEmployee.code}</Col>
                                            <Col span={12}><Text strong><Tag color={getStatusColor(selectedEmployee.status)}>{getStatusLabel(selectedEmployee.status)}</Tag></Text></Col>
                                            <Col span={12}><Text strong><UserAddOutlined /> Giới tính:</Text> {selectedEmployee.gender === 'male' ? 'Nam' : selectedEmployee.gender === 'female' ? 'Nữ' : 'Khác'}</Col>
                                            <Col span={12}><Text strong><HomeOutlined /> Địa chỉ:</Text> {selectedEmployee.address}</Col>
                                            <Col span={12}><Text strong><CalendarOutlined /> Ngày sinh:</Text> {selectedEmployee.dob ? moment(selectedEmployee.dob).format('DD-MM-YYYY') : ''}</Col>
                                        </Row>
                                    </Card>

                                    <Divider orientation="left" style={{ color: '#1890ff', fontWeight: 'bold', fontSize: 18 }}>
                                        <LaptopOutlined style={{ color: '#1890ff', marginRight: 8 }} />Thông tin công việc
                                    </Divider>
                                    <Card style={{ marginBottom: 16, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }} bordered={false}>
                                        <Row gutter={[16, 16]}>
                                            <Col span={12}><Text strong><BankOutlined /> Phòng ban:</Text> {selectedEmployee.departmentId?.name}</Col>
                                            <Col span={12}><Text strong><IdcardOutlined /> Vị trí:</Text> {selectedEmployee.positionId?.name}</Col>
                                            <Col span={12}><Text strong><CalendarOutlined /> Ngày vào làm:</Text> {selectedEmployee.joinDate ? moment(selectedEmployee.joinDate).format('YYYY-MM-DD') : ''}</Col>
                                            <Col span={12}><Text strong><CalendarOutlined /> Ngày hết hạn hợp đồng:</Text> {selectedEmployee.resignDate ? moment(selectedEmployee.resignDate).format('YYYY-MM-DD') : ''}</Col>
                                            <Col span={12}><Text strong><FileTextOutlined /> Loại hợp đồng:</Text> {selectedEmployee.contractId?.contract_type}</Col>
                                            <Col span={12}><Text strong><BarChartOutlined /> Hệ số lương:</Text> {selectedEmployee.salaryCoefficientId?.salary_coefficient}</Col>
                                        </Row>
                                    </Card>

                                    <Divider orientation="left" style={{ color: '#13c2c2', fontWeight: 'bold', fontSize: 18 }}>
                                        <MailOutlined style={{ color: '#13c2c2', marginRight: 8 }} />Thông tin liên hệ
                                    </Divider>
                                    <Card style={{ marginBottom: 16, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }} bordered={false}>
                                        <Row gutter={[16, 16]}>
                                            <Col span={12}><Text strong><MailOutlined /> Email:</Text> {selectedEmployee.email}</Col>
                                            <Col span={12}><Text strong><PhoneOutlined /> Số điện thoại:</Text> {selectedEmployee.phone}</Col>
                                        </Row>
                                    </Card>

                                    <Divider orientation="left" style={{ color: '#faad14', fontWeight: 'bold', fontSize: 18 }}>
                                        <BankOutlined style={{ color: '#faad14', marginRight: 8 }} />Thông tin tài khoản
                                    </Divider>
                                    <Card style={{ background: '#fffbe6', borderRadius: 8, boxShadow: '0 2px 8px #eee' }} bordered={false}>
                                        <Row gutter={[16, 16]}>
                                            <Col span={12}><Text strong><BankOutlined /> Tài khoản ngân hàng:</Text> {selectedEmployee.bankAccount}</Col>
                                            <Col span={12}><Text strong><BankOutlined /> Tên ngân hàng:</Text> {selectedEmployee.bankName}</Col>
                                        </Row>
                                    </Card>
                                </div>
                            )
                        ) : (
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleFormSubmit}
                            >
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="avatar"
                                            label="Ảnh đại diện"
                                        >
                                            <UploadFileComponent uploadFileSuccess={setFileResponse} isSingle={true} files={fileResponse} />

                                        </Form.Item>
                                    </Col>
                                    {/* Hiển thị hình ảnh avatar xem trước */}

                                    {fileAvatar && (
                                        <Col span={12}>
                                            <div style={{ marginTop: 8 }}>
                                                <Avatar
                                                    size={100}
                                                    src={fileAvatar}
                                                    alt="Avatar Preview"
                                                />
                                            </div>
                                        </Col>
                                    )    }


                                    {/* <Col span={12}>
                                        <Form.Item
                                            name="code"
                                            label="Mã nhân viên"
                                            rules={[{ required: true, message: 'Vui lòng nhập mã nhân viên' }]}
                                        >
                                            <Input placeholder="Ví dụ: EMP001" />
                                        </Form.Item>
                                    </Col> */}
                                </Row>

                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="fullName"
                                            label="Họ và tên"
                                            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                                        >
                                            <Input placeholder="Nhập họ và tên" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="email"
                                            label="Email"
                                            rules={[
                                                { required: true, message: 'Vui lòng nhập email' },
                                                { type: 'email', message: 'Email không hợp lệ' }
                                            ]}
                                        >
                                            <Input placeholder="example@company.com" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="address"
                                            label="Địa chỉ"
                                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                                        >
                                            <Input placeholder="Nhập địa chỉ" />
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item
                                            name="phone"
                                            label="Số điện thoại"
                                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                                        >
                                            <Input placeholder="Nhập số điện thoại" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="gender"
                                            label="Giới tính"
                                            rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                                        >
                                            <Select placeholder="Chọn giới tính">
                                                <Option value="male">Nam</Option>
                                                <Option value="female">Nữ</Option>
                                                <Option value="other">Khác</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="dob"
                                            label="Ngày sinh"
                                            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
                                        >
                                            <DatePicker placeholder="Ngày sinh" format="DD-MM-YYYY" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="departmentId"
                                            label="Phòng ban"
                                            rules={[{ required: true, message: 'Vui lòng chọn phòng ban' }]}
                                        >
                                            <Select placeholder="Chọn phòng ban">
                                                {departments.map(dept => (
                                                    <Option key={dept._id} value={dept._id}>{dept.name}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="positionId"
                                            label="Vị trí"
                                            rules={[{ required: true, message: 'Vui lòng chọn vị trí' }]}
                                        >
                                            <Select placeholder="Chọn vị trí">
                                                {positions.map(pos => (
                                                    <Option key={pos._id} value={pos._id}>{pos.name}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="joinDate"
                                            label="Ngày vào làm"
                                            rules={[{ required: true, message: 'Vui lòng chọn ngày vào làm' }]}
                                        >
                                            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="resignDate"
                                            label="Ngày hết hạn hợp đồng"
                                            rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn' }]}
                                        >
                                            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                                        </Form.Item>
                                    </Col>
                                </Row>



                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="bankAccount"
                                            label="Tài khoản ngân hàng"
                                            rules={[{ required: true, message: 'Vui lòng nhập tài khoản ngân hàng' }]}
                                        >
                                            <Input placeholder="Nhập tài khoản ngân hàng" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="bankName"
                                            label="Tên ngân hàng"
                                            rules={[{ required: true, message: 'Vui lòng nhập tên ngân hàng' }]}
                                        >
                                            <Input placeholder="Nhập tên ngân hàng" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="salaryCoefficientId"
                                            label="Hệ số lương"
                                            rules={[{ required: true, message: 'Vui lòng nhập hệ số lương' }]}
                                        >
                                            <Select placeholder="Chọn hệ số lương">
                                                {salaryCoefficients.map(coefficient => (
                                                    <Option key={coefficient._id} value={coefficient._id}>{coefficient.salary_coefficient}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item
                                            name="contractId"
                                            label="Loại hợp đồng"
                                            rules={[{ required: true, message: 'Vui lòng chọn loại hợp đồng' }]}
                                        >
                                            <Select placeholder="Chọn loại hợp đồng">
                                                {contracts.map(contract => (
                                                    <Option key={contract._id} value={contract._id}>{contract.contract_type}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>

                                </Row>


                            </Form>
                        )}
                    </Modal>

                    {/* Activity Modal for Managers */}
                    <Modal
                        title="Hoạt động nhân viên"
                        open={activityModalVisible}
                        onCancel={() => setActivityModalVisible(false)}
                        footer={null}
                        width={800}
                    >
                        {selectedEmployee && (
                            <div>
                                <Row gutter={[16, 16]}>
                                    <Col span={24} style={{ textAlign: 'center', marginBottom: 16 }}>
                                        <Avatar size={80} style={{ backgroundColor: '#722ed1' }}>
                                            {selectedEmployee.fullName.charAt(0)}
                                        </Avatar>
                                        <Title level={3} style={{ marginTop: 16, marginBottom: 0 }}>
                                            {selectedEmployee.fullName}
                                        </Title>
                                        <Text type="secondary">{selectedEmployee.positionId?.name}</Text>
                                    </Col>
                                </Row>

                                <Divider orientation="left">Thống kê hoạt động</Divider>
                                <Row gutter={[16, 16]}>
                                    <Col span={8}>
                                        <Card>
                                            <Statistic
                                                title="Điểm chuyên cần"
                                                value={95}
                                                suffix="%"
                                                valueStyle={{ color: '#3f8600' }}
                                            />
                                            <Progress percent={95} status="active" />
                                        </Card>
                                    </Col>
                                    <Col span={8}>
                                        <Card>
                                            <Statistic
                                                title="Công việc hoàn thành"
                                                value={85}
                                                suffix="%"
                                                valueStyle={{ color: '#3f8600' }}
                                            />
                                            <Progress percent={85} status="active" />
                                        </Card>
                                    </Col>
                                    <Col span={8}>
                                        <Card>
                                            <Statistic
                                                title="Đánh giá hiệu suất"
                                                value={4.5}
                                                suffix="/5"
                                                valueStyle={{ color: '#3f8600' }}
                                            />
                                            <Progress percent={90} status="active" />
                                        </Card>
                                    </Col>
                                </Row>

                                <Divider orientation="left">Lịch sử hoạt động</Divider>
                                <Timeline>
                                    <Timeline.Item color="green">
                                        Hoàn thành báo cáo tuần - 2 giờ trước
                                    </Timeline.Item>
                                    <Timeline.Item color="blue">
                                        Tham gia cuộc họp dự án - 4 giờ trước
                                    </Timeline.Item>
                                    <Timeline.Item color="blue">
                                        Cập nhật tài liệu - 1 ngày trước
                                    </Timeline.Item>
                                    <Timeline.Item color="green">
                                        Hoàn thành task sprint - 2 ngày trước
                                    </Timeline.Item>
                                </Timeline>
                            </div>
                        )}
                    </Modal>
                </Spin>
            </Card>
        </div>
    );
};

export default StaffManagement;
