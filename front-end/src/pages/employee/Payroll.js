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
    Progress,
    Modal,
    Descriptions
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
    TeamOutlined,
    SafetyCertificateOutlined,
    PercentageOutlined
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
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [detailPayslip, setDetailPayslip] = useState(null);

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
                        paymentDate: item.updatedAt || '',
                        totalTaxableIncome: item.totalTaxableIncome,
                        benefit: item.benefit,
                        otWeekdayHour: item.otWeekdayHour,
                        otWeekendHour: item.otWeekendHour,
                        unpaidLeaveCount: item.unpaidLeaveCount,
                        cntLatePenalty: item.cntLatePenalty,
                        numDependents: item.numDependents,
                        socialInsurance: item.socialInsurance,
                        healthInsurance: item.healthInsurance,
                        unemploymentInsurance: item.unemploymentInsurance,
                        totalInsurance: item.totalInsurance,
                        workingDays: item.workingDays,
                        taxableIncome: item.taxableIncome,
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

    // Sửa lại các cột trong bảng
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
            render: (val) => `${Math.round(val)?.toLocaleString('vi-VN')} ₫`,
        },
        {
            title: 'Lương cơ bản',
            dataIndex: 'totalBaseSalary',
            key: 'totalBaseSalary',
            render: (val) => `${Math.round(val)?.toLocaleString('vi-VN')} ₫`,
        },
        {
            title: 'Phúc lợi',
            dataIndex: 'benefit',
            key: 'benefit',
            render: (val) => `${Math.round(val)?.toLocaleString('vi-VN')} ₫`,
        },
        {
            title: 'Tiền OT',
            dataIndex: 'totalOtSalary',
            key: 'totalOtSalary',
            render: (val) => `${Math.round(val)?.toLocaleString('vi-VN')} ₫`,
        },
        {
            title: 'Bảo hiểm bắt buộc',
            dataIndex: 'totalInsurance',
            key: 'totalInsurance',
            render: (val) => `${Math.round(val)?.toLocaleString('vi-VN')} ₫`,
        },
        {
            title: 'Thuế TNCN',
            dataIndex: 'personalIncomeTax',
            key: 'personalIncomeTax',
            render: (val) => `${Math.round(val)?.toLocaleString('vi-VN')} ₫`,
        },
        {
            title: 'Thực nhận',
            dataIndex: 'netSalary',
            key: 'netSalary',
            render: (val) => `${Math.round(val)?.toLocaleString('vi-VN')} ₫`,
        },
        {
            title: 'Ngày tạo phiếu',
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
                            onClick={() => { setDetailPayslip(record); setDetailModalVisible(true); }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={16}>
                    <Title level={3}>
                        <FileTextOutlined style={{ marginRight: '8px' }} />
                        Bảng lương của tôi
                    </Title>
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
                                    value={Math.round(selectedPayslip.totalBaseSalary)}
                                    suffix="₫"
                                    valueStyle={{ color: '#1890ff' }}
                                    precision={0}
                                />
                            </Col>
                            <Col xs={24} sm={8}>
                                <Statistic
                                    title="Tiền OT"
                                    value={Math.round(selectedPayslip.totalOtSalary)}
                                    suffix="₫"
                                    valueStyle={{ color: '#52c41a' }}
                                    precision={0}
                                />
                            </Col>
                            <Col xs={24} sm={8}>
                                <Statistic
                                    title="Phúc lợi"
                                    value={Math.round(selectedPayslip.benefit)}
                                    suffix="₫"
                                    valueStyle={{ color: '#52c41a' }}
                                    precision={0}
                                />
                            </Col>

                            <Col span={24}>
                                <Divider />
                            </Col>

                            <Col xs={24} sm={8}>
                                <Statistic
                                    title="Bảo hiểm"
                                    value={Math.round(selectedPayslip.totalInsurance)}
                                    suffix="₫"
                                    valueStyle={{ color: '#ff4d4f' }}
                                    precision={0}
                                />
                            </Col>
                            <Col xs={24} sm={8}>
                                <Statistic
                                    title="Thuế TNCN"
                                    value={Math.round(selectedPayslip.personalIncomeTax)}
                                    suffix="₫"
                                    valueStyle={{ color: '#ff4d4f' }}
                                    precision={0}
                                />
                            </Col>
                            <Col xs={24} sm={8}>
                                <Statistic
                                    title="Thực nhận"
                                    value={Math.round(selectedPayslip.netSalary)}
                                    suffix="₫"
                                    valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
                                    precision={0}
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
                                    percent={selectedPayslip ? Math.round(((selectedPayslip.workingDays - (selectedPayslip.unpaidLeaveCount || 0)) / selectedPayslip.workingDays) * 100) : 0}
                                    format={() => (
                                        <span style={{ color: '#1890ff' }}>
                                            {selectedPayslip ? `${selectedPayslip.workingDays - (selectedPayslip.unpaidLeaveCount || 0)}/${selectedPayslip.workingDays}` : `-/-`}
                                        </span>
                                    )}
                                    strokeColor="#1890ff"
                                />
                            </div>
                            <Row gutter={[16, 16]}>
                                <Col span={8}>
                                    <Card
                                        size="small"
                                        style={{
                                            background: 'linear-gradient(135deg, #fff1f0 0%, #ffa39e 100%)',
                                            border: '1px solid #ffa39e',
                                            boxShadow: '0 2px 8px rgba(255, 77, 79, 0.08)'
                                        }}
                                    >
                                        <Statistic
                                            title={<span style={{ color: '#cf1322', fontWeight: 600 }}>Số ngày nghỉ</span>}
                                            value={selectedPayslip ? selectedPayslip.unpaidLeaveCount || 0 : 0}
                                            prefix={<CoffeeOutlined style={{ color: '#cf1322' }} />}
                                            valueStyle={{ fontSize: '24px', color: '#cf1322', fontWeight: 700 }}
                                        />
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card
                                        size="small"
                                        style={{
                                            background: 'linear-gradient(135deg, #f6ffed 0%, #b7eb8f 100%)',
                                            border: '1px solid #b7eb8f',
                                            boxShadow: '0 2px 8px rgba(82, 196, 26, 0.08)'
                                        }}
                                    >
                                        <Statistic
                                            title={<span style={{ color: '#389e0d', fontWeight: 600 }}>Số ngày làm việc</span>}
                                            value={selectedPayslip ? selectedPayslip.workingDays - (selectedPayslip.unpaidLeaveCount || 0) : 0}
                                            prefix={<TeamOutlined style={{ color: '#389e0d' }} />}
                                            valueStyle={{ fontSize: '24px', color: '#389e0d', fontWeight: 700 }}
                                        />
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card
                                        size="small"
                                        style={{
                                            background: 'linear-gradient(135deg, #fffbe6 0%, #ffe58f 100%)',
                                            border: '1px solid #ffe58f',
                                            boxShadow: '0 2px 8px rgba(255, 215, 0, 0.08)'
                                        }}
                                    >
                                        <Statistic
                                            title={<span style={{ color: '#faad14', fontWeight: 600 }}>Số giờ OT</span>}
                                            value={selectedPayslip ? selectedPayslip.totalOtHour || 0 : 0}
                                            prefix={<ThunderboltOutlined style={{ color: '#faad14' }} />}
                                            valueStyle={{ fontSize: '28px', color: '#faad14', fontWeight: 700 }}
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

            <Modal
                title={<span><FileTextOutlined style={{marginRight: 8}}/>Chi tiết phiếu lương</span>}
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={null}
                width={1000}
            >
                {detailPayslip && (
                    <div>
                        {/* Header - Thông tin kỳ lương */}
                        <Card style={{ marginBottom: 16, background: '#fafafa', border: '1px solid #d9d9d9' }}>
                            <Row gutter={[16, 16]} align="middle" justify="space-between">
                                <Col>
                                    <Title level={4} style={{ margin: 0 }}>
                                        <CalendarOutlined style={{ marginRight: 8 }} />
                                        {detailPayslip.period}
                                    </Title>
                                </Col>
                            </Row>
                        </Card>

                        {/* Thông tin lương cơ bản */}
                        <Card title="Thông tin lương cơ bản" style={{ marginBottom: 16 }}>
                            <Row gutter={[16, 16]}>
                                <Col span={8}>
                                    <Statistic
                                        title="Lương cơ bản"
                                        value={Math.round(detailPayslip.baseSalary)}
                                        suffix="₫"
                                        groupSeparator="."
                                    />
                                </Col>
                                <Col span={8}>
                                    <Statistic
                                        title="Hệ số lương"
                                        value={detailPayslip.salaryCoefficient}
                                        precision={2}
                                    />
                                </Col>
                                <Col span={8}>
                                    <Statistic
                                        title="Tổng lương cơ bản"
                                        value={Math.round(detailPayslip.baseSalary * detailPayslip.salaryCoefficient)}
                                        suffix="₫"
                                        groupSeparator="."
                                        valueStyle={{ fontWeight: 'bold' }}
                                    />
                                </Col>
                            </Row>
                        </Card>
                        {/* Nghỉ phép và đi muộn */}
                        <Card title="Nghỉ phép và đi muộn" style={{ marginBottom: 16 }}>
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Card size="small" bordered>
                                        <Statistic
                                            title="Nghỉ không phép"
                                            value={detailPayslip.unpaidLeaveCount || 0}
                                            suffix="ngày"
                                        />
                                        <div style={{marginTop: 8}}>
                                            <Text type="secondary">Trừ: </Text>
                                            <Text strong>{Math.round(detailPayslip.unpaidLeave)?.toLocaleString('vi-VN')} ₫</Text>
                                        </div>
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card size="small" bordered>
                                        <Statistic
                                            title="Đi muộn"
                                            value={detailPayslip.cntLatePenalty || 0}
                                            suffix="lần"
                                        />
                                        <div style={{marginTop: 8}}>
                                            <Text type="secondary">Phạt: </Text>
                                            <Text strong>{Math.round(detailPayslip.latePenalty)?.toLocaleString('vi-VN')} ₫</Text>
                                        </div>
                                    </Card>
                                </Col>
                            </Row>
                        </Card>

                        {/* Thông tin tăng ca */}
                        <Card title="Thông tin tăng ca" style={{ marginBottom: 16 }}>
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Card size="small" bordered>
                                        <Statistic
                                            title={
                                                <Tooltip title="Tăng ca ngày thường được tính 150% lương theo giờ">
                                                    <span>Tăng ca ngày thường (150%)</span>
                                                </Tooltip>
                                            }
                                            value={detailPayslip.otWeekdayHour || 0}
                                            suffix="giờ"
                                        />
                                        <Row style={{marginTop: 16}} justify="space-between">
                                            <Col>
                                                <Text type="secondary">Đơn giá/giờ:</Text>
                                                <br />
                                                <Text>{Math.round((detailPayslip.totalBaseSalary / 166) * 1.5)?.toLocaleString('vi-VN')} ₫</Text>
                                            </Col>
                                            <Col>
                                                <Text type="secondary">Thành tiền:</Text>
                                                <br />
                                                <Text strong>{Math.round(detailPayslip.otWeekday)?.toLocaleString('vi-VN')} ₫</Text>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card size="small" bordered>
                                        <Statistic
                                            title={
                                                <Tooltip title="Tăng ca ngày nghỉ/cuối tuần được tính 200% lương theo giờ">
                                                    <span>Tăng ca ngày nghỉ (200%)</span>
                                                </Tooltip>
                                            }
                                            value={detailPayslip.otWeekendHour || 0}
                                            suffix="giờ"
                                        />
                                        <Row style={{marginTop: 16}} justify="space-between">
                                            <Col>
                                                <Text type="secondary">Đơn giá/giờ:</Text>
                                                <br />
                                                <Text>{Math.round((detailPayslip.totalBaseSalary / 166) * 2)?.toLocaleString('vi-VN')} ₫</Text>
                                            </Col>
                                            <Col>
                                                <Text type="secondary">Thành tiền:</Text>
                                                <br />
                                                <Text strong>{Math.round(detailPayslip.otWeekend)?.toLocaleString('vi-VN')} ₫</Text>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                            <Divider style={{ margin: '16px 0' }} />
                            <Row justify="space-between">
                                <Col>
                                    <Text>Tổng số giờ tăng ca: <Text strong>{detailPayslip.totalOtHour || 0} giờ</Text></Text>
                                </Col>
                                <Col>
                                    <Text>Tổng tiền tăng ca: <Text strong>{Math.round(detailPayslip.totalOtSalary)?.toLocaleString('vi-VN')} ₫</Text></Text>
                                </Col>
                            </Row>
                        </Card>

                        {/* Phúc lợi và thu nhập chịu thuế */}
                        <Card style={{ marginBottom: 16 }}>
                            <Row>
                                <Col span={12} style={{ borderRight: '1px solid #f0f0f0', padding: '0 24px' }}>
                                    <Title level={5}>Phụ cấp và phúc lợi</Title>
                                    <Statistic
                                        value={Math.round(detailPayslip.benefit)}
                                        suffix="₫"
                                        groupSeparator="."
                                        valueStyle={{ fontSize: 20 }}
                                    />
                                </Col>
                                <Col span={12} style={{ padding: '0 24px' }}>
                                    <Title level={5}>Thu nhập trước khấu trừ và bảo hiểm</Title>
                                    <Statistic
                                        value={Math.round(detailPayslip.totalTaxableIncome)}
                                        suffix="₫"
                                        groupSeparator="."
                                        valueStyle={{ fontSize: 20, fontWeight: 'bold' }}
                                    />
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        (Lương cơ bản + Phúc lợi + OT - Nghỉ phép - Đi muộn)
                                    </Text>
                                </Col>
                            </Row>
                        </Card>


                        {/* Các khoản khấu trừ */}
                        <Card title="Các khoản khấu trừ bảo hiểm" style={{ marginBottom: 16 }}>
                            <Row gutter={[16, 16]}>
                                <Col span={6}>
                                    <Statistic
                                        title="BHXH (8%)"
                                        value={Math.round(detailPayslip.socialInsurance)}
                                        suffix="₫"
                                        groupSeparator="."
                                    />
                                </Col>
                                <Col span={6}>
                                    <Statistic
                                        title="BHYT (1.5%)"
                                        value={Math.round(detailPayslip.healthInsurance)}
                                        suffix="₫"
                                        groupSeparator="."
                                    />
                                </Col>
                                <Col span={6}>
                                    <Statistic
                                        title="BHTN (1%)"
                                        value={Math.round(detailPayslip.unemploymentInsurance)}
                                        suffix="₫"
                                        groupSeparator="."
                                    />
                                </Col>
                                <Col span={6}>
                                    <Statistic
                                        title="Tổng bảo hiểm"
                                        value={Math.round(detailPayslip.totalInsurance)}
                                        suffix="₫"
                                        groupSeparator="."
                                        valueStyle={{ fontWeight: 'bold' }}
                                    />
                                </Col>
                            </Row>
                        </Card>

                        {/* Thuế và giảm trừ */}
                        <Card title="Thuế và giảm trừ" style={{ marginBottom: 16 }}>
                            <Row gutter={[16, 16]}>
                                <Col span={6}>
                                    <Statistic
                                        title="Số người phụ thuộc"
                                        value={detailPayslip.numDependents || 0}
                                        suffix="người"
                                    />
                                </Col>
                                <Col span={6}>
                                    <Statistic
                                        title="Giảm trừ gia cảnh"
                                        value={11000000}
                                        suffix="₫"
                                        groupSeparator="."
                                    />
                                </Col>
                                <Col span={6}>
                                    <Statistic
                                        title="Thu nhập chịu thuế"
                                        value={detailPayslip.taxableIncome}
                                        suffix="₫"
                                        groupSeparator="."
                                    />
                                </Col>
                                <Col span={6}>
                                    <Statistic
                                        title="Thuế TNCN"
                                        value={Math.round(detailPayslip.personalIncomeTax)}
                                        suffix="₫"
                                        groupSeparator="."
                                        valueStyle={{ fontWeight: 'bold' }}
                                    />
                                </Col>
                            </Row>
                        </Card>

                        {/* Thực nhận */}
                        <Card>
                            <Row justify="space-between" align="middle">
                                <Col>
                                    <Title level={4} style={{ margin: 0 }}>Thực nhận</Title>
                                </Col>
                                <Col>
                                    <Title level={3} style={{ margin: 0 }}>
                                        {Math.round(detailPayslip.netSalary)?.toLocaleString('vi-VN')} ₫
                                    </Title>
                                </Col>
                            </Row>
                        </Card>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default EmployeePayroll;
