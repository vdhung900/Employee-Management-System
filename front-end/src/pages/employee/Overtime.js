import React, { useState, useEffect } from 'react';
import {
    Card,
    Button,
    Table,
    Space,
    Typography,
    Row,
    Col,
    Tag,
    Form,
    Input,
    DatePicker,
    TimePicker,
    Select,
    Modal,
    Divider,
    Alert,
    notification,
    Popconfirm
} from 'antd';
import {
    ClockCircleOutlined,
    PlusOutlined,
    HistoryOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import UploadFileComponent from "../../components/file-list/FileList";

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const Overtime = () => {
    const [loading, setLoading] = useState(false);
    const [requestModalVisible, setRequestModalVisible] = useState(false);
    const [requests, setRequests] = useState([]);
    const [form] = Form.useForm();
    const [editMode, setEditMode] = useState(false);
    const [currentRequest, setCurrentRequest] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [files, setFiles] = useState([]);
    const [dateRange, setDateRange] = useState([
        dayjs().startOf('month'),
        dayjs().endOf('month'),
    ]);

    useEffect(() => {
        fetchOvertimeRequests();
    }, []);

    const fetchOvertimeRequests = () => {
        setLoading(true);
        setTimeout(() => {
            setRequests([]);
            setLoading(false);
        }, 1000);
    };

    const handleRequestSubmit = (values) => {
        setLoading(true);

        setTimeout(() => {
            const newRequest = {
                id: editMode ? currentRequest.id : `OT${Date.now().toString().slice(-8)}`,
                date: values.date.format('YYYY-MM-DD'),
                startTime: values.timeRange[0].format('HH:mm'),
                endTime: values.timeRange[1].format('HH:mm'),
                duration: values.timeRange[1].diff(values.timeRange[0], 'hour', true).toFixed(1),
                reason: values.reason,
                status: editMode ? currentRequest.status : 'pending',
                createdAt: editMode ? currentRequest.createdAt : new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            if (editMode) {
                // Update existing request
                const updatedRequests = requests.map(req =>
                    req.id === currentRequest.id ? newRequest : req
                );
                setRequests(updatedRequests);
                notification.success({
                    message: 'Cập nhật thành công',
                    description: 'Yêu cầu làm thêm giờ đã được cập nhật',
                });
            } else {
                // Add new request
                setRequests([newRequest, ...requests]);
                notification.success({
                    message: 'Đăng ký thành công',
                    description: 'Yêu cầu làm thêm giờ đã được gửi đi và đang chờ phê duyệt',
                });
            }

            setRequestModalVisible(false);
            setCurrentRequest(null);
            setEditMode(false);
            form.resetFields();
            setLoading(false);
        }, 1000);
    };

    const handleEdit = (record) => {
        setCurrentRequest(record);
        setEditMode(true);

        // Split the time strings into hours and minutes
        const [startHours, startMinutes] = record.startTime.split(':').map(Number);
        const [endHours, endMinutes] = record.endTime.split(':').map(Number);

        // Create time objects
        const startTime = dayjs().hour(startHours).minute(startMinutes);
        const endTime = dayjs().hour(endHours).minute(endMinutes);

        form.setFieldsValue({
            date: dayjs(record.date),
            timeRange: [startTime, endTime],
            reason: record.reason,
        });

        setRequestModalVisible(true);
    };

    const handleDelete = (id) => {
        setLoading(true);
        setTimeout(() => {
            const updatedRequests = requests.filter(req => req.id !== id);
            setRequests(updatedRequests);
            notification.success({
                message: 'Xóa thành công',
                description: 'Yêu cầu làm thêm giờ đã được xóa',
            });
            setLoading(false);
        }, 1000);
    };

    const handleCancel = (id) => {
        setLoading(true);
        setTimeout(() => {
            const updatedRequests = requests.map(req => {
                if (req.id === id) {
                    return {
                        ...req,
                        status: 'cancelled',
                        updatedAt: new Date().toISOString(),
                    };
                }
                return req;
            });

            setRequests(updatedRequests);
            notification.success({
                message: 'Hủy thành công',
                description: 'Yêu cầu làm thêm giờ đã được hủy',
            });
            setLoading(false);
        }, 1000);
    };

    const handleStatusChange = (value) => {
        setFilterStatus(value);
    };

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
    };

    // Get filtered requests based on status and date range
    const getFilteredRequests = () => {
        return requests.filter(req => {
            const matchStatus = filterStatus === 'all' || req.status === filterStatus;
            const reqDate = dayjs(req.date);
            const matchDate =
                !dateRange ||
                !dateRange[0] ||
                !dateRange[1] ||
                (reqDate.isAfter(dateRange[0], 'day') || reqDate.isSame(dateRange[0], 'day')) &&
                (reqDate.isBefore(dateRange[1], 'day') || reqDate.isSame(dateRange[1], 'day'));

            return matchStatus && matchDate;
        });
    };

    const columns = [
        {
            title: 'Mã yêu cầu',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Ngày làm thêm',
            dataIndex: 'date',
            key: 'date',
            render: text => dayjs(text).format('DD/MM/YYYY'),
        },
        {
            title: 'Thời gian',
            key: 'time',
            render: (_, record) => (
                <span>{record.startTime} - {record.endTime}</span>
            ),
        },
        {
            title: 'Số giờ',
            dataIndex: 'duration',
            key: 'duration',
            render: text => `${text} giờ`,
        },
        {
            title: 'Lý do',
            dataIndex: 'reason',
            key: 'reason',
            ellipsis: true,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: status => {
                let color = 'blue';
                let text = 'Đang xử lý';
                let icon = <ExclamationCircleOutlined />;

                if (status === 'approved') {
                    color = 'green';
                    text = 'Đã duyệt';
                    icon = <CheckCircleOutlined />;
                } else if (status === 'rejected') {
                    color = 'red';
                    text = 'Từ chối';
                    icon = <CloseCircleOutlined />;
                } else if (status === 'cancelled') {
                    color = 'default';
                    text = 'Đã hủy';
                    icon = <CloseCircleOutlined />;
                }

                return (
                    <Tag icon={icon} color={color}>
                        {text}
                    </Tag>
                );
            },
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: text => dayjs(text).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => {
                // Only allow edit/delete/cancel for pending requests
                if (record.status === 'pending') {
                    return (
                        <Space size="small">
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                size="small"
                                onClick={() => handleEdit(record)}
                            />
                            <Popconfirm
                                title="Bạn có chắc muốn hủy yêu cầu này?"
                                onConfirm={() => handleCancel(record.id)}
                                okText="Đồng ý"
                                cancelText="Hủy"
                            >
                                <Button
                                    type="primary"
                                    icon={<CloseCircleOutlined />}
                                    size="small"
                                    danger
                                />
                            </Popconfirm>
                            <Popconfirm
                                title="Bạn có chắc muốn xóa yêu cầu này?"
                                onConfirm={() => handleDelete(record.id)}
                                okText="Đồng ý"
                                cancelText="Hủy"
                            >
                                <Button
                                    type="primary"
                                    icon={<DeleteOutlined />}
                                    size="small"
                                    danger
                                />
                            </Popconfirm>
                        </Space>
                    );
                }
                return null; // No actions for non-pending requests
            },
        },
    ];

    const mockRequests = [
        {
            id: 'OT20230501',
            date: '2023-06-15',
            startTime: '18:00',
            endTime: '21:00',
            duration: '3.0',
            reason: 'Hoàn thành dự án A trước deadline',
            status: 'approved',
            createdAt: '2023-06-10T08:30:00Z',
            updatedAt: '2023-06-11T10:15:00Z',
        },
        {
            id: 'OT20230502',
            date: '2023-06-20',
            startTime: '18:00',
            endTime: '20:00',
            duration: '2.0',
            reason: 'Xử lý sự cố máy chủ',
            status: 'pending',
            createdAt: '2023-06-12T09:45:00Z',
            updatedAt: '2023-06-12T09:45:00Z',
        },
        {
            id: 'OT20230503',
            date: '2023-05-28',
            startTime: '08:00',
            endTime: '12:00',
            duration: '4.0',
            reason: 'Làm bù ngày nghỉ',
            status: 'rejected',
            createdAt: '2023-05-20T14:20:00Z',
            updatedAt: '2023-05-22T11:05:00Z',
        },
        {
            id: 'OT20230504',
            date: '2023-06-25',
            startTime: '17:30',
            endTime: '19:30',
            duration: '2.0',
            reason: 'Họp với khách hàng ở múi giờ khác',
            status: 'pending',
            createdAt: '2023-06-14T10:30:00Z',
            updatedAt: '2023-06-14T10:30:00Z',
        },
        {
            id: 'OT20230505',
            date: '2023-05-15',
            startTime: '18:00',
            endTime: '22:00',
            duration: '4.0',
            reason: 'Triển khai phần mềm mới',
            status: 'cancelled',
            createdAt: '2023-05-10T08:30:00Z',
            updatedAt: '2023-05-12T15:45:00Z',
        }
    ];

    return (
        <div className="overtime-page">
            <Row gutter={[24, 24]}>
                <Col xs={24}>
                    <Title level={2}>Đăng ký làm thêm giờ</Title>
                    <Text type="secondary">
                        Quản lý và đăng ký thời gian làm thêm giờ
                    </Text>
                </Col>

                <Col xs={24}>
                    <Card bordered={false}>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={8}>
                                <RangePicker
                                    style={{ width: '100%' }}
                                    value={dateRange}
                                    onChange={handleDateRangeChange}
                                    placeholder={['Từ ngày', 'Đến ngày']}
                                    format="DD/MM/YYYY"
                                />
                            </Col>
                            <Col xs={24} md={8}>
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="Lọc theo trạng thái"
                                    onChange={handleStatusChange}
                                    value={filterStatus}
                                >
                                    <Option value="all">Tất cả trạng thái</Option>
                                    <Option value="pending">Đang chờ duyệt</Option>
                                    <Option value="approved">Đã duyệt</Option>
                                    <Option value="rejected">Từ chối</Option>
                                    <Option value="cancelled">Đã hủy</Option>
                                </Select>
                            </Col>
                            <Col xs={24} md={8} style={{ textAlign: 'right' }}>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => {
                                        setRequestModalVisible(true);
                                        setEditMode(false);
                                        form.resetFields();
                                    }}
                                >
                                    Đăng ký làm thêm giờ
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col xs={24}>
                    <Card
                        title={
                            <Space>
                                <HistoryOutlined />
                                <span>Lịch sử đăng ký làm thêm giờ</span>
                            </Space>
                        }
                        bordered={false}
                        extra={
                            <Text>Tổng số: {getFilteredRequests().length} yêu cầu</Text>
                        }
                    >
                        <Table
                            columns={columns}
                            dataSource={getFilteredRequests()}
                            loading={loading}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                        />
                    </Card>
                </Col>

                <Col xs={24}>
                    <Card bordered={false}>
                        <Title level={4}>Chính sách làm thêm giờ</Title>
                        <Paragraph>
                            <ul>
                                <li>Làm thêm giờ phải được đăng ký trước ít nhất 1 ngày làm việc.</li>
                                <li>Thời gian làm thêm tối đa không quá 4 giờ/ngày và 40 giờ/tháng.</li>
                                <li>Làm thêm giờ vào ngày nghỉ phải được phê duyệt bởi cấp quản lý.</li>
                                <li>Làm thêm giờ sẽ được tính với hệ số 1.5 vào ngày thường và 2.0 vào ngày nghỉ/lễ.</li>
                            </ul>
                        </Paragraph>
                    </Card>
                </Col>
            </Row>

            <Modal
                title={editMode ? "Cập nhật yêu cầu làm thêm giờ" : "Đăng ký làm thêm giờ"}
                open={requestModalVisible}
                onCancel={() => {
                    setRequestModalVisible(false);
                    setEditMode(false);
                    setCurrentRequest(null);
                    form.resetFields();
                }}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleRequestSubmit}
                    initialValues={{
                        date: dayjs(),
                        timeRange: [dayjs('18:00', 'HH:mm'), dayjs('20:00', 'HH:mm')],
                    }}
                >
                    <Form.Item
                        name="requestId"
                        hidden={true}
                    >
                    </Form.Item>
                    <Form.Item
                        name="employeeId"
                        hidden={true}
                    >
                    </Form.Item>
                    <Form.Item
                        name="typeCode"
                        hidden={true}
                    >
                    </Form.Item>
                    <Form.Item
                        name="priority"
                        label="Mức độ ưu tiên"
                        rules={[{required: true, message: 'Vui lòng chọn mức độ ưu tiên'}]}
                    >
                        <Select placeholder="Chọn mức độ ưu tiên">
                            <Option value="high">Cao</Option>
                            <Option value="normal">Bình thường</Option>
                            <Option value="low">Thấp</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="note"
                        label="Ghi chú"
                    >
                        <Input.TextArea rows={4} placeholder="Nhập ghi chú (nếu có)"/>
                    </Form.Item>

                    <Form.Item
                        name="attachments"
                    >
                        <UploadFileComponent uploadFileSuccess={setFiles} isSingle={true} files={files}/>
                    </Form.Item>
                    <Form.Item
                        name={['dataReq', 'startDate']}
                        label="Ngày tăng ca"
                        rules={[{required: true, message: 'Vui lòng chọn ngày tăng ca'}]}
                    >
                        <DatePicker style={{width: '100%'}}/>
                    </Form.Item>

                    <Form.Item
                        name={['dataReq', 'hours']}
                        label="Thời gian làm thêm"
                        rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
                    >
                        <TimePicker.RangePicker
                            style={{ width: '100%' }}
                            format="HH:mm"
                        />
                    </Form.Item>

                    <Form.Item
                        name={['dataReq', 'reason']}
                        label="Lý do tăng ca"
                        rules={[{required: true, message: 'Vui lòng nhập lý do tăng ca'}]}
                    >
                        <Input.TextArea rows={4} placeholder="Nhập lý do tăng ca"/>
                    </Form.Item>

                    <Form.Item>
                        <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                onClick={() => {
                                    setRequestModalVisible(false);
                                    setEditMode(false);
                                    setCurrentRequest(null);
                                    form.resetFields();
                                }}
                            >
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                {editMode ? 'Cập nhật' : 'Đăng ký'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Overtime;
