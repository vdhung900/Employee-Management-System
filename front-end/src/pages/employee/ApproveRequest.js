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
    Drawer, message,
    List,
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
    ApartmentOutlined,
    FileTextOutlined,
    ExclamationCircleOutlined,
    CalendarOutlined,
    BellOutlined,
    TeamOutlined,
    IdcardOutlined,
    FilterOutlined,
    DownloadOutlined, RiseOutlined,
    PhoneOutlined,
    TagOutlined,
    StarOutlined,
    DollarOutlined,
    HistoryOutlined, FilePdfOutlined,
} from '@ant-design/icons';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import ThreeDContainer from '../../components/3d/ThreeDContainer';
import RequestService from '../../services/RequestService';
import { formatDate } from '../../utils/format';
import { STATUS } from '../../constants/Status';
import Hr_ManageEmployee from "../../services/Hr_ManageEmployee";
import { renderRequestDetailByType } from '../../utils/render';
import {useLoading} from "../../contexts/LoadingContext";
import FileService from "../../services/FileService";
import SalaryService from "../../services/SalaryService";
import dayjs from "dayjs";
import SignatureCanvas from 'react-signature-canvas';

const { Title, Text, Paragraph } = Typography;

const ApproveRequest = () => {
    const [searchText, setSearchText] = useState('');
    const [requests, setRequests] = useState([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40'],
        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bản ghi`
    });
    const [statsModalVisible, setStatsModalVisible] = useState(false);
    const [employeeStats, setEmployeeStats] = useState(null);
    const [selectedRequestForStats, setSelectedRequestForStats] = useState(null);
    const {showLoading, hideLoading} = useLoading();
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [showSignModal, setShowSignModal] = useState(false);
    const [signing, setSigning] = useState(false);
    const [signType, setSignType] = useState('draw'); // 'draw' | 'image'
    const [signaturePad, setSignaturePad] = useState(null);
    const [selectedRecord, setSelectedRecord] = useState(null);

    useEffect(() => {
        try{
            showLoading()
            loadRequests(pagination.current, pagination.pageSize);
        }catch (e) {
            message.error(e.message)
        }finally {
            hideLoading()
        }
    }, []);

    const loadRequests = async (page = 1, size = 10) => {
        setLoading(true);
        try{
            const employee = JSON.parse(localStorage.getItem('employee'));
            let body = {}
            body.departmentId = employee?.departmentId?._id;
            body.page = page;
            body.limit = size;
            const response = await RequestService.getByFilterCode(body);
            if(response.success){
                setRequests(response.data.content || []);
                setPagination(prev => ({
                    ...prev,
                    current: page,
                    pageSize: size,
                    total: response.data.totalItems || 0
                }));
            }
        }catch (e) {
            console.log(e)
        } finally {
            setLoading(false);
        }
    };

    const analyzeEmployee = async (userId, request) => {
        try {
            const response = await Hr_ManageEmployee.getAnalyzeEmployeeByUserId(userId);
            if(response.success) {
                setEmployeeStats(response.data);
                setSelectedRequestForStats(request);
                setStatsModalVisible(true);
            }
        } catch (e) {
            message.error(e.message);
        }
    };

    const handlePreviewDoc = async (doc) => {
        try {
            console.log(doc)
            const key = encodeURIComponent(doc.key);
            const blob = await FileService.getFile(key);
            if (blob) {
                const url = window.URL.createObjectURL(blob);
                setPreviewFile(doc);
                setPreviewUrl(url);
                setPreviewVisible(true);
            } else {
                message.error('Không thể xem trước file');
            }
        } catch (e) {
            message.error('Không thể xem trước file');
        }
    };

    const handleStatsModalClose = () => {
        setStatsModalVisible(false);
        setEmployeeStats(null);
        setSelectedRequestForStats(null);
    };

    const renderPerformanceChart = (data) => {
        if (!data || !data.last6MonthsScores || data.last6MonthsScores.length === 0) return null;

        const chartData = data.last6MonthsScores.map(item => ({
            month: item.month.split('-')[1],
            score: item.score
        })).reverse();

        return (
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 10]} />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="#8884d8" name="Điểm đánh giá" />
                </LineChart>
            </ResponsiveContainer>
        );
    };

    const renderAttendanceChart = (data) => {
        if (!data || !data.monthlyBreakdown) return null;

        const chartData = Object.entries(data.monthlyBreakdown).map(([month, stats]) => ({
            month: month.split('-')[1],
            đúng_giờ: stats.present - (stats.late || 0),
            đi_muộn: stats.late || 0,
            vắng: stats.absent || 0,
            total: stats.total || 0
        })).reverse();

        return (
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="đúng_giờ" stackId="a" fill="#52c41a" />
                    <Bar dataKey="đi_muộn" stackId="a" fill="#faad14" />
                    <Bar dataKey="vắng" stackId="a" fill="#ff4d4f" />
                </BarChart>
            </ResponsiveContainer>
        );
    };

    const handleTableChange = (pagination) => {
        loadRequests(pagination.current, pagination.pageSize);
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

    const handleSignModalOk = async () => {
        showLoading()
        if (!signaturePad || signaturePad.isEmpty()) {
            message.warning("Vui lòng ký vào ô ký số!");
            return;
        }
        setSigning(true);
        try {
            const signatureDataUrl = signaturePad.getTrimmedCanvas().toDataURL("image/png");
            const signatureBase64 = signatureDataUrl.split(",")[1];
            if(selectedRecord){
                const payload = {
                    requestId: selectedRecord._id,
                    signatureImage: signatureBase64,
                    status: STATUS.APPROVED
                }
                const response = await SalaryService.signSalaryPdfByManage(payload)
                if(response){
                    message.success(response.message);
                }else{
                    message.error(response.message);
                }
            }
        } catch (e) {
            message.error(e.message)
        } finally {
            loadRequests(pagination.current, pagination.pageSize)
            setShowSignModal(false);
            setSignaturePad(signaturePad.clear())
            setSigning(false);
            setSelectedRecord(null);
            hideLoading()
        }
    };

    const handleCancel = async () => {
        setSignaturePad(signaturePad.clear())
        setSigning(false);
        setSelectedRecord(null);
        setShowSignModal(false);
    }

    const handleSign = async (record) => {
        try{
            setSelectedRecord(record);
            setShowSignModal(true);
        }catch (e) {
            message.error(e.message)
        }
    }

    const handleApprove = async (request, status) => {
        Modal.confirm({
            title: status === 'Approved' ? 'Xác nhận phê duyệt' : 'Xác nhận từ chối',
            content: `Bạn có chắc chắn muốn ${status === 'Approved' ? 'phê duyệt' : 'từ chối'} yêu cầu này?`,
            okText: status === 'Approved' ? 'Phê duyệt' : 'Từ chối',
            okType: status === 'Approved' ? 'primary' : 'danger',
            cancelText: 'Hủy',
            async onOk() {
                try {
                    showLoading()
                    const response = await RequestService.approveRequest({ requestId: request._id, status });
                    if(response.success){
                        message.success(`Yêu cầu đã ${status === 'Approved' ? 'phê duyệt' : 'từ chối'} thành công!`);
                    }else{
                        message.error(`Không thể ${status === 'Approved' ? 'phê duyệt' : 'từ chối'} yêu cầu này.`);
                    }
                    closeDrawer();
                    if(requests?.typeRequest?.code === STATUS.SALARY_INCREASE){
                        handleStatsModalClose();
                    }
                } catch (e) {
                    message.error(`Lỗi khi ${status === 'Approved' ? 'phê duyệt' : 'từ chối'} yêu cầu: ${e.message}`);
                }finally {
                    hideLoading()
                    loadRequests(pagination.current, pagination.pageSize);
                    closeDrawer();
                    handleStatsModalClose();
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
                        <Text type="secondary">{record.employeeId.email}</Text><br/>
                        <Text type="secondary">{record.departmentId?.name}</Text>
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
            title: 'Lí do',
            key: 'reason',
            render: (value, record) => {
                if (record.status === STATUS.REJECTED) {
                    return record.reason || '—';
                } else {
                    return record.dataReq?.reason || '—';
                }
            }
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
            title: "Thao tác",
            key: "action",
            render: (_, record) => {
                const isSalaryApprovedPending =
                    record.typeRequest?.code === STATUS.SALARY_APPROVED &&
                    record.status === STATUS.PENDING;

                return (
                    <Space size="small">
                        {/* Xem chi tiết */}
                        <Tooltip title="Xem chi tiết">
                            <Button
                                type="text"
                                icon={<EyeOutlined />}
                                onClick={() => showDrawer(record)}
                            />
                        </Tooltip>

                        {record.typeRequest?.code === STATUS.SALARY_INCREASE &&
                        record.status === STATUS.PENDING ? (
                            <Tooltip title="Thống kê nhân viên">
                                <Button
                                    type="primary"
                                    icon={<RiseOutlined />}
                                    onClick={() =>
                                        analyzeEmployee(record.dataReq.employeeId, record)
                                    }
                                />
                            </Tooltip>
                        ) : (
                            <>
                                {isSalaryApprovedPending && (
                                    <Tooltip title="Xem bảng lương PDF">
                                        <Button
                                            type="text"
                                            icon={<FilePdfOutlined style={{ color: "#fa541c" }} />}
                                            onClick={() => handlePreviewDoc(record.attachments[0])}
                                        />
                                    </Tooltip>
                                )}

                                {isSalaryApprovedPending ? (
                                    <>
                                        <Tooltip title="Duyệt và Ký">
                                            <Button
                                                type="text"
                                                icon={<CheckCircleOutlined style={{ color: "#1890ff" }} />}
                                                onClick={() => handleSign(record)}
                                            />
                                        </Tooltip>
                                        <Tooltip title="Từ chối">
                                            <Button
                                                type="text"
                                                icon={<CloseCircleOutlined style={{ color: "#ff4d4f" }} />}
                                                onClick={() => handleApprove(record, STATUS.REJECTED)}
                                            />
                                        </Tooltip>
                                    </>
                                ) : (
                                    record.status === STATUS.PENDING && (
                                        <>
                                            <Tooltip title="Phê duyệt">
                                                <Button
                                                    type="text"
                                                    icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
                                                    onClick={() => handleApprove(record, STATUS.APPROVED)}
                                                />
                                            </Tooltip>
                                            <Tooltip title="Từ chối">
                                                <Button
                                                    type="text"
                                                    icon={<CloseCircleOutlined style={{ color: "#ff4d4f" }} />}
                                                    onClick={() => handleApprove(record, STATUS.REJECTED)}
                                                />
                                            </Tooltip>
                                        </>
                                    )
                                )}
                            </>
                        )}
                    </Space>
                );
            },
        }
    ];

    const pendingRequests = requests.filter((r) => r.status === 'Pending').length;
    const approvedRequests = requests.filter((r) => r.status === 'Approved').length;
    const rejectedRequests = requests.filter((r) => r.status === 'Rejected').length;

    return (
        <div style={{ padding: 24 }}>
            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 24
                    }}>
                        <Space direction="vertical" size={4}>
                            <Title level={2} style={{ margin: 0 }}>
                                <ApartmentOutlined style={{ marginRight: 12, color: '#1890ff' }} />
                                Duyệt đơn nhân viên
                            </Title>
                            <Text type="secondary" style={{ fontSize: 16 }}>
                                <TeamOutlined style={{ marginRight: 8 }} />
                                HR/Manager phê duyệt các yêu cầu của nhân viên
                            </Text>
                        </Space>
                        <Space size={12}>
                            <Button type="primary" icon={<DownloadOutlined />}>
                                Xuất báo cáo
                            </Button>
                        </Space>
                    </div>
                </Col>

                <Col xs={24} sm={12} lg={8}>
                    <ThreeDContainer>
                        <Card bordered={false} style={{ borderRadius: 8 }}>
                            <Statistic
                                title={
                                    <Text strong style={{ fontSize: 16 }}>
                                        <ClockCircleOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                                        Đang chờ duyệt
                                    </Text>
                                }
                                value={pendingRequests}
                                valueStyle={{ color: '#1890ff', fontSize: 28 }}
                            />
                            <Progress
                                percent={requests.length ? Math.round((pendingRequests / requests.length) * 100) : 0}
                                strokeColor="#1890ff"
                                size="small"
                                style={{ marginTop: 16 }}
                            />
                        </Card>
                    </ThreeDContainer>
                </Col>

                <Col xs={24} sm={12} lg={8}>
                    <ThreeDContainer>
                        <Card bordered={false} style={{ borderRadius: 8 }}>
                            <Statistic
                                title={
                                    <Text strong style={{ fontSize: 16 }}>
                                        <CheckCircleOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                                        Đã phê duyệt
                                    </Text>
                                }
                                value={approvedRequests}
                                valueStyle={{ color: '#52c41a', fontSize: 28 }}
                            />
                            <Progress
                                percent={requests.length ? Math.round((approvedRequests / requests.length) * 100) : 0}
                                strokeColor="#52c41a"
                                size="small"
                                style={{ marginTop: 16 }}
                            />
                        </Card>
                    </ThreeDContainer>
                </Col>

                <Col xs={24} sm={12} lg={8}>
                    <ThreeDContainer>
                        <Card bordered={false} style={{ borderRadius: 8 }}>
                            <Statistic
                                title={
                                    <Text strong style={{ fontSize: 16 }}>
                                        <CloseCircleOutlined style={{ marginRight: 8, color: '#ff4d4f' }} />
                                        Từ chối
                                    </Text>
                                }
                                value={rejectedRequests}
                                valueStyle={{ color: '#ff4d4f', fontSize: 28 }}
                            />
                            <Progress
                                percent={requests.length ? Math.round((rejectedRequests / requests.length) * 100) : 0}
                                strokeColor="#ff4d4f"
                                size="small"
                                style={{ marginTop: 16 }}
                            />
                        </Card>
                    </ThreeDContainer>
                </Col>

                <Col span={24}>
                    <ThreeDContainer>
                        <Card bordered={false} style={{ borderRadius: 8 }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 24
                            }}>
                                <Space size={16}>
                                    <Input.Search
                                        placeholder="Tìm kiếm theo tên, email..."
                                        style={{ width: 300 }}
                                        value={searchText}
                                        onChange={e => setSearchText(e.target.value)}
                                        allowClear
                                    />
                                    <Button icon={<FilterOutlined />}>Bộ lọc</Button>
                                </Space>
                                <Space>
                                    <Button icon={<PrinterOutlined />}>In danh sách</Button>
                                    <Button icon={<DownloadOutlined />}>Tải xuống</Button>
                                </Space>
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
                                pagination={pagination}
                                onChange={handleTableChange}
                                style={{ marginTop: 16 }}
                            />
                        </Card>
                    </ThreeDContainer>
                </Col>
            </Row>

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
                        <Divider orientation="left">Chi tiết yêu cầu</Divider>
                        {renderRequestDetailByType(selectedRequest)}
                        <Divider orientation="left">Ghi chú</Divider>
                        <Paragraph>{selectedRequest.note}</Paragraph>
                    </>
                )}
            </Drawer>

            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <RiseOutlined style={{ fontSize: '24px', marginRight: '12px', color: '#722ed1' }} />
                        <span>Thống kê nhân viên</span>
                    </div>
                }
                open={statsModalVisible}
                onCancel={handleStatsModalClose}
                width={1000}
                footer={[
                    <Button key="cancel" onClick={handleStatsModalClose}>
                        Đóng
                    </Button>,
                    <Button
                        key="reject"
                        danger
                        icon={<CloseCircleOutlined />}
                        onClick={() => {
                            handleApprove(selectedRequestForStats, STATUS.REJECTED);
                            handleStatsModalClose();
                        }}
                    >
                        Từ chối
                    </Button>,
                    <Button
                        key="approve"
                        type="primary"
                        icon={<CheckCircleOutlined />}
                        onClick={() => {
                            handleApprove(selectedRequestForStats, STATUS.APPROVED);
                        }}
                    >
                        Phê duyệt
                    </Button>,
                ]}
            >
                {employeeStats && (
                    <>
                        <Card>
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                                        <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: '#722ed1', marginRight: 16 }} />
                                        <div>
                                            <Title level={4} style={{ margin: 0 }}>{employeeStats.employeeInfo.fullName}</Title>
                                            <Text>{employeeStats.employeeInfo.position} - {employeeStats.employeeInfo.department}</Text>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card>

                        <Divider orientation="left">
                            <Space>
                                <CalendarOutlined />
                                <span>Thống kê chấm công</span>
                            </Space>
                        </Divider>
                        <Row gutter={[16, 16]}>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="Tổng số ngày"
                                        value={employeeStats.attendance.overall.totalDays}
                                        suffix="ngày"
                                    />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="Đi làm đúng giờ"
                                        value={employeeStats.attendance.overall.presentDays - employeeStats.attendance.overall.lateDays}
                                        suffix="ngày"
                                        valueStyle={{ color: '#52c41a' }}
                                    />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="Đi muộn"
                                        value={employeeStats.attendance.overall.lateDays}
                                        suffix="ngày"
                                        valueStyle={{ color: '#faad14' }}
                                    />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="Tỷ lệ chuyên cần"
                                        value={employeeStats.attendance.overall.attendanceRate}
                                        suffix="%"
                                        precision={2}
                                        valueStyle={employeeStats.attendance.overall.attendanceRate >= 80 ? { color: '#52c41a' } : { color: '#ff4d4f' }}
                                    />
                                </Card>
                            </Col>
                            <Col span={24}>
                                <Card>
                                    <div style={{ marginBottom: 16 }}>
                                        <Text strong>Biểu đồ chấm công theo tháng</Text>
                                    </div>
                                    {renderAttendanceChart(employeeStats.attendance)}
                                </Card>
                            </Col>
                        </Row>

                        <Divider orientation="left">
                            <Space>
                                <RiseOutlined />
                                <span>Đánh giá hiệu suất</span>
                            </Space>
                        </Divider>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Card>
                                    <Statistic
                                        title="Điểm trung bình"
                                        value={employeeStats.performance.averageScore}
                                        precision={2}
                                        valueStyle={employeeStats.performance.averageScore >= 8 ? { color: '#52c41a' } : { color: '#ff4d4f' }}
                                        suffix="/10"
                                    />
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card>
                                    <Statistic
                                        title="Số lần được đánh giá"
                                        value={employeeStats.performance.totalReviews}
                                        valueStyle={{ color: '#722ed1' }}
                                    />
                                </Card>
                            </Col>
                            <Col span={24}>
                                <Card>
                                    <div style={{ marginBottom: 16 }}>
                                        <Text strong>Biểu đồ điểm đánh giá theo tháng</Text>
                                    </div>
                                    {renderPerformanceChart(employeeStats.performance)}
                                </Card>
                            </Col>
                        </Row>
                    </>
                )}
            </Modal>
            <Modal
                open={previewVisible}
                title={`Xem trước: ${previewFile?.originalName}`}
                footer={null}
                onCancel={() => {
                    setPreviewVisible(false);
                    setPreviewUrl('');
                    setPreviewFile(null);
                }}
                width={1000}
            >
                {previewUrl && (
                    previewFile?.originalName?.toLowerCase().endsWith('.pdf') ? (
                        <iframe src={previewUrl} width="100%" height="700px" title="preview" />
                    ) : (
                        <img src={previewUrl} alt="preview" style={{ maxWidth: '100%', maxHeight: 600 }} />
                    )
                )}
            </Modal>
            <Modal
                title="Ký duyệt bảng lương"
                open={showSignModal}
                onOk={handleSignModalOk}
                onCancel={() => handleCancel()}
                okText="Ký"
                cancelText="Hủy"
                confirmLoading={signing}
            >
                <div style={{ border: '1px solid #ccc', borderRadius: 4, padding: 8, marginBottom: 8 }}>
                    <SignatureCanvas
                        penColor="black"
                        canvasProps={{ width: 400, height: 120, className: 'sigCanvas' }}
                        ref={ref => setSignaturePad(ref)}
                        backgroundColor="#fff"
                    />
                    <div style={{ marginTop: 8 }}>
                        <Button onClick={() => signaturePad && signaturePad.clear()}>Xóa chữ ký</Button>
                    </div>
                </div>
                <p style={{ marginTop: 16 }}>Sau khi ký, chữ ký sẽ được gửi kèm với bảng lương PDF.</p>
            </Modal>
        </div>
    );
};

export default ApproveRequest;
