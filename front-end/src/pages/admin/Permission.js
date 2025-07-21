import React, {useEffect, useState} from 'react';
import {
    Card,
    Table,
    Button,
    Space,
    Breadcrumb,
    Typography,
    Modal,
    Form,
    Input,
    Tag,
    Popconfirm,
    message,
    Row,
    Col
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SafetyOutlined
} from '@ant-design/icons';
import ThreeDContainer from '../../components/3d/ThreeDContainer';
import ThreeDCard from '../../components/3d/ThreeDCard';
import RolePermissionService from "../../services/RolePermissionService";

const { Title, Text } = Typography;
const { TextArea } = Input;

const Permission = () => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingPermission, setEditingPermission] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40'],
        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bản ghi`
    });

    useEffect(() => {
        loadData(pagination.current, pagination.pageSize);
    }, []);

    const loadData = async (page = 1, size = 10) => {
        try{
            let body = {}
            body.page = page;
            body.limit = size;
            const response = await RolePermissionService.getAllPermissions(body);
            if(response.success){
                setPermissions(response.data.content || []);
                setPagination(prev => ({
                    ...prev,
                    current: page,
                    pageSize: size,
                    total: response.data.totalItems || 0
                }));
            }
        }catch(err){
            message.error(err.message || 'Lỗi khi tải dữ liệu quyền!');
        }
    }

    const handleTableChange = (pagination) => {
        console.log('Table pagination changed:', pagination);
        loadData(pagination.current, pagination.pageSize);
    };

    const columns = [
        {
            title: 'STT',
            key: 'index',
            width: 80,
            render: (text, record, index) => index + 1
        },
        {
            title: 'Tên quyền',
            dataIndex: 'name',
            key: 'name',
            width: 200
        },
        {
            title: 'Mã quyền',
            dataIndex: 'code',
            key: 'code',
            width: 200
        },
        {
            title: 'Đường dẫn',
            dataIndex: 'path',
            key: 'path',
            width: 200
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            width: 200,
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 200,
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        style={{ borderRadius: '8px' }}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa quyền này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            style={{ borderRadius: '8px' }}
                        >
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleAdd = () => {
        form.resetFields();
        setEditingPermission(null);
        setVisible(true);
    };

    const handleEdit = (permission) => {
        setEditingPermission(permission);
        form.setFieldsValue({
            name: permission.name,
            code: permission.code,
            description: permission.description,
        });
        setVisible(true);
    };

    const handleDelete = (id) => {
        const newPermissions = permissions.filter(permission => permission.id !== id);
        setPermissions(newPermissions);
        message.success('Xóa quyền thành công!');
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            if (editingPermission) {
                message.success('Cập nhật quyền hạn thành công!');
            } else {
                const newPermission = {
                    name: values.name,
                    code: values.code,
                    path: values.path,
                    description: values.description,
                };
                const response = await RolePermissionService.createPermission(newPermission);
                if(response.success){
                    message.success('Thêm quyền hạn thành công!');
                }else{
                    message.error(response.message || 'Thêm quyền hạn thất bại!');
                }
            }
            setVisible(false);
        } catch (error) {
            message.error(error.message || 'Thêm quyền hạn thất bại!');
        } finally {
            setLoading(false);
            loadData();
        }
    };

    const handleCancel = () => {
        setVisible(false);
    };

    return (
        <ThreeDContainer>
            <div className="admin-permissions-page">
                <Row gutter={[0, 16]}>
                    <Col span={24}>
                        <div className="welcome-section glass-effect" style={{
                            padding: '24px',
                            marginBottom: '24px',
                            borderRadius: '16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '16px',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(82, 196, 26, 0.2)'
                        }}>
                            <div>
                                <Title level={3} style={{ margin: 0, fontWeight: '700', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <SafetyOutlined style={{ color: '#52c41a', fontSize: 28, marginRight: 8 }} />
                                    <span className="green-gradient-text">Quản lý quyền hệ thống</span>
                                </Title>
                                <Text style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.65)' }}>
                                    Thiết lập các quyền cho hệ thống
                                </Text>
                            </div>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAdd}
                                className="btn-green-theme"
                                style={{ borderRadius: '8px' }}
                            >
                                Thêm quyền mới
                            </Button>
                        </div>
                    </Col>
                    <Col span={24}>
                        <ThreeDCard
                            className="card-green-theme"
                            style={{ borderRadius: '12px', overflow: 'hidden' }}
                        >
                            <Table
                                columns={columns}
                                dataSource={permissions}
                                rowKey="id"
                                pagination={pagination}
                                onChange={handleTableChange}
                                className="modern-table"
                                style={{ borderRadius: '8px', overflow: 'hidden' }}
                            />
                        </ThreeDCard>
                    </Col>
                </Row>
                <Modal
                    title={editingPermission ? "Chỉnh sửa quyền" : "Thêm quyền mới"}
                    open={visible}
                    confirmLoading={loading}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText={editingPermission ? "Cập nhật" : "Thêm mới"}
                    cancelText="Hủy"
                    okButtonProps={{
                        className: 'btn-green-theme',
                        style: { borderRadius: '8px' }
                    }}
                    cancelButtonProps={{
                        style: { borderRadius: '8px' }
                    }}
                >
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="name"
                            label="Tên quyền"
                            rules={[{ required: true, message: 'Vui lòng nhập tên quyền!' }]}
                        >
                            <Input placeholder="Nhập tên quyền" style={{ borderRadius: '8px' }} />
                        </Form.Item>
                        <Form.Item
                            name="code"
                            label="Mã quyền"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mã quyền!' },
                                { pattern: /^[a-z0-9-_]+$/, message: 'Mã quyền chỉ chứa chữ thường, số, dấu gạch ngang và gạch dưới!' }
                            ]}
                        >
                            <Input placeholder="Nhập mã quyền (ví dụ: users-view, reports-export, ...)" style={{ borderRadius: '8px' }} />
                        </Form.Item>
                        <Form.Item
                            name="path"
                            label="Đường dẫn"
                            rules={[
                                { required: true, message: 'Vui lòng nhập đường dẫn!' },
                            ]}
                        >
                            <Input placeholder="Nhập đường dẫn (ví dụ: /admin/request, /employee/view, ...)" style={{ borderRadius: '8px' }} />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Mô tả"
                        >
                            <TextArea
                                rows={4}
                                placeholder="Mô tả chức năng của quyền này"
                                style={{ borderRadius: '8px' }}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </ThreeDContainer>
    );
};

export default Permission;
