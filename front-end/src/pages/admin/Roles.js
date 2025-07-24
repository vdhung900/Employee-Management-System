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
    Col,
    Checkbox,
    List
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    UserOutlined,
    TeamOutlined,
    SafetyOutlined
} from '@ant-design/icons';
import ThreeDContainer from '../../components/3d/ThreeDContainer';
import ThreeDCard from '../../components/3d/ThreeDCard';
import RolePermissionService from "../../services/RolePermissionService";

const {Title, Text, Paragraph} = Typography;
const {TextArea} = Input;

const Roles = () => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [roles, setRoles] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40'],
        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bản ghi`
    });

    const [permissionList, setPermissionList] = useState([]);

    useEffect(() => {
        loadData(pagination.current, pagination.pageSize);
        loadPermissions()
    }, []);

    const loadData = async (page = 1, size = 10) => {
        try {
            let body = {}
            body.page = page;
            body.size = size;
            const response = await RolePermissionService.getAllRolePermission(body);
            if (response.success) {
                setRoles(response.data.content || []);
                setPagination(prev => ({
                    ...prev,
                    current: page,
                    pageSize: size,
                    total: response.data.totalElements || 0
                }));
            }
        } catch (error) {
            message.error(error.message);
        }
    }

    const loadPermissions = async () => {
        try {
            const response = await RolePermissionService.getAll();
            if (response.success) {
                setPermissionList(response.data || []);
            } else {
                message.error(response.message || 'Lấy danh sách quyền thất bại!');
            }
        } catch (error) {
            message.error(error.message || 'Lỗi khi lấy danh sách quyền!');
        }
    }

    const handleTableChange = (pagination) => {
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
            title: 'Tên vai trò',
            dataIndex: ['role', 'name'],
            key: 'name',
            width: 120,
        },
        {
            title: 'Mã vai trò',
            dataIndex: ['role', 'code'],
            key: 'code',
            width: 150
        },
        {
            title: 'Mô tả',
            dataIndex: ['role', 'description'],
            key: 'description',
        },
        {
            title: 'Quyền',
            dataIndex: 'permissions',
            key: 'permissions',
            render: (permissions) => (
                <span>
                    {permissions && permissions.length > 0 ? permissions.map(item => {
                        return item ? <Tag style={{marginTop: 5}} key={item.code} color="blue">{item.name}</Tag> : null;
                    }) : <Tag color="default">Không có</Tag>}
                </span>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 300,
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="text"
                        icon={<SafetyOutlined/>}
                        onClick={() => handleOpenPermissionModal(record)}
                        style={{borderRadius: '8px', color: '#52c41a'}}
                    >
                        Phân quyền
                    </Button>
                </Space>
            ),
        },
    ];

    const handleAdd = () => {
        form.resetFields();
        setEditingRole(null);
        setSelectedPermissions([]);
        setVisible(true);
    };

    const handleEdit = (role) => {
        setEditingRole(role);
        form.setFieldsValue({
            name: role.name,
            code: role.code,
            description: role.description,
        });
        setSelectedPermissions(role.permissions || []);
        setVisible(true);
    };

    const handleDelete = (id) => {
        const newRoles = roles.filter(role => role.id !== id);
        setRoles(newRoles);
        message.success('Xóa vai trò thành công!');
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            if (editingRole) {
                const updatedRoles = roles.map(role => {
                    if (role.id === editingRole.id) {
                        return {
                            ...role,
                            name: values.name,
                            code: values.code,
                            description: values.description,
                            permissions: selectedPermissions,
                        };
                    }
                    return role;
                });
                setRoles(updatedRoles);
                message.success('Cập nhật vai trò thành công!');
            } else {
                const newRole = {
                    name: values.name,
                    code: values.code,
                    description: values.description,
                };
                const response = await RolePermissionService.createRole(newRole);
                if (response.success) {
                    message.success('Thêm vai trò thành công!');
                } else {
                    message.error(response.message || 'Thêm vai trò thất bại!');
                }
            }
            setVisible(false);
        } catch (error) {
            message.error(error.message || 'Thêm vai trò thất bại!');
        } finally {
            setLoading(false);
            loadData();
        }
    };


    const handleCancel = () => {
        setVisible(false);
    };

    const handlePermissionChange = (checkedValues) => {
        setSelectedPermissions(checkedValues);
    };

    const [permissionModalVisible, setPermissionModalVisible] = useState(false);
    const [roleForPermission, setRoleForPermission] = useState(null);
    const [permissionModalLoading, setPermissionModalLoading] = useState(false);
    const [permissionModalChecked, setPermissionModalChecked] = useState([]);

    const handleOpenPermissionModal = (role) => {
        setRoleForPermission(role);
        setPermissionModalChecked(role.permissions.map(item => item._id) || []);
        setPermissionModalVisible(true);
    };

    const handlePermissionModalOk = async () => {
        try{
            setPermissionModalLoading(true);
            let body = {}
            body.permissionIds = permissionModalChecked;
            const response = await RolePermissionService.updateRolePermission(roleForPermission.role._id, body);
            if (response.success) {
                message.success('Cập nhật phân quyền thành công!');
            }
        }catch (e) {
            message.error(e.message || 'Cập nhật phân quyền thất bại!');
        }finally {
            loadData();
            loadPermissions();
            setPermissionModalLoading(false);
            setPermissionModalVisible(false);
        }
    };

    const handlePermissionModalCancel = () => {
        setPermissionModalVisible(false);
    };

    const handlePermissionModalChange = (checkedValues) => {
        setPermissionModalChecked(checkedValues);
    };

    return (
        <ThreeDContainer>
            <div className="admin-roles-page" style={{ padding: 24 }}>
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
                                <Title level={3} style={{margin: 0, fontWeight: '700', display: 'flex', alignItems: 'center', gap: 8}}>
                                    <SafetyOutlined style={{ color: '#52c41a', fontSize: 28, marginRight: 8 }} />
                                    <span style={{color: "black"}}>Quản lý vai trò hệ thống</span>
                                </Title>
                                <Text style={{fontSize: '16px', color: 'rgba(0, 0, 0, 0.65)'}}>
                                    Thiết lập các vai trò người dùng
                                </Text>
                            </div>
                            <Button
                                type="primary"
                                icon={<PlusOutlined/>}
                                onClick={handleAdd}
                                className="btn-green-theme"
                                style={{borderRadius: '8px'}}
                            >
                                Thêm vai trò mới
                            </Button>
                        </div>
                    </Col>

                    <Col span={24}>
                        <ThreeDCard
                            className="card-green-theme"
                            style={{borderRadius: '12px', overflow: 'hidden'}}
                            styles={{body: {borderRadius: '12px', overflow: 'hidden'}}}
                        >
                            <Table
                                columns={columns}
                                dataSource={roles}
                                rowKey="id"
                                pagination={pagination}
                                onChange={handleTableChange}
                                className="modern-table"
                                style={{borderRadius: '8px', overflow: 'hidden'}}
                            />
                        </ThreeDCard>
                    </Col>
                </Row>

                <Modal
                    title={editingRole ? "Chỉnh sửa vai trò" : "Thêm vai trò mới"}
                    open={visible}
                    confirmLoading={loading}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText={editingRole ? "Cập nhật" : "Thêm mới"}
                    cancelText="Hủy"
                    okButtonProps={{
                        className: 'btn-green-theme',
                        style: {borderRadius: '8px'}
                    }}
                    cancelButtonProps={{
                        style: {borderRadius: '8px'}
                    }}
                    styles={{body: {borderRadius: 12, padding: 12, maxWidth: 560, margin: '0 auto'}}}
                    width={570}
                >
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="name"
                            label="Tên vai trò"
                            rules={[{required: true, message: 'Vui lòng nhập tên vai trò!'}]}
                        >
                            <Input placeholder="Nhập tên vai trò" style={{borderRadius: '8px'}}/>
                        </Form.Item>
                        <Form.Item
                            name="code"
                            label="Mã vai trò"
                            rules={[
                                {required: true, message: 'Vui lòng nhập mã vai trò!'},
                                {
                                    pattern: /^[a-z0-9-_]+$/,
                                    message: 'Mã vai trò chỉ chứa chữ thường, số, dấu gạch ngang và gạch dưới!'
                                }
                            ]}
                        >
                            <Input placeholder="Nhập mã vai trò (ví dụ: editor, viewer,...)"
                                   style={{borderRadius: '8px'}}/>
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Mô tả"
                        >
                            <TextArea
                                rows={4}
                                placeholder="Mô tả chức năng của vai trò này"
                                style={{borderRadius: '8px'}}
                            />
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title={`Phân quyền cho vai trò: ${roleForPermission ? roleForPermission.role.name : ''}`}
                    open={permissionModalVisible}
                    confirmLoading={permissionModalLoading}
                    onOk={handlePermissionModalOk}
                    onCancel={handlePermissionModalCancel}
                    okText="Lưu"
                    cancelText="Hủy"
                    okButtonProps={{
                        className: 'btn-green-theme',
                        style: {borderRadius: '8px'}
                    }}
                    cancelButtonProps={{
                        style: {borderRadius: '8px'}
                    }}
                    styles={{body: {borderRadius: 12, padding: 12, maxWidth: 560, margin: '0 auto'}}}
                    width={570}
                >
                    <div style={{maxHeight: 420, overflowY: 'auto', padding: 0}}>
                        <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 13}}>
                            <thead>
                            <tr style={{background: '#f0f5ff'}}>
                                <th style={{
                                    padding: '6px 8px',
                                    border: '1px solid #e6f7ff',
                                    textAlign: 'left',
                                    fontWeight: 600,
                                    color: 'black'
                                }}>Tên quyền
                                </th>
                                <th style={{
                                    padding: '6px 8px',
                                    border: '1px solid #e6f7ff',
                                    textAlign: 'center',
                                    fontWeight: 600,
                                    color: 'black',
                                    width: 60
                                }}>Chọn
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {permissionList.map(item => {
                                const checked = permissionModalChecked.includes(item._id);
                                return (
                                    <tr
                                        key={item._id}
                                        style={{
                                            transition: 'all 0.2s',
                                            cursor: 'pointer',
                                            border: '1px solid #e6f7ff',
                                        }}
                                        onClick={() => {
                                            if (checked) {
                                                setPermissionModalChecked(permissionModalChecked.filter(c => c !== item._id));
                                            } else {
                                                setPermissionModalChecked([...permissionModalChecked, item._id]);
                                            }
                                        }}
                                    >
                                        <td style={{
                                            padding: '6px 8px',
                                            border: '1px solid #e6f7ff',
                                            color: '#222',
                                            fontWeight: 500
                                        }}>
                                            <SafetyOutlined style={{color: '#1890ff', marginRight: 6, fontSize: 14}}/>
                                            {item.name}
                                            <div style={{
                                                color: '#888',
                                                fontSize: 11,
                                                fontWeight: 400
                                            }}>{item.description}</div>
                                        </td>
                                        <td style={{
                                            padding: '6px 8px',
                                            border: '1px solid #e6f7ff',
                                            textAlign: 'center'
                                        }}>
                                            <Checkbox
                                                value={item._id}
                                                checked={checked}
                                                onClick={e => e.stopPropagation()}
                                                onChange={() => {
                                                    if (checked) {
                                                        setPermissionModalChecked(permissionModalChecked.filter(c => c !== item._id));
                                                    } else {
                                                        setPermissionModalChecked([...permissionModalChecked, item._id]);
                                                    }
                                                }}
                                                style={{transform: 'scale(0.95)'}}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </Modal>
            </div>
        </ThreeDContainer>
    );
};

export default Roles;
