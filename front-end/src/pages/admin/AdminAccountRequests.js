import {useEffect, useState} from 'react';
import {
    Card,
    Typography,
    Row,
    Col,
    Button,
    Space,
    Table,
    DatePicker,
    Select,
    Tabs,
    Form,
    Radio,
    Checkbox,
    Divider,
    Statistic,
    Progress,
    Tag,
    Modal,
    message,
    Input
} from 'antd';
import {
    FileExcelOutlined,
    FilePdfOutlined,
    DownloadOutlined,
    PrinterOutlined,
    BarChartOutlined,
    PieChartOutlined,
    LineChartOutlined,
    TeamOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
    FilterOutlined,
    SaveOutlined,
    ReloadOutlined,
    UserAddOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    CheckOutlined,
    CloseOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import requestService from "../../services/RequestService";
import RequestService from "../../services/RequestService";

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

// Sample department data
const departments = [
    'All',
    'Engineering',
    'HR',
    'Marketing',
    'Sales',
    'Finance',
    'Operations',
    'Customer Support',
];

const AdminAccountRequests = () => {
    const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs()]);
    const [department, setDepartment] = useState('All');
    const [status, setStatus] = useState('All');
    const [dataTable, setDataTable] = useState([]);
    const [rejectModalVisible, setRejectModalVisible] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [currentRejectRecord, setCurrentRejectRecord] = useState(null);

    useEffect(() => {
        loadDataTable();
    }, []);

    const loadDataTable = async () => {
        try{
            const code = 'ACCOUNT_CREATE_REQUEST';
            const response = await requestService.getByTypeCode(code);
            if(response.success){
                setDataTable(response.data);
            }
        }catch (e) {
            console.log(e)
        }
    }

    const handleApprove = (record) => {
        Modal.confirm({
            title: 'Approve Account Request',
            content: `Are you sure you want to approve the account request for ${record.employeeId.fullName}?`,
            okText: 'Yes, Approve',
            okType: 'primary',
            cancelText: 'No',
            onOk: async () => {
                try{
                    let body = {
                        requestId: record._id,
                        status: 'Approved',
                    }
                    const response = await RequestService.approveRequest(body);
                    if(response.success){
                        message.success(`Account request for ${record.employeeId.fullName} has been approved`);
                    }
                }catch (e) {
                    message.error(e.message);
                }finally {
                    loadDataTable();
                }
            }
        });
    };

    const handleReject = (record) => {
        setCurrentRejectRecord(record);
        setRejectReason('');
        setRejectModalVisible(true);
    };

    const handleConfirmReject = async () => {
        if (!rejectReason.trim()) {
            message.warning('Vui lòng nhập lý do từ chối!');
            return;
        }
        try {
            let body = {
                requestId: currentRejectRecord._id,
                status: 'Rejected',
                reason: rejectReason,
            };
            console.log(body)
            const response = await RequestService.approveRequest(body);
            if (response.success) {
                message.success(`Đã từ chối yêu cầu của ${currentRejectRecord.employeeId.fullName}`);
            }
        } catch (e) {
            message.error(e.message);
        } finally {
            setRejectModalVisible(false);
            setCurrentRejectRecord(null);
            setRejectReason('');
            loadDataTable();
        }
    };

    const columns = [
        {
            title: 'Tên nhân viên',
            dataIndex:['dataReq', 'fullName'],
            key: 'fullName',
            sorter: (a, b) => a.dataReq.fullName.localeCompare(b.dataReq.fullName),
        },
        {
            title: 'Email',
            dataIndex: ['dataReq', 'email'],
            key: 'email',
        },
        {
            title: 'Phòng ban',
            dataIndex: ['dataReq', 'departmentName'],
            key: 'departmentName',
            filters: departments.map(dept => ({
                text: dept,
                value: dept,
            })),
            onFilter: (value, record) => record.dataReq.departmentName === value,
        },
        {
            title: 'Chức vụ',
            dataIndex: ['dataReq', 'positionName'],
            key: 'positionName',
        },
        {
            title: 'Người gửi yêu cầu',
            dataIndex: ['employeeId', 'fullName'],
            key: 'fullNameReq',
        },
        {
            title: 'Ngày gửi yêu cầu',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => dayjs(text).format('DD/MM/YYYY'),
            sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text) => {
                const colorMap = {
                    Pending: 'warning',
                    Approved: 'success',
                    Rejected: 'error',
                };
                return (
                    <Tag color={colorMap[text]}>
                        {text.charAt(0).toUpperCase() + text.slice(1)}
                    </Tag>
                );
            },
            filters: [
                { text: 'Pending', value: 'Pending' },
                { text: 'Approved', value: 'Approved' },
                { text: 'Rejected', value: 'Rejected' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Lý do',
            dataIndex: 'reason',
            key: 'reason',
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            key: 'note',
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    {record.status === 'Pending' && (
                        <>
                            <Button
                                type="primary"
                                icon={<CheckOutlined />}
                                onClick={() => handleApprove(record)}
                            >
                            </Button>
                            <Button
                                danger
                                icon={<CloseOutlined />}
                                onClick={() => handleReject(record)}
                            >
                            </Button>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px', maxWidth: '1800px', margin: '0 auto' }}>
            <div style={{ 
                marginBottom: '24px', 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <Title level={3} style={{ margin: 0 }}>
                        <UserAddOutlined style={{ marginRight: '8px' }} />
                        Yêu cầu tạo tài khoản nhân viên
                    </Title>
                    <Text type="secondary" style={{ fontSize: '14px' }}>
                        Hr yêu cầu tạo tài khoản nhân viên từ các phòng ban
                    </Text>
                </div>
            </div>

            {/* Filter Panel */}
            <Card 
                style={{ marginBottom: '24px' }}
                variant="outlined"
                styles={{
                    body: { padding: '16px' }
                }}
            >
                <Form layout="inline" style={{ flexWrap: 'wrap', gap: '16px' }}>
                    <Form.Item label="Date Range" style={{ marginBottom: 0 }}>
                        <RangePicker
                            value={dateRange}
                            onChange={setDateRange}
                            allowClear={false}
                            style={{ width: '280px' }}
                        />
                    </Form.Item>
                    <Form.Item label="Department" style={{ marginBottom: 0 }}>
                        <Select
                            value={department}
                            onChange={setDepartment}
                            style={{ width: '200px' }}
                        >
                            {departments.map(dept => (
                                <Option key={dept} value={dept}>{dept}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Status" style={{ marginBottom: 0 }}>
                        <Select
                            value={status}
                            onChange={setStatus}
                            style={{ width: '200px' }}
                        >
                            <Option value="All">All</Option>
                            <Option value="pending">Pending</Option>
                            <Option value="approved">Approved</Option>
                            <Option value="rejected">Rejected</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button type="primary" icon={<FilterOutlined />}>
                            Apply Filters
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            {/* Statistics */}
            <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={8}>
                    <Card variant="outlined">
                        <Statistic
                            title="Total Requests"
                            value={dataTable.length}
                            valueStyle={{ color: '#1890ff' }}
                            prefix={<TeamOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card variant="outlined">
                        <Statistic
                            title="Pending Requests"
                            value={dataTable.filter(item => item.status === 'Pending').length}
                            valueStyle={{ color: '#faad14' }}
                            prefix={<ClockCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card variant="outlined">
                        <Statistic
                            title="Approved Requests"
                            value={dataTable.filter(item => item.status === 'Approved').length}
                            valueStyle={{ color: '#52c41a' }}
                            prefix={<CheckCircleOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Requests Table */}
            <Card 
                variant="outlined"
                styles={{
                    body: { padding: '16px' }
                }}
            >
                <Table
                    columns={columns}
                    dataSource={dataTable}
                    rowKey="id"
                    pagination={{ 
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
                    }}
                    scroll={{ x: 'max-content' }}
                />
            </Card>
            <Modal
                title="Nhập lý do từ chối"
                visible={rejectModalVisible}
                onOk={handleConfirmReject}
                onCancel={() => setRejectModalVisible(false)}
                okText="Xác nhận từ chối"
                cancelText="Hủy"
            >
                <Form layout="vertical">
                    <Form.Item label="Lý do từ chối" required>
                        <Input.TextArea
                            rows={4}
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            placeholder="Nhập lý do từ chối..."
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminAccountRequests;
