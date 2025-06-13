import React, { useState } from 'react';
import {
    Card,
    Typography,
    Row,
    Col,
    Table,
    Tag,
    Button,
    Space,
    DatePicker,
    Input,
    Select,
    Tooltip,
    Modal,
    Avatar,
    Tabs,
    Statistic,
    Alert,
    Divider,
    Badge,
    Form,
    TimePicker,
    Switch,
    notification
} from 'antd';
import {
    SearchOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    ClockCircleOutlined,
    BarChartOutlined,
    UserOutlined,
    FilterOutlined,
    CalendarOutlined,
    WarningOutlined,
    EditOutlined,
    TeamOutlined,
    FileProtectOutlined,
    AuditOutlined,
    EyeOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import ThreeDContainer from '../../components/3d/ThreeDContainer';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const AttendanceReview = () => {
    const [searchText, setSearchText] = useState('');
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [activeTab, setActiveTab] = useState('1');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [form] = Form.useForm();

    // Sample data
    const attendanceData = [
        {
            id: 1,
            employee: {
                id: 101,
                name: 'Nguyễn Văn A',
                employeeId: 'EMP001',
                department: 'Engineering',
                position: 'Frontend Developer',
                avatar: null
            },
            date: '2023-06-05',
            timeIn: '08:05:22',
            timeOut: '17:30:45',
            status: 'normal',
            totalHours: '8:25',
            location: 'Văn phòng chính',
            reviewStatus: 'approved',
            reviewedBy: 'HR Manager',
            reviewedAt: '2023-06-06 09:15:30',
            note: '',
        },
        {
            id: 2,
            employee: {
                id: 102,
                name: 'Trần Thị B',
                employeeId: 'EMP002',
                department: 'Design',
                position: 'UI/UX Designer',
                avatar: null
            },
            date: '2023-06-05',
            timeIn: '09:20:15',
            timeOut: '17:45:30',
            status: 'late',
            totalHours: '7:25',
            location: 'Văn phòng chính',
            reviewStatus: 'pending',
            reviewedBy: null,
            reviewedAt: null,
            note: 'Đến muộn do kẹt xe',
        },
        {
            id: 3,
            employee: {
                id: 103,
                name: 'Lê Văn C',
                employeeId: 'EMP003',
                department: 'Management',
                position: 'Project Manager',
                avatar: null
            },
            date: '2023-06-05',
            timeIn: '08:00:05',
            timeOut: '16:30:12',
            status: 'early_leave',
            totalHours: '7:30',
            location: 'Văn phòng chính',
            reviewStatus: 'pending',
            reviewedBy: null,
            reviewedAt: null,
            note: 'Về sớm do có việc gia đình',
        },
        {
            id: 4,
            employee: {
                id: 104,
                name: 'Phạm Thị D',
                employeeId: 'EMP004',
                department: 'Finance',
                position: 'Accountant',
                avatar: null
            },
            date: '2023-06-05',
            timeIn: null,
            timeOut: null,
            status: 'absent',
            totalHours: '0:00',
            location: '',
            reviewStatus: 'pending',
            reviewedBy: null,
            reviewedAt: null,
            note: 'Vắng không báo trước',
        },
        {
            id: 5,
            employee: {
                id: 105,
                name: 'Hoàng Văn E',
                employeeId: 'EMP005',
                department: 'Admin',
                position: 'Receptionist',
                avatar: null
            },
            date: '2023-06-05',
            timeIn: '10:30:00',
            timeOut: '19:00:25',
            status: 'overtime',
            totalHours: '8:30',
            location: 'Văn phòng chính',
            reviewStatus: 'pending',
            reviewedBy: null,
            reviewedAt: null,
            note: 'Đi muộn, làm bù giờ vào buổi tối',
        },
        {
            id: 6,
            employee: {
                id: 106,
                name: 'Vũ Thị F',
                employeeId: 'EMP006',
                department: 'HR',
                position: 'HR Officer',
                avatar: null
            },
            date: '2023-06-05',
            timeIn: '08:10:20',
            timeOut: '17:05:15',
            status: 'normal',
            totalHours: '8:55',
            location: 'Làm việc từ xa',
            reviewStatus: 'pending',
            reviewedBy: null,
            reviewedAt: null,
            note: 'Làm việc từ xa',
        }
    ];

    const irregularAttendance = attendanceData.filter(item =>
        item.status !== 'normal' || item.reviewStatus === 'pending'
    );

    // Status colors and labels
    const getStatusTag = (status) => {
        switch(status) {
            case 'normal': return <Tag color="success">Bình thường</Tag>;
            case 'late': return <Tag color="warning">Đến muộn</Tag>;
            case 'early_leave': return <Tag color="orange">Về sớm</Tag>;
            case 'absent': return <Tag color="error">Vắng mặt</Tag>;
            case 'overtime': return <Tag color="blue">Tăng ca</Tag>;
            default: return <Tag>Không xác định</Tag>;
        }
    };

    const getReviewStatusTag = (status) => {
        switch(status) {
            case 'approved': return <Tag color="success">Đã duyệt</Tag>;
            case 'rejected': return <Tag color="error">Từ chối</Tag>;
            case 'pending': return <Tag color="warning">Chờ duyệt</Tag>;
            default: return <Tag>Chưa duyệt</Tag>;
        }
    };

    const showDetails = (record) => {
        setSelectedRecord(record);
        form.setFieldsValue({
            timeIn: record.timeIn ? dayjs(record.timeIn, 'HH:mm:ss') : null,
            timeOut: record.timeOut ? dayjs(record.timeOut, 'HH:mm:ss') : null,
            status: record.status,
            note: record.note,
            reviewNote: '',
            isValid: record.reviewStatus === 'approved',
        });
        setIsModalVisible(true);
    };

    const handleApprove = () => {
        form.validateFields().then(values => {
            // Handle approval with form values
            notification.success({
                message: 'Đã duyệt dữ liệu chấm công',
                description: `Dữ liệu chấm công của ${selectedRecord?.employee.name} đã được duyệt`
            });
            setIsModalVisible(false);
        });
    };

    const handleReject = () => {
        Modal.confirm({
            title: 'Từ chối dữ liệu chấm công',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc muốn từ chối dữ liệu chấm công này?',
            okText: 'Từ chối',
            cancelText: 'Hủy',
            onOk() {
                notification.success({
                    message: 'Đã từ chối dữ liệu chấm công',
                    description: `Dữ liệu chấm công của ${selectedRecord?.employee.name} đã bị từ chối`
                });
                setIsModalVisible(false);
            }
        });
    };

    const columns = [
        {
            title: 'Nhân viên',
            dataIndex: 'employee',
            key: 'employee',
            render: (employee) => (
                <Space>
                    <Avatar icon={<UserOutlined />} src={employee.avatar} />
                    <div>
                        <Text strong>{employee.name}</Text>
                        <div><Text type="secondary">{employee.employeeId}</Text></div>
                    </div>
                </Space>
            )
        },
        {
            title: 'Phòng ban',
            dataIndex: ['employee', 'department'],
            key: 'department',
        },
        {
            title: 'Ngày',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Thời gian',
            key: 'time',
            render: (_, record) => (
                <div>
                    {record.timeIn ? (
                        <div>Vào: <Text strong>{record.timeIn}</Text></div>
                    ) : (
                        <div>Vào: <Text type="danger">--:--:--</Text></div>
                    )}
                    {record.timeOut ? (
                        <div>Ra: <Text strong>{record.timeOut}</Text></div>
                    ) : (
                        <div>Ra: <Text type="danger">--:--:--</Text></div>
                    )}
                </div>
            )
        },
        {
            title: 'Giờ làm',
            dataIndex: 'totalHours',
            key: 'totalHours',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => getStatusTag(status),
        },
        {
            title: 'Trạng thái duyệt',
            dataIndex: 'reviewStatus',
            key: 'reviewStatus',
            render: (status) => getReviewStatusTag(status),
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            key: 'note',
            ellipsis: true,
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Xem chi tiết">
                        <Button type="text" icon={<EyeOutlined />} onClick={() => showDetails(record)} />
                    </Tooltip>
                    {record.reviewStatus === 'pending' && (
                        <>
                            <Tooltip title="Duyệt">
                                <Button
                                    type="text"
                                    icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                                    onClick={() => showDetails(record)}
                                />
                            </Tooltip>
                            <Tooltip title="Từ chối">
                                <Button
                                    type="text"
                                    icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
                                    onClick={() => showDetails(record)}
                                />
                            </Tooltip>
                        </>
                    )}
                </Space>
            )
        }
    ];

    return (
        <div>
            <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                <Col span={24}>
                    <Title level={2}>Duyệt chấm công</Title>
                    <Text type="secondary">Quản lý và duyệt dữ liệu chấm công của nhân viên</Text>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                <Col xs={24} md={8}>
                    <ThreeDContainer>
                        <Card>
                            <Statistic
                                title="Đang chờ duyệt"
                                value={5}
                                valueStyle={{ color: '#faad14' }}
                                prefix={<ExclamationCircleOutlined />}
                            />
                        </Card>
                    </ThreeDContainer>
                </Col>
                <Col xs={24} md={8}>
                    <ThreeDContainer>
                        <Card>
                            <Statistic
                                title="Dữ liệu bất thường"
                                value={4}
                                valueStyle={{ color: '#ff4d4f' }}
                                prefix={<WarningOutlined />}
                            />
                        </Card>
                    </ThreeDContainer>
                </Col>
                <Col xs={24} md={8}>
                    <ThreeDContainer>
                        <Card>
                            <Statistic
                                title="Tổng chấm công hôm nay"
                                value={35}
                                valueStyle={{ color: '#1890ff' }}
                                prefix={<BarChartOutlined />}
                            />
                        </Card>
                    </ThreeDContainer>
                </Col>
            </Row>

            <ThreeDContainer>
                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <TabPane tab="Tất cả dữ liệu" key="1">
                        <Card>
                            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                                <Space wrap>
                                    <DatePicker
                                        value={selectedDate}
                                        onChange={setSelectedDate}
                                        allowClear={false}
                                    />
                                    <Input
                                        placeholder="Tìm kiếm theo tên, ID..."
                                        prefix={<SearchOutlined />}
                                        style={{ width: 240 }}
                                        value={searchText}
                                        onChange={e => setSearchText(e.target.value)}
                                        allowClear
                                    />
                                    <Select defaultValue="all" style={{ width: 140 }}>
                                        <Option value="all">Tất cả trạng thái</Option>
                                        <Option value="normal">Bình thường</Option>
                                        <Option value="late">Đến muộn</Option>
                                        <Option value="early_leave">Về sớm</Option>
                                        <Option value="absent">Vắng mặt</Option>
                                        <Option value="overtime">Tăng ca</Option>
                                    </Select>
                                </Space>
                                <Space>
                                    <Button icon={<FilterOutlined />}>
                                        Lọc
                                    </Button>
                                    <Button type="primary" icon={<FileProtectOutlined />}>
                                        Duyệt hàng loạt
                                    </Button>
                                </Space>
                            </div>

                            <Table
                                dataSource={attendanceData}
                                columns={columns}
                                rowKey="id"
                                pagination={{
                                    defaultPageSize: 10,
                                    showSizeChanger: true,
                                    pageSizeOptions: ['10', '20', '50'],
                                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bản ghi`,
                                }}
                            />
                        </Card>
                    </TabPane>

                    <TabPane tab={<Badge count={irregularAttendance.length} offset={[10, 0]}>Cần duyệt</Badge>} key="2">
                        <Card>
                            <Alert
                                message={`Có ${irregularAttendance.length} dữ liệu chấm công cần được duyệt`}
                                type="warning"
                                showIcon
                                style={{ marginBottom: 16 }}
                            />
                            <Table
                                dataSource={irregularAttendance}
                                columns={columns}
                                rowKey="id"
                                pagination={false}
                            />
                        </Card>
                    </TabPane>

                    <TabPane tab="Đến muộn" key="3">
                        <Card>
                            <Table
                                dataSource={attendanceData.filter(item => item.status === 'late')}
                                columns={columns}
                                rowKey="id"
                                pagination={false}
                            />
                        </Card>
                    </TabPane>

                    <TabPane tab="Về sớm" key="4">
                        <Card>
                            <Table
                                dataSource={attendanceData.filter(item => item.status === 'early_leave')}
                                columns={columns}
                                rowKey="id"
                                pagination={false}
                            />
                        </Card>
                    </TabPane>

                    <TabPane tab="Vắng mặt" key="5">
                        <Card>
                            <Table
                                dataSource={attendanceData.filter(item => item.status === 'absent')}
                                columns={columns}
                                rowKey="id"
                                pagination={false}
                            />
                        </Card>
                    </TabPane>

                    <TabPane tab="Tăng ca" key="6">
                        <Card>
                            <Table
                                dataSource={attendanceData.filter(item => item.status === 'overtime')}
                                columns={columns}
                                rowKey="id"
                                pagination={false}
                            />
                        </Card>
                    </TabPane>
                </Tabs>
            </ThreeDContainer>

            <Modal
                title="Chi tiết chấm công"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                width={700}
                footer={selectedRecord?.reviewStatus === 'pending' ? [
                    <Button key="back" onClick={() => setIsModalVisible(false)}>
                        Đóng
                    </Button>,
                    <Button key="reject" danger onClick={handleReject}>
                        Từ chối
                    </Button>,
                    <Button key="approve" type="primary" onClick={handleApprove}>
                        Duyệt
                    </Button>,
                ] : [
                    <Button key="back" onClick={() => setIsModalVisible(false)}>
                        Đóng
                    </Button>,
                ]}
            >
                {selectedRecord && (
                    <div>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                                    <Avatar
                                        size="large"
                                        icon={<UserOutlined />}
                                        src={selectedRecord.employee.avatar}
                                        style={{ marginRight: 16 }}
                                    />
                                    <div>
                                        <Text strong style={{ fontSize: 16 }}>{selectedRecord.employee.name}</Text>
                                        <div>
                                            <Text type="secondary">{selectedRecord.employee.position} - {selectedRecord.employee.department}</Text>
                                        </div>
                                    </div>
                                </div>
                                <Divider />
                            </Col>

                            <Col span={12}>
                                <Text type="secondary">ID nhân viên</Text>
                                <div><Text strong>{selectedRecord.employee.employeeId}</Text></div>
                            </Col>
                            <Col span={12}>
                                <Text type="secondary">Ngày</Text>
                                <div><Text strong>{selectedRecord.date}</Text></div>
                            </Col>

                            <Col span={24}>
                                <Divider orientation="left">Thông tin chấm công</Divider>
                                <Form
                                    form={form}
                                    layout="vertical"
                                >
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="timeIn"
                                                label="Giờ vào"
                                            >
                                                <TimePicker format="HH:mm:ss" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="timeOut"
                                                label="Giờ ra"
                                            >
                                                <TimePicker format="HH:mm:ss" />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Form.Item
                                        name="status"
                                        label="Trạng thái"
                                    >
                                        <Select>
                                            <Option value="normal">Bình thường</Option>
                                            <Option value="late">Đến muộn</Option>
                                            <Option value="early_leave">Về sớm</Option>
                                            <Option value="absent">Vắng mặt</Option>
                                            <Option value="overtime">Tăng ca</Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        name="note"
                                        label="Ghi chú của nhân viên"
                                    >
                                        <Input.TextArea readOnly />
                                    </Form.Item>

                                    <Form.Item
                                        name="isValid"
                                        label="Xác nhận hợp lệ"
                                        valuePropName="checked"
                                    >
                                        <Switch checkedChildren="Hợp lệ" unCheckedChildren="Không hợp lệ" />
                                    </Form.Item>

                                    <Form.Item
                                        name="reviewNote"
                                        label="Ghi chú khi duyệt"
                                    >
                                        <Input.TextArea rows={3} placeholder="Nhập ghi chú của người duyệt (nếu có)" />
                                    </Form.Item>
                                </Form>
                            </Col>

                            {selectedRecord.reviewStatus !== 'pending' && (
                                <Col span={24}>
                                    <Divider orientation="left">Thông tin duyệt</Divider>
                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <Text type="secondary">Người duyệt</Text>
                                            <div><Text strong>{selectedRecord.reviewedBy}</Text></div>
                                        </Col>
                                        <Col span={12}>
                                            <Text type="secondary">Thời gian duyệt</Text>
                                            <div><Text strong>{selectedRecord.reviewedAt}</Text></div>
                                        </Col>
                                    </Row>
                                </Col>
                            )}
                        </Row>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AttendanceReview;
