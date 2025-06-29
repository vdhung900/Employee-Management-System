import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Table, Progress, Select, Tabs, Space, Statistic, Button, Divider, Tag, Avatar, Tooltip, Form, Input, DatePicker, Modal, InputNumber, Radio } from 'antd';
import { UserOutlined, BarChartOutlined, FileSearchOutlined, TrophyOutlined, CheckCircleOutlined, DollarOutlined, DownloadOutlined, LineChartOutlined } from '@ant-design/icons';
import { Line, Column } from '@ant-design/charts';
import dayjs from 'dayjs';
import ThreeDCard from '../../components/3d/ThreeDCard';
import * as XLSX from 'xlsx';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const MonthlyPerformanceReview = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(dayjs());
    const [activeTab, setActiveTab] = useState('list');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [isStatsModalVisible, setIsStatsModalVisible] = useState(false);
    const [selectedEmployeeStats, setSelectedEmployeeStats] = useState(null);
    const [statsDateRange, setStatsDateRange] = useState([dayjs().startOf('month'), dayjs()]);
    const [statsViewType, setStatsViewType] = useState('current'); // 'current' or 'all'

    // Mock data
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setEmployees([
                {
                    id: '1',
                    name: 'Nguyễn Văn A',
                    employeeId: 'EMP001',
                    department: 'Engineering',
                    position: 'Frontend Developer',
                    avatar: null,
                    monthlyReviews: [
                        {
                            month: 6,
                            year: 2024,
                            results: [
                                {
                                    goalTitle: 'Hoàn thành dự án X',
                                    targetValue: 100,
                                    actualValue: 95,
                                    score: 9.5
                                },
                                {
                                    goalTitle: 'Số lỗi bug',
                                    targetValue: 0,
                                    actualValue: 2,
                                    score: 8.5
                                },
                                {
                                    goalTitle: 'Code coverage',
                                    targetValue: 90,
                                    actualValue: 88,
                                    score: 9.0
                                }
                            ],
                            overallScore: 9.0,
                            comment: 'Hoàn thành tốt các mục tiêu đề ra',
                            bonus: 1000000,
                            reviewer: 'Trần Văn B',
                            status: 'completed'
                        }
                    ],
                    monthlyGoals: [
                        {
                            goalTitle: 'Hoàn thành dự án X',
                            targetValue: 100
                        },
                        {
                            goalTitle: 'Số lỗi bug',
                            targetValue: 0
                        },
                        {
                            goalTitle: 'Code coverage',
                            targetValue: 90
                        }
                    ]
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const handleEvaluate = (employee) => {
        setSelectedEmployee(employee);
        const currentMonth = dayjs().month() + 1;
        const currentYear = dayjs().year();
        
        form.setFieldsValue({
            month: dayjs(),
            results: employee.monthlyGoals.map(goal => ({
                goalTitle: goal.goalTitle,
                targetValue: goal.targetValue,
                actualValue: 0,
                score: 0
            })),
            overallScore: 0,
            comment: '',
            bonus: 0
        });
        setIsModalVisible(true);
    };

    const handleSubmitEvaluation = () => {
        form.validateFields().then(values => {
            const month = values.month.month() + 1;
            const year = values.month.year();
            console.log('Evaluation submitted:', {
                ...values,
                month,
                year
            });
            setIsModalVisible(false);
        });
    };

    const handleShowStats = (employee) => {
        setSelectedEmployeeStats(employee);
        setIsStatsModalVisible(true);
    };

    const exportToExcel = (data, fileName) => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Đánh giá");
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    };

    const handleExportStats = () => {
        const exportData = selectedEmployeeStats.monthlyReviews.map(review => ({
            'Tháng': `${review.month}/${review.year}`,
            'Điểm tổng thể': review.overallScore,
            'Thưởng': review.bonus,
            'Nhận xét': review.comment,
            ...review.results.reduce((acc, result, index) => ({
                ...acc,
                [`Mục tiêu ${index + 1}`]: result.goalTitle,
                [`Chỉ tiêu ${index + 1}`]: result.targetValue,
                [`Thực tế ${index + 1}`]: result.actualValue,
                [`Điểm ${index + 1}`]: result.score,
            }), {})
        }));

        exportToExcel(exportData, `Thống kê đánh giá - ${selectedEmployeeStats.name}`);
    };

    const columns = [
        {
            title: 'Nhân viên',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Space>
                    <Avatar icon={<UserOutlined />} src={record.avatar} />
                    <div>
                        <Text strong>{text}</Text>
                        <div>
                            <Text type="secondary">{record.employeeId}</Text>
                        </div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Phòng ban',
            dataIndex: 'department',
            key: 'department',
        },
        {
            title: 'Vị trí',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: 'Đánh giá gần nhất',
            key: 'lastReview',
            render: (_, record) => {
                const lastReview = record.monthlyReviews?.[0];
                return lastReview ? (
                    <Space direction="vertical" size={0}>
                        <Tag color={lastReview.status === 'completed' ? 'success' : 'processing'}>
                            {lastReview.status === 'completed' ? 'Đã đánh giá' : 'Chờ đánh giá'}
                        </Tag>
                        <Text type="secondary">Tháng {lastReview.month}/{lastReview.year}</Text>
                        <Text>Điểm: <Text strong>{lastReview.overallScore}</Text>/10</Text>
                    </Space>
                ) : (
                    <Tag color="warning">Chưa có đánh giá</Tag>
                );
            }
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button 
                        type="primary"
                        icon={<FileSearchOutlined />}
                        onClick={() => handleEvaluate(record)}
                    >
                        Đánh giá
                    </Button>
                    <Button
                        type="default"
                        icon={<LineChartOutlined />}
                        onClick={() => handleShowStats(record)}
                    >
                        Thống kê
                    </Button>
                </Space>
            ),
        },
    ];

    const getPerformanceData = (employee) => {
        if (!employee?.monthlyReviews) return [];
        return employee.monthlyReviews.map(review => ({
            month: `${review.month}/${review.year}`,
            score: review.overallScore
        })).reverse();
    };

    const lineConfig = {
        data: getPerformanceData(selectedEmployee),
        xField: 'month',
        yField: 'score',
        yAxis: {
            title: {
                text: 'Điểm đánh giá',
            },
            min: 0,
            max: 10,
        },
        point: {
            size: 5,
            shape: 'diamond',
        },
        label: {
            style: {
                fill: '#aaa',
            },
        }
    };

    const getOverallStats = () => {
        const allReviews = employees.flatMap(emp => emp.monthlyReviews || []);
        return {
            avgScore: allReviews.reduce((sum, review) => sum + review.overallScore, 0) / allReviews.length,
            totalBonus: allReviews.reduce((sum, review) => sum + (review.bonus || 0), 0),
            completedGoals: allReviews.reduce((sum, review) => 
                sum + review.results.filter(r => r.actualValue >= r.targetValue).length, 0),
            totalGoals: allReviews.reduce((sum, review) => sum + review.results.length, 0),
        };
    };

    const items = [
        {
            key: 'list',
            label: 'Danh sách đánh giá',
            children: (
                <div>
                    <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                        <Col span={24}>
                            <Space size="large">
                                <DatePicker.MonthPicker 
                                    value={selectedMonth}
                                    onChange={setSelectedMonth}
                                    format="MM/YYYY"
                                    placeholder="Chọn tháng đánh giá"
                                />
                                <Select defaultValue="all" style={{ width: 200 }}>
                                    <Option value="all">Tất cả trạng thái</Option>
                                    <Option value="pending">Chờ đánh giá</Option>
                                    <Option value="completed">Đã đánh giá</Option>
                                </Select>
                            </Space>
                        </Col>
                    </Row>
                    <Table 
                        columns={columns}
                        dataSource={employees}
                        rowKey="id"
                        loading={loading}
                    />
                </div>
            ),
        },
        {
            key: 'statistics',
            label: 'Thống kê đánh giá',
            children: (
                <div>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Space size="large" style={{ marginBottom: 16 }}>
                                <DatePicker.MonthPicker 
                                    value={selectedMonth}
                                    onChange={setSelectedMonth}
                                    format="MM/YYYY"
                                    placeholder="Chọn tháng thống kê"
                                />
                                <Button 
                                    type="primary" 
                                    icon={<DownloadOutlined />}
                                    onClick={() => {
                                        const allData = employees.flatMap(emp => 
                                            emp.monthlyReviews.map(review => ({
                                                'Nhân viên': emp.name,
                                                'Phòng ban': emp.department,
                                                'Vị trí': emp.position,
                                                'Tháng': `${review.month}/${review.year}`,
                                                'Điểm tổng thể': review.overallScore,
                                                'Thưởng': review.bonus,
                                            }))
                                        );
                                        exportToExcel(allData, 'Thống kê đánh giá toàn công ty');
                                    }}
                                >
                                    Xuất Excel
                                </Button>
                            </Space>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={6}>
                            <ThreeDCard>
                                <Statistic
                                    title="Điểm trung bình"
                                    value={getOverallStats().avgScore.toFixed(1)}
                                    suffix="/10"
                                    prefix={<TrophyOutlined />}
                                    valueStyle={{ color: '#1890ff' }}
                                />
                            </ThreeDCard>
                        </Col>
                        <Col xs={24} md={6}>
                            <ThreeDCard>
                                <Statistic
                                    title="Mục tiêu hoàn thành"
                                    value={getOverallStats().completedGoals}
                                    suffix={`/${getOverallStats().totalGoals}`}
                                    prefix={<CheckCircleOutlined />}
                                    valueStyle={{ color: '#52c41a' }}
                                />
                            </ThreeDCard>
                        </Col>
                        <Col xs={24} md={6}>
                            <ThreeDCard>
                                <Statistic
                                    title="Tổng thưởng"
                                    value={getOverallStats().totalBonus}
                                    prefix={<DollarOutlined />}
                                    valueStyle={{ color: '#faad14' }}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                />
                            </ThreeDCard>
                        </Col>
                        <Col xs={24} md={6}>
                            <ThreeDCard>
                                <Statistic
                                    title="Số nhân viên"
                                    value={employees.length}
                                    prefix={<UserOutlined />}
                                    valueStyle={{ color: '#722ed1' }}
                                />
                            </ThreeDCard>
                        </Col>
                    </Row>

                    <Card title="Phân bố điểm đánh giá" style={{ marginTop: 16 }}>
                        <Column
                            data={employees.map(emp => ({
                                name: emp.name,
                                score: emp.monthlyReviews[0]?.overallScore || 0
                            }))}
                            xField="name"
                            yField="score"
                            label={{
                                position: 'top',
                            }}
                            yAxis={{
                                min: 0,
                                max: 10,
                            }}
                        />
                    </Card>

                    <Card title="Xu hướng điểm đánh giá theo phòng ban" style={{ marginTop: 16 }}>
                        <Line
                            data={employees.flatMap(emp => 
                                emp.monthlyReviews.map(review => ({
                                    month: `${review.month}/${review.year}`,
                                    department: emp.department,
                                    score: review.overallScore
                                }))
                            )}
                            xField="month"
                            yField="score"
                            seriesField="department"
                            yAxis={{
                                min: 0,
                                max: 10,
                            }}
                        />
                    </Card>
                </div>
            ),
        },
    ];

    return (
        <div>
            <Title level={2}>
                <BarChartOutlined /> Đánh giá hiệu suất nhân viên
            </Title>
            <Divider />

            <Card>
                <Tabs
                    activeKey={activeTab}
                    items={items}
                    onChange={setActiveTab}
                />
            </Card>

            <Modal
                title="Đánh giá hiệu suất nhân viên"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={handleSubmitEvaluation}
                width={800}
            >
                {selectedEmployee && (
                    <Form
                        form={form}
                        layout="vertical"
                    >
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                                    <Avatar
                                        size="large"
                                        icon={<UserOutlined />}
                                        src={selectedEmployee.avatar}
                                        style={{ marginRight: 16 }}
                                    />
                                    <div>
                                        <Text strong style={{ fontSize: 16 }}>{selectedEmployee.name}</Text>
                                        <div>
                                            <Text type="secondary">{selectedEmployee.position} - {selectedEmployee.department}</Text>
                                        </div>
                                    </div>
                                </div>
                                <Divider />
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    name="month"
                                    label="Tháng đánh giá"
                                    rules={[{ required: true, message: 'Vui lòng chọn tháng đánh giá' }]}
                                >
                                    <DatePicker.MonthPicker 
                                        format="MM/YYYY"
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Divider orientation="left">Đánh giá các mục tiêu</Divider>
                                <Form.List name="results">
                                    {(fields) => (
                                        <>
                                            {fields.map(({ key, name }) => (
                                                <Row key={key} gutter={[16, 16]}>
                                                    <Col span={8}>
                                                        <Form.Item
                                                            name={[name, 'goalTitle']}
                                                            label="Mục tiêu"
                                                        >
                                                            <Input disabled />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={5}>
                                                        <Form.Item
                                                            name={[name, 'targetValue']}
                                                            label="Chỉ tiêu"
                                                        >
                                                            <InputNumber disabled style={{ width: '100%' }} />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={5}>
                                                        <Form.Item
                                                            name={[name, 'actualValue']}
                                                            label="Thực tế"
                                                            rules={[{ required: true, message: 'Vui lòng nhập giá trị thực tế' }]}
                                                        >
                                                            <InputNumber style={{ width: '100%' }} />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={6}>
                                                        <Form.Item
                                                            name={[name, 'score']}
                                                            label="Điểm"
                                                            rules={[{ required: true, message: 'Vui lòng nhập điểm đánh giá' }]}
                                                        >
                                                            <InputNumber 
                                                                min={0} 
                                                                max={10} 
                                                                style={{ width: '100%' }}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            ))}
                                        </>
                                    )}
                                </Form.List>
                            </Col>

                            <Col span={8}>
                                <Form.Item
                                    name="overallScore"
                                    label="Điểm tổng thể"
                                    rules={[{ required: true, message: 'Vui lòng nhập điểm tổng thể' }]}
                                >
                                    <InputNumber 
                                        min={0} 
                                        max={10} 
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item
                                    name="bonus"
                                    label="Thưởng"
                                >
                                    <InputNumber 
                                        style={{ width: '100%' }}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item
                                    name="comment"
                                    label="Nhận xét đánh giá"
                                    rules={[{ required: true, message: 'Vui lòng nhập nhận xét đánh giá' }]}
                                >
                                    <TextArea rows={4} placeholder="Nhập nhận xét chi tiết về hiệu suất làm việc của nhân viên" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                )}
            </Modal>

            <Modal
                title={`Thống kê đánh giá - ${selectedEmployeeStats?.name}`}
                open={isStatsModalVisible}
                onCancel={() => setIsStatsModalVisible(false)}
                width={1000}
                footer={[
                    <Button key="close" onClick={() => setIsStatsModalVisible(false)}>
                        Đóng
                    </Button>,
                    <Button 
                        key="export" 
                        type="primary" 
                        icon={<DownloadOutlined />}
                        onClick={handleExportStats}
                    >
                        Xuất Excel
                    </Button>
                ]}
            >
                {selectedEmployeeStats && (
                    <div>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Space size="large" style={{ marginBottom: 16 }}>
                                    <Radio.Group 
                                        value={statsViewType}
                                        onChange={e => setStatsViewType(e.target.value)}
                                    >
                                        <Radio.Button value="current">Tháng hiện tại</Radio.Button>
                                        <Radio.Button value="all">Tất cả các tháng</Radio.Button>
                                    </Radio.Group>
                                    {statsViewType === 'all' && (
                                        <RangePicker
                                            value={statsDateRange}
                                            onChange={setStatsDateRange}
                                            picker="month"
                                        />
                                    )}
                                </Space>
                            </Col>
                        </Row>

                        <Row gutter={[16, 16]}>
                            <Col span={8}>
                                <ThreeDCard>
                                    <Statistic
                                        title="Điểm trung bình"
                                        value={selectedEmployeeStats.monthlyReviews.reduce((sum, review) => 
                                            sum + review.overallScore, 0) / selectedEmployeeStats.monthlyReviews.length}
                                        suffix="/10"
                                        precision={1}
                                    />
                                </ThreeDCard>
                            </Col>
                            <Col span={8}>
                                <ThreeDCard>
                                    <Statistic
                                        title="Mục tiêu hoàn thành"
                                        value={selectedEmployeeStats.monthlyReviews.reduce((sum, review) => 
                                            sum + review.results.filter(r => r.actualValue >= r.targetValue).length, 0)}
                                        suffix={`/${selectedEmployeeStats.monthlyReviews.reduce((sum, review) => 
                                            sum + review.results.length, 0)}`}
                                    />
                                </ThreeDCard>
                            </Col>
                            <Col span={8}>
                                <ThreeDCard>
                                    <Statistic
                                        title="Tổng thưởng"
                                        value={selectedEmployeeStats.monthlyReviews.reduce((sum, review) => 
                                            sum + (review.bonus || 0), 0)}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    />
                                </ThreeDCard>
                            </Col>
                        </Row>

                        <Card title="Xu hướng điểm đánh giá" style={{ marginTop: 16 }}>
                            <Line
                                data={selectedEmployeeStats.monthlyReviews
                                    .filter(review => {
                                        if (statsViewType === 'current') {
                                            const currentMonth = dayjs().month() + 1;
                                            const currentYear = dayjs().year();
                                            return review.month === currentMonth && review.year === currentYear;
                                        }
                                        const reviewDate = dayjs(`${review.year}-${review.month}`);
                                        return reviewDate.isBetween(statsDateRange[0], statsDateRange[1], 'month', '[]');
                                    })
                                    .map(review => ({
                                        month: `${review.month}/${review.year}`,
                                        score: review.overallScore
                                    }))}
                                xField="month"
                                yField="score"
                                yAxis={{
                                    min: 0,
                                    max: 10,
                                }}
                            />
                        </Card>

                        <Card title="Chi tiết đánh giá theo mục tiêu" style={{ marginTop: 16 }}>
                            <Table
                                dataSource={selectedEmployeeStats.monthlyReviews
                                    .filter(review => {
                                        if (statsViewType === 'current') {
                                            const currentMonth = dayjs().month() + 1;
                                            const currentYear = dayjs().year();
                                            return review.month === currentMonth && review.year === currentYear;
                                        }
                                        const reviewDate = dayjs(`${review.year}-${review.month}`);
                                        return reviewDate.isBetween(statsDateRange[0], statsDateRange[1], 'month', '[]');
                                    })}
                                columns={[
                                    {
                                        title: 'Tháng',
                                        key: 'month',
                                        render: (_, record) => `${record.month}/${record.year}`
                                    },
                                    {
                                        title: 'Điểm tổng thể',
                                        dataIndex: 'overallScore',
                                        render: score => (
                                            <Tag color={score >= 8 ? 'success' : score >= 6 ? 'warning' : 'error'}>
                                                {score}/10
                                            </Tag>
                                        )
                                    },
                                    {
                                        title: 'Mục tiêu hoàn thành',
                                        key: 'completedGoals',
                                        render: (_, record) => (
                                            `${record.results.filter(r => r.actualValue >= r.targetValue).length}/${record.results.length}`
                                        )
                                    },
                                    {
                                        title: 'Thưởng',
                                        dataIndex: 'bonus',
                                        render: bonus => bonus?.toLocaleString() || 0
                                    },
                                    {
                                        title: 'Chi tiết',
                                        key: 'details',
                                        render: (_, record) => (
                                            <Button type="link" onClick={() => {
                                                Modal.info({
                                                    title: `Chi tiết đánh giá tháng ${record.month}/${record.year}`,
                                                    width: 800,
                                                    content: (
                                                        <div>
                                                            <Table
                                                                dataSource={record.results}
                                                                columns={[
                                                                    {
                                                                        title: 'Mục tiêu',
                                                                        dataIndex: 'goalTitle',
                                                                    },
                                                                    {
                                                                        title: 'Chỉ tiêu',
                                                                        dataIndex: 'targetValue',
                                                                    },
                                                                    {
                                                                        title: 'Thực tế',
                                                                        dataIndex: 'actualValue',
                                                                    },
                                                                    {
                                                                        title: 'Điểm',
                                                                        dataIndex: 'score',
                                                                    },
                                                                ]}
                                                                pagination={false}
                                                            />
                                                            <Divider />
                                                            <Paragraph>
                                                                <Text strong>Nhận xét: </Text>
                                                                {record.comment}
                                                            </Paragraph>
                                                        </div>
                                                    ),
                                                });
                                            }}>
                                                Xem chi tiết
                                            </Button>
                                        )
                                    },
                                ]}
                                pagination={false}
                            />
                        </Card>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default MonthlyPerformanceReview;
