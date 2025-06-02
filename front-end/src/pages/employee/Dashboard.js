import React, { useState } from 'react';
import { Row, Col, Typography, Calendar, Badge, Statistic, Timeline, Button, Card, Space, Tooltip } from 'antd';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  CalendarOutlined,
  FieldTimeOutlined,
  CoffeeOutlined,
  BellOutlined,
  UserOutlined,
  TeamOutlined
} from '@ant-design/icons';
import ThreeDCard from '../../components/3d/ThreeDCard';
import ThreeDButton from '../../components/3d/ThreeDButton';
import ThreeDStatCard from '../../components/3d/ThreeDStatCard';
import ThreeDContainer from '../../components/3d/ThreeDContainer';
import { getCurrentUser } from '../../utils/auth';

const { Title, Text } = Typography;

const EmployeeDashboard = () => {
  const [currentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const user = getCurrentUser();

  // Mock data for employee stats
  const stats = [
    {
      title: 'Số ngày đi làm',
      value: 22,
      suffix: '/23',
      icon: <CheckCircleOutlined />,
      color: '#52c41a'
    },
    {
      title: 'Đi làm muộn',
      value: 2,
      suffix: ' lần',
      icon: <ClockCircleOutlined />,
      color: '#faad14'
    },
    {
      title: 'Nghỉ phép',
      value: 1,
      suffix: '/3',
      icon: <CoffeeOutlined />,
      color: '#1890ff'
    },
    {
      title: 'Tổng giờ làm',
      value: 176,
      suffix: 'h',
      icon: <FieldTimeOutlined />,
      color: '#722ed1'
    }
  ];

  // Mock data for calendar
  const getListData = (value) => {
    const day = value.date();
    const month = value.month();
    
    // Giả lập dữ liệu cho tháng hiện tại
    if (month === currentDate.getMonth()) {
      if (day === 1) {
        return [{ type: 'success', content: 'Đi làm đúng giờ' }];
      }
      if (day === 5) {
        return [{ type: 'warning', content: 'Đi làm muộn 15 phút' }];
      }
      if (day === 12) {
        return [{ type: 'error', content: 'Nghỉ phép' }];
      }
      if (day === 18) {
        return [{ type: 'warning', content: 'Đi làm muộn 10 phút' }];
      }
      if (day < currentDate.getDate() && ![1, 5, 12, 18].includes(day) && ![0, 6].includes(value.day())) {
        return [{ type: 'success', content: 'Đi làm đúng giờ' }];
      }
    }
    return [];
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {listData.map((item, index) => (
          <li key={index}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  // Mock shift schedule
  const shifts = [
    { day: 'Thứ 2', hours: '08:00 - 17:00', type: 'Ca hành chính' },
    { day: 'Thứ 3', hours: '08:00 - 17:00', type: 'Ca hành chính' },
    { day: 'Thứ 4', hours: '08:00 - 17:00', type: 'Ca hành chính' },
    { day: 'Thứ 5', hours: '08:00 - 17:00', type: 'Ca hành chính' },
    { day: 'Thứ 6', hours: '08:00 - 17:00', type: 'Ca hành chính' },
    { day: 'Thứ 7', hours: '-', type: 'Nghỉ' },
    { day: 'Chủ nhật', hours: '-', type: 'Nghỉ' },
  ];

  // Thông tin lịch sử điểm danh
  const attendanceHistory = [
    { date: '15/11/2023', checkIn: '07:58', checkOut: '17:05', hours: '9h07m', status: 'success' },
    { date: '14/11/2023', checkIn: '08:05', checkOut: '17:15', hours: '9h10m', status: 'success' },
    { date: '13/11/2023', checkIn: '08:25', checkOut: '17:30', hours: '9h05m', status: 'warning' },
    { date: '12/11/2023', checkIn: '-', checkOut: '-', hours: '-', status: 'error' },
    { date: '11/11/2023', checkIn: '07:50', checkOut: '17:00', hours: '9h10m', status: 'success' },
  ];

  // Thông báo công việc
  const notifications = [
    { time: '10:00', content: 'Cuộc họp báo cáo tiến độ dự án A', color: '#1890ff' },
    { time: '14:30', content: 'Đào tạo nhân viên mới', color: '#52c41a' },
    { time: '16:00', content: 'Deadline nộp báo cáo tuần', color: '#ff4d4f' },
  ];

  return (
    <ThreeDContainer>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <div className="welcome-section glass-effect" style={{ 
            padding: '24px',
            marginBottom: '24px', 
            borderRadius: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            background: 'linear-gradient(135deg, rgba(24, 144, 255, 0.1), rgba(24, 144, 255, 0.05))',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(24, 144, 255, 0.2)'
          }}>
            <div>
              <Title level={3} style={{ margin: 0, fontWeight: '700' }}>
                <span className="blue-gradient-text">Chào, {user?.name || 'Nhân viên'}!</span>
              </Title>
              <Text style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.65)' }}>
                Hôm nay: {currentDate.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </Text>
            </div>
            <ThreeDButton type="primary" icon={<FieldTimeOutlined />} className="btn-blue-theme">
              Check-in/out
            </ThreeDButton>
          </div>
        </Col>

        {/* Stats Cards */}
        {stats.map((stat, index) => (
          <Col key={index} xs={24} sm={12} lg={6}>
            <ThreeDStatCard
              title={stat.title}
              value={stat.value}
              suffix={stat.suffix}
              icon={stat.icon}
              color={stat.color}
              style={{ borderTop: `3px solid ${stat.color}` }}
            />
          </Col>
        ))}

        {/* Check-in Card */}
        <Col xs={24} lg={8}>
          <ThreeDCard title="Điểm danh hôm nay" className="card-blue-theme">
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Statistic 
                title="Trạng thái hiện tại"
                value="Đã điểm danh"
                valueStyle={{ color: '#52c41a', fontSize: '24px', fontWeight: 'bold' }}
                prefix={<CheckCircleOutlined />}
              />
              <div style={{ margin: '24px 0' }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic 
                      title="Giờ vào" 
                      value="08:45" 
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic 
                      title="Giờ ra (dự kiến)" 
                      value="17:45" 
                      valueStyle={{ color: '#ff4d4f' }}
                    />
                  </Col>
                </Row>
              </div>
              <Space>
                <ThreeDButton type="primary" icon={<FieldTimeOutlined />} className="btn-blue-theme">
                  Check-out
                </ThreeDButton>
                <ThreeDButton icon={<CoffeeOutlined />}>
                  Đăng ký nghỉ phép
                </ThreeDButton>
              </Space>
            </div>
          </ThreeDCard>
        </Col>

        {/* Shift Schedule Card */}
        <Col xs={24} lg={16}>
          <ThreeDCard 
            title="Lịch làm việc tuần này" 
            extra={<CalendarOutlined style={{ color: '#1890ff' }} />}
            className="card-blue-theme"
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '12px 8px', borderBottom: '1px solid #f0f0f0', textAlign: 'left' }}>Ngày</th>
                    <th style={{ padding: '12px 8px', borderBottom: '1px solid #f0f0f0', textAlign: 'left' }}>Giờ làm</th>
                    <th style={{ padding: '12px 8px', borderBottom: '1px solid #f0f0f0', textAlign: 'left' }}>Loại ca</th>
                  </tr>
                </thead>
                <tbody>
                  {shifts.map((shift, index) => (
                    <tr key={index}>
                      <td style={{ padding: '12px 8px', borderBottom: '1px solid #f0f0f0' }}>{shift.day}</td>
                      <td style={{ padding: '12px 8px', borderBottom: '1px solid #f0f0f0', color: shift.hours === '-' ? '#bfbfbf' : 'inherit' }}>{shift.hours}</td>
                      <td style={{ padding: '12px 8px', borderBottom: '1px solid #f0f0f0' }}>
                        {shift.type === 'Nghỉ' ? (
                          <Badge status="default" text="Nghỉ" />
                        ) : (
                          <Badge status="processing" text={shift.type} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ThreeDCard>
        </Col>

        {/* Attendance History */}
        <Col xs={24} lg={12}>
          <ThreeDCard 
            title="Lịch sử điểm danh" 
            extra={<ThreeDButton type="link" style={{ color: '#1890ff' }}>Xem tất cả</ThreeDButton>}
            className="card-blue-theme"
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '12px 8px', borderBottom: '1px solid #f0f0f0', textAlign: 'left' }}>Ngày</th>
                    <th style={{ padding: '12px 8px', borderBottom: '1px solid #f0f0f0', textAlign: 'left' }}>Check-in</th>
                    <th style={{ padding: '12px 8px', borderBottom: '1px solid #f0f0f0', textAlign: 'left' }}>Check-out</th>
                    <th style={{ padding: '12px 8px', borderBottom: '1px solid #f0f0f0', textAlign: 'left' }}>Tổng giờ</th>
                    <th style={{ padding: '12px 8px', borderBottom: '1px solid #f0f0f0', textAlign: 'left' }}>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceHistory.map((record, index) => (
                    <tr key={index}>
                      <td style={{ padding: '12px 8px', borderBottom: '1px solid #f0f0f0' }}>{record.date}</td>
                      <td style={{ padding: '12px 8px', borderBottom: '1px solid #f0f0f0', color: record.checkIn === '-' ? '#bfbfbf' : 'inherit' }}>{record.checkIn}</td>
                      <td style={{ padding: '12px 8px', borderBottom: '1px solid #f0f0f0', color: record.checkOut === '-' ? '#bfbfbf' : 'inherit' }}>{record.checkOut}</td>
                      <td style={{ padding: '12px 8px', borderBottom: '1px solid #f0f0f0', color: record.hours === '-' ? '#bfbfbf' : 'inherit' }}>{record.hours}</td>
                      <td style={{ padding: '12px 8px', borderBottom: '1px solid #f0f0f0' }}>
                        {record.status === 'success' && <Badge status="success" text="Đúng giờ" />}
                        {record.status === 'warning' && <Badge status="warning" text="Đi muộn" />}
                        {record.status === 'error' && <Badge status="error" text="Vắng mặt" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ThreeDCard>
        </Col>

        {/* Notifications */}
        <Col xs={24} lg={12}>
          <ThreeDCard 
            title="Lịch trình hôm nay" 
            extra={<BellOutlined style={{ color: '#1890ff' }} />}
            className="card-blue-theme"
          >
            <Timeline
              mode="left"
              items={notifications.map(item => ({
                color: item.color,
                label: item.time,
                children: item.content
              }))}
            />
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <ThreeDButton type="primary" icon={<TeamOutlined />} className="btn-blue-theme">
                Xem lịch phòng ban
              </ThreeDButton>
            </div>
          </ThreeDCard>
        </Col>
      </Row>
    </ThreeDContainer>
  );
};

export default EmployeeDashboard; 
