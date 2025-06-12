import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Table, Progress, Select, Tabs, Space, Statistic, Button, Divider, Tag, Avatar, Tooltip } from 'antd';
import { BarChartOutlined, UserOutlined, ArrowUpOutlined, ArrowDownOutlined, TeamOutlined, CheckCircleOutlined, ClockCircleOutlined, FileTextOutlined, AlertOutlined } from '@ant-design/icons';
import { Line, Bar, Pie } from '@ant-design/charts';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const TeamPerformance = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [timeRange, setTimeRange] = useState('week');
    const [activeTab, setActiveTab] = useState('overview');

    // Mock data
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setTeams([
                {
                    id: 1,
                    name: 'Phát triển phần mềm',
                    members: 8,
                    performance: 92,
                    tasks: { completed: 38, inProgress: 7, pending: 3, total: 48 },
                    workHours: 312,
                    attendance: 95,
                    projectsDelivered: 4,
                    projectsOngoing: 2,
                    trend: 'up',
                    trendValue: 5,
                    leadName: 'Nguyễn Văn A',
                    leadAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
                    overHours: 12,
                    ratings: { quality: 93, speed: 88, communication: 90 }
                },
                {
                    id: 2,
                    name: 'Thiết kế UI/UX',
                    members: 5,
                    performance: 88,
                    tasks: { completed: 22, inProgress: 4, pending: 2, total: 28 },
                    workHours: 190,
                    attendance: 92,
                    projectsDelivered: 3,
                    projectsOngoing: 1,
                    trend: 'up',
                    trendValue: 2,
                    leadName: 'Trần Thị B',
                    leadAvatar: 'https://randomuser.me/api/portraits/women/2.jpg',
                    overHours: 5,
                    ratings: { quality: 94, speed: 85, communication: 89 }
                },
                {
                    id: 3,
                    name: 'Kiểm thử',
                    members: 6,
                    performance: 85,
                    tasks: { completed: 25, inProgress: 8, pending: 3, total: 36 },
                    workHours: 228,
                    attendance: 90,
                    projectsDelivered: 2,
                    projectsOngoing: 3,
                    trend: 'down',
                    trendValue: 1,
                    leadName: 'Lê Văn C',
                    leadAvatar: 'https://randomuser.me/api/portraits/men/3.jpg',
                    overHours: 8,
                    ratings: { quality: 90, speed: 82, communication: 87 }
                },
                {
                    id: 4,
                    name: 'Hạ tầng & DevOps',
                    members: 4,
                    performance: 90,
                    tasks: { completed: 18, inProgress: 3, pending: 1, total: 22 },
                    workHours: 156,
                    attendance: 98,
                    projectsDelivered: 1,
                    projectsOngoing: 2,
                    trend: 'up',
                    trendValue: 3,
                    leadName: 'Phạm Thị D',
                    leadAvatar: 'https://randomuser.me/api/portraits/women/4.jpg',
                    overHours: 10,
                    ratings: { quality: 92, speed: 91, communication: 84 }
                },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    // Performance time series data
    const performanceData = [
        { week: 'Tuần 1', team: 'Phát triển phần mềm', value: 85 },
        { week: 'Tuần 2', team: 'Phát triển phần mềm', value: 88 },
        { week: 'Tuần 3', team: 'Phát triển phần mềm', value: 90 },
        { week: 'Tuần 4', team: 'Phát triển phần mềm', value: 92 },
        { week: 'Tuần 1', team: 'Thiết kế UI/UX', value: 82 },
        { week: 'Tuần 2', team: 'Thiết kế UI/UX', value: 84 },
        { week: 'Tuần 3', team: 'Thiết kế UI/UX', value: 87 },
        { week: 'Tuần 4', team: 'Thiết kế UI/UX', value: 88 },
        { week: 'Tuần 1', team: 'Kiểm thử', value: 87 },
        { week: 'Tuần 2', team: 'Kiểm thử', value: 85 },
        { week: 'Tuần 3', team: 'Kiểm thử', value: 84 },
        { week: 'Tuần 4', team: 'Kiểm thử', value: 85 },
        { week: 'Tuần 1', team: 'Hạ tầng & DevOps', value: 85 },
        { week: 'Tuần 2', team: 'Hạ tầng & DevOps', value: 87 },
        { week: 'Tuần 3', team: 'Hạ tầng & DevOps', value: 88 },
        { week: 'Tuần 4', team: 'Hạ tầng & DevOps', value: 90 },
    ];

    // Task completion data
    const taskCompletionData = [
        { team: 'Phát triển phần mềm', type: 'Hoàn thành', value: 38 },
        { team: 'Phát triển phần mềm', type: 'Đang làm', value: 7 },
        { team: 'Phát triển phần mềm', type: 'Chờ xử lý', value: 3 },
        { team: 'Thiết kế UI/UX', type: 'Hoàn thành', value: 22 },
        { team: 'Thiết kế UI/UX', type: 'Đang làm', value: 4 },
        { team: 'Thiết kế UI/UX', type: 'Chờ xử lý', value: 2 },
        { team: 'Kiểm thử', type: 'Hoàn thành', value: 25 },
        { team: 'Kiểm thử', type: 'Đang làm', value: 8 },
        { team: 'Kiểm thử', type: 'Chờ xử lý', value: 3 },
        { team: 'Hạ tầng & DevOps', type: 'Hoàn thành', value: 18 },
        { team: 'Hạ tầng & DevOps', type: 'Đang làm', value: 3 },
        { team: 'Hạ tầng & DevOps', type: 'Chờ xử lý', value: 1 },
    ];

    // Rating data for radar chart
    const qualityRatings = teams.map(team => ({
        team: team.name,
        type: 'Chất lượng',
        value: team.ratings.quality
    }));

    const speedRatings = teams.map(team => ({
        team: team.name,
        type: 'Tốc độ',
        value: team.ratings.speed
    }));

    const communicationRatings = teams.map(team => ({
        team: team.name,
        type: 'Giao tiếp',
        value: team.ratings.communication
    }));

    const ratingData = [...qualityRatings, ...speedRatings, ...communicationRatings];

    // Line chart configuration
    const lineConfig = {
        data: performanceData,
        xField: 'week',
        yField: 'value',
        seriesField: 'team',
        yAxis: {
            title: {
                text: 'Điểm hiệu suất',
            },
            min: 80,
            max: 100,
        },
        legend: {
            position: 'top',
        },
        smooth: true,
        animation: {
            appear: {
                animation: 'path-in',
                duration: 1000,
            },
        },
    };

    // Bar chart configuration
    const barConfig = {
        data: taskCompletionData,
        isStack: true,
        xField: 'value',
        yField: 'team',
        seriesField: 'type',
        label: {
            position: 'middle',
            layout: [
                {
                    type: 'interval-adjust-position',
                },
                {
                    type: 'interval-hide-overlap',
                },
                {
                    type: 'adjust-color',
                },
            ],
        },
        color: ['#52c41a', '#1890ff', '#faad14'],
    };

    // Team performance table columns
    const columns = [
        {
            title: 'Đội nhóm',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Space>
                    <Avatar
                        style={{ backgroundColor: '#1890ff' }}
                        icon={<TeamOutlined />}
                    />
                    <div>
                        <Text strong>{text}</Text>
                        <div>
                            <Text type="secondary">Trưởng nhóm: {record.leadName}</Text>
                        </div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Hiệu suất',
            key: 'performance',
            dataIndex: 'performance',
            sorter: (a, b) => a.performance - b.performance,
            render: (performance, record) => (
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Progress
                        percent={performance}
                        size="small"
                        status={
                            performance >= 90 ? 'success' :
                                performance >= 80 ? 'normal' :
                                    performance >= 70 ? 'active' : 'exception'
                        }
                    />
                    <Space size="small">
                        {record.trend === 'up' ? (
                            <Tag color="green">
                                <ArrowUpOutlined /> +{record.trendValue}%
                            </Tag>
                        ) : (
                            <Tag color="red">
                                <ArrowDownOutlined /> -{record.trendValue}%
                            </Tag>
                        )}
                    </Space>
                </Space>
            ),
        },
        {
            title: 'Công việc',
            dataIndex: 'tasks',
            key: 'tasks',
            render: (tasks) => (
                <Space direction="vertical" size={0}>
                    <Text>Hoàn thành: {tasks.completed}/{tasks.total}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        Đang làm: {tasks.inProgress}, Chờ xử lý: {tasks.pending}
                    </Text>
                    <Progress
                        percent={Math.round((tasks.completed / tasks.total) * 100)}
                        size="small"
                        showInfo={false}
                    />
                </Space>
            ),
        },
        {
            title: 'Chuyên cần',
            dataIndex: 'attendance',
            key: 'attendance',
            sorter: (a, b) => a.attendance - b.attendance,
            render: (attendance) => (
                <Progress
                    type="circle"
                    percent={attendance}
                    width={50}
                    format={(percent) => `${percent}%`}
                    status={
                        attendance >= 95 ? 'success' :
                            attendance >= 90 ? 'normal' :
                                attendance >= 85 ? 'active' : 'exception'
                    }
                />
            ),
        },
        {
            title: 'Dự án',
            key: 'projects',
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Text>Đã hoàn thành: {record.projectsDelivered}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        Đang triển khai: {record.projectsOngoing}
                    </Text>
                </Space>
            ),
        },
        {
            title: 'Giờ làm việc',
            dataIndex: 'workHours',
            key: 'workHours',
            sorter: (a, b) => a.workHours - b.workHours,
            render: (hours, record) => (
                <div>
                    <Statistic value={hours} suffix="giờ" valueStyle={{ fontSize: '16px' }} />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        Thêm giờ: {record.overHours} giờ
                    </Text>
                </div>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: () => (
                <Button type="link">Chi tiết</Button>
            ),
        },
    ];

    // Tabs for different views
    const items = [
        {
            key: 'overview',
            label: 'Tổng quan',
            children: (
                <div>
                    <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                        <Col span={24}>
                            <Card title="Hiệu suất theo thời gian">
                                <Line {...lineConfig} />
                            </Card>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                            <Card title="Hoàn thành công việc">
                                <Bar {...barConfig} />
                            </Card>
                        </Col>
                        <Col xs={24} md={12}>
                            <Card title="Đánh giá hiệu suất các mặt">
                                <Pie
                                    data={ratingData}
                                    angleField='value'
                                    colorField='type'
                                    radius={0.8}
                                    innerRadius={0.5}
                                    label={{
                                        type: 'outer',
                                        content: '{name}: {value}',
                                    }}
                                    interactions={[
                                        {
                                            type: 'element-selected',
                                        },
                                        {
                                            type: 'element-active',
                                        },
                                    ]}
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>
            ),
        },
        {
            key: 'teams',
            label: 'Hiệu suất các đội',
            children: (
                <Table
                    columns={columns}
                    dataSource={teams}
                    rowKey="id"
                    loading={loading}
                    pagination={false}
                />
            ),
        },
        {
            key: 'individual',
            label: 'Hiệu suất cá nhân',
            children: (
                <Card>
                    <Paragraph>
                        <Text strong>Tính năng đang phát triển</Text>
                        <br />
                        Hiệu suất cá nhân sẽ hiển thị thông tin chi tiết về sự đóng góp, hiệu quả và năng suất của từng nhân viên trong đội nhóm.
                    </Paragraph>
                </Card>
            ),
        },
    ];

    return (
        <div>
            <Title level={2}>
                <BarChartOutlined /> Hiệu suất đội nhóm
            </Title>
            <Divider />

            <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Hiệu suất trung bình"
                            value={Math.round(teams.reduce((sum, team) => sum + team.performance, 0) / teams.length)}
                            suffix="%"
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<ArrowUpOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Tổng số công việc hoàn thành"
                            value={teams.reduce((sum, team) => sum + team.tasks.completed, 0)}
                            valueStyle={{ color: '#1890ff' }}
                            prefix={<CheckCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Tổng giờ làm việc"
                            value={teams.reduce((sum, team) => sum + team.workHours, 0)}
                            suffix="giờ"
                            valueStyle={{ color: '#faad14' }}
                            prefix={<ClockCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Tổng dự án hoàn thành"
                            value={teams.reduce((sum, team) => sum + team.projectsDelivered, 0)}
                            valueStyle={{ color: '#52c41a' }}
                            prefix={<FileTextOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Card
                title="Phân tích hiệu suất đội nhóm"
                extra={
                    <Select
                        defaultValue="week"
                        style={{ width: 150 }}
                        onChange={setTimeRange}
                    >
                        <Option value="week">Theo tuần</Option>
                        <Option value="month">Theo tháng</Option>
                        <Option value="quarter">Theo quý</Option>
                        <Option value="year">Theo năm</Option>
                    </Select>
                }
            >
                <Tabs
                    activeKey={activeTab}
                    items={items}
                    onChange={setActiveTab}
                />
            </Card>
        </div>
    );
};

export default TeamPerformance;
