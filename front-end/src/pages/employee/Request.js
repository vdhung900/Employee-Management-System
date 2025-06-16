import React, {useEffect, useState} from 'react';
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
    Tabs,
    Avatar,
    Divider,
    Tooltip,
    Badge,
    Statistic,
    Progress,
    Alert,
    Drawer,
    Timeline,
    List,
    Radio
} from 'antd';
import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    MoreOutlined,
    FilterOutlined,
    ExportOutlined,
    EyeOutlined,
    UploadOutlined,
    DownOutlined,
    FileTextOutlined,
    UserOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    PrinterOutlined,
    MailOutlined,
    BellOutlined,
    HistoryOutlined,
    CloseOutlined,
    QuestionCircleOutlined
} from '@ant-design/icons';
import ThreeDContainer from '../../components/3d/ThreeDContainer';
import CategoryService from "../../services/CategoryService";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const Requests = () => {
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [requestCategories, setRequestCategories] = useState([]);
    const [selectedDataType, setSelectedDataType] = useState(null);
    const [selectedRequestType, setSelectedRequestType] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        try{
            loadTypeReq();
        }catch (e) {
            console.log(e, 'test');
        }
    }, []);

    // Sample data
    const requests = [
        {
            id: 1,
            employee: {
                id: 1,
                name: 'Nguyễn Văn A',
                position: 'Frontend Developer',
                department: 'Engineering',
                employeeId: 'EMP001',
                avatar: null
            },
            requestNumber: 'REQ-2024-001',
            category: 'Nghỉ phép',
            status: 'pending',
            submitDate: '2024-03-15',
            startDate: '2024-03-20',
            endDate: '2024-03-22',
            reason: 'Nghỉ phép cá nhân',
            attachments: ['document1.pdf'],
            priority: 'normal',
            history: [
                { date: '2024-03-15 09:00', action: 'Tạo yêu cầu', user: 'Nguyễn Văn A' },
                { date: '2024-03-15 10:30', action: 'Chuyển đến quản lý', user: 'System' },
                { date: '2024-03-15 14:00', action: 'Đang xem xét', user: 'HR Manager' }
            ]
        },
        {
            id: 2,
            employee: {
                id: 2,
                name: 'Trần Thị B',
                position: 'UI/UX Designer',
                department: 'Design',
                employeeId: 'EMP002',
                avatar: null
            },
            requestNumber: 'REQ-2024-002',
            category: 'Tăng ca',
            status: 'approved',
            submitDate: '2024-03-14',
            startDate: '2024-03-16',
            endDate: '2024-03-16',
            reason: 'Hoàn thành dự án gấp',
            attachments: [],
            priority: 'high',
            history: [
                { date: '2024-03-14 15:00', action: 'Tạo yêu cầu', user: 'Trần Thị B' },
                { date: '2024-03-14 16:30', action: 'Chuyển đến quản lý', user: 'System' },
                { date: '2024-03-15 09:00', action: 'Đã phê duyệt', user: 'HR Manager' }
            ]
        },
        {
            id: 3,
            employee: {
                id: 3,
                name: 'Lê Văn C',
                position: 'Project Manager',
                department: 'Management',
                employeeId: 'EMP003',
                avatar: null
            },
            requestNumber: 'REQ-2024-003',
            category: 'Đi muộn',
            status: 'rejected',
            submitDate: '2024-03-13',
            startDate: '2024-03-14',
            endDate: '2024-03-14',
            reason: 'Kẹt xe',
            attachments: ['traffic.jpg'],
            priority: 'low',
            history: [
                { date: '2024-03-13 08:00', action: 'Tạo yêu cầu', user: 'Lê Văn C' },
                { date: '2024-03-13 09:30', action: 'Chuyển đến quản lý', user: 'System' },
                { date: '2024-03-13 14:00', action: 'Từ chối', user: 'HR Manager' }
            ]
        }
    ];

    const loadTypeReq = async () => {
        try{
            const response = await CategoryService.getTypeReqByRole();
            console.log(response);
            if(response.success){
                const data = response.data;
                data.map(item => ({
                    code: item.code,
                    name: item.name
                }))
                setRequestCategories(data)
            }
        }catch(e){
            console.log(e)
        }
    }

    const getStatusColor = (status) => {
        switch(status) {
            case 'approved': return 'success';
            case 'rejected': return 'error';
            case 'pending': return 'processing';
            case 'cancelled': return 'default';
            default: return 'default';
        }
    };

    const getStatusLabel = (status) => {
        switch(status) {
            case 'approved': return 'Đã phê duyệt';
            case 'rejected': return 'Từ chối';
            case 'pending': return 'Đang chờ duyệt';
            case 'cancelled': return 'Đã hủy';
            default: return 'Không xác định';
        }
    };

    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'high': return 'red';
            case 'normal': return 'blue';
            case 'low': return 'green';
            default: return 'default';
        }
    };

    const getPriorityLabel = (priority) => {
        switch(priority) {
            case 'high': return 'Cao';
            case 'normal': return 'Bình thường';
            case 'low': return 'Thấp';
            default: return 'Không xác định';
        }
    };

    const showModal = (request = null) => {
        setSelectedRequest(request);
        setIsModalVisible(true);

        if (request) {
            form.setFieldsValue({
                category: request.category,
                startDate: request.startDate,
                endDate: request.endDate,
                reason: request.reason,
                priority: request.priority,
            });
        } else {
            form.resetFields();
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedDataType(null);
    };

    const handleFormSubmit = (values) => {
        setIsModalVisible(false);
        form.resetFields();
        setSelectedDataType(null);
    };

    const handleDataTypeChange = (e) => {
        setSelectedDataType(e.target.value);
        form.setFieldsValue({
            employeeInfo: undefined,
            dateInfo: undefined
        });
    };

    const handleRequestTypeChange = (value) => {
        setSelectedRequestType(value);
        form.setFieldsValue({
            startDate: undefined,
            endDate: undefined,
            reason: undefined,
            priority: undefined,
            attachments: undefined
        });
    };

    const renderRequestTypeFields = () => {
        switch(selectedRequestType) {
            case 'LEAVE':
                return (
                    <>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="startDate"
                                    label="Ngày bắt đầu nghỉ"
                                    rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
                                >
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="endDate"
                                    label="Ngày kết thúc nghỉ"
                                    rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
                                >
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item
                            name="reason"
                            label="Lý do nghỉ phép"
                            rules={[{ required: true, message: 'Vui lòng nhập lý do nghỉ phép' }]}
                        >
                            <Input.TextArea rows={4} placeholder="Nhập lý do nghỉ phép" />
                        </Form.Item>
                    </>
                );
            case 'OVERTIME':
                return (
                    <>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="startDate"
                                    label="Ngày tăng ca"
                                    rules={[{ required: true, message: 'Vui lòng chọn ngày tăng ca' }]}
                                >
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="hours"
                                    label="Số giờ tăng ca"
                                    rules={[{ required: true, message: 'Vui lòng nhập số giờ tăng ca' }]}
                                >
                                    <Input type="number" min={1} max={24} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item
                            name="reason"
                            label="Lý do tăng ca"
                            rules={[{ required: true, message: 'Vui lòng nhập lý do tăng ca' }]}
                        >
                            <Input.TextArea rows={4} placeholder="Nhập lý do tăng ca" />
                        </Form.Item>
                    </>
                );
            case 'ACCOUNT_CREATE_REQUEST':
                return (
                    <>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="fullName"
                                    label="Họ và tên nhân viên"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập họ và tên' },
                                        { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự' }
                                    ]}
                                >
                                    <Input placeholder="Nhập họ và tên nhân viên" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="startDate"
                                    label="Ngày bắt đầu làm việc"
                                    rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
                                >
                                    <DatePicker style={{ width: '100%' }} />
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
                                    <Input placeholder="Nhập email" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="phone"
                                    label="Số điện thoại"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập số điện thoại' },
                                        { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
                                    ]}
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
                                        <Option value="IT">Phòng IT</Option>
                                        <Option value="HR">Phòng Nhân sự</Option>
                                        <Option value="FINANCE">Phòng Tài chính</Option>
                                        <Option value="MARKETING">Phòng Marketing</Option>
                                        <Option value="SALES">Phòng Kinh doanh</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="position"
                                    label="Chức vụ"
                                    rules={[{ required: true, message: 'Vui lòng chọn chức vụ' }]}
                                >
                                    <Select placeholder="Chọn chức vụ">
                                        <Option value="STAFF">Nhân viên</Option>
                                        <Option value="MANAGER">Quản lý</Option>
                                        <Option value="DIRECTOR">Giám đốc</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item
                            name="note"
                            label="Ghi chú"
                        >
                            <Input.TextArea rows={4} placeholder="Nhập ghi chú (nếu có)" />
                        </Form.Item>
                    </>
                );
            default:
                return null;
        }
    };

    const showDrawer = (request) => {
        setSelectedRequest(request);
        setDrawerVisible(true);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
    };

    const confirmDelete = (request) => {
        Modal.confirm({
            title: 'Xác nhận hủy yêu cầu',
            content: `Bạn có chắc chắn muốn hủy yêu cầu ${request.requestNumber}?`,
            okText: 'Hủy yêu cầu',
            okType: 'danger',
            cancelText: 'Đóng',
            onOk() {
                console.log('Cancelled request:', request);
                // Here you would handle cancelling the request
            },
        });
    };

    const columns = [
        {
            title: 'Nhân viên',
            dataIndex: ['employee', 'name'],
            key: 'employeeName',
            render: (text, record) => (
                <Space>
                    <Avatar style={{ backgroundColor: '#722ed1' }}>{text.charAt(0)}</Avatar>
                    <div>
                        <div style={{ fontWeight: 'bold' }}>{text}</div>
                        <Text type="secondary">{record.employee.employeeId}</Text>
                    </div>
                </Space>
            ),
            sorter: (a, b) => a.employee.name.localeCompare(b.employee.name),
            filteredValue: searchText ? [searchText] : null,
            onFilter: (value, record) =>
                record.employee.name.toLowerCase().includes(value.toLowerCase()) ||
                record.employee.employeeId.toLowerCase().includes(value.toLowerCase()) ||
                record.requestNumber.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: 'Thông tin yêu cầu',
            key: 'requestInfo',
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <div style={{ fontWeight: 'bold' }}>{record.requestNumber}</div>
                    <div>Loại: {record.category}</div>
                    <Tag color={getPriorityColor(record.priority)}>
                        {getPriorityLabel(record.priority)}
                    </Tag>
                </Space>
            ),
        },
        {
            title: 'Thời gian',
            key: 'duration',
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <div>Gửi: {record.submitDate}</div>
                    <div>Từ: {record.startDate}</div>
                    <div>Đến: {record.endDate}</div>
                </Space>
            ),
            sorter: (a, b) => new Date(a.submitDate) - new Date(b.submitDate),
        },
        {
            title: 'Lý do',
            dataIndex: 'reason',
            key: 'reason',
            ellipsis: true,
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            render: status => (
                <Badge
                    status={
                        status === 'approved' ? 'success' :
                            status === 'rejected' ? 'error' :
                                status === 'pending' ? 'processing' : 'default'
                    }
                    text={getStatusLabel(status)}
                />
            ),
            filters: [
                { text: 'Đã phê duyệt', value: 'approved' },
                { text: 'Từ chối', value: 'rejected' },
                { text: 'Đang chờ duyệt', value: 'pending' },
                { text: 'Đã hủy', value: 'cancelled' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => showDrawer(record)}
                        />
                    </Tooltip>
                    {record.status === 'pending' && (
                        <>
                            <Tooltip title="Chỉnh sửa">
                                <Button
                                    type="text"
                                    icon={<EditOutlined />}
                                    onClick={() => showModal(record)}
                                />
                            </Tooltip>
                            <Tooltip title="Hủy yêu cầu">
                                <Button
                                    type="text"
                                    icon={<CloseOutlined />}
                                    onClick={() => confirmDelete(record)}
                                />
                            </Tooltip>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    // Group requests by status for statistics
    const pendingRequests = requests.filter(r => r.status === 'pending').length;
    const approvedRequests = requests.filter(r => r.status === 'approved').length;
    const rejectedRequests = requests.filter(r => r.status === 'rejected').length;
    const cancelledRequests = requests.filter(r => r.status === 'cancelled').length;

    return (
        <div style={{padding: '10px'}}>
            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                <Col span={24}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <Title level={2}>Quản lý yêu cầu</Title>
                            <Text type="secondary">Gửi và theo dõi các yêu cầu của nhân viên</Text>
                        </div>
                        <div>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => showModal()}
                                style={{ marginRight: '8px' }}
                            >
                                Tạo yêu cầu mới
                            </Button>
                            <Dropdown
                                menu={{
                                    items: [
                                        { key: '1', label: 'Export danh sách', icon: <ExportOutlined /> },
                                        { key: '2', label: 'Xem hướng dẫn', icon: <QuestionCircleOutlined /> },
                                    ]
                                }}
                            >
                                <Button>
                                    <Space>
                                        Thao tác
                                        <DownOutlined />
                                    </Space>
                                </Button>
                            </Dropdown>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <ThreeDContainer>
                        <Card>
                            <Statistic
                                title="Đang chờ duyệt"
                                value={pendingRequests}
                                valueStyle={{ color: '#1890ff' }}
                                prefix={<ClockCircleOutlined />}
                            />
                            <div style={{ marginTop: 8 }}>
                                <Progress percent={Math.round((pendingRequests / requests.length) * 100)} size="small" strokeColor="#1890ff" />
                            </div>
                        </Card>
                    </ThreeDContainer>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <ThreeDContainer>
                        <Card>
                            <Statistic
                                title="Đã phê duyệt"
                                value={approvedRequests}
                                valueStyle={{ color: '#52c41a' }}
                                prefix={<CheckCircleOutlined />}
                            />
                            <div style={{ marginTop: 8 }}>
                                <Progress percent={Math.round((approvedRequests / requests.length) * 100)} size="small" strokeColor="#52c41a" />
                            </div>
                        </Card>
                    </ThreeDContainer>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <ThreeDContainer>
                        <Card>
                            <Statistic
                                title="Từ chối"
                                value={rejectedRequests}
                                valueStyle={{ color: '#ff4d4f' }}
                                prefix={<CloseCircleOutlined />}
                            />
                            <div style={{ marginTop: 8 }}>
                                <Progress percent={Math.round((rejectedRequests / requests.length) * 100)} size="small" strokeColor="#ff4d4f" />
                            </div>
                        </Card>
                    </ThreeDContainer>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <ThreeDContainer>
                        <Card>
                            <Statistic
                                title="Đã hủy"
                                value={cancelledRequests}
                                valueStyle={{ color: '#d9d9d9' }}
                                prefix={<CloseOutlined />}
                            />
                            <div style={{ marginTop: 8 }}>
                                <Progress percent={Math.round((cancelledRequests / requests.length) * 100)} size="small" strokeColor="#d9d9d9" />
                            </div>
                        </Card>
                    </ThreeDContainer>
                </Col>
            </Row>

            <ThreeDContainer>
                <Tabs defaultActiveKey="1">
                    <TabPane
                        tab={<span><FileTextOutlined /> Tất cả yêu cầu</span>}
                        key="1"
                    >
                        <Card>
                            {pendingRequests > 0 && (
                                <Alert
                                    message={`Có ${pendingRequests} yêu cầu đang chờ duyệt!`}
                                    type="info"
                                    showIcon
                                    icon={<BellOutlined />}
                                    action={
                                        <Button size="small" type="link">
                                            Xem tất cả
                                        </Button>
                                    }
                                    style={{ marginBottom: 16 }}
                                />
                            )}

                            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                                <Input
                                    placeholder="Tìm kiếm theo tên, ID, số yêu cầu..."
                                    prefix={<SearchOutlined />}
                                    style={{ width: 300 }}
                                    value={searchText}
                                    onChange={e => setSearchText(e.target.value)}
                                    allowClear
                                />
                                <Space>
                                    <RangePicker placeholder={['Từ ngày', 'Đến ngày']} style={{ marginRight: 8 }} />
                                    <Button icon={<FilterOutlined />} style={{ marginRight: 8 }}>
                                        Lọc
                                    </Button>
                                    <Button icon={<ExportOutlined />}>
                                        Export
                                    </Button>
                                </Space>
                            </div>

                            <Table
                                dataSource={requests}
                                columns={columns}
                                rowKey="id"
                                pagination={{
                                    defaultPageSize: 10,
                                    showSizeChanger: true,
                                    pageSizeOptions: ['10', '20', '50', '100'],
                                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} yêu cầu`,
                                }}
                            />
                        </Card>
                    </TabPane>
                    <TabPane
                        tab={<span><ClockCircleOutlined /> Đang chờ duyệt</span>}
                        key="2"
                    >
                        <Card>
                            <Text>Danh sách yêu cầu đang chờ duyệt</Text>
                        </Card>
                    </TabPane>
                    <TabPane
                        tab={<span><CheckCircleOutlined /> Đã phê duyệt</span>}
                        key="3"
                    >
                        <Card>
                            <Text>Danh sách yêu cầu đã được phê duyệt</Text>
                        </Card>
                    </TabPane>
                </Tabs>
            </ThreeDContainer>

            <Modal
                title={selectedRequest ? 'Chỉnh sửa yêu cầu' : 'Tạo yêu cầu mới'}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Hủy
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={() => form.submit()}
                    >
                        {selectedRequest ? 'Lưu thay đổi' : 'Gửi yêu cầu'}
                    </Button>,
                ]}
                width={800}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFormSubmit}
                >
                    <Form.Item
                        name="category"
                        label="Loại yêu cầu"
                        rules={[{ required: true, message: 'Vui lòng chọn loại yêu cầu' }]}
                    >
                        <Select 
                            placeholder="Chọn loại yêu cầu"
                            onChange={handleRequestTypeChange}
                        >
                            {requestCategories.map(category => (
                                <Option key={category.code} value={category.code}>{category.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {selectedRequestType && (
                        <>
                            {renderRequestTypeFields()}
                            
                            <Form.Item
                                name="priority"
                                label="Mức độ ưu tiên"
                                rules={[{ required: true, message: 'Vui lòng chọn mức độ ưu tiên' }]}
                            >
                                <Select placeholder="Chọn mức độ ưu tiên">
                                    <Option value="high">Cao</Option>
                                    <Option value="normal">Bình thường</Option>
                                    <Option value="low">Thấp</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="attachments"
                                label="Tài liệu đính kèm"
                            >
                                <Upload listType="picture" multiple>
                                    <Button icon={<UploadOutlined />}>Tải lên tập tin</Button>
                                </Upload>
                            </Form.Item>
                        </>
                    )}
                </Form>
            </Modal>

            <Drawer
                title="Chi tiết yêu cầu"
                placement="right"
                width={700}
                onClose={closeDrawer}
                open={drawerVisible}
                extra={
                    <Space>
                        <Button onClick={closeDrawer}>Đóng</Button>
                        {selectedRequest && selectedRequest.status === 'pending' && (
                            <Button type="primary" onClick={() => showModal(selectedRequest)}>
                                Chỉnh sửa
                            </Button>
                        )}
                    </Space>
                }
            >
                {selectedRequest && (
                    <>
                        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <Title level={4} style={{ marginBottom: 4 }}>
                                    Yêu cầu {selectedRequest.requestNumber}
                                </Title>
                                <Tag color={getStatusColor(selectedRequest.status)}>
                                    {getStatusLabel(selectedRequest.status)}
                                </Tag>
                                <Tag color={getPriorityColor(selectedRequest.priority)}>
                                    {getPriorityLabel(selectedRequest.priority)}
                                </Tag>
                            </div>
                            <div>
                                <Space>
                                    <Button icon={<PrinterOutlined />}>In yêu cầu</Button>
                                    <Button icon={<MailOutlined />}>Gửi email</Button>
                                </Space>
                            </div>
                        </div>

                        <Divider orientation="left">Thông tin nhân viên</Divider>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Card size="small">
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar
                                            size={64}
                                            icon={<UserOutlined />}
                                            style={{ backgroundColor: '#722ed1', marginRight: 16 }}
                                        />
                                        <div>
                                            <Title level={5} style={{ marginBottom: 4 }}>{selectedRequest.employee.name}</Title>
                                            <div>ID: {selectedRequest.employee.employeeId}</div>
                                            <div>Vị trí: {selectedRequest.employee.position}</div>
                                            <div>Phòng ban: {selectedRequest.employee.department}</div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>

                        <Divider orientation="left">Thông tin yêu cầu</Divider>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Statistic
                                    title="Loại yêu cầu"
                                    value={selectedRequest.category}
                                    valueStyle={{ fontSize: '16px' }}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Mức độ ưu tiên"
                                    value={getPriorityLabel(selectedRequest.priority)}
                                    valueStyle={{ fontSize: '16px', color: getPriorityColor(selectedRequest.priority) }}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Ngày gửi"
                                    value={selectedRequest.submitDate}
                                    valueStyle={{ fontSize: '16px' }}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Thời gian yêu cầu"
                                    value={`${selectedRequest.startDate} - ${selectedRequest.endDate}`}
                                    valueStyle={{ fontSize: '16px' }}
                                />
                            </Col>
                        </Row>

                        <Divider orientation="left">Lý do</Divider>
                        <Paragraph>{selectedRequest.reason}</Paragraph>

                        {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
                            <>
                                <Divider orientation="left">Tài liệu đính kèm</Divider>
                                <List
                                    size="small"
                                    dataSource={selectedRequest.attachments}
                                    renderItem={item => (
                                        <List.Item>
                                            <Space>
                                                <FileTextOutlined />
                                                <a href="#">{item}</a>
                                            </Space>
                                        </List.Item>
                                    )}
                                />
                            </>
                        )}

                        <Divider orientation="left">
                            <Space>
                                <HistoryOutlined />
                                Lịch sử yêu cầu
                            </Space>
                        </Divider>
                        <Timeline mode="left">
                            {selectedRequest.history.map((item, index) => (
                                <Timeline.Item
                                    key={index}
                                    color={
                                        item.action.includes('Đã phê duyệt') ? 'green' :
                                            item.action.includes('Từ chối') ? 'red' :
                                                item.action.includes('Tạo yêu cầu') ? 'blue' :
                                                    item.action.includes('Đang xem xét') ? 'orange' : 'gray'
                                    }
                                    label={item.date}
                                >
                                    <div style={{ fontWeight: 'bold' }}>{item.action}</div>
                                    <div>Thực hiện bởi: {item.user}</div>
                                </Timeline.Item>
                            ))}
                        </Timeline>
                    </>
                )}
            </Drawer>
        </div>
    );
};

export default Requests;
