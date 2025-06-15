import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    Layout,
    Menu,
    theme,
    Avatar,
    Dropdown,
    Badge,
    Space,
    Switch,
    Typography,
    Tag,
    message,
    Tooltip
} from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    CalendarOutlined,
    FormOutlined,
    MessageOutlined,
    FileTextOutlined,
    QuestionCircleOutlined,
    UserOutlined,
    LogoutOutlined,
    BulbOutlined,
    BellOutlined,
    ClockCircleOutlined, PullRequestOutlined, TeamOutlined
} from '@ant-design/icons';
import { logout, getCurrentUser } from '../utils/auth';
import ThreeDButton from '../components/3d/ThreeDButton';
import ThreeDContainer from '../components/3d/ThreeDContainer';
import '../components/3d/ThreeDStyles.css';

const { Header, Sider, Content, Footer } = Layout;
const { Title } = Typography;

// Định nghĩa theme màu (có thể lấy từ login hoặc fix cứng)
const colorTheme = {
    siderBg: 'linear-gradient(135deg, #1976d2 0%, #90caf9 100%)',
    headerBg: '#fff',
    headerText: '#222',
    contentBg: '#fff',
    contentText: '#222',
    border: '1px solid #f0f0f0',
    cardShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    avatarBg: '#52c41a',
    tagBg: '#e6fffb',
    tagText: '#389e0d',
    footerBg: 'transparent',
    footerText: 'rgba(0,0,0,0.65)'
};

const MainLayout = () => {
    const [color, setColor] = useState(colorTheme.siderBg);
    const [collapsed, setCollapsed] = useState(false);
    const [currentUser, setCurrentUser] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    useEffect(() => {
        const role = localStorage.getItem('role');
        setCurrentUser(role);
        setColor(colorTheme.siderBg);
    }, []);

    const handleMenuClick = ({ key }) => {
        navigate(key);
    };

    const handleLogout = () => {
        logout();
        message.success('Đã đăng xuất thành công');
        navigate('/login');
    };

    const userMenuItems = [
        {
            key: '/employee/profile',
            label: 'Hồ sơ cá nhân',
            icon: <UserOutlined />,
            onClick: () => navigate('/employee/profile'),
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            label: 'Đăng xuất',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: handleLogout,
        },
    ];

    const notificationItems = [
        {
            key: '1',
            label: 'Your leave request has been approved',
            onClick: () => navigate('/employee/leave-request'),
        },

    ];

    const getMenuItems = () => {
        const adminMenuItems = [
            {
                key: '/admin/dashboard',
                icon: <DashboardOutlined />,
                label: 'Dashboard',
            },
            {
                key: '/admin/request-manage',
                icon: <PullRequestOutlined />,
                label: 'Thống kê requests',
            },
            {
                key: '/admin/account-request',
                icon: <UserOutlined />,
                label: 'Yêu cầu tài khoản',
            },
            {
                key: '/admin/setting',
                icon: <BulbOutlined />,
                label: 'Cài đặt hệ thống',
            },
            {
                key: '/admin/category',
                icon: <TeamOutlined />,
                label: 'Danh mục',
            },
            {
                key: '/admin/admin-account',
                icon: <UserOutlined />,
                label: 'Quản lý tài khoản',
            },
        ];

        const employeeMenuItems = [
            {
                key: '/employee/dashboard',
                icon: <DashboardOutlined />,
                label: 'Dashboard',
            },
            {
                key: '/employee/attendance-review',
                icon: <ClockCircleOutlined />,
                label: 'Chấm công',
            },
            {
                key: '/employee/calender',
                icon: <CalendarOutlined />,
                label: 'Lịch',
            },
            {
                key: '/employee/overtime',
                icon: <ClockCircleOutlined />,
                label: 'Làm thêm giờ',
            },
            {
                key: '/employee/requests',
                icon: <PullRequestOutlined />,
                label: 'Yêu cầu',
            },
            {
                key: '/employee/payroll',
                icon: <FileTextOutlined />,
                label: 'Bảng lương',
            },
            {
                key: '/employee/payroll-management',
                icon: <FileTextOutlined />,
                label: 'Quản lý lương',
            },
            {
                key: '/employee/reports',
                icon: <FileTextOutlined />,
                label: 'Báo cáo',
            },
            {
                key: '/employee/staff-management',
                icon: <UserOutlined />,
                label: 'Quản lý nhân viên',
            },
            {
                key: '/employee/team-management',
                icon: <UserOutlined />,
                label: 'Quản lý nhóm',
            },
            {
                key: '/employee/team-performance',
                icon: <DashboardOutlined />,
                label: 'Hiệu suất nhóm',
            },
            {
                key: '/employee/help',
                icon: <QuestionCircleOutlined />,
                label: 'Trợ giúp',
            },
        ];

        // Return menu items based on user role
        if (currentUser === 'admin') {
            return adminMenuItems;
        } else {
            return employeeMenuItems;
        }
    };

    // Page title based on current route
    const getPageTitle = () => {
        if (location.pathname.includes('/dashboard')) return 'Dashboard';
        if (location.pathname.includes('/profile')) return 'Thông tin cá nhân';
        if (location.pathname.includes('/attendance')) return 'Chấm công';
        if (location.pathname.includes('/schedule')) return 'My Schedule';
        if (location.pathname.includes('/overtime')) return 'Làm thêm giờ';
        if (location.pathname.includes('/leave-request')) return 'Leave Requests';
        if (location.pathname.includes('/notifications')) return 'Thông báo';
        if (location.pathname.includes('/chat')) return 'Internal Chat';
        if (location.pathname.includes('/payroll')) return 'My Payroll';
        if (location.pathname.includes('/help')) return 'Help Center';
        if (location.pathname.includes('/admin-account')) return 'Thông tin tài khoản';
        return '';
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                width={260}
                collapsedWidth={80}
                style={{
                    boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
                    background: colorTheme.siderBg,
                    padding: 0,
                    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
                }}
            >
                <div style={{
                    height: 80,
                    margin: collapsed ? '24px 0 16px 0' : '24px 0 16px 0',
                    padding: collapsed ? '0' : '0 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div
                            style={{
                                width: '48px',
                                height: '48px',
                                backgroundColor: 'white',
                                borderRadius: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#52c41a',
                                marginRight: '16px'
                            }}
                        >
                            E
                        </div>
                        <div>
                            <div
                                style={{
                                    margin: 0,
                                    lineHeight: '1.2',
                                    color: '#fff',
                                    fontWeight: '600',
                                    fontSize: '20px'
                                }}
                            >
                                Tên nhân viên
                            </div>
                            <div
                                style={{
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontSize: '13px',
                                    marginTop: '2px'
                                }}
                            >
                                Employee Management System
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sider-menu-wrapper" style={{
                    padding: collapsed ? '0 8px' : '0 20px',
                    height: 'auto',
                    overflow: 'visible',
                    marginTop: 20,
                    paddingBottom: 20
                }}>
                    <Menu
                        mode="inline"
                        selectedKeys={[location.pathname]}
                        defaultSelectedKeys={[location.pathname]}
                        items={getMenuItems()}
                        onClick={handleMenuClick}
                        style={{
                            background: 'transparent',
                            borderRight: 'none',
                            borderRadius: '12px',
                            fontWeight: '500',
                            paddingTop: '8px',
                            paddingBottom: '8px',
                        }}
                        theme="dark"
                    />
                </div>
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: '0 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: colorTheme.headerBg,
                        color: colorTheme.headerText,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        zIndex: 999,
                        height: '72px',
                        borderBottom: colorTheme.border
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Tooltip title={collapsed ? "Mở menu" : "Thu gọn menu"}>
                            <ThreeDButton
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '14px',
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    color: colorTheme.headerText,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'rgba(25, 118, 210, 0.08)'
                                }}
                            />
                        </Tooltip>
                        <div style={{ marginLeft: 28 }}>
                            <div className="header-title-gradient">
                                {getPageTitle()}
                            </div>
                        </div>
                    </div>
                    <Space size="large" align="center">
                        <Tag
                            color={colorTheme.tagBg}
                            style={{
                                padding: '6px 16px',
                                borderRadius: '50px',
                                boxShadow: '0 2px 5px rgba(25, 118, 210, 0.08)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '15px',
                                color: colorTheme.tagText,
                                background: colorTheme.tagBg,
                                fontWeight: 500
                            }}
                        >
                            <ClockCircleOutlined style={{ color: '#1976d2' }} /> Trạng thái chấm công
                        </Tag>
                        <Dropdown
                            menu={{
                                items: notificationItems,
                            }}
                            placement="bottomRight"
                            arrow
                            trigger={['click']}
                        >
                            <Badge count={3} overflowCount={99}>
                                <ThreeDButton type="text" icon={<BellOutlined style={{ color: '#1976d2' }} />}
                                    size="large" />
                            </Badge>
                        </Dropdown>
                        <Dropdown
                            menu={{
                                items: userMenuItems,
                            }}
                            placement="bottomRight"
                            arrow
                            trigger={['click']}
                        >
                            <Space
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                    padding: '7px 16px',
                                    borderRadius: '50px',
                                    transition: 'all 0.3s ease',
                                }}
                                className="user-dropdown"
                            >
                                <Avatar
                                    style={{
                                        background: 'linear-gradient(135deg, #1976d2 0%, #90caf9 100%)',
                                        color: '#fff',
                                        fontWeight: 600,
                                        boxShadow: '0 2px 5px rgba(25, 118, 210, 0.15)'
                                    }}
                                    icon={<UserOutlined />}
                                />
                                <span
                                    style={{
                                        display: 'inline-block',
                                        color: '#1976d2',
                                        fontWeight: 600
                                    }}
                                >
                                    {currentUser?.name || 'Nhân viên'}
                                </span>
                            </Space>
                        </Dropdown>
                    </Space>
                </Header>

                <Content
                    style={{
                        padding: '5px',
                        height: '60px', // 72px header + 50px footer
                        background: 'white',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        overflow: 'auto',
                    }}
                >
                    <Outlet />
                </Content>

                {/*<Footer*/}
                {/*    style={{*/}
                {/*        textAlign: 'center',*/}
                {/*        background: colorTheme.footerBg,*/}
                {/*        color: colorTheme.footerText,*/}
                {/*        padding: '12px 50px',*/}
                {/*        height: '50px'*/}
                {/*    }}*/}
                {/*>*/}
                {/*    <div style={{*/}
                {/*        display: 'flex',*/}
                {/*        justifyContent: 'space-between',*/}
                {/*        alignItems: 'center',*/}
                {/*        fontSize: '14px'*/}
                {/*    }}>*/}
                {/*        <div>Employee Management System ©{new Date().getFullYear()}</div>*/}
                {/*        <div>Version 1.0.0</div>*/}
                {/*    </div>*/}
                {/*</Footer>*/}
            </Layout>
            <style jsx>{`
                .user-dropdown:hover {
                    background-color: rgba(82, 196, 26, 0.15);
                    transform: translateY(-2px);
                }

                .ant-menu-dark .ant-menu-item-selected {
                    background-color: rgba(255, 255, 255, 0.2);
                    border-radius: 8px;
                    font-weight: 600;
                }

                .ant-menu-dark .ant-menu-item {
                    margin: 4px 0;
                    border-radius: 8px;
                }

                .ant-menu-dark .ant-menu-item:hover {
                    background-color: rgba(255, 255, 255, 0.15);
                }

                .sider-menu-wrapper {
                    height: calc(100vh - 160px);
                    overflow-y: auto;
                    margin-top: 20px;
                    padding-bottom: 20px;
                }

                .sider-menu-wrapper::-webkit-scrollbar {
                    width: 4px;
                }

                .sider-menu-wrapper::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                }

                .header-title-gradient {
                    font-size: 1.75rem;
                    font-weight: 700;
                    background: linear-gradient(90deg, #1976d2, #90caf9);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    text-fill-color: transparent;
                    letter-spacing: 1px;
                    line-height: 1.1;
                }

                .header-subtitle {
                    font-size: 1.05rem;
                    color: #90caf9;
                    font-weight: 500;
                    margin-top: 0px;
                    letter-spacing: 0.2px;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                .animated-content {
                    animation: fadeIn 0.5s ease-in-out;
                }
            `}</style>
        </Layout>
    );
};

export default MainLayout; 