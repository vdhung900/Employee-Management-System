import { useState } from 'react';
import {
    Card,
    Typography,
    Table,
    Button,
    Select,
    Row,
    Col,
    Statistic,
    Divider,
    Tag,
    Space,
    DatePicker,
    Tooltip,
    Progress
} from 'antd';
import {
    FileTextOutlined,
    DownloadOutlined,
    FilePdfOutlined,
    FileExcelOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    ThunderboltOutlined,
    CoffeeOutlined,
    TeamOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

// Sample payroll data
const payrollHistoryData = [
    {
        id: 1,
        period: 'November 2023',
        startDate: '2023-11-01',
        endDate: '2023-11-30',
        workDays: 22,
        actualWorkDays: 21,
        overtime: 5,
        basicSalary: 5000,
        overtimePay: 250,
        allowances: 300,
        deductions: 150,
        tax: 450,
        netSalary: 4950,
        status: 'paid',
        paymentDate: '2023-11-30',
    },
    {
        id: 2,
        period: 'October 2023',
        startDate: '2023-10-01',
        endDate: '2023-10-31',
        workDays: 22,
        actualWorkDays: 22,
        overtime: 8,
        basicSalary: 5000,
        overtimePay: 400,
        allowances: 300,
        deductions: 0,
        tax: 470,
        netSalary: 5230,
        status: 'paid',
        paymentDate: '2023-10-31',
    },
    {
        id: 3,
        period: 'September 2023',
        startDate: '2023-09-01',
        endDate: '2023-09-30',
        workDays: 21,
        actualWorkDays: 19,
        overtime: 3,
        basicSalary: 5000,
        overtimePay: 150,
        allowances: 300,
        deductions: 200,
        tax: 430,
        netSalary: 4820,
        status: 'paid',
        paymentDate: '2023-09-30',
    },
    {
        id: 4,
        period: 'August 2023',
        startDate: '2023-08-01',
        endDate: '2023-08-31',
        workDays: 23,
        actualWorkDays: 23,
        overtime: 10,
        basicSalary: 5000,
        overtimePay: 500,
        allowances: 300,
        deductions: 0,
        tax: 480,
        netSalary: 5320,
        status: 'paid',
        paymentDate: '2023-08-31',
    },
];

// Sample current month attendance data
const currentMonthData = {
    workDaysTotal: 22,
    workDaysCompleted: 15,
    workDaysRemaining: 7,
    leaveTaken: 1,
    overtimeHours: 4,
    punctuality: 95, // percentage
};

const EmployeePayroll = () => {
    const [selectedMonth, setSelectedMonth] = useState('November 2023');
    const [selectedPayslip, setSelectedPayslip] = useState(payrollHistoryData[0]);

    const handleMonthChange = (value) => {
        setSelectedMonth(value);
        setSelectedPayslip(payrollHistoryData.find(item => item.period === value));
    };

    const exportPayslip = (format) => {
        console.log(`Exporting payslip in ${format} format...`);
        // Implementation would connect to actual export functionality
    };

    const columns = [
        {
            title: 'Period',
            dataIndex: 'period',
            key: 'period',
        },
        {
            title: 'Work Days',
            key: 'workDays',
            render: (_, record) => `${record.actualWorkDays}/${record.workDays}`,
        },
        {
            title: 'Overtime (hrs)',
            dataIndex: 'overtime',
            key: 'overtime',
        },
        {
            title: 'Net Salary',
            key: 'netSalary',
            render: (_, record) => `$${record.netSalary.toLocaleString()}`,
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => (
                <Tag color={record.status === 'paid' ? 'green' : 'orange'}>
                    {record.status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Payment Date',
            key: 'paymentDate',
            render: (_, record) => dayjs(record.paymentDate).format('DD MMM YYYY'),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Tooltip title="View Details">
                        <Button
                            type="primary"
                            size="small"
                            icon={<FileTextOutlined />}
                            onClick={() => setSelectedPayslip(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Download PDF">
                        <Button
                            type="default"
                            size="small"
                            icon={<FilePdfOutlined />}
                            onClick={() => exportPayslip('pdf')}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={16}>
                    <Title level={3}>
                        <FileTextOutlined style={{ marginRight: '8px' }} />
                        My Payroll
                    </Title>
                    <Text type="secondary">
                        View and download your salary details
                    </Text>
                </Col>
                <Col xs={24} md={8} style={{ textAlign: 'right' }}>
                    <Select
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        style={{ width: 200 }}
                        options={payrollHistoryData.map(item => ({
                            value: item.period,
                            label: item.period,
                        }))}
                    />
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col xs={24} lg={16}>
                    <Card title="Current Payslip Details">
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Paragraph>
                                    <Space>
                                        <CalendarOutlined />
                                        <Text strong>Period:</Text> {dayjs(selectedPayslip.startDate).format('DD MMM YYYY')} - {dayjs(selectedPayslip.endDate).format('DD MMM YYYY')}
                                    </Space>
                                </Paragraph>
                            </Col>

                            <Col xs={24} sm={8}>
                                <Statistic
                                    title="Basic Salary"
                                    value={selectedPayslip.basicSalary}
                                    prefix="$"
                                    precision={2}
                                />
                            </Col>
                            <Col xs={24} sm={8}>
                                <Statistic
                                    title="Overtime Pay"
                                    value={selectedPayslip.overtimePay}
                                    prefix="$"
                                    precision={2}
                                    valueStyle={{ color: '#52c41a' }}
                                />
                            </Col>
                            <Col xs={24} sm={8}>
                                <Statistic
                                    title="Allowances"
                                    value={selectedPayslip.allowances}
                                    prefix="$"
                                    precision={2}
                                    valueStyle={{ color: '#52c41a' }}
                                />
                            </Col>

                            <Col span={24}>
                                <Divider />
                            </Col>

                            <Col xs={24} sm={8}>
                                <Statistic
                                    title="Deductions"
                                    value={selectedPayslip.deductions}
                                    prefix="$"
                                    precision={2}
                                    valueStyle={{ color: '#ff4d4f' }}
                                />
                            </Col>
                            <Col xs={24} sm={8}>
                                <Statistic
                                    title="Tax"
                                    value={selectedPayslip.tax}
                                    prefix="$"
                                    precision={2}
                                    valueStyle={{ color: '#ff4d4f' }}
                                />
                            </Col>
                            <Col xs={24} sm={8}>
                                <Statistic
                                    title="Net Salary"
                                    value={selectedPayslip.netSalary}
                                    prefix="$"
                                    precision={2}
                                    valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
                                />
                            </Col>
                        </Row>

                        <Divider />

                        <div style={{ textAlign: 'right' }}>
                            <Space>
                                <Button
                                    type="primary"
                                    icon={<FilePdfOutlined />}
                                    onClick={() => exportPayslip('pdf')}
                                >
                                    Export as PDF
                                </Button>
                                <Button
                                    icon={<FileExcelOutlined />}
                                    onClick={() => exportPayslip('excel')}
                                >
                                    Export as Excel
                                </Button>
                            </Space>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Current Month Progress">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div>
                                <Text>Working Days Progress</Text>
                                <Progress
                                    percent={Math.round((currentMonthData.workDaysCompleted / currentMonthData.workDaysTotal) * 100)}
                                    format={() => `${currentMonthData.workDaysCompleted}/${currentMonthData.workDaysTotal}`}
                                />
                            </div>

                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Card size="small">
                                        <Statistic
                                            title="Leave Taken"
                                            value={currentMonthData.leaveTaken}
                                            prefix={<CoffeeOutlined />}
                                            valueStyle={{ fontSize: '24px' }}
                                        />
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card size="small">
                                        <Statistic
                                            title="Overtime"
                                            value={currentMonthData.overtimeHours}
                                            suffix="hrs"
                                            prefix={<ClockCircleOutlined />}
                                            valueStyle={{ fontSize: '24px', color: '#52c41a' }}
                                        />
                                    </Card>
                                </Col>
                            </Row>

                            <Card size="small">
                                <Statistic
                                    title="Punctuality"
                                    value={currentMonthData.punctuality}
                                    suffix="%"
                                    prefix={<ThunderboltOutlined />}
                                    valueStyle={{ color: currentMonthData.punctuality > 90 ? '#52c41a' : '#faad14' }}
                                />
                                <Progress
                                    percent={currentMonthData.punctuality}
                                    status={currentMonthData.punctuality > 90 ? 'success' : 'normal'}
                                    showInfo={false}
                                    strokeColor={currentMonthData.punctuality > 90 ? '#52c41a' : '#faad14'}
                                />
                            </Card>
                        </Space>
                    </Card>
                </Col>
            </Row>

            <Card title="Payroll History" style={{ marginTop: '16px' }}>
                <Table
                    columns={columns}
                    dataSource={payrollHistoryData}
                    rowKey="id"
                    pagination={false}
                />
            </Card>
        </div>
    );
};

export default EmployeePayroll;
