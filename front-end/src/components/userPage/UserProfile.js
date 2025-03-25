import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Table, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import useRoleCheck from '../../hooks/useRoleCheck';
import { toast } from 'react-toastify';
import { notificationService } from '../../services/notificationService';

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userFormData, setUserFormData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const { userData } = useRoleCheck();
  const navigate = useNavigate();

  // Fetch user data and notifications
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        if (!userData || !userData._id) {
          console.log('Chưa có dữ liệu người dùng');
          return;
        }
        
        // Lấy thông tin chi tiết của user từ API
        const userResponse = await userService.getUserProfile();
        setUserInfo(userResponse);
        setUserFormData(userResponse);
        
        // Lấy thông báo của user
        const notificationsResponse = await notificationService.getAllNotifications();
        
        if (notificationsResponse && notificationsResponse.data) {
          const allNotifications = notificationsResponse.data.data || [];
          
          // Lọc thông báo dành cho tất cả hoặc phòng ban của nhân viên
          const userNotifications = allNotifications.filter(notification => {
            // Thông báo cho tất cả người dùng
            if (notification.target === 'all') return true;
            
            // Thông báo cho phòng ban của nhân viên
            if (notification.target === 'department' && 
                userData.employeeId && 
                userData.employeeId.departmentId && 
                notification.departmentId && 
                notification.departmentId._id === userData.employeeId.departmentId._id) {
              return true;
            }
            
            // Thông báo gửi trực tiếp cho người dùng cụ thể
            if (notification.target === 'specific' && 
                notification.recipients && 
                notification.recipients.includes(userData._id)) {
              return true;
            }
            
            return false;
          });
          
          // Sắp xếp thông báo theo thời gian giảm dần (mới nhất lên đầu)
          userNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setNotifications(userNotifications);
        }
        
        setError(null);
      } catch (err) {
        console.error('Lỗi khi lấy thông tin người dùng:', err);
        setError(err.message || 'Không thể lấy thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userData]);

  // Xử lý chuyển sang chế độ chỉnh sửa
  const handleEditMode = () => {
    setEditMode(true);
  };

  // Xử lý thay đổi trường dữ liệu
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Lưu thông tin cập nhật
  const handleSaveChanges = async () => {
    try {
      if (!userInfo || !userInfo._id) return;
      
      const response = await userService.updateUser(userInfo._id, userFormData);
      setUserInfo(response);
      setEditMode(false);
      toast.success('Cập nhật thông tin thành công');
    } catch (err) {
      console.error('Lỗi khi cập nhật thông tin:', err);
      toast.error('Không thể cập nhật thông tin');
    }
  };

  // Hủy chỉnh sửa
  const handleCancelEdit = () => {
    setUserFormData(userInfo);
    setEditMode(false);
  };

  // Đổi mật khẩu
  const navigateToChangePassword = () => {
    navigate('/change-password');
  };

  // Format ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <Container className="mt-4 d-flex justify-content-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col md={8}>
          <Card className="mb-4 shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4>Thông tin cá nhân</h4>
              {!editMode ? (
                <Button variant="primary" size="sm" onClick={handleEditMode}>
                  <i className="fas fa-edit"></i> Chỉnh sửa
                </Button>
              ) : (
                <div>
                  <Button variant="success" size="sm" className="me-2" onClick={handleSaveChanges}>
                    <i className="fas fa-save"></i> Lưu
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handleCancelEdit}>
                    <i className="fas fa-times"></i> Hủy
                  </Button>
                </div>
              )}
            </Card.Header>
            <Card.Body>
              {!userInfo ? (
                <Alert variant="info">Không có thông tin người dùng</Alert>
              ) : !editMode ? (
                <Row>
                  <Col md={6}>
                    <p><strong>Họ tên:</strong> {userInfo.fullName || 'Chưa cập nhật'}</p>
                    <p><strong>Email:</strong> {userInfo.email || 'Chưa cập nhật'}</p>
                    <p><strong>Số điện thoại:</strong> {userInfo.phone || 'Chưa cập nhật'}</p>
                    <p><strong>Ngày sinh:</strong> {formatDate(userInfo.birthDate)}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Địa chỉ:</strong> {userInfo.address || 'Chưa cập nhật'}</p>
                    <p><strong>Vị trí:</strong> {userInfo.position || 'Chưa cập nhật'}</p>
                    <p><strong>Vai trò:</strong> {userInfo.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}</p>
                    <p><strong>Ngày tham gia:</strong> {formatDate(userInfo.joinDate)}</p>
                  </Col>
                  <Col md={12} className="mt-3">
                    <Button variant="secondary" size="sm" onClick={navigateToChangePassword}>
                      <i className="fas fa-key"></i> Đổi mật khẩu
                    </Button>
                  </Col>
                </Row>
              ) : (
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Họ tên</Form.Label>
                        <Form.Control 
                          type="text" 
                          name="fullName" 
                          value={userFormData?.fullName || ''} 
                          onChange={handleInputChange} 
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control 
                          type="email" 
                          name="email" 
                          value={userFormData?.email || ''} 
                          onChange={handleInputChange} 
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Số điện thoại</Form.Label>
                        <Form.Control 
                          type="text" 
                          name="phone" 
                          value={userFormData?.phone || ''} 
                          onChange={handleInputChange} 
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Địa chỉ</Form.Label>
                        <Form.Control 
                          type="text" 
                          name="address" 
                          value={userFormData?.address || ''} 
                          onChange={handleInputChange} 
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Ngày sinh</Form.Label>
                        <Form.Control 
                          type="date" 
                          name="birthDate" 
                          value={userFormData?.birthDate ? new Date(userFormData.birthDate).toISOString().split('T')[0] : ''} 
                          onChange={handleInputChange} 
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Header>
              <h4>Thông báo của bạn</h4>
            </Card.Header>
            <Card.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {notifications && notifications.length > 0 ? (
                <>
                  {notifications.slice(0, 5).map((notification) => (
                    <Card 
                      key={notification._id} 
                      className={`mb-2 ${!notification.read ? 'border-primary' : ''}`}
                    >
                      <Card.Body>
                        <div>
                          <div className="d-flex align-items-center mb-2">
                            <Card.Title className="mb-0 me-2">{notification.title}</Card.Title>
                            {notification.target === 'all' && <Badge bg="success">Tất cả</Badge>}
                            {notification.target === 'department' && <Badge bg="info">Phòng ban</Badge>}
                            {notification.target === 'specific' && <Badge bg="primary">Cá nhân</Badge>}
                            {!notification.read && <Badge bg="warning" className="ms-2">Mới</Badge>}
                          </div>
                          <Card.Text>{notification.content}</Card.Text>
                          <small className="text-muted">
                            {formatDate(notification.createdAt)}
                          </small>
                          {notification.departmentId && notification.departmentId.name && (
                            <small className="text-muted ms-2">
                              Phòng ban: {notification.departmentId.name}
                            </small>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  ))}

                  {notifications.length > 5 && (
                    <div className="text-center mt-3">
                      <Button 
                        variant="primary" 
                        onClick={() => navigate('/user-notifications')}
                      >
                        Xem tất cả {notifications.length} thông báo
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <Alert variant="info">Bạn không có thông báo nào</Alert>
              )}
            </Card.Body>
          </Card>
          
          <Card className="mt-4 shadow-sm">
            <Card.Header>
              <h4>Thông tin nhanh</h4>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button variant="outline-primary" onClick={() => navigate('/user-attendance')}>
                  <i className="fas fa-calendar-check"></i> Xem điểm danh
                </Button>
                {userInfo?.employeeId && (
                  <Button variant="outline-info" onClick={() => navigate('/user-leave')}>
                    <i className="fas fa-umbrella-beach"></i> Xem ngày nghỉ
                  </Button>
                )}
                {userInfo?.employeeId && (
                  <Button variant="outline-success" onClick={() => navigate('/user-salary')}>
                    <i className="fas fa-money-bill-wave"></i> Xem lương
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile; 