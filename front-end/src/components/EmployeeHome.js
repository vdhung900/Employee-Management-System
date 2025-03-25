import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Tabs, Tab, Badge, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserClock,
  faBell,
  faSignOutAlt,
  faUser,
  faCalendarAlt,
  faIdCard,
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons';
import UserAttendance from './userPage/UserAttendance';
import { useAuth } from '../contexts/AuthContext';
import useUser from '../hooks/useUser';
import { notificationService } from '../services/notificationService';
import { toast } from 'react-toastify';
import UserNotifications from './userPage/UserNotifications';

const EmployeeHome = () => {
  const [activeTab, setActiveTab] = useState('attendance');
  const [notifications, setNotifications] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { user, loading, error } = useUser();

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getAllNotifications();
      const allNotifications = response.data.data || [];
      
      // Lọc thông báo dành cho tất cả hoặc phòng ban của nhân viên
      const userNotifications = allNotifications.filter(notification => {
        // Thông báo cho tất cả người dùng
        if (notification.target === 'all') return true;
        
        // Thông báo cho phòng ban của nhân viên
        if (notification.target === 'department' && 
            user && 
            user.employeeId && 
            user.employeeId.departmentId && 
            notification.departmentId && 
            notification.departmentId._id === user.employeeId.departmentId._id) {
          return true;
        }
        
        // Thông báo gửi trực tiếp cho người dùng cụ thể
        if (notification.target === 'specific' && 
            notification.recipients && 
            notification.recipients.includes(user._id)) {
          return true;
        }
        
        return false;
      });
      
      // Sắp xếp theo thời gian tạo giảm dần (mới nhất lên đầu)
      userNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Không thể tải thông báo');
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <h3 className="mt-3">Đang tải...</h3>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error}
          <div className="mt-3">
            <Button variant="primary" onClick={handleLogout}>Đăng nhập lại</Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-3">
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <img 
                    src={user?.employeeId?.avatar || "/avatar-placeholder.jpg"} 
                    alt="Avatar" 
                    style={{ width: '60px', height: '60px', borderRadius: '50%', marginRight: '15px' }}
                  />
                  <div>
                    <h4>{user?.employeeId?.fullName || 'Nhân viên'}</h4>
                    <p className="text-muted mb-0">
                      {user?.employeeId?.departmentId?.name || 'Chưa có phòng ban'} - {user?.employeeId?.position || 'Chưa có chức vụ'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <Button variant="outline-primary" className="me-2" onClick={() => navigate('/user-profile')}>
                    <FontAwesomeIcon icon={faIdCard} className="me-2" />
                    Trang cá nhân
                  </Button>
                  <Button variant="outline-danger" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                    Đăng xuất
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
            justify
          >
            <Tab 
              eventKey="attendance" 
              title={
                <span>
                  <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                  Chấm công
                </span>
              }
            >
              <UserAttendance />
            </Tab>
            
            <Tab 
              eventKey="notifications" 
              title={
                <span>
                  <FontAwesomeIcon icon={faBell} className="me-2" />
                  Thông báo
                  {notifications.length > 0 && (
                    <Badge bg="danger" pill className="ms-2">
                      {notifications.length}
                    </Badge>
                  )}
                </span>
              }
            >
              <UserNotifications />
            </Tab>
            
            <Tab 
              eventKey="profile" 
              title={
                <span>
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  Thông tin cá nhân
                </span>
              }
            >
              <Card>
                <Card.Body>
                  <Card.Title className="d-flex justify-content-between align-items-center">
                    <div>
                      <FontAwesomeIcon icon={faUser} className="me-2" />
                      Thông tin cá nhân
                    </div>
                  </Card.Title>
                  
                  <Row className="mt-3">
                    <Col md={4} className="text-center mb-4">
                      <img 
                        src={user?.employeeId?.avatar || "/avatar-placeholder.jpg"} 
                        alt="Avatar" 
                        style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    </Col>
                    
                    <Col md={8}>
                      <Row className="mb-2">
                        <Col sm={4}><strong>Họ và tên:</strong></Col>
                        <Col sm={8}>{user?.employeeId?.fullName}</Col>
                      </Row>
                      
                      <Row className="mb-2">
                        <Col sm={4}><strong>Email:</strong></Col>
                        <Col sm={8}>{user?.email}</Col>
                      </Row>
                      
                      <Row className="mb-2">
                        <Col sm={4}><strong>Số điện thoại:</strong></Col>
                        <Col sm={8}>{user?.employeeId?.phone || 'Chưa cập nhật'}</Col>
                      </Row>
                      
                      <Row className="mb-2">
                        <Col sm={4}><strong>Ngày sinh:</strong></Col>
                        <Col sm={8}>
                          {user?.employeeId?.dob 
                            ? new Date(user.employeeId.dob).toLocaleDateString('vi-VN')
                            : 'Chưa cập nhật'}
                        </Col>
                      </Row>
                      
                      <Row className="mb-2">
                        <Col sm={4}><strong>Địa chỉ:</strong></Col>
                        <Col sm={8}>{user?.employeeId?.address || 'Chưa cập nhật'}</Col>
                      </Row>
                      
                      <Row className="mb-2">
                        <Col sm={4}><strong>Phòng ban:</strong></Col>
                        <Col sm={8}>{user?.employeeId?.departmentId?.name || 'Chưa cập nhật'}</Col>
                      </Row>
                      
                      <Row className="mb-2">
                        <Col sm={4}><strong>Chức vụ:</strong></Col>
                        <Col sm={8}>{user?.employeeId?.position || 'Chưa cập nhật'}</Col>
                      </Row>
                      
                      <Row className="mb-2">
                        <Col sm={4}><strong>Ngày bắt đầu:</strong></Col>
                        <Col sm={8}>
                          {user?.employeeId?.startDate 
                            ? new Date(user.employeeId.startDate).toLocaleDateString('vi-VN')
                            : 'Chưa cập nhật'}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default EmployeeHome; 