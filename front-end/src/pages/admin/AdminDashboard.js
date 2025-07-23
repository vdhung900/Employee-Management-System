import React, {useEffect, useState} from 'react';
import {
    Row,
    Col,
    Typography,
    DatePicker,
    Select,
    Space,
    Badge,
    Table,
    Avatar,
    Progress,
    Tooltip,
    Card,
    message
} from 'antd';
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
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import SystemService from "../../services/SystemService";
import {useLoading} from "../../contexts/LoadingContext";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const AdminDashboard = () => {
    const [dateRange, setDateRange] = useState(null);
    const [department, setDepartment] = useState('all');
    const { showLoading, hideLoading } = useLoading();
    const [stats, setStats] = useState([]);
    const [departmentCount, setDepartmentCount] = useState(0);
    const [pendingRequests, setPendingRequests] = useState(0);
    const [attendanceData, setAttendanceData] = useState([]);
    const [employeeByDepartment, setEmployeeByDepartment] = useState([]);
    const [requestStatusData, setRequestStatusData] = useState([]);
    const [goalProgress, setGoalProgress] = useState(0);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                showLoading();
                const response = await SystemService.getDashboardAdmin();
                if (response.success) {
                    const data = response.data;
                    setStats([
                        {
                            title: 'Tổng nhân viên',
                            value: data.totalEmployees,
                            icon: <TeamOutlined />,
                            color: '#1890ff',
                            trend: '',
                            trendUp: true
                        },
                        {
                            title: 'Đi làm hôm nay',
                            value: data.presentToday,
                            icon: <CheckCircleOutlined />,
                            color: '#52c41a',
                            trend: '',
                            trendUp: true
                        },
                        {
                            title: 'Vắng mặt',
                            value: data.absentToday,
                            icon: <FileExclamationOutlined />,
                            color: '#faad14',
                            trend: '',
                            trendUp: false
                        },
                        {
                            title: 'Đi làm muộn',
                            value: data.lateToday,
                            icon: <ClockCircleOutlined />,
                            color: '#ff4d4f',
                            trend: '',
                            trendUp: false
                        }
                    ]);
                    setDepartmentCount(data.totalDepartments);
                    setPendingRequests(data.pendingRequests);
                    setAttendanceData(
                        (data.attendanceList || []).map((item, idx) => ({
                            key: idx,
                            name: item.name,
                            department: item.department,
                            checkIn: item.checkIn,
                            checkOut: item.checkOut,
                            status: item.status,
                            avatar: item.avatar
                        }))
                    );
                    setEmployeeByDepartment(
                        (data.employeeByDepartment || []).map(dep => ({
                            department: dep.departmentName,
                            count: dep.employeeCount
                        }))
                    );
                    setRequestStatusData(
                        (data.requestStatusData || []).map(req => ({
                            name: req.status,
                            value: req.count
                        }))
                    );
                    setGoalProgress(data.goalProgress);
                    setNotifications(
                        (data.notifications || []).map(n => ({
                            id: n.id,
                            content: n.content,
                            time: new Date(n.createdAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })
                        }))
                    );
                }
            } catch (e) {
                message.error(e.message);
            } finally {
                hideLoading();
            }
        };
        fetchData();
    }, []);

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

    const COLORS = ['#1890ff', '#52c41a', '#ff4d4f'];

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

            {/* Stats Cards mở rộng */}
            <Row gutter={[32, 32]} style={{ width: '100%', margin: 0, marginBottom: 32 }}>
                {stats.map((stat, index) => (
                    <Col key={index} xs={24} sm={12} lg={4} style={{ marginBottom: 16 }}>
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
                {/* Thêm StatCard phòng ban */}
                <Col xs={24} sm={12} lg={4} style={{ marginBottom: 16 }}>
                    <ThreeDStatCard
                        title="Phòng ban"
                        value={departmentCount}
                        icon={<TeamOutlined />}
                        color="#722ed1"
                        trend="+1"
                        trendUp={true}
                        style={{ borderTop: '3px solid #722ed1' }}
                        className="card-green-theme"
                    />
                </Col>
                {/* Thêm StatCard yêu cầu chờ duyệt */}
                <Col xs={24} sm={12} lg={4} style={{ marginBottom: 16 }}>
                    <ThreeDStatCard
                        title="Yêu cầu chờ duyệt"
                        value={pendingRequests}
                        icon={<FileExclamationOutlined />}
                        color="#fa541c"
                        trend="+2"
                        trendUp={true}
                        style={{ borderTop: '3px solid #fa541c' }}
                        className="card-green-theme"
                    />
                </Col>
            </Row>

            <Row gutter={[32, 32]} style={{ marginTop: 0, width: '100%', margin: 0 }}>
                {/* Attendance Table */}
                <Col xs={24} lg={10} style={{ marginBottom: 32 }}>
                    <ThreeDCard
                        title={<><FileExclamationOutlined style={{ marginRight: 8, color: '#52c41a' }} />Điểm danh hôm nay</>}
                        extra={null}
                        className="card-green-theme"
                        style={{ marginBottom: 24, padding: 24 }}
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

                {/* Department Attendance + Biểu đồ nhân viên theo phòng ban */}
                <Col xs={24} lg={7} style={{ marginBottom: 32 }}>
                    <ThreeDCard
                        title={<><BarChart width={20} height={20}><Bar dataKey="count" fill="#1890ff" /></BarChart><span style={{ marginLeft: 8 }}>Nhân viên theo phòng ban</span></>}
                        extra={null}
                        className="card-green-theme"
                        style={{ marginBottom: 24, padding: 24 }}
                    >
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={employeeByDepartment}>
                                <XAxis dataKey="department" />
                                <YAxis allowDecimals={false} />
                                <RechartsTooltip />
                                <Bar dataKey="count" fill="#1890ff" radius={[8,8,0,0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ThreeDCard>
                    <ThreeDCard
                        title={<><RiseOutlined style={{ color: '#faad14', marginRight: 8 }} />Hiệu suất mục tiêu tháng</>}
                        extra={null}
                        className="card-green-theme"
                        style={{ marginTop: 16, padding: 24 }}
                    >
                        <Text strong>Đã hoàn thành {goalProgress}% mục tiêu tháng</Text>
                        <Progress percent={goalProgress} status="active" strokeColor="#faad14" style={{ marginTop: 8 }} />
                    </ThreeDCard>
                </Col>

                {/* Biểu đồ yêu cầu theo trạng thái + Thông báo */}
                <Col xs={24} lg={7} style={{ marginBottom: 32 }}>
                    <ThreeDCard
                        title={<><PieChart width={20} height={20}><Pie dataKey="value" data={requestStatusData} cx={10} cy={10} outerRadius={10} fill="#1890ff" /></PieChart><span style={{ marginLeft: 8 }}>Yêu cầu theo trạng thái</span></>}
                        extra={null}
                        className="card-green-theme"
                        style={{ marginBottom: 24, padding: 24 }}
                    >
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie
                                    data={requestStatusData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={60}
                                    label
                                >
                                    {requestStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend />
                                <RechartsTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </ThreeDCard>
                    <ThreeDCard
                        title={<><AlertOutlined style={{ color: '#faad14', marginRight: 8 }} />Thông báo mới nhất</>}
                        extra={null}
                        className="card-green-theme"
                        style={{ marginTop: 16, padding: 24 }}
                    >
                        <ul style={{ paddingLeft: 16, margin: 0 }}>
                            {notifications.map(n => (
                                <li key={n.id} style={{ marginBottom: 8 }}>
                                    <Text>{n.content}</Text>
                                    <br />
                                    <Text type="secondary" style={{ fontSize: 12 }}>{n.time}</Text>
                                </li>
                            ))}
                        </ul>
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
