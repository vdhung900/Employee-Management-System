import React, { useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Button, Table, Modal, Form, Input, InputNumber, Select, Checkbox, message, Tag, Space, Divider, Tooltip, Input as AntInput, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, GiftOutlined, EyeOutlined, SearchOutlined, FilterOutlined, DollarOutlined, UserOutlined, TeamOutlined, CalendarOutlined, InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons';
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
    const [filteredEmployees, setFilteredEmployees] = useState([]); // Thêm state này
    const [selectedDepartments, setSelectedDepartments] = useState([]); // Thêm state này
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterMonth, setFilterMonth] = useState('all');
    const userRole = localStorage.getItem('role');

    // State cho disable các trường
    const [disableDepartments, setDisableDepartments] = useState(false);
    const [disableEmployees, setDisableEmployees] = useState(false);
    const [disableMonths, setDisableMonths] = useState(false);
    const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);
    const [employeesSelected, setEmployeesSelected] = useState([]); // State quản lý nhân viên đã chọn
    const [loadingEmployees, setLoadingEmployees] = useState(false);

    // Add state for name and amount
    const [benefitName, setBenefitName] = useState("");
    const [benefitAmount, setBenefitAmount] = useState();

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
        setLoadingEmployees(true);
        try {
            const token = localStorage.getItem('accessToken');
            // Gọi API mới lấy cả departmentId
            const res = await fetch(`${APIConfig.baseUrl}/departments/employees-with-department`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setEmployees(data.data || []);
        } catch (err) {
            message.error('Không thể tải danh sách nhân viên');
        } finally {
            setLoadingEmployees(false);
        }
    };

    // Lọc nhân viên theo phòng ban đã chọn
    useEffect(() => {
        if (!modalVisible) return;
        if (!selectedDepartments || selectedDepartments.length === 0) {
            setFilteredEmployees([]);
            form.setFieldsValue({ employees: [] });
            return;
        }
        // Lấy hợp các nhân viên thuộc các phòng ban đã chọn
        const filtered = employees.filter(e => selectedDepartments.includes(e.departmentId?.toString?.() || e.departmentId));
        setFilteredEmployees(filtered);
        // Nếu danh sách nhân viên hiện tại không còn hợp lệ, reset
        const currentSelected = form.getFieldValue('employees') || [];
        const validIds = filtered.map(e => e._id);
        const stillValid = currentSelected.filter(id => validIds.includes(id));
        if (stillValid.length !== currentSelected.length) {
            form.setFieldsValue({ employees: stillValid });
        }
    }, [selectedDepartments, employees, modalVisible]);

    // Khi thay đổi applyAll
    const handleApplyAllChange = (e) => {
        const checked = e.target.checked;
        form.setFieldsValue({ applyAll: checked });
        setDisableDepartments(checked);
        setDisableEmployees(false); // Luôn cho chọn nhân viên!
        if (checked) {
            const allDeptIds = departments.map(d => d._id);
            setSelectedDepartments(allDeptIds);
            form.setFieldsValue({ departments: allDeptIds });
            setFilteredEmployees([...employees]); // Luôn lấy employees mới nhất
            setEmployeesSelected(employees.map(e => e._id));
            form.setFieldsValue({ employees: employees.map(e => e._id) });
        } else {
            setSelectedDepartments([]);
            setFilteredEmployees([]);
            setEmployeesSelected([]);
            form.setFieldsValue({ departments: [], employees: [] });
        }
    };

    // Khi thay đổi status
    const handleStatusChange = (value) => {
        form.setFieldsValue({ status: value });
        if (value === 'auto') {
            // Chọn hết các tháng còn lại, disable select tháng
            form.setFieldsValue({ effective: futureMonths.map(m => m.value) });
            setDisableMonths(true);
        } else {
            form.setFieldsValue({ effective: [] });
            setDisableMonths(false);
        }
    };

    // Khi mở modal edit, set disable theo giá trị và đồng bộ employeesSelected
    const handleEdit = (record) => {
        setEditing(record);
        const depts = record.departments?.map(d => typeof d === 'object' ? d._id : d) || [];
        setSelectedDepartments(depts);
        const empIds = record.employees?.map(e => typeof e === 'object' ? e._id : e) || [];
        setEmployeesSelected(empIds);
        setBenefitName(record.name ?? "");
        setBenefitAmount(record.amount ?? undefined);
        form.setFieldsValue({
            ...record,
            amount: record.amount ?? '',
            name: record.name ?? '',
            effective: record.effective || [],
            employees: empIds,
            departments: depts,
            applyAll: !!record.applyAll,
            status: record.status || 'auto',
        });
        setDisableDepartments(!!record.applyAll);
        setDisableEmployees(false); // Luôn cho chọn nhân viên!
        setDisableMonths(record.status === 'auto');
        setModalVisible(true);
    };

    // Khi mở modal add, reset disable và employeesSelected
    const handleAdd = () => {
        if (!employees || employees.length === 0) {
            fetchEmployees();
        }
        setEditing(null);
        setSelectedDepartments([]);
        setFilteredEmployees([]);
        setDisableDepartments(false);
        setDisableEmployees(false); // Luôn cho chọn nhân viên!
        setDisableMonths(false);
        setEmployeesSelected([]);
        setBenefitName("");
        setBenefitAmount(undefined);
        form.resetFields();
        setModalVisible(true);
    };

    // Xử lý chọn phòng ban trong form
    const handleDepartmentsChange = (value) => {
        setSelectedDepartments(value);
    };

    // Xử lý chọn nhân viên, hỗ trợ chọn tất cả
    const handleEmployeesChange = (value) => {
        if (value.includes('ALL')) {
            // Nếu chọn ALL, set toàn bộ id nhân viên hiện tại
            setEmployeesSelected(filteredEmployees.map(e => e._id));
            form.setFieldsValue({ employees: filteredEmployees.map(e => e._id) });
        } else {
            setEmployeesSelected(value);
            form.setFieldsValue({ employees: value });
        }
    };

    // Khi filteredEmployees thay đổi (do chọn phòng ban), nếu applyAll hoặc đang chọn ALL thì sync lại employeesSelected
    useEffect(() => {
        if (disableEmployees) {
            setEmployeesSelected(filteredEmployees.map(e => e._id));
            form.setFieldsValue({ employees: filteredEmployees.map(e => e._id) });
        }
    }, [filteredEmployees, disableEmployees]);

    // Đảm bảo dropdown nhân viên luôn hiện khi click
    const handleEmployeeDropdownVisibleChange = (open) => {
        setEmployeeDropdownOpen(open);
    };

    // Tính toán các tháng còn lại của năm
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // JS getMonth() từ 0
    const futureMonths = months.filter(m => m.value > currentMonth);

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
        // Debug: log current form values before validation
        console.log('Current form values before validate:', form.getFieldsValue(true));
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
                <Title level={3} style={{ margin: 0 }}>
                    <GiftOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                    Quản lý benefits
                </Title>
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
                {loadingEmployees ? (
                    <div style={{ textAlign: 'center', padding: 40 }}>
                        <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} />
                        <div style={{ marginTop: 16 }}>Đang tải danh sách nhân viên...</div>
                    </div>
                ) : (
                    <Form form={form} layout="vertical">
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item name="name" label={<><GiftOutlined style={{ marginRight: 6 }} />Tên</>} rules={[{ required: true, message: 'Nhập tên phúc lợi' }]}>
                                    <Input
                                        placeholder="Nhập tên phúc lợi"
                                        autoComplete="off"
                                        onChange={e => {
                                            setBenefitName(e.target.value);
                                            form.setFieldsValue({ name: e.target.value });
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="amount" label={<><DollarOutlined style={{ marginRight: 6 }} />Số tiền (VND)</>} rules={[{ required: true, message: 'Nhập số tiền' }]}>
                                    <InputNumber
                                        min={0}
                                        style={{ width: '100%' }}
                                        placeholder="Nhập số tiền"
                                        autoComplete="off"
                                        onChange={value => {
                                            setBenefitAmount(value);
                                            form.setFieldsValue({ amount: value });
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Chọn trạng thái' }]}> <Select onChange={handleStatusChange}> <Option value="auto">Tự động</Option> <Option value="manual">Thủ công</Option> </Select> </Form.Item>
                            </Col>
                            <Col span={12} style={{ display: 'flex', alignItems: 'center' }}>
                                <Form.Item name="applyAll" valuePropName="checked" style={{ marginTop: 32 }}> <Checkbox onChange={handleApplyAllChange}>Áp dụng cho tất cả phòng ban</Checkbox> </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="departments"
                                    label={<><TeamOutlined style={{ marginRight: 6 }} />Phòng ban</>}
                                    dependencies={["applyAll"]}
                                    rules={[({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (getFieldValue('applyAll') || (value && value.length > 0)) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Chọn phòng ban'));
                                        }
                                    })]}
                                >
                                    <Select mode="multiple" placeholder="Chọn phòng ban" disabled={disableDepartments} onChange={handleDepartmentsChange} value={selectedDepartments}> {departments.map(d => <Option key={d._id} value={d._id}>{d.name}</Option>)} </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="employees"
                                    label={<><UserOutlined style={{ marginRight: 6 }} />Nhân viên</>}
                                    rules={[{ required: true, type: 'array', min: 1, message: 'Chọn ít nhất 1 nhân viên' }]}
                                >
                                    <Select mode="multiple" placeholder="Chọn nhân viên" value={employeesSelected} onChange={handleEmployeesChange} maxTagCount={4} disabled={disableEmployees} open={employeeDropdownOpen} onDropdownVisibleChange={handleEmployeeDropdownVisibleChange}> {filteredEmployees.length > 0 && <Option key="ALL" value="ALL">Chọn tất cả</Option>} {filteredEmployees.map(e => (<Option key={e._id} value={e._id}> {e.fullName || e.username || e._id} </Option>))} </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="effective"
                                    label={<><CalendarOutlined style={{ marginRight: 6 }} />Tháng hiệu lực</>}
                                    dependencies={["status"]}
                                    rules={[({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (getFieldValue('status') !== 'manual' || (value && value.length > 0)) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Chọn tháng hiệu lực'));
                                        }
                                    })]}
                                >
                                    <Select mode="multiple" placeholder="Chọn tháng" disabled={disableMonths}> {futureMonths.map(m => <Option key={m.value} value={m.value}>{m.label}</Option>)} </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="description" label={<><InfoCircleOutlined style={{ marginRight: 6 }} />Mô tả</>}> <Input.TextArea rows={2} /> </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                )}
            </Modal>
        </div>
    );
};

export default Benefits; 
