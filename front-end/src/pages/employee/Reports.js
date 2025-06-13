import React, { useState } from 'react';
import {
    Card,
    Typography,
    Row,
    Col,
    Tabs,
    Button,
    DatePicker,
    Select,
    Space,
    Table,
    Statistic,
    Progress,
    Divider
} from 'antd';
import {
    BarChartOutlined,
    PieChartOutlined,
    LineChartOutlined,
    TeamOutlined,
    UserAddOutlined,
    UserDeleteOutlined,
    DownloadOutlined,
    FilePdfOutlined,
    FileExcelOutlined,
    FilterOutlined,
    AuditOutlined,
    DollarOutlined,
    ClockCircleOutlined,
    UserOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import ThreeDContainer from '../../components/3d/ThreeDContainer';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Giả lập dữ liệu báo cáo nhân sự
const staffReportData = [
    { department: 'Engineering', total: 25, new: 3, leave: 1, male: 18, female: 7 },
    { department: 'Design', total: 12, new: 2, leave: 0, male: 5, female: 7 },
    { department: 'Management', total: 8, new: 0, leave: 1, male: 6, female: 2 },
    { department: 'Finance', total: 6, new: 1, leave: 0, male: 2, female: 4 },
    { department: 'Admin', total: 5, new: 0, leave: 0, male: 1, female: 4 },
    { department: 'Sales', total: 15, new: 2, leave: 1, male: 9, female: 6 },
    { department: 'Marketing', total: 10, new: 1, leave: 0, male: 3, female: 7 },
    { department: 'Customer Support', total: 8, new: 1, leave: 0, male: 3, female: 5 }
];

// Giả lập dữ liệu báo cáo tuyển dụng
const recruitmentReportData = [
    { month: 'T1/2023', applicants: 42, interviews: 15, hired: 3, positions: 4, cost: 15000000 },
    { month: 'T2/2023', applicants: 38, interviews: 12, hired: 2, positions: 3, cost: 12000000 },
    { month: 'T3/2023', applicants: 45, interviews: 18, hired: 4, positions: 5, cost: 18000000 },
    { month: 'T4/2023', applicants: 52, interviews: 20, hired: 5, positions: 6, cost: 22000000 },
    { month: 'T5/2023', applicants: 48, interviews: 22, hired: 4, positions: 4, cost: 20000000 },
    { month: 'T6/2023', applicants: 40, interviews: 16, hired: 3, positions: 3, cost: 16000000 }
];

// Giả lập dữ liệu báo cáo lương
const payrollReportData = [
    { month: 'T1/2023', totalSalary: 380000000, bonus: 25000000, deductions: 75000000, netPayment: 330000000 },
    { month: 'T2/2023', totalSalary: 385000000, bonus: 20000000, deductions: 76000000, netPayment: 329000000 },
    { month: 'T3/2023', totalSalary: 390000000, bonus: 30000000, deductions: 78000000, netPayment: 342000000 },
    { month: 'T4/2023', totalSalary: 395000000, bonus: 35000000, deductions: 80000000, netPayment: 350000000 },
    { month: 'T5/2023', totalSalary: 410000000, bonus: 40000000, deductions: 85000000, netPayment: 365000000 },
    { month: 'T6/2023', totalSalary: 420000000, bonus: 45000000, deductions: 90000000, netPayment: 375000000 }
];

// Giả lập dữ liệu báo cáo chấm công
const attendanceReportData = [
    { month: 'T1/2023', total: 89, onTime: 78, late: 8, absent: 3, leave: 11, overtime: 120 },
    { month: 'T2/2023', total: 85, onTime: 75, late: 7, absent: 3, leave: 9, overtime: 110 },
    { month: 'T3/2023', total: 90, onTime: 80, late: 6, absent: 4, leave: 8, overtime: 125 },
    { month: 'T4/2023', total: 87, onTime: 76, late: 9, absent: 2, leave: 10, overtime: 115 },
    { month: 'T5/2023', total: 92, onTime: 82, late: 7, absent: 3, leave: 7, overtime: 130 },
    { month: 'T6/2023', total: 88, onTime: 78, late: 8, absent: 2, leave: 12, overtime: 140 }
];

const Reports = () => {
    const [activeTab, setActiveTab] = useState('1');
    const [dateRange, setDateRange] = useState([
        dayjs().startOf('month'),
        dayjs().endOf('month')
    ]);

    // Columns cho bảng báo cáo nhân sự
    const staffColumns = [
        {
            title: 'Phòng ban',
            dataIndex: 'department',
            key: 'department',
        },
        {
            title: 'Tổng nhân viên',
            dataIndex: 'total',
            key: 'total',
            sorter: (a, b) => a.total - b.total,
        },
        {
            title: 'Nhân viên mới',
            dataIndex: 'new',
            key: 'new',
            render: (value) => <span style={{ color: '#52c41a' }}>{value}</span>,
            sorter: (a, b) => a.new - b.new,
        },
        {
            title: 'Nghỉ việc',
            dataIndex: 'leave',
            key: 'leave',
            render: (value) => <span style={{ color: '#ff4d4f' }}>{value}</span>,
            sorter: (a, b) => a.leave - b.leave,
        },
        {
            title: 'Nam',
            dataIndex: 'male',
            key: 'male',
        },
        {
            title: 'Nữ',
            dataIndex: 'female',
            key: 'female',
        },
        {
            title: 'Tỷ lệ nam/nữ',
            key: 'gender_ratio',
            render: (_, record) => (
                <Progress
                    percent={Math.round((record.male / record.total) * 100)}
                    size="small"
                    format={() => `${record.male}:${record.female}`}
                    strokeColor={{ from: '#108ee9', to: '#87d068' }}
                />
            ),
        }
    ];

    // Columns cho bảng báo cáo tuyển dụng
    const recruitmentColumns = [
        {
            title: 'Tháng',
            dataIndex: 'month',
            key: 'month',
        },
        {
            title: 'Hồ sơ ứng tuyển',
            dataIndex: 'applicants',
            key: 'applicants',
            sorter: (a, b) => a.applicants - b.applicants,
        },
        {
            title: 'Phỏng vấn',
            dataIndex: 'interviews',
            key: 'interviews',
            sorter: (a, b) => a.interviews - b.interviews,
        },
        {
            title: 'Đã tuyển',
            dataIndex: 'hired',
            key: 'hired',
            render: (value) => <span style={{ color: '#52c41a' }}>{value}</span>,
            sorter: (a, b) => a.hired - b.hired,
        },
        {
            title: 'Vị trí tuyển',
            dataIndex: 'positions',
            key: 'positions',
        },
        {
            title: 'Chi phí tuyển dụng',
            dataIndex: 'cost',
            key: 'cost',
            render: (value) => `${(value/1000000).toFixed(1)} triệu`,
            sorter: (a, b) => a.cost - b.cost,
        },
        {
            title: 'Hiệu quả',
            key: 'efficiency',
            render: (_, record) => (
                <Progress
                    percent={Math.round((record.hired / record.interviews) * 100)}
                    size="small"
                    status={(record.hired / record.interviews) > 0.2 ? "success" : "normal"}
                />
            ),
        }
    ];

    // Columns cho bảng báo cáo lương
    const payrollColumns = [
        {
            title: 'Tháng',
            dataIndex: 'month',
            key: 'month',
        },
        {
            title: 'Tổng lương',
            dataIndex: 'totalSalary',
            key: 'totalSalary',
            render: (value) => `${(value/1000000).toFixed(1)} triệu`,
            sorter: (a, b) => a.totalSalary - b.totalSalary,
        },
        {
            title: 'Thưởng',
            dataIndex: 'bonus',
            key: 'bonus',
            render: (value) => `${(value/1000000).toFixed(1)} triệu`,
            sorter: (a, b) => a.bonus - b.bonus,
        },
        {
            title: 'Khấu trừ',
            dataIndex: 'deductions',
            key: 'deductions',
            render: (value) => `${(value/1000000).toFixed(1)} triệu`,
            sorter: (a, b) => a.deductions - b.deductions,
        },
        {
            title: 'Thực chi',
            dataIndex: 'netPayment',
            key: 'netPayment',
            render: (value) => `${(value/1000000).toFixed(1)} triệu`,
            sorter: (a, b) => a.netPayment - b.netPayment,
        },
        {
            title: 'So với tháng trước',
            key: 'comparison',
            render: (_, record, index) => {
                if (index === 0) return <span>--</span>;
                const prevAmount = payrollReportData[index - 1].netPayment;
                const diff = record.netPayment - prevAmount;
                const percentage = ((diff / prevAmount) * 100).toFixed(1);

                return (
                    <span style={{ color: diff >= 0 ? '#52c41a' : '#ff4d4f' }}>
            {diff >= 0 ? '+' : ''}{percentage}%
          </span>
                );
            },
        }
    ];

    // Columns cho bảng báo cáo chấm công
    const attendanceColumns = [
        {
            title: 'Tháng',
            dataIndex: 'month',
            key: 'month',
        },
        {
            title: 'Tổng ngày công',
            dataIndex: 'total',
            key: 'total',
            sorter: (a, b) => a.total - b.total,
        },
        {
            title: 'Đúng giờ',
            dataIndex: 'onTime',
            key: 'onTime',
            render: (value, record) => (
                <span>{value} ({Math.round((value/record.total) * 100)}%)</span>
            ),
            sorter: (a, b) => a.onTime - b.onTime,
        },
        {
            title: 'Đi muộn',
            dataIndex: 'late',
            key: 'late',
            render: (value) => <span style={{ color: '#faad14' }}>{value}</span>,
            sorter: (a, b) => a.late - b.late,
        },
        {
            title: 'Vắng mặt',
            dataIndex: 'absent',
            key: 'absent',
            render: (value) => <span style={{ color: '#ff4d4f' }}>{value}</span>,
            sorter: (a, b) => a.absent - b.absent,
        },
        {
            title: 'Nghỉ phép',
            dataIndex: 'leave',
            key: 'leave',
            sorter: (a, b) => a.leave - b.leave,
        },
        {
            title: 'Giờ tăng ca',
            dataIndex: 'overtime',
            key: 'overtime',
            sorter: (a, b) => a.overtime - b.overtime,
        }
    ];

    return (
        <div>
            <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                <Col span={24}>
                    <Title level={2}>Báo cáo HR</Title>
                    <Text type="secondary">Thống kê và báo cáo về nhân sự, tuyển dụng, lương thưởng và chấm công</Text>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                <Col xs={24} md={6}>
                    <ThreeDContainer>
                        <Card>
                            <Statistic
                                title="Tổng nhân viên"
                                value={89}
                                prefix={<TeamOutlined />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </ThreeDContainer>
                </Col>
                <Col xs={24} md={6}>
                    <ThreeDContainer>
                        <Card>
                            <Statistic
                                title="Tỷ lệ nghỉ việc"
                                value={2.5}
                                suffix="%"
                                precision={1}
                                valueStyle={{ color: '#ff4d4f' }}
                                prefix={<UserDeleteOutlined />}
                            />
                        </Card>
                    </ThreeDContainer>
                </Col>
                <Col xs={24} md={6}>
                    <ThreeDContainer>
                        <Card>
                            <Statistic
                                title="Tỷ lệ đi làm đúng giờ"
                                value={87.5}
                                suffix="%"
                                precision={1}
                                valueStyle={{ color: '#52c41a' }}
                                prefix={<ClockCircleOutlined />}
                            />
                        </Card>
                    </ThreeDContainer>
                </Col>
                <Col xs={24} md={6}>
                    <ThreeDContainer>
                        <Card>
                            <Statistic
                                title="Chi phí nhân sự/tháng"
                                value={375}
                                suffix="triệu"
                                precision={0}
                                valueStyle={{ color: '#722ed1' }}
                                prefix={<DollarOutlined />}
                            />
                        </Card>
                    </ThreeDContainer>
                </Col>
            </Row>

            <ThreeDContainer>
                <div style={{ marginBottom: '16px', padding: '16px', background: '#fff', borderRadius: '8px' }}>
                    <Space direction="horizontal" size="middle" style={{ marginBottom: '16px' }}>
                        <Text strong>Thời gian:</Text>
                        <RangePicker value={dateRange} onChange={setDateRange} allowClear={false} />
                        <Select defaultValue="all" style={{ width: 160 }}>
                            <Option value="all">Tất cả phòng ban</Option>
                            <Option value="engineering">Engineering</Option>
                            <Option value="design">Design</Option>
                            <Option value="management">Management</Option>
                            <Option value="sales">Sales</Option>
                            <Option value="marketing">Marketing</Option>
                        </Select>
                        <Button type="primary" icon={<FilterOutlined />}>Lọc</Button>
                    </Space>
                    <Space>
                        <Button icon={<FilePdfOutlined />}>Xuất PDF</Button>
                        <Button icon={<FileExcelOutlined />}>Xuất Excel</Button>
                        <Button icon={<DownloadOutlined />}>Tải báo cáo đầy đủ</Button>
                    </Space>
                </div>

                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <TabPane
                        tab={<span><TeamOutlined /> Báo cáo nhân sự</span>}
                        key="1"
                    >
                        <Card>
                            <Paragraph>
                                Báo cáo thống kê về số lượng nhân viên, biến động nhân sự theo phòng ban cho giai đoạn đã chọn.
                            </Paragraph>

                            <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                                <Col span={8}>
                                    <Card>
                                        <Statistic
                                            title="Tổng số nhân viên"
                                            value={89}
                                            prefix={<UserOutlined />}
                                        />
                                        <Divider />
                                        <div>
                                            <div><Text type="secondary">Phòng ban nhiều nhất:</Text></div>
                                            <Text strong>Engineering (25)</Text>
                                        </div>
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card>
                                        <Statistic
                                            title="Tuyển mới trong kỳ"
                                            value={10}
                                            valueStyle={{ color: '#52c41a' }}
                                            prefix={<UserAddOutlined />}
                                        />
                                        <Divider />
                                        <Progress
                                            percent={11.2}
                                            size="small"
                                            status="success"
                                            format={() => '11.2% tổng nhân sự'}
                                        />
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card>
                                        <Statistic
                                            title="Nghỉ việc trong kỳ"
                                            value={3}
                                            valueStyle={{ color: '#ff4d4f' }}
                                            prefix={<UserDeleteOutlined />}
                                        />
                                        <Divider />
                                        <Progress
                                            percent={3.4}
                                            size="small"
                                            status="exception"
                                            format={() => '3.4% tổng nhân sự'}
                                        />
                                    </Card>
                                </Col>
                            </Row>

                            <Table
                                dataSource={staffReportData}
                                columns={staffColumns}
                                rowKey="department"
                                pagination={false}
                                summary={pageData => {
                                    let totalStaff = 0;
                                    let totalNew = 0;
                                    let totalLeave = 0;
                                    let totalMale = 0;
                                    let totalFemale = 0;

                                    pageData.forEach(({ total, new: newStaff, leave, male, female }) => {
                                        totalStaff += total;
                                        totalNew += newStaff;
                                        totalLeave += leave;
                                        totalMale += male;
                                        totalFemale += female;
                                    });

                                    return (
                                        <Table.Summary.Row style={{ fontWeight: 'bold' }}>
                                            <Table.Summary.Cell>Tổng cộng</Table.Summary.Cell>
                                            <Table.Summary.Cell>{totalStaff}</Table.Summary.Cell>
                                            <Table.Summary.Cell>
                                                <span style={{ color: '#52c41a' }}>{totalNew}</span>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell>
                                                <span style={{ color: '#ff4d4f' }}>{totalLeave}</span>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell>{totalMale}</Table.Summary.Cell>
                                            <Table.Summary.Cell>{totalFemale}</Table.Summary.Cell>
                                            <Table.Summary.Cell>
                                                <Progress
                                                    percent={Math.round((totalMale / totalStaff) * 100)}
                                                    size="small"
                                                    format={() => `${totalMale}:${totalFemale}`}
                                                    strokeColor={{ from: '#108ee9', to: '#87d068' }}
                                                />
                                            </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    );
                                }}
                            />
                        </Card>
                    </TabPane>

                    <TabPane
                        tab={<span><UserAddOutlined /> Báo cáo tuyển dụng</span>}
                        key="2"
                    >
                        <Card>
                            <Paragraph>
                                Báo cáo thống kê về hoạt động tuyển dụng, số lượng ứng viên, tỷ lệ tuyển dụng thành công và chi phí.
                            </Paragraph>

                            <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                                <Col span={8}>
                                    <Card>
                                        <Statistic
                                            title="Tổng hồ sơ ứng tuyển"
                                            value={265}
                                            prefix={<FileExcelOutlined />}
                                        />
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card>
                                        <Statistic
                                            title="Tỷ lệ phỏng vấn/hồ sơ"
                                            value={38.9}
                                            suffix="%"
                                            precision={1}
                                        />
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card>
                                        <Statistic
                                            title="Tỷ lệ tuyển dụng thành công"
                                            value={25.2}
                                            suffix="%"
                                            precision={1}
                                            valueStyle={{ color: '#52c41a' }}
                                        />
                                    </Card>
                                </Col>
                            </Row>

                            <Table
                                dataSource={recruitmentReportData}
                                columns={recruitmentColumns}
                                rowKey="month"
                                pagination={false}
                                summary={pageData => {
                                    let totalApplicants = 0;
                                    let totalInterviews = 0;
                                    let totalHired = 0;
                                    let totalCost = 0;

                                    pageData.forEach(({ applicants, interviews, hired, cost }) => {
                                        totalApplicants += applicants;
                                        totalInterviews += interviews;
                                        totalHired += hired;
                                        totalCost += cost;
                                    });

                                    return (
                                        <Table.Summary.Row style={{ fontWeight: 'bold' }}>
                                            <Table.Summary.Cell>Tổng cộng</Table.Summary.Cell>
                                            <Table.Summary.Cell>{totalApplicants}</Table.Summary.Cell>
                                            <Table.Summary.Cell>{totalInterviews}</Table.Summary.Cell>
                                            <Table.Summary.Cell>
                                                <span style={{ color: '#52c41a' }}>{totalHired}</span>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell>-</Table.Summary.Cell>
                                            <Table.Summary.Cell>{`${(totalCost/1000000).toFixed(1)} triệu`}</Table.Summary.Cell>
                                            <Table.Summary.Cell>
                                                <Progress
                                                    percent={Math.round((totalHired / totalInterviews) * 100)}
                                                    size="small"
                                                    status="success"
                                                />
                                            </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    );
                                }}
                            />
                        </Card>
                    </TabPane>

                    <TabPane
                        tab={<span><DollarOutlined /> Báo cáo lương thưởng</span>}
                        key="3"
                    >
                        <Card>
                            <Paragraph>
                                Báo cáo thống kê về chi phí lương, thưởng, phụ cấp và tổng chi phí nhân sự theo tháng.
                            </Paragraph>

                            <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                                <Col span={6}>
                                    <Card>
                                        <Statistic
                                            title="Tổng chi phí 6 tháng"
                                            value={(2091 / 1000).toFixed(1)}
                                            suffix="tỷ VND"
                                            precision={1}
                                            prefix={<DollarOutlined />}
                                        />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card>
                                        <Statistic
                                            title="Chi phí lương cơ bản"
                                            value={85.7}
                                            suffix="%"
                                            precision={1}
                                            valueStyle={{ color: '#1890ff' }}
                                        />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card>
                                        <Statistic
                                            title="Chi phí thưởng"
                                            value={9.3}
                                            suffix="%"
                                            precision={1}
                                            valueStyle={{ color: '#52c41a' }}
                                        />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card>
                                        <Statistic
                                            title="Trung bình/nhân viên"
                                            value={18.7}
                                            suffix="triệu"
                                            precision={1}
                                            valueStyle={{ color: '#722ed1' }}
                                        />
                                    </Card>
                                </Col>
                            </Row>

                            <Table
                                dataSource={payrollReportData}
                                columns={payrollColumns}
                                rowKey="month"
                                pagination={false}
                                summary={pageData => {
                                    let totalSalary = 0;
                                    let totalBonus = 0;
                                    let totalDeductions = 0;
                                    let totalNet = 0;

                                    pageData.forEach(({ totalSalary: salary, bonus, deductions, netPayment }) => {
                                        totalSalary += salary;
                                        totalBonus += bonus;
                                        totalDeductions += deductions;
                                        totalNet += netPayment;
                                    });

                                    return (
                                        <Table.Summary.Row style={{ fontWeight: 'bold' }}>
                                            <Table.Summary.Cell>Tổng cộng</Table.Summary.Cell>
                                            <Table.Summary.Cell>{`${(totalSalary/1000000).toFixed(1)} triệu`}</Table.Summary.Cell>
                                            <Table.Summary.Cell>{`${(totalBonus/1000000).toFixed(1)} triệu`}</Table.Summary.Cell>
                                            <Table.Summary.Cell>{`${(totalDeductions/1000000).toFixed(1)} triệu`}</Table.Summary.Cell>
                                            <Table.Summary.Cell>{`${(totalNet/1000000).toFixed(1)} triệu`}</Table.Summary.Cell>
                                            <Table.Summary.Cell>-</Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    );
                                }}
                            />
                        </Card>
                    </TabPane>

                    <TabPane
                        tab={<span><ClockCircleOutlined /> Báo cáo chấm công</span>}
                        key="4"
                    >
                        <Card>
                            <Paragraph>
                                Báo cáo thống kê về tình hình chấm công, đi muộn, vắng mặt và tăng ca của nhân viên.
                            </Paragraph>

                            <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                                <Col span={6}>
                                    <Card>
                                        <Statistic
                                            title="Tỷ lệ đi làm đúng giờ"
                                            value={87.5}
                                            suffix="%"
                                            precision={1}
                                            valueStyle={{ color: '#52c41a' }}
                                        />
                                        <Progress percent={87.5} size="small" status="success" />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card>
                                        <Statistic
                                            title="Tỷ lệ đi muộn"
                                            value={8.2}
                                            suffix="%"
                                            precision={1}
                                            valueStyle={{ color: '#faad14' }}
                                        />
                                        <Progress percent={8.2} size="small" status="warning" />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card>
                                        <Statistic
                                            title="Tỷ lệ vắng mặt"
                                            value={3.1}
                                            suffix="%"
                                            precision={1}
                                            valueStyle={{ color: '#ff4d4f' }}
                                        />
                                        <Progress percent={3.1} size="small" status="exception" />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card>
                                        <Statistic
                                            title="Tổng giờ tăng ca"
                                            value={740}
                                            suffix="giờ"
                                            precision={0}
                                            valueStyle={{ color: '#1890ff' }}
                                        />
                                    </Card>
                                </Col>
                            </Row>

                            <Table
                                dataSource={attendanceReportData}
                                columns={attendanceColumns}
                                rowKey="month"
                                pagination={false}
                                summary={pageData => {
                                    let totalDays = 0;
                                    let totalOnTime = 0;
                                    let totalLate = 0;
                                    let totalAbsent = 0;
                                    let totalLeave = 0;
                                    let totalOvertime = 0;

                                    pageData.forEach(({ total, onTime, late, absent, leave, overtime }) => {
                                        totalDays += total;
                                        totalOnTime += onTime;
                                        totalLate += late;
                                        totalAbsent += absent;
                                        totalLeave += leave;
                                        totalOvertime += overtime;
                                    });

                                    return (
                                        <Table.Summary.Row style={{ fontWeight: 'bold' }}>
                                            <Table.Summary.Cell>Tổng cộng</Table.Summary.Cell>
                                            <Table.Summary.Cell>{totalDays}</Table.Summary.Cell>
                                            <Table.Summary.Cell>
                                                {totalOnTime} ({Math.round((totalOnTime/totalDays) * 100)}%)
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell>
                                                <span style={{ color: '#faad14' }}>{totalLate}</span>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell>
                                                <span style={{ color: '#ff4d4f' }}>{totalAbsent}</span>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell>{totalLeave}</Table.Summary.Cell>
                                            <Table.Summary.Cell>{totalOvertime}</Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    );
                                }}
                            />
                        </Card>
                    </TabPane>

                    <TabPane
                        tab={<span><AuditOutlined /> Báo cáo đánh giá</span>}
                        key="5"
                    >
                        <Card>
                            <Text>Báo cáo đánh giá hiệu suất nhân viên</Text>
                        </Card>
                    </TabPane>
                </Tabs>
            </ThreeDContainer>
        </div>
    );
};

export default Reports;
