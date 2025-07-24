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
import {STATUS} from "../../constants/Status";
import {useLoading} from "../../contexts/LoadingContext";

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
    const {showLoading, hideLoading} = useLoading();

    useEffect(() => {
      try{
        showLoading()
        loadDataTable();
      }catch (e) {
          console.log(e)
      }finally{
        hideLoading()
      }
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
            title: 'Phê duyệt yêu cầu tạo tải khoản',
            content: `Bạn có chắc chắn muốn phê duyệt yêu cầu tạo tài khoản từ nhân viên ${record.employeeId.fullName}?`,
            okText: 'Đồng ý',
            okType: 'primary',
            cancelText: 'Từ chối',
            onOk: async () => {
                try{
                    let body = {
                        requestId: record._id,
                        status: 'Approved',
                    }
                    const response = await RequestService.approveRequest(body);
                    if(response.success){
                        message.success(`Yêu cầu tạo tài khoản của nhân viên ${record.employeeId.fullName} đã được phê duyệt`);
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

    const getTextTrangThai = (status) => {
      if(status === STATUS.APPROVED){
        return "Đã phê duyệt"
      }else if(status === STATUS.REJECTED){
        return "Từ chối"
      }else if(status === STATUS.PENDING){
        return "Đang chờ duyệt"
      }
    }

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
            title: 'Trạng thái',
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
                        {getTextTrangThai(text)}
                    </Tag>
                );
            },
            filters: [
                { text: 'Đang chờ duyệt', value: 'Pending' },
                { text: 'Đã phê duyệt', value: 'Approved' },
                { text: 'Từ chối', value: 'Rejected' },
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

            {/* Statistics */}
            <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={6}>
                    <Card variant="outlined">
                        <Statistic
                            title="Tất cả yêu cầu"
                            value={dataTable.length}
                            valueStyle={{ color: '#1890ff' }}
                            prefix={<TeamOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card variant="outlined">
                        <Statistic
                            title="Đang chờ duyệt"
                            value={dataTable.filter(item => item.status === STATUS.PENDING).length}
                            valueStyle={{ color: '#faad14' }}
                            prefix={<ClockCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card variant="outlined">
                        <Statistic
                            title="Đã phê duyệt"
                            value={dataTable.filter(item => item.status === STATUS.APPROVED).length}
                            valueStyle={{ color: '#52c41a' }}
                            prefix={<CheckCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card variant="outlined">
                        <Statistic
                            title="Từ chối"
                            value={dataTable.filter(item => item.status === STATUS.REJECTED).length}
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
