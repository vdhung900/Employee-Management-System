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
                        status: item.status === '00' ? 'pending' : 'paid',
                        paymentDate: item.updatedAt || '',
                        totalTaxableIncome: item.totalTaxableIncome,
                        benefit: item.benefit,
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
            title: 'Phúc lợi',
            dataIndex: 'benefit',
            key: 'benefit',
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
        <div>
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
                                    title="Phúc lợi"
                                    value={selectedPayslip.benefit}
                                    suffix="₫"
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
                                            value={selectedPayslip ? selectedPayslip.unpaidLeave || 0 : 0}
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
                                            value={selectedPayslip ? 22 - (selectedPayslip.unpaidLeave || 0) : 0}
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

            <Modal
                title={<span><FileTextOutlined style={{marginRight: 8}}/>Chi tiết phiếu lương</span>}
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={null}
                width={800}
            >
                {detailPayslip && (
                    <Descriptions bordered column={2} size="middle">
                        {/* Nhóm 1: Thông tin chung */}
                        <Descriptions.Item label={<span><CalendarOutlined /> Kỳ lương</span>} span={2} labelStyle={{fontWeight:'bold', background:'#f0f5ff'}} contentStyle={{background:'#f0f5ff'}}>
                            {detailPayslip.period}
                        </Descriptions.Item>
                        {/* Nhóm 2: Thu nhập */}
                        <Descriptions.Item label={<span><DollarOutlined /> Thu nhập chịu thuế </span>} labelStyle={{ color:'#096dd9'}}> 
                            {detailPayslip.totalTaxableIncome?.toLocaleString('vi-VN')} ₫
                        </Descriptions.Item>
                        <Descriptions.Item label={<span><DollarOutlined /> Lương cơ bản</span>} labelStyle={{color:'#096dd9'}}>
                            {detailPayslip.totalBaseSalary?.toLocaleString('vi-VN')} ₫
                        </Descriptions.Item>
                        <Descriptions.Item label={<span><DollarOutlined /> Phúc lợi</span>} labelStyle={{color:'#096dd9'}}>
                            {detailPayslip.benefit?.toLocaleString('vi-VN')} ₫
                        </Descriptions.Item>
                        <Descriptions.Item label={<span><DollarOutlined /> Tiền OT</span>} labelStyle={{color:'#096dd9'}}>
                            {detailPayslip.totalOtSalary?.toLocaleString('vi-VN')} ₫
                        </Descriptions.Item>
                        {/* Nhóm 3: Khấu trừ */}
                        <Descriptions.Item label={<span><TeamOutlined /> Giảm trừ gia cảnh</span>} labelStyle={{color:'#d4380d'}}> 
                            {detailPayslip.familyDeduction?.toLocaleString('vi-VN')} ₫
                        </Descriptions.Item>
                        <Descriptions.Item label={<span><SafetyCertificateOutlined /> Bảo hiểm bắt buộc</span>} labelStyle={{color:'#d4380d'}}> 
                            {detailPayslip.insurance?.toLocaleString('vi-VN')} ₫
                        </Descriptions.Item>
                        <Descriptions.Item label={<span><PercentageOutlined /> Thuế TNCN</span>} labelStyle={{color:'#d4380d'}}> 
                            {detailPayslip.personalIncomeTax?.toLocaleString('vi-VN')} ₫
                        </Descriptions.Item>
                        {/* Nhóm 4: Ngày công */}
                        <Descriptions.Item label={<span><CoffeeOutlined /> Số ngày nghỉ</span>} labelStyle={{color:'#531dab'}}> 
                            {detailPayslip.unpaidLeave}
                        </Descriptions.Item>
                        <Descriptions.Item label={<span><TeamOutlined /> Số ngày làm việc</span>} labelStyle={{color:'#531dab'}}> 
                            {22 - (detailPayslip.unpaidLeave || 0)}
                        </Descriptions.Item>
                        <Descriptions.Item label={<span><ThunderboltOutlined /> Chỉ số đúng giờ</span>} labelStyle={{color:'#531dab'}}> 
                            <Tooltip title="Chỉ số đúng giờ càng cao càng tốt, bị trừ khi có đi muộn/về sớm">
                                {detailPayslip.latePenalty === 0 ? '100%' : `${Math.max(100 - (detailPayslip.latePenalty || 0) * 2, 80)}%`}
                            </Tooltip>
                        </Descriptions.Item>
                        {/* Divider nhóm */}
                        <Descriptions.Item span={2} contentStyle={{padding:0, background:'transparent'}} labelStyle={{padding:0, background:'transparent'}}>
                            <div style={{borderTop:'1px solid #e6f7ff', margin:'3px 0'}}></div>
                        </Descriptions.Item>
                        {/* Nhóm 5: Kết quả nhận */}
                        <Descriptions.Item label={<span>Trạng thái</span>}>
                            {detailPayslip.status === 'paid' ? <Tag color="green">Đã thanh toán</Tag> : <Tag color="orange">Chờ thanh toán</Tag>}
                        </Descriptions.Item>
                        <Descriptions.Item label={<span>Ngày tạo </span>}>
                            {detailPayslip.paymentDate ? new Date(detailPayslip.paymentDate).toLocaleDateString('vi-VN') : ''}
                        </Descriptions.Item>
                        <Descriptions.Item label={<span style={{fontWeight:'bold', color:'#1890ff'}}><DollarOutlined /> Thực nhận</span>} span={2} labelStyle={{fontWeight:'bold', color:'#1890ff', fontSize:18}} contentStyle={{textAlign:'center', fontSize:24, color:'#1890ff', fontWeight:700, background:'#e6f7ff'}}>
                            {detailPayslip.netSalary?.toLocaleString('vi-VN')} ₫
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </div>
    );
};

export default EmployeePayroll;
