import { useState, useEffect } from 'react';
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
import 'dayjs/locale/vi';
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);
dayjs.locale('vi');
import SalarySlipService from '../../services/SalarySlipService';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

// Dữ liệu thực tế sẽ lấy từ backend

const EmployeePayroll = () => {
    const [payrollHistoryData, setPayrollHistoryData] = useState([]);
    const [selectedPayslip, setSelectedPayslip] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const data = await SalarySlipService.getMySalarySlips();
                // console.log(data);
                // Map dữ liệu backend về format frontend cần
                const mapped = (data?.data || []).map(item => {
                    const period = `Tháng ${item.month} ${item.year}`;
                    return {
                        id: item._id,
                        period,
                        month: item.month,
                        year: item.year,
                        baseSalary: item.baseSalary,
                        salaryCoefficient: item.salaryCoefficient,
                        totalBaseSalary: item.totalBaseSalary,
                        unpaidLeave: item.unpaidLeave,
                        latePenalty: item.latePenalty,
                        otWeekday: item.otWeekday,
                        otWeekend: item.otWeekend,
                        totalOtHour: item.totalOtHour,
                        totalOtSalary: item.totalOtSalary,
                        insurance: item.insurance,
                        personalIncomeTax: item.personalIncomeTax,
                        familyDeduction: item.familyDeduction,
                        netSalary: item.netSalary,
                        status: item.status === '00' ? 'pending' : 'paid',
                        paymentDate: item.updatedAt || '',
                        totalTaxableIncome: item.totalTaxableIncome,
                    };
                });
                setPayrollHistoryData(mapped);
                console.log(mapped);
                setSelectedPayslip(mapped[0] || null);
            } catch (e) {
                setPayrollHistoryData([]);
                setSelectedPayslip(null);
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    const handleMonthChange = (value) => {
        setSelectedPayslip(payrollHistoryData.find(item => item.period === value));
    };

    const columns = [
        {
            title: 'Kỳ lương',
            dataIndex: 'period',
            key: 'period',
        },
        {
            title: 'Tổng thu nhập chịu thuế',
            dataIndex: 'totalTaxableIncome',
            key: 'totalTaxableIncome',
            render: (val) => `${val?.toLocaleString('vi-VN')} ₫`,
        },
        {
            title: 'Lương cơ bản',
            dataIndex: 'totalBaseSalary',
            key: 'totalBaseSalary',
            render: (val) => `${val?.toLocaleString('vi-VN')} ₫`,
        },
        {
            title: 'Tiền OT',
            dataIndex: 'totalOtSalary',
            key: 'totalOtSalary',
            render: (val) => `${val?.toLocaleString('vi-VN')} ₫`,
        },
        {
            title: 'Bảo hiểm bắt buộc',
            dataIndex: 'insurance',
            key: 'insurance',
            render: (val) => `${val?.toLocaleString('vi-VN')} ₫`,
        },
        {
            title: 'Thuế TNCN',
            dataIndex: 'personalIncomeTax',
            key: 'personalIncomeTax',
            render: (val) => `${val?.toLocaleString('vi-VN')} ₫`,
        },
        {
            title: 'Thực nhận',
            dataIndex: 'netSalary',
            key: 'netSalary',
            render: (val) => `${val?.toLocaleString('vi-VN')} ₫`,
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_, record) => (
                <Tag color={record.status === 'paid' ? 'green' : 'orange'}>
                    {record.status === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                </Tag>
            ),
        },
        {
            title: 'Ngày thanh toán',
            key: 'paymentDate',
            render: (_, record) => record.paymentDate ? new Date(record.paymentDate).toLocaleDateString('vi-VN') : '',
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="primary"
                            size="small"
                            icon={<FileTextOutlined />}
                            onClick={() => setSelectedPayslip(record)}
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
                        Bảng lương của tôi
                    </Title>
                    <Text type="secondary">
                        Xem và tải chi tiết lương của bạn
                    </Text>
                </Col>
                <Col xs={24} md={8} style={{ textAlign: 'right' }}>
                    <Select
                        value={selectedPayslip?.period}
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
                    <Card title="Chi tiết phiếu lương">
                        {selectedPayslip ? (
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Paragraph>
                                    <Space>
                                        <CalendarOutlined />
                                        <Text strong>Kỳ lương:</Text> {selectedPayslip.period}
                                    </Space>
                                </Paragraph>
                            </Col>

                            <Col xs={24} sm={8}>
                                <Statistic
                                    title="Lương cơ bản"
                                    value={selectedPayslip.totalBaseSalary}
                                    suffix="₫"
                                    valueStyle={{ color: '#1890ff' }}
                                />
                            </Col>
                            <Col xs={24} sm={8}>
                                <Statistic
                                    title="Tiền OT"
                                    value={selectedPayslip.totalOtSalary}
                                    suffix="₫"
                                    valueStyle={{ color: '#52c41a' }}
                                />
                            </Col>
                            <Col xs={24} sm={8}>
                                <Statistic
                                    title="Số giờ OT"
                                    value={selectedPayslip.totalOtHour}
                                    suffix="giờ"
                                    valueStyle={{ color: '#52c41a' }}
                                />
                            </Col>

                            <Col span={24}>
                                <Divider />
                            </Col>

                            <Col xs={24} sm={8}>
                                <Statistic
                                    title="Bảo hiểm"
                                    value={selectedPayslip.insurance}
                                    suffix="₫"
                                    valueStyle={{ color: '#ff4d4f' }}
                                />
                            </Col>
                            <Col xs={24} sm={8}>
                                <Statistic
                                    title="Thuế TNCN"
                                    value={selectedPayslip.personalIncomeTax}
                                    suffix="₫"
                                    valueStyle={{ color: '#ff4d4f' }}
                                />
                            </Col>
                            <Col xs={24} sm={8}>
                                <Statistic
                                    title="Thực nhận"
                                    value={selectedPayslip.netSalary}
                                    suffix="₫"
                                    valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
                                />
                            </Col>
                        </Row>
                        ) : <Text>No payslip selected.</Text>}

                        <Divider />

                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Tiến độ tháng hiện tại">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div>
                                <Text>Tiến độ ngày công</Text>
                                <Progress
                                    percent={selectedPayslip ? Math.round(((22 - (selectedPayslip.unpaidLeave || 0)) / 22) * 100) : 0}
                                    format={() => (
                                        <span style={{ color: '#1890ff' }}>
                                            {selectedPayslip ? `${22 - (selectedPayslip.unpaidLeave || 0)}/${22}` : `-/-`}
                                        </span>
                                    )}
                                    strokeColor="#1890ff"
                                />
                            </div>
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Card size="small">
                                        <Statistic
                                            title="Số ngày nghỉ"
                                            value={selectedPayslip ? selectedPayslip.unpaidLeave || 0 : 0}
                                            prefix={<CoffeeOutlined />}
                                            valueStyle={{ fontSize: '24px' }}
                                        />
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card size="small">
                                        <Statistic
                                            title="Số ngày làm việc"
                                            value={selectedPayslip ? 22 - (selectedPayslip.unpaidLeave || 0) : 0}
                                            prefix={<TeamOutlined />}
                                            valueStyle={{ fontSize: '24px', color: '#52c41a' }}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                            <Card size="small">
                                <Statistic
                                    title="Chỉ số đúng giờ"
                                    value={selectedPayslip ? (selectedPayslip.latePenalty === 0 ? 100 : Math.max(100 - (selectedPayslip.latePenalty || 0) * 2, 80)) : 100}
                                    suffix="%"
                                    prefix={<ThunderboltOutlined />}
                                    valueStyle={{ color: selectedPayslip && selectedPayslip.latePenalty === 0 ? '#52c41a' : '#faad14' }}
                                />
                                <Progress
                                    percent={selectedPayslip ? (selectedPayslip.latePenalty === 0 ? 100 : Math.max(100 - (selectedPayslip.latePenalty || 0) * 2, 80)) : 100}
                                    status={selectedPayslip && selectedPayslip.latePenalty === 0 ? 'success' : 'normal'}
                                    showInfo={false}
                                    strokeColor={selectedPayslip && selectedPayslip.latePenalty === 0 ? '#52c41a' : '#faad14'}
                                />
                            </Card>
                        </Space>
                    </Card>
                </Col>
            </Row>

            <Card title="Lịch sử bảng lương" style={{ marginTop: '16px' }}>
                <Table
                    columns={columns}
                    dataSource={payrollHistoryData}
                    rowKey="id"
                    pagination={false}
                    loading={loading}
                />
            </Card>
        </div>
    );
};

export default EmployeePayroll;
