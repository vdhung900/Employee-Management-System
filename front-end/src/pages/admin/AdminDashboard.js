import React, { useState } from 'react';
import { Row, Col, Typography, DatePicker, Select, Space, Badge, Table, Avatar, Progress, Tooltip, Card } from 'antd';
import {
    UserOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    FileExclamationOutlined,
    TeamOutlined,
    CalendarOutlined,
    AlertOutlined,
    RiseOutlined,
    LineChartOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    FieldTimeOutlined
} from '@ant-design/icons';
import ThreeDCard from '../../components/3d/ThreeDCard';
import ThreeDButton from '../../components/3d/ThreeDButton';
import ThreeDStatCard from '../../components/3d/ThreeDStatCard';
import ThreeDContainer from '../../components/3d/ThreeDContainer';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const AdminDashboard = () => {
    const [dateRange, setDateRange] = useState(null);
    const [department, setDepartment] = useState('all');

    // Mock data for stats
    const stats = [
        {
            title: 'Tổng nhân viên',
            value: 285,
            icon: <TeamOutlined />,
            color: '#1890ff',
            trend: '+3%',
            trendUp: true
        },
        {
            title: 'Đi làm hôm nay',
            value: 241,
            icon: <CheckCircleOutlined />,
            color: '#52c41a',
            trend: '+5%',
            trendUp: true
        },
        {
            title: 'Vắng mặt',
            value: 44,
            icon: <FileExclamationOutlined />,
            color: '#faad14',
            trend: '-2%',
            trendUp: false
        },
        {
            title: 'Đi làm muộn',
            value: 23,
            icon: <ClockCircleOutlined />,
            color: '#ff4d4f',
            trend: '-8%',
            trendUp: false
        }
    ];

    // Mock data for attendance
    const attendanceData = [
        {
            key: '1',
            name: 'Nguyễn Văn A',
            department: 'IT',
            checkIn: '08:02',
            checkOut: '17:30',
            status: 'present',
            avatar: 'https://xsgames.co/randomusers/avatar.php?g=male&id=1'
        },
        {
            key: '2',
            name: 'Trần Thị B',
            department: 'HR',
            checkIn: '08:45',
            checkOut: '17:15',
            status: 'late',
            avatar: 'https://xsgames.co/randomusers/avatar.php?g=female&id=2'
        },
        {
            key: '3',
            name: 'Lê Văn C',
            department: 'Finance',
            checkIn: '08:15',
            checkOut: '17:00',
            status: 'present',
            avatar: 'https://xsgames.co/randomusers/avatar.php?g=male&id=3'
        },
        {
            key: '4',
            name: 'Phạm Thị D',
            department: 'Marketing',
            checkIn: null,
            checkOut: null,
            status: 'absent',
            avatar: 'https://xsgames.co/randomusers/avatar.php?g=female&id=4'
        },
        {
            key: '5',
            name: 'Hoàng Văn E',
            department: 'IT',
            checkIn: '07:55',
            checkOut: '17:45',
            status: 'present',
            avatar: 'https://xsgames.co/randomusers/avatar.php?g=male&id=5'
        }
    ];

    const attendanceColumns = [
        {
            title: 'Nhân viên',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Space>
                    <Avatar src={record.avatar} icon={<UserOutlined />} />
                    <span style={{ fontWeight: '500' }}>{text}</span>
                </Space>
            ),
        },
        {
            title: 'Phòng ban',
            dataIndex: 'department',
            key: 'department',
        },
        {
            title: 'Giờ vào',
            dataIndex: 'checkIn',
            key: 'checkIn',
            render: (text, record) => {
                if (!text) return <span style={{ color: '#ff4d4f' }}>Chưa điểm danh</span>;
                const isLate = record.status === 'late';
                return <span style={{ color: isLate ? '#ff4d4f' : '#52c41a' }}>{text}</span>;
            }
        },
        {
            title: 'Giờ ra',
            dataIndex: 'checkOut',
            key: 'checkOut',
            render: text => text || '-'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: status => {
                if (status === 'present') {
                    return <span className="modern-badge badge-success">Đi làm</span>;
                } else if (status === 'late') {
                    return <span className="modern-badge badge-warning">Đi muộn</span>;
                } else {
                    return <span className="modern-badge badge-error">Vắng mặt</span>;
                }
            }
        },
    ];

    // Mock data for department attendance
    const departmentAttendance = [
        { department: 'IT', present: 94, absent: 6 },
        { department: 'HR', present: 82, absent: 18 },
        { department: 'Finance', present: 88, absent: 12 },
        { department: 'Marketing', present: 76, absent: 24 },
        { department: 'Operations', present: 91, absent: 9 },
    ];

    // Current time for the dashboard
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const currentDate = new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="staggered-animation-container" style={{ 
            width: '100%',
            padding: '16px',
            boxSizing: 'border-box',
            overflowX: 'hidden'
        }}>
            {/* Welcome Section */}
            <div className="welcome-section glass-effect" style={{
                padding: '24px',
                marginBottom: '24px',
                borderRadius: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                background: 'linear-gradient(135deg, #e3f2fd, rgba(82, 196, 26, 0.05))',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(82, 196, 26, 0.2)',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <div>
                    <Title level={3} style={{ margin: 0, fontWeight: '700' }}>
                        <span className="green-gradient-text">Chào buổi sáng, Admin!</span>
                    </Title>
                    <Text style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.65)' }}>
                        Hôm nay là {currentDate}, {currentTime}
                    </Text>
                </div>
                <Space>
                    <RangePicker
                        value={dateRange}
                        onChange={setDateRange}
                        style={{ borderRadius: '8px' }}
                    />
                    <Select
                        defaultValue="all"
                        style={{ width: 120, borderRadius: '8px' }}
                        onChange={setDepartment}
                        options={[
                            { value: 'all', label: 'Tất cả' },
                            { value: 'it', label: 'IT' },
                            { value: 'hr', label: 'HR' },
                            { value: 'finance', label: 'Finance' },
                            { value: 'marketing', label: 'Marketing' },
                        ]}
                    />
                </Space>
            </div>

            {/* Stats Cards */}
            <Row gutter={[24, 24]} style={{ width: '100%', margin: 0 }}>
                {stats.map((stat, index) => (
                    <Col key={index} xs={24} sm={12} lg={6}>
                        <ThreeDStatCard
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                            color={stat.color}
                            trend={stat.trend}
                            trendUp={stat.trendUp}
                            style={{ borderTop: `3px solid ${stat.color}` }}
                            className="card-green-theme"
                        />
                    </Col>
                ))}
            </Row>

            <Row gutter={[24, 24]} style={{ marginTop: '24px', width: '100%', margin: 0 }}>
                {/* Attendance Table */}
                <Col xs={24} lg={14}>
                    <ThreeDCard
                        title="Điểm danh hôm nay"
                        extra={<FileExclamationOutlined style={{ color: '#52c41a' }} />}
                        className="card-green-theme"
                    >
                        <Table
                            dataSource={attendanceData}
                            columns={attendanceColumns}
                            pagination={false}
                            size="middle"
                            className="modern-table"
                            style={{ borderRadius: '12px', overflow: 'hidden' }}
                        />
                    </ThreeDCard>
                </Col>

                {/* Department Attendance */}
                <Col xs={24} lg={10}>
                    <ThreeDCard
                        title="Tỷ lệ đi làm theo phòng ban"
                        extra={<LineChartOutlined style={{ color: '#52c41a' }} />}
                        className="card-green-theme"
                    >
                        {departmentAttendance.map((dept, index) => (
                            <div key={index} style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <Text strong>{dept.department}</Text>
                                    <Text>{dept.present}%</Text>
                                </div>
                                <Progress
                                    percent={dept.present}
                                    strokeColor={{
                                        '0%': '#52c41a',
                                        '100%': '#95de64',
                                    }}
                                    size="small"
                                    status="active"
                                />
                            </div>
                        ))}
                    </ThreeDCard>
                </Col>
            </Row>

            <style jsx>{`
                .staggered-animation-container {
                    width: 100%;
                    max-width: 100%;
                    overflow-x: hidden;
                }

                .hover-highlight:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
                }

                .bg-warning-theme {
                    background-color: rgba(250, 173, 20, 0.05);
                }

                tr.bg-green-theme td {
                    background-color: rgba(82, 196, 26, 0.05) !important;
                }

                .modern-filter-container {
                    position: relative;
                }

                .modern-filter-container::after {
                    content: '';
                    position: absolute;
                    bottom: -4px;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: linear-gradient(90deg, var(--primary-color), transparent);
                    border-radius: 2px;
                }

                /* Add responsive styles */
                @media screen and (max-width: 768px) {
                    .staggered-animation-container {
                        padding: 12px;
                    }
                    
                    .welcome-section {
                        padding: 16px;
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
