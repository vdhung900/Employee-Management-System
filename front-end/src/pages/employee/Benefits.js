import React, { useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Button, Table, Modal, Form, Input, InputNumber, Select, Checkbox, message, Tag, Space, Divider, Tooltip, Input as AntInput } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, GiftOutlined, EyeOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
import APIConfig from '../../services/APIConfig';

const { Title } = Typography;
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
    const [searchText, setSearchText] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterMonth, setFilterMonth] = useState('all');
    const userRole = localStorage.getItem('role');

    useEffect(() => {
        fetchBenefits();
        fetchDepartments();
        fetchEmployees();
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
            const res = await fetch(`${APIConfig.baseUrl}/departments/employees`, {
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
            applyAll: !!record.applyAll,
            status: record.status || 'auto',
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
            console.log('Form values:', values); // Log payload khi submit thành công
            if (values.status === 'auto') {
                values.effective = ALL_MONTHS;
            }
            if (values.applyAll) {
                values.departments = [];
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
            await fetchBenefits();
            await fetchEmployees(); // Đảm bảo employeeMap luôn mới nhất
        } catch (err) {
            // Nếu validate lỗi sẽ không vào đây
            // Log giá trị hiện tại của form để debug
            console.log('Current form values (validate error):', form.getFieldsValue(true));
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

    // Log dữ liệu employees và employees trong từng benefit để debug
    console.log('Danh sách employees:', employees);
    console.log('Danh sách benefits:', benefits);

    // Tạo map từ _id sang tên (fullName hoặc username)
    const employeeMap = {};
    employees.forEach(e => {
        if (e.fullName) employeeMap[e._id] = e.fullName;
        else if (e.username) employeeMap[e._id] = e.username;
    });

    const columns = [
        { title: 'Tên', dataIndex: 'name', key: 'name', render: (v) => <span>{v}</span> },
        { title: 'Mô tả', dataIndex: 'description', key: 'description', render: v => <span style={{ color: '#888' }}>{v}</span> },
        { title: 'Số tiền (VND)', dataIndex: 'amount', key: 'amount', render: (v) => <Tag>{v?.toLocaleString()}</Tag> },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (v, record) => v === 'auto' ? <Tag> Tự động (Tất cả các tháng) </Tag> : <Tag> Thủ công </Tag> },
        { title: 'Tháng hiệu lực', dataIndex: 'effective', key: 'effective', render: (arr, record) => record.status === 'auto' ? <Tag> Tất cả các tháng </Tag> : <Space wrap>{arr?.map(m => <Tag key={m}>Tháng {m}</Tag>)}</Space> },
        { title: 'Phòng ban', dataIndex: 'departments', key: 'departments', render: (arr, record) => record.applyAll ? <Tag> Tất cả phòng ban </Tag> : <Space wrap>{arr?.map(d => <Tag key={typeof d === 'object' ? d._id : d}>{typeof d === 'object' ? d.name : d}</Tag>)}</Space> },
        {
            title: 'Nhân viên', dataIndex: 'employees', key: 'employees', render: (arr) => (
                <Space wrap>
                    {arr?.map(e => {
                        let id = e;
                        let name = '';
                        if (typeof e === 'object' && e !== null) {
                            id = e._id;
                            name = e.fullName || e.username || employeeMap[id] || id || 'Không rõ';
                        } else {
                            name = employeeMap[id] || id || 'Không rõ';
                        }
                        return <Tag key={id}>{name}</Tag>;
                    })}
                </Space>
            )
        },
    ];
    const role = localStorage.getItem('role');
    if (role === 'hr') {
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
        <div style={{ padding: 24, minHeight: '100vh', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={3} style={{ margin: 0 }}>Quản lý benefits</Title>
                {userRole === 'hr' && (
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        Thêm phúc lợi
                    </Button>
                )}
            </div>
            <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Search
                    placeholder="Tìm kiếm tên, mô tả..."
                    prefix={<SearchOutlined />}
                    style={{ width: 320 }}
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    allowClear
                />
                <Select
                    style={{ width: 220 }}
                    placeholder="Phòng ban"
                    value={filterDepartment}
                    onChange={setFilterDepartment}
                >
                    <Option value="all">Tất cả phòng ban</Option>
                    {departments.map(d => (
                        <Option key={d._id} value={d._id}>{d.name}</Option>
                    ))}
                </Select>
                <Select
                    style={{ width: 180 }}
                    placeholder="Trạng thái"
                    value={filterStatus}
                    onChange={setFilterStatus}
                >
                    <Option value="all">Tất cả trạng thái</Option>
                    <Option value="auto">Tự động</Option>
                    <Option value="manual">Thủ công</Option>
                </Select>
                <Select
                    style={{ width: 180 }}
                    placeholder="Tháng hiệu lực"
                    value={filterMonth}
                    onChange={setFilterMonth}
                >
                    <Option value="all">Tất cả các tháng</Option>
                    {months.map(m => (
                        <Option key={m.value} value={m.value}>{m.label}</Option>
                    ))}
                </Select>
                <Button icon={<FilterOutlined />}>Lọc</Button>
            </div>
            <Table
                dataSource={filteredBenefits}
                columns={columns}
                rowKey="_id"
                loading={loading}
                bordered
                size="middle"
                pagination={{ pageSize: 8, showSizeChanger: true, pageSizeOptions: ['8', '16', '32'], showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} phúc lợi` }}
            />
            <Modal
                title={<span style={{ fontWeight: 700, fontSize: 22 }}>{editing ? 'Cập nhật phúc lợi' : 'Thêm phúc lợi'}</span>}
                open={modalVisible}
                onOk={handleOk}
                onCancel={() => setModalVisible(false)}
                destroyOnClose
                width={800}
                okText={editing ? 'Cập nhật' : 'Thêm mới'}
                cancelText="Hủy"
                style={{ top: 30 }}
                bodyStyle={{ padding: 32, borderRadius: 16, background: '#f8fafc' }}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item name="name" label="Tên" rules={[{ required: true, message: 'Nhập tên phúc lợi' }]}>
                                <Input placeholder="Nhập tên phúc lợi" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="amount" label="Số tiền (VND)" rules={[{ required: true, message: 'Nhập số tiền' }]}>
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập số tiền" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Chọn trạng thái' }]}>
                                <Select>
                                    <Option value="auto">Tự động</Option>
                                    <Option value="manual">Thủ công</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12} style={{ display: 'flex', alignItems: 'center' }}>
                            <Form.Item name="applyAll" valuePropName="checked" style={{ marginTop: 32 }}>
                                <Checkbox>Áp dụng cho tất cả phòng ban</Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item name="departments" label="Phòng ban" dependencies={["applyAll"]}>
                                <Select mode="multiple" placeholder="Chọn phòng ban" disabled={form.getFieldValue('applyAll')}>
                                    {departments.map(d => <Option key={d._id} value={d._id}>{d.name}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="employees" label="Nhân viên">
                                <Select mode="multiple" placeholder="Chọn nhân viên">
                                    {employees.map(e => (
                                        <Option key={e._id} value={e._id}>
                                            {e.fullName || e.username || e._id}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item name="effective" label="Tháng hiệu lực" rules={[{ required: form.getFieldValue('status') === 'manual', message: 'Chọn tháng hiệu lực' }]}>
                                <Select mode="multiple" placeholder="Chọn tháng">
                                    {months.map(m => <Option key={m.value} value={m.value}>{m.label}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="description" label="Mô tả">
                                <Input.TextArea rows={2} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default Benefits; 
