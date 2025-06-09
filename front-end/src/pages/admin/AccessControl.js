import React, { useState, useEffect } from 'react';
import {
    Card, Row, Col, Table, Input, Button, Switch, Form,
    Popconfirm, message, Typography, Tabs, Modal, Select,
    Space, Tag, Tooltip
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined,
    QuestionCircleOutlined, SearchOutlined, LockOutlined,
    GlobalOutlined, CloudOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// Mô phỏng dữ liệu IP được phép truy cập
const mockIPData = [
    { id: 1, ipAddress: '192.168.1.1', description: 'Văn phòng chính', isActive: true, createdAt: '2023-01-15', lastAccess: '2023-07-10' },
    { id: 2, ipAddress: '10.0.0.5', description: 'Máy chủ dự phòng', isActive: true, createdAt: '2023-02-20', lastAccess: '2023-07-09' },
    { id: 3, ipAddress: '172.16.10.1', description: 'Chi nhánh Hà Nội', isActive: true, createdAt: '2023-03-10', lastAccess: '2023-07-08' },
    { id: 4, ipAddress: '192.168.5.100', description: 'Chi nhánh HCM', isActive: false, createdAt: '2023-04-05', lastAccess: '2023-06-30' },
    { id: 5, ipAddress: '10.1.1.25', description: 'Văn phòng kỹ thuật', isActive: true, createdAt: '2023-05-12', lastAccess: '2023-07-07' },
];

// Mô phỏng dữ liệu API Endpoints
const mockAPIData = [
    { id: 1, endpoint: '/api/users', description: 'Quản lý người dùng', isPublic: false, authRequired: true, isActive: true },
    { id: 2, endpoint: '/api/auth/login', description: 'Đăng nhập', isPublic: true, authRequired: false, isActive: true },
    { id: 3, endpoint: '/api/attendance', description: 'Dữ liệu chấm công', isPublic: false, authRequired: true, isActive: true },
    { id: 4, endpoint: '/api/reports', description: 'Báo cáo', isPublic: false, authRequired: true, isActive: true },
    { id: 5, endpoint: '/api/settings', description: 'Cài đặt hệ thống', isPublic: false, authRequired: true, isActive: true },
];

const AccessControl = () => {
    const [ipData, setIpData] = useState([]);
    const [apiData, setApiData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [ipModalVisible, setIpModalVisible] = useState(false);
    const [apiModalVisible, setApiModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [ipForm] = Form.useForm();
    const [apiForm] = Form.useForm();
    const [activeTab, setActiveTab] = useState('1');

    useEffect(() => {
        // Giả lập tải dữ liệu
        setLoading(true);
        setTimeout(() => {
            setIpData(mockIPData);
            setApiData(mockAPIData);
            setLoading(false);
        }, 1000);
    }, []);

    // Xử lý IP
    const showIPModal = (record = null) => {
        setEditingRecord(record);
        if (record) {
            ipForm.setFieldsValue(record);
        } else {
            ipForm.resetFields();
        }
        setIpModalVisible(true);
    };

    const handleIPSubmit = () => {
        ipForm.validateFields().then(values => {
            setLoading(true);
            setTimeout(() => {
                if (editingRecord) {
                    // Cập nhật IP
                    const updatedData = ipData.map(item =>
                        item.id === editingRecord.id ? { ...item, ...values } : item
                    );
                    setIpData(updatedData);
                    message.success('Cập nhật IP thành công!');
                } else {
                    // Thêm IP mới
                    const newIP = {
                        id: ipData.length + 1,
                        ...values,
                        createdAt: new Date().toISOString().split('T')[0],
                        lastAccess: '-'
                    };
                    setIpData([...ipData, newIP]);
                    message.success('Thêm IP mới thành công!');
                }
                setIpModalVisible(false);
                setLoading(false);
            }, 500);
        });
    };

    const deleteIP = (id) => {
        setLoading(true);
        setTimeout(() => {
            const updatedData = ipData.filter(item => item.id !== id);
            setIpData(updatedData);
            message.success('Xóa IP thành công!');
            setLoading(false);
        }, 500);
    };

    const toggleIPStatus = (record) => {
        const updatedData = ipData.map(item =>
            item.id === record.id ? { ...item, isActive: !item.isActive } : item
        );
        setIpData(updatedData);
        message.success(`IP ${record.ipAddress} đã ${!record.isActive ? 'được kích hoạt' : 'bị vô hiệu hóa'}!`);
    };

    // Xử lý API
    const showAPIModal = (record = null) => {
        setEditingRecord(record);
        if (record) {
            apiForm.setFieldsValue(record);
        } else {
            apiForm.resetFields();
        }
        setApiModalVisible(true);
    };

    const handleAPISubmit = () => {
        apiForm.validateFields().then(values => {
            setLoading(true);
            setTimeout(() => {
                if (editingRecord) {
                    // Cập nhật API
                    const updatedData = apiData.map(item =>
                        item.id === editingRecord.id ? { ...item, ...values } : item
                    );
                    setApiData(updatedData);
                    message.success('Cập nhật API Endpoint thành công!');
                } else {
                    // Thêm API mới
                    const newAPI = {
                        id: apiData.length + 1,
                        ...values
                    };
                    setApiData([...apiData, newAPI]);
                    message.success('Thêm API Endpoint mới thành công!');
                }
                setApiModalVisible(false);
                setLoading(false);
            }, 500);
        });
    };

    const deleteAPI = (id) => {
        setLoading(true);
        setTimeout(() => {
            const updatedData = apiData.filter(item => item.id !== id);
            setApiData(updatedData);
            message.success('Xóa API Endpoint thành công!');
            setLoading(false);
        }, 500);
    };

    const toggleAPIStatus = (record) => {
        const updatedData = apiData.map(item =>
            item.id === record.id ? { ...item, isActive: !item.isActive } : item
        );
        setApiData(updatedData);
        message.success(`API ${record.endpoint} đã ${!record.isActive ? 'được kích hoạt' : 'bị vô hiệu hóa'}!`);
    };

    // Cấu hình bảng IP
    const ipColumns = [
        {
            title: 'IP Address',
            dataIndex: 'ipAddress',
            key: 'ipAddress',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: 'Truy cập gần nhất',
            dataIndex: 'lastAccess',
            key: 'lastAccess',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive, record) => (
                <Switch
                    checked={isActive}
                    onChange={() => toggleIPStatus(record)}
                    checkedChildren="Kích hoạt"
                    unCheckedChildren="Vô hiệu"
                />
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => showIPModal(record)}
                        size="small"
                    />
                    <Popconfirm
                        title="Bạn có chắc muốn xóa IP này?"
                        onConfirm={() => deleteIP(record.id)}
                        okText="Có"
                        cancelText="Không"
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    >
                        <Button
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Cấu hình bảng API
    const apiColumns = [
        {
            title: 'API Endpoint',
            dataIndex: 'endpoint',
            key: 'endpoint',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Loại truy cập',
            key: 'accessType',
            render: (_, record) => (
                <>
                    {record.isPublic ? (
                        <Tag color="green" icon={<GlobalOutlined />}>Public</Tag>
                    ) : (
                        <Tag color="blue" icon={<LockOutlined />}>Private</Tag>
                    )}
                    {record.authRequired && (
                        <Tag color="gold" icon={<LockOutlined />}>Auth Required</Tag>
                    )}
                </>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive, record) => (
                <Switch
                    checked={isActive}
                    onChange={() => toggleAPIStatus(record)}
                    checkedChildren="Kích hoạt"
                    unCheckedChildren="Vô hiệu"
                />
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => showAPIModal(record)}
                        size="small"
                    />
                    <Popconfirm
                        title="Bạn có chắc muốn xóa API Endpoint này?"
                        onConfirm={() => deleteAPI(record.id)}
                        okText="Có"
                        cancelText="Không"
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    >
                        <Button
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Title level={2}>Quản lý truy cập hệ thống</Title>

            <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <TabPane
                    tab={
                        <span>
              <CloudOutlined />
              Điều khiển IP
            </span>
                    }
                    key="1"
                >
                    <Card
                        title="Danh sách IP được phép truy cập"
                        extra={
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => showIPModal()}
                            >
                                Thêm IP mới
                            </Button>
                        }
                    >
                        <Table
                            columns={ipColumns}
                            dataSource={ipData}
                            rowKey="id"
                            loading={loading}
                            pagination={{ pageSize: 10 }}
                        />
                    </Card>
                </TabPane>

                <TabPane
                    tab={
                        <span>
              <GlobalOutlined />
              Điều khiển API
            </span>
                    }
                    key="2"
                >
                    <Card
                        title="Danh sách API Endpoints"
                        extra={
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => showAPIModal()}
                            >
                                Thêm API mới
                            </Button>
                        }
                    >
                        <Table
                            columns={apiColumns}
                            dataSource={apiData}
                            rowKey="id"
                            loading={loading}
                            pagination={{ pageSize: 10 }}
                        />
                    </Card>
                </TabPane>
            </Tabs>

            {/* Modal thêm/chỉnh sửa IP */}
            <Modal
                title={editingRecord ? "Chỉnh sửa IP" : "Thêm IP mới"}
                visible={ipModalVisible}
                onOk={handleIPSubmit}
                onCancel={() => setIpModalVisible(false)}
                confirmLoading={loading}
                destroyOnClose={true}
            >
                <Form
                    form={ipForm}
                    layout="vertical"
                >
                    <Form.Item
                        name="ipAddress"
                        label="Địa chỉ IP"
                        rules={[
                            { required: true, message: 'Vui lòng nhập địa chỉ IP!' },
                            {
                                pattern: /^(\d{1,3}\.){3}\d{1,3}$/,
                                message: 'Vui lòng nhập đúng định dạng IP (vd: 192.168.1.1)!'
                            }
                        ]}
                    >
                        <Input placeholder="VD: 192.168.1.1" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                    >
                        <Input placeholder="VD: Văn phòng chính" />
                    </Form.Item>
                    <Form.Item
                        name="isActive"
                        label="Trạng thái"
                        valuePropName="checked"
                        initialValue={true}
                    >
                        <Switch checkedChildren="Kích hoạt" unCheckedChildren="Vô hiệu" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal thêm/chỉnh sửa API */}
            <Modal
                title={editingRecord ? "Chỉnh sửa API Endpoint" : "Thêm API Endpoint mới"}
                visible={apiModalVisible}
                onOk={handleAPISubmit}
                onCancel={() => setApiModalVisible(false)}
                confirmLoading={loading}
                destroyOnClose={true}
            >
                <Form
                    form={apiForm}
                    layout="vertical"
                >
                    <Form.Item
                        name="endpoint"
                        label="API Endpoint"
                        rules={[
                            { required: true, message: 'Vui lòng nhập API Endpoint!' },
                            {
                                pattern: /^\/[a-zA-Z0-9\/\-_]*$/,
                                message: 'Endpoint phải bắt đầu bằng / và chỉ chứa các ký tự hợp lệ!'
                            }
                        ]}
                    >
                        <Input placeholder="VD: /api/users" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                    >
                        <Input placeholder="VD: Quản lý người dùng" />
                    </Form.Item>
                    <Form.Item
                        name="isPublic"
                        label="Truy cập công khai"
                        valuePropName="checked"
                        initialValue={false}
                    >
                        <Switch
                            checkedChildren="Public"
                            unCheckedChildren="Private"
                        />
                    </Form.Item>
                    <Form.Item
                        name="authRequired"
                        label="Yêu cầu xác thực"
                        valuePropName="checked"
                        initialValue={true}
                    >
                        <Switch
                            checkedChildren="Có"
                            unCheckedChildren="Không"
                        />
                    </Form.Item>
                    <Form.Item
                        name="isActive"
                        label="Trạng thái"
                        valuePropName="checked"
                        initialValue={true}
                    >
                        <Switch
                            checkedChildren="Kích hoạt"
                            unCheckedChildren="Vô hiệu"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AccessControl;
