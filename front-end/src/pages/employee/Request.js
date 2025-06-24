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
    Radio, message
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
import requestService from "../../services/RequestService";
import admin_account from "../../services/Admin_account";
import {formatDate} from "../../utils/format";
import moment from 'moment';
import UploadFileComponent from "../../components/file-list/FileList";

const {Title, Text, Paragraph} = Typography;
const {Option} = Select;
const {TabPane} = Tabs;
const {RangePicker} = DatePicker;

const RequestTypeForm = ({form, requestType, departments = [], positions = []}) => {
    const formFields = {
        LEAVE_REQUEST: {
            fields: (
                <>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name={['dataReq', 'startDate']}
                                label="Ngày bắt đầu nghỉ"
                                rules={[{required: true, message: 'Vui lòng chọn ngày bắt đầu'}]}
                            >
                                <DatePicker style={{width: '100%'}}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name={['dataReq', 'endDate']}
                                label="Ngày kết thúc nghỉ"
                                rules={[{required: true, message: 'Vui lòng chọn ngày kết thúc'}]}
                            >
                                <DatePicker style={{width: '100%'}}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        name={['dataReq', 'reason']}
                        label="Lý do nghỉ phép"
                        rules={[{required: true, message: 'Vui lòng nhập lý do nghỉ phép'}]}
                    >
                        <Input.TextArea rows={4} placeholder="Nhập lý do nghỉ phép"/>
                    </Form.Item>
                </>
            ),
            initialValues: {
                dataReq: {
                    startDate: null,
                    endDate: null,
                    reason: ''
                }
            }
        },
        OVERTIME: {
            fields: (
                <>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name={['dataReq', 'startDate']}
                                label="Ngày tăng ca"
                                rules={[{required: true, message: 'Vui lòng chọn ngày tăng ca'}]}
                            >
                                <DatePicker style={{width: '100%'}}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name={['dataReq', 'hours']}
                                label="Số giờ tăng ca"
                                rules={[{required: true, message: 'Vui lòng nhập số giờ tăng ca'}]}
                            >
                                <Input type="number" min={1} max={24}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        name={['dataReq', 'reason']}
                        label="Lý do tăng ca"
                        rules={[{required: true, message: 'Vui lòng nhập lý do tăng ca'}]}
                    >
                        <Input.TextArea rows={4} placeholder="Nhập lý do tăng ca"/>
                    </Form.Item>
                </>
            ),
            initialValues: {
                dataReq: {
                    startDate: null,
                    hours: null,
                    reason: ''
                }
            }
        },
        ACCOUNT_CREATE_REQUEST: {
            fields: (
                <>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name={['dataReq', 'fullName']}
                                label="Họ và tên nhân viên"
                                rules={[
                                    {required: true, message: 'Vui lòng nhập họ và tên'},
                                    {min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự'}
                                ]}
                            >
                                <Input placeholder="Nhập họ và tên nhân viên"/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name={['dataReq', 'startDate']}
                                label="Ngày bắt đầu làm việc"
                                rules={[{required: true, message: 'Vui lòng chọn ngày bắt đầu'}]}
                            >
                                <DatePicker style={{width: '100%'}}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name={['dataReq', 'email']}
                                label="Email"
                                rules={[
                                    {required: true, message: 'Vui lòng nhập email'},
                                    {type: 'email', message: 'Email không hợp lệ'}
                                ]}
                            >
                                <Input placeholder="Nhập email"/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name={['dataReq', 'phone']}
                                label="Số điện thoại"
                                rules={[
                                    {required: true, message: 'Vui lòng nhập số điện thoại'},
                                    {pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ'}
                                ]}
                            >
                                <Input placeholder="Nhập số điện thoại"/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name={['dataReq', 'department']}
                                label="Phòng ban"
                                rules={[{required: true, message: 'Vui lòng chọn phòng ban'}]}
                            >
                                <Select placeholder="Chọn phòng ban">
                                    {departments.map(department => (
                                        <Option key={department._id} value={department._id}>
                                            {department.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name={['dataReq', 'position']}
                                label="Chức vụ"
                                rules={[{required: true, message: 'Vui lòng chọn chức vụ'}]}
                            >
                                <Select placeholder="Chọn chức vụ">
                                    {positions.map(position => (
                                        <Option key={position._id} value={position._id}>
                                            {position.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name={['dataReq', 'reason']}
                                label="Chức vụ"
                                hidden={true}
                            >
                            </Form.Item>
                        </Col>
                    </Row>

                </>
            ),
            initialValues: {
                dataReq: {
                    fullName: '',
                    startDate: null,
                    email: '',
                    phone: '',
                    department: undefined,
                    position: undefined,
                    note: '',
                    reason: ''
                }
            }
        }
    };

    const selectedForm = formFields[requestType];
    if (!selectedForm) return null;

    return selectedForm.fields;
};

const Requests = () => {
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [requestCategories, setRequestCategories] = useState([]);
    const [selectedDataType, setSelectedDataType] = useState(null);
    const [selectedRequestType, setSelectedRequestType] = useState(null);
    const [form] = Form.useForm();
    const [requests, setRequests] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [positions, setPositions] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [fileResponse, setFileResponse] = useState([]);


    useEffect(() => {
        try {
            loadTypeReq();
            loadDataReq();
            loadDepartments();
            loadPositions();
        } catch (e) {
            console.log(e, 'test');
        }
    }, []);

    const loadDepartments = async () => {
        try {
            const response = await admin_account.getAllDepartments();
            setDepartments(response);
        } catch (e) {
            console.log(e, 'test');

        }
    }

    const loadPositions = async () => {
        try {
            const response = await admin_account.getAllPositions();
            setPositions(response);
        } catch (e) {
            console.log(e, 'test');

        }
    }

    const loadDataReq = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) throw new Error("Bạn chưa đăng nhập !!!");
            let body = {
                employeeId: user.employeeId,
            }
            const response = await requestService.getByAccountId(body);
            if (response.success) {
                setRequests(response.data);
            }
        } catch (e) {
            console.log(e, 'Error loading data requests');
        }
    }

    const loadTypeReq = async () => {
        try {
            const response = await CategoryService.getTypeReqByRole();
            if (response.success) {
                const data = response.data;
                data.map(item => ({
                    code: item.code,
                    name: item.name
                }))
                setRequestCategories(data)
            }
        } catch (e) {
            console.log(e)
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'success';
            case 'rejected':
                return 'error';
            case 'pending':
                return 'processing';
            case 'cancelled':
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

    const showModal = (request = null) => {
        setSelectedRequest(request);
        setIsModalVisible(true);
        setIsEdit(false)
        if (request) {
            setIsEdit(true);
            handleRequestTypeChange(request.typeRequest.code);
            form.setFieldsValue({
                requestId: request._id,
                employeeId: request.employeeId,
                typeCode: request.typeRequest.code,
                priority: request.priority,
                note: request.note,
                attachments: request.attachments
            });
            setFileResponse(request.attachments)
            if (request.typeRequest.code === "ACCOUNT_CREATE_REQUEST") {
                form.setFieldsValue({
                    dataReq: {
                        fullName: request.dataReq.fullName || '',
                        startDate: request.dataReq.startDate ? moment(request.dataReq.startDate) : undefined,
                        email: request.dataReq.email || '',
                        phone: request.dataReq.phone || '',
                        department: request.dataReq.department || '',
                        position: request.dataReq.position || '',
                        note: request.dataReq.note || '',
                        reason: request.dataReq.reason || ''
                    }
                })
            } else if (request.typeRequest.code === "LEAVE_REQUEST") {
                form.setFieldsValue({
                    dataReq: {
                        startDate: request.dataReq.startDate ? moment(request.dataReq.startDate) : undefined,
                        endDate: request.dataReq.endDate ? moment(request.dataReq.endDate) : undefined,
                        reason: request.dataReq.reason || ''
                    }
                })
            }
        } else {
            form.resetFields();
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedRequestType(null);
        setFileResponse([])
        setIsEdit(false);
    };

    const handleFormSubmit = async (values) => {
        try {
            let body = values;
            console.log(fileResponse)
            if(fileResponse.length > 0){
                body.attachments = fileResponse;
            }else{
                body.attachments = [];
            }
            if (body.requestId) {
                const response = await requestService.updateRequest(body);
                if(response.success) {
                    message.success(response.message);
                }
            } else {
                const user = JSON.parse(localStorage.getItem("user"));
                body.employeeId = user.employeeId;
                const response = await requestService.createRequest(body);
                if(response.success) {
                    message.success(response.message);
                }
            }
        } catch (e) {
            message.error("Lỗi khi lưu thông tin")
        }finally {
            loadDataReq();
            setIsModalVisible(false);
            setFileResponse([])
            form.resetFields();
            setSelectedDataType(null);
        }
    };

    const handleRequestTypeChange = (value) => {
        setSelectedRequestType(value);
        const formFields = {
            LEAVE_REQUEST: {
                dataReq: {
                    startDate: undefined,
                    endDate: undefined,
                    reason: undefined
                }
            },
            OVERTIME: {
                dataReq: {
                    startDate: undefined,
                    hours: undefined,
                    reason: undefined
                }
            },
            ACCOUNT_CREATE_REQUEST: {
                dataReq: {
                    fullName: undefined,
                    startDate: undefined,
                    email: undefined,
                    phone: undefined,
                    department: undefined,
                    position: undefined,
                    reason: undefined
                }
            }
        };
        form.setFieldsValue(formFields[value] || {});
    };

    const renderRequestTypeFields = () => {
        return <RequestTypeForm form={form} requestType={selectedRequestType} departments={departments}
                                positions={positions}/>;
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
            content: `Bạn có chắc chắn muốn hủy yêu cầu ${request.typeRequest.name}?`,
            okText: 'Hủy yêu cầu',
            okType: 'danger',
            cancelText: 'Đóng',
            async onOk() {
                let body = request;
                body.requestId = request._id;
                body.status = "Cancelled";
                const response = await requestService.approveRequest(body);
                if (response.success) {
                    loadDataReq();
                    Modal.success({
                        title: 'Yêu cầu đã được hủy',
                        content: `Yêu cầu ${request.typeRequest.name} đã được hủy thành công.`,
                    });
                }
            },
        });
    };

    const columns = [
        {
            title: 'Nhân viên gửi yêu cầu',
            dataIndex: ['employeeId', 'fullName'],
            key: 'employeeName',
            render: (text, record) => (
                <Space>
                    <Avatar style={{backgroundColor: '#722ed1'}}>{text.charAt(0)}</Avatar>
                    <div>
                        <div style={{fontWeight: 'bold'}}>{text}</div>
                        <Text type="secondary">{record.employeeId.email}</Text>
                    </div>
                </Space>
            ),
            sorter: (a, b) => a.employeeId.fullName.localeCompare(b.employeeId.fullName),
            filteredValue: searchText ? [searchText] : null,
            onFilter: (value, record) =>
                record.employeeId.fullName.toLowerCase().includes(value.toLowerCase()) ||
                record.employeeId.email.toLowerCase().includes(value.toLowerCase())
        },
        {
            title: 'Thông tin yêu cầu',
            key: 'requestInfo',
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    {/*<div style={{ fontWeight: 'bold' }}>{record.requestNumber}</div>*/}
                    <div>Loại: {record.typeRequest.name}</div>
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
                    <div>Gửi: {formatDate(record.createdAt)}</div>
                </Space>
            ),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'Thời gian giải quyết',
            dataIndex: 'timeResolve',
            key: 'timeResolve',
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            key: 'note',
        },
        {
            title: 'Lý do',
            key: 'dataReq',
            render: status => (
                <div>{status.dataReq !== null ? status.dataReq.reason : ""}</div>
            ),
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            render: status => (
                <Badge
                    status={
                        status === 'Approved' ? 'success' :
                            status === 'Rejected' ? 'error' :
                                status === 'Pending' ? 'processing' : 'default'
                    }
                    text={getStatusLabel(status)}
                />
            ),
            filters: [
                {text: 'Đã phê duyệt', value: 'Approved'},
                {text: 'Từ chối', value: 'Rejected'},
                {text: 'Đang chờ duyệt', value: 'Pending'},
                {text: 'Đã hủy', value: 'Cancelled'},
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
                            icon={<EyeOutlined/>}
                            onClick={() => showDrawer(record)}
                        />
                    </Tooltip>
                    {record.status === 'Pending' && (
                        <>
                            <Tooltip title="Chỉnh sửa">
                                <Button
                                    type="text"
                                    icon={<EditOutlined/>}
                                    onClick={() => showModal(record)}
                                />
                            </Tooltip>
                            <Tooltip title="Hủy yêu cầu">
                                <Button
                                    type="text"
                                    icon={<CloseOutlined/>}
                                    onClick={() => confirmDelete(record)}
                                />
                            </Tooltip>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    const pendingRequests = requests.filter(r => r.status === 'Pending').length;
    const approvedRequests = requests.filter(r => r.status === 'Approved').length;
    const rejectedRequests = requests.filter(r => r.status === 'Rejected').length;
    const cancelledRequests = requests.filter(r => r.status === 'Cancelled').length;

    return (
        <div style={{padding: '10px'}}>
            <Row gutter={[16, 16]} style={{marginBottom: '20px'}}>
                <Col span={24}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div>
                            <Title level={2}>Quản lý yêu cầu</Title>
                            <Text type="secondary">Gửi và theo dõi các yêu cầu của nhân viên</Text>
                        </div>
                        <div>
                            <Button
                                type="primary"
                                icon={<PlusOutlined/>}
                                onClick={() => showModal()}
                                style={{marginRight: '8px'}}
                            >
                                Tạo yêu cầu mới
                            </Button>
                            <Dropdown
                                menu={{
                                    items: [
                                        {key: '1', label: 'Export danh sách', icon: <ExportOutlined/>},
                                        {key: '2', label: 'Xem hướng dẫn', icon: <QuestionCircleOutlined/>},
                                    ]
                                }}
                            >
                                <Button>
                                    <Space>
                                        Thao tác
                                        <DownOutlined/>
                                    </Space>
                                </Button>
                            </Dropdown>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{marginBottom: '16px'}}>
                <Col xs={24} sm={12} lg={6}>
                    <ThreeDContainer>
                        <Card>
                            <Statistic
                                title="Đang chờ duyệt"
                                value={pendingRequests}
                                valueStyle={{color: '#1890ff'}}
                                prefix={<ClockCircleOutlined/>}
                            />
                            <div style={{marginTop: 8}}>
                                <Progress percent={Math.round((pendingRequests / requests.length) * 100)} size="small"
                                          strokeColor="#1890ff"/>
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
                                valueStyle={{color: '#52c41a'}}
                                prefix={<CheckCircleOutlined/>}
                            />
                            <div style={{marginTop: 8}}>
                                <Progress percent={Math.round((approvedRequests / requests.length) * 100)} size="small"
                                          strokeColor="#52c41a"/>
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
                                valueStyle={{color: '#ff4d4f'}}
                                prefix={<CloseCircleOutlined/>}
                            />
                            <div style={{marginTop: 8}}>
                                <Progress percent={Math.round((rejectedRequests / requests.length) * 100)} size="small"
                                          strokeColor="#ff4d4f"/>
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
                                valueStyle={{color: '#d9d9d9'}}
                                prefix={<CloseOutlined/>}
                            />
                            <div style={{marginTop: 8}}>
                                <Progress percent={Math.round((cancelledRequests / requests.length) * 100)} size="small"
                                          strokeColor="#d9d9d9"/>
                            </div>
                        </Card>
                    </ThreeDContainer>
                </Col>
            </Row>

            <ThreeDContainer>
                <Tabs defaultActiveKey="1">
                    <TabPane
                        tab={<span><FileTextOutlined/> Tất cả yêu cầu</span>}
                        key="1"
                    >
                        <Card>
                            <div style={{marginBottom: 16, display: 'flex', justifyContent: 'space-between'}}>
                                <Input
                                    placeholder="Tìm kiếm theo tên, ID, số yêu cầu..."
                                    prefix={<SearchOutlined/>}
                                    style={{width: 300}}
                                    value={searchText}
                                    onChange={e => setSearchText(e.target.value)}
                                    allowClear
                                />
                                <Space>
                                    <RangePicker placeholder={['Từ ngày', 'Đến ngày']} style={{marginRight: 8}}/>
                                    <Button icon={<FilterOutlined/>} style={{marginRight: 8}}>
                                        Lọc
                                    </Button>
                                    <Button icon={<ExportOutlined/>}>
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
                        tab={<span><ClockCircleOutlined/> Đang chờ duyệt</span>}
                        key="2"
                    >
                        <Card>
                            <div style={{marginBottom: 16, display: 'flex', justifyContent: 'space-between'}}>
                                <Input
                                    placeholder="Tìm kiếm theo tên, ID, số yêu cầu..."
                                    prefix={<SearchOutlined/>}
                                    style={{width: 300}}
                                    value={searchText}
                                    onChange={e => setSearchText(e.target.value)}
                                    allowClear
                                />
                                <Space>
                                    <RangePicker placeholder={['Từ ngày', 'Đến ngày']} style={{marginRight: 8}}/>
                                    <Button icon={<FilterOutlined/>} style={{marginRight: 8}}>
                                        Lọc
                                    </Button>
                                    <Button icon={<ExportOutlined/>}>
                                        Export
                                    </Button>
                                </Space>
                            </div>

                            <Table
                                dataSource={requests.filter(item => item.status === "Pending")}
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
                        tab={<span><CheckCircleOutlined/> Đã phê duyệt</span>}
                        key="3"
                    >
                        <Card>
                            <div style={{marginBottom: 16, display: 'flex', justifyContent: 'space-between'}}>
                                <Input
                                    placeholder="Tìm kiếm theo tên, ID, số yêu cầu..."
                                    prefix={<SearchOutlined/>}
                                    style={{width: 300}}
                                    value={searchText}
                                    onChange={e => setSearchText(e.target.value)}
                                    allowClear
                                />
                                <Space>
                                    <RangePicker placeholder={['Từ ngày', 'Đến ngày']} style={{marginRight: 8}}/>
                                    <Button icon={<FilterOutlined/>} style={{marginRight: 8}}>
                                        Lọc
                                    </Button>
                                    <Button icon={<ExportOutlined/>}>
                                        Export
                                    </Button>
                                </Space>
                            </div>

                            <Table
                                dataSource={requests.filter(item => item.status === "Approved")}
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
                        label="Loại yêu cầu"
                        rules={[{required: true, message: 'Vui lòng chọn loại yêu cầu'}]}
                    >
                        <Select
                            placeholder="Chọn loại yêu cầu"
                            onChange={handleRequestTypeChange}
                            disabled={isEdit}
                        >
                            {requestCategories.map(category => (
                                <Option key={category.code} value={category.code}>{category.name}</Option>
                            ))}
                        </Select>
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
                        <UploadFileComponent uploadFileSuccess={setFileResponse} isSingle={true} files={fileResponse}/>
                    </Form.Item>
                    {selectedRequestType && (
                        <>
                            {renderRequestTypeFields()}
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
                        {selectedRequest && selectedRequest.status === 'Pending' && (
                            <Button type="primary" onClick={() => showModal(selectedRequest)}>
                                Chỉnh sửa
                            </Button>
                        )}
                    </Space>
                }
            >
                {selectedRequest && (
                    <>
                        <div style={{
                            marginBottom: 24,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start'
                        }}>
                            <div>
                                <Title level={4} style={{marginBottom: 4}}>
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
                                    <Button icon={<PrinterOutlined/>}>In yêu cầu</Button>
                                    <Button icon={<MailOutlined/>}>Gửi email</Button>
                                </Space>
                            </div>
                        </div>

                        <Divider orientation="left">Thông tin nhân viên</Divider>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Card size="small">
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        <Avatar
                                            size={64}
                                            icon={<UserOutlined/>}
                                            style={{backgroundColor: '#722ed1', marginRight: 16}}
                                        />
                                        <div>
                                            <Title level={5}
                                                   style={{marginBottom: 4}}>{selectedRequest.employeeId.fullName}</Title>
                                            <div>Email: {selectedRequest.employeeId.email}</div>
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
                                    value={selectedRequest.typeRequest.name}
                                    valueStyle={{fontSize: '16px'}}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Mức độ ưu tiên"
                                    value={getPriorityLabel(selectedRequest.priority)}
                                    valueStyle={{fontSize: '16px', color: getPriorityColor(selectedRequest.priority)}}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Ngày gửi"
                                    value={formatDate(selectedRequest.createdAt)}
                                    valueStyle={{fontSize: '16px'}}
                                />
                            </Col>
                            {/*<Col span={12}>*/}
                            {/*    <Statistic*/}
                            {/*        title="Thời gian yêu cầu"*/}
                            {/*        value={`${selectedRequest.startDate} - ${selectedRequest.endDate}`}*/}
                            {/*        valueStyle={{ fontSize: '16px' }}*/}
                            {/*    />*/}
                            {/*</Col>*/}
                        </Row>

                        <Divider orientation="left">Ghi chú</Divider>
                        <Paragraph>{selectedRequest.note}</Paragraph>

                        {/*<Divider orientation="left">*/}
                        {/*    <Space>*/}
                        {/*        <HistoryOutlined />*/}
                        {/*        Lịch sử yêu cầu*/}
                        {/*    </Space>*/}
                        {/*</Divider>*/}
                        {/*<Timeline mode="left">*/}
                        {/*    {selectedRequest.history.map((item, index) => (*/}
                        {/*        <Timeline.Item*/}
                        {/*            key={index}*/}
                        {/*            color={*/}
                        {/*                item.action.includes('Đã phê duyệt') ? 'green' :*/}
                        {/*                    item.action.includes('Từ chối') ? 'red' :*/}
                        {/*                        item.action.includes('Tạo yêu cầu') ? 'blue' :*/}
                        {/*                            item.action.includes('Đang xem xét') ? 'orange' : 'gray'*/}
                        {/*            }*/}
                        {/*            label={item.date}*/}
                        {/*        >*/}
                        {/*            <div style={{ fontWeight: 'bold' }}>{item.action}</div>*/}
                        {/*            <div>Thực hiện bởi: {item.user}</div>*/}
                        {/*        </Timeline.Item>*/}
                        {/*    ))}*/}
                        {/*</Timeline>*/}
                    </>
                )}
            </Drawer>
        </div>
    );
};

export default Requests;
