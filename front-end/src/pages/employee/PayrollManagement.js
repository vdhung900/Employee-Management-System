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
    Statistic,
    Divider,
    DatePicker,
    Input,
    Select,
    Modal,
    Form,
    Alert,
    notification,
    Tabs,
    Progress,
    Badge,
    Tooltip,
    Avatar,
    Spin
} from 'antd';
import {
    DollarOutlined,
    CalendarOutlined,
    FileTextOutlined,
    CheckCircleOutlined,
    SearchOutlined,
    FilterOutlined,
    ExportOutlined,
    TeamOutlined,
    BarChartOutlined,
    FileExcelOutlined,
    FilePdfOutlined,
    DownloadOutlined,
    EyeOutlined,
    EditOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const PayrollManagement = () => {
    const isAdmin = true;
    const isEmployee = false;

    const [loading, setLoading] = useState(false);
    const [payrollHistory, setPayrollHistory] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs().endOf('month')]);
    const [activeTab, setActiveTab] = useState('1');
    const [selectedPayroll, setSelectedPayroll] = useState(null);
    const [payrollModal, setPayrollModal] = useState(false);

    // Fetch payroll data
    useEffect(() => {
        fetchPayrollData();
    }, [dateRange, departmentFilter]);

    const fetchPayrollData = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            if (isEmployee) {
                setPayrollHistory(mockEmployeePayrollHistory);
            } else {
                setPayrollHistory(mockAllEmployeesPayroll);
            }
            setLoading(false);
        }, 1000);
    };

    const handleViewPayroll = (record) => {
        setSelectedPayroll(record);
        setPayrollModal(true);
    };

    const columns = [
        {
            title: 'Nhân viên',
            dataIndex: 'employee',
            key: 'employee',
            render: (employee) => (
                <Space>
                    <Avatar style={{ backgroundColor: '#722ed1' }}>{employee.name.charAt(0)}</Avatar>
                    <div>
                        <div style={{ fontWeight: 'bold' }}>{employee.name}</div>
                        <Text type="secondary">{employee.employeeId}</Text>
                    </div>
                </Space>
            ),
            filteredValue: searchText ? [searchText] : null,
            onFilter: (value, record) =>
                record.employee.name.toLowerCase().includes(value.toLowerCase()) ||
                record.employee.employeeId.toLowerCase().includes(value.toLowerCase()) ||
                record.employee.department.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: 'Tháng',
            dataIndex: 'month',
            key: 'month',
            sorter: (a, b) => dayjs(a.month).unix() - dayjs(b.month).unix(),
        },
        {
            title: 'Lương cơ bản',
            dataIndex: 'baseSalary',
            key: 'baseSalary',
            render: (salary) => `${salary.toLocaleString('vi-VN')} VNĐ`,
            sorter: (a, b) => a.baseSalary - b.baseSalary,
        },
        {
            title: 'Phụ cấp',
            dataIndex: 'allowances',
            key: 'allowances',
            render: (allowances) => `${allowances.toLocaleString('vi-VN')} VNĐ`,
        },
        {
            title: 'Khấu trừ',
            dataIndex: 'deductions',
            key: 'deductions',
            render: (deductions) => `${deductions.toLocaleString('vi-VN')} VNĐ`,
        },
        {
            title: 'Thực lãnh',
            dataIndex: 'netSalary',
            key: 'netSalary',
            render: (salary) => `${salary.toLocaleString('vi-VN')} VNĐ`,
            sorter: (a, b) => a.netSalary - b.netSalary,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const statusConfig = {
                    paid: { color: 'success', text: 'Đã thanh toán' },
                    pending: { color: 'warning', text: 'Chờ thanh toán' },
                    processing: { color: 'processing', text: 'Đang xử lý' },
                };
                const config = statusConfig[status];
                return <Tag color={config.color}>{config.text}</Tag>;
            },
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewPayroll(record)}
                    >
                        Xem chi tiết
                    </Button>
                    {isAdmin && (
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => handleEditPayroll(record)}
                        >
                            Chỉnh sửa
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    // Mock data
    const mockEmployeePayrollHistory = [
        {
            id: 1,
            month: '2024-01',
            baseSalary: 15000000,
            allowances: 2000000,
            deductions: 1500000,
            netSalary: 15500000,
            status: 'paid',
            employee: {
                id: 1,
                name: 'Nguyễn Văn A',
                employeeId: 'EMP001',
                department: 'Engineering'
            }
        },
        {
            id: 2,
            month: '2023-12',
            baseSalary: 15000000,
            allowances: 2000000,
            deductions: 1500000,
            netSalary: 15500000,
            status: 'paid',
            employee: {
                id: 1,
                name: 'Nguyễn Văn A',
                employeeId: 'EMP001',
                department: 'Engineering'
            }
        },
    ];

    const mockAllEmployeesPayroll = [
        {
            id: 1,
            month: '2024-01',
            baseSalary: 15000000,
            allowances: 2000000,
            deductions: 1500000,
            netSalary: 15500000,
            status: 'paid',
            employee: {
                id: 1,
                name: 'Nguyễn Văn A',
                employeeId: 'EMP001',
                department: 'Engineering'
            }
        },
        {
            id: 2,
            month: '2024-01',
            baseSalary: 12000000,
            allowances: 1500000,
            deductions: 1200000,
            netSalary: 12300000,
            status: 'pending',
            employee: {
                id: 2,
                name: 'Trần Thị B',
                employeeId: 'EMP002',
                department: 'Design'
            }
        },
        {
            id: 3,
            month: '2024-01',
            baseSalary: 18000000,
            allowances: 2500000,
            deductions: 1800000,
            netSalary: 18700000,
            status: 'processing',
            employee: {
                id: 3,
                name: 'Lê Văn C',
                employeeId: 'EMP003',
                department: 'Marketing'
            }
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Card
                variant="outlined"
                styles={{
                    header: {
                        background: '#fafafa',
                        borderBottom: '1px solid #f0f0f0'
                    },
                    body: {
                        padding: '24px'
                    }
                }}
                title={
                    <Space>
                        <DollarOutlined />
                        <Title level={4} style={{ margin: 0 }}>Quản lý lương</Title>
                    </Space>
                }
            >
                <Spin spinning={loading}>
                    <Text type="secondary">
                        {isAdmin
                            ? 'Theo dõi và quản lý lương của nhân viên'
                            : 'Xem lịch sử lương và chi tiết thanh toán'}
                    </Text>

                    <Card style={{ marginTop: '16px' }}>
                        <Tabs activeKey={activeTab} onChange={setActiveTab}>
                            <TabPane
                                tab={<span><FileTextOutlined /> Lịch sử lương</span>}
                                key="1"
                            >
                                <div style={{ marginBottom: 16 }}>
                                    <Space>
                                        <Input
                                            placeholder="Tìm kiếm nhân viên..."
                                            prefix={<SearchOutlined />}
                                            style={{ width: 300 }}
                                            value={searchText}
                                            onChange={e => setSearchText(e.target.value)}
                                            allowClear
                                        />
                                        {isAdmin && (
                                            <Select
                                                style={{ width: 200 }}
                                                placeholder="Phòng ban"
                                                value={departmentFilter}
                                                onChange={setDepartmentFilter}
                                            >
                                                <Option value="all">Tất cả phòng ban</Option>
                                                <Option value="Engineering">Engineering</Option>
                                                <Option value="Design">Design</Option>
                                                <Option value="Marketing">Marketing</Option>
                                            </Select>
                                        )}
                                        <RangePicker
                                            value={dateRange}
                                            onChange={setDateRange}
                                            picker="month"
                                        />
                                        {isAdmin && (
                                            <>
                                                <Button icon={<FilterOutlined />}>
                                                    Lọc
                                                </Button>
                                                <Button icon={<ExportOutlined />}>
                                                    Export
                                                </Button>
                                            </>
                                        )}
                                    </Space>
                                </div>
                                <Table
                                    columns={columns}
                                    dataSource={payrollHistory}
                                    rowKey="id"
                                    loading={loading}
                                    pagination={{
                                        defaultPageSize: 10,
                                        showSizeChanger: true,
                                        pageSizeOptions: ['10', '20', '50', '100'],
                                        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bản ghi`,
                                    }}
                                />
                            </TabPane>

                            {isAdmin && (
                                <>
                                    <TabPane
                                        tab={<span><BarChartOutlined /> Thống kê</span>}
                                        key="2"
                                    >
                                        <Row gutter={[16, 16]}>
                                            <Col span={8}>
                                                <Card>
                                                    <Statistic
                                                        title="Tổng chi phí lương tháng này"
                                                        value={1500000000}
                                                        prefix={<DollarOutlined />}
                                                        suffix="VNĐ"
                                                    />
                                                </Card>
                                            </Col>
                                            <Col span={8}>
                                                <Card>
                                                    <Statistic
                                                        title="Đã thanh toán"
                                                        value={1200000000}
                                                        prefix={<CheckCircleOutlined />}
                                                        suffix="VNĐ"
                                                    />
                                                    <Progress percent={80} status="active" />
                                                </Card>
                                            </Col>
                                            <Col span={8}>
                                                <Card>
                                                    <Statistic
                                                        title="Chờ thanh toán"
                                                        value={300000000}
                                                        prefix={<DollarOutlined />}
                                                        suffix="VNĐ"
                                                        valueStyle={{ color: '#cf1322' }}
                                                    />
                                                </Card>
                                            </Col>
                                        </Row>
                                    </TabPane>
                                </>
                            )}
                        </Tabs>
                    </Card>

                    {/* Payroll Detail Modal */}
                    <Modal
                        title="Chi tiết lương"
                        open={payrollModal}
                        onCancel={() => setPayrollModal(false)}
                        footer={[
                            <Button key="download" icon={<DownloadOutlined />}>
                                Tải xuống
                            </Button>,
                            <Button key="close" onClick={() => setPayrollModal(false)}>
                                Đóng
                            </Button>
                        ]}
                        width={800}
                    >
                        {selectedPayroll && (
                            <div>
                                <Row gutter={[16, 16]}>
                                    <Col span={24}>
                                        <Card>
                                            <Space direction="vertical" style={{ width: '100%' }}>
                                                <div>
                                                    <Text strong>Nhân viên:</Text> {selectedPayroll.employee.name}
                                                </div>
                                                <div>
                                                    <Text strong>Mã nhân viên:</Text> {selectedPayroll.employee.employeeId}
                                                </div>
                                                <div>
                                                    <Text strong>Phòng ban:</Text> {selectedPayroll.employee.department}
                                                </div>
                                                <div>
                                                    <Text strong>Tháng:</Text> {selectedPayroll.month}
                                                </div>
                                            </Space>
                                        </Card>
                                    </Col>
                                    <Col span={24}>
                                        <Card title="Chi tiết lương">
                                            <Row gutter={[16, 16]}>
                                                <Col span={12}>
                                                    <Statistic
                                                        title="Lương cơ bản"
                                                        value={selectedPayroll.baseSalary}
                                                        suffix="VNĐ"
                                                    />
                                                </Col>
                                                <Col span={12}>
                                                    <Statistic
                                                        title="Phụ cấp"
                                                        value={selectedPayroll.allowances}
                                                        suffix="VNĐ"
                                                    />
                                                </Col>
                                                <Col span={12}>
                                                    <Statistic
                                                        title="Khấu trừ"
                                                        value={selectedPayroll.deductions}
                                                        suffix="VNĐ"
                                                    />
                                                </Col>
                                                <Col span={12}>
                                                    <Statistic
                                                        title="Thực lãnh"
                                                        value={selectedPayroll.netSalary}
                                                        suffix="VNĐ"
                                                        valueStyle={{ color: '#3f8600' }}
                                                    />
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </Modal>
                </Spin>
            </Card>
        </div>
    );
};

export default PayrollManagement;
