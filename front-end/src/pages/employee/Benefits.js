import React, { useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Button, Table, Modal, Form, Input, InputNumber, Select, Checkbox, message, Tag, Space, Divider, Tooltip, Input as AntInput } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, GiftOutlined, EyeOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
import APIConfig from '../../services/APIConfig';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = AntInput;

const months = [
    { value: 1, label: 'Tháng 1' }, { value: 2, label: 'Tháng 2' }, { value: 3, label: 'Tháng 3' },
    { value: 4, label: 'Tháng 4' }, { value: 5, label: 'Tháng 5' }, { value: 6, label: 'Tháng 6' },
    { value: 7, label: 'Tháng 7' }, { value: 8, label: 'Tháng 8' }, { value: 9, label: 'Tháng 9' },
    { value: 10, label: 'Tháng 10' }, { value: 11, label: 'Tháng 11' }, { value: 12, label: 'Tháng 12' },
];

const ALL_MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const Benefits = () => {
    const [benefits, setBenefits] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [searchText, setSearchText] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterMonth, setFilterMonth] = useState('all');

    useEffect(() => {
        fetchBenefits();
        fetchDepartments();
        fetchEmployees();
        const role = localStorage.getItem('role');
        setUserRole(role || '');
    }, []);

    const fetchBenefits = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${APIConfig.baseUrl}/benefits`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setBenefits(Array.isArray(data) ? data : data.data || []);
        } catch (err) {
            message.error('Không thể tải danh sách benefits');
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${APIConfig.baseUrl}/departments`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setDepartments(data.data || []);
        } catch (err) { }
    };

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${APIConfig.baseUrl}/departments/managers`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setEmployees(data.data || []);
        } catch (err) { }
    };

    const handleAdd = () => {
        setEditing(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditing(record);
        form.setFieldsValue({
            ...record,
            amount: Number(record.amount) || 0,
            name: record.name || '',
            effective: record.effective || [],
            employees: record.employees?.map(e => typeof e === 'object' ? e._id : e),
            departments: record.departments?.map(d => typeof d === 'object' ? d._id : d),
        });
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('accessToken');
            await fetch(`${APIConfig.baseUrl}/benefits/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            message.success('Xóa benefit thành công');
            fetchBenefits();
        } catch (err) {
            message.error('Không thể xóa benefit');
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            console.log('Form values:', values);
            if (values.status === 'auto') {
                values.effective = ALL_MONTHS;
            }
            const token = localStorage.getItem('accessToken');
            let url = `${APIConfig.baseUrl}/benefits`;
            let method = 'POST';
            if (editing) {
                url = `${APIConfig.baseUrl}/benefits/${editing._id}`;
                method = 'PATCH';
            }
            await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(values),
            });
            message.success(editing ? 'Cập nhật thành công' : 'Thêm thành công');
            setModalVisible(false);
            fetchBenefits();
        } catch (err) {
            console.log('Validate error:', err);
        }
    };

    // Filter logic
    const filteredBenefits = benefits.filter(b => {
        const matchSearch = b.name?.toLowerCase().includes(searchText.toLowerCase()) || b.description?.toLowerCase().includes(searchText.toLowerCase());
        const matchDept = filterDepartment === 'all' || (b.applyAll && filterDepartment === 'all') || (b.departments && b.departments.some(d => (typeof d === 'object' ? d._id : d) === filterDepartment));
        const matchStatus = filterStatus === 'all' || b.status === filterStatus;
        const matchMonth = filterMonth === 'all' || (b.effective && b.effective.includes(Number(filterMonth)));
        return matchSearch && matchDept && matchStatus && matchMonth;
    });

    const columns = [
        { title: 'Tên', dataIndex: 'name', key: 'name', render: (v) => <b><GiftOutlined style={{ color: '#faad14' }} /> {v}</b> },
        { title: 'Mô tả', dataIndex: 'description', key: 'description', render: v => <span style={{ color: '#888' }}>{v}</span> },
        { title: 'Số tiền (VND)', dataIndex: 'amount', key: 'amount', render: (v) => <Tag color="green">{v?.toLocaleString()}</Tag> },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (v, record) => v === 'auto' ? <Tag color="blue">Tự động (Tất cả các tháng)</Tag> : <Tag color="orange">Thủ công</Tag> },
        { title: 'Tháng hiệu lực', dataIndex: 'effective', key: 'effective', render: (arr, record) => record.status === 'auto' ? <Tag color="blue">Tất cả các tháng</Tag> : <Space wrap>{arr?.map(m => <Tag key={m} color="purple">{`Tháng ${m}`}</Tag>)}</Space> },
        { title: 'Phòng ban', dataIndex: 'departments', key: 'departments', render: (arr, record) => record.applyAll ? <Tag color="geekblue">Tất cả phòng ban</Tag> : <Space wrap>{arr?.map(d => <Tag key={typeof d === 'object' ? d._id : d}>{typeof d === 'object' ? d.name : d}</Tag>)}</Space> },
        { title: 'Nhân viên', dataIndex: 'employees', key: 'employees', render: (arr) => <Space wrap>{arr?.map(e => <Tag key={typeof e === 'object' ? e._id : e}>{typeof e === 'object' ? e.username : e}</Tag>)}</Space> },
    ];
    if (userRole === 'hr') {
        columns.push({
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Xem chi tiết"><Button type="text" icon={<EyeOutlined />} disabled /></Tooltip>
                    <Tooltip title="Sửa"><Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} /></Tooltip>
                    <Tooltip title="Xóa"><Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} /></Tooltip>
                </Space>
            ),
        });
    }

    return (
        <div style={{ padding: '32px', background: '#f4f6fa', minHeight: '100vh' }}>
            <Card
                variant="outlined"
                style={{
                    background: '#fff',
                    borderRadius: 24,
                    boxShadow: '0 6px 32px rgba(0,0,0,0.10)',
                    maxWidth: 1600,
                    margin: '40px auto',
                    border: '1px solid #e0e0e0',
                    padding: 0,
                }}
                title={
                    <Space>
                        <GiftOutlined />
                        <Title level={3} style={{ margin: 0, color: '#1a237e' }}>Quản lý benefits</Title>
                    </Space>
                }
                extra={userRole === 'hr' && (
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ borderRadius: 10, fontWeight: 600, height: 44, fontSize: 16, boxShadow: '0 2px 8px #faad1440' }}>
                        Thêm phúc lợi
                    </Button>
                )}
            >
                <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                    <Space size={16} wrap>
                        <Search
                            placeholder="Tìm kiếm tên, mô tả..."
                            prefix={<SearchOutlined />}
                            style={{ width: 320, borderRadius: 10 }}
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            allowClear
                        />
                        <Select
                            style={{ width: 220, borderRadius: 10 }}
                            placeholder="Phòng ban"
                            value={filterDepartment}
                            onChange={setFilterDepartment}
                            dropdownStyle={{ borderRadius: 10 }}
                        >
                            <Option value="all">Tất cả phòng ban</Option>
                            {departments.map(d => (
                                <Option key={d._id} value={d._id}>{d.name}</Option>
                            ))}
                        </Select>
                        <Select
                            style={{ width: 180, borderRadius: 10 }}
                            placeholder="Trạng thái"
                            value={filterStatus}
                            onChange={setFilterStatus}
                            dropdownStyle={{ borderRadius: 10 }}
                        >
                            <Option value="all">Tất cả trạng thái</Option>
                            <Option value="auto">Tự động</Option>
                            <Option value="manual">Thủ công</Option>
                        </Select>
                        <Select
                            style={{ width: 180, borderRadius: 10 }}
                            placeholder="Tháng hiệu lực"
                            value={filterMonth}
                            onChange={setFilterMonth}
                            dropdownStyle={{ borderRadius: 10 }}
                        >
                            <Option value="all">Tất cả các tháng</Option>
                            {months.map(m => (
                                <Option key={m.value} value={m.value}>{m.label}</Option>
                            ))}
                        </Select>
                        <Button icon={<FilterOutlined />} style={{ borderRadius: 10, background: '#e3f2fd', color: '#1976d2', fontWeight: 500, height: 40 }}>
                            Lọc
                        </Button>
                    </Space>
                </div>
                <Table
                    dataSource={filteredBenefits}
                    columns={columns}
                    rowKey="_id"
                    loading={loading}
                    bordered
                    pagination={{ pageSize: 8, showSizeChanger: true, pageSizeOptions: ['8', '16', '32'], showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} phúc lợi` }}
                    style={{ borderRadius: 16, background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', minWidth: 1200 }}
                />
                <Modal
                    title={<span style={{ fontWeight: 700, fontSize: 22 }}>{editing ? 'Cập nhật phúc lợi' : 'Thêm phúc lợi'}</span>}
                    open={modalVisible}
                    onOk={handleOk}
                    onCancel={() => setModalVisible(false)}
                    destroyOnClose
                    width={900}
                    okText={editing ? 'Cập nhật' : 'Thêm mới'}
                    cancelText="Hủy"
                    style={{ top: 30 }}
                    bodyStyle={{ padding: 32, borderRadius: 16, background: '#f8fafc' }}
                    titleStyle={{ borderRadius: 16 }}
                >
                    <Form form={form} layout="vertical">
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item name="name" label="Tên" rules={[{ required: true, message: 'Nhập tên phúc lợi' }]}> <Input placeholder="Nhập tên phúc lợi" style={{ borderRadius: 8, height: 40 }} /> </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="amount" label="Số tiền (VND)" rules={[{ required: true, message: 'Nhập số tiền' }]}> <InputNumber min={0} style={{ width: '100%', borderRadius: 8, height: 40 }} placeholder="Nhập số tiền" /> </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item name="description" label="Mô tả"> <Input.TextArea rows={2} style={{ borderRadius: 8 }} /> </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '16px 0' }} />
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Chọn trạng thái' }]}> <Select style={{ borderRadius: 8, height: 40 }}><Option value="auto">Tự động</Option><Option value="manual">Thủ công</Option></Select> </Form.Item>
                            </Col>
                            <Col span={12} style={{ display: 'flex', alignItems: 'center' }}>
                                <Form.Item name="applyAll" valuePropName="checked" style={{ marginTop: 32 }}> <Checkbox style={{ fontWeight: 500 }}>Áp dụng cho tất cả phòng ban</Checkbox> </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item name="departments" label="Phòng ban" dependencies={["applyAll"]}> <Select mode="multiple" placeholder="Chọn phòng ban" disabled={form.getFieldValue('applyAll')} style={{ borderRadius: 8 }}>{departments.map(d => <Option key={d._id} value={d._id}>{d.name}</Option>)}</Select> </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="employees" label="Nhân viên"> <Select mode="multiple" placeholder="Chọn nhân viên" style={{ borderRadius: 8 }}>{employees.map(e => <Option key={e._id} value={e._id}>{e.username}</Option>)}</Select> </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item name="effective" label="Tháng hiệu lực" rules={[{ required: form.getFieldValue('status') === 'manual', message: 'Chọn tháng hiệu lực' }]}> <Select mode="multiple" placeholder="Chọn tháng" style={{ borderRadius: 8 }}>{months.map(m => <Option key={m.value} value={m.value}>{m.label}</Option>)}</Select> </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </Card>
        </div>
    );
};

export default Benefits; 
