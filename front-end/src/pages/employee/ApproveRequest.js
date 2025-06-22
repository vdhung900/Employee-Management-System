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
    Modal,
    Avatar,
    Divider,
    Tooltip,
    Badge,
    Statistic,
    Progress,
    Drawer,
} from 'antd';
import {
    SearchOutlined,
    EyeOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
    UserOutlined,
    PrinterOutlined,
    MailOutlined,
} from '@ant-design/icons';
import ThreeDContainer from '../../components/3d/ThreeDContainer';
import RequestService from '../../services/RequestService';
import { formatDate } from '../../utils/format';

const { Title, Text, Paragraph } = Typography;

const ApproveRequest = () => {
    const [searchText, setSearchText] = useState('');
    const [requests, setRequests] = useState([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        setLoading(true);
        try{
            const code = 'ACCOUNT_CREATE_REQUEST';
            const response = await RequestService.getByTypeCode(code);
            if(response.success){
                setRequests(response.data);
            }
        }catch (e) {
            console.log(e)
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved':
                return 'success';
            case 'Rejected':
                return 'error';
            case 'Pending':
                return 'processing';
            case 'Cancelled':
                return 'default';
            default:
                return 'default';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'Approved':
                return 'Đã phê duyệt';
            case 'Rejected':
                return 'Từ chối';
            case 'Pending':
                return 'Đang chờ duyệt';
            case 'Cancelled':
                return 'Đã hủy';
            default:
                return 'Không xác định';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'red';
            case 'normal':
                return 'blue';
            case 'low':
                return 'green';
            default:
                return 'default';
        }
    };

    const getPriorityLabel = (priority) => {
        switch (priority) {
            case 'high':
                return 'Cao';
            case 'normal':
                return 'Bình thường';
            case 'low':
                return 'Thấp';
            default:
                return 'Không xác định';
        }
    };

    const showDrawer = (request) => {
        setSelectedRequest(request);
        setDrawerVisible(true);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
        setSelectedRequest(null);
    };

    const handleApprove = async (request, status) => {
        Modal.confirm({
            title: status === 'Approved' ? 'Xác nhận phê duyệt' : 'Xác nhận từ chối',
            content: `Bạn có chắc chắn muốn ${status === 'Approved' ? 'phê duyệt' : 'từ chối'} yêu cầu này?`,
            okText: status === 'Approved' ? 'Phê duyệt' : 'Từ chối',
            okType: status === 'Approved' ? 'primary' : 'danger',
            cancelText: 'Hủy',
            async onOk() {
                try {
                    await RequestService.approveRequest({ requestId: request._id, status });
                    loadRequests();
                    closeDrawer();
                } catch (e) {
                    // handle error
                }
            },
        });
    };

    const columns = [
        {
            title: 'Nhân viên',
            dataIndex: ['employeeId', 'fullName'],
            key: 'employeeName',
            render: (text, record) => (
                <Space>
                    <Avatar style={{ backgroundColor: '#722ed1' }}>{text.charAt(0)}</Avatar>
                    <div>
                        <div style={{ fontWeight: 'bold' }}>{text}</div>
                        <Text type="secondary">{record.employeeId.email}</Text>
                    </div>
                </Space>
            ),
            sorter: (a, b) => a.employeeId.fullName.localeCompare(b.employeeId.fullName),
            filteredValue: searchText ? [searchText] : null,
            onFilter: (value, record) =>
                record.employeeId.fullName.toLowerCase().includes(value.toLowerCase()) ||
                record.employeeId.email.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: 'Loại yêu cầu',
            dataIndex: ['typeRequest', 'name'],
            key: 'typeRequest',
            render: (text, record) => (
                <Space direction="vertical" size="small">
                    <div>{record.typeRequest.name}</div>
                    <Tag color={getPriorityColor(record.priority)}>{getPriorityLabel(record.priority)}</Tag>
                </Space>
            ),
        },
        {
            title: 'Ngày gửi',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => formatDate(text),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            key: 'note',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Badge status={getStatusColor(status)} text={getStatusLabel(status)} />
            ),
            filters: [
                { text: 'Đang chờ duyệt', value: 'Pending' },
                { text: 'Đã phê duyệt', value: 'Approved' },
                { text: 'Từ chối', value: 'Rejected' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button type="text" icon={<EyeOutlined />} onClick={() => showDrawer(record)} />
                    </Tooltip>
                    {record.status === 'Pending' && (
                        <>
                            <Tooltip title="Phê duyệt">
                                <Button type="text" icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />} onClick={() => handleApprove(record, 'Approved')} />
                            </Tooltip>
                            <Tooltip title="Từ chối">
                                <Button type="text" icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />} onClick={() => handleApprove(record, 'Rejected')} />
                            </Tooltip>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    const pendingRequests = requests.filter((r) => r.status === 'Pending').length;
    const approvedRequests = requests.filter((r) => r.status === 'Approved').length;
    const rejectedRequests = requests.filter((r) => r.status === 'Rejected').length;

    return (
        <div style={{ padding: '10px' }}>
            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                <Col span={24}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <Title level={2}>Duyệt đơn nhân viên</Title>
                            <Text type="secondary">HR/Manager phê duyệt các yêu cầu của nhân viên</Text>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                <Col xs={24} sm={12} lg={8}>
                    <ThreeDContainer>
                        <Card>
                            <Statistic
                                title="Đang chờ duyệt"
                                value={pendingRequests}
                                valueStyle={{ color: '#1890ff' }}
                                prefix={<ClockCircleOutlined />}
                            />
                            <div style={{ marginTop: 8 }}>
                                <Progress percent={requests.length ? Math.round((pendingRequests / requests.length) * 100) : 0} size="small" strokeColor="#1890ff" />
                            </div>
                        </Card>
                    </ThreeDContainer>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <ThreeDContainer>
                        <Card>
                            <Statistic
                                title="Đã phê duyệt"
                                value={approvedRequests}
                                valueStyle={{ color: '#52c41a' }}
                                prefix={<CheckCircleOutlined />}
                            />
                            <div style={{ marginTop: 8 }}>
                                <Progress percent={requests.length ? Math.round((approvedRequests / requests.length) * 100) : 0} size="small" strokeColor="#52c41a" />
                            </div>
                        </Card>
                    </ThreeDContainer>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <ThreeDContainer>
                        <Card>
                            <Statistic
                                title="Từ chối"
                                value={rejectedRequests}
                                valueStyle={{ color: '#ff4d4f' }}
                                prefix={<CloseCircleOutlined />}
                            />
                            <div style={{ marginTop: 8 }}>
                                <Progress percent={requests.length ? Math.round((rejectedRequests / requests.length) * 100) : 0} size="small" strokeColor="#ff4d4f" />
                            </div>
                        </Card>
                    </ThreeDContainer>
                </Col>
            </Row>
            <ThreeDContainer>
                <Card>
                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                        <Input
                            placeholder="Tìm kiếm theo tên, email..."
                            prefix={<SearchOutlined />}
                            style={{ width: 300 }}
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            allowClear
                        />
                    </div>
                    <Table
                        dataSource={requests.filter(item =>
                            (item.status === 'Pending' || item.status === 'Approved' || item.status === 'Rejected') &&
                            (item.employeeId.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
                                item.employeeId.email.toLowerCase().includes(searchText.toLowerCase()))
                        )}
                        columns={columns}
                        rowKey={record => record._id}
                        loading={loading}
                        pagination={{
                            defaultPageSize: 10,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '50', '100'],
                            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} yêu cầu`,
                        }}
                    />
                </Card>
            </ThreeDContainer>
            <Drawer
                title="Chi tiết yêu cầu"
                placement="right"
                width={700}
                onClose={closeDrawer}
                open={drawerVisible}
                extra={
                    <Space>
                        <Button onClick={closeDrawer}>Đóng</Button>
                        {selectedRequest && selectedRequest.status === 'Pending' && (
                            <>
                                <Button type="primary" onClick={() => handleApprove(selectedRequest, 'Approved')} icon={<CheckCircleOutlined />}>Phê duyệt</Button>
                                <Button danger onClick={() => handleApprove(selectedRequest, 'Rejected')} icon={<CloseCircleOutlined />}>Từ chối</Button>
                            </>
                        )}
                    </Space>
                }
            >
                {selectedRequest && (
                    <>
                        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <Title level={4} style={{ marginBottom: 4 }}>
                                    Yêu cầu {selectedRequest.typeRequest.name}
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
                                        <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: '#722ed1', marginRight: 16 }} />
                                        <div>
                                            <Title level={5} style={{ marginBottom: 4 }}>{selectedRequest.employeeId.fullName}</Title>
                                            <div>Email: {selectedRequest.employeeId.email}</div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                        <Divider orientation="left">Thông tin yêu cầu</Divider>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Statistic title="Loại yêu cầu" value={selectedRequest.typeRequest.name} valueStyle={{ fontSize: '16px' }} />
                            </Col>
                            <Col span={12}>
                                <Statistic title="Mức độ ưu tiên" value={getPriorityLabel(selectedRequest.priority)} valueStyle={{ fontSize: '16px', color: getPriorityColor(selectedRequest.priority) }} />
                            </Col>
                            <Col span={12}>
                                <Statistic title="Ngày gửi" value={formatDate(selectedRequest.createdAt)} valueStyle={{ fontSize: '16px' }} />
                            </Col>
                        </Row>
                        <Divider orientation="left">Ghi chú</Divider>
                        <Paragraph>{selectedRequest.note}</Paragraph>
                    </>
                )}
            </Drawer>
        </div>
    );
};

export default ApproveRequest;
