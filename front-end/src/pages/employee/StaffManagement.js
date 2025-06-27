import React, { useEffect, useState } from 'react';
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
    Spin
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
    InfoCircleOutlined
} from '@ant-design/icons';
import ThreeDContainer from '../../components/3d/ThreeDContainer';
import Hr_Employee from '../../services/Hr_Employee';
import Admin_account from '../../services/Admin_account';

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
    const [timeRange, setTimeRange] = useState(['', '']);
    const [activityModalVisible, setActivityModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [coefficient, setCoefficient] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [positions, setPositions] = useState([]);
    const [employees, setEmployees] = useState([]);

    // // Sample data





    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Admin_account.getAllPositions();
                const response1 = await Admin_account.getAllDepartments();
                const response2 = await Hr_Employee.getAllEmployee();
                const response3 = await Hr_Employee.getAllCoefficient();

                const departmentsData = response1.data;
                const positionsData = response.data;

                // Map departmentId to department name for each employee
                const employeesData = response2.data.map(employee => {
                    return {
                        ...employee,
                        department: employee.departmentId.name,
                        position: employee.positionId.name,
                    };
                });

                setCoefficient(response3.data);
                setEmployees(employeesData);
                setDepartments(departmentsData);
                setPositions(positionsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };


        fetchData();
    }, []);

    

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

    const showModal = (type, employee = null) => {
        setModalType(type);
        setSelectedEmployee(employee);
        setIsModalVisible(true);

        if (type === 'edit' && employee) {
            form.setFieldsValue({
                name: employee.name,
                employeeId: employee.employeeId,
                email: employee.email,
                phone: employee.phone,
                position: employee.position,
                department: employee.department,
                joinDate: employee.joinDate,
                status: employee.status,
                contractType: employee.contractType,
                contractEnd: employee.contractEnd,
            });
        } else {
            form.resetFields();
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleFormSubmit = (values) => {
        console.log('Form submitted:', values);
        // Here you would handle the actual form submission for adding or editing an employee
        setIsModalVisible(false);
        form.resetFields();
    };


    

    const columns = [
        {
            title: 'Nhân viên',
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => (
                <Space>
                    <Avatar style={{ backgroundColor: '#722ed1' }}>{index + 1}</Avatar>
                    <div>
                        <div style={{ fontWeight: 'bold' }}>{text}</div>
                        <Text type="secondary">{record.employeeId}</Text>
                    </div>
                </Space>
            ),
            sorter: (a, b) => a.name.localeCompare(b.name),
            filteredValue: searchText ? [searchText] : null,
            onFilter: (value, record) =>
                record.name.toLowerCase().includes(value.toLowerCase()) ||
                record.position.toLowerCase().includes(value.toLowerCase()) ||
                record.department.toLowerCase().includes(value.toLowerCase()) ||
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
        },
        {
            title: 'Phòng ban',
            dataIndex: 'department',
            key: 'department',
            filters: departments.map(dept => ({ text: dept.name, value: dept.name })),
            onFilter: (value, record) => record.department === value,
        },
        {
            title: 'Vị trí',
            dataIndex: 'position',
            key: 'position',
            filters: positions.map(pos => ({ text: pos.name, value: pos.name })),
            onFilter: (value, record) => record.position === value,
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
            onFilter: (value, record) => record.status === value,
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
                        <>
                            <Button
                                type="text"
                                icon={<EditOutlined />}
                                onClick={() => showModal('edit', record)}
                            />
                           
                        </>
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
        },
    ];

    const showActivityModal = (employee) => {
        setSelectedEmployee(employee);
        setActivityModalVisible(true);
    };

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
                                                        placeholder="Tìm kiếm nhân viên, ID, phòng ban..."
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
                                                        onChange={setFilterDepartment}
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
                                                        onChange={setFilterStatus}
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
                                                            <Button icon={<ExportOutlined />}>Export</Button>
                                                            <Button
                                                                type="primary"
                                                                icon={<UserAddOutlined />}
                                                                onClick={() => showModal('add')}
                                                            >
                                                                Thêm nhân viên
                                                            </Button>
                                                        </>
                                                    )}
                                                </Space>
                                            </div>
                                            <Table
                                                dataSource={employees}
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
                                    ),
                                },
                                isHR && {
                                    key: '2',
                                    label: <span><IdcardOutlined /> Hợp đồng</span>,
                                    children: <Card><Text>Quản lý hợp đồng lao động</Text></Card>,
                                },
                                isHR && {
                                    key: '3',
                                    label: <span><FileTextOutlined /> Báo cáo</span>,
                                    children: <Card><Text>Báo cáo nhân sự</Text></Card>,
                                },
                                isManager && {
                                    key: '4',
                                    label: <span><BarChartOutlined /> Hiệu suất</span>,
                                    children: <Card><Text>Phân tích hiệu suất nhân viên</Text></Card>,
                                },
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
                                <div>
                                    <Row gutter={[16, 16]}>
                                        <Col span={24} style={{ textAlign: 'center', marginBottom: 16 }}>
                                            <Avatar size={80} style={{ backgroundColor: '#722ed1' }}>
                                                {selectedEmployee.name.charAt(0)}
                                            </Avatar>
                                            <Title level={3} style={{ marginTop: 16, marginBottom: 0 }}>
                                                {selectedEmployee.name}
                                            </Title>
                                            <Text type="secondary">{selectedEmployee.position}</Text>
                                        </Col>
                                    </Row>

                                    <Divider orientation="left">Thông tin cơ bản</Divider>
                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <Text strong>Mã nhân viên:</Text> {selectedEmployee.employeeId}
                                        </Col>
                                        <Col span={12}>
                                            <Text strong>Trạng thái:</Text>{' '}
                                            <Tag color={getStatusColor(selectedEmployee.status)}>
                                                {getStatusLabel(selectedEmployee.status)}
                                            </Tag>
                                        </Col>
                                        <Col span={12}>
                                            <Text strong>Email:</Text> {selectedEmployee.email}
                                        </Col>
                                        <Col span={12}>
                                            <Text strong>Số điện thoại:</Text> {selectedEmployee.phone}
                                        </Col>
                                        <Col span={12}>
                                            <Text strong>Phòng ban:</Text> {selectedEmployee.department}
                                        </Col>
                                        <Col span={12}>
                                            <Text strong>Vị trí:</Text> {selectedEmployee.position}
                                        </Col>
                                    </Row>

                                    <Divider orientation="left">Thông tin hợp đồng</Divider>
                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <Text strong>Ngày vào làm:</Text> {selectedEmployee.joinDate}
                                        </Col>
                                        <Col span={12}>
                                            <Text strong>Loại hợp đồng:</Text> {selectedEmployee.contractType}
                                        </Col>
                                        <Col span={12}>
                                            <Text strong>Ngày hết hạn:</Text> {selectedEmployee.contractEnd}
                                        </Col>
                                    </Row>
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
                                            name="name"
                                            label="Họ và tên"
                                            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                                        >
                                            <Input placeholder="Nhập họ và tên" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="employeeId"
                                            label="Mã nhân viên"
                                            rules={[{ required: true, message: 'Vui lòng nhập mã nhân viên' }]}
                                        >
                                            <Input placeholder="Ví dụ: EMP001" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
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
                                            name="department"
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
                                            name="position"
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
                                            <DatePicker style={{ width: '100%' }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="status"
                                            label="Trạng thái"
                                            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                                        >
                                            <Select placeholder="Chọn trạng thái">
                                                <Option value="active">Đang làm việc</Option>
                                                <Option value="inactive">Nghỉ việc</Option>
                                                <Option value="leave">Nghỉ phép</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="contractType"
                                            label="Loại hợp đồng"
                                            rules={[{ required: true, message: 'Vui lòng chọn loại hợp đồng' }]}
                                        >
                                            <Select placeholder="Chọn loại hợp đồng">
                                                <Option value="Full-time">Full-time</Option>
                                                <Option value="Part-time">Part-time</Option>
                                                <Option value="Contract">Contract</Option>
                                                <Option value="Temporary">Temporary</Option>
                                                <Option value="Intern">Intern</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="contractEnd"
                                            label="Ngày hết hạn hợp đồng"
                                            rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn' }]}
                                        >
                                            <DatePicker style={{ width: '100%' }} />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item
                                    name="avatar"
                                    label="Ảnh đại diện"
                                >
                                    <Upload listType="picture" maxCount={1}>
                                        <Button icon={<UploadOutlined />}>Tải lên ảnh</Button>
                                    </Upload>
                                </Form.Item>
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
                                            {selectedEmployee.name.charAt(0)}
                                        </Avatar>
                                        <Title level={3} style={{ marginTop: 16, marginBottom: 0 }}>
                                            {selectedEmployee.name}
                                        </Title>
                                        <Text type="secondary">{selectedEmployee.position}</Text>
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
